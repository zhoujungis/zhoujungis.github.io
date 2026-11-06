/**
 * en/articles.js — English editions of selected posts.
 *
 * Why a separate data module instead of translating in the backend: the Chinese
 * posts live in the Django database and are edited there, while these are
 * hand-written English editions published at /en/article/<slug>/. Keeping them
 * as static data means the English site can ship without a schema migration,
 * and the pre-renderer writes real HTML for crawlers (see scripts/prerender.mjs).
 *
 * Contract per entry:
 *   slug      — URL segment under /en/article/ and the key the zh page links to
 *               (same slug as the Chinese post, so hreflang pairs are obvious)
 *   zhSlug    — Chinese edition this is translated from
 *   html      — article body (already HTML; safe because it is authored here,
 *               not fetched from the API)
 */
export const EN_ARTICLES = [
  {
    slug: 'aidevops-terminal-client',
    zhSlug: 'aidevops-terminal-client',
    topicSlug: 'projects',
    title: 'aidevops: an AI DevOps copilot that lives in your terminal',
    excerpt:
      'An open-source terminal client that stitches requirements, commits, tests, bugs and releases into one traceable chain — with an LLM layer that can only propose, never act.',
    date: '2026-10-16',
    readingTime: 17,
    html: `
<p>A few days ago I published <strong><a href="https://pypi.org/project/aidevops/" rel="noopener noreferrer" target="_blank">aidevops</a></strong> — the terminal client for an AI DevOps / QA copilot — to PyPI: <code>pipx install aidevops</code> and you are done. The source is on <a href="https://github.com/zhoujungis/ai_devops" rel="noopener noreferrer" target="_blank">GitHub</a> under MIT.</p>

<p>This post walks through what it solves, how the data flows, how the risk score is computed, what the AI actually does (and why it is kept in a cage), how each command is used, and what I deliberately left out.</p>

<ul>
<li>What problem it solves: the developer-data archipelago</li>
<li>Architecture: thin client, thick server</li>
<li>How data gets in: dual cursors and idempotent ingestion</li>
<li>Module attribution: pinning a commit to a module</li>
<li><code>explain</code>: the full chain behind one commit</li>
<li>The risk engine: ten signals, each one explainable</li>
<li>AI analysis: five agents, evidence validation, full tracing</li>
<li>Proposals and audit: the AI suggests, a human decides</li>
<li>Install and a five-minute walkthrough</li>
<li>Scripting and CI</li>
<li>Engineering: tests, types, release flow</li>
<li>Status, limits and roadmap</li>
</ul>

<h2>The developer-data archipelago</h2>

<p>A team produces a lot of development data every day: requirements live in Jira, commits in GitHub, test results in CI, bugs in a defect tracker, release records in a pipeline. All of it exists — <strong>scattered across systems that do not know each other</strong>.</p>

<p>So every developer does the same manual work: which modules did this change touch? What bugs did those modules have historically? Are they covered by tests? If we ship this release, where is the risk concentrated? The answers are all in the systems, but assembling them means five browser tabs, three exported reports and a memory test.</p>

<p>aidevops exists to <strong>link the chain requirement → code → test → bug → release</strong>, and then answer four concrete questions:</p>

<ul>
<li>Where is the <strong>risk</strong> in a commit (which module, which signal fired, and why);</li>
<li><strong>What should be regression-tested</strong> (related historical bugs, candidate test list);</li>
<li>Where a production incident <strong>most likely originated</strong> (trace back to requirement and release);</li>
<li>What the AI <strong>suggests</strong> after reading the data (generate tests, flag suspicious spots, propose an investigation path).</li>
</ul>

<p>The terminal client puts those answers where the developer already is. Nobody should have to switch to a browser to read one risk report.</p>

<h2>Architecture: thin client, thick server</h2>

<p>One sentence: <strong><code>aidevops</code> is a terminal client (CLI + full-screen TUI), not a server.</strong> It contains no business logic; every capability is an HTTP call to a backend (Django + PostgreSQL + Redis, with pgvector for vector search).</p>

<p>The boundary is deliberate, for three reasons:</p>

<ol>
<li><strong>Data and logic belong on the server.</strong> The correlation engine, the risk model and the agents are compute-heavy and need complete data. Commit history, test ledgers and bug lists run into hundreds of thousands of rows; putting them in a client would turn the product into a toy.</li>
<li><strong>Credential safety.</strong> Git credentials and model API keys live on the server, encrypted with Fernet. The client only holds its own access token (stored in the user config directory with mode 0600).</li>
<li><strong>Multiple frontends.</strong> CLI, TUI and any future web UI all consume the same REST API (<code>/api/v1</code>), so logic cannot drift.</li>
</ol>

<p>If you install the client without a backend, <code>login</code> fails on the first step. That is architecture, not a bug. Two ways to run the backend locally: <code>cp .env.example .env</code> then <code>docker compose up -d --build</code> (Swagger at <code>/api/docs/</code>), or <code>make install &amp;&amp; make migrate &amp;&amp; make run</code> plus <code>make worker</code> / <code>make beat</code> for Celery.</p>

<p>Client stack: <strong>Typer</strong> (CLI), <strong>Textual</strong> (full-screen TUI), <strong>Rich</strong> (tables and output), <strong>httpx</strong> (HTTP). Pure Python, no compiled extensions, Python ≥ 3.11.</p>

<h2>How data gets in: dual cursors and idempotent ingestion</h2>

<p>Without data everything downstream is an empty state. Ingestion is the least glamorous part of the system, and it has three channels:</p>

<p><strong>GitHub REST sync.</strong> An incremental cursor and a backfill cursor are maintained separately — new commits go through the incremental path, the first sync of a repository walks the full history. Rate limits are handled with backoff, because GitHub's limits are a fact of life rather than an exception.</p>

<p><strong>Webhook ingestion.</strong> Push, CI results and issue changes arrive in real time, behind two gates: <strong>HMAC-SHA256 signature verification</strong> (the request really came from GitHub) and <strong><code>delivery_id</code> idempotency</strong> (GitHub redelivers events; the same delivery must not produce two records).</p>

<p><strong>Celery beat reconciliation.</strong> Webhooks get lost — network blips, restarts — so a scheduled job periodically reconciles and guarantees eventual consistency.</p>

<p>Module attribution and test correlation happen asynchronously after ingestion. The trade-off is explicit: <strong>ingestion prefers slow over lost or duplicated</strong>, because every downstream correlation assumes the data is trustworthy.</p>

<h2>Module attribution: pinning a commit to a module</h2>

<p>The first step of correlation is answering "which modules did this commit touch". It sounds trivial and is actually a parsing problem: <code>src/auth/</code> clearly belongs to auth, but who owns <code>utils/date.py</code>? Does a change under <code>tests/</code> count as touching a business module?</p>

<p>The answer is a <strong>three-level attribution strategy</strong>, applied in priority order:</p>

<ol>
<li><strong>Overrides</strong> (highest): an explicit path → module mapping configured by the repository maintainer;</li>
<li><strong>Source-root inference</strong>: without an override, infer from language conventions and repository layout (top-level directories under <code>src/</code> or <code>lib/</code>);</li>
<li><strong>Fallback</strong>: anything else lands in an explicit fallback bucket instead of floating.</li>
</ol>

<p>The important half is the last sentence: <strong>every attribution carries a citable reason</strong>. "This file belongs to auth because it matched the override <code>src/auth/**</code>" — attribution is not a guess, it can be opened and inspected. Risk scoring and regression candidates are all built on this traceable layer.</p>

<h2><code>explain</code>: the full chain behind one commit</h2>

<p><strong><code>aidevops explain &lt;sha&gt;</code></strong> is the signature command. Give it a commit SHA and it returns the commit's place in the development chain:</p>

<ul>
<li><strong>Requirement</strong>: which requirement (or requirement cluster) this change serves;</li>
<li><strong>Module impact</strong>: which modules changed, and how central each one is;</li>
<li><strong>Regression candidates</strong>: tests and bugs historically entangled with those modules;</li>
<li><strong>Historical bugs</strong>: what went wrong in the same area before, and in what pattern;</li>
<li><strong>Release</strong>: which release contains this commit, and when its window is;</li>
<li><strong>Data gaps</strong>: which of the above <strong>have no data</strong>.</li>
</ul>

<p>The last point deserves emphasis: <strong><code>data_gaps</code> distinguishes "nothing was found" from "we have no data"</strong>. The fastest way for a tool to lose trust is to dress ignorance as a conclusion — in a repository that never ingested test results, "no regression candidates" must mean "unknown", not "safe". That is the product's honesty floor, and <code>explain</code> makes it a first-class output.</p>

<h2>The risk engine: ten signals, each one explainable</h2>

<p><strong><code>aidevops risk &lt;sha&gt;</code></strong> (and <code>aidevops module-risk &lt;id&gt;</code> for a module view) returns a normalised risk score. It is deliberately <strong>explainable</strong>: the ten signals are listed with their individual contributions, and the contributions sum exactly to the score.</p>

<table>
<thead><tr><th>Signal</th><th>What it measures</th></tr></thead>
<tbody>
<tr><td><code>change_volume</code></td><td>Size of the change (lines, files)</td></tr>
<tr><td><code>historical_bug_density</code></td><td>Historical bug density of the modules involved</td></tr>
<tr><td><code>test_failure_rate</code></td><td>Recent failure rate of the related tests</td></tr>
<tr><td><code>module_centrality</code></td><td>Centrality of the touched modules in the dependency graph</td></tr>
<tr><td><code>change_frequency</code></td><td>How often this area changes lately (hotspot detection)</td></tr>
<tr><td><code>coverage_gap</code></td><td>Coverage gap on the changed paths</td></tr>
<tr><td><code>open_high_severity_bugs</code></td><td>Open high-severity bugs on the modules</td></tr>
<tr><td><code>test_coverage_gap</code></td><td>Test coverage gap for the module</td></tr>
<tr><td><code>release_proximity</code></td><td>How close the next release is (risk is more expensive near the cut)</td></tr>
<tr><td><code>data_freshness_penalty</code></td><td>An honest penalty when the data is too stale to trust</td></tr>
</tbody>
</table>

<p>Three engineering decisions worth spelling out:</p>

<ul>
<li><strong>Weights are configuration, not code.</strong> The ten weights live on the server and can be tuned in Django admin without a redeploy.</li>
<li><strong>Three-level inheritance</strong>: defaults → organisation override → project override. A latency-sensitive team can raise <code>release_proximity</code>; a team with weak test infrastructure can emphasise <code>coverage_gap</code>.</li>
<li><strong>Contributions sum to the score.</strong> This is not decoration — it turns "I don't believe this number" into a concrete engineering question: find the largest contributor and inspect its input. A black-box score can never do that.</li>
</ul>

<h2>AI analysis: five agents, evidence validation, full tracing</h2>

<p>The AI layer answers "given all this data, can something be automated". Its structure is considerably more involved than "call an LLM".</p>

<p><strong>Pluggable providers.</strong> Model credentials are managed per organisation (<code>aidevops providers</code> / <code>provider-add</code> / <code>provider-verify</code>) over an OpenAI-compatible protocol, with presets for DeepSeek, Qwen and Ollama, and credentials encrypted with Fernet. Model keys belong on the server, exactly like Git PATs.</p>

<p><strong>Five built-in agents</strong>, each with an explicit input/output contract:</p>

<table>
<thead><tr><th>Agent</th><th>What it does</th></tr></thead>
<tbody>
<tr><td>Code Impact</td><td>Analyses the blast radius of a commit</td></tr>
<tr><td>Test Generation</td><td>Generates test cases along a scenario matrix (11 categories, not a shotgun blast)</td></tr>
<tr><td>Bug Investigation</td><td>Builds an evidence chain around one bug</td></tr>
<tr><td>Root Cause Analysis</td><td>Works backwards from symptoms to plausible root-cause areas</td></tr>
<tr><td>Requirement Analysis</td><td>Extracts verifiable acceptance points from requirement text</td></tr>
</tbody>
</table>

<p>Start one with <code>aidevops analyse -a test-generation --wait</code>; browse history with <code>analyses</code> / <code>job</code>. <strong><code>aidevops trace &lt;id&gt;</code></strong> is the debugging tool: every model call and tool call behind one analysis, with timings. The agent is not a black box.</p>

<p><strong><code>aidevops findings</code> / <code>finding &lt;id&gt;</code> / <code>triage &lt;id&gt; &lt;status&gt;</code></strong> form the workspace for AI findings. Every finding carries <strong>evidence references</strong>: whatever the model says must resolve back to real data (a commit, a bug, a test); unresolvable references never make it into the output. <code>triage</code> makes the disposition (open / confirmed / false positive) an explicit state transition, and that trail becomes team knowledge.</p>

<p><strong><code>aidevops tui</code></strong> is the full-screen dashboard (Textual): commit list, finding stream, suggestion queue — for people who would rather not memorise commands.</p>

<p><strong>Evidence validation</strong> is the hard constraint of this layer: every reference the model emits must resolve to real data, or it is dropped. That mechanically eliminates incidents like "the model hallucinated a bug that never existed".</p>

<p><strong>The tool surface is closed.</strong> The model can call 13 <strong>read-only</strong> tools, all forced through project scoping; no write operation appears in its tool list. The AI can see data but cannot touch state — which is the precondition for the next section.</p>

<h2>Proposals and audit: the AI suggests, a human decides</h2>

<p>Everything the AI produces is a proposal: a batch of generated tests, an investigation conclusion, a remediation suggestion. None of it takes effect by itself.</p>

<pre><code>aidevops proposals                 # pending proposals
aidevops approve &lt;id&gt;              # approve → executed by a fixed executor
aidevops reject &lt;id&gt;               # reject → discarded
</code></pre>

<p>Three hard rules:</p>

<ol>
<li><strong>Only <code>approve</code> executes.</strong> Execution lives in a hard-coded executor, not in the model. The model can propose; it cannot act.</li>
<li><strong>No approval means zero writes.</strong> There is no implicit adoption and no "execute by default, undo on objection".</li>
<li><strong>Everything lands in <code>AuditLog</code>.</strong> Who approved what and when, and what the executor did, is queryable with <code>aidevops audit</code>.</li>
</ol>

<p>For QA the trade-off is clear: <strong>the trust balance for letting AI mutate state is not there yet</strong>. Tests are a quality line of defence, and you do not put a black box that acts on its own on the line.</p>

<p>Multi-tenant safety follows the same logic: <strong>tenant id comes only from the URL</strong> (never inferred from the request body), non-member access returns 404 (without leaking existence), insufficient role returns 403, and every query goes through the single <code>scoped_queryset</code> entry point — leaving no room for "someone forgot the filter".</p>

<h2>Install and a five-minute walkthrough</h2>

<pre><code>pipx install aidevops        # recommended: isolated venv, command on PATH
# or
pip install aidevops
</code></pre>

<p>Login uses the <strong>GitHub device flow</strong>: type a code in the browser, never paste a password into a terminal. On remote servers and containers use <code>login --no-browser</code>.</p>

<pre><code>aidevops login                       # GitHub device-flow login
aidevops org-add "My Team"           # first run: create org (creator is admin)
aidevops projects                    # list projects (* marks the current one)
aidevops use qa-copilot-platform     # select a project for later commands
aidevops status                      # current backend / account / project
</code></pre>

<p><strong>Connecting a repository</strong> is the real entry point; skip it and <code>commits</code> / <code>risk</code> / <code>explain</code> are all empty states:</p>

<pre><code>aidevops connections                              # list Git credentials, note the connection id
aidevops connection-add -l my-github -t &lt;PAT&gt;     # private repos need repo read access
aidevops connection-verify &lt;connection-id&gt;        # verify the credential first
aidevops repo-add -c &lt;connection-id&gt; -f owner/repo  # register the repository
aidevops sync &lt;repository-id&gt; --wait              # pull history, ready when it returns
</code></pre>

<p>A <code>connection</code> is an <strong>organisation-level</strong> credential (managed by admins) and can register multiple repositories; <code>repo-update</code> adjusts the sync window and attribution depth.</p>

<p><strong>Upgrading</strong> is <code>aidevops upgrade</code>. The client compares itself against the latest PyPI release on every run and warns in red when behind (result cached for 24 hours; <code>AIDEVOPS_NO_UPDATE_CHECK=1</code> disables it). One guardrail: <code>upgrade</code> <strong>refuses to run</strong> inside a <code>pip install -e</code> development checkout, because that would silently replace your working tree with the released version — it tells you to <code>git pull</code> instead.</p>

<p>Config and tokens live in the user config directory (Windows <code>%LOCALAPPDATA%\\aidevops\\</code>, Linux <code>~/.config/aidevops/</code>), mode 0600.</p>

<h2>Scripting and CI</h2>

<p><code>--json</code> is a <strong>global</strong> option and goes before the subcommand:</p>

<pre><code>aidevops --json findings | jq '.[] | select(.severity == "critical")'
</code></pre>

<p>Two details exist for pipelines: in <code>--json</code> mode the upgrade notice goes to <strong>stderr</strong> so stdout stays clean, and <code>AIDEVOPS_JSON=1</code> is equivalent to the global flag. In CI, inject the token with <code>AIDEVOPS_TOKEN</code> (no interactive login) and point <code>AIDEVOPS_BASE_URL</code> at a test backend for integration checks.</p>

<p>A realistic CI flow: run <code>aidevops --json risk $GITHUB_SHA</code> in the pipeline; when the score crosses a threshold, post the regression candidate list as a PR comment. The risk engine and the AI suggestions become first-class citizens of the pipeline.</p>

<h2>Engineering: tests, types, release flow</h2>

<p>The client lives in the repository's <code>cli/</code> directory and the engineering setup is complete:</p>

<pre><code>python -m pytest          # 50 client tests, including Textual pilot TUI tests
python -m ruff check .
python -m mypy ai_devops_cli
</code></pre>

<p>The TUI is tested with Textual's pilot — keystroke flows and panel switches in a full-screen app are covered without manual clicking. The backend has <strong>569 tests</strong> (4 network cases skipped by default), none of which need the internet, so CI stays fast.</p>

<p>Every multi-tenant write path funnels through <code>scoped_queryset</code>, and combined with the URL-derived tenant semantics, tests can assert case by case that "tenant A can never see tenant B's data".</p>

<p>Releases to PyPI go through a <strong>tag-triggered trusted publishing</strong> workflow: push a tag → GitHub Actions builds → OIDC short-lived credentials upload to PyPI. No local packaging, no long-lived tokens.</p>

<h2>Status, limits and roadmap</h2>

<p>It is <strong>Alpha</strong> (Development Status 3), with a few explicit limits:</p>

<ul>
<li><strong>A backend is required.</strong> The client has no standalone value; trying the full flow means running the server first (docker compose or the local make targets).</li>
<li><strong>Single organisation, multiple projects</strong> is supported; the cross-organisation permission model is still converging.</li>
<li><strong>A real-LLM end-to-end smoke test</strong> is on the roadmap (agent tests currently use a stub model — the logic paths are covered, the output contract of real models is not yet verified).</li>
<li><strong>Module attribution</strong> wants one override configuration per repository; zero-config accuracy depends on the quality of source-root inference.</li>
</ul>

<p>Roadmap priority: finish the terminal detail views → real-LLM smoke test → production validation of the Celery worker shape.</p>

<p>If you are building a QA platform too, or you are interested in development-data correlation and caged AI agents, issues are welcome at <a href="https://github.com/zhoujungis/ai_devops" rel="noopener noreferrer" target="_blank">github.com/zhoujungis/ai_devops</a>. One line to install: <code>pipx install aidevops</code>.</p>
`,
  },
  {
    slug: 'interviewatlas-daily-crawl-llm-analysis',
    zhSlug: 'interviewatlas-daily-crawl-llm-analysis',
    topicSlug: 'projects',
    title: 'InterviewAtlas: crawling 30,000 interview reports and summarising them with an LLM',
    excerpt:
      'A zero-server data pipeline built on GitHub Actions: incremental crawlers for three sites, idempotent sharded storage, and a two-stage map-reduce over a free model quota — plus the two silent failures that kept it green while doing nothing.',
    date: '2026-11-05',
    readingTime: 28,
    html: `
<blockquote>
<p>Who this is for: people who want long-running data collection on GitHub Actions without renting a server; people designing a crawl → dedupe → render → LLM pipeline; people wondering how to spread one analysis across several days on a free quota.</p>
<p><strong>Bottom line first:</strong> the hard part of InterviewAtlas was never writing crawlers. It was three things — deciding what is new <em>before</em> sending the request, making the writes idempotent, and turning model calls into a budgeted, cacheable two-stage pipeline. What actually held it back was not anti-bot defences either: it was two silent failures — a collector that swallowed exceptions, and an analysis step blocked at compile time by a Python 3.11 f-string restriction.</p>
<p>Reading time: ~28 minutes · Level: advanced</p>
</blockquote>

<strong>Contents</strong>
<ul>
<li>Origin: turning scattered interview reports into a queryable dataset</li>
<li>Architecture: one collection chain, one analysis chain</li>
<li>Data model: one record, three layers of normalisation</li>
<li>Collection: three sites, three strategies</li>
<li>Incremental crawling: saving requests before deduplication</li>
<li>Storage and rendering: sharding, idempotency, write amplification</li>
<li>LLM summarisation: a two-stage map-reduce</li>
<li>Cache, budget and invalidation</li>
<li>GitHub Actions: an unattended pipeline</li>
<li>Postmortem one: "0 banks, 0 records" from Mianshiya</li>
<li>Postmortem two: analysis stuck at 0/237</li>
<li>Problem list: truncation, dirty characters, duplicates</li>
<li>Problem list: 100 MB, quota, a source going dark</li>
<li>Measured numbers and known limits</li>
<li>Closing</li>
</ul>
<hr>

<h2>Origin: turning scattered interview reports into a queryable dataset</h2>

<p>Interview reports have a short half-life. A report from the autumn 2026 hiring season is down to its process skeleton by spring; the actual questions and the interviewers' style have turned over. They are also scattered across systems that do not talk to each other: Nowcoder's forums, Juejin's columns, Mianshiya's question banks — each with its own search, its own login wall, and site search that can only answer "contains this keyword", never "what did this company ask for this role recently".</p>

<p>InterviewAtlas is an attempt at that aggregation problem: crawl three sites daily, normalise company and role, dedupe and merge by URL, render a README plus per-company-per-role Markdown, then use a model to summarise each group into four sections — interview process, high-frequency topics, representative questions, preparation advice. Everything runs on GitHub Actions: no server, no database, and the model calls go through GitHub Models' free quota.</p>

<p>At the time of writing the repository holds 41,771 records, 157 companies and 1,634 company-role files; <code>data/interviews</code> contains 158 <code>.json.gz</code> files (35.9 MB) and <code>interviews/</code> holds 1,791 Markdown files (92.3 MB). The source is 22 Python files, with exactly four runtime dependencies: <code>requests</code>, <code>bs4</code>, <code>lxml</code>, <code>PyYAML</code>. What follows is not a feature list — it is the design reasoning and the holes I actually fell into.</p>

<h2>Architecture: one collection chain, one analysis chain</h2>

<p><code>src/main.py</code> contains no crawling logic; it only orchestrates. It calls each source in configured order, hands results to normalisation, storage and rendering, then prints how many records were added and how long it took. The real code sits in two layers:</p>

<pre><code>src/main.py                 orchestration and timing
  ├─ sources/nowcoder.py    Nowcoder: search + detail
  ├─ sources/mianshiya.py   Mianshiya: bank list → questions
  ├─ sources/juejin.py      Juejin: deep pagination + body
  ├─ normalize.py           company/role detection, cleaning, relevance
  ├─ storage.py             merge, shard by company, write
  └─ render.py              README and per-group Markdown
src/analyze.py              separate process: reads stored data, calls GitHub Models
</code></pre>

<p>Analysis is a separate process rather than a function call after collection, for three reasons. Isolation: rate limits, exhausted quota or empty responses must not rot data that has already been collected in memory. Runtime: collection takes thirty minutes, and analysis on a free quota may not finish the same day — it must be resumable tomorrow. Cache: analysis output is written to <code>analysis/</code> and committed, so it is repository state like the data itself, not something to hold in one run's memory.</p>

<p>Skipping the database comes from the same reasoning. Actions runners are ephemeral, so the only durable state is git; and 41,771 records read fully into memory are nowhere near needing an index. The price of that choice is the write amplification discussed below.</p>

<p>The orchestration layer also does something easy to overlook: it prints each source's duration separately. The daily log shows record counts and seconds for Nowcoder, Mianshiya and Juejin. That is performance telemetry and a failure signal at once. Mianshiya finishing in one second next to the other two taking a dozen minutes is jarring, and the contrast is itself the anomaly; with only a total runtime, a missing ten minutes hides inside thirty.</p>

<h2>Data model: one record, three layers of normalisation</h2>

<p>A report is one JSON object. Few fields, but each has a job:</p>

<table>
<thead><tr><th>Field</th><th>Meaning</th><th>Used for</th></tr></thead>
<tbody>
<tr><td><code>id</code></td><td>URL digest, or source plus external id</td><td>Stable identity</td></tr>
<tr><td><code>source</code></td><td>nowcoder, mianshiya, juejin</td><td>Source statistics</td></tr>
<tr><td><code>external_id</code></td><td>The site's internal id</td><td>Cross-bank merge in Mianshiya</td></tr>
<tr><td><code>title</code> / <code>url</code></td><td>Title and original link</td><td>Display, dedupe key</td></tr>
<tr><td><code>company</code> / <code>position</code></td><td>Normalised company and role</td><td>Sharding, grouping</td></tr>
<tr><td><code>content</code></td><td>Cleaned body text</td><td>Dedupe, model input</td></tr>
<tr><td><code>published_at</code></td><td>Publication date</td><td>Ranking the "newest half"</td></tr>
<tr><td><code>kind</code></td><td>report, question, bank</td><td>Content shape</td></tr>
<tr><td><code>first_seen</code> / <code>last_seen</code></td><td>First and latest sighting</td><td>Retention pruning</td></tr>
</tbody>
</table>

<p>Normalisation has three layers. First, company aliases: <code>COMPANY_ALIASES</code> matches longest string first, so "阿里云" (Alibaba Cloud) never loses to "阿里" (Alibaba). Second, role detection in a fixed order — backend, frontend, algorithms, testing, product — falling back to "other role". Third, the fallback layer: unknown companies and roles both land in "other", and those are excluded from LLM analysis because they cannot support a meaningful summary. The final 157 companies and 1,634 company-role pairs are what survives those three layers.</p>

<p>The alias table looks dumb and is the precondition for the dataset being usable at all. One company appears as "字节", "字节跳动" and "bytedance" across three sites; without normalisation you get three thin sets of statistics. Yet "阿里云" and "阿里巴巴" must stay separate, or the cloud unit's roles get diluted by group-level reports. Longest-match-first solves exactly this containment problem: try the long alias, stop on a hit, and let short aliases fire only when nothing else matched.</p>

<h2>Collection: three sites, three strategies</h2>

<p>The three sites expose completely different interfaces, so the strategies differ too:</p>

<table>
<thead><tr><th>Source</th><th>Entry point</th><th>Pagination ceiling</th><th>Body text from</th></tr></thead>
<tbody>
<tr><td>Nowcoder</td><td><code>POST gw-c.nowcoder.com/api/sparta/pc/search</code></td><td>3 pages × 20 per keyword</td><td>Search truncates; detail completes</td></tr>
<tr><td>Juejin</td><td><code>search_api</code> cursor deep pagination</td><td>Pages until there is no next cursor</td><td><code>web_html_content</code> in search results</td></tr>
<tr><td>Mianshiya</td><td>Bank list → question list</td><td>Hard limit of 5 pages per query</td><td>Question stem + bank description</td></tr>
</tbody>
</table>

<p>Nowcoder's coverage comes from a keyword matrix: ten generic terms plus 157 companies times two templates ("company interview report", "company interview experience") — well over three hundred queries, each capped at three pages. This necessarily produces duplicates, but the search API offers no stable full-scan cursor, so cross-coverage through keywords is the only option. Search returns truncated bodies, so every unseen record gets one more detail request before storage; details run on six threads with a 0.2-second per-thread interval, which keeps total runtime down without hammering the site.</p>

<p>Juejin supports cursor pagination, so paging is not the bottleneck — body formatting is. The search API's <code>web_html_content</code> is an escaped string: quotes, newlines and backslashes each carry an extra layer, and standard JSON decoding does not yield usable HTML. The code contains a hand-written unescape routine that restores the string segment by segment, then hands it to the shared cleaner. No library helps here, because the payload's escaping sits on top of JSON's own escaping — decoding twice eats legitimate backslashes in the body. It is code you only dare write once you know exactly what the platform emits.</p>

<p>Mianshiya is a third shape: walk the bank list, then expand each bank into questions. The question endpoint has a hard limit of five pages per query. To get more data, the collector runs three variants per bank — no filter, <code>difficulty:1</code>, <code>difficulty:3</code> — turning "five pages per query" into "three groups of five pages". The cost is triple the requests, with overlap between the groups that needs local deduplication by question id. And it only relieves the ceiling; it does not remove it.</p>

<p>Anti-bot handling is uniform: a Chrome/124 User-Agent, a per-site Referer, <code>Retry(total=3, backoff_factor=1.0, status_forcelist=[429, 5xx])</code>, and a global 0.5-second request interval. No browser automation, no login handling — so only publicly visible content is covered. That is the capability boundary, and the reason the site does not block us.</p>

<h2>Incremental crawling: saving requests before deduplication</h2>

<p>Re-crawling all three sites daily is impossible: three hundred keywords on Nowcoder, a dozen deep pages on Juejin, a thousand banks on Mianshiya — the request count alone blows the budget. The pipeline's first act is <code>load_records()</code>, which reads all history back and builds two sets: <code>known_urls</code> and <code>known_content</code> (bodies of 300 characters or more only).</p>

<p>When the collector gets a search result it first computes the normalised URL. A hit in <code>known_urls</code> means skip — not even a detail request. A URL miss whose body exactly matches something in history is also skipped. What this saves is the expensive detail request, not the search request: searches still page through, but detail calls only land on new or incomplete content.</p>

<p>Merging is by URL, and <code>merge_records()</code> behaves as "old record wins, new record fills blanks": title, source, company and role are overwritten only when missing, the body is replaced only when the new one is longer, and <code>last_seen</code> is refreshed every thirty days rather than daily — otherwise every shard gets rewritten every day because of one timestamp field. The returned <code>new_count</code> and <code>new_records</code> feed the README's "this run" block. Retention is <code>retention_days: 365</code>; anything unseen for a year is dropped.</p>

<p>Deduplication happens in three layers. First, URL normalisation: strip the <code>#</code> fragment, the query string and the trailing slash, and lowercase — so a shared link and a tracked link to the same post collapse into one key. Second, Mianshiya's cross-bank merge: one question can be indexed by several banks, merged by <code>external_id</code>, preferring the bank that lets us identify a company. Third, before the model sees anything, <code>_dedupe()</code> filters again on "title + first 120 characters of body", because different sources repost the same report — different URL, near-identical content, invisible to the first two layers.</p>

<pre><code>def record_key(record: dict) -&gt; str:
    url = (record.get("url") or "").split("#")[0].split("?")[0].rstrip("/").lower()
    if url:
        return url
    source = record.get("source") or ""
    external_id = record.get("external_id") or ""
    return f"{source}:{external_id}" if (source or external_id) else (record.get("id") or "")
</code></pre>

<p>The payoff is direct: daily runs only handle increments, and detail requests are spent only on genuinely new posts. The cost is that every run decompresses, deserialises and indexes 35.9 MB of compressed data — a fixed startup cost. One order of magnitude more data and this would need lazy per-company loading.</p>

<p>One detail decides whether "incremental" is trustworthy: the content set only accepts bodies of 300 characters or more. A very short body may be a truncation artefact, and using it as evidence of "already crawled" would permanently lock an incomplete record in place — later visits to the same URL would never fill it in. The threshold keeps incomplete records out of the known set, leaving room for completion.</p>

<h2>Storage and rendering: sharding, idempotency, write amplification</h2>

<p>Storage is sharded by company — one <code>.json.gz</code> each, not one big JSON. The reason is practical: GitHub caps a single file at 100 MB, and 41,771 records in one file would hit it eventually; sharded, every file stays small and <code>_meta.json</code> holds only totals. <code>load_records()</code> reads both the legacy single-file format and the new directory format, preferring <code>.json.gz</code>, so a company is never read twice during migration.</p>

<p>Writes are idempotent in two layers. First, <code>_write_if_changed()</code>: identical content is never written, so no spurious git change. Second, <code>gzip.compress(raw, mtime=0)</code>: the timestamp in the gzip header is pinned, so the same content produces the same bytes — otherwise every compression differs and git reports all shards modified every day.</p>

<pre><code>raw = (json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\\n").encode("utf-8")
data = gzip.compress(raw, mtime=0)   # same content → same bytes, no meaningless diff
if path.exists() and path.read_bytes() == data:
    return
</code></pre>

<p>Rendering produces two things: the root README and <code>interviews/&lt;company&gt;/&lt;role&gt;.md</code>. The README is an index — company list, role list, totals, per-source statistics and "this run" — and the split files are the human-readable bodies. The catch is that the README is fully re-sorted daily: one new record can change company ordering, role counts and the update time, so the whole page is rewritten. Measured daily README diff: about 3,404 lines, far more than the data increment itself.</p>

<p>Write amplification is the most expensive hidden cost of this design. A daily commit is 53,614 insertions and 41,513 deletions; the weekly run with <code>--full</code> reaches 541,773 insertions and 372,746 deletions; the initial commit was 2.03 million lines. The repository is 348 MB while the current snapshot is about 128 MB — the difference is mostly blobs from whole-file rewrites throughout history. Git compresses, but it does not forget.</p>

<p>It is worth stressing how little new information those diffs contain. A few hundred new reports per day may be a few hundred lines; the remaining fifty-something thousand lines are whole sections moving because a sort position, a count or a timestamp changed. Git's diff algorithm records that as deletions plus insertions, and history grows. Idempotency can guarantee "do not write when nothing changed"; it cannot prevent "one thing changed, the page reshuffled".</p>

<h2>LLM summarisation: a two-stage map-reduce</h2>

<p>Analysis has a threshold, <code>min_records: 20</code>: a company-role pair needs at least twenty reports to be worth summarising, otherwise the model can only invent. Groups that qualify get a group-level report first, then group reports roll up into a role-level report — textbook map-reduce.</p>

<p>I deliberately did not take the easy route of stuffing every report into one prompt. 41,771 bodies far exceed any context window, and even if they fit, cost and latency would be uncontrollable. Map-reduce splits the problem into "eight reports per company-role" and "sixteen companies per role"; both inputs stay budgetable. The cost is information loss across two truncation layers — anything the group report omitted is gone at role level.</p>

<p>The group prompt's input is selective: company, role, total count, sample time span, and at most eight samples. Half the samples are the longest bodies (high information density), half the newest (closest to current process); each is clipped to 1,200 characters and the whole block to 16,000. The prompt mandates four headings and asks the model to write "insufficient sample" rather than invent process steps, salaries or rounds.</p>

<pre><code>Requirements:
1. Use only the material provided. Do not invent company process, salary, interview rounds, or questions absent from the material. If the material is insufficient, write "insufficient sample".
2. Use level-2 headings (##) and output exactly these four sections: process and rounds, high-frequency topics, representative questions, difficulty and preparation advice.
3. "Representative questions" must be a bulleted list of 5-10 items, preserving the original wording where possible.
</code></pre>

<p>Call parameters are <code>temperature: 0.3</code> and <code>max_tokens: 1600</code>. Low temperature keeps two runs over the same material close together, which also makes cache decisions easier; 1600 tokens is enough for four sections of 400-800 characters and discourages drift. The clipper <code>_clip()</code> cuts on paragraph boundaries — newline, full stop, exclamation, question mark — and appends "(truncated)" so a sentence is never cut in half.</p>

<p>There are two quality guards. <code>_missing_sections()</code> checks that all four headings exist; if one is missing it retries once with an explicit "these four headings are mandatory" instruction. If it is still missing, no further retry: a note is prepended to the body saying which sections are absent, so readers know this is a degraded artifact rather than a complete report.</p>

<p>Role level is the second stage: collect each company's group reports for a role, clip each to 700 characters, allow at most sixteen companies, and skip the role entirely below three. It never looks at raw reports, only at summaries already produced, which bounds the input and avoids reading the same originals twice.</p>

<p>Sample selection has one more fallback: after taking "longest half + newest half", if there are still fewer than eight, keep adding from the remaining longest records up to the cap. Small groups therefore do not end up with two or three samples just because the newest half is all short posts, and length still prioritises information density. The three caps — eight samples, 1,200 characters, 16,000 characters — are not arbitrary: together they fix the per-prompt token budget, which fixes how many groups 100 calls can cover.</p>

<h2>Cache, budget and invalidation</h2>

<p>Analysis is not recomputed every run. <code>analysis/manifest.json</code> records <code>PROMPT_VERSION</code>, the model name, and per-group counts and generation time. <code>PROMPT_VERSION</code> is currently <code>2026-10-29.1</code>; if either the prompt version or the model name changes, the whole cache is invalidated and everything is recomputed. That is blunt but correct: once the prompt changes, old reports no longer represent the current standard, and partial reuse would leave two standards in the repository.</p>

<p>A single group is recomputed after <code>refresh_after_days: 30</code>, or once its count grows by <code>max(5, 10%)</code>. The first prevents stale material, the second ensures a re-call only happens when enough new samples justify it; for one or two new reports the benefit is below the cost.</p>

<p>Budget is the other hard constraint. The free tier is about 15 RPM, so the config is conservatively <code>rpm: 12</code>, <code>workers: 2</code>, <code>max_calls_per_run: 100</code>. A hundred calls means one day covers only part of the groups, and the rest rolls to tomorrow. Hence the budget split: <code>reserve = min(roles, max_calls // 6)</code> calls are held for role-level summaries before company groups get anything, so groups cannot starve the rollups forever.</p>

<p>Failures are routed by status code. On 429, read <code>x-ratelimit-remaining</code>: zero means the daily quota is gone, so throw <code>QuotaExceeded</code> and stop the whole round instead of retrying pointlessly; non-zero means read <code>Retry-After</code> and retry after at most 60 seconds. A 403 whose body mentions rate limiting is treated the same as quota exhaustion; other 401/403 cases are permission errors pointing at <code>models: read</code>. 5xx gets exponential backoff, three attempts. The point of routing is to separate "waiting will help" from "do not try again today".</p>

<p>Cache decisions happen before the call, in this order: read the manifest, compare prompt version and model name; then per group compare count and generation date; only when both pass is the group skipped. That order ensures a changed version cannot accidentally reuse an old report just because the count did not move. The manifest doubles as an observability surface: which groups were analysed, with which model, when — no need to dig through Actions logs.</p>

<h2>GitHub Actions: an unattended pipeline</h2>

<p>Two workflows, one daily and one weekly. <code>daily.yml</code> runs on cron <code>0 1 * * *</code> — 09:00 Beijing time — with <code>timeout-minutes: 60</code>; <code>weekly-full.yml</code> runs Sunday 10:00 with <code>--full --limit 150</code> and a 180-minute timeout. <code>--full</code> enables more pagination and more company query templates; <code>--limit</code> caps detail completion per source so the weekly run does not drain the quota in one go.</p>

<p>Permissions are only two: <code>contents: write</code> for commits and <code>models: read</code> for GitHub Models. Credentials come from the repository's own <code>GITHUB_TOKEN</code>, with no extra secret, so forks and pull requests never get write access. Concurrency uses <code>group: interview-crawl</code> with <code>cancel-in-progress: false</code>: when daily and weekly collide they queue rather than cancel each other — collection is idempotent, but a mid-flight cancellation leaves half a dataset.</p>

<pre><code>permissions:
  contents: write
  models: read
concurrency:
  group: interview-crawl
  cancel-in-progress: false
</code></pre>

<p>The commit step first runs <code>git status --porcelain -- README.md data/ interviews/ analysis/</code> and exits 0 when there is nothing; only when there are changes does it <code>git add</code> those four paths and commit. Note the absence of <code>git add -A</code>, which keeps temp files, logs and local config out of the repository. The analysis step is marked <code>continue-on-error: true</code>, on the theory that quota or permission trouble should not block committing collected data. That decision was reasonable in itself, and it later amplified the second incident.</p>

<p>Step order matters too: collect, then analyse, then commit once. That way a failed analysis still commits collected data; the reverse could end the run early and lose both. The price is that analysis shares the job with collection and its runtime stacks behind it, inside the same 60-minute timeout. Daily runs currently sit just over 30 minutes, enough headroom — but not a structure that can absorb unlimited new sources.</p>

<h2>Postmortem one: "0 banks, 0 records" from Mianshiya</h2>
<h3>Symptom</h3>

<p>One day's Actions run (41792215767) logged exactly two lines for Mianshiya: <code>Mianshiya: 0 banks, expanding questions</code> and <code>Mianshiya done: 0 banks, 0 records</code>. From commit <code>116976f8</code> onward those two lines appeared every day, for days. More confusingly, the whole pipeline was green: no failed step, no alert, the README updated as usual, and Mianshiya still showed 1,962 records in the source statistics.</p>

<p>The investigation started from "this does not look right": a full bank traversal cannot finish in one second, and the daily run was still thirty minutes — so the other two sources were fine and only Mianshiya was spinning idle. Scrolling back through logs showed the same two lines repeating after a specific commit; following that commit hash landed inside the Mianshiya changes. Reading the code path, the chain was complete — request, exception, catch, <code>break</code>, return empty list — and nothing in it could ever fail the job.</p>

<h3>Cause</h3>

<p>The immediate cause was the bank-list endpoint returning a 567 Server Error. <code>MianshiyaSource.fetch()</code> wraps that request in <code>try/except Exception</code>, logs a warning and <code>break</code>s; the function continues, <code>banks</code> is empty, and <code>fetch()</code> returns an empty list. Upstream, <code>main.py</code> treats "returned an empty list" as a normal result and proceeds to merge, render and commit. Historical data is never deleted, so the README keeps reporting the old 1,962 records and nothing on the page suggests the source stopped updating.</p>

<p>The real problem is error semantics: the collector uses "empty result" to mean two completely different states — "there genuinely is nothing new today" and "this source is broken". The first should succeed, the second should fail, and the code collapses them into one return value. On top of that, <code>except Exception</code> swallows HTTP errors, parse errors and structural changes alike, leaving one warning line, and no assertion anywhere checks the most basic health condition: banks &gt; 0.</p>

<h3>Fix and current state</h3>

<p>As recorded, the API side has not recovered and the silent <code>break</code> is still there. So the state is: Mianshiya returns zero every day, historical data stays, and the README numbers look unchanged. This is not "fixed" — it is a documented, unfixed defect.</p>

<p>Three changes should land. First, stop swallowing collector exceptions: a failure on the first page of the bank list raises <code>SourceError</code>, which <code>main.py</code> catches and marks the source failed instead of returning an empty list. Second, add a minimum-output assertion per source — banks &gt; 0, questions &gt; 0 — and record a violation; "nothing new today" should be "request succeeded, zero new", never "request failed, so zero". Third, surface per-source last-success time and current status in the README, so a dead source is visible on the page rather than buried in logs.</p>

<h3>Cost</h3>

<p>Data missed while the source was down does not come back by itself; only a <code>--full</code> rerun recovers it, at far higher request volume and runtime than a daily run. The more expensive cost is trust: a pipeline that is green every day with unchanging numbers convinces both maintainer and reader that everything is fine. The later such a silent failure is found, the higher the backfill cost — and every statistic produced in between carries a known gap.</p>

<h2>Postmortem two: analysis stuck at 0/237</h2>
<h3>Symptom</h3>

<p><code>analysis/README.md</code> showed "analysed 0/237" for a long time and <code>analysis/</code> held no company reports. The Actions step named "Analyze with GitHub Models" finished in 0 seconds as a success every time. 237 is the number of groups meeting <code>min_records: 20</code>, so the data side was fine; the analysis side had never actually started.</p>

<p>The investigation ran in reverse order: first the model, then the quota, and only then whether the code ran at all. The log had no model request, no 401, no 429, no timeout — not even a "cache skipped" line, which matches no known call failure. Zero seconds also contradicts "walk 237 groups and check each cache". Running the same code locally with <code>python -m src.analyze</code> produced the real error: a SyntaxError in the f-string inside <code>_dedupe()</code>. The error is at import time, not runtime, which is why no runtime log line ever appeared.</p>

<h3>Cause</h3>

<p>The root cause is in <code>_dedupe()</code>:</p>

<pre><code>key = f"{title}|{re.sub(r'\\s+', '', (record.get('content') or '')[:120])}"
</code></pre>

<p>This line is legal from Python 3.12 and illegal on 3.11: a 3.11 f-string expression may not contain a backslash, so <code>r'\\s+'</code> makes the whole module fail at compile time with <code>SyntaxError</code>. The workflow pins <code>python-version: "3.11"</code>, so <code>python -m src.analyze</code> exited before the first line of business code ran.</p>

<p>Why nobody noticed: the analysis step had <code>continue-on-error: true</code>, so a compile failure counted as an ignorable analysis exception and the job stayed green; and a 0-second duration reads like "nothing needed analysis, returned fast". Locally, a newer Python runs the same line fine, so the environment difference hid the error even deeper. Three factors stacked into one compile-time error disguised as "analysis ran normally, produced nothing".</p>

<h3>Fix and current state</h3>

<p>Still unfixed: the <code>_dedupe()</code> line remains, the workflow is still 3.11, and the step still has <code>continue-on-error: true</code>. Either fix works — move the workflow to 3.12, or hoist the <code>re.sub</code> out of the f-string.</p>

<pre><code>normalized = re.sub(r"\\s+", "", (record.get("content") or "")[:120])
key = f"{title}|{normalized}"
</code></pre>

<p>But that one line is not enough. The intent of <code>continue-on-error</code> — do not lose data when the model is down — should stay; what must change is that failure cannot disappear as "0 seconds, success". A sturdier shape is to split analysis into its own job, commit collected data regardless, and mark the job red with the reason in the summary; or read <code>steps.analyze.outcome</code> in the same job and emit an annotation on failure. The rule: failure is allowed, invisibility is not.</p>

<h3>Cost</h3>

<p>Not a single call for 237 groups was sent, so no quota was consumed — but the core "LLM summary" feature effectively did not exist, and the README showing 0 made readers think the data did not meet the threshold. The subtler cost is debugging time: zero seconds, no logs, no artifacts all point at "there was no work to do", while the truth was one layer down — the code never loaded. When a step is wrapped in <code>continue-on-error</code>, the failure signal decays in exactly the direction you least want.</p>

<h2>Problem list: truncation, dirty characters, duplicates</h2>
<h3>Truncated bodies from the search API</h3>

<p>Symptom: some reports land with only one or two hundred characters, ending in an ellipsis; some posts vanish from results entirely. Cause: Nowcoder's search API returns abstracts, not full text; only the detail endpoint has the body. Normalisation has <code>_is_truncated()</code>, which treats "under 300 characters and ending in an ellipsis" as a crawl failure and drops it. That heuristic blocks most broken records, and also misfires on genuinely short posts that happen to end with an ellipsis.</p>

<p>Fix: for unseen records, make one detail request and decide after fetching the full body; for records already seen, the content set skips them, so no repeat request. This mechanism is live: the daily run makes 2,900+ detail requests in 18 minutes 46 seconds, and that is where most of the time goes. The cost is that "short but complete" content may still be dropped, with no separate counter — an invisible loss.</p>

<h3>The same post collected three times</h3>

<p>Symptom: one report appears several times, company-role counts inflate, and the model sees duplicated samples. Three causes: the keyword matrix overlaps by design; share links carry <code>#</code>, query parameters and trailing slashes; and Mianshiya indexes one question in several banks. The fix is the three-layer dedupe above — URL normalisation, cross-bank merge by <code>external_id</code>, and a title-plus-120-characters filter before the model. The cost is that over-aggressive normalisation can merge pages whose query parameters genuinely distinguish content, and the title-plus-opening heuristic can merge two reports that share an opening but diverge later.</p>

<h3>Invisible characters</h3>

<p>Symptom: bodies contain <code>&amp;nbsp;</code>, zero-width spaces and runs of blank lines; sentences are glued together by <code>&lt;br&gt;</code>. Cause: all three sites return HTML fragments or rich text, mixing tags, entities and platform-injected invisible characters. The fix is a single <code>clean_content</code>: convert <code>&lt;br&gt;</code> and <code>&lt;/p&gt;</code> into newlines, run <code>html.unescape</code>, strip <code>\\u200b</code> and <code>\\xa0</code>, then collapse whitespace. The cost is that cleaning order is sensitive — unescape before stripping tags turns text that was meant to be visible into real tags and deletes it. Cleaning also happens before dedupe, so changing the rules changes both content hashes and dedupe results.</p>

<h2>Problem list: 100 MB, quota, a source going dark</h2>
<h3>A single file approaching 100 MB</h3>

<p>Symptom: early on all records lived in one JSON, and as counts grew the file approached GitHub's 100 MB per-file hard limit — past which pushes are rejected outright. The cause was not only current size but git history: every whole-file rewrite leaves a new blob, so the repository grew far faster than the data. The fix was sharding by company into 158 <code>.json.gz</code> files totalling 35.9 MB, reading the legacy single file and deleting shards for companies that no longer exist. The cost: 158 files opened per run, slug collisions need a digest suffix, and the shard add/remove logic is itself a new failure surface.</p>

<h3>The hard edge of a free quota</h3>

<p>Symptom: analysis stops halfway and later groups never get results; occasionally 429s repeat and retries do nothing. Cause: GitHub Models' free tier is roughly 15 RPM, and 237 groups far exceed a single day's budget. The fix: <code>max_calls_per_run: 100</code>, <code>rpm: 12</code>, <code>workers: 2</code>, plus 429 handling via <code>Retry-After</code> and <code>x-ratelimit-remaining</code>, a 403 rate-limit response raising <code>QuotaExceeded</code> to stop the round, and <code>reserve = min(roles, max_calls // 6)</code> holding quota for rollups. The cost: a complete analysis spans several days, and the "company groups first, rollups later" order means new roles lag forever; the split prevents starvation, not unfairness.</p>

<h3>Turning off a source means deleting its history</h3>

<p>Symptom: PracHub is mostly foreign companies while the config has <code>exclude_foreign_companies: true</code>, so most of what it returned was filtered out — poor value for the request cost. Cause: the source no longer matched the goal. The fix: <code>prachub: enabled: false</code> plus <code>exclude_sources: [prachub]</code>, and the next run drops its history per the dropped list. The cost is irreversibility: once deleted, re-enabling means crawling from scratch, and old links may already be dead. It is a straight trade between data assets and running cost, with no both-ways option.</p>

<h3>Three things still unresolved</h3>

<p>First, there is no robots.txt check. Collection covers only public content and is rate-limited, but "are we allowed to crawl this" was never verified in code — an explicit compliance gap. Second, Juejin requests carry no signature parameters; they work today, but the day the API requires signing they will fail again — and that failure will very likely present as "0 records", re-enacting Mianshiya's silent failure. Third, the README derives its last-update time from file mtime, and Actions always checks out fresh, so unchanged files all get the same timestamp — the "updated at" readers see is not real. All three are open items, not decorations on a to-do list.</p>

<h2>Measured numbers and known limits</h2>

<p>A daily run measures 30 minutes 08 seconds: Nowcoder 18:46 with 12,945 records and 2,900+ details; Mianshiya 1 second (the zero described above); Juejin 10:46 with 3,924 search results and 3,333 bodies. The weekly run takes 24:48, shorter than daily, mainly because <code>--limit 150</code> caps detail completion. Timeouts are 60 and 180 minutes, so both have more than double the headroom they need; the real risk is API change and quota, not duration.</p>

<p>The time breakdown shows where the bottleneck is: Nowcoder accounts for over 60% of runtime, almost all of it those 2,900+ detail requests; Juejin fetched 3,333 bodies in just over ten minutes because its search API returns full text, so far fewer detail calls are needed. That is exactly why the incremental design must prioritise saving detail requests: search paging is a fixed cost, details scale linearly with new records.</p>

<p>Three judgements. First, the architecture holds under its constraints — zero server, free quota, one run a day: incremental checks eliminate most detail requests, idempotent writes avoid meaningless commits, and the two-stage analysis turns an unfinishable job into a resumable one. Second, its weakest point is not anti-bot defence but the way failure is expressed: a dead source or a compile failure can both leave the pipeline green. Third, the repository will keep growing — the full README re-sort and the history of whole-file rewrites are the main sources — so either accept it or make rendering incremental.</p>

<p>If work continues, the priority is: fix the f-string and the workflow version so analysis actually runs; add health assertions and last-success times per source; only then robots.txt, Juejin signing and the mtime correctness issues. Collection volume is no longer the bottleneck — visibility is.</p>

<h2>Closing</h2>

<p>InterviewAtlas is a long-running data pipeline held up by four dependencies, two workflows and one git repository. Its design compresses into four sentences: decide what is new before sending the request; dedupe in three layers at three different stages; pin the gzip timestamp to buy idempotency; version the manifest and budget the calls to buy control.</p>

<p>The holes it fell into are worth more than the features. Mianshiya's zero shows that "empty result" cannot mean both success and failure. The 0/237 shows a compile-time error can be dressed up as normal operation by <code>continue-on-error</code>. Truncation, duplicates and dirty characters show every cleaning heuristic has collateral damage. Write amplification shows the storage cost of a git repository lives in history, not in the snapshot.</p>

<p>Neither of the two worst problems is fixed: Mianshiya's API has not recovered and the silent <code>break</code> remains; the f-string-and-3.11 combination remains, and 0/237 will not become 237/237 on its own. Writing the fix down plainly is more honest than claiming it is solved.</p>

<p>If I started again, I would write "failure is visible" before writing collection: every source needs three distinct states — success, failure, zero output — and every background step's exit code must reach the summary instead of being flattened by <code>continue-on-error</code>. Most pipeline incidents are not "we could not fetch"; they are "we could not fetch and nobody knew".</p>

<h2>Further reading</h2>
<ul>
<li><a href="/en/article/nanohermes-rust-coding-agent/">NanoHermes: a Rust agent with zero runtime</a> — another "minimal dependencies, bounded output" trade-off, useful to compare with this post's budget and clipping design.</li>
<li><a href="/article/agent-loop-two-hundred-lines/">The essence of an agent: a two-hundred-line loop</a> — a different kind of loop, starting from the smallest implementation.</li>
<li><a href="/article/agent-evaluation-not-a-benchmark/">Agent evaluation: a single run is not a test</a> — useful when generated reports themselves need a quality judgement.</li>
</ul>
`,
  },
]

// 列表页、快照和 sitemap 都按这个顺序渲染：新稿在前，和中文站的列表一致。
EN_ARTICLES.sort((a, b) => String(b.date).localeCompare(String(a.date)))

export const EN_BY_SLUG = new Map(EN_ARTICLES.map((a) => [a.slug, a]))
