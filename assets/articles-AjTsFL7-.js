var e=[{slug:`aidevops-terminal-client`,zhSlug:`aidevops-terminal-client`,topicSlug:`projects`,title:`aidevops: an AI DevOps copilot that lives in your terminal`,excerpt:`An open-source terminal client that stitches requirements, commits, tests, bugs and releases into one traceable chain — with an LLM layer that can only propose, never act.`,date:`2026-10-16`,readingTime:17,html:`
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
`},{slug:`interviewatlas-daily-crawl-llm-analysis`,zhSlug:`interviewatlas-daily-crawl-llm-analysis`,topicSlug:`projects`,title:`InterviewAtlas: crawling 30,000 interview reports and summarising them with an LLM`,excerpt:`A zero-server data pipeline built on GitHub Actions: incremental crawlers for three sites, idempotent sharded storage, and a two-stage map-reduce over a free model quota — plus the two silent failures that kept it green while doing nothing.`,date:`2026-11-05`,readingTime:28,html:`
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
`},{slug:`micromd-3mb-markdown-reader`,zhSlug:`micromd-3mb-markdown-reader`,topicSlug:`projects`,title:`MicroMD: a 3 MB single-file Markdown reader`,excerpt:`A 3.17 MiB exe, a zero-dependency HTML interface and a hand-written Markdown parser in one process — and seven problems the author chose to document instead of hide.`,date:`2026-11-05`,readingTime:35,html:`
<blockquote>
<p>Who this is for: Go and frontend developers building single-file desktop apps on Windows; people evaluating a WebView2 shell or planning to hand-write a Markdown parser; engineers who care about binary size, startup, save semantics and the security boundary.</p>
<p><strong>Bottom line first:</strong> MicroMD packs a 3.17 MiB exe, a dependency-free HTML interface and a hand-written Markdown parser into one process. What is worth reviewing is not the small size but four trade-offs: using the system WebView2, hosting the UI on <code>file://</code>, connecting native and JS with exactly three bindings, and a two-pass parser that protects both escaping and placeholders. Seven problems remain unsolved, each with its cost spelled out below.</p>
<p>Reading time ~30 minutes · Level: advanced</p>
</blockquote>

<strong>Contents</strong>
<ul>
<li>Why build another Markdown reader</li>
<li>One exe and its native shell</li>
<li>Why the interface is written to disk first</li>
<li>Three bindings and the meaning of "save"</li>
<li>A hand-written parser: two passes and a block state machine</li>
<li>Problem one: missing WebView2 and the browser fallback</li>
<li>Problem two: relative image paths resolve against the wrong base</li>
<li>Problem three: full re-render and large-file throttling</li>
<li>Problem four: draft quota and an unused MAX_DRAFT</li>
<li>Problem five: size, icon and startup time</li>
<li>Problem six: save semantics versus user expectations</li>
<li>Problem seven: no file watching, no recent files</li>
<li>Known limits and design trade-offs</li>
<li>Closing</li>
</ul>
<hr>

<h2>Why build another Markdown reader</h2>

<p>A 3 MB single-file Markdown reader sounds like compressing something that was never big. Markdown is not the hard part — a parser for headings, lists and tables can be short. The hard part is the Windows desktop shell: windows, DPI, icons, the WebView2 runtime, file permissions, and the distribution problem behind "double-click and it works".</p>

<p>MicroMD's answer is to externalise as much cost as possible: don't bundle a rendering engine, use the system WebView2; introduce no UI framework, write one HTML file; depend on no Markdown library, hand-write a parser in a couple of hundred lines of JavaScript; keep the native layer to window creation, three bindings and argument parsing. The result is a single exe, unzip and run, writing only to its own app-data directory, installing no service and requiring no network.</p>

<p>But the boundaries first. It is not cross-platform; heavy Win32 usage and the WebView2 dependency pin it to Windows 10 and 11. It is not a complete editor either: no syntax highlighting, no sidebar outline, no file watching, no recent-file list. Those are not "coming later" roadmap items — they are the current state. This post follows the implementation order: shell and disk writes, then the three bindings and the parser, then the seven exposed problems one by one.</p>

<p>Let us also get the size right. The release build after stripping is 3,323,392 bytes, i.e. 3.17 MiB (about 3.32 MB decimal); unstripped it is 4,943,872 bytes, so <code>-s -w</code> saves 32.8%. "3 MB" in the title describes that order of magnitude, not an exact 3.00 MB.</p>

<h2>One exe and its native shell</h2>

<p>What is actually inside? It does not bundle Chromium, so "3 MB" means "3 MB of shell plus the engine already on the system", not "a 3 MB browser". The shell has five layers:</p>

<table>
<thead><tr><th>Layer</th><th>Implementation</th><th>Verified fact</th></tr></thead>
<tbody>
<tr><td>Native shell</td><td>Go + <code>github.com/jchv/go-webview2</code></td><td>Three direct Go modules, all three mislabelled <code>// indirect</code> in <code>go.mod</code></td></tr>
<tr><td>Interface</td><td>A single <code>web/index.html</code></td><td>29,520 bytes, zero JavaScript libraries</td></tr>
<tr><td>Rendering engine</td><td>Microsoft Edge WebView2, system-installed</td><td>Not shipped with the exe</td></tr>
<tr><td>Icon and version resource</td><td><code>.syso</code> produced by <code>go-winres</code></td><td>The <code>.syso</code> is gitignored; skip generating it locally and there is no icon</td></tr>
<tr><td>Packaging</td><td><code>//go:embed</code></td><td><code>main.go:18</code> compiles the HTML into the binary</td></tr>
</tbody>
</table>

<p>The native entry point is short. <code>main.go</code> initialises DPI, computes the app-data directory, writes the embedded HTML to disk, parses command-line arguments, then creates a window and calls <code>Run()</code>. The window comes from <code>webview2.NewWithOptions</code> with only a few parameters: title <code>MicroMD</code>, size from <code>windowSize()</code>, <code>IconId: 1</code>, <code>Center: true</code>, and <code>DataPath</code> pointing at <code>%LOCALAPPDATA%\\MicroMD\\webview</code>. <code>Debug: false</code> disables the default context menu and DevTools — a release configuration, not a development one. Window style comes from <code>go-webview2</code>'s defaults; the comment says <code>WS_OVERLAPPEDWINDOW</code>, meaning no custom title bar and no native menu bar. Appearance is entirely the system's.</p>

<p>That choice saves work and hard-codes limits. Without a custom title bar there is no drag region, no minimise animation, no window shadow to adapt; without a menu bar every action must live in HTML buttons and shortcuts. Pointing <code>DataPath</code> at the app directory means WebView2's cache, cookies and localStorage stay in <code>%LOCALAPPDATA%\\MicroMD\\webview</code>, never polluting the user's other browser profiles, and uninstalling is deleting a directory. The cost is that this directory grows with use and no cleanup logic exists.</p>

<p>One easily missed detail: when <code>NewWithOptions</code> returns <code>nil</code>, <code>main</code> calls <code>openExternal(page)</code> to open the same page in the default browser and returns. That path is the fallback for "no WebView2 runtime" and gets its own section later. Note that not every initialisation failure returns <code>nil</code> — some error paths inside <code>go-webview2</code> call <code>log.Fatal</code> directly — so the fallback covers window creation failure, not all startup failures.</p>

<h2>Why the interface is written to disk first</h2>

<p><code>//go:embed web/index.html</code> compiles the 29,520-byte interface into the binary, and then the code does not use <code>NavigateToString</code>: it writes the file out and navigates with <code>file://</code>. Startup order:</p>
<ol>
<li><code>appDataDir()</code> reads <code>LOCALAPPDATA</code> and builds <code>%LOCALAPPDATA%\\MicroMD</code>; on failure it falls back to <code>os.UserCacheDir()</code>, then to the relative path <code>MicroMD</code>.</li>
<li>Append <code>app\\index.html</code> and <code>os.MkdirAll(appDir, 0o755)</code>.</li>
<li>Read the existing file and compare it with <code>indexHTML</code>; only on read failure or difference does it <code>os.WriteFile(page, indexHTML, 0o644)</code>.</li>
<li><code>view.Navigate(fileURL(page))</code>, where <code>fileURL</code> uses <code>net/url</code> for drive letters, slashes and escaping.</li>
</ol>

<p>Why not navigate from a string? The observable benefits: the page gets a stable <code>file://</code> origin, which is what lets localStorage persist per origin; <code>&lt;input type="file"&gt;</code>, the File System Access API and relative resource resolution all behave like an ordinary page; and there is no custom scheme to register and no local HTTP server. The last point matters most — a local port brings port conflicts, firewall prompts and the "is this thing online?" question, while one of the project's selling points is that rendering is entirely local.</p>

<p>The write policy is "rewrite only when the bytes differ", not every launch. Good: upgrades update the UI, normal launches cost one 29,520-byte read. Bad: if a user hand-edits <code>%LOCALAPPDATA%\\MicroMD\\app\\index.html</code>, the next launch overwrites it. There is no "use an external UI" switch, deliberately.</p>

<p>Two silent failure points sit on this path: <code>MkdirAll</code> failure returns immediately, and so does <code>WriteFile</code> failure. Neither shows a dialog, so the user sees "double-click does nothing". Under normal permissions this almost never happens, but with an antivirus lock, a full disk or an unwritable <code>LOCALAPPDATA</code> there is nothing to diagnose from. That is the direct cost of "single file, no installer": no setup program checks directory permissions for you.</p>

<h2>Three bindings and the meaning of "save"</h2>

<p>Native and JS share exactly three bindings, all plainly named:</p>

<table>
<thead><tr><th>Binding</th><th>Native behaviour</th><th>Return</th></tr></thead>
<tbody>
<tr><td><code>micromdLoad</code></td><td>If a file path was on the command line, read it and <code>json.Marshal</code> into <code>{name, content}</code></td><td>Empty string when there is no file</td></tr>
<tr><td><code>micromdSave</code></td><td>If <code>docPath</code> is non-empty, <code>os.WriteFile</code> back</td><td><code>ok</code> on success, error <code>no file</code> without a path</td></tr>
<tr><td><code>micromdOpenExternal</code></td><td>Accept only <code>http://</code>, <code>https://</code>, <code>mailto:</code> prefixes, then <code>ShellExecuteW</code></td><td><code>ok</code> when accepted, empty otherwise</td></tr>
</tbody>
</table>

<p><code>micromdLoad</code> is economical: it returns no path, only a filename and content. The frontend sets <code>app.native = true</code> when it receives JSON, so <code>Ctrl+S</code> calls <code>micromdSave</code>. <code>micromdSave</code> takes no path argument and only honours the <code>docPath</code> parsed at startup; when the frontend calls it while there is no native file, the native side rejects it with <code>no file</code> — one layer of defence.</p>

<p>The real semantic fork is in the frontend. <code>native</code> is true in exactly one case: a file path on the command line — or a <code>.md</code> dropped on the exe icon, which Windows also presents as an argument. Every other way of opening goes through <code>setDocument(file, handle)</code>, whose first act is <code>app.native = false</code>. Saving therefore has three paths:</p>
<ul>
<li>Native file: <code>micromdSave</code> writes back to the original path and shows "saved to filename".</li>
<li>File picker: if <code>showOpenFilePicker</code> is available, keep the <code>FileSystemHandle</code> and write through <code>createWritable()</code>; the toast says "saved to handle.name".</li>
<li>Dropped into the window or the <code>&lt;input type="file"&gt;</code> fallback: neither a native path nor a writable handle, so it degrades to a Blob download and says "exported filename".</li>
</ul>

<p>The downgrade is explicit in <code>saveFile()</code>:</p>

<pre><code>if (app.native &amp;&amp; typeof window.micromdSave === 'function') {
  await window.micromdSave(content);
  return;
}
if (app.handle &amp;&amp; app.handle.createWritable) {
  const writable = await app.handle.createWritable();
  await writable.write(content);
  await writable.close();
  return;
}
const link = document.createElement('a');
link.href = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
link.download = app.name || 'untitled.md';
link.click();
</code></pre>

<p>One detail deserves credit: <code>setDocument</code> resets <code>native</code> every time a new file is opened. Open <code>A.md</code> from the command line and the native <code>docPath</code> points at A; then open <code>B.md</code> through the picker. Without the reset, <code>Ctrl+S</code> could write B's content into A. The code ties "can this document be written natively" to "which document this is", avoiding the most dangerous class of mis-write.</p>

<p>The cost is three meanings for one shortcut. The same <code>Ctrl+S</code> means "overwrite the original", "overwrite the picker file" or "download a copy" depending on how the document was opened. The README documents the rules; the UI only distinguishes "saved" from "exported" in a toast, and never warns at open time that this file will not be written back. Not an implementation error — a gap between the safety model and user expectation, expanded below.</p>

<h2>A hand-written parser: two passes and a block state machine</h2>

<p>Between <code>/* md:start */</code> and <code>/* md:end */</code> in <code>web/index.html</code>, roughly lines 166 to 412, sits the parser. No marked, no markdown-it: it implements <code>inline()</code> and <code>blocks()</code> itself. What is worth explaining is <code>inline()</code>'s two-pass design, because it solves two seemingly contradictory problems at once — Markdown syntax must still be recognised, and the source must never inject HTML.</p>

<p>The first pass is not parsing but hiding. Code spans, autolinks and backslash escapes are replaced with placeholders of the form <code>\\u0001</code> + number + <code>\\u0001</code>, with the corresponding HTML pushed into a <code>stash</code> array:</p>

<pre><code>const stash = [];
const put = (html) =&gt; '\\u0001' + (stash.push(html) - 1) + '\\u0001';
t = t.replace(/(\`+)([\\s\\S]*?)\\1/g, (m, ticks, code) =&gt;
  put('&lt;code&gt;' + esc(code.replace(/^ ([\\s\\S]*?) $/, '$1')) + '&lt;/code&gt;'));
t = t.replace(/&lt;((?:https?:\\/\\/|mailto:)[^\\s&lt;&gt;]+)&gt;/g, (m, url) =&gt;
  put('&lt;a href="' + esc(url) + '"&gt;' + esc(url) + '&lt;/a&gt;'));
t = t.replace(/\\\\([\\\\\`*_{}\\[\\]()#+\\-.!&gt;~|])/g, (m, ch) =&gt; put(esc(ch)));
t = esc(t);
</code></pre>

<p>The second pass escapes everything: <code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>"</code> become entities. The third pass recognises images, links, bare URLs and emphasis on the escaped text, then restores the placeholders. The order is the point: escape first and backticks inside code spans plus brackets inside links get mangled by entities, breaking syntax recognition; recognise first and the <code>&lt;a&gt;</code> and <code>&lt;img&gt;</code> you emitted get escaped as user input. Placeholders move "HTML that must survive" out of the text temporarily, so <code>esc</code> only touches real user text, and put it back afterwards.</p>

<p><code>blocks()</code> is a line-by-line state machine. It normalises newlines and expands tabs to four spaces, then in a <code>while</code> loop dispatches by priority: fenced code, horizontal rule, heading, blockquote, table, list, and finally a paragraph. Each block type has its own boundary rules:</p>
<ul>
<li>Fenced code records the number of backticks or tildes; only a closing line of the same character and at least the same length ends it. The body is <code>esc</code>aped wholesale and the language becomes <code>class="language-xxx"</code>.</li>
<li>Headings match <code>^ {0,3}(#{1,6})</code>; the <code>id</code> strips tags and punctuation, then turns whitespace into hyphens. Repeated headings produce repeated ids.</li>
<li>Blockquotes strip the <code>&gt;</code> prefix from consecutive lines and recurse into <code>blocks()</code>, so lists and code fences work inside quotes.</li>
<li>Tables split the header row, read the separator row for alignment, and split body rows on <code>\\|</code> with a negative lookbehind so escaped pipes are not column boundaries.</li>
<li>Lists record the first item's indent and ordered/unordered type, absorb deeper-indented lines into the current item, and recurse <code>blocks()</code> per item, which is what makes nesting work. Task items are matched by <code>^\\[([ xX])\\][ \\t]+</code> and render a disabled checkbox.</li>
</ul>

<p>Paragraphs join consecutive non-blank lines with <code>&lt;br&gt;</code> rather than CommonMark's soft-break-to-space. That is a deliberate choice, not a bug: for a local reader, an author's line break usually means they want a visible break. It also means the output is not strictly CommonMark — copy the same Markdown elsewhere and paragraph shapes may differ.</p>

<p>There is no syntax highlighting: <code>class="language-xxx"</code> is left for future or external styles, and no colour rules exist. There is no sidebar outline either; heading ids are generated but nothing scans them into navigation. The block machine is line-oriented with no AST, so complex nesting, cross-line emphasis and extreme list/table combinations are covered by rules, not by automated tests — the repository contains no <code>*_test.go</code>, and parser quality rests on manual samples.</p>

<h3>Security boundary: escape before parsing</h3>

<p>The parse order is the first boundary. <code>&lt;script&gt;</code>, <code>&lt;iframe&gt;</code> and <code>onerror=</code> in the source pass through <code>esc</code> and appear as text instead of entering the DOM. The second is <code>safeUrl()</code>: before building an image or link, it checks for <code>javascript:</code>, <code>vbscript:</code> or <code>data:text/html</code> prefixes and renders the original text escaped on a hit. The third is click interception: ordinary links and bare URLs in the preview carry <code>target="_blank"</code> and <code>rel="noreferrer noopener"</code>, and a capture-phase handler allows only <code>http(s)</code> and <code>mailto</code>, then <code>preventDefault()</code>s and hands off to <code>micromdOpenExternal</code>; the native side applies the prefix allowlist again before <code>ShellExecuteW</code>. <code>Debug: false</code> removes DevTools and the context menu, narrowing the ways to debug the page from inside the app.</p>

<p>These layers block ordinary script injection, with two caveats worth stating. First, remote images are not disabled: an <code>https://</code> image in the Markdown will still be fetched. "Rendering is local, no network" means the app itself needs no network, not that remote resources inside a document never load. Second, <code>safeUrl</code> blocks only three dangerous schemes; other schemes and relative paths pass through, and relative links under <code>file://</code> resolve against the current page's base — which is exactly the image-path problem below. Also note that ordinary links and bare URLs get <code>target</code> and <code>rel</code>, while the angle-bracket autolink branch does not — though it is still intercepted on click, and the real boundary remains the native allowlist.</p>

<h2>Problem one: missing WebView2 and the browser fallback</h2>

<p><strong>Symptom.</strong> On a Windows machine without the WebView2 runtime, double-clicking the exe opens no app window but the default browser, showing what still looks like MicroMD — except "save" becomes a download and native write-back is gone. <code>micromd.bat</code> offers another route: try Edge, then Chrome, then the system default browser with <code>--app</code> on <code>web/index.html</code>.</p>

<p><strong>Cause.</strong> The whole rendering layer depends on the system-installed WebView2 Runtime. Most Windows 10 and 11 installs have it; LTSC, slimmed images and some managed enterprise fleets may not. When window creation inside <code>webview2.NewWithOptions</code> fails it returns <code>nil</code>, leaving <code>main</code> with <code>openExternal(page)</code> as the only fallback; in that mode <code>typeof window.micromdLoad</code> is not a function, <code>micromdSave</code> does not exist, and saving degrades. The batch file also depends on <code>web/index.html</code> in the source tree, while the release ships only an exe — so it helps people who cloned the repository, not end users.</p>

<p><strong>Fix.</strong> The native layer detects <code>nil</code> and opens the already-written page via <code>ShellExecuteW</code>; the README documents "no runtime, open it in a browser"; the batch file tries Edge, Chrome, then the default browser to reuse whatever Chromium exists. The frontend needs no branch for these modes because it already treats native bindings as optional.</p>

<p><strong>Cost and leftovers.</strong> The two modes have different capabilities, and the UI gives almost no indication which one you are in. Browser mode has no native window, no icon, no direct write-back, and draft localStorage depends on the browser's <code>file://</code> policy. The code never says "please install WebView2" and offers no install link. The fallback covers only window creation failure; some initialisation errors call <code>log.Fatal</code> inside the library, so the process exits silently. The essence of the problem: externalising the engine buys size, and the price is a runtime you do not control.</p>

<h2>Problem two: relative image paths resolve against the wrong base</h2>

<p><strong>Symptom.</strong> A document containing <code>![shot](images/shot.png)</code> renders fine elsewhere and shows a broken image in MicroMD. The URL resolves to <code>%LOCALAPPDATA%\\MicroMD\\app\\images\\shot.png</code> instead of <code>images\\shot.png</code> next to the Markdown file.</p>

<p><strong>Cause.</strong> The page is navigated from the app directory over <code>file://</code>, so the browser's relative base is the directory containing <code>app/index.html</code>. The parser puts <code>src</code> into <code>&lt;img&gt;</code> verbatim; no <code>&lt;base href="..."&gt;</code> is injected and no rewrite against the document path happens. The native binding returns only filename and content, never a directory, so the frontend could not rewrite even if it wanted to. In command-line mode the native side knows <code>docPath</code> — it just never passes it to the page.</p>

<p><strong>Fix.</strong> Not fixed in the current version. Workarounds: absolute paths such as <code>file:///C:/docs/images/shot.png</code>, or <code>data:</code> embedded images; both pass <code>safeUrl</code> and load in WebView2. But absolute paths destroy portability and <code>data:</code> balloons the file, so neither is general.</p>

<p><strong>Cost and leftovers.</strong> This is the direct side effect of writing the UI to disk. Fixing it means returning a directory from <code>micromdLoad</code> and rewriting relative <code>src</code> into absolute <code>file://</code> URLs after render, or injecting a <code>&lt;base&gt;</code> computed from the document directory. The first must handle URL encoding, drive letters, <code>..</code> and mixed slashes; the second affects every relative URL on the page, links included. Worse, dropping a file into the window and the file picker never expose a full path for security reasons — only a File object — so the same document behaves differently depending on how it was opened. That is why this is still a known limit rather than a fixed item.</p>

<h2>Problem three: full re-render and large-file throttling</h2>

<p><strong>Symptom.</strong> Typing into a long document keeps the cursor moving while the preview stutters; the longer the document, the more obvious the lag. Scrolling sometimes desynchronises preview and editor.</p>

<p><strong>Cause.</strong> <code>render()</code> has one line of core logic: <code>preview.innerHTML = MD.render(editor.value)</code>. Every keystroke re-parses the entire document and replaces the whole preview tree's HTML string. No incremental parsing, no DOM diff, no Worker. <code>scheduleRender()</code> only merges several keystrokes inside one frame via <code>requestAnimationFrame</code> — it merges call counts, not work; parsing and layout still run on the main thread at full-document scale.</p>

<p><strong>Fix.</strong> There is a threshold, <code>BIG_DOC = 200000</code>. Above 200k characters <code>scheduleRender()</code> drops <code>requestAnimationFrame</code> for a 150 ms <code>setTimeout</code>, roughly six or seven renders per second; below it, everything renders every frame. A very cheap degradation: no Worker, no incrementality, just a coarser cadence.</p>

<p><strong>Cost and leftovers.</strong> The threshold is character-based and does not map cleanly to parse cost. A 199k-character document still renders every frame; at 201k it suddenly slows, so experience is discontinuous across the boundary. 150 ms is fixed and does not adapt to document size or machine speed; on longer documents a single parse can exceed 150 ms, so throttling reduces frequency but not the length of each stall. Replacing <code>innerHTML</code> also loses the preview selection, reloads images and changes scroll height abruptly; scroll sync computes <code>scrollTop</code> proportionally and goes wrong when heights jump. A real fix needs incremental parsing, virtualised lists, or at least a Worker — all of which significantly raise code size and state-management cost, against this project's size goal.</p>

<h2>Problem four: draft quota and an unused MAX_DRAFT</h2>

<p><strong>Symptom.</strong> The README claims "very long drafts are not written to local storage", but <code>MAX_DRAFT = 1000000</code> is declared and referenced nowhere. Actual behaviour: every keystroke tries to write localStorage, failures are swallowed by <code>try/catch</code>, the UI says nothing, and the draft may already be gone when the window closes.</p>

<p><strong>Cause.</strong> <code>saveDraft()</code> runs 400 ms after typing stops and calls <code>store.set('draft', editor.value)</code> and <code>store.set('name', app.name)</code>; <code>store.set</code> is <code>try { localStorage.setItem(...) } catch (e) {}</code>, so quota errors, private-mode restrictions and serialisation failures never surface. <code>MAX_DRAFT</code> was probably intended for a "skip when over the limit" branch that never got wired up. localStorage quota is typically a few MB per origin depending on the browser and its <code>file://</code> policy; writing the whole document as one string repeatedly means <code>setItem</code> throws past the quota and the draft freezes at the last successful version.</p>

<p><strong>Fix.</strong> No real oversize protection exists, only "exceptions are not fatal". Straightforward options: check <code>editor.value.length &gt; MAX_DRAFT</code> in <code>saveDraft()</code>, skip and toast once; move drafts to IndexedDB; or, in native mode, write a draft file into the app directory. All three are more honest than an empty catch.</p>

<p><strong>Cost and leftovers.</strong> Users are promised automatic draft saving and get best-effort saving. The 400 ms debounce resets on every keystroke, so a write only happens after a pause; type for ten minutes and power off, and everything since the last successful write is at risk. When a native file has unsaved changes the draft is the only recovery path, which makes the "opened from the command line, edited, never saved" scenario the most dangerous. That README sentence should be read as a current defect, not a shipped limit.</p>

<h2>Problem five: size, icon and startup time</h2>

<p><strong>Symptom.</strong> The release exe is 3,323,392 bytes; unstripped 4,943,872; an empty <code>windowsgui</code> Go program is 1,214,976; the embedded <code>WebView2Loader.dll</code> is about 134 KB. Window-handle appearance measured 203 ms, 112 ms and 106 ms on this machine. Also: a locally built exe from plain <code>go build</code> has no custom icon.</p>

<p><strong>Cause.</strong> Size has four parts: the Go runtime and link baseline, the code from <code>go-webview2</code> and <code>golang.org/x/sys</code>, the 134 KB WebView2Loader and the 29,520-byte HTML. <code>-H windowsgui</code> removes the console window; <code>-s -w</code> removes the symbol table and debug info; together they take 4.94 MB down to 3.17 MiB, 32.8%. Icons are not something Go code can carry directly: <code>IconId: 1</code> only looks the icon up by resource id at window creation. The actual icon and version info are written by <code>go-winres</code> into <code>rsrc_windows_amd64.syso</code>, and that file is gitignored. CI installs <code>go-winres</code> and generates resources before building; skip that locally and <code>IconId: 1</code> finds nothing, so the window has no expected icon.</p>

<p><strong>Fix.</strong> The build command is fixed at <code>-trimpath -buildvcs=false -ldflags "-H windowsgui -s -w"</code>; the release workflow installs and generates <code>go-winres</code> output before building and fails if <code>rsrc_windows_amd64.syso</code> is missing; <code>windowSize()</code> clamps a 1280×860 scaling to 92% and 88% of the screen so small displays are not overrun; DPI tries <code>SetProcessDpiAwarenessContext(-4)</code> first and falls back to <code>SetProcessDpiAwareness(2)</code>. The icon itself is generated by <code>tools/icon/main.go</code> with a signed distance field and 4× supersampling, emitting 16 to 256 pixel sizes with no external design file.</p>

<p><strong>Cost and leftovers.</strong> <code>-s -w</code> strips symbols from the release binary, making crash diagnosis harder. Local builds gain a toolchain step: forget the <code>.syso</code> and you get "runs, but no icon", with no compile-time error. The startup numbers are "window handle appeared", not first frame, not finished rendering; after the window appears, WebView2 still creates its environment, navigates to <code>file://</code>, runs the boot script and reads the draft or native document. Calling 106 ms "startup complete" is inaccurate — it says the native window is created quickly. Size is the same story: 3.17 MiB is the result of not shipping an engine, not of compressing Chromium to 3 MB.</p>

<h2>Problem six: save semantics versus user expectations</h2>

<p><strong>Symptom.</strong> Drop <code>notes.md</code> into the window, edit a few lines, press <code>Ctrl+S</code>: the toast says "exported notes.md" and the original is untouched; drop it again and you still see the old content. Drop the same file onto the exe icon instead and <code>Ctrl+S</code> writes back to the original. The UI makes the difference hard to see.</p>

<p><strong>Cause.</strong> The browser security model does not allow a page to write to an arbitrary path from a <code>File</code> object, and <code>native</code> is only true when a startup argument exists. Dropping into the window yields a File API <code>File</code> with no writable handle; the picker yields a <code>FileSystemHandle</code> via <code>showOpenFilePicker</code>, but <code>setDocument</code> still sets <code>native = false</code> and saving goes through the handle, not a native path. The code chose "safe by default": without an explicit native path it never guesses which file to overwrite, preferring to export a copy.</p>

<p><strong>Fix.</strong> The three-level degradation covers three capabilities: native path, writable handle, Blob download. <code>setDocument</code> resets <code>native</code> to prevent cross-file writes; <code>micromdSave</code> rejects path-less calls natively; toasts distinguish "saved to" from "exported". The implementation is not wrong — it turns "can we write back" into a capability probe instead of a memory test for the user.</p>

<p><strong>Cost and leftovers.</strong> The probe result is not surfaced in advance: nothing tells you on drop that this document will be saved by export, and you find out at <code>Ctrl+S</code>. There is no native "save as" dialog either; once in the download branch, WebView2's download policy decides the location, usually the Downloads folder, with a duplicate for identical names. The picker branch depends on the File System Access API, whose availability and permission prompts inside WebView2 vary by runtime; when unavailable it silently falls back to <code>&lt;input type="file"&gt;</code> with no handle at all. No extra branch closes this gap — the UI would have to show the save mode at open time, or expose a native "save as".</p>

<h2>Problem seven: no file watching, no recent files</h2>

<p><strong>Symptom.</strong> Edit <code>notes.md</code> in another editor and MicroMD still shows the old content; press <code>Ctrl+S</code> in native mode and the old content overwrites the external change with no conflict prompt. Close and reopen and there is no recent list; you drag the file in again or retype the command.</p>

<p><strong>Cause.</strong> The native layer reads the file once at startup through <code>micromdLoad</code>, then nothing: no <code>ReadDirectoryChangesW</code>, no <code>fsnotify</code>, no mtime polling. Frontend state is <code>app.name</code>, <code>app.saved</code>, <code>app.handle</code>, <code>app.native</code>; localStorage holds only <code>draft</code>, <code>name</code>, <code>theme</code>, <code>view</code>, <code>split</code> — no path history. There is no single-instance lock or IPC either, so a second instance cannot tell the first that the file changed.</p>

<p><strong>Fix.</strong> No auto-reload and no conflict detection in this version. Workarounds are closing and reopening, re-dropping, or reopening through the picker — none of which warn that the on-disk version moved. The minimal addition would be native polling of <code>docPath</code>'s mtime, notifying the page through a binding or <code>Eval</code>, and showing a bar offering "reload / keep current"; the fuller version uses <code>ReadDirectoryChangesW</code> and handles rename, delete and atomic replace.</p>

<p><strong>Cost and leftovers.</strong> Without watching, the boundary between reader and author disappears. As a pure reader that would be acceptable; but the app also edits and writes back, so stale content overwriting newer content is a real data risk. No recent files pushes the cost of opening onto the file system, which sits oddly with "double-click and it works". Watching also introduces decisions — auto-reload loses unsaved edits, a prompt interrupts reading, and save needs an overwrite-versus-copy policy — so adding it carelessly would be more dangerous than not having it.</p>

<h2>Known limits and design trade-offs</h2>

<p>Pulling the scattered limits into one table, to judge whether this fits your use:</p>

<table>
<thead><tr><th>Limit</th><th>Current state</th><th>Impact</th></tr></thead>
<tbody>
<tr><td>Relative image paths</td><td>Base is the app directory; no <code>&lt;base&gt;</code>, no <code>src</code> rewrite</td><td>Images beside the document do not display</td></tr>
<tr><td>Draft ceiling</td><td><code>MAX_DRAFT</code> declared but unused; quota errors swallowed</td><td>Very long drafts may vanish silently</td></tr>
<tr><td>Large documents</td><td>Full <code>innerHTML</code> replacement; 150 ms throttle past 200k characters</td><td>Typing lags, scroll sync can drift</td></tr>
<tr><td>File changes</td><td>No watching, no polling, no conflict prompt</td><td>External edits can be overwritten</td></tr>
<tr><td>Recent files</td><td>No path history; localStorage stores no path</td><td>Every open requires reselecting</td></tr>
<tr><td>Syntax highlighting</td><td>Only a <code>language-xxx</code> class, no colouriser</td><td>Code blocks are plain text</td></tr>
<tr><td>Outline sidebar</td><td>Heading ids exist, no navigation generated</td><td>Long documents require scrolling</td></tr>
<tr><td>Parser tests</td><td>No <code>*_test.go</code> in the repository</td><td>Edge-case syntax verified by hand</td></tr>
<tr><td>Local build icon</td><td>Depends on <code>go-winres</code> output, which is gitignored</td><td>Skip generation and there is no icon</td></tr>
<tr><td>Startup failure message</td><td><code>MkdirAll</code> and <code>WriteFile</code> failures return silently</td><td>Double-click does nothing in extreme environments</td></tr>
</tbody>
</table>

<p>Most of these are not oversights but "not done within the size and complexity budget". They group into four trade-offs:</p>
<ul>
<li>Externalise the engine for size: no bundled Chromium, accepting a WebView2 dependency and two capability modes.</li>
<li>One file for engineering simplicity: UI, parser and styles in one HTML file, accepting no module split, no build step, no frontend tests.</li>
<li>Full render for short code: one <code>innerHTML</code> line works, accepting a performance ceiling on long documents.</li>
<li>Safe by default: no native path means no write-back, accepting three outcomes from one shortcut.</li>
</ul>

<p>If work continues, data safety should outrank experience polish: wire up the draft ceiling and handle external-change conflicts first, then consider incremental rendering and image bases. Highlighting and an outline are reading comfort and do not risk data loss, so they come later. That ordering is also why this post spends more words on the seven problems than on the features: features can be added, lost data cannot.</p>

<h2>Closing</h2>

<p>MicroMD compresses into three sentences:</p>
<ol>
<li>Size is not one optimisation but a budget split. The 3.17 MiB exe is roughly a 1.21 MB empty <code>windowsgui</code> baseline, three Go modules, a 134 KB WebView2Loader, 29,520 bytes of HTML and link output; the Chromium that was omitted is supplied by the system WebView2.</li>
<li>Shell complexity concentrates in Windows details. Writing to disk for <code>file://</code>, three bindings, save semantics, DPI fallback, icon resources, runtime-missing fallback — each is small, and each can break "double-click and it works".</li>
<li>The hand-written parser's key is order, not syntax coverage. Hide code spans, autolinks and escapes in placeholders, escape everything, then restore. The two-pass design solves "syntax must be recognised" and "source must not inject" at once.</li>
</ol>

<p>It is not a finished product either. Relative images, draft quota, full re-render, file changes, recent files, highlighting, outline, parser tests — all missing or half-done. They are documented as current state because the value of a 3 MB single-file app is not how small it is, but what it cost to get there, and whether those costs are stated honestly.</p>

<h2>Further reading</h2>
<ul>
<li><a href="/en/article/nanobrowser-tauri-webview2/">NanoBrowser: hand-writing an in-process CDP</a> — another desktop shell that leans on the system WebView2, but goes deeper into windows, child webviews and the debugging protocol.</li>
<li><a href="/article/nanoss-windows-ssh-client/">NanoSSH: a Windows SSH client</a> — another single-file delivery wrapping native Windows capability; compare how shell and terminal split the work.</li>
<li><a href="/article/nanodb/">NanoDB: an embedded document database in Go</a> — likewise single-process, few dependencies, complexity pushed inside.</li>
<li><a href="/article/search-inverted-index-to-engine/">From inverted index to search engine</a> — if you want a searchable Markdown knowledge base, continue with the indexing and query path there.</li>
</ul>
`}];e.sort((e,t)=>String(t.date).localeCompare(String(e.date)));var t=new Map(e.map(e=>[e.slug,e]));export{t as n,e as t};