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
<p>A few days ago I put <strong><a href="https://pypi.org/project/aidevops/" rel="noopener noreferrer" target="_blank">aidevops</a></strong> on PyPI. It is the terminal client for an AI DevOps and QA copilot, and <code>pipx install aidevops</code> is the whole installation. The source is on <a href="https://github.com/zhoujungis/ai_devops" rel="noopener noreferrer" target="_blank">GitHub</a> under MIT.</p>

<p>This post covers what problem it solves, how data moves through it, how the risk score is computed, what the model is allowed to do, how each command works, and what I chose not to build.</p>

<ul>
<li>The problem: development data lives in six places that never talk</li>
<li>Architecture: a thin client over a thick server</li>
<li>Getting data in: two cursors and idempotent ingestion</li>
<li>Pinning a commit to a module</li>
<li><code>explain</code>: everything behind one commit</li>
<li>The risk engine: ten signals, each one inspectable</li>
<li>The model layer: five agents, evidence checks, full tracing</li>
<li>Proposals and audit: the model suggests, a person approves</li>
<li>Install and a five-minute tour</li>
<li>Scripting and CI</li>
<li>Tests, types and releases</li>
<li>Where it stands, and what is missing</li>
</ul>

<h2>The problem: development data lives in six places that never talk</h2>

<p>A team generates a lot of development data every day. Requirements sit in Jira. Commits sit in GitHub. Test results sit in CI. Bugs sit in a tracker. Releases sit in a pipeline. All of it exists, and none of it knows about the others.</p>

<p>So every developer does the same manual work. Which modules did this change touch? What broke in those modules before? Do the tests cover them? If we ship this release, where is the risk? The answers are all in the system. Putting them together means five browser tabs, three exported reports, and a memory test.</p>

<p>aidevops links the chain requirement, code, test, bug, release, and answers four questions from it:</p>

<ul>
<li>Where is the risk in this commit, and which signal fired?</li>
<li>What should be regression-tested?</li>
<li>Where did this production incident probably start?</li>
<li>After reading all of it, what does the model suggest?</li>
</ul>

<p>The terminal client exists because people who live in a terminal should not open a browser to read one risk report.</p>

<h2>Architecture: a thin client over a thick server</h2>

<p><code>aidevops</code> is a client. It is a CLI with a full-screen TUI, and it holds no business logic. Every capability is an HTTP call to a Django service backed by PostgreSQL, Redis and pgvector.</p>

<p>That boundary is deliberate, for three reasons.</p>

<p>First, the data is too large for a client. Commit history, test records and bug lists run to hundreds of thousands of rows. The correlation engine, the risk model and the agents all need the whole picture. Putting that on a laptop turns the product into a demo.</p>

<p>Second, credentials stay on the server. Git tokens and model API keys are encrypted with Fernet and stored server-side. The client holds one access token, in its own config directory, mode 0600.</p>

<p>Third, there is only one set of rules. The CLI, the TUI and any future web UI read the same REST API at <code>/api/v1</code>. Logic cannot drift between surfaces, because there is no second copy.</p>

<p>This is why installing the client alone gets you a login failure. That is the architecture, not a bug. To run the backend locally, copy <code>.env.example</code> to <code>.env</code> and run <code>docker compose up -d --build</code>, with Swagger at <code>/api/docs/</code>. Or use <code>make install &amp;&amp; make migrate &amp;&amp; make run</code> plus <code>make worker</code> and <code>make beat</code> for Celery.</p>

<p>The client is Typer for the CLI, Textual for the TUI, Rich for output, and httpx for HTTP. Pure Python, no compiled extensions, Python 3.11 and up.</p>

<h2>Getting data in: two cursors and idempotent ingestion</h2>

<p>Without data, everything downstream is an empty state. Ingestion is the least glamorous part of the system and it has three channels.</p>

<p><strong>GitHub sync.</strong> Two cursors are maintained separately: one for new commits, one for the initial history backfill. Rate limits are handled with backoff, because hitting them is normal rather than exceptional.</p>

<p><strong>Webhooks.</strong> Pushes, CI results and issue changes arrive in real time. Two checks guard the door. An HMAC-SHA256 signature proves the request came from GitHub, and <code>delivery_id</code> idempotency means a redelivered event cannot create a second record.</p>

<p><strong>Scheduled reconciliation.</strong> Webhooks get lost when the network hiccups or the service restarts, so a Celery beat job periodically reconciles and guarantees eventual consistency.</p>

<p>Attribution and test correlation run asynchronously afterwards. The trade-off is explicit: ingestion prefers slow over lost or duplicated, because every downstream calculation assumes the data is trustworthy.</p>

<h2>Pinning a commit to a module</h2>

<p>Correlation starts with a question that sounds trivial: which modules did this commit touch? It is a parsing problem in disguise. <code>src/auth/</code> clearly belongs to auth, but who owns <code>utils/date.py</code>? Should a change under <code>tests/</code> count against a business module?</p>

<p>Attribution runs in three levels, in priority order.</p>

<ol>
<li><strong>Overrides.</strong> A maintainer declares a path-to-module mapping. That decision is final.</li>
<li><strong>Source-root inference.</strong> Without an override, the layout is read the way the language expects: top-level directories under <code>src/</code> or <code>lib/</code>.</li>
<li><strong>Fallback.</strong> Everything else lands in an explicit bucket instead of floating unassigned.</li>
</ol>

<p>The important half is the last sentence of the design: every attribution carries a reason you can read. "This file belongs to auth because it matched the override <code>src/auth/**</code>." Attribution is not a guess. Risk scores and regression candidates are built on that traceable layer.</p>

<h2><code>explain</code>: everything behind one commit</h2>

<p><code>aidevops explain &lt;sha&gt;</code> is the command people try first. Give it a SHA and it returns the commit's place in the chain: the requirement it serves, the modules it changed and how central each one is, the tests and bugs historically entangled with those modules, what went wrong there before, which release contains it, and which of these answers has no data behind it.</p>

<p>That last item matters more than it looks. <code>data_gaps</code> separates "nothing was found" from "we have no data". A tool loses trust fastest by dressing ignorance as a conclusion. In a repository that never ingested test results, "no regression candidates" has to mean "unknown", not "safe". <code>explain</code> makes that distinction part of the output.</p>

<h2>The risk engine: ten signals, each one inspectable</h2>

<p><code>aidevops risk &lt;sha&gt;</code>, and <code>aidevops module-risk &lt;id&gt;</code> for a module view, return a normalized score. The ten signals are listed with their individual contributions, and the contributions sum to the score.</p>

<table>
<thead><tr><th>Signal</th><th>What it measures</th></tr></thead>
<tbody>
<tr><td><code>change_volume</code></td><td>Lines and files changed</td></tr>
<tr><td><code>historical_bug_density</code></td><td>Bug density of the modules involved</td></tr>
<tr><td><code>test_failure_rate</code></td><td>Recent failure rate of the related tests</td></tr>
<tr><td><code>module_centrality</code></td><td>How central those modules are in the dependency graph</td></tr>
<tr><td><code>change_frequency</code></td><td>How often this area changes (hotspot detection)</td></tr>
<tr><td><code>coverage_gap</code></td><td>Coverage on the changed paths</td></tr>
<tr><td><code>open_high_severity_bugs</code></td><td>Open high-severity bugs on those modules</td></tr>
<tr><td><code>test_coverage_gap</code></td><td>Test coverage for the module</td></tr>
<tr><td><code>release_proximity</code></td><td>Distance to the next release; risk costs more near a cut</td></tr>
<tr><td><code>data_freshness_penalty</code></td><td>A penalty when the data is too old to trust</td></tr>
</tbody>
</table>

<p>Three engineering decisions sit under that table.</p>

<p>Weights are configuration, not code. They live on the server and can be tuned in Django admin without a deploy.</p>

<p>Weights inherit in three levels: defaults, then organization, then project. A team that ships constantly can raise <code>release_proximity</code>. A team with weak test infrastructure can emphasize <code>coverage_gap</code>.</p>

<p>Contributions sum to the score. That is not decoration. It turns "I don't believe this number" into a concrete question: find the largest contributor and inspect its input. A black-box score gives you nowhere to look.</p>

<h2>The model layer: five agents, evidence checks, full tracing</h2>

<p>The model layer answers a narrower question than it sounds: given this data, what can be automated safely?</p>

<p>Providers are pluggable. Credentials are managed per organization through <code>aidevops providers</code>, <code>provider-add</code> and <code>provider-verify</code>, over an OpenAI-compatible protocol, with presets for DeepSeek, Qwen and Ollama. Keys are encrypted with Fernet and live on the server, like the Git tokens.</p>

<p>Five agents ship with explicit input and output contracts:</p>

<table>
<thead><tr><th>Agent</th><th>What it does</th></tr></thead>
<tbody>
<tr><td>Code Impact</td><td>Analyzes the blast radius of a commit</td></tr>
<tr><td>Test Generation</td><td>Generates cases along an eleven-category scenario matrix</td></tr>
<tr><td>Bug Investigation</td><td>Builds an evidence chain around one bug</td></tr>
<tr><td>Root Cause Analysis</td><td>Works backwards from symptoms to plausible causes</td></tr>
<tr><td>Requirement Analysis</td><td>Extracts verifiable acceptance points from requirement text</td></tr>
</tbody>
</table>

<p>Start one with <code>aidevops analyse -a test-generation --wait</code>. History is in <code>analyses</code> and <code>job</code>. <code>aidevops trace &lt;id&gt;</code> shows every model call and tool call behind one analysis, with timings, so the agent is never a black box.</p>

<p>Findings carry citations. Anything the model says has to resolve back to real data: a commit, a bug, a test. Unresolvable references are dropped rather than shown. <code>aidevops findings</code>, <code>finding &lt;id&gt;</code> and <code>triage &lt;id&gt; &lt;status&gt;</code> track them from open to confirmed or false positive, and that trail becomes team knowledge.</p>

<p>The tool surface is closed on purpose. The model can call thirteen read-only tools, all scoped to the project. No write operation appears in its tool list. It can see the data and cannot change it, which is the precondition for the next section.</p>

<h2>Proposals and audit: the model suggests, a person approves</h2>

<p>Everything the model produces is a proposal: a batch of tests, an investigation conclusion, a remediation plan. None of it takes effect on its own.</p>

<pre><code>aidevops proposals                 # pending proposals
aidevops approve &lt;id&gt;              # approve; a fixed executor runs it
aidevops reject &lt;id&gt;               # reject; discard
</code></pre>

<p>Three rules make that real. Only <code>approve</code> executes, and the executor is code, not a model decision. No approval means no writes; there is no implicit adoption and no "run by default, undo on objection". Everything lands in <code>AuditLog</code>, queryable with <code>aidevops audit</code>.</p>

<p>For QA the trade-off is easy to state. Tests are a line of defense, and you do not put something that acts on its own on a line of defense.</p>

<p>Multi-tenancy follows the same logic. The tenant id comes from the URL and never from the request body. Non-member access returns 404 without leaking existence, insufficient role returns 403, and every query goes through one <code>scoped_queryset</code> entry point, so there is no place to forget the filter.</p>

<h2>Install and a five-minute tour</h2>

<pre><code>pipx install aidevops        # recommended: isolated venv, command on PATH
# or
pip install aidevops
</code></pre>

<p>Login uses the GitHub device flow: type a code in the browser, never paste a password into a terminal. Remote machines and containers use <code>login --no-browser</code>.</p>

<pre><code>aidevops login                       # GitHub device-flow login
aidevops org-add "My Team"           # first run: create an org (you are admin)
aidevops projects                    # list projects (* marks the current one)
aidevops use qa-copilot-platform     # select a project for later commands
aidevops status                      # backend, account and project
</code></pre>

<p>Connecting a repository is the real entry point. Skip it and <code>commits</code>, <code>risk</code> and <code>explain</code> all return empty state.</p>

<pre><code>aidevops connections                              # list Git credentials
aidevops connection-add -l my-github -t &lt;PAT&gt;     # private repos need repo read
aidevops connection-verify &lt;connection-id&gt;        # verify before using it
aidevops repo-add -c &lt;connection-id&gt; -f owner/repo  # register the repository
aidevops sync &lt;repository-id&gt; --wait              # pull history; ready on return
</code></pre>

<p>A connection is an organization-level credential, managed by admins, and can register several repositories. <code>repo-update</code> adjusts the sync window and attribution depth.</p>

<p>Upgrades run through <code>aidevops upgrade</code>. The client compares itself against PyPI on every run and warns in red when it is behind; the result is cached for 24 hours and <code>AIDEVOPS_NO_UPDATE_CHECK=1</code> turns it off. One guardrail: <code>upgrade</code> refuses to run inside a <code>pip install -e</code> checkout, because that would silently replace your working tree with the released version. It tells you to <code>git pull</code> instead.</p>

<h2>Scripting and CI</h2>

<p><code>--json</code> is a global option and goes before the subcommand:</p>

<pre><code>aidevops --json findings | jq '.[] | select(.severity == "critical")'
</code></pre>

<p>Two details exist for pipelines. In <code>--json</code> mode the upgrade notice goes to stderr, so stdout stays clean. <code>AIDEVOPS_JSON=1</code> is equivalent to the flag. In CI, inject the token with <code>AIDEVOPS_TOKEN</code> and point <code>AIDEVOPS_BASE_URL</code> at a test backend.</p>

<p>A realistic pipeline step: run <code>aidevops --json risk $GITHUB_SHA</code>; if the score crosses a threshold, post the regression candidates as a PR comment.</p>

<h2>Tests, types and releases</h2>

<p>The client lives in the repository's <code>cli/</code> directory.</p>

<pre><code>python -m pytest          # 50 client tests, including Textual pilot TUI tests
python -m ruff check .
python -m mypy ai_devops_cli
</code></pre>

<p>The TUI is tested with Textual's pilot, so keystroke flows and panel switches are covered without manual clicking. The backend has 569 tests, with four network cases skipped by default, none of which need the internet.</p>

<p>Every multi-tenant write path funnels through <code>scoped_queryset</code>, which lets tests assert case by case that tenant A cannot see tenant B's data.</p>

<p>Releases use tag-triggered trusted publishing: push a tag, GitHub Actions builds, and OIDC short-lived credentials upload to PyPI. No local packaging, no long-lived token.</p>

<h2>Where it stands, and what is missing</h2>

<p>It is alpha, and the limits are worth stating.</p>

<p>It needs its own backend. The client has no standalone value; trying the full flow means running the server first.</p>

<p>Single organization with multiple projects works. The cross-organization permission model is still settling.</p>

<p>End-to-end testing against a real model is on the roadmap. Agent tests currently use a stub model: the logic paths are covered, the output contract of real models is not.</p>

<p>Attribution wants one override configured per repository. Zero-config accuracy depends on how well source-root inference guesses.</p>

<p>The next priorities are the terminal detail views, then a real-model smoke test, then validating the Celery worker shape in production.</p>

<p>If you are building a QA platform too, or you care about linking development data and about agents kept on a leash, issues are welcome at <a href="https://github.com/zhoujungis/ai_devops" rel="noopener noreferrer" target="_blank">github.com/zhoujungis/ai_devops</a>. One line to install: <code>pipx install aidevops</code>.</p>
`,
  },
  {
    slug: 'interviewatlas-daily-crawl-llm-analysis',
    zhSlug: 'interviewatlas-daily-crawl-llm-analysis',
    topicSlug: 'projects',
    title: 'InterviewAtlas: crawling 30,000 interview reports and summarizing them with an LLM',
    excerpt:
      'A zero-server data pipeline built on GitHub Actions: incremental crawlers for three sites, idempotent sharded storage, and a two-stage map-reduce over a free model quota — plus the two silent failures that kept it green while doing nothing.',
    date: '2026-11-05',
    readingTime: 28,
    html: `
<blockquote>
<p>Who this is for: people who want long-running data collection on GitHub Actions without renting a server; people designing a crawl → dedupe → render → LLM pipeline; people wondering how to spread one analysis across several days on a free quota.</p>
<p><strong>TL;DR:</strong> the hard part of InterviewAtlas was never writing crawlers. It was three things — deciding what is new <em>before</em> sending the request, making the writes idempotent, and turning model calls into a budgeted, cacheable two-stage pipeline. What actually held it back was not anti-bot defenses either: it was two silent failures — a collector that swallowed exceptions, and an analysis step blocked at compile time by a Python 3.11 f-string restriction.</p>
<p>Reading time: ~28 minutes · Level: advanced</p>
</blockquote>

<strong>Contents</strong>
<ul>
<li>Origin: turning scattered interview reports into a queryable dataset</li>
<li>Architecture: one collection chain, one analysis chain</li>
<li>Data model: one record, three layers of normalization</li>
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

<p>InterviewAtlas is an attempt at that aggregation problem: crawl three sites daily, normalize company and role, dedupe and merge by URL, render a README plus per-company-per-role Markdown, then use a model to summarize each group into four sections — interview process, high-frequency topics, representative questions, preparation advice. Everything runs on GitHub Actions: no server, no database, and the model calls go through GitHub Models' free quota.</p>

<p>At the time of writing the repository holds 41,771 records, 157 companies and 1,634 company-role files; <code>data/interviews</code> contains 158 <code>.json.gz</code> files (35.9 MB) and <code>interviews/</code> holds 1,791 Markdown files (92.3 MB). The source is 22 Python files, with exactly four runtime dependencies: <code>requests</code>, <code>bs4</code>, <code>lxml</code>, <code>PyYAML</code>. What follows is not a feature list — it is the design reasoning and the holes I actually fell into.</p>

<h2>Architecture: one collection chain, one analysis chain</h2>

<p><code>src/main.py</code> contains no crawling logic; it only orchestrates. It calls each source in configured order, hands results to normalization, storage and rendering, then prints how many records were added and how long it took. The real code sits in two layers:</p>

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

<h2>Data model: one record, three layers of normalization</h2>

<p>A report is one JSON object. Few fields, but each has a job:</p>

<table>
<thead><tr><th>Field</th><th>Meaning</th><th>Used for</th></tr></thead>
<tbody>
<tr><td><code>id</code></td><td>URL digest, or source plus external id</td><td>Stable identity</td></tr>
<tr><td><code>source</code></td><td>nowcoder, mianshiya, juejin</td><td>Source statistics</td></tr>
<tr><td><code>external_id</code></td><td>The site's internal id</td><td>Cross-bank merge in Mianshiya</td></tr>
<tr><td><code>title</code> / <code>url</code></td><td>Title and original link</td><td>Display, dedupe key</td></tr>
<tr><td><code>company</code> / <code>position</code></td><td>Normalized company and role</td><td>Sharding, grouping</td></tr>
<tr><td><code>content</code></td><td>Cleaned body text</td><td>Dedupe, model input</td></tr>
<tr><td><code>published_at</code></td><td>Publication date</td><td>Ranking the "newest half"</td></tr>
<tr><td><code>kind</code></td><td>report, question, bank</td><td>Content shape</td></tr>
<tr><td><code>first_seen</code> / <code>last_seen</code></td><td>First and latest sighting</td><td>Retention pruning</td></tr>
</tbody>
</table>

<p>Normalization has three layers. First, company aliases: <code>COMPANY_ALIASES</code> matches the longest string first, so "Alibaba Cloud" is never swallowed by "Alibaba". Second, role detection in a fixed order — backend, frontend, algorithms, testing, product — falling back to "other role". Third, the fallback layer: unknown companies and roles both land in "other", and those are excluded from LLM analysis because they cannot support a meaningful summary. The final 157 companies and 1,634 company-role pairs are what survives those three layers.</p>

<p>The alias table looks dumb and is the precondition for the dataset being usable at all. ByteDance appears as 字节, 字节跳动 and "bytedance" depending on the site; without normalization you get three thin sets of statistics. Yet Alibaba Cloud and Alibaba must stay separate, or the cloud unit's roles get diluted by group-level reports. Longest-match-first solves exactly this containment problem: try the long alias, stop on a hit, and let short aliases fire only when nothing else matched.</p>

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

<p>When the collector gets a search result it first computes the normalized URL. A hit in <code>known_urls</code> means skip — not even a detail request. A URL miss whose body exactly matches something in history is also skipped. What this saves is the expensive detail request, not the search request: searches still page through, but detail calls only land on new or incomplete content.</p>

<p>Merging is by URL, and <code>merge_records()</code> behaves as "old record wins, new record fills blanks": title, source, company and role are overwritten only when missing, the body is replaced only when the new one is longer, and <code>last_seen</code> is refreshed every thirty days rather than daily — otherwise every shard gets rewritten every day because of one timestamp field. The returned <code>new_count</code> and <code>new_records</code> feed the README's "this run" block. Retention is <code>retention_days: 365</code>; anything unseen for a year is dropped.</p>

<p>Deduplication happens in three layers. First, URL normalization: strip the <code>#</code> fragment, the query string and the trailing slash, and lowercase — so a shared link and a tracked link to the same post collapse into one key. Second, Mianshiya's cross-bank merge: one question can be indexed by several banks, merged by <code>external_id</code>, preferring the bank that lets us identify a company. Third, before the model sees anything, <code>_dedupe()</code> filters again on "title + first 120 characters of body", because different sources repost the same report — different URL, near-identical content, invisible to the first two layers.</p>

<pre><code>def record_key(record: dict) -&gt; str:
    url = (record.get("url") or "").split("#")[0].split("?")[0].rstrip("/").lower()
    if url:
        return url
    source = record.get("source") or ""
    external_id = record.get("external_id") or ""
    return f"{source}:{external_id}" if (source or external_id) else (record.get("id") or "")
</code></pre>

<p>The payoff is direct: daily runs only handle increments, and detail requests are spent only on genuinely new posts. The cost is that every run decompresses, deserializes and indexes 35.9 MB of compressed data — a fixed startup cost. One order of magnitude more data and this would need lazy per-company loading.</p>

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

<p>Analysis has a threshold, <code>min_records: 20</code>: a company-role pair needs at least twenty reports to be worth summarizing, otherwise the model can only invent. Groups that qualify get a group-level report first, then group reports roll up into a role-level report — textbook map-reduce.</p>

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

<p>Sample selection has one more fallback: after taking "longest half + newest half", if there are still fewer than eight, keep adding from the remaining longest records up to the cap. Small groups therefore do not end up with two or three samples just because the newest half is all short posts, and length still prioritizes information density. The three caps — eight samples, 1,200 characters, 16,000 characters — are not arbitrary: together they fix the per-prompt token budget, which fixes how many groups 100 calls can cover.</p>

<h2>Cache, budget and invalidation</h2>

<p>Analysis is not recomputed every run. <code>analysis/manifest.json</code> records <code>PROMPT_VERSION</code>, the model name, and per-group counts and generation time. <code>PROMPT_VERSION</code> is currently <code>2026-10-29.1</code>; if either the prompt version or the model name changes, the whole cache is invalidated and everything is recomputed. That is blunt but correct: once the prompt changes, old reports no longer represent the current standard, and partial reuse would leave two standards in the repository.</p>

<p>A single group is recomputed after <code>refresh_after_days: 30</code>, or once its count grows by <code>max(5, 10%)</code>. The first prevents stale material, the second ensures a re-call only happens when enough new samples justify it; for one or two new reports the benefit is below the cost.</p>

<p>Budget is the other hard constraint. The free tier is about 15 RPM, so the config is conservatively <code>rpm: 12</code>, <code>workers: 2</code>, <code>max_calls_per_run: 100</code>. A hundred calls means one day covers only part of the groups, and the rest rolls to tomorrow. Hence the budget split: <code>reserve = min(roles, max_calls // 6)</code> calls are held for role-level summaries before company groups get anything, so groups cannot starve the rollups forever.</p>

<p>Failures are routed by status code. On 429, read <code>x-ratelimit-remaining</code>: zero means the daily quota is gone, so throw <code>QuotaExceeded</code> and stop the whole round instead of retrying pointlessly; non-zero means read <code>Retry-After</code> and retry after at most 60 seconds. A 403 whose body mentions rate limiting is treated the same as quota exhaustion; other 401/403 cases are permission errors pointing at <code>models: read</code>. 5xx gets exponential backoff, three attempts. The point of routing is to separate "waiting will help" from "do not try again today".</p>

<p>Cache decisions happen before the call, in this order: read the manifest, compare prompt version and model name; then per group compare count and generation date; only when both pass is the group skipped. That order ensures a changed version cannot accidentally reuse an old report just because the count did not move. The manifest doubles as an observability surface: which groups were analyzed, with which model, when — no need to dig through Actions logs.</p>

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

<p>Step order matters too: collect, then analyze, then commit once. That way a failed analysis still commits collected data; the reverse could end the run early and lose both. The price is that analysis shares the job with collection and its runtime stacks behind it, inside the same 60-minute timeout. Daily runs currently sit just over 30 minutes, enough headroom — but not a structure that can absorb unlimited new sources.</p>

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

<p><code>analysis/README.md</code> showed "analyzed 0/237" for a long time and <code>analysis/</code> held no company reports. The Actions step named "Analyze with GitHub Models" finished in 0 seconds as a success every time. 237 is the number of groups meeting <code>min_records: 20</code>, so the data side was fine; the analysis side had never actually started.</p>

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

<p>Symptom: some reports land with only one or two hundred characters, ending in an ellipsis; some posts vanish from results entirely. Cause: Nowcoder's search API returns abstracts, not full text; only the detail endpoint has the body. Normalization has <code>_is_truncated()</code>, which treats "under 300 characters and ending in an ellipsis" as a crawl failure and drops it. That heuristic blocks most broken records, and also misfires on genuinely short posts that happen to end with an ellipsis.</p>

<p>Fix: for unseen records, make one detail request and decide after fetching the full body; for records already seen, the content set skips them, so no repeat request. This mechanism is live: the daily run makes 2,900+ detail requests in 18 minutes 46 seconds, and that is where most of the time goes. The cost is that "short but complete" content may still be dropped, with no separate counter — an invisible loss.</p>

<h3>The same post collected three times</h3>

<p>Symptom: one report appears several times, company-role counts inflate, and the model sees duplicated samples. Three causes: the keyword matrix overlaps by design; share links carry <code>#</code>, query parameters and trailing slashes; and Mianshiya indexes one question in several banks. The fix is the three-layer dedupe above — URL normalization, cross-bank merge by <code>external_id</code>, and a title-plus-120-characters filter before the model. The cost is that over-aggressive normalization can merge pages whose query parameters genuinely distinguish content, and the title-plus-opening heuristic can merge two reports that share an opening but diverge later.</p>

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

<p>The time breakdown shows where the bottleneck is: Nowcoder accounts for over 60% of runtime, almost all of it those 2,900+ detail requests; Juejin fetched 3,333 bodies in just over ten minutes because its search API returns full text, so far fewer detail calls are needed. That is exactly why the incremental design must prioritize saving detail requests: search paging is a fixed cost, details scale linearly with new records.</p>

<p>Three judgements. First, the architecture holds under its constraints — zero server, free quota, one run a day: incremental checks eliminate most detail requests, idempotent writes avoid meaningless commits, and the two-stage analysis turns an unfinishable job into a resumable one. Second, its weakest point is not anti-bot defense but the way failure is expressed: a dead source or a compile failure can both leave the pipeline green. Third, the repository will keep growing — the full README re-sort and the history of whole-file rewrites are the main sources — so either accept it or make rendering incremental.</p>

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
  {
    slug: 'micromd-3mb-markdown-reader',
    zhSlug: 'micromd-3mb-markdown-reader',
    topicSlug: 'projects',
    title: 'MicroMD: a 3 MB single-file Markdown reader',
    excerpt:
      'A 3.17 MiB exe, a zero-dependency HTML interface and a hand-written Markdown parser in one process — and seven problems the author chose to document instead of hide.',
    date: '2026-11-05',
    readingTime: 35,
    html: `
<blockquote>
<p>Who this is for: Go and frontend developers building single-file desktop apps on Windows; people evaluating a WebView2 shell or planning to hand-write a Markdown parser; engineers who care about binary size, startup, save semantics and the security boundary.</p>
<p><strong>TL;DR:</strong> MicroMD packs a 3.17 MiB exe, a dependency-free HTML interface and a hand-written Markdown parser into one process. What is worth reviewing is not the small size but four trade-offs: using the system WebView2, hosting the UI on <code>file://</code>, connecting native and JS with exactly three bindings, and a two-pass parser that protects both escaping and placeholders. Seven problems remain unsolved, each with its cost spelled out below.</p>
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

<p>MicroMD's answer is to externalize as much cost as possible: don't bundle a rendering engine, use the system WebView2; introduce no UI framework, write one HTML file; depend on no Markdown library, hand-write a parser in a couple of hundred lines of JavaScript; keep the native layer to window creation, three bindings and argument parsing. The result is a single exe, unzip and run, writing only to its own app-data directory, installing no service and requiring no network.</p>

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

<p>The native entry point is short. <code>main.go</code> initializes DPI, computes the app-data directory, writes the embedded HTML to disk, parses command-line arguments, then creates a window and calls <code>Run()</code>. The window comes from <code>webview2.NewWithOptions</code> with only a few parameters: title <code>MicroMD</code>, size from <code>windowSize()</code>, <code>IconId: 1</code>, <code>Center: true</code>, and <code>DataPath</code> pointing at <code>%LOCALAPPDATA%\\MicroMD\\webview</code>. <code>Debug: false</code> disables the default context menu and DevTools — a release configuration, not a development one. Window style comes from <code>go-webview2</code>'s defaults; the comment says <code>WS_OVERLAPPEDWINDOW</code>, meaning no custom title bar and no native menu bar. Appearance is entirely the system's.</p>

<p>That choice saves work and hard-codes limits. Without a custom title bar there is no drag region, no minimize animation, no window shadow to adapt; without a menu bar every action must live in HTML buttons and shortcuts. Pointing <code>DataPath</code> at the app directory means WebView2's cache, cookies and localStorage stay in <code>%LOCALAPPDATA%\\MicroMD\\webview</code>, never polluting the user's other browser profiles, and uninstalling is deleting a directory. The cost is that this directory grows with use and no cleanup logic exists.</p>

<p>One easily missed detail: when <code>NewWithOptions</code> returns <code>nil</code>, <code>main</code> calls <code>openExternal(page)</code> to open the same page in the default browser and returns. That path is the fallback for "no WebView2 runtime" and gets its own section later. Note that not every initialization failure returns <code>nil</code> — some error paths inside <code>go-webview2</code> call <code>log.Fatal</code> directly — so the fallback covers window creation failure, not all startup failures.</p>

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
<thead><tr><th>Binding</th><th>Native behavior</th><th>Return</th></tr></thead>
<tbody>
<tr><td><code>micromdLoad</code></td><td>If a file path was on the command line, read it and <code>json.Marshal</code> into <code>{name, content}</code></td><td>Empty string when there is no file</td></tr>
<tr><td><code>micromdSave</code></td><td>If <code>docPath</code> is non-empty, <code>os.WriteFile</code> back</td><td><code>ok</code> on success, error <code>no file</code> without a path</td></tr>
<tr><td><code>micromdOpenExternal</code></td><td>Accept only <code>http://</code>, <code>https://</code>, <code>mailto:</code> prefixes, then <code>ShellExecuteW</code></td><td><code>ok</code> when accepted, empty otherwise</td></tr>
</tbody>
</table>

<p><code>micromdLoad</code> is economical: it returns no path, only a filename and content. The frontend sets <code>app.native = true</code> when it receives JSON, so <code>Ctrl+S</code> calls <code>micromdSave</code>. <code>micromdSave</code> takes no path argument and only honours the <code>docPath</code> parsed at startup; when the frontend calls it while there is no native file, the native side rejects it with <code>no file</code> — one layer of defense.</p>

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

<p>Between <code>/* md:start */</code> and <code>/* md:end */</code> in <code>web/index.html</code>, roughly lines 166 to 412, sits the parser. No marked, no markdown-it: it implements <code>inline()</code> and <code>blocks()</code> itself. What is worth explaining is <code>inline()</code>'s two-pass design, because it solves two seemingly contradictory problems at once — Markdown syntax must still be recognized, and the source must never inject HTML.</p>

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

<p>The second pass escapes everything: <code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>"</code> become entities. The third pass recognizes images, links, bare URLs and emphasis on the escaped text, then restores the placeholders. The order is the point: escape first and backticks inside code spans plus brackets inside links get mangled by entities, breaking syntax recognition; recognize first and the <code>&lt;a&gt;</code> and <code>&lt;img&gt;</code> you emitted get escaped as user input. Placeholders move "HTML that must survive" out of the text temporarily, so <code>esc</code> only touches real user text, and put it back afterwards.</p>

<p><code>blocks()</code> is a line-by-line state machine. It normalizes newlines and expands tabs to four spaces, then in a <code>while</code> loop dispatches by priority: fenced code, horizontal rule, heading, blockquote, table, list, and finally a paragraph. Each block type has its own boundary rules:</p>
<ul>
<li>Fenced code records the number of backticks or tildes; only a closing line of the same character and at least the same length ends it. The body is <code>esc</code>aped wholesale and the language becomes <code>class="language-xxx"</code>.</li>
<li>Headings match <code>^ {0,3}(#{1,6})</code>; the <code>id</code> strips tags and punctuation, then turns whitespace into hyphens. Repeated headings produce repeated ids.</li>
<li>Blockquotes strip the <code>&gt;</code> prefix from consecutive lines and recurse into <code>blocks()</code>, so lists and code fences work inside quotes.</li>
<li>Tables split the header row, read the separator row for alignment, and split body rows on <code>\\|</code> with a negative lookbehind so escaped pipes are not column boundaries.</li>
<li>Lists record the first item's indent and ordered/unordered type, absorb deeper-indented lines into the current item, and recurse <code>blocks()</code> per item, which is what makes nesting work. Task items are matched by <code>^\\[([ xX])\\][ \\t]+</code> and render a disabled checkbox.</li>
</ul>

<p>Paragraphs join consecutive non-blank lines with <code>&lt;br&gt;</code> rather than CommonMark's soft-break-to-space. That is a deliberate choice, not a bug: for a local reader, an author's line break usually means they want a visible break. It also means the output is not strictly CommonMark — copy the same Markdown elsewhere and paragraph shapes may differ.</p>

<p>There is no syntax highlighting: <code>class="language-xxx"</code> is left for future or external styles, and no color rules exist. There is no sidebar outline either; heading ids are generated but nothing scans them into navigation. The block machine is line-oriented with no AST, so complex nesting, cross-line emphasis and extreme list/table combinations are covered by rules, not by automated tests — the repository contains no <code>*_test.go</code>, and parser quality rests on manual samples.</p>

<h3>Security boundary: escape before parsing</h3>

<p>The parse order is the first boundary. <code>&lt;script&gt;</code>, <code>&lt;iframe&gt;</code> and <code>onerror=</code> in the source pass through <code>esc</code> and appear as text instead of entering the DOM. The second is <code>safeUrl()</code>: before building an image or link, it checks for <code>javascript:</code>, <code>vbscript:</code> or <code>data:text/html</code> prefixes and renders the original text escaped on a hit. The third is click interception: ordinary links and bare URLs in the preview carry <code>target="_blank"</code> and <code>rel="noreferrer noopener"</code>, and a capture-phase handler allows only <code>http(s)</code> and <code>mailto</code>, then <code>preventDefault()</code>s and hands off to <code>micromdOpenExternal</code>; the native side applies the prefix allowlist again before <code>ShellExecuteW</code>. <code>Debug: false</code> removes DevTools and the context menu, narrowing the ways to debug the page from inside the app.</p>

<p>These layers block ordinary script injection, with two caveats worth stating. First, remote images are not disabled: an <code>https://</code> image in the Markdown will still be fetched. "Rendering is local, no network" means the app itself needs no network, not that remote resources inside a document never load. Second, <code>safeUrl</code> blocks only three dangerous schemes; other schemes and relative paths pass through, and relative links under <code>file://</code> resolve against the current page's base — which is exactly the image-path problem below. Also note that ordinary links and bare URLs get <code>target</code> and <code>rel</code>, while the angle-bracket autolink branch does not — though it is still intercepted on click, and the real boundary remains the native allowlist.</p>

<h2>Problem one: missing WebView2 and the browser fallback</h2>

<p><strong>Symptom.</strong> On a Windows machine without the WebView2 runtime, double-clicking the exe opens no app window but the default browser, showing what still looks like MicroMD — except "save" becomes a download and native write-back is gone. <code>micromd.bat</code> offers another route: try Edge, then Chrome, then the system default browser with <code>--app</code> on <code>web/index.html</code>.</p>

<p><strong>Cause.</strong> The whole rendering layer depends on the system-installed WebView2 Runtime. Most Windows 10 and 11 installs have it; LTSC, slimmed images and some managed enterprise fleets may not. When window creation inside <code>webview2.NewWithOptions</code> fails it returns <code>nil</code>, leaving <code>main</code> with <code>openExternal(page)</code> as the only fallback; in that mode <code>typeof window.micromdLoad</code> is not a function, <code>micromdSave</code> does not exist, and saving degrades. The batch file also depends on <code>web/index.html</code> in the source tree, while the release ships only an exe — so it helps people who cloned the repository, not end users.</p>

<p><strong>Fix.</strong> The native layer detects <code>nil</code> and opens the already-written page via <code>ShellExecuteW</code>; the README documents "no runtime, open it in a browser"; the batch file tries Edge, Chrome, then the default browser to reuse whatever Chromium exists. The frontend needs no branch for these modes because it already treats native bindings as optional.</p>

<p><strong>Cost and leftovers.</strong> The two modes have different capabilities, and the UI gives almost no indication which one you are in. Browser mode has no native window, no icon, no direct write-back, and draft localStorage depends on the browser's <code>file://</code> policy. The code never says "please install WebView2" and offers no install link. The fallback covers only window creation failure; some initialization errors call <code>log.Fatal</code> inside the library, so the process exits silently. The essence of the problem: externalizing the engine buys size, and the price is a runtime you do not control.</p>

<h2>Problem two: relative image paths resolve against the wrong base</h2>

<p><strong>Symptom.</strong> A document containing <code>![shot](images/shot.png)</code> renders fine elsewhere and shows a broken image in MicroMD. The URL resolves to <code>%LOCALAPPDATA%\\MicroMD\\app\\images\\shot.png</code> instead of <code>images\\shot.png</code> next to the Markdown file.</p>

<p><strong>Cause.</strong> The page is navigated from the app directory over <code>file://</code>, so the browser's relative base is the directory containing <code>app/index.html</code>. The parser puts <code>src</code> into <code>&lt;img&gt;</code> verbatim; no <code>&lt;base href="..."&gt;</code> is injected and no rewrite against the document path happens. The native binding returns only filename and content, never a directory, so the frontend could not rewrite even if it wanted to. In command-line mode the native side knows <code>docPath</code> — it just never passes it to the page.</p>

<p><strong>Fix.</strong> Not fixed in the current version. Workarounds: absolute paths such as <code>file:///C:/docs/images/shot.png</code>, or <code>data:</code> embedded images; both pass <code>safeUrl</code> and load in WebView2. But absolute paths destroy portability and <code>data:</code> balloons the file, so neither is general.</p>

<p><strong>Cost and leftovers.</strong> This is the direct side effect of writing the UI to disk. Fixing it means returning a directory from <code>micromdLoad</code> and rewriting relative <code>src</code> into absolute <code>file://</code> URLs after render, or injecting a <code>&lt;base&gt;</code> computed from the document directory. The first must handle URL encoding, drive letters, <code>..</code> and mixed slashes; the second affects every relative URL on the page, links included. Worse, dropping a file into the window and the file picker never expose a full path for security reasons — only a File object — so the same document behaves differently depending on how it was opened. That is why this is still a known limit rather than a fixed item.</p>

<h2>Problem three: full re-render and large-file throttling</h2>

<p><strong>Symptom.</strong> Typing into a long document keeps the cursor moving while the preview stutters; the longer the document, the more obvious the lag. Scrolling sometimes desynchronizes preview and editor.</p>

<p><strong>Cause.</strong> <code>render()</code> has one line of core logic: <code>preview.innerHTML = MD.render(editor.value)</code>. Every keystroke re-parses the entire document and replaces the whole preview tree's HTML string. No incremental parsing, no DOM diff, no Worker. <code>scheduleRender()</code> only merges several keystrokes inside one frame via <code>requestAnimationFrame</code> — it merges call counts, not work; parsing and layout still run on the main thread at full-document scale.</p>

<p><strong>Fix.</strong> There is a threshold, <code>BIG_DOC = 200000</code>. Above 200k characters <code>scheduleRender()</code> drops <code>requestAnimationFrame</code> for a 150 ms <code>setTimeout</code>, roughly six or seven renders per second; below it, everything renders every frame. A very cheap degradation: no Worker, no incrementality, just a coarser cadence.</p>

<p><strong>Cost and leftovers.</strong> The threshold is character-based and does not map cleanly to parse cost. A 199k-character document still renders every frame; at 201k it suddenly slows, so experience is discontinuous across the boundary. 150 ms is fixed and does not adapt to document size or machine speed; on longer documents a single parse can exceed 150 ms, so throttling reduces frequency but not the length of each stall. Replacing <code>innerHTML</code> also loses the preview selection, reloads images and changes scroll height abruptly; scroll sync computes <code>scrollTop</code> proportionally and goes wrong when heights jump. A real fix needs incremental parsing, virtualized lists, or at least a Worker — all of which significantly raise code size and state-management cost, against this project's size goal.</p>

<h2>Problem four: draft quota and an unused MAX_DRAFT</h2>

<p><strong>Symptom.</strong> The README claims "very long drafts are not written to local storage", but <code>MAX_DRAFT = 1000000</code> is declared and referenced nowhere. Actual behavior: every keystroke tries to write localStorage, failures are swallowed by <code>try/catch</code>, the UI says nothing, and the draft may already be gone when the window closes.</p>

<p><strong>Cause.</strong> <code>saveDraft()</code> runs 400 ms after typing stops and calls <code>store.set('draft', editor.value)</code> and <code>store.set('name', app.name)</code>; <code>store.set</code> is <code>try { localStorage.setItem(...) } catch (e) {}</code>, so quota errors, private-mode restrictions and serialization failures never surface. <code>MAX_DRAFT</code> was probably intended for a "skip when over the limit" branch that never got wired up. localStorage quota is typically a few MB per origin depending on the browser and its <code>file://</code> policy; writing the whole document as one string repeatedly means <code>setItem</code> throws past the quota and the draft freezes at the last successful version.</p>

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
<li>Externalize the engine for size: no bundled Chromium, accepting a WebView2 dependency and two capability modes.</li>
<li>One file for engineering simplicity: UI, parser and styles in one HTML file, accepting no module split, no build step, no frontend tests.</li>
<li>Full render for short code: one <code>innerHTML</code> line works, accepting a performance ceiling on long documents.</li>
<li>Safe by default: no native path means no write-back, accepting three outcomes from one shortcut.</li>
</ul>

<p>If work continues, data safety should outrank experience polish: wire up the draft ceiling and handle external-change conflicts first, then consider incremental rendering and image bases. Highlighting and an outline are reading comfort and do not risk data loss, so they come later. That ordering is also why this post spends more words on the seven problems than on the features: features can be added, lost data cannot.</p>

<h2>Closing</h2>

<p>MicroMD compresses into three sentences:</p>
<ol>
<li>Size is not one optimization but a budget split. The 3.17 MiB exe is roughly a 1.21 MB empty <code>windowsgui</code> baseline, three Go modules, a 134 KB WebView2Loader, 29,520 bytes of HTML and link output; the Chromium that was omitted is supplied by the system WebView2.</li>
<li>Shell complexity concentrates in Windows details. Writing to disk for <code>file://</code>, three bindings, save semantics, DPI fallback, icon resources, runtime-missing fallback — each is small, and each can break "double-click and it works".</li>
<li>The hand-written parser's key is order, not syntax coverage. Hide code spans, autolinks and escapes in placeholders, escape everything, then restore. The two-pass design solves "syntax must be recognized" and "source must not inject" at once.</li>
</ol>

<p>It is not a finished product either. Relative images, draft quota, full re-render, file changes, recent files, highlighting, outline, parser tests — all missing or half-done. They are documented as current state because the value of a 3 MB single-file app is not how small it is, but what it cost to get there, and whether those costs are stated honestly.</p>

<h2>Further reading</h2>
<ul>
<li><a href="/en/article/nanobrowser-tauri-webview2/">NanoBrowser: hand-writing an in-process CDP</a> — another desktop shell that leans on the system WebView2, but goes deeper into windows, child webviews and the debugging protocol.</li>
<li><a href="/article/nanoss-windows-ssh-client/">NanoSSH: a Windows SSH client</a> — another single-file delivery wrapping native Windows capability; compare how shell and terminal split the work.</li>
<li><a href="/article/nanodb/">NanoDB: an embedded document database in Go</a> — likewise single-process, few dependencies, complexity pushed inside.</li>
<li><a href="/article/search-inverted-index-to-engine/">From inverted index to search engine</a> — if you want a searchable Markdown knowledge base, continue with the indexing and query path there.</li>
</ul>
`,
  },
  {
    slug: 'halo-music-square-architecture',
    zhSlug: 'halo-music-square-architecture',
    topicSlug: 'projects',
    title: 'Halo Music: a multi-source music app on Cloudflare Pages, D1 and Electron',
    excerpt:
      'One static page, serverless functions, SQLite as a cache, and the same web app wrapped in an Electron shell — with the domain model that keeps four upstream platforms from leaking into the UI.',
    date: '2026-10-16',
    readingTime: 30,
    html: `
<p>I wanted a music tool that works the moment you open a browser: type a song name, get results from several platforms at once; click a track and it plays with scrolling lyrics; keep favourites and organize them into playlists. That idea became <a href="https://github.com/zhoujungis/halo_music" rel="noopener noreferrer" target="_blank">HALO Music</a>, my own music square.</p>

<p>The point was never to rebuild one platform's page. It was to fit multiple audio sources, a browser player, user data and a desktop wrapper into one lightweight architecture. The frontend is a static page deployable straight to Cloudflare Pages; Pages Functions provide the API; D1 holds accounts, libraries and caches; and Electron wraps the same web app as a Windows desktop client.</p>

<blockquote>
<p>The project is for learning, research and demonstration. Music content, audio URLs, lyrics and cover art belong to the respective platforms and original authors; use must comply with local law, upstream terms of service and copyright policy.</p>
</blockquote>

<h2>1. The architecture at a glance</h2>

<p>There is no separate frontend and desktop player. Both the browser and Electron load the same <code>index.html</code>; the only difference is whether a native window wraps it:</p>

<pre><code>flowchart TB
    subgraph Client[Client]
        Browser[Browser]
        Electron[Electron BrowserWindow]
        UI[index.html\\nHTML + CSS + runtime JS]
        Audio[HTMLAudioElement]
        Local[localStorage\\ntheme / favourites / playlists]
    end
    subgraph Cloudflare[Cloudflare Pages]
        Static[Pages static assets]
        Functions[Pages Functions\\n/api/*]
        D1[(D1 SQLite)]
    end
    subgraph Sources[Upstream platforms]
        Netease[Netease Cloud Music]
        QQ[QQ Music]
        Kuwo[Kuwo Music]
        Joox[JOOX / fallback resolver]
        Qishui[Qishui playlist pages]
    end
    Browser --&gt; Static
    Electron --&gt; UI
    Static --&gt; UI
    UI --&gt; Audio
    UI --&gt; Local
    UI --&gt; Functions
    Functions --&gt; D1
    Functions --&gt; QQ
    Functions --&gt; Kuwo
    Functions --&gt; Qishui
    UI --&gt; Netease
    UI --&gt; Joox
    Functions --&gt; Joox
</code></pre>

<p>The split buys three things: static assets ride Pages' CDN; requests needing keys, signatures or CORS handling live in Functions; and player state stays in the browser, so audio never streams through my own server.</p>

<h2>2. Frontend: one static entry point carrying a whole player</h2>
<h3>2.1 Driving interaction with plain runtime state</h3>

<p>To keep deployment and the desktop build small, there is no large UI framework. Structure, styles and runtime logic live in <code>index.html</code>, <code>styles.css</code> and <code>app.js</code>. A handful of variables describe the current session:</p>

<pre><code>let tracks = []
let currentIndex = 0
let currentList = tracks
let isPlaying = false
let repeatOn = true
let liked = new Set(JSON.parse(localStorage.getItem("halo-liked-tracks") || "[]"))
const audio = new Audio()
</code></pre>

<p>Search, player, lyrics and queue all re-render around that state. Track rows, album cards and player buttons use event delegation, so clicking a song only updates the index, the playback context and the <code>&lt;audio&gt;</code> element — never a second player instance.</p>

<h3>2.2 Parallel multi-source search, then one merge and dedupe</h3>

<p>The platforms' search responses differ. Each adapter extracts song id, title, artist, album, cover and duration into a common object. In the browser, search fans out to Netease, QQ Music and Kuwo at once:</p>

<pre><code>const results = await Promise.allSettled([
  searchNetease(keyword, limit),
  searchQQ(keyword, limit),
  searchKuwo(keyword, limit),
])

const groups = results.map((item) =&gt;
  item.status === "fulfilled" ? item.value : [],
)
return interleave(groups)
</code></pre>

<p><code>Promise.allSettled</code> is deliberate: when one source is temporarily down the others should still show. <code>interleave</code> alternates platforms so the first half of the list is not all from one place, and <code>dedupeTracks</code> filters on platform id plus a normalized "title + artist" key. Normalization strips spaces, hyphens and brackets so the same recording does not appear three times.</p>

<p>Server-side adapters also cover QQ, Kuwo and JOOX — cases that need proxying or a fallback resolver — while playlist import additionally supports public Netease, Qishui and QQ links. That lets "search indexing" and "audio URL resolution" evolve separately: one platform changing its API cannot take every feature down with it.</p>

<h3>2.3 Lazy detail loading, audio resolved only on play</h3>

<p>Search results carry only the metadata needed to render a list; real playback URLs for QQ and Kuwo tracks are fetched when the user presses play. <code>ensureTrackDetails</code> picks an adapter from <code>track.source</code> and collapses concurrent requests for the same track through <code>loadingPromise</code>:</p>

<pre><code>async function ensureTrackDetails(track) {
  if (track.detailsLoaded &amp;&amp; track.audioUrl) return true
  if (track.loadingPromise) return track.loadingPromise

  track.loadingPromise = resolveBySource(track)
    .finally(() =&gt; { track.loadingPromise = null })
  return track.loadingPromise
}
</code></pre>

<p>Only after an address arrives does the code set <code>audio.src</code> and call <code>audio.load()</code>. On failure it never writes short-lived URLs permanently into favourites or playlists; it offers refresh, an alternate candidate, or a switch to another source. Netease paths go through a compatible resolver for both URL and lyrics, while QQ and Kuwo prefer <code>/api/music</code>.</p>

<h3>2.4 One clock for LRC lyrics and the player timeline</h3>

<p>Lyric sync does not start another timer; it listens to the <code>&lt;audio&gt;</code> element's <code>timeupdate</code>. The parser handles multiple time tags per line and both <code>mm:ss.xx</code> and <code>mm:ss:xxx</code> forms:</p>

<pre><code>function parseLrc(text) {
  const lines = []
  for (const line of String(text || "").split(/\\r?\\n/)) {
    const tags = [...line.matchAll(/\\[(\\d{1,3}):(\\d{1,2})(?:[.:](\\d{1,3}))?\\]/g)]
    const content = line.replace(/\\[[^\\]]+\\]/g, "").trim()
    if (!content) continue
    for (const tag of tags) {
      const fraction = tag[3] ? Number(\`0.\${tag[3].padEnd(3, "0").slice(0, 3)}\`) : 0
      lines.push({ time: Number(tag[1]) * 60 + Number(tag[2]) + fraction, text: content })
    }
  }
  return lines.sort((a, b) =&gt; a.time - b.time)
}
</code></pre>

<p>Rendering walks backwards to the last line with <code>line.time &lt;= audio.currentTime</code> and marks it active; clicking a lyric line sets <code>audio.currentTime</code> to that timestamp. Progress bar, lyric highlight and current track therefore stay consistent by construction.</p>

<h3>2.5 Responsive layout is not just shrinking</h3>

<p>Desktop is a three-column workspace: search / player and lyrics / queue. Mobile switches to bottom navigation between search, lyrics and library. Layout uses CSS Grid, media queries and independent scroll containers, so lyrics and queue never push the page past the viewport. Theme, favourites and playlists sit in <code>localStorage</code>, so search and local organization work before you ever sign in.</p>

<h2>3. HALO Track: the data model that isolates platform differences</h2>

<p>If every component read platform-specific fields, adding a source would turn into conditional hell. The project therefore defines one track shape:</p>

<pre><code>{
  uid: "qq-song-id",
  source: "qq",              // netease / qq / kuwo / joox
  title: "Song title",
  artist: "Artist",
  album: "Album",
  cover: "https://...",
  songid: "platform song id",
  quality: "lossless",
  qualityLabel: "Lossless",
  pay: "",
  audioUrl: null,            // runtime field
  lrc: null                  // runtime field
}
</code></pre>

<p>The view layer only reads stable fields — <code>title</code>, <code>artist</code>, <code>album</code>, <code>cover</code>, <code>source</code>; adapters translate platform responses into them; the detail layer fills <code>audioUrl</code> and lyrics by <code>source</code>. <code>serializeTrack()</code> filters out short-lived audio URLs, lyrics and detail state, persisting only reusable identifiers and display data, so expired resources never reach localStorage or D1.</p>

<h2>4. Backend: Pages Functions as adapter and safety boundary</h2>
<h3>4.1 Files as routes</h3>

<p>Cloudflare Pages maps files under <code>functions/api/</code> to <code>/api/*</code>. The main endpoints fall into three groups:</p>

<table>
<thead><tr><th>Endpoint</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>GET /api/music</code></td><td>Search, detail, audio resolution, proxying and caching</td></tr>
<tr><td><code>POST /api/register</code>, <code>POST /api/login</code>, <code>POST /api/logout</code></td><td>Accounts and sessions</td></tr>
<tr><td><code>GET/PUT /api/library</code></td><td>Read or overwrite the current user's favourites and playlists</td></tr>
<tr><td><code>POST /api/import-playlist</code></td><td>Resolve a public playlist server-side into HALO Tracks</td></tr>
<tr><td><code>GET /api/me</code></td><td>Username for the current session</td></tr>
</tbody>
</table>

<p><code>/api/music</code> dispatches on <code>action</code>: <code>qq_search</code>, <code>kuwo_search</code>, <code>qq_detail</code>, <code>kuwo_detail</code>, <code>qq_audio</code> and <code>kuwo_audio</code>. The server caps keyword length, result count and upstream timeouts so one misbehaving platform cannot occupy the whole Function invocation.</p>

<h3>4.2 Caching and verifying resolved addresses</h3>

<p>Audio resolution hits short-lived URLs, dead candidates and upstream throttling far more often than search, so the strategy is candidates plus playability checks plus caching:</p>
<ol>
<li>Build a cache key from song id, quality and duration.</li>
<li>Check the Worker's in-process LRU, then the shared D1 cache.</li>
<li>On a miss, try the primary endpoint and a fallback.</li>
<li>Validate the returned address with an HTTP request, song id and duration.</li>
<li>Store the verified candidate; on playback failure, force a re-resolve with <code>refresh=1</code>.</li>
</ol>

<p>The in-memory LRU holds about 500 entries, search caching defaults to roughly 45 seconds, and D1 acts as the cross-request, cross-instance second level. Only reusable resolution results are cached — audio files are never copied into my storage, and temporary URLs are never treated as permanent links.</p>

<h3>4.3 Importing public playlists server-side</h3>

<p>Public playlist import lives in <code>import-playlist.js</code>, because link resolution, pagination and upstream requests belong on the server. The Function recognizes public Netease, Qishui and QQ links, resolves official short links when needed, reads song information from pages or APIs, and converts everything into HALO Tracks.</p>

<p>Import caps are explicit: at most the first 1,200 tracks for a QQ playlist, 2,000 for Netease, and a 4 MB page-read limit for Qishui. Bounding request volume protects upstream and keeps the Function inside its execution budget.</p>

<h2>5. How does the D1 database do local-first sync?</h2>

<p>D1 is SQLite. The core tables:</p>

<table>
<thead><tr><th>Table</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>music_users</code></td><td>Username, password hash and random salt</td></tr>
<tr><td><code>music_sessions</code></td><td>Session token, username and expiry</td></tr>
<tr><td><code>music_libraries</code></td><td>User favourites and user playlists as JSON</td></tr>
<tr><td><code>music_cache</code></td><td>Shared audio and detail cache</td></tr>
<tr><td><code>search_cache</code></td><td>Short-lived search cache</td></tr>
</tbody>
</table>

<p>Favourites and playlists are "write localStorage first, sync to D1 asynchronously": signed out, the data belongs to that browser; signed in, the page submits the library to <code>/api/library</code>, and a weak connection still leaves local data usable. The cloud library is stored as JSON — simple, appropriate to a personal project. Collaboration, incremental sync or audit trails would warrant splitting tracks, playlists and the relation between them into proper tables.</p>

<h2>6. How does the Electron app keep accounts safe?</h2>

<p>Passwords are never stored in plaintext. The server uses Web Crypto PBKDF2-SHA-256 with 100,000 iterations and a 16-byte random salt, writing only hash and salt to D1. After login a random UUID becomes a session token in an <code>HttpOnly; Secure; SameSite=Lax</code> cookie, valid for 30 days by default.</p>

<p>The desktop security goal is "a window shell only, never Node privileges for the page":</p>

<pre><code>webPreferences: {
  preload: path.join(__dirname, "preload.cjs"),
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: true,
}
</code></pre>

<p><code>preload.cjs</code> exposes only minimal platform information through <code>contextBridge</code>, and external links open in the system browser. The main process creates a 1440×920 window (minimum 960×640) and can point at a custom Pages domain via <code>HALO_MUSIC_URL</code> or <code>--url=</code>.</p>

<h2>7. Tests, development and deployment</h2>

<p>Local development needs Node.js 20 LTS or newer, npm and Wrangler 4:</p>

<pre><code>npm install
npx wrangler d1 execute halo-music-db --local --file schema.sql
npm run dev
</code></pre>

<p>Tests use Node's built-in <code>node:test</code> and cover sessions, favourites and playlist persistence, field normalization across platforms, playlist link recognition, QQ signing and pagination, LRC parsing, audio container detection, next-track playback context, plus a syntax check of the browser's inline scripts:</p>

<pre><code>npm test
</code></pre>

<p>Deployment publishes the static files and Functions together, with D1 bound in <code>wrangler.toml</code>:</p>

<pre><code>name = "halo-music"
compatibility_date = "2025-01-01"
pages_build_output_dir = "."

[[d1_databases]]
binding = "DB"
database_name = "halo-music-db"
database_id = "your D1 database_id"
</code></pre>

<p>The desktop build reuses the deployed Pages URL, so there is no second local HTTP server:</p>

<pre><code>npm run desktop:dev
npm run desktop:all
npm run desktop:portable
</code></pre>

<p>Windows installers and the portable build land in <code>release/</code>; the app id is <code>com.halomusic.desktop</code>.</p>

<h2>8. What the project taught me</h2>

<p>What is worth recording is not any single platform API but several reusable engineering decisions:</p>
<ol>
<li><strong>Unify the domain model before adding sources.</strong> HALO Track keeps platform differences inside adapters; the player and playlist logic never learn upstream field names.</li>
<li><strong>Separate search from playback resolution.</strong> Search optimizes for parallelism and tolerance; resolution optimizes for validation, caching and retry. Their performance goals differ.</li>
<li><strong>Never treat temporary resources as database facts.</strong> Audio URLs expire; store the song id and display data, and re-resolve on play.</li>
<li><strong>Local-first removes dependence on login and network.</strong> localStorage makes favourites usable on a weak connection; D1 adds cross-device sync for signed-in users.</li>
<li><strong>Reuse the web build on desktop.</strong> Electron supplies a native window and a security boundary; business logic, player and API stay one implementation.</li>
</ol>

<p>Clear boundaries remain: upstream APIs and audio addresses can change without warning, Functions execution time limits bulk import, and the frontend entry point could still be split into modules. The more valuable next steps are a finer-grained playlist model, incremental sync, Playwright visual regression, and stable contract tests per source adapter.</p>

<p>If you want to read the implementation, the <a href="https://github.com/zhoujungis/halo_music" rel="noopener noreferrer" target="_blank">halo_music source</a> is open. The project started as a small "search and play" tool and grew into a complete playground spanning web, serverless, SQLite caching and a desktop shell.</p>

<p>Along the same chain: <a href="/article/test-manage-system-vue-django/">Building a test management system from scratch: Vue 3 + Django</a> and <a href="/article/blog-tech-stack/">The tech stack behind this blog: Vue 3 + Django, split front and back</a>.</p>
`,
  },
  {
    slug: 'nanoapi-wails-http-client',
    zhSlug: 'nanoapi-wails-http-client',
    topicSlug: 'projects',
    title: 'NanoAPI: building a Postman that is just enough, in Go and Wails',
    excerpt:
      'A 10.8 MiB single-file HTTP client that reuses the system WebView2, hand-rolls its transport semantics and stores everything in one JSON file — plus the twelve failures that shaped it.',
    date: '2026-11-05',
    readingTime: 30,
    html: `
<blockquote>
<p>Who this is for: engineers who want desktop tools in Go without dragging in Electron; developers who need a lightweight HTTP client; anyone curious about Wails v2, WebView2 and <code>net/http</code> details.</p>
<p><strong>TL;DR:</strong> NanoAPI's bet is "reuse the system WebView2, build a minimal HTTP engine, store everything in one JSON file". Sending a request is not the hard part — aligning timeouts, redirects, Windows paths, multipart boundaries and crash-safe writes is.</p>
<p>Reading time ~30 minutes · Level: advanced</p>
</blockquote>

<strong>Contents</strong>
<ul>
<li>Why "a Postman that is just enough"</li>
<li>Architecture: edit in the frontend, execute in the backend</li>
<li>The full path of one request</li>
<li>The HTTP engine: written, not wrapped</li>
<li>Variable interpolation: one pass, three levels of recursion</li>
<li>cURL both ways: lexing, mapping and warnings</li>
<li>Upload and download: how files get in and out</li>
<li>Storage: reliability design for a single JSON file</li>
<li>Bulk edit and backups: pure frontend logic and merge-on-import</li>
<li>Problem list 1: four network-semantics traps</li>
<li>Problem list 2: four Windows and cURL traps</li>
<li>Problem list 3: four desktop-engineering traps</li>
<li>Build and release: the cost of one exe</li>
<li>Known limits and open problems</li>
<li>Closing</li>
</ul>
<hr>

<h2>Why "a Postman that is just enough"</h2>

<p>Postman is powerful, and that power rests on size, accounts, cloud sync, a plugin ecosystem and telemetry. For a developer who only needs to "enter a URL, pick a method, add a few headers, read the JSON back", most of that is background noise. NanoAPI compresses the goal into one sentence: a sufficient HTTP debugging client, one exe, double-click to run, data stays local.</p>

<p>"Sufficient" here is not an adjective but a checkable set of constraints. <code>go.mod</code> has exactly one direct dependency: <code>github.com/wailsapp/wails/v2 v2.17.0</code>. The frontend has no npm dependencies and no build step; native ES modules are embedded straight into the binary by <code>go:embed</code>. The release asset <code>NanoAPI-0.1.0-x64.exe</code> is 11,341,824 bytes, about 10.8 MiB; the NSIS installer is about 6.3 MB, the MSI about 4.5 MB. For comparison, an Electron app's installer usually counts in hundreds of MB.</p>

<p>Those numbers are not squeezed out by cutting features; they come from choices: rendering belongs to the system WebView2, network and files belong to the Go standard library, and the frontend keeps only the DOM plus a little glue beyond <code>fetch</code>. So there is no Chromium copy, no Node runtime, no third-party HTTP client, no database. There is not even auto-update or crash reporting.</p>

<p>The boundary must be stated too: NanoAPI only supports its own bundle format <code>nanoapi-bundle</code> v1, plus a bare <code>nanoapi.json</code>. It does not import Postman, Bruno, OpenAPI or HAR, and the repository contains no parser for any of them. That is scope control, not an oversight: a format adapter layer turns "a project one can maintain on weekends" into "a compatibility layer that is never finished". For migration, users go through cURL — the universal channel — or tidy the JSON by hand.</p>

<h2>Architecture: edit in the frontend, execute in the backend</h2>

<p>A classic two-layer Wails v2 app. <code>main.go</code> owns the window and <code>go:embed</code>; <code>app.go</code> binds the <code>App</code> struct to the frontend; <code>internal/</code> splits into six packages — <code>proxy</code>, <code>interp</code>, <code>curl</code>, <code>store</code>, <code>bundle</code>, <code>model</code>. The frontend lives in <code>frontend/dist</code>: <code>index.html</code> plus a set of ESM modules, no <code>node_modules</code>, no Vite.</p>

<p>At runtime Wails exposes bound methods on <code>window.go.main.App</code>. <code>bridge.js</code> is a thin promise wrapper that turns synchronous throws into rejections so callers cannot forget <code>.catch</code>:</p>

<pre><code>function call(method, ...args) {
  try {
    return Promise.resolve(backend()[method](...args));
  } catch (err) {
    return Promise.reject(err);
  }
}
</code></pre>

<p>That boundary decides the division of labour. The frontend owns tabs, the collection tree, the request editor, response rendering, context menus and shortcuts; the backend owns URL merging, variable interpolation, authentication, multipart, TLS, redirects, timeouts, timing capture, response reading, file saving and bundle import/export. The frontend never calls <code>fetch</code> directly, so there is no "two sets of network rules" problem.</p>

<p>Bound methods cover data loading, three kinds of save, tabs, history, cookies, bundles, cURL, sending, file picking and response saving. Every method returns a promise, handled with <code>await</code> or <code>.catch</code>. Because all I/O sits in Go, the frontend never deals with CORS, certificates, cookies or filesystem permissions; WebView2 only draws the UI.</p>

<p>That split also explains why response bodies never touch disk: Wails bindings transfer JSON strings, and a large response crossing that boundary once is already enough — persisting another copy only multiplies memory and disk cost. When a response must be kept, the user explicitly clicks "save body", which goes through the system save dialog.</p>

<p>Frontend state lives in tab objects, each owning its own request and response. Response bodies stay in memory and tab state, never in the data file; a restart restores tabs and unsaved edits, but not the last response. That keeps the data file small and stable and avoids repeatedly serializing possibly large bodies.</p>

<p>Startup checks whether <code>window.go</code> exists; if the backend is not ready the app shows an error page rather than an empty window. A failed <code>loadAll</code> raises a toast but initialization continues, so one read error cannot block the whole app.</p>

<h2>The full path of one request</h2>

<p>The send button lives in <code>app.js</code>. It guards re-entry with <code>state.sending</code>, records the originating <code>tabKey</code>, and after the await finds that tab again and writes the result back to the caller. Switching tabs while waiting therefore cannot leak results into the wrong tab:</p>

<pre><code>async function send() {
  if (state.sending) return;
  const tabKey = state.activeTabKey;
  state.sending = true;
  try {
    const res = await bridge.sendRequest(tab.request, state.activeEnvId, {
      timeoutMs: state.settings.timeoutMs,
      followRedirects: state.settings.followRedirects,
      insecureTls: state.settings.insecureTls,
    });
    const target = state.tabs.find((t) =&gt; t.key === tabKey);
    if (target) target.result = res;
  } finally {
    state.sending = false;
  }
}
</code></pre>

<p>Backend <code>SendRequest</code> is a one-way pipeline: <code>Store.Snapshot()</code> takes a data copy, <code>buildVars</code> assembles the variable table, <code>resolveRequest</code> interpolates on a request copy, <code>buildBody</code> produces bytes and a Content-Type, <code>proxy.Options</code> is assembled, and <code>Client.Send</code> takes over. Network failures are not returned as Go errors; they land in <code>Result.Error</code> and <code>Result.ErrorKind</code>. Only program state such as "store unavailable" travels as a Go error, so the frontend can distinguish "the request failed" from "the program is broken".</p>

<p><code>SendOptions</code> uses pointer booleans to distinguish "the frontend did not specify, use global settings" from "explicitly off". <code>pickInt</code> and <code>pickBool</code> fall back through settings then defaults, and timeout, follow-redirects and skip-TLS all resolve in that order — so a single request can override settings without rewriting them globally.</p>

<p>If <code>buildBody</code> fails to read a file it does not return a Go error either: it builds a Result with <code>ErrorKind: file</code> and records history as usual. The frontend can then show "file read failed" instead of an unhandled exception. The model holds across the chain: once a request has been attempted, failure comes back as a Result.</p>

<p>History stores the original request <code>req</code>, never the interpolated <code>resolved</code> — so history keeps <code>{{token}}</code>, not the resolved secret. Response bodies, timings and headers are not persisted; only status code, size, time and an error summary are. History caps at 200 entries, dropping from the tail. Success and failure both call <code>recordHistory</code>, so history contains 200s as well as timeouts and DNS failures; with status 0 the frontend still renders by error kind.</p>

<h2>The HTTP engine: written, not wrapped</h2>

<p>No third-party HTTP client: <code>internal/proxy/proxy.go</code> uses <code>net/http</code> directly. The reason is practical — full control over TLS verification, redirect policy, timeouts, connection closing and phase timings, all of which high-level wrappers tend to flatten.</p>

<p>Layer one is URL merging. <code>BuildURL</code> first completes a bare domain with <code>http://</code>, then parses the original query string and merges the parameter table; same-name keys overwrite, the rest keep order, and query-style API keys append at the end. One easily missed detail: a bare <code>?flag</code> with no equals sign must keep its valueless state and must not become <code>?flag=</code>. The implementation records this with <code>kvPair{hasValue bool}</code>, shared by sending and cURL export so two URL rule sets cannot drift.</p>

<p>Concretely: with the original URL <code>https://api.example.com/users?page=1&amp;flag</code> and a parameter table adding <code>size=20</code> while overriding <code>page=2</code>, the final query is <code>page=2&amp;flag&amp;size=20</code>. <code>flag</code> has no equals sign and must not gain one; spaces in values become <code>+</code>, and non-ASCII text is percent-encoded.</p>

<p>Layer two is request construction. Timeout and <code>httptrace</code> must be attached to the context before the request is created:</p>

<pre><code>ctx, cancel := context.WithTimeout(ctx, timeout)
defer cancel()
ctx = httptrace.WithClientTrace(ctx, &amp;httptrace.ClientTrace{ /* DNS/Connect/TLS/TTFB */ })
req, err := http.NewRequestWithContext(ctx, method, finalURL, bodyReader)
</code></pre>

<p>Reverse the order and <code>http.Request</code> holds a parent context with no deadline, making the timeout useless. That ordering trap gets its own entry below.</p>

<p>Layer three is transport. Every request clones <code>http.DefaultTransport.(*http.Transport)</code>, sets <code>InsecureSkipVerify</code> when the user disabled certificate checks, and calls <code>CloseIdleConnections()</code> in a <code>defer</code>. Go's <code>http.Client</code> handles redirects itself; <code>CheckRedirect</code> does two things: return <code>http.ErrUseLastResponse</code> when following is off so 3xx responses surface as-is; or allow at most 10 hops and record each hop's URL and status in <code>Hop</code>.</p>

<p>Layer four is reading the response. <code>io.LimitReader(resp.Body, max+1)</code> reads 20 MB plus one byte; beyond that the data is cut to 20 MB and <code>Truncated</code> is set. Memory stays bounded and "exactly 20 MB" is distinguishable from "truncated". Content-Type, UTF-8 validity and NUL bytes decide whether the body is binary; binary becomes Base64, text passes through. Cookies live in a shared <code>cookiejar</code>, and <code>ClearCookies</code> swaps in a new jar rather than deleting entries one by one.</p>

<p>One special case when writing headers: <code>Host</code> does not go into <code>Header</code> but onto <code>req.Host</code>, because Go's Header does not participate in host selection. Authentication is applied after headers: Basic via <code>SetBasicAuth</code>, Bearer writing <code>Authorization</code>, and API keys going to a header or a query parameter depending on <code>AddTo</code>.</p>

<p><code>Proto</code>, <code>RemoteAddr</code>, <code>Redirects</code> and the phase timings in <code>Result</code> are not decoration: they show whether a request is slow in DNS, TCP, TLS or time-to-first-byte, and where a 302 went. When the network fails, timings already collected are kept and the frontend notes "timings above were captured before the failure".</p>

<p>Status text is sliced out of <code>resp.Status</code> after the space; the protocol field records HTTP/1.1 or HTTP/2; headers stay a multi-value map so the frontend can show repeated headers on separate lines instead of merging them.</p>

<h2>Variable interpolation: one pass, three levels of recursion</h2>

<p>Syntax is <code>{{name}}</code>, matched by <code>\\{\\{\\s*([^{}]*?)\\s*\\}\\}</code>. <code>interp.Resolve</code> recurses at most three levels, replacing matching keys each round; it exits early when a round changes nothing, and placeholders still unresolved after three rounds stay as written. That handles <code>{{baseUrl}}/{{path}}</code> and variables referring to variables without looping forever on <code>a={{b}}</code>, <code>b={{a}}</code>.</p>

<p>Variable precedence is explicit: merge all <code>IsGlobal</code> environments first, then override same-name keys from the selected <code>envID</code>. Global variables are the floor, environment variables the override. Disabled rows and empty keys are skipped.</p>

<p>For example with globals <code>baseUrl=https://dev.example.com</code> and <code>token=global-token</code>, and the current environment overriding <code>baseUrl</code> to <code>https://staging.example.com</code>, <code>{{baseUrl}}/users</code> goes to staging while <code>{{token}}</code> still resolves to the global value. When several global environments share a key, the later merged one wins, and that merge order comes from the environment list.</p>

<p>The three-level boundary matters: <code>a={{b}}</code>, <code>b={{c}}</code>, <code>c=value</code> resolves; a longer chain leaves placeholders from level four onward in the unresolved list rather than expanding forever. It is a hard anti-cycle cap, not "try a few more times".</p>

<p>Resolution only happens on a copy. <code>cloneRequestForResolve</code> copies the slices that may be rewritten — Params, Headers, Body.Form, Body.Files — while URL, body and auth fields are copied by value. Resolution covers URL, parameter keys and values, header values, raw/form/files bodies, Basic username and password, Bearer and API key pairs; enum fields such as method and body type are not interpolated.</p>

<p>Unresolved variables do not fail the request: it is sent as written and the names come back in <code>Result.UnresolvedVars</code>. The frontend shows "these variables were not resolved and were sent as-is" in red. That degradation is deliberate — during debugging you often need to see how the server responds to an unfilled path rather than being blocked client-side.</p>

<h2>cURL both ways: lexing, mapping and warnings</h2>

<p>cURL import does not shell out; it ships a small lexer handling single and double quotes, backslash continuations, cmd's <code>^</code> continuation, the <code>$</code> prefix and <code>curl.exe</code>. The lexer emits tokens, which are then parsed against an option table.</p>

<p>The supported set covers day-to-day debugging: <code>-X/--request</code>, <code>-H/--header</code>, <code>-d/--data</code>, <code>--data-raw</code>, <code>--data-binary</code>, <code>--json</code>, <code>-F/--form</code>, <code>-u/--user</code>, <code>--oauth2-bearer</code>, <code>-b/--cookie</code>, <code>-A/--user-agent</code>, <code>-e/--referer</code>, <code>-G</code>, <code>-I</code>. Unknown options are never silently dropped; they land in <code>Warnings</code>, shown with the import result.</p>

<p>Method inference follows curl's habits: an explicit <code>-X</code> wins; <code>-I</code> yields HEAD; <code>-F</code> or <code>-d</code> yields POST; <code>-G</code> moves <code>-d</code> content into the query string and returns to GET. <code>--json</code> sets a JSON body and adds <code>Accept: application/json</code>. When an explicit method conflicts with inference, the explicit one wins.</p>

<p>A few key mappings:</p>
<ul>
<li><code>-d @file</code> and <code>--data-binary @file</code> read the file, capped at 20 MB and requiring UTF-8; <code>--data-raw @x</code> keeps the literal and does not read a file.</li>
<li>Multiple <code>-d</code> values join with <code>&amp;</code> into one body, matching curl's form behavior.</li>
<li>With <code>-F</code> the request becomes multipart; per-file options such as <code>;type=</code> and <code>;filename=</code> are stripped with a warning, because NanoAPI file fields only have a key and a path.</li>
<li><code>-k/--insecure</code> is not written into the request; it warns "turn off TLS certificate verification in settings" instead.</li>
<li><code>-x/--proxy</code> warns and is ignored — there is no proxy configuration UI.</li>
<li><code>-T/--upload-file</code>, <code>-K/--config</code> and client certificates also only warn; the tool never pretends to support them.</li>
</ul>

<p>Export takes another path but reuses <code>proxy.BuildURL</code> and the same header/auth dedupe rules. Output is Bash-style with single quotes, inner single quotes replaced by <code>'\\''</code>. Basic auth becomes <code>-u</code>; Bearer and header-form API keys become <code>-H</code>; multipart becomes <code>--form-string</code> plus <code>-F key=@path</code>. Dedupe removes <code>Content-Length</code>, <code>Transfer-Encoding</code>, hand-written multipart <code>Content-Type</code>, and duplicate <code>Authorization</code> or API key headers.</p>

<p>Multipart text fields deliberately use <code>--form-string</code> so a <code>@</code> or <code>&lt;</code> in the value is not read as a file reference; file fields use <code>-F key=@path</code> with the path handed to shell quoting. HEAD exports as <code>-I</code> rather than <code>-X HEAD</code>, because the latter can leave clients waiting for a body. <code>shellQuote</code> guarantees safety under Bash only, not cmd — output targets Bash, WSL or Git Bash, an explicit platform assumption.</p>

<p>This is not a complete cURL. The goal is "bring the common debugging commands in", not "interpret all of curl syntax", which makes the warning policy important: anything unrecognized is reported instead of quietly producing a request that looks right and behaves differently. For <code>curl.exe -X POST 'https://api.example.com/users' -H 'Content-Type: application/json' -d '{"name":"Sam"}'</code>, the lexer does not treat quotes inside the JSON as command boundaries; an unclosed quote returns an error rather than guessing intent.</p>

<h2>Upload and download: how files get in and out</h2>

<p>Uploads assemble multipart on the Go side. Text fields use <code>WriteField</code>; file fields are <code>os.Stat</code>ed first, directories rejected, single files capped at 20 MB and the total at 50 MB, then written via <code>CreateFormFile</code> with <code>filepath.Base(path)</code>. All files are read into memory before assembly, which is exactly why the caps must exist — one huge file would otherwise take the process down. File paths are interpolated too, so <code>{{fixturesDir}}/avatar.png</code> works; resolution happens before sending and a missing path returns a <code>file</code> error.</p>

<p>One crucial step before sending: if the body is multipart, drop any user-written <code>Content-Type</code>. The boundary is generated for this request, so a hand-written one cannot match, and keeping it only makes the server fail to parse. Importing a cURL with both <code>-F</code> and a manual <code>Content-Type</code> removes it with a warning; export skips multipart's Content-Type for the same reason.</p>

<p>Download runs the other way. When saving a response body the filename is picked in order: the name in <code>Content-Disposition</code>, the last segment of the final response URL, then the request name. <code>Content-Disposition</code> supports both plain <code>filename=</code> and RFC 5987's <code>filename*=UTF-8''</code>. The chosen name is reduced to a basename, <code>&lt;&gt;:"/\\|?*</code> and control characters are replaced, trailing dots and spaces trimmed, and the result capped at 120 runes. Both sides have cleaning logic: the frontend for suggestions, the backend as the final guard. Image preview has an extra 8 MB ceiling; beyond it, or when truncated, the view falls back to Base64 to avoid stuffing a huge data URL into the DOM.</p>

<p>Binary responses show as Base64 and the backend decodes back to raw bytes on save. Image responses preview directly when untruncated and small; other binaries stay Base64 text. The viewer therefore needs no renderer per format and never feeds binary data into a text highlighter.</p>

<h2>Storage: reliability design for a single JSON file</h2>

<p>The data file is fixed at <code>%APPDATA%\\NanoAPI\\nanoapi.json</code>, derived from <code>os.UserConfigDir()</code>. It holds collections, environments, global variables, settings, history and open tabs. No database, no schema version, no migration framework. If the user config directory is unavailable, <code>NewApp</code> falls back to the system temp directory so the app still starts — with no persistence across restarts.</p>

<p>Reads do no whole-file validation, only per-field repair: a timeout of zero or less resets to default, an empty theme resets to default, nil collections/environments/history/tabs become empty slices. One bad field therefore cannot cost the user their chosen theme. If JSON parsing fails, the original file is renamed to <code>nanoapi.json.corrupt-&lt;timestamp&gt;.json</code> and the app starts empty. Nothing is deleted, so manual repair or restoring a backup stays possible.</p>

<p>Writes are debounced by 300 ms so typing does not hit the disk. The actual write creates a temp file in the same directory, writes, <code>Sync</code>s, closes, then <code>Rename</code>s over the target — a process exiting mid-write leaves no half-JSON. <code>Snapshot</code> returns slice copies so callers cannot mutate underlying data while it is being serialized. That copy looks fussy and is the core of concurrency safety: while an HTTP request runs in the background, the frontend may be editing collections or environments, and serialization must work from a stable copy.</p>

<p><code>Close</code> only performs a final flush, and closing the window also triggers the frontend's tab save. Both paths use the same atomic write, so there is no "different write logic on close" risk. History caps at 200 entries; bodies and timings never persist. The file usually stays tens of KB, and "you can see the previous response after restart" is explicitly not a capability. To keep a response, save it to a file.</p>

<h2>Bulk edit and backups: pure frontend logic and merge-on-import</h2>

<p>Bulk editing of environment variables is pure frontend logic in <code>envbulk.js</code>. Input is <code>.env</code>-style <code>KEY=value</code> text; parsing skips blank lines and <code>#</code> comments, drops an <code>export</code> prefix, supports single and double quotes, and inside double quotes resolves <code>\\n</code>, <code>\\r</code>, <code>\\t</code>, <code>\\"</code> and <code>\\\\</code>. Duplicate keys take the last line, and invalid lines are counted without blocking. Existing variables keep their <code>enabled</code> and <code>desc</code>, so one bulk paste cannot wipe carefully written notes.</p>

<p>Formatting is the reverse: values containing newlines, tabs, leading or trailing spaces, or already quoted, get double quotes and escaping. Frontend tests cover parse-format round-trip consistency, which catches quote and escape edge cases that single-line tests miss.</p>

<p>For example, given <code>export BASE_URL=https://api.example.com</code>, <code>TOKEN="line1\\nline2"</code>, <code># comment</code> and a line <code>BROKEN</code> with no equals sign, parsing yields two variables and one invalid-line count; the escaped newline in <code>TOKEN</code> becomes a real line break. A repeated <code>KEY</code> overrides the earlier one while preserving its <code>enabled</code> and <code>desc</code>.</p>

<p>Backups use only the project's own <code>nanoapi-bundle</code> v1, exporting collections and environments, never history, settings or tabs; import caps at 32 MB and also accepts a bare <code>nanoapi.json</code>. Import is not overwrite but append-merge: the collection tree recursively generates new ids so nodes cannot collide; environments get new ids with " (imported)" appended on name clashes and " (imported 2)" after that; global variables exist once only, merging by key with existing values winning, skipping duplicates and reporting a count.</p>

<p>To repeat: this import recognizes no Postman Collection, Bruno, OpenAPI or HAR. No format sniffing, no field mapping. If you hold a Postman export, the correct path is to export cURL and import that, or convert the JSON by hand. That is a product boundary, not a to-do item.</p>

<h2>Problem list 1: four network-semantics traps</h2>
<h3>Problem 1: the timeout appears to do nothing</h3>

<p><strong>Symptom.</strong> Set a 200 ms timeout against an endpoint that takes 2 seconds; the client still waits the full 2 seconds and reports something other than a timeout.</p>

<p><strong>Cause.</strong> The original code called <code>http.NewRequestWithContext(ctx, ...)</code> first and only then attached <code>WithTimeout</code> and <code>httptrace</code>. <code>http.Request</code> keeps the deadline-free context it was built with; deriving a new context later does not affect a request already constructed, and the timer was never on the executed path.</p>

<p><strong>Fix.</strong> Reorder: <code>context.WithTimeout</code>, then <code>httptrace.WithClientTrace</code>, then <code>NewRequestWithContext</code>. Added <code>TestTimeoutIsReported</code>: a 200 ms timeout against an <code>httptest</code> server that sleeps 2 seconds, asserting <code>ErrorKind == timeout</code>.</p>

<p><strong>Cost.</strong> Every request now creates and cancels a context, which makes the code path wordier; and the timeout is a deadline for the whole request — DNS, connect, TLS, first byte and body read — not a connect timeout. Users who want per-phase limits can only read the timing panel.</p>

<h3>Problem 2: the specific redirect error is swallowed by a generic one</h3>

<p><strong>Symptom.</strong> Following redirects into an infinite 302 shows "network error" rather than "more than 10 redirects", and the internal <code>ErrorKind</code> becomes <code>network</code>.</p>

<p><strong>Cause.</strong> When <code>CheckRedirect</code> noticed more than 10 hops it wrote <code>res.Error</code> and <code>ErrTooManyRedirects</code> and returned an error. <code>client.Do</code> wrapped that in <code>*url.Error</code>, and the outer handler then overwrote <code>res</code> via <code>translateError</code> and <code>classify</code>. A specific error lost to a vaguer one.</p>

<p><strong>Fix.</strong> In the <code>client.Do</code> error branch, check whether <code>res.ErrorKind</code> is already <code>ErrTooManyRedirects</code> and keep it. Added <code>TestTooManyRedirectsKeepsSpecificError</code> asserting both the kind and the message survive.</p>

<p><strong>Cost.</strong> Error handling now has a branch for one specific kind, coupling <code>CheckRedirect</code> to the outer handler. Any future "write the result inside a callback" error type must remember the same guard.</p>

<h3>Problem 3: Windows connection errors do not match the message table</h3>

<p><strong>Symptom.</strong> Connecting to a closed port is recognized as "connection refused" on Linux but falls into the generic "network error" on Windows — same error, different text per platform.</p>

<p><strong>Cause.</strong> Classification originally matched Linux strings like <code>connection refused</code>. Windows' <code>WSAECONNREFUSED</code> surfaces as <code>actively refused</code> or <code>no connection could be made</code>, so string matching failed; the underlying error is also wrapped by <code>*net.OpError</code> and <code>*url.Error</code>, making the outermost text unreliable.</p>

<p><strong>Fix.</strong> Use <code>errors.As</code> to extract <code>*net.OpError</code>, then try <code>syscall.Errno</code> and compare against <code>ECONNREFUSED</code>, <code>ECONNRESET</code>, <code>ETIMEDOUT</code>; when no errno is available, fall back to lowercase text matching covering <code>actively refused</code> and <code>no connection could be made</code>.</p>

<p><strong>Cost.</strong> String fallbacks are inherently fragile across system languages and Go versions, and can misclassify non-network errors containing <code>connection reset</code>. The errno path is primary; strings are insurance.</p>

<h3>Problem 4: self-signed certificate errors look like ordinary network failures</h3>

<p><strong>Symptom.</strong> Hitting a self-signed HTTPS service shows "network error", leaving no hint that certificate verification can be disabled in settings.</p>

<p><strong>Cause.</strong> TLS error types vary across Go versions: besides <code>x509.UnknownAuthorityError</code> there are <code>tls.CertificateVerificationError</code> and <code>x509.HostnameError</code>, usually wrapped in <code>url.Error</code>. Checking one type misses most certificate problems.</p>

<p><strong>Fix.</strong> <code>classify</code> matches <code>tls.CertificateVerificationError</code>, <code>x509.HostnameError</code> and <code>x509.UnknownAuthorityError</code> in order via <code>errors.As</code>, then falls back to <code>certificate</code> and <code>tls</code> substrings, all mapping to <code>ErrTLS</code>, which the UI shows as "TLS certificate error".</p>

<p><strong>Cost.</strong> Substring fallbacks can misread server errors mentioning <code>tls</code> as certificate problems. The project has no client certificates, CA import or chain inspection, so enterprise mutual TLS means bypassing it or using another tool.</p>

<h2>Problem list 2: four Windows and cURL traps</h2>
<h3>Problem 5: the shell lexer eats Windows paths</h3>

<p><strong>Symptom.</strong> Importing <code>-F "file=@C:\\Users\\me\\a.txt"</code> loses the backslashes and the file is not found.</p>

<p><strong>Cause.</strong> The lexer treated backslashes as escapes by shell rules. Rules meant for <code>\\</code>, <code>\\"</code> and <code>\\\\\\\\</code> swallow the backslash before characters like <code>\\U</code> or <code>\\m</code>, destroying Windows paths — and Windows users rarely add extra quotes or double backslashes.</p>

<p><strong>Fix.</strong> Escape only space, tab, quotes, backslash, <code>$</code> and backtick; keep the backslash for everything else. The non-special branch lives in <code>curl.go</code>, and <code>TestSplitCurlCommandKeepsWindowsPaths</code> pins the behavior.</p>

<p><strong>Cost.</strong> One lexer serves both POSIX shell and Windows habits, so semantics cannot be identical. An unquoted path containing spaces still splits into tokens, and <code>\\n</code> inside double quotes is still a newline rather than a path fragment.</p>

<h3>Problem 6: cmd's <code>^</code> continuation is not recognized</h3>

<p><strong>Symptom.</strong> Copying a multi-line cURL from a cmd window (lines ending in <code>^</code>) yields shifted arguments or a parse failure.</p>

<p><strong>Cause.</strong> The lexer knew backslash continuations and plain newlines, not cmd's <code>^</code>; and Windows text may carry CRLF, so <code>^\\r\\n</code> was never treated as one continuation.</p>

<p><strong>Fix.</strong> The <code>^</code> branch handles both <code>\\n</code> and <code>\\r\\n</code> as continuations, while a standalone <code>^</code> stays a literal. The <code>$</code> prefix and <code>curl.exe</code> are also accepted, covering commands copied from PowerShell.</p>

<p><strong>Cost.</strong> Only continuation is implemented, not cmd's full escaping: <code>%VAR%</code> expansion, <code>&amp;</code> separation and <code>^</code> escaping of other characters are not simulated, so complex batch commands still warn or parse imperfectly.</p>

<h3>Problem 7: cURL options that look alike but are not</h3>

<p><strong>Symptom.</strong> Users assume <code>-d @payload.json</code> and <code>--data-raw @payload.json</code> both read a file, then the latter sends the literal <code>@payload.json</code>; or they assume <code>-k</code> disables certificate checks, yet importing leaves settings untouched.</p>

<p><strong>Cause.</strong> These differences are curl's own. <code>-d</code> and <code>--data-binary</code> read files behind <code>@</code>, while <code>--data-raw</code> explicitly keeps the literal; <code>-k</code> is a per-run TLS option in curl, whereas certificate verification here is a global setting that one command should not silently change.</p>

<p><strong>Fix.</strong> Dispatch by option name: <code>data</code> and <code>data-binary</code> read files (20 MB, UTF-8), <code>data-raw</code> keeps text, <code>-k/--insecure</code> only warns and points at settings, and <code>--data-urlencode</code> imports verbatim with a warning that no URL encoding was applied.</p>

<p><strong>Cost.</strong> Option semantics live in a lookup table that must grow with each new option; stdin, <code>-K</code> config files, client certificates and proxies are unsupported. Users may ignore warnings, especially in bulk pastes.</p>

<h3>Problem 8: a hand-written multipart boundary conflicts with the server</h3>

<p><strong>Symptom.</strong> Writing <code>Content-Type: multipart/form-data; boundary=xxx</code> by hand and then choosing multipart upload makes the server fail to parse or receive fields.</p>

<p><strong>Cause.</strong> <code>multipart.NewWriter</code> generates the boundary at send time, so the hand-written one differs from the one actually used. Mismatched header and body are rejected by any strict server.</p>

<p><strong>Fix.</strong> After building the body and before sending, if the body is multipart, delete <code>Content-Type</code> from the header copy and use the automatic value from <code>w.FormDataContentType()</code>. cURL import removes a hand-written Content-Type when <code>-F</code> is present and warns; export skips it too.</p>

<p><strong>Cost.</strong> Users lose the ability to customize multipart Content-Type, for example to set <code>charset</code> by hand. That is the intended trade: making a wrong configuration impossible beats preserving a freedom that usually produces errors.</p>

<h2>Problem list 3: four desktop-engineering traps</h2>
<h3>Problem 9: a per-request transport gives up keep-alive</h3>

<p><strong>Symptom.</strong> Consecutive requests each re-establish a connection, so load runs and batch debugging take longer than expected. Sharing a transport without closing it leaves idle connections hanging until timeout.</p>

<p><strong>Cause.</strong> The app must switch <code>InsecureSkipVerify</code> per request, and TLS configuration belongs to the transport, which cannot be safely mutated on a shared one; sharing would also let one request's TLS policy leak into another. Per-request transports mean no connection reuse.</p>

<p><strong>Fix.</strong> Clone <code>DefaultTransport</code> per request, set its TLS configuration, and call <code>CloseIdleConnections()</code> in a <code>defer</code>. Connection lifetime is bound to the request, nothing hangs, and TLS policies stay separate.</p>

<p><strong>Cost.</strong> No keep-alive reuse: consecutive requests repeat DNS, TCP and TLS. Acceptable for a debugging tool, poor for high-frequency batch calls. Getting both reuse and per-request TLS would need a pool keyed by TLS policy, a clear step up in complexity.</p>

<h3>Problem 10: large responses freeze the WebView</h3>

<p><strong>Symptom.</strong> A multi-MB JSON makes the response pane unresponsive and the editor laggy; a large request body triggers JSON validation on every keystroke, which also stutters.</p>

<p><strong>Cause.</strong> The renderer ran <code>JSON.parse</code>, formatting and highlighting over the entire body, and live validation ran on every input. At scale, string processing and DOM construction dominate the main thread.</p>

<p><strong>Fix.</strong> Three thresholds: response reads cap at 20 MB (truncated with a notice), bodies over 1 MB skip prettifying and highlighting and show raw text, and request bodies over 512 KB skip live validation, debounced to 200 ms. Truncation propagates to the save dialog, which says so.</p>

<p><strong>Cost.</strong> Responses over 20 MB are never fully available, and saving keeps the truncated part; JSON over 1 MB loses folding and color; request bodies over 512 KB stop reporting syntax errors, which then wait for the server.</p>

<h3>Problem 11: an interrupted process leaves half a JSON file</h3>

<p><strong>Symptom.</strong> Killing the app mid-write makes <code>nanoapi.json</code> unparsable on restart, and collections and environments vanish.</p>

<p><strong>Cause.</strong> Overwriting the target in place is not atomic: exiting mid-write leaves invalid JSON, and a reader with no recovery strategy shows empty data.</p>

<p><strong>Fix.</strong> Write a temp file, <code>Write</code>, <code>Sync</code>, <code>Close</code>, then <code>Rename</code> over the target; on a read failure, rename the original to <code>.corrupt-&lt;timestamp&gt;.json</code> and start empty; fill defaults per field so one bad field cannot sink the configuration. Tests assert every flush leaves valid JSON, no temp files remain, and a corrupt file is backed up and recoverable.</p>

<p><strong>Cost.</strong> No schema version means field upgrades rely on "fill what is missing, ignore what is unknown", with no real migration; corruption recovery is "keep the file, lose the data" and needs manual repair; 300 ms debounce can lose the last few hundred milliseconds of edits, which the forced flush on close only partly compensates.</p>

<h3>Problem 12: ids, name clashes and global-variable conflicts after import</h3>

<p><strong>Symptom.</strong> Importing a backup twice produces duplicate collection nodes where deleting one affects the other, two identically named environments that cannot be told apart, and global variables overwritten wholesale.</p>

<p><strong>Cause.</strong> Bundle nodes carry their original ids and collide when appended; environment names have no uniqueness constraint; and global variables are supposed to exist exactly once, so appending them as ordinary environments creates a second copy.</p>

<p><strong>Fix.</strong> Collection nodes get fresh recursive ids, and request nodes gain default method, body type and auth type; environments get fresh ids with " (imported)" and an incrementing suffix; global variables stay single, merging by key with existing values winning, duplicates skipped and counted in a warning.</p>

<p><strong>Cost.</strong> Import appends rather than deduplicating, so the same backup imported twice still yields two collection sets — only the ids avoid collision. Renamed environments change what the user sees, and "existing value wins" can silently ignore newer values from the backup, leaving only a count in the warning.</p>

<h2>Build and release: the cost of one exe</h2>

<p>The build command deliberately bypasses the frontend toolchain:</p>

<pre><code>wails build -platform windows/amd64 -s -skipbindings -webview2 browser
</code></pre>

<p><code>-s</code> skips the frontend build, <code>-skipbindings</code> skips generated wailsjs bindings, and the frontend calls through the runtime <code>window.go</code> instead. Frontend files are embedded by <code>go:embed</code>, so the artefact is a single executable with no <code>frontend/dist</code> beside it. The release script then drives Wails' NSIS template and WiX to produce a portable exe, an NSIS installer and an MSI.</p>

<p>The script writes the version into <code>wails.json</code>'s <code>info</code> before building and restores it afterwards; the portable exe gets its version through <code>-ldflags -X main.appVersion=...</code>, while installer metadata comes from <code>wails.json</code>. The two version sources must stay in sync or the settings page and file properties disagree. The three artefacts serve three distribution stories: the portable exe for running anywhere, NSIS for Start Menu, desktop shortcuts and WebView2 bootstrapping, MSI for domain deployment and silent installs.</p>

<p>For 0.1.0 the portable exe is 11,341,824 bytes, NSIS about 6.3 MB, MSI about 4.5 MB. Three files solve three distribution scenarios, not three feature levels.</p>

<p>The path also surfaced two classic Windows engineering problems. Line endings: running <code>gofmt -l</code> on a Windows runner fails on CRLF, so commit <code>a16b158</code> added <code>.gitattributes</code> to normalize to LF. MSI shortcuts: WiX enforces ICE43/ICE57 component ownership, and the first definition failed until commit <code>bd8208e</code> reorganized components and shortcuts.</p>

<p>The costs extend to distribution reality: there is no code signing, so SmartScreen warns about an unknown publisher; the MSI requires WebView2 to be present while NSIS tries to install it; and the version must be synced between <code>wails.json</code> and the injected <code>appVersion</code>. A single exe buys simplicity for users and more manual constraints in the build chain.</p>

<h2>Known limits and open problems</h2>

<p>First, compression is not handled directly. Go's transport only decompresses automatically when it added <code>Accept-Encoding</code> itself; if a user writes <code>Accept-Encoding: gzip</code> by hand, the transport will not decompress on their behalf, and NanoAPI has no br or deflate decoder, so the pane shows raw compressed bytes. It is not "gzip unsupported", it is "do not write that header — let the transport negotiate". That is why the README never advertises gzip: automatic negotiation is safe, manual overrides may return unreadable bytes.</p>

<p>Second, sensitive headers across redirects follow <code>net/http</code> defaults. <code>Authorization</code> is dropped on a cross-origin hop; NanoAPI neither replays it nor tells the user "the auth header was removed because the redirect crossed origins". Same-origin hops are usually fine, but cross-origin debugging produces the classic "it worked, then 401 after the redirect".</p>

<p>Third, proxies are inherited implicitly. Because transports are cloned from <code>DefaultTransport</code>, <code>ProxyFromEnvironment</code> still applies, so <code>HTTP_PROXY</code>, <code>HTTPS_PROXY</code> and <code>NO_PROXY</code> affect requests. There is no proxy UI and cURL's <code>-x/--proxy</code> only warns. Anyone with proxy environment variables set may egress from an unexpected place.</p>

<p>Fourth, import formats are only <code>nanoapi-bundle</code> v1 and bare <code>nanoapi.json</code>. Postman, Bruno, OpenAPI and HAR are unsupported: no sniffing, no mapping, no migration wizard.</p>

<p>Fifth, there is no schema version. Upgrades rely on per-field defaults and ignoring unknown fields, so the file cannot express "this field became meaningful in version X", and destructive migration is unsafe. A real structural change would need a version and migration mechanism first.</p>

<p>Sixth, the capability boundary also includes: no client certificates or custom CAs; multipart Content-Type cannot be customized; responses over 20 MB are always truncated; history keeps 200 entries and no bodies. These are explicit trade-offs, not hidden defects.</p>

<p>One more easily missed boundary: history stores the original request, so variable placeholders never become plaintext secrets — but a token typed directly into a URL or header still lands in <code>nanoapi.json</code> as plaintext. The tool does no field-level encryption and makes no promise against local readers.</p>

<p>What these leftovers share is that each needs extra infrastructure: decompression needs an encoding library, auth replay needs a custom redirect policy, proxies need a settings UI, format compatibility needs adapters, and schema versioning needs a migration framework. None of them is a one-line change.</p>

<h2>Closing</h2>

<p>NanoAPI compresses into three sentences: rendering belongs to the system WebView2, network and files belong to the Go standard library, and the frontend stays zero-dependency native ESM. It never tries to replace Postman; it makes the most common debugging path solid — request construction, variables, cURL, upload/download, response inspection, single-file storage.</p>

<p>What decides quality is not the feature list but the unglamorous failure paths. A timeout must be attached to the right context; a specific redirect error must not be overwritten by a generic one; Windows connection errors and paths need their own handling; multipart boundaries must not be user-supplied; writes must be atomic and corruption must leave evidence; large responses must be bounded at read, render and validate.</p>

<p>Its leftovers are equally explicit: no br/deflate decoding, no auth replay across origins, implicit proxy inheritance from environment variables, a closed import format, and no schema version. Saying so plainly is worth more than pretending everything is supported. A sufficient tool should tell you where it is sufficient and where it is not.</p>

<p>None of these conclusions came from guessing at code: timeouts, redirects, paths, storage and import all have unit tests or reproducible mock servers, so breaking any one of them fails the tests first.</p>

<h2>Further reading</h2>
<ul>
<li><a href="/en/article/nanobrowser-tauri-webview2/">NanoBrowser: hand-writing an in-process CDP</a> — the same WebView2 shell family, but with the browser protocol and DevTools inside the process; two ways to reuse a system engine.</li>
<li><a href="/article/file-upload-production-deep-dive/">File upload in production</a> — multipart, boundaries, temp files and object storage: the half this post stops short of.</li>
<li><a href="/article/websocket-production-deep-dive/">WebSocket in production</a> — if a debugging tool grows from one-shot HTTP to long-lived connections, connection management, heartbeats and reconnects are the next lesson.</li>
<li><a href="/en/article/micromd-3mb-markdown-reader/">MicroMD: a 3 MB Markdown reader</a> — another desktop project treating "single file, small, no heavy runtime" as a hard constraint.</li>
</ul>
`,
  },
  {
    slug: 'z-bot-local-first-ai-assistant',
    zhSlug: 'z-bot-local-first-ai-assistant',
    topicSlug: 'projects',
    title: 'Z Bot: building a local-first personal AI assistant',
    excerpt:
      'An Electron desktop agent that keeps the database, keys, tools and system capabilities in the main process, asks permission before every side effect, and uses FTS5 instead of a vector database.',
    date: '2026-11-05',
    readingTime: 55,
    html: `
<blockquote>
<p>Who this is for: people who want an AI assistant on their own machine without handing chat history and file paths to a cloud; people building desktop agents in Electron and fighting permissions, paths and packaging; people who want to see where a local-first product must compromise.</p>
<p><strong>TL;DR:</strong> the core of Z Bot is not "plug in a model" but putting the model in a box managed by the main process — database, keys, tool execution and system capabilities all stay there, the renderer gets only a whitelisted API, every side-effecting action needs permission, memory starts with SQLite FTS5 rather than a vector store, and reminders, context and retries all have hard caps.</p>
<p>Reading time ~55 minutes · Level: advanced</p>
</blockquote>

<strong>Contents</strong>
<ul>
<li>Why build a local-first personal assistant</li>
<li>Architecture: the main process and six core packages</li>
<li>Process boundary: what the renderer can and cannot do</li>
<li>IPC contract: whitelist, Zod and redaction</li>
<li>Permissions: declare first, confirm every time</li>
<li>Path safety: an authorized directory is not a string prefix</li>
<li>The agent loop: when to answer directly, when to act</li>
<li>Context budget: how 72k characters get spent</li>
<li>Model layer: streaming, retries and the fallback boundary</li>
<li>Memory: no vector store, FTS5 first</li>
<li>Reminder scheduling: the ceiling of setTimeout</li>
<li>Proactive checks and task recovery</li>
<li>Windows integration: notifications, OCR and the tray</li>
<li>Tests and packaging: after 32 unit tests and 2 E2E</li>
<li>Closing</li>
</ul>
<hr>

<h2>Why build a local-first personal assistant</h2>

<p>Cloud chat products are already strong, but "personal assistant" and "general Q&amp;A" are different products. General Q&amp;A does not need to know your project directories, last week's todos or your writing voice; a personal assistant does, and that information naturally should not leave the machine. Z Bot starts from a plain idea: keep personal context, long-term memory, tasks and reminders in a local SQLite database; let the model do reasoning and generation; and execute file reads, web fetches and reminder creation locally, each with the user's authorization.</p>

<p>That positioning brings three hard constraints. Data must be explainable, backup-able and deletable — never "the memory lives in some cloud table you cannot see or remove". The model must be swappable: OpenAI, OpenAI-compatible, Anthropic, Google and Ollama all work, so the product cannot lock anyone to one vendor. And the assistant must be resident, able to keep standing by after the window closes, send system notifications and read local files — which makes it a desktop app, not a web page.</p>

<p>Z Bot is not a coding agent. Its loop is understand, remember, reason, help, act, learn, focused on personal context and daily tasks rather than editing a repository. The README says plainly that complex software work belongs to a specialized agent like NanoHermes, while Z Bot understands the request, dispatches work, receives results and reminds the user. That boundary matters: the moment it sees itself as a general coding agent, the tool set, permission model and context budget all run out of control.</p>

<p>Local-first has costs too. No multi-device sync, no server push; a new machine means reconfiguring models and authorized directories; reminders are reliable only while the process lives, with no catch-up after a full exit; and local OCR is capped by whatever engine Windows ships. Those costs recur throughout this post. Stating the product boundary first is what makes the technical choices defensible.</p>

<h2>Architecture: the main process and six core packages</h2>

<p>The stack is Electron 45, React 19 and TypeScript 6, with Node's built-in <code>node:sqlite</code> and FTS5 for search. The repository is a pnpm workspace with six packages — <code>shared</code>, <code>database</code>, <code>model</code>, <code>memory</code>, <code>tools</code>, <code>bot-core</code> — plus <code>apps/desktop</code>. Tests are 32 unit tests plus 2 E2E, covering path guards, memory dedupe, reminder recurrence, provider normalization, the runtime and project-stall reminders.</p>

<p>The layering is direct. <code>shared</code> holds types, Zod schemas, IPC channel constants and defaults; <code>database</code> wraps <code>node:sqlite</code>, migrations and stores; <code>model</code> collapses five providers into one streaming event shape; <code>memory</code> owns writing, dedupe, retrieval and prompt formatting; <code>tools</code> is the registry, path guard, web safety policy and concrete tools; <code>bot-core</code> is the runtime, context manager, permission manager, intent router and agent loop. The Electron main process in <code>apps/desktop</code> assembles them and exclusively owns the database, secrets, tool execution and system capabilities.</p>

<p>One conversation flows like this: the renderer calls <code>chat.send</code> through preload; the IPC layer validates with Zod; <code>BotRuntime.startChat</code> immediately writes the user message and an empty assistant message, creates a <code>requestId</code> and an <code>AbortController</code>, then runs asynchronously. Execution first judges intent — direct answers take one model call, multi-step tasks enter the agent loop. Model <code>text-delta</code>, <code>tool-call</code>, <code>finish</code> and <code>error</code> events are normalized into <code>ChatEvent</code> and pushed back via <code>chat.event</code>. Tool calls pass through the permission manager first, results are appended to the message array, and the assistant message is finally persisted.</p>

<p>Two database decisions deserve their own note. <code>node:sqlite</code> avoids native compilation, so the installer never faces <code>node-gyp</code> or ABI issues; the cost is a synchronous API, with every query on the main process's single event loop. Z Bot keeps transactions short, serializes migrations, and on open sets WAL, <code>synchronous=NORMAL</code> and a 5-second busy timeout, runs <code>wal_checkpoint(TRUNCATE)</code> before exit, and copies the whole database before a version upgrade. It did not move the database to a worker, so long queries can still stall the window and IPC.</p>

<h3>Problem 1: a synchronous database on the main process</h3>

<p><strong>Symptom.</strong> During migrations, bulk queries or checkpoints, window events and IPC responses can be blocked by the same thread, showing brief unresponsiveness.</p>

<p><strong>Cause.</strong> <code>DatabaseSync</code> in <code>node:sqlite</code> is synchronous, and Z Bot deliberately gives the main process exclusive ownership without a worker or a separate database process.</p>

<p><strong>Fix.</strong> WAL for read/write concurrency, <code>synchronous=NORMAL</code> to cut per-commit fsync cost, a 5-second busy timeout, <code>BEGIN IMMEDIATE</code> for serialized migrations, <code>wal_checkpoint(TRUNCATE)</code> before exit, and a full backup before upgrades based on <code>user_version</code>.</p>

<p><strong>Cost.</strong> The root problem of a synchronous API does not disappear; it is confined to short transactions. Full exports, index rebuilds or large log searches would need a worker; this version trades simplicity for stability.</p>

<h2>Process boundary: what the renderer can and cannot do</h2>

<p>The first rule of Electron security is not to hand Node to the page. Z Bot's window uses <code>contextIsolation: true</code>, <code>nodeIntegration: false</code> and <code>sandbox: true</code>; the renderer has no <code>require</code>, no <code>process</code>, no filesystem. CSP narrows loading to <code>self</code> and the custom <code>zbot-media:</code> scheme rather than opening arbitrary <code>https:</code>; all web permission requests are denied by default, so camera, microphone, geolocation and notifications never open because a page asked once.</p>

<p>Attachments are capped at 25 MB each and six per message before saving, so one conversation cannot blow up local storage or later requests. Attachment images are read through <code>zbot-media://attachment/&lt;id&gt;</code>: the main process accepts only <code>hostname === 'attachment'</code>, treats the path as an attachment id looked up in the database and attachment directory, returns 404 when missing, and adds a <code>default-src 'none'</code> CSP to the response. The renderer therefore cannot reach arbitrary local paths — only an image already recorded in the attachment table. That is far safer than exposing <code>file://</code>, but it also means attachments must pass through the main process first.</p>

<p>Preload is the only bridge. It exposes a <code>ZBotApi</code> via <code>contextBridge.exposeInMainWorld('zbot', api)</code> with roughly 40 methods grouped under <code>app</code>, <code>chat</code>, <code>conversations</code>, <code>memory</code>, <code>settings</code>, <code>providers</code>, <code>webSearch</code>, <code>projects</code>, <code>roots</code>, <code>tasks</code>, <code>todos</code>, <code>reminders</code>, <code>home</code>, <code>permissions</code>, <code>clipboard</code>, <code>screenshot</code> and <code>events</code>. Raw <code>ipcRenderer</code> is never handed over, so the page cannot compose channel names or listen to arbitrary events.</p>

<p>Event subscriptions are closed off too. <code>chat.onEvent</code>, <code>events.onNavigate</code>, <code>events.onScreenshot</code> and <code>events.onTheme</code> return an unsubscribe function, wrapping the listener internally before <code>removeListener</code>. That looks cosmetic but actually fixes listener leaks after React unmounts: callers can unsubscribe in <code>useEffect</code> cleanup without remembering which function reference they passed.</p>

<p>This boundary is not "configure once, safe forever". Add one generic <code>invoke(channel, ...args)</code> to preload and the whitelist is decoration; expose <code>shell.openPath</code> straight to the renderer and the path guard is bypassed. Z Bot keeps every IPC in <code>register.ts</code> behind a uniform <code>handle()</code> wrapper with per-channel schemas — but a few channels slipped through, covered below.</p>

<h2>IPC contract: whitelist, Zod and redaction</h2>

<p>IPC registration goes through one <code>handle</code> wrapper: channel, handler, optional schema. Each call runs <code>schema.parse(raw)</code>; Zod's <code>.strict()</code> rejects extra fields so the renderer cannot smuggle unexpected properties. Parse failures turn <code>ZodError.issues</code> into a readable message; handler throws pass through <code>redactErrorMessage</code> before being returned. Logs record an <code>ipc request failed</code> line without raw keys, tokens or cookies.</p>

<pre><code>ipcMain.handle(channel, async (_event, raw: unknown) =&gt; {
  try {
    const input = schema ? schema.parse(raw) : raw;
    return await handler(input);
  } catch (error) {
    logger.warn({ channel, error: redactErrorMessage(error) }, 'ipc request failed');
    throw new Error(redactErrorMessage(error));
  }
});
</code></pre>

<p>The value here is safe by default: adding a channel forces an explicit decision about a schema, and a channel without one stays visible in review. There is an obvious gap: the third argument is optional, so <code>app:open-path</code> and <code>web-search:set-key</code> genuinely lack schemas. The first only does a string-containment check for "inside the data directory", the second uses <code>value</code> as a string. They are not the most dangerous channels, but they show that a uniform wrapper is not uniform validation.</p>

<h3>Problem 2: inconsistent IPC surface and validation</h3>

<p><strong>Symptom.</strong> <code>app:open-path</code> and <code>web-search:set-key</code> have no Zod schema; <code>clipboard:read-text</code> and <code>screenshot:capture</code> execute over IPC without permission confirmation, while tools of the same name go through <code>PermissionManager</code>. Subtler still: the renderer never calls those two IPC channels — they are high-privilege surfaces that exist unused.</p>

<p><strong>Cause.</strong> IPC is the UI's fast path, tools are the model's controlled path; the two evolved separately and the permission model covers only the latter. Optional schema arguments make omissions easy.</p>

<p><strong>Fix.</strong> <code>app:open-path</code> uses <code>path.relative</code> instead of naive string comparison; secret-writing IPC accepts only strings and goes through <code>safeStorage</code> in ProviderService; logging and error messages are redacted uniformly. Clipboard and screenshot tools go through full permission confirmation with risk described in the prompt.</p>

<p><strong>Cost.</strong> Unused high-privilege IPC stays on the attack surface. The right move is deleting channels nobody needs or giving them schemas and confirmation; the repository keeps them because the UI may need them later. That is an explicit to-do, not a solved problem.</p>

<h3>Problem 3: secrets on disk and log redaction</h3>

<p><strong>Symptom.</strong> Model API keys and web-search keys are sensitive; written in plaintext or leaked into logs, even a local app exposes them.</p>

<p><strong>Cause.</strong> A desktop app must persist keys, but <code>safeStorage</code> is unavailable in some Windows environments; logs, error messages and IPC payloads can all carry configuration objects.</p>

<p><strong>Fix.</strong> <code>SecretService.encrypt</code> throws when <code>safeStorage.isEncryptionAvailable()</code> is false, refusing plaintext; the database stores <code>encrypted_api_key</code>; outbound DTOs strip <code>encryptedApiKey</code> and tell the UI only "configured"; pino's redact list hides <code>apiKey</code>, <code>password</code>, <code>cookie</code>, <code>encryptedApiKey</code> and nested variants, with regex redaction on error messages.</p>

<p><strong>Cost.</strong> <code>safeStorage</code> relies on the OS credential service, so keys become unreadable after a machine change or a broken profile and users must re-enter them. Redaction is a double line of defense (field names plus regex) and cannot guarantee that a key concatenated into an arbitrary string is always caught. Acceptable for a local app, not absolute safety.</p>

<h2>Permissions: declare first, confirm every time</h2>

<p>Registering a tool does not make it runnable. Every tool calls <code>getPermission()</code> before executing, producing a <code>ToolPermissionSpec</code> with title, description, risk level, scope and operation list. <code>PermissionManager.authorize()</code> checks persisted rules first: an <code>allow</code> hit passes, a <code>deny</code> hit rejects; only a miss creates a <code>PermissionRequest</code>, pushes it to the UI via <code>chat.permission</code>, and awaits the user's decision.</p>

<pre><code>tool.run()
  -&gt; getPermission() -&gt; ToolPermissionSpec
  -&gt; PermissionManager.authorize(spec)
       -&gt; rule allow / deny
       -&gt; miss: chat.permission -&gt; wait for UI
       -&gt; AbortSignal cancel -&gt; cancelForChat
</code></pre>

<p>Users have four choices: deny, allow once, allow for the scope, or cancel the task. <code>allow_once</code> deliberately is not persisted, so the same action asks again next time; <code>allow_scope</code> persists on "tool name + scope", usually an authorized directory or operation type; <code>deny</code> does not run the tool and returns <code>Permission denied by user. The operation was not executed: ...</code> as the tool result so the model learns the path is blocked instead of the conversation collapsing. Cancellation rejects every pending promise through <code>AbortSignal</code> and <code>cancelForChat</code>, so permission dialogs never hang forever.</p>

<p>The key idea is that a denial is not an exception. Many agents throw when a tool is refused, leaving the model blind to the reason and retrying the same action next turn. Z Bot makes denial an ordinary tool result: the model can take another route or explain why it did not act. The cost is that the model may ask for the same permission repeatedly; there is no soft "do not ask again in this conversation", only persisted deny rules.</p>

<p>Scope granularity is another matter. <code>allow_scope</code> binds tool and scope, not specific arguments; once write access to a directory is allowed, later writes there never prompt. That matches the "reduce interruptions" goal but leaves high-risk tools depending on scopes designed narrowly. Z Bot models write, delete and batch-move separately, sends deletes to the Recycle Bin and shows a preview before batch operations — using tool design to compensate for permission granularity.</p>

<p>Tasks and permissions interact. If the agent stalls waiting for permission, the task becomes <code>waiting_permission</code>; on app exit, <code>markInterrupted()</code> turns <code>running</code> and <code>pending</code> into <code>paused</code>, and a restart never automatically replays interrupted tasks that may have had side effects. That trades "auto-resume after restart" for "never quietly delete or move files again".</p>

<h2>Path safety: an authorized directory is not a string prefix</h2>

<p>The first gate for file tools is <code>resolveAuthorizedPath</code>. It rejects relative paths, drive roots, device paths and UNC shares, caps length at 4096 and refuses NUL bytes; then it canonicalizes the target and checks containment against every authorized root's real path. Writes additionally require <code>allowWrite</code> on that root, <code>mustExist</code> checks read/write access, and <code>expected</code> verifies file versus directory.</p>

<p>Containment must not use <code>startsWith</code>. <code>C:\\Users\\me\\Documents</code> and <code>C:\\Users\\me\\Documents-evil</code> differ by a suffix, and a string prefix misjudges them; Z Bot computes a relative path with <code>path.relative</code>, rejects <code>..</code> and absolute escapes, and lowercases on Windows before comparing. This is easy to miss in cross-platform code, and missing it is a directory traversal bug.</p>

<h3>Problem 4: Windows 8.3 short paths break test assertions</h3>

<p><strong>Symptom.</strong> A test creates a temp directory with <code>mkdtemp</code>, compares against a <code>realpath</code> result, the two differ and the test fails on Windows. Two commits fixed tests: <code>f4cf8a8</code> and <code>b9b45de</code>.</p>

<p><strong>Cause.</strong> Windows generates 8.3 short names for long paths, so the temp directory and its real path can come back in different forms. The test compared strings while production code canonicalized with <code>realpath</code>: the test thought the product was wrong when the assertion was not normalized.</p>

<p><strong>Fix.</strong> The test normalizes expectations the same way; production <code>path-guard.ts</code> calls <code>realpath</code> level by level, reattaches the missing segments to the real parent, and lowercases before comparing.</p>

<p><strong>Cost.</strong> Path canonicalization is best effort, not cryptographic equivalence: short names, casing and junctions can make two strings look different or identical. Tests must follow platform behavior rather than assume POSIX semantics.</p>

<h3>Problem 5: symlink escapes and "the target does not exist yet"</h3>

<p><strong>Symptom.</strong> Canonicalizing only the target makes a not-yet-created write path fail with <code>ENOENT</code>; if the target is a junction or symlink pointing outside the authorized directory, <code>realpath</code> lands outside the root. The two failures are opposite: one false positive, one false negative.</p>

<p><strong>Cause.</strong> Write targets often do not exist and cannot be required to resolve, while symlinks can carry a path outside the authorized range after resolution, so checks are needed before and after.</p>

<p><strong>Fix.</strong> <code>canonicalizePotentialPath</code> walks upward from the target to the nearest existing parent, at most 64 levels, collecting missing segments, resolves that parent, then reattaches segments in order; roots are canonicalized too; <code>expected</code> checks reject <code>isSymbolicLink()</code> after <code>lstat</code>. A Windows system-directory blacklist rejects <code>SystemRoot</code>, <code>Program Files</code> and similar.</p>

<pre><code>for (let index = 0; index &lt; 64; index += 1) {
  try {
    const canonical = await realpath(current);
    return resolve(canonical, ...missing.reverse());
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT' &amp;&amp; code !== 'ENOTDIR') throw error;
    missing.push(basename(current));
    current = dirname(current);
  }
}
</code></pre>

<p><strong>Cost.</strong> A TOCTOU window remains between check and use: an attacker can swap a parent directory for a link after <code>realpath</code> and before the write. The 64-level cap rejects very deep paths, and the system blacklist depends on environment variables that may be missing. The guard stops ordinary mistakes and naive attacks, not a kernel-level sandbox.</p>

<h2>The agent loop: when to answer directly, when to act</h2>

<p>The first step of <code>startChat</code> is not calling the model but persisting. It confirms or creates the conversation, writes the user message, updates the title, writes an empty assistant message, then creates <code>requestId</code> and <code>AbortController</code>, emits <code>chat.started</code> and runs asynchronously. That ordering guarantees the user message and a failure placeholder exist even if the model call fails, so the UI never shows "sent but missing from history".</p>

<p>Two shortcuts sit at the entrance. First, an explicit memory regex: sentences starting with "remember" go straight to memory writing without a model call. Second, intent routing: short sentences, greetings and questions take <code>direct</code>, while todos, reminders, files, web and long sentences take <code>agent</code>. Routing is not a semantic classifier but an ordered set of regexes — cheap, testable, no extra model call, and occasionally wrong.</p>

<p>Direct mode calls the model once, suited to "explain this concept" or "write one line of copy". Agent mode loops: the model emits text and tool calls, results are appended, the model is called again, until it stops calling tools or hits a cap. The loop allows at most 20 steps, 30 tool calls and a 5-minute total timeout; usage and retries accumulate on the task record. If a tool result fails its <code>verification</code>, the step is marked failed rather than pretending success.</p>

<h3>Problem 6: the boundary of regex intent routing</h3>

<p><strong>Symptom.</strong> Routing depends only on keywords and sentence length. A chatty sentence containing "file" can enter the agent, while a long sentence with no keyword that genuinely needs multiple steps can be misrouted.</p>

<p><strong>Cause.</strong> No trained classifier and no model call to judge intent first; regexes plus an 80-character threshold were chosen to save a call and reduce latency.</p>

<p><strong>Fix.</strong> High-frequency intents are separate regexes matched in order — memory, todo, reminder, web, system, file, recall, image, greeting, question, short sentence; explicit memory and shortcuts short-circuit before routing; long or unclassifiable requests default to the agent, spending an extra loop rather than treating a multi-step task as chat.</p>

<p><strong>Cost.</strong> Regex maintenance grows with every intent, and mixed Chinese/English or colloquial phrasing slips through; the 80-character threshold is empirical, not semantic. A small local classifier could replace it later; that has not been done.</p>

<h2>Context budget: how 72k characters get spent</h2>

<p>Z Bot does not stuff all history into the prompt. <code>ContextManager.build()</code> fetches the project, authorized roots and relevant memories, assembles the system prompt, then fills history against a character budget. The total is 72,000 characters; history holds at most 20 messages, newest first, each truncated to 8,000 characters; the current user input is cut at 20,000; OCR text is capped at 24,000 and wrapped in <code>&lt;untrusted_image_text&gt;</code> so the model is told plainly that it is untrusted data, not instructions.</p>

<p>Memory retrieval uses the first 500 characters of the current question as the query, takes 8 FTS hits, and if fewer than four arrive, tops up with the four most recent by project and time, deduplicated to at most eight. Ordering is <code>bm25</code> ascending, then <code>importance</code> descending, then <code>updated_at</code> descending. The strategy is conservative: better a few recent memories than answering with none.</p>

<p>History loading is short code with a clear boundary:</p>

<pre><code>let remaining = Math.max(0, maxChars - system.length);
const selectedHistory: LlmMessage[] = [];
for (let index = history.length - 1; index &gt;= 0; index -= 1) {
  const message = history[index]!;
  if (message.content.length &gt; remaining) break;
  selectedHistory.unshift(message);
  remaining -= message.content.length;
}
</code></pre>

<h3>Problem 7: one oversized message ends the loop</h3>

<p><strong>Symptom.</strong> When a single historical message exceeds the remaining budget, the loop breaks and no earlier messages load at all. One long old reply truncates the entire history instead of being skipped.</p>

<p><strong>Cause.</strong> The implementation chose "load continuously from newest backwards" so the context is one contiguous run with no holes; the cheapest way to handle a message that does not fit is to stop.</p>

<p><strong>Fix.</strong> Each message is truncated to 8,000 characters first, reducing the chance; the system prompt and memories are kept inside the budget; the current user message is truncated separately and never competes with history.</p>

<p><strong>Cost.</strong> This is a known rough edge. Skipping the oversized message and continuing with older ones would be more reasonable, as would budgeting in tokens rather than characters; neither is done, because contiguous history helps the model and the 8,000-character cut already excludes most cases.</p>

<p>Character budgets carry another error: Chinese, English and code differ in token density, so 72k characters is not 72k tokens. Characters were chosen because they can be estimated cheaply without a tokenizer, at the risk of occasionally exceeding the model window. Provider errors surface as <code>MODEL_*</code> codes in the UI, so users see a failure instead of a silently dropped message.</p>

<h2>Model layer: streaming, retries and the fallback boundary</h2>

<p>The provider layer wraps OpenAI, OpenAI-compatible, Anthropic, Google and Ollama. The first four use official or compatible SDKs; Ollama goes through the OpenAI-compatible interface at <code>http://127.0.0.1:11434/v1</code> by default. The AI SDK's <code>streamText</code> performs the request, and Z Bot normalizes output into its own events: <code>text-delta</code>, <code>tool-call</code>, <code>finish</code>, <code>usage</code>, <code>error</code>, <code>aborted</code>. The agent above never needs to know which provider is in use or how each streams.</p>

<p>Retry policy is at most three attempts per provider with 500 ms, 1000 ms and 2000 ms backoff; the AI SDK's <code>maxRetries</code> is set to 0 to avoid a second layer inside. Only retryable errors retry — configuration failures like <code>MODEL_KEY_MISSING</code> or <code>MODEL_BASE_URL_MISSING</code> fail immediately. The fallback model is used only after every primary attempt fails, and never once text has already been emitted.</p>

<pre><code>const retryable = normalized instanceof ModelRequestError ? normalized.retryable : true;
if (!retryable || attemptNumber &gt;= maxAttempts || textEmittedRef.value) {
  break;
}
retries += 1;
await delay(500 * 2 ** (retries - 1), signal);
</code></pre>

<h3>Problem 8: retries duplicate text in the UI</h3>

<p><strong>Symptom.</strong> Streaming already produced a few words, the request fails midway, the retry answers from the beginning, and the UI shows "partial text + complete answer".</p>

<p><strong>Cause.</strong> Retry logic cared only about "the request failed", not about whether visible deltas had already been emitted; the SDK could also retry internally and amplify it.</p>

<p><strong>Fix.</strong> A <code>textEmittedRef</code> records whether this attempt sent any <code>text-delta</code>; once true, the current provider may not retry and fallback is forbidden. The provider sets <code>maxRetries: 0</code>, concentrating retries in <code>streamModel</code>.</p>

<p><strong>Cost.</strong> Emitted partial text is not retracted, so a user may see half a sentence followed by an error; and if the model fails after a tool call, retry is also forbidden and the task fails. This buys "no duplicates" over "always succeed", which matters more for chat.</p>

<p>The 5-minute overall timeout is a second gate covering the whole conversation, not one request; when it fires, <code>AbortController</code> cancels the running stream, permission waits and tool execution, and the run is marked <code>canceled</code> rather than treated as a successful partial answer.</p>

<h2>Memory: no vector store, FTS5 first</h2>

<p>Memory has five types: <code>user</code>, <code>project</code>, <code>event</code>, <code>task</code>, <code>global</code>. They live in a <code>STRICT</code> <code>memories</code> table with content, type, project id, importance, confidence, expiry and archive time; tags live in <code>memory_tags</code> with cascading foreign keys. Retrieval uses the <code>memories_fts</code> FTS5 virtual table with <code>content='memories'</code> and <code>content_rowid='rowid'</code>, kept in sync by three triggers for insert, update and delete.</p>

<p>Chinese retrieval is the most underrated problem here. FTS5's default <code>unicode61</code> tokenizer does not segment Chinese into meaningful words; a whole sentence often becomes one token, and searching "release process" matches nothing beyond the exact phrase. Z Bot switches to the <code>trigram</code> tokenizer, indexing three-character windows so Chinese phrases can be partially matched; queries shorter than three characters cannot use FTS and degrade to <code>instr(lower(content), lower(query))</code> substring scans.</p>

<pre><code>CREATE VIRTUAL TABLE memories_fts USING fts5(
  content,
  content='memories',
  content_rowid='rowid',
  tokenize='trigram'
);
</code></pre>

<h3>Problem 9: the default FTS5 tokenizer does not split Chinese</h3>

<p><strong>Symptom.</strong> English keywords match, whole Chinese sentences do not; after switching the tokenizer to <code>trigram</code>, two-character queries stop matching entirely.</p>

<p><strong>Cause.</strong> FTS5's default tokenizer targets space-separated languages and Chinese has no spaces; <code>trigram</code> needs at least three characters to build a window.</p>

<p><strong>Fix.</strong> Create the table with <code>trigram</code>; queries of three or more characters use <code>MATCH</code> with the query quoted and inner quotes escaped; shorter ones use <code>instr(lower(...))</code>. A test with the two-character word "简洁" covers the degraded path specifically.</p>

<p><strong>Cost.</strong> A <code>trigram</code> index is larger than the default and costs more on write; two-character queries become full scans and slow down as memory grows; there are no synonyms, no pinyin and no semantic recall, so "go live" and "release" stay unconnected. v0.1 accepts this and defers a vector store.</p>

<p>Memory has exactly two write paths: the entry regex recognizing "remember ...", or the model actively calling the <code>remember</code> tool. The latter is gated by <code>memory.autoExtract</code>; with it off, the model cannot write on its own. There is no post-conversation extraction pass, deliberately: that needs extra model calls plus handling for duplicates and hallucination, so v0.1 first makes "the user explicitly said remember" reliable.</p>

<p>Dedupe is exact equality after normalization: same type, same project, and equal <code>lower(trim(content))</code>. A hit takes the larger of importance and confidence and merges tags. There is no semantic dedupe and no decay scoring; expiry only archives via <code>expiresAt -&gt; archivedAt</code>, with no time-decayed ranking. Retrieval orders by <code>bm25</code>, importance and <code>updated_at</code> — simple, explainable, fast enough.</p>

<p>This system is closer to an index than a brain. It does not summarize conversations, and an unused memory never loses weight; its strength is that every item can be seen, edited and deleted in the UI, so users can explain why the model mentioned something. For a personal assistant, explainability beats recall.</p>

<h2>Reminder scheduling: the ceiling of setTimeout</h2>

<p>The scheduler is light: one <code>setTimeout</code> per enabled reminder, and <code>refresh()</code> clears every timer and re-plans on start or on any change. A fired reminder writes a <code>reminder.triggered</code> event, sends a Windows notification per settings, then computes the next trigger with <code>nextReminderTrigger</code>; one-off reminders set <code>enabled</code> to 0, recurring ones advance to the next future moment.</p>

<p>The problem is the <code>setTimeout</code> ceiling. Node's timer delay overflows above 2^31−1 milliseconds (about 24.8 days) and fires immediately. Z Bot clamps to <code>2_147_000_000</code> ms, sleeps that long, then re-reads the reminder and re-plans, forming a chain.</p>

<pre><code>const MAX_TIMEOUT = 2_147_000_000;
const delay = reminder.triggerAt - Date.now();
if (delay &gt; MAX_TIMEOUT) {
  const timer = setTimeout(() =&gt; {
    this.timers.delete(reminder.id);
    this.schedule(this.reminders.get(reminder.id) ?? reminder);
  }, MAX_TIMEOUT);
  timer.unref?.();
  this.timers.set(reminder.id, timer);
  return;
}
</code></pre>

<h3>Problem 10: very long reminders overflow the timer</h3>

<p><strong>Symptom.</strong> A reminder a month out fires immediately after startup.</p>

<p><strong>Cause.</strong> <code>setTimeout</code> takes a 32-bit signed delay; beyond <code>2^31-1</code> ms it wraps negative or to zero and runs at once.</p>

<p><strong>Fix.</strong> Sleep one 24.8-day segment and re-read the reminder in the callback; treat negative delays as 0 so overdue reminders fire once; disable one-off reminders after firing, and advance recurring ones with <code>nextReminderTrigger</code> instead of replaying missed history.</p>

<p><strong>Cost.</strong> Chained re-planning requires the process to stay alive; a full exit loses the timers and missed reminders never fire. The README admits this. Windows Task Scheduler is not used, nor is a startup scan for reminders that should have fired in the last 24 hours, because catch-up policy is a product decision — once or every missed occurrence — and v0.1 declines it.</p>

<p>One more boundary: at startup a negative delay fires immediately. For one-off reminders that surfaces an overdue, never-fired item; for recurring ones it fires the current occurrence and advances to the next future moment without replaying every missed day. The semantics are right, but a user expecting "catch up on everything missed" will feel one is missing.</p>

<h2>Proactive checks and task recovery</h2>

<p>The proactive service handles project-stall reminders. It checks 10 seconds after start and every 6 hours after; a <code>running</code> flag prevents re-entry. Each pass reads 400 events, finds the latest <code>project.inactivity</code> per project, skips when that notification is newer than the project's latest activity, and otherwise decides against the threshold. The default threshold is 7 days, and directory <code>mtime</code> counts as activity only when the directory is inside an authorized root.</p>

<p>That dedupe solves "notify the same stalled project on every pass". It compares "last notified" with "latest activity": activity after a notification restarts the clock, and silence since then stops repeats. The cost is that the event table must retain enough history; 400 rows is empirical, and a busy event stream can squeeze out old records and cause duplicate notifications.</p>

<p>Task recovery is the other half. On exit, <code>markInterrupted()</code> turns <code>running</code> and <code>pending</code> into <code>paused</code>, and nothing auto-resumes. Agent tasks can have side effects — writing files, moving files, deleting to the Recycle Bin, sending notifications; replaying them after a restart could delete or move twice, far worse than a task sitting paused.</p>

<h3>Problem 11: side effects replayed after a restart</h3>

<p><strong>Symptom.</strong> The app closes halfway through a task; resuming from the stored state on restart can execute a tool call again.</p>

<p><strong>Cause.</strong> Task state and tool-call records persist, but "which step ran" and "whether the side effect happened" have no transactional link, so the model may replay a tool.</p>

<p><strong>Fix.</strong> Call <code>markInterrupted()</code> at startup, turning <code>running</code> and <code>pending</code> into <code>paused</code>; tasks waiting on permission become <code>waiting_permission</code>; nothing resumes automatically, and the user must confirm and re-issue. Tools add idempotency: writes carry content hashes, moves and deletes preview, deletes go to the Recycle Bin.</p>

<p><strong>Cost.</strong> Users lose auto-resume, and a long interrupted task must be re-described; paused tasks have no one-click resume. That is safety over completeness.</p>

<p>Tray residency, minimize-on-close, single instance and launch-at-login are the foundation of that residency. <code>requestSingleInstanceLock()</code> makes a second launch exit and focus the existing window; closing the window minimizes to the tray and only an explicit quit ends the process. That gives reminders and proactive checks somewhere to run, and makes it easy for users to think the app already exited.</p>

<h2>Windows integration: notifications, OCR and the tray</h2>

<p>Windows notifications are mandatory for a desktop assistant and the classic "code is correct but nothing appears". Z Bot calls <code>app.setAppUserModelId('com.zbot.desktop')</code> at startup, the prerequisite for Windows notifications; before sending it checks <code>Notification.isSupported()</code> and returns false instead of throwing. Clicks can navigate — a reminder to Home, a stalled project to Memory.</p>

<h3>Problem 12: Windows notifications never appear</h3>

<p><strong>Symptom.</strong> A reminder fires, the log says <code>reminder fired</code>, and no desktop notification shows.</p>

<p><strong>Cause.</strong> Windows needs the right App User Model ID or it cannot attribute the notification; Focus Assist, disabled notification permission or a tray process that is not running also suppress it silently.</p>

<p><strong>Fix.</strong> Set <code>setAppUserModelId</code> in the main process; <code>NotificationService.show</code> checks <code>isSupported()</code> first; the README documents the diagnostic steps — system notification settings, Focus Assist, whether the app runs in the tray.</p>

<p><strong>Cost.</strong> <code>isSupported()</code> reports platform capability, not whether the user muted notifications, and there is no in-app banner fallback, so reminders can be missed. That is a blank spot in this version.</p>

<p>OCR better illustrates how plans change. The repository ends up using Windows' built-in <code>Windows.Media.Ocr</code> through a PowerShell child process: <code>-NoProfile</code>, <code>-NonInteractive</code>, <code>-ExecutionPolicy Bypass</code>, <code>windowsHide</code>, a 30-second timeout and a 1 MB output buffer. Results go to a temp file, are read back and clipped to 20,000 characters; failure returns <code>null</code> so the vision model can take over.</p>

<h3>Problem 13: migrating OCR from Tesseract to the system engine</h3>

<p><strong>Symptom.</strong> It started with Tesseract, the build config still carries a plugin copying <code>@tesseract.js-data</code>, but runtime code no longer references it.</p>

<p><strong>Cause.</strong> Tesseract needs extra language data and native dependencies, with unfavourable size, startup and Chinese accuracy; Windows 10/11 ships an OCR engine with language packs already installed, so calling it is lighter.</p>

<p><strong>Fix.</strong> Move to a PowerShell child process driving <code>Windows.Media.Ocr</code>, packaging the script as a resource; return <code>null</code> on failure so the vision model handles it; hide the window and cap timeout and output so the main process cannot hang.</p>

<p><strong>Cost.</strong> The child process has startup overhead, and 30 seconds may be too short for huge images; it depends on Windows language packs, so Chinese OCR can fail on non-Chinese systems; the leftover Tesseract build config is technical debt — harmless at runtime, misleading to the next reader.</p>

<p>The tray and shortcuts are the last piece. The tray menu offers show, quick ask and quit; <code>Ctrl+Space</code> opens Quick Ask and <code>Ctrl+Shift+Z</code> captures the primary screen into the chat. Single instance and launch-at-login keep those entry points stable, which also means a lifetime longer than a normal window app — quit order must call <code>scheduler.stop()</code>, <code>proactive.stop()</code>, <code>database.close()</code> and <code>wal_checkpoint</code> in sequence.</p>

<h2>Tests and packaging: after 32 unit tests and 2 E2E</h2>

<p>The 32 unit tests cover what is easy to get wrong and hard to notice afterwards: short paths and symlinks in the path guard, exact memory dedupe, reminder recurrence rules, provider event normalization, runtime permission denial, project-stall dedupe. Two E2E tests cover starting a real window and a basic conversation. The suite is small, but each case maps to a real hole, which beats chasing a coverage number.</p>

<p>Packaging is another category of trap. Automated releases ship only portable and MSI, because the NSIS uninstaller gets locked by antivirus; unsigned Windows installers trigger SmartScreen, requiring an extra "run anyway". <code>playwright</code> and <code>jsdom</code> sit in runtime dependencies and inflate the installer; the repository has no measured size, so this post states the cost without inventing a number.</p>

<h3>Problem 14: NSIS locked and runtime dependencies bloated</h3>

<p><strong>Symptom.</strong> The NSIS installer never reaches release artefacts, only portable and MSI; the installer is larger than expected.</p>

<p><strong>Cause.</strong> The NSIS uninstaller is held or locked by antivirus during build or scan; <code>playwright</code> and <code>jsdom</code>, which belong in tests or tooling, were written into <code>dependencies</code>, so the packager bundles them at runtime.</p>

<p><strong>Fix.</strong> The release script uses <code>electron-builder --win portable msi</code> to bypass NSIS; <code>asar</code> is enabled; the signing gap is documented rather than pretended away; dependency cleanup — moving test dependencies to <code>devDependencies</code> or excluding them in the bundler — is deferred.</p>

<p><strong>Cost.</strong> Without NSIS there is no classic setup wizard or Start Menu uninstall entry, only the portable build or MSI; unsigned builds warn in SmartScreen; no size measurement exists to judge the benefit. All three remain open.</p>

<h2>Closing</h2>

<p>Z Bot compresses into four sentences. First, keep dangerous capability in the main process: database, keys, tools and system calls never enter the renderer, and preload exposes only whitelisted methods. Second, make permissions a flow rather than a switch: tools declare a spec, matching rules pass, misses wait for the user, and denial becomes a tool result rather than an exception. Third, write the budgets down: 72k context characters, 20 history messages, 8 memories, 20 agent steps, 30 tool calls, 5 minutes, 24.8-day timers — numbers that can be audited. Fourth, make memory an explainable index: FTS5 with trigram, exact dedupe, archival on expiry, no vector store.</p>

<p>Its value is not feature count but that every feature has a traceable boundary: which step runs in the main process, which needs authorization, which can fail, and what the user sees when it does. Its rough edges are equally explicit: an oversized history message breaks the loop, some IPC lacks validation, OCR build config is stale, NSIS and signing are unresolved, and reminders do not catch up after a full exit. Writing those down beats pretending they do not exist.</p>

<p>If you are building a desktop agent, copy these three first: main-process exclusivity plus a whitelisted preload, the declare-check-wait permission flow, and realpath normalization in the path guard. Context budgets, memory retrieval and scheduling can be tuned to your product.</p>

<h2>Further reading</h2>
<ul>
<li><a href="/article/agent-memory-without-vector-db/">Agent memory: long-term recall without a vector database</a></li>
<li><a href="/article/agent-prompt-injection-boundary/">Where the prompt-injection boundary sits in an agent</a></li>
<li><a href="/article/agent-concurrency-without-async/">Agent concurrency without an async runtime</a></li>
<li><a href="/article/metrics-and-distributed-tracing/">Metrics and distributed tracing: from instrumentation to debugging</a></li>
<li><a href="/en/article/nanohermes-rust-coding-agent/">Writing a coding agent in Rust</a></li>
</ul>
`,
  },
  {
    slug: 'happy-games-24-games-zero-framework-guide',
    zhSlug: 'happy-games-24-games-zero-framework-guide',
    topicSlug: 'projects',
    title: 'Happy Games: 24 browser games with zero frameworks, one deploy',
    excerpt:
      'A browser arcade written in plain HTML, CSS and JavaScript: pattern-scored AI, chess with alpha-beta, GNU Go compiled to WebAssembly, D1-backed multiplayer and LLM-streamed narration.',
    date: '2026-11-05',
    readingTime: 40,
    html: `
<p>Don't look for a game — just start one. A browser arcade in plain HTML, CSS and JavaScript: 24 games, zero frameworks, zero build step, zero dependencies. AI ranging from pattern scoring to WebAssembly, multiplayer over D1 and polling, narration streamed from an LLM, all deployed to Cloudflare Pages in one command.</p>

<p><strong>Play:</strong> <a href="https://happygames.pages.dev" rel="noopener noreferrer" target="_blank">happygames.pages.dev</a> · <strong>Source:</strong> <a href="https://github.com/zhoujungis/happy_games" rel="noopener noreferrer" target="_blank">github.com/zhoujungis/happy_games</a></p>

<h2>Introduction: why another "mini game collection"</h2>

<p>The web does not lack game portals; it lacks a <strong>sample project that can be read end to end and reproduced in one click</strong>. Happy Games is positioned explicitly as:</p>
<ol>
<li><strong>A teaching sample</strong> — every folder runs on its own, with no "install 300 MB of node_modules, then understand five layers of abstraction" tax;</li>
<li><strong>Real technical depth</strong> — under the zero-framework constraint it still does AI (from heuristics to a WASM engine), realtime multiplayer, streamed narration, accounts and end-to-end tests;</li>
<li><strong>Deployable</strong> — the whole site is static files plus Cloudflare Pages Functions and D1, with no containers and no servers; one <code>wrangler</code> command ships it.</li>
</ol>

<p>Read this if you want a starting scaffold for a browser game, a real case of organizing a large front-end without a framework, a minimal full stack on the Cloudflare stack (Pages / Functions / D1), or simply ten minutes of play.</p>

<h2>1. Thirty-second overview</h2>

<table>
<thead><tr><th>Dimension</th><th>Key fact</th></tr></thead>
<tbody>
<tr><td><strong>Games</strong></td><td><strong>24</strong> across four sections: board games 6 / puzzles 6 / casual 6 / Chinese history 6</td></tr>
<tr><td><strong>Constraints</strong></td><td>Native HTML / CSS / JS (ES Modules), <strong>no framework, no build, no dependencies</strong>; double-click an HTML file to run locally</td></tr>
<tr><td><strong>AI</strong></td><td>Pattern scoring (gomoku) → alpha-beta pruning (Chinese chess) → GNU Go compiled to WebAssembly (Go) → three difficulty tiers (jungle chess / reversi)</td></tr>
<tr><td><strong>Multiplayer</strong></td><td>Aeroplane chess for 2–4 players in real time, rooms with passwords, D1 state, polling sync, AI filling empty seats</td></tr>
<tr><td><strong>Narration</strong></td><td>Life simulation and the history brawl call OpenRouter; the server proxies SSE to the browser</td></tr>
<tr><td><strong>Backend</strong></td><td>Cloudflare Pages Functions (file path = route) plus D1 (SQLite in the cloud)</td></tr>
<tr><td><strong>Tests</strong></td><td><code>node --test</code>: 25 files, 288 cases (pure functions and engines); Playwright smoke tests on desktop and mobile</td></tr>
<tr><td><strong>Deploy</strong></td><td><code>npm run deploy</code> → <code>wrangler pages deploy .</code>; layered caching configured in <code>_headers</code></td></tr>
<tr><td><strong>Design rules</strong></td><td>Self-contained folders, pure-function isolation, a data-driven home page, offline-capable</td></tr>
</tbody>
</table>

<h3>The four sections</h3>

<table>
<thead><tr><th>Section</th><th>Theme</th><th>Six games</th></tr></thead>
<tbody>
<tr><td><strong>Board games</strong></td><td>Strategy on a small board</td><td>Gomoku, <strong>Chinese chess</strong>, <strong>Go (GNU Go WASM)</strong>, jungle chess, reversi, <strong>aeroplane chess (multiplayer)</strong></td></tr>
<tr><td><strong>Puzzles</strong></td><td>Logic and deduction</td><td>Rule blocks, light refraction, sudoku, maze escape, echo walker, sokoban</td></tr>
<tr><td><strong>Casual</strong></td><td>Pick up and play</td><td>Spark survivors, <strong>life simulation (AI narration)</strong>, flappy bird, hiking sim, jump jump, stack tower</td></tr>
<tr><td><strong>Chinese history</strong></td><td>Historical figures and institutions</td><td>Seven days of decree, Chinese merchant, Tang magistrate, guess the emperor, <strong>history brawl (AI judge)</strong>, imperial exam</td></tr>
</tbody>
</table>

<h2>2. All 24 games at a glance</h2>

<h3>Board games</h3>
<table>
<thead><tr><th>Game</th><th>One-line rule</th><th>Hard part</th></tr></thead>
<tbody>
<tr><td><strong>Gomoku</strong></td><td>15×15 against the computer</td><td>AI scores eight pattern weights (five in a row 100000, open four 10000, four-three 1000 …); three difficulties map to different search depths</td></tr>
<tr><td><strong>Chinese chess</strong></td><td>Human vs machine</td><td>Port of the open-source <a href="https://github.com/itlwei/Chess" rel="noopener noreferrer" target="_blank">itlwei/Chess</a> engine: move generation with piece rules, nine piece-square value tables, alpha-beta search; the server also offers a GLM-4.7-Flash move proxy as a fallback</td></tr>
<tr><td><strong>Go</strong></td><td>Human vs machine</td><td><strong>GNU Go compiled to WebAssembly (~8.7 MB)</strong>, running in a Web Worker with Komi 7.5; the main thread talks to it over <code>{cmd:'init'/'play'/'genmove'}</code>, with color normalization and a crash move log</td></tr>
<tr><td><strong>Jungle chess</strong></td><td>River and trap rules</td><td>Elephant beats lion, rat beats elephant, rivers and traps; three AI tiers; animal emoji pieces</td></tr>
<tr><td><strong>Reversi</strong></td><td>Eight-direction flipping</td><td>Three AI tiers plus undo</td></tr>
<tr><td><strong>Aeroplane chess</strong></td><td>The only multiplayer game</td><td>2–4 players in real time, classic roll/jump/fly rules, AI filling empty seats so a game can start any time</td></tr>
</tbody>
</table>

<h3>Puzzles</h3>
<table>
<thead><tr><th>Game</th><th>One-line rule</th><th>Highlight</th></tr></thead>
<tbody>
<tr><td><strong>Rule blocks</strong></td><td>Push words to rewrite rules ("wall is stop", "water is sink")</td><td>Inspired by Baba Is You; live rule panel, multiple levels, undo and reset; the goal is to make any "you" meet any "win"</td></tr>
<tr><td><strong>Light refraction</strong></td><td>Rotate mirrors and splitters to light crystals</td><td>Dark grid, 45° rotation, a physics puzzle built on laser splitting</td></tr>
<tr><td><strong>Sudoku</strong></td><td>Classic 9×9</td><td>Three difficulties, timed challenge, pencil marks, conflict highlighting</td></tr>
<tr><td><strong>Maze escape</strong></td><td>Timed traversal of a random maze</td><td>Higher difficulty means larger, twistier mazes; a new map every round</td></tr>
<tr><td><strong>Echo walker</strong></td><td>Every six steps, your old path becomes an echo chasing you</td><td>Shadow mechanic: collect seals while avoiding your past self; almost no tolerance for a bad route</td></tr>
<tr><td><strong>Sokoban</strong></td><td>15 hand-made levels</td><td>Gradual difficulty, warm retro floor palette</td></tr>
</tbody>
</table>

<h3>Casual</h3>
<table>
<thead><tr><th>Game</th><th>One-line rule</th><th>Highlight</th></tr></thead>
<tbody>
<tr><td><strong>Spark survivors</strong></td><td>Vampire-Survivors-like</td><td>Auto-firing, experience drops, three-choice upgrades (fire rate, projectiles, armour …); the build decides how many waves you survive</td></tr>
<tr><td><strong>Life simulation</strong></td><td>Text life sim</td><td>Allocate talents (intellect, physique, fortune …); the AI streams six chapters from childhood to a final verdict, ending with a 0–100 life score</td></tr>
<tr><td><strong>Flappy bird</strong></td><td>Tap to fly through pipes</td><td>Blue sky, green grass, classic feel</td></tr>
<tr><td><strong>Hiking sim</strong></td><td>Three real routes: Aotai traverse, Gongga loop, Wusun trail</td><td>Terrain, supplies, altitude and weather — a hiking simulator in the browser</td></tr>
<tr><td><strong>Jump jump</strong></td><td>Hold to charge, release to jump</td><td>Perfect centre landings give combo bonuses; the subtle physics is the point</td></tr>
<tr><td><strong>Stack tower</strong></td><td>Drop swinging blocks precisely</td><td>Better alignment means a taller tower; overhang trimming and rising speed</td></tr>
</tbody>
</table>

<h3>Chinese history</h3>
<table>
<thead><tr><th>Game</th><th>One-line rule</th><th>Highlight</th></tr></thead>
<tbody>
<tr><td><strong>Seven days of decree</strong></td><td>Complete the imperial decree in seven days</td><td>Three actions per day across seven resources — silver, grain, public support, order, gentry, reputation, intelligence; report after three actions, settle on day seven</td></tr>
<tr><td><strong>Chinese merchant</strong></td><td>Trade across famous cities</td><td>Compete for wealth with three AI merchants; prices and rival strategies shift</td></tr>
<tr><td><strong>Tang magistrate</strong></td><td>Run a county for twelve seasons</td><td>Farms, markets and random events; balance tax, support, granary and order</td></tr>
<tr><td><strong>Guess the emperor</strong></td><td>Identify one of 200+ emperors</td><td>Unlimited guesses; early guesses give conventional clues, from the fifth onward a 50% chance to reveal an attribute comparison</td></tr>
<tr><td><strong>History brawl</strong></td><td>Two players draft, an AI judges</td><td>Random dynasties, ten posts to fill with historical figures; the AI judges by dynasty fit &gt; role fit &gt; actual ability &gt; lineup synergy, in a storyteller's voice</td></tr>
<tr><td><strong>Imperial exam</strong></td><td>Seven stages, three multiple-choice questions each</td><td>Classics, history and ancient institutions; one wrong answer ends the run</td></tr>
</tbody>
</table>

<h2>3. The hard parts</h2>
<h3>3.1 Four levels of AI, from pattern scoring to WebAssembly</h3>

<p>The AI here is never "pick a random move"; it spans four technical levels.</p>

<p><strong>(1) Pattern scoring — gomoku</strong></p>

<p>Eight directions scan the shapes and score them:</p>
<table>
<thead><tr><th>Pattern</th><th>Score</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>Five</td><td>100000</td><td>Already won</td></tr>
<tr><td>Open four</td><td>10000</td><td>Four with both ends open — forced win</td></tr>
<tr><td>Four / open three</td><td>1000</td><td>Four blocked at one end / three open at both</td></tr>
<tr><td>Three / open two</td><td>100</td><td>Three blocked at one end / two open</td></tr>
<tr><td>Two</td><td>10</td><td></td></tr>
<tr><td>Single</td><td>1</td><td></td></tr>
</tbody>
</table>

<p>Difficulties control search depth: easy looks one move ahead and can slip; hard looks several ahead and prefers blocking your open three over completing its own four. Everything is a pure function, so <code>node --test</code> runs it directly.</p>

<p><strong>(2) Alpha-beta pruning — Chinese chess</strong></p>

<p>Ported from <a href="https://github.com/itlwei/Chess" rel="noopener noreferrer" target="_blank">itlwei/Chess</a> (MIT), keeping the engine core: move generation per piece rule (horse legs, elephant eyes, palace diagonals), piece-square value tables, and alpha-beta search with position evaluation. Board logic (<code>xiangqi/logic.js</code>) is fully separated from the engine (<code>xiangqi/engine.js</code>). A server endpoint <code>/api/xiangqi-ai</code> offers a GLM-4.7-Flash move proxy as a fallback when the local engine cannot produce a move in extreme positions.</p>

<p><strong>(3) GNU Go → WebAssembly — Go</strong></p>

<p>The hardest path in the project: the open-source <strong>GNU Go</strong> engine compiled to WebAssembly (<code>weiqi/gnugo.js</code>, about 8.7 MB), running in a <strong>Web Worker</strong> with a message protocol:</p>

<pre><code>main → worker:  { cmd: 'init', size, seed }    start a game (Komi 7.5)
main → worker:  { cmd: 'play', i, j }          player move
main → worker:  { cmd: 'genmove' }             engine move
worker → main:  { ok, cmd, board, last }       board snapshot (color-normalized)
</code></pre>

<p>The worker also does three important things: <strong>color normalization</strong> (the player's color maps to 1, the other to 2, independent of GNU Go's internal constants, so rendering is always consistent); a <strong>move log</strong> so a crashed game can be replayed; and <strong>stdout/stderr capture</strong> through <code>Module.print</code> and <code>printErr</code> for diagnosis.</p>

<p>A world-class board engine running in the browser without blocking the main thread is a complete demonstration that front ends can host heavy AI.</p>

<p><strong>(4) Three difficulty tiers — jungle chess and reversi</strong></p>

<p>Both split AI by search depth into three tiers; reversi adds undo. Same pure-function approach, fully unit-testable.</p>

<h3>3.2 Aeroplane chess: realtime multiplayer on D1</h3>

<p>The only multiplayer game among the 24. Three layers:</p>

<pre><code>create/join  →  state advance (roll/move/start)  →  polling sync
     │                      │                            │
     ▼                      ▼                            ▼
/api/feixingqi/create  /api/feixingqi/roll   client polls every 1.5s (in game)
/api/feixingqi/join    /api/feixingqi/move   / 2s (lobby); the server runs tick() to
                       /api/feixingqi/start  advance AI turns before responding
</code></pre>

<ul>
<li><strong>Rooms:</strong> <code>POST /api/feixingqi/create</code> creates a password-protected room and <code>POST /api/feixingqi/join</code> joins one; room state serializes to JSON in a single D1 row (<code>code / password / state(JSON) / created_at / updated_at</code>).</li>
<li><strong>State advance:</strong> every move is validated server-side against cheating, and empty seats are driven by server-side AI, so a table can start with one human.</li>
<li><strong>Polling:</strong> the client periodically fetches <code>/api/feixingqi/state</code>; before responding the server runs <code>tick()</code> to advance AI turns, so players always see the newest state with everyone else's moves applied.</li>
</ul>

<p>D1 is both database and cache here — good enough, and it avoids the operational cost of WebSockets.</p>

<h3>3.3 Streamed AI narration</h3>

<p>Life simulation and the history brawl bring an LLM into the game, with the server proxying SSE.</p>

<p><strong>Life simulation (<code>/api/life/narrate</code>)</strong></p>
<ul>
<li>After allocating birth attributes the client posts <code>{attributes}</code>;</li>
<li>the server calls OpenRouter (<code>inclusionai/ling-3.0-flash:free</code>) and forwards the SSE stream verbatim as <code>text/event-stream</code>;</li>
<li>six chapters — childhood, youth, adulthood, middle age, later life, verdict — generate character by character, like someone telling a story across the table;</li>
<li>429 rate limits trigger automatic backoff (three attempts, 2.5 s × attempt), and the prompt pins the output shape (130–180 characters per chapter, a final line "Life score: NN").</li>
</ul>

<p>Prompt constraints:</p>

<pre><code>You are the randomiser AI of a Chinese life simulator. Output exactly six headings, one per line:
[Childhood] [Youth] [Adulthood] [Middle age] [Later life] [Verdict]
The first five are 130-180 characters each, and must include concrete events, their impact,
and how they change the next stage. The final section must begin with "Life score: NN." (NN 0-100).
</code></pre>

<p><strong>History brawl (<code>/api/battle/analyze</code>)</strong></p>
<ul>
<li>Two players alternately draft historical figures for ten posts (vanguard, logistics, …), then ask the AI judge;</li>
<li>the AI scores ten matchups in the order <strong>dynasty fit &gt; role fit &gt; ability &gt; synergy</strong>, with each round precise to 0.1 and summing to exactly 10;</li>
<li>the voice is a storyteller's ("now then…", "behold…"), also streamed over SSE.</li>
</ul>

<blockquote>
<p>Both are lightweight "game + LLM" patterns: the server only authenticates, rate-limits and forwards the stream, never storing model state; the client consumes standard SSE and a failure does not break the game loop.</p>
</blockquote>

<h3>3.4 Accounts and the admin console</h3>
<ul>
<li>Register / login / logout: <code>POST /api/register|login|logout</code>; passwords live in the D1 <code>users</code> table, sessions use a random token in the <code>hg_token</code> cookie with a 30-day expiry check;</li>
<li><code>GET /api/me</code> lets the front end know the login state; home shows "username · logout", and the admin account unlocks a hidden console at <code>/adminPages/</code>;</li>
<li>middleware in <code>functions/_middleware.js</code>: unauthenticated HTML page requests 302 to <code>/login.html</code>, while static assets and <code>/api/*</code> pass; admin paths additionally require the admin username or return 403;</li>
<li>admin endpoints: <code>GET /api/admin/users</code> and <code>GET /api/admin/game-stats</code>.</li>
</ul>

<h3>3.5 Absurdly fast: caching and details</h3>
<ul>
<li><strong>Zero dependencies, zero build:</strong> static assets open instantly, no bundle to wait for;</li>
<li><strong>Layered caching in <code>_headers</code>:</strong>
  <ul>
  <li><code>.css/.js/.mjs</code> → <code>max-age=300, stale-while-revalidate=86400</code>;</li>
  <li><code>.wasm</code> → <code>max-age=604800, immutable</code> — the GNU Go engine loads once and is cached for a week;</li>
  <li>images → <code>max-age=86400, stale-while-revalidate=604800</code>;</li>
  </ul>
</li>
<li><strong>Home page:</strong> three random recommendations per visit plus a "play something random" button;</li>
<li><strong>Responsive:</strong> breakpoints at 850 px and 600 px, playable on phone and desktop, touch and keyboard;</li>
<li><strong>Runtime:</strong> <code>shared/game-runtime.js</code> owns lifecycle, score and event reporting, and a failure there never blocks the game loop.</li>
</ul>

<h2>4. Stack</h2>
<table>
<thead><tr><th>Layer</th><th>Technology</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>Frontend</td><td>Native HTML / CSS / JS (ES Modules)</td><td>No framework, no build, no dependencies; <code>shared/theme.css</code> defines the whole visual vocabulary (ink, vermilion, gold, jade)</td></tr>
<tr><td>Board rendering</td><td>Hand-written SVG / Canvas</td><td>Per game; pure-function previews exported from <code>shared/landing.js</code></td></tr>
<tr><td>AI</td><td>GNU Go → WebAssembly (worker) / alpha-beta / pattern scoring / minimax</td><td>A world-class engine inside the browser</td></tr>
<tr><td>Cloud AI</td><td>OpenRouter (streamed narration) / Moark (GLM-4.7-Flash chess proxy)</td><td>SSE passthrough</td></tr>
<tr><td>Backend</td><td>Cloudflare Pages Functions</td><td>File path becomes the route, no configuration</td></tr>
<tr><td>Database</td><td>Cloudflare D1</td><td>Seven tables: <code>users / sessions / battle_rooms / feixingqi_rooms / game_sessions / game_events / game_scores</code></td></tr>
<tr><td>Tests</td><td>Node's built-in runner (25 files, 288 cases) plus Playwright smoke</td><td>Pure functions plus browser E2E</td></tr>
<tr><td>Deploy</td><td>Cloudflare Pages</td><td><code>wrangler.toml</code> binds Pages and D1</td></tr>
<tr><td>Caching</td><td><code>_headers</code> plus <code>_routes.json</code></td><td>Fine-grained control, static assets skip Functions</td></tr>
</tbody>
</table>

<h2>5. Architecture</h2>
<h3>5.1 Front end: self-contained folders, data-driven home</h3>

<pre><code>index.html          home: section cards + daily picks + random game
/board /puzzle /fun /history   section pages with that section's cards
shared/landing.js   ★ single source of truth: sections + game config + SVG previews
shared/game-runtime.js  lifecycle, score and feedback event queue
shared/theme.css / cards.css / game.css

each game = one self-contained folder
&lt;game&gt;/index.html      page shell plus rules dialog
&lt;game&gt;/&lt;game&gt;.js       interaction and rendering (may include a worker)
&lt;game&gt;/&lt;game&gt;.css      its own styles
&lt;game&gt;/ai.js           pure AI, no DOM, unit-testable
&lt;game&gt;/engine.js       pure logic engine (moves, rules, state machine)
&lt;game&gt;/logic.js        board rules (captures, liberties)
&lt;game&gt;/levels.js       level data (e.g. 15 sokoban levels)
</code></pre>

<p><strong>Three design rules.</strong></p>
<ol>
<li><strong>Shared theme.</strong> <code>shared/theme.css</code> defines the CSS variables (<code>--ink</code>, <code>--accent-red</code>, <code>--accent-gold</code>, <code>--border</code>, <code>--surface</code>, <code>--shadow-soft</code> …), <code>shared/cards.css</code> styles the cards, <code>shared/game.css</code> the in-game layout and state feedback. Every game reuses one visual language instead of inventing colors.</li>
<li><strong>Data-driven home page.</strong> <code>shared/landing.js</code> is the only data source: <code>sections</code> defines four sections × six games with <code>id / name / description / href / accent / previewSvg</code>, <code>renderHome()</code> draws the four entry cards and <code>renderSection(id)</code> draws that section's six cards. Recommendations, the random button and counts all derive from this — <strong>adding a game touches one place</strong>.</li>
<li><strong>Self-containment.</strong> One folder per game holds page, styles, logic and AI; adding a game touches no other game, and deleting one is deleting a folder.</li>
</ol>

<p><strong>Shared runtime (<code>shared/game-runtime.js</code>)</strong> creates a session per game, records key events, syncs score snapshots and submits results on finish or page leave: <code>createGameRuntime({gameId, autoStart})</code> generates a <code>sessionId</code>, <code>start()</code> posts <code>/api/game/sessions</code>, <code>setScore()</code> deduplicates and pushes a <code>score_snapshot</code>, <code>finish(outcome)</code> posts <code>/api/game/finish</code> and flushes. Events batch with <code>MAX_QUEUE=60 / FLUSH_SIZE=6 / FLUSH_DELAY=1600ms</code> and an idempotent <code>eventId</code>; a network failure requeues instead of blocking the loop. A <code>MutationObserver</code> watches <code>#score</code>, <code>[data-score]</code>, <code>.score-value</code> and <code>#status</code> to infer results, custom events (<code>happy-game-score</code>, <code>happy-game-event</code>) let a game report directly, and <code>pagehide</code> uses <code>navigator.sendBeacon</code> so scores are not lost.</p>

<blockquote>
<p>The philosophy: <strong>the domain layer must not know about DOM, canvas, network or database</strong>. Pages consume domain snapshots, the runtime owns lifecycle and feedback, and <code>ai.js</code> / <code>engine.js</code> stay pure so Node can test them. <code>docs/architecture.md</code> fixes the boundary: <code>page → shared UI/runtime → game domain → API client → Pages Functions → D1</code>.</p>
</blockquote>

<h3>5.2 API reference</h3>

<p>Everything under <code>functions/api/</code>; the file name is the route.</p>

<table>
<thead><tr><th>Endpoint</th><th>Method</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>/api/register</code></td><td>POST</td><td>Create a user in D1</td></tr>
<tr><td><code>/api/login</code></td><td>POST</td><td>Sign in, issue the <code>hg_token</code> cookie (30 days)</td></tr>
<tr><td><code>/api/logout</code></td><td>POST</td><td>Sign out, destroy the session</td></tr>
<tr><td><code>/api/me</code></td><td>GET</td><td>Current session (<code>{username}</code> or 401)</td></tr>
<tr><td><code>/api/xiangqi-ai</code></td><td>POST</td><td>Chess move proxy (FEN in, move out, via Moark)</td></tr>
<tr><td><code>/api/life/narrate</code></td><td>POST</td><td>Streamed life story from attributes (SSE)</td></tr>
<tr><td><code>/api/battle/create</code> <code>join</code> <code>pick</code> <code>state</code></td><td>POST/GET</td><td>History brawl rooms, drafting and state</td></tr>
<tr><td><code>/api/battle/analyze</code> <code>analysis</code></td><td>POST/GET</td><td>AI judge, round by round, streamed</td></tr>
<tr><td><code>/api/feixingqi/create</code> <code>join</code> <code>start</code> <code>roll</code> <code>move</code> <code>state</code></td><td>POST/GET</td><td>Aeroplane chess rooms, rolling, moving, polling</td></tr>
<tr><td><code>/api/admin/users</code></td><td>GET</td><td>Admin: user list</td></tr>
<tr><td><code>/api/admin/game-stats</code></td><td>GET</td><td>Admin: sessions and score statistics</td></tr>
<tr><td><code>/api/game/sessions</code></td><td>POST</td><td>Start a game session</td></tr>
<tr><td><code>/api/game/events</code></td><td>POST</td><td>Batch key events (idempotent <code>event_id</code>, whitelisted types)</td></tr>
<tr><td><code>/api/game/finish</code></td><td>POST</td><td>Settle and write the final score</td></tr>
</tbody>
</table>

<p>Shared helpers live in <code>functions/api/feixingqi/_shared.js</code> (<code>json()</code>, <code>parseCookie()</code>, <code>whoami()</code>, <code>loadRoom()</code>, <code>saveRoom()</code>) and <code>functions/api/game/_shared.js</code>. Business logic sits in <code>functions/services/game-service.js</code>, D1 access in <code>functions/repositories/game-repository.js</code> — <strong>Functions are transport adapters, services own the workflow, repositories own the SQL</strong>.</p>

<h3>5.3 Database</h3>

<p><code>schema.sql</code> defines seven tables; incremental changes live in <code>migrations/</code>. New databases run the whole schema; existing ones apply migrations in order.</p>

<pre><code>users            -- username PK, password, created_at
sessions         -- token PK, username, expires_at (idx_sessions_username)
battle_rooms     -- brawl rooms: code PK / password / state(JSON) / timestamps
feixingqi_rooms  -- aeroplane rooms: same shape, state holds seats/pieces/turn/dice/log
game_sessions    -- one row per run: id, game_id, username, anonymous_id, started_at,
                 --   ended_at, status, score, duration_ms, metadata(JSON)
game_events      -- whitelisted events: event_id UNIQUE, session_id, type, score, payload
game_scores      -- final scores: session_id PK, game_id, username, score, outcome, duration
</code></pre>

<p>Room state is one JSON row (simple enough), multiplayer uses client polling plus a server state machine, and D1 is both database and cache. Indexes cover the hot queries: <code>game_sessions(game_id, started_at)</code>, <code>game_events(session_id, created_at)</code>, <code>game_scores(game_id, score DESC)</code>.</p>

<h2>6. Quick start</h2>

<p><strong>Requires</strong> Node.js 18+ (both wrangler and <code>node --test</code> need it).</p>

<pre><code>git clone https://github.com/zhoujungis/happy_games.git
cd happy_games
npm install          # only wrangler and playwright, no frontend dependencies
npm run dev          # static assets plus Pages Functions
# open http://localhost:8788
</code></pre>

<blockquote>
<p><code>wrangler pages dev .</code> reads the D1 binding from <code>wrangler.toml</code>. Local D1 must be created or synced first:</p>
<pre><code>npx wrangler d1 create happy-games-db   # put the database_id into wrangler.toml
npx wrangler d1 execute happy-games-db --local --file=schema.sql
# or, for a remote database you already created in the dashboard:
npx wrangler d1 execute happy-games-db --remote --file=schema.sql
</code></pre>
</blockquote>

<h3>Tests</h3>
<pre><code>npm test          # Node's test runner over tests/*.test.js (25 files, 288 cases)
npm run check     # tools/check.mjs: JS syntax plus HTML charset/viewport checks
npm run test:e2e  # Playwright smoke: desktop and mobile home, canvas games, overflow
</code></pre>

<p>Testing in Node works because every AI and engine is a <strong>DOM-free pure function</strong> (<code>gomoku/ai.js</code>, <code>xiangqi/engine.js</code>, <code>weiqi/logic.js</code>, <code>feixingqi/engine.js</code> …): importing is enough to assert.</p>

<h2>7. Deploying from zero</h2>

<p>The site is published directly to Cloudflare Pages (<code>pages_build_output_dir = "."</code>) with no build step.</p>

<p><strong>Step 1: create the D1 database.</strong> In the Cloudflare dashboard → Workers &amp; Pages → D1 SQL Database → Create database, name it <code>happy-games-db</code>, then put the id into <code>wrangler.toml</code>:</p>

<pre><code>name = "happy-games"
compatibility_date = "2025-01-01"
pages_build_output_dir = "."

[[d1_databases]]
binding = "DB"
database_name = "happy-games-db"
database_id = "your-database-id"
</code></pre>

<p>Then create the tables and verify:</p>

<pre><code>npx wrangler d1 execute happy-games-db --remote --file=schema.sql
for f in migrations/*.sql; do npx wrangler d1 execute happy-games-db --remote --file="$f"; done
npx wrangler d1 execute happy-games-db --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
</code></pre>

<p><strong>Step 2: environment variables.</strong> In the Pages project → Settings → Variables and Secrets, add <code>OPENROUTER_KEY</code> if you want the life-simulation narration; without it that feature returns 503 and nothing else is affected. A separate key is needed if you use the Moark chess proxy (see the comment at the top of <code>functions/api/xiangqi-ai.js</code>).</p>

<p><strong>Step 3: deploy.</strong></p>

<pre><code>npm run deploy
# equivalent to npx wrangler pages deploy .
</code></pre>

<p>The first run creates the <code>happy-games</code> Pages project; later runs publish incrementally, with Cloudflare handling the domain and HTTPS. Caching comes from <code>_headers</code>, and <code>_routes.json</code> keeps static assets out of Functions so only <code>/api/*</code> and HTML hit the worker:</p>

<pre><code>{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/*.css","/*.js","/*.mjs","/*.wasm","/*.png","/*.svg","/robots.txt","/rss.xml"]
}
</code></pre>

<p><strong>Common traps</strong></p>
<table>
<thead><tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>/api/me</code> 401 while signed in</td><td>The <code>hg_token</code> cookie is not sent</td><td>Check <code>credentials: 'same-origin'</code> and that you are on the Pages domain, not <code>file://</code></td></tr>
<tr><td>Life simulation 503</td><td><code>OPENROUTER_KEY</code> missing</td><td>Add the variable, then retry the deployment</td></tr>
<tr><td>D1 "no such table"</td><td><code>schema.sql</code> never ran remotely</td><td>Run <code>wrangler d1 execute --remote --file=schema.sql</code> again</td></tr>
<tr><td>Slow <code>.wasm</code> load</td><td>Cache miss</td><td>Confirm <code>_headers</code> marks <code>.wasm</code> immutable; a second visit should come from cache</td></tr>
</tbody>
</table>

<h2>8. Adding a game: change two places, the whole site follows</h2>

<p>Thanks to the data-driven design, adding a game takes two steps.</p>

<p><strong>1. Create the folder</strong> (mirroring <code>gomoku/</code>):</p>

<pre><code>&lt;game&gt;/
├── index.html     # shell: header + board/canvas + rules dialog, imports shared CSS
├── &lt;game&gt;.css     # game-specific styles
├── &lt;game&gt;.js      # interaction and rendering (may include a worker)
└── ai.js          # pure AI, testable with node --test
</code></pre>

<p>The HTML needs <code>&lt;meta charset&gt;</code>, <code>&lt;meta viewport&gt;</code>, a board container, score and status elements (<code>#score</code>, <code>#status</code> for the runtime's auto-snapshot), and a rules dialog; a module script imports <code>&lt;game&gt;.js</code> and calls <code>createGameRuntime()</code>.</p>

<p><strong>2. Register it</strong> in the matching section's <code>games</code> array in <code>shared/landing.js</code>:</p>

<pre><code>{
  id: 'mygame',            // folder name and path segment
  name: 'My game',
  description: 'One-line summary',
  href: '/mygame/',
  accent: '#2980b9',
  previewSvg: \`&lt;svg viewBox="0 0 120 120"&gt;…&lt;/svg&gt;\`,
}
</code></pre>

<p>That is all: the home section cards, section pages, daily picks and the random button all include the new game without touching another file. That is what a single source of truth buys.</p>

<blockquote>
<p>Constraints from <code>docs/architecture.md</code>: keep existing URLs and static deployment stable; migrate a representative game before batch migration; keep pure-logic tests green; add browser coverage for lifecycle, score, offline and responsive behavior.</p>
</blockquote>

<h2>9. Project layout</h2>

<pre><code>├── index.html                  home: sections + daily picks + random game
├── login.html                  login and registration
├── adminPages/                 admin console (owner only)
├── board/ puzzle/ fun/ history/   section pages
├── shared/
│   ├── theme.css               global variables and base styles
│   ├── cards.css               card styles
│   ├── game.css                in-game shared styles
│   ├── game-runtime.js         ★ lifecycle, score and events
│   └── landing.js              ★ the single data source
├── functions/
│   ├── _middleware.js          login guard and admin auth
│   ├── services/               game-service.js
│   ├── repositories/           game-repository.js
│   └── api/
│       ├── register.js login.js logout.js me.js
│       ├── xiangqi-ai.js
│       ├── life/narrate.js
│       ├── battle/*.js         brawl rooms and AI judge
│       ├── feixingqi/*.js      multiplayer aeroplane chess
│       ├── game/*.js           sessions, events, settlement
│       └── admin/              admin endpoints and statistics
├── &lt;game&gt;/                     24 self-contained game folders
├── schema.sql                  seven tables
├── migrations/                 incremental D1 migrations
├── tests/                      25 files, 288 cases
├── e2e/                        Playwright smoke tests
├── tools/check.mjs             syntax and HTML meta checks
├── wrangler.toml               Pages and D1 configuration
├── _headers                    layered cache policy
├── _routes.json                static assets skip Functions
├── assets/                     README preview images exported from landing.js
└── docs/architecture.md        boundaries and migration rules
</code></pre>

<h2>10. Why insist on zero frameworks</h2>

<p>Not nostalgia — a trade-off:</p>
<ol>
<li><strong>Readability first.</strong> Twenty-four games with completely different logic gain little from React or Vue abstractions, which add "understand the framework before the game". Native code lets a newcomer follow one game end to end in ten minutes.</li>
<li><strong>Portability.</strong> <code>ai.js</code> and <code>engine.js</code> depend on nothing; Node imports them directly, and moving to a mini-program, Electron or a server would only require rewriting the rendering layer.</li>
<li><strong>Performance and offline.</strong> No framework means no runtime cost, no hydration and no bundle. Apart from narration and multiplayer, every game works without network, and <code>_headers</code> caching makes repeat visits nearly offline.</li>
<li><strong>Teaching value.</strong> This is a front-end project that can be read completely: no black-box bundler, no two thousand lines of config — just HTML files that run once uploaded to Cloudflare Pages.</li>
</ol>

<p>Zero frameworks does not mean zero conventions. The variable system in <code>shared/theme.css</code>, the single data source in <code>landing.js</code>, the lifecycle contract in <code>game-runtime.js</code> and the layering in <code>functions/services</code> form an invisible framework — agreed upon, not depended upon.</p>

<h2>Closing</h2>

<p>Happy Games tries to prove that even in the age of heavy front-end frameworks, native technology can still deliver a complete, maintainable, deployable full-stack product — as long as the boundaries are drawn (domain separate from rendering, data-driven home, layered backend), AI is written as pure functions, multiplayer as a state machine, and deployment handed to Cloudflare.</p>

<p>Each of the 24 games is its own small world: strategist on a board, escapee in a maze, merchant on a trade route, courtier under a seven-day decree, scholar in an imperial exam. Don't look for a game — start one.</p>

<blockquote>
<p><strong>Further reading:</strong> <a href="https://github.com/zhoujungis/happy_games" rel="noopener noreferrer" target="_blank">github.com/zhoujungis/happy_games</a> · <a href="https://happygames.pages.dev" rel="noopener noreferrer" target="_blank">happygames.pages.dev</a> · <a href="https://www.gnu.org/software/gnugo/" rel="noopener noreferrer" target="_blank">GNU Go</a> · <a href="https://developers.cloudflare.com/pages/" rel="noopener noreferrer" target="_blank">Cloudflare Pages</a> · <a href="https://developers.cloudflare.com/d1/" rel="noopener noreferrer" target="_blank">Cloudflare D1</a></p>
<p><em>Written against the <code>master</code> branch of <code>happy_games</code> as of September 2026; endpoints and tables follow <code>schema.sql</code> and <code>wrangler.toml</code> and may drift with later versions.</em></p>
</blockquote>

<p>Along the same chain: <a href="/en/article/nanobrowser-tauri-webview2/">NanoBrowser: hand-writing an in-process CDP</a> and <a href="/en/article/halo-music-square-architecture/">Halo Music: a multi-source music app</a>.</p>
`,
  },
  {
    slug: 'nanoss-windows-ssh-client',
    zhSlug: 'nanoss-windows-ssh-client',
    topicSlug: 'projects',
    title: 'NanoSSH: a 13 MB Windows SSH client, and the twelve boundaries that shaped it',
    excerpt:
      'A Wails + WebView2 SSH client in one 13.23 MB exe: binary terminal streams over a base64 event bridge, end-to-end ack backpressure, PTY argument order, host-key trust and twelve concrete failures.',
    date: '2026-11-05',
    readingTime: 41,
    html: `
<blockquote>
<p>Who this is for: developers building lightweight desktop tools with Go and a webview, or anyone working with terminal byte streams and SSH protocol details.</p>
<p><strong>TL;DR:</strong> the point of this project is not feature count but a handful of boundaries that are easy to get wrong — how IPC serializes, terminal backpressure, PTY parameter order, the host-key trust model and Windows platform details.</p>
<p>Reading time ~30 minutes · Level: advanced</p>
</blockquote>

<strong>Contents</strong>
<ul>
<li>A deliberately narrow Windows SSH client</li>
<li>Architecture: put the risk in the replaceable layer</li>
<li>Problem 1: the README says binary WebSocket, the code is a base64 event bridge</li>
<li>Problem 2: multi-byte characters split across chunks become U+FFFD</li>
<li>Problem 3: the ack loop and its three traps</li>
<li>Problem 4: PTY width and height order</li>
<li>Problem 5: known_hosts and the hard edges of TOFU</li>
<li>Problem 6: the Windows ssh-agent named pipe</li>
<li>Problem 7: the tray icon clicks do nothing</li>
<li>Problem 8: the 14 MB size ceiling</li>
<li>Problem 9: high-DPI flicker and zero-sized terminals</li>
<li>Problem 10: SFTP and forwarding share a connection, not a lifetime</li>
<li>Problem 11: passwords, stale passwords and credential self-healing</li>
<li>Problem 12: three edges of key management</li>
<li>Closing</li>
</ul>
<hr>

<h2>A deliberately narrow Windows SSH client</h2>

<p>The positioning first: NanoSSH is a Windows SSH client that does five things — server list, terminal, SFTP, local port forwarding and key management. No accounts, no cloud sync, no plugin market, no AI assistant, no auto-update. The narrow scope is the product thesis, not an unfinished roadmap.</p>

<p>The stack is Wails v2 plus WebView2. The Go backend splits into three: <code>internal/sshcore</code> is a pure SSH core with no UI dependency; <code>internal/shell</code> is the Wails binding facade owning sessions, files, forwards, keys and the tray; <code>internal/store</code> handles persistence. The frontend is framework-free TypeScript, DOM built by a hand-written <code>h()</code>, state via <code>@preact/signals-core</code>, terminal via xterm.js 6. Seven runtime dependencies in total, six of them xterm and its addons.</p>

<p>The artefact is a single executable, 13.23 MB on x64, with no external runtime. <code>build.ps1</code> sets 14 MB as a hard ceiling and fails the build past it. Five direct Go dependencies, twenty-seven indirect. Those numbers are not marketing: they constrain many later decisions — no SQLite, a hand-written tray, no third-party systray, as few new modules as possible.</p>

<p>Because the constraints are hard, the problems here are concrete: not "should we support X" but "why did this Chinese character become a question mark", "why does the tray icon ignore clicks", "why does vim open misaligned". Each problem below has symptom, cause, fix and cost.</p>

<h2>Architecture: put the risk in the replaceable layer</h2>

<p>The most important decision is separating SSH protocol logic from the UI shell completely. <code>sshcore</code> does not know Wails, WebView2 or xterm exist; it exposes connections, sessions, SFTP, forwarding and key parsing. <code>shell</code> translates core capabilities into callable bindings and moves byte streams into event channels. The frontend reaches the backend through two layers, <code>ipc/api.ts</code> and <code>ipc/transport.ts</code>.</p>

<p>The benefit is that risk sits in the replaceable layer. Wails is the shell; swapping it for bare WebView2 or another window container means changing <code>main.go</code>, the bindings in <code>internal/shell</code> and two frontend IPC files — <code>sshcore</code> untouched. Conversely, protocol tests need no window: an in-process test sshd exercises connections, PTYs, SFTP and forwarding.</p>

<p>The backend's event outlet is a function type rather than a hard-coded Wails call:</p>

<pre><code>type emitFunc func(ctx context.Context, eventName string, data ...any)
</code></pre>

<p><code>App</code> and <code>shellSession</code> both hold it: production assigns <code>runtime.EventsEmit</code>, tests assign a collector. That small indirection is what later makes backpressure, host-key prompts and transfer progress testable.</p>

<p>Persistence follows the same narrow rule: <code>servers.json</code> is the only database, versioned at 1, with pure-function migration on read, a <code>.bak</code> before saving, then temp file, fsync and rename. <code>known_hosts</code> uses OpenSSH format so it can be exchanged with the system file; private keys are standard OpenSSH; logs live under <code>logs</code>. The data root defaults to <code>%APPDATA%\\NanoSSH</code>, overridden by <code>NANOSSH_DATA_DIR</code> for tests and portable mode. No hidden binary formats — everything opens in a text editor when something goes wrong.</p>

<p>The window layer has some non-business plumbing that still shapes the experience: the frameless title bar is drawn by the frontend while Wails keeps resize hot zones and shadow; a single-instance lock focuses the existing window instead of starting a second process; Mica background reads <code>CurrentBuildNumber</code> from the registry and only enables translucency from build 22621, falling back to opaque on older systems so you never get a transparent window with no background. The frontend reads <code>MicaEnabled()</code> and decides whether the title bar and sidebar become translucent surfaces.</p>

<p>The frontend has one seam too: <code>views</code>, <code>term</code> and <code>components</code> never touch <code>window.go</code>; every binding call and event subscription goes through <code>api.ts</code>. Byte transport lives alone in <code>transport.ts</code>, the only frontend module strongly tied to the shell. Swapping Wails later rewrites a deliberately bounded area.</p>

<h2>Problem 1: the README says binary WebSocket, the implementation is a base64 event bridge</h2>

<p><strong>Symptom.</strong> The README mentions "binary WebSocket IPC + ack backpressure", yet no WebSocket server or binary framing exists anywhere. Terminal data actually travels over Wails <code>runtime.EventsEmit</code> with event names like <code>term:data:&lt;sessionId&gt;</code>.</p>

<p><strong>Cause.</strong> The README described the original intent; the implementation settled on Wails' own event bridge. Another part of the same README says "a Worker decodes base64", which contradicts the first claim. Wails binding calls are JSON-serialized, and so are event payloads: a Go <code>[]byte</code> arrives in the frontend as a base64 string. The dependency tree does contain <code>gorilla/websocket</code>, but as a transitive Wails dependency, not this IPC.</p>

<p><strong>Fix.</strong> Rather than build a WebSocket to match the document, the project accepted the bridge's limits and compensated: the frontend decodes base64 in a Web Worker and transfers the <code>ArrayBuffer</code> to the main thread via Transferable so decoding never blocks rendering, then hands raw bytes to xterm's <code>write</code> without string concatenation.</p>

<pre><code>function decodeBase64(input: string): Uint8Array {
  const bin = atob(input);
  const len = bin.length;
  const out = new Uint8Array(len);
  for (let i = 0; i &lt; len; i++) out[i] = bin.charCodeAt(i);
  return out;
}

ctx.onmessage = (e: MessageEvent&lt;string&gt;) =&gt; {
  const buf = decodeBase64(e.data);
  ctx.postMessage(buf, [buf.buffer]);
};
</code></pre>

<p><strong>Cost.</strong> Base64 inflates bytes by roughly 33%, so a 16 KiB terminal chunk becomes a ~21.8 KiB string; Go also serializes JSON and the webview decodes base64. What it buys: no WebSocket service to maintain, no connection auth, no extra port outside Wails. That trade is acceptable for a local SSH client, but the README was inaccurate. The fix was to document "Wails event bridge + base64 decoding" rather than keep a faster-sounding noun. Engineering documents should describe the implementation, not the wish. Reverting to binary WebSocket would also lose single-instance, same-origin event dispatch and no-extra-port, and require solving local authentication and a new attack surface — which is why the implementation was not changed for the document.</p>

<p>When a Worker is unavailable (some restricted webview environments), <code>createDecoder</code> falls back to synchronous <code>atob</code> on the main thread: decoding then occupies the render thread and long output stutters, but nothing is missing. Each terminal session owns a Worker, kept across tab switches and terminated only when the session closes; many sessions mean a few more Worker instances in memory.</p>

<h2>Problem 2: multi-byte characters split across chunks become U+FFFD</h2>

<p><strong>Symptom.</strong> An <code>echo</code> containing Chinese, Korean or emoji occasionally shows <code>�</code> mid-output. Intermittent, and more likely with longer output or a slower machine.</p>

<p><strong>Cause.</strong> The backend initially did <code>string(buf[:n])</code> after each read and split on lines before sending. SSH channel read boundaries have nothing to do with character boundaries: a three-byte character can straddle two <code>Read</code> calls. Converting half a character to a string forces Go to emit U+FFFD, and once a UTF-8 decode has happened the pieces can never be rejoined.</p>

<p><strong>Fix.</strong> <code>[]byte</code> end to end in the backend. A fixed 32 KiB read buffer; each read is copied immediately into a <code>chunks</code> channel of depth 8; <code>pumpSession</code> only merges, batches and sends — no line splitting, no decoding. stdout and stderr have separate reader goroutines writing into the same channel, consumed by a single writer. xterm receives raw bytes and does its own decoding and wide-character handling.</p>

<p>Two paths must be distinguished: an interactive shell streams through <code>pumpSession</code>, while non-interactive <code>RunCommand</code> collects output in a <code>limitedBuffer</code> capped at 8 MiB, silently dropping the excess without blocking the remote. The latter is for probes and batch work only; large output must go through the shell or the SFTP streaming API.</p>

<pre><code>buf := make([]byte, 32&lt;&lt;10)
for {
    n, err := rd.Read(buf)
    if n &gt; 0 {
        cp := make([]byte, n)
        copy(cp, buf[:n])
        select {
        case chunks &lt;- cp:
        case &lt;-sess.done:
            return
        }
    }
    if err != nil {
        return
    }
}
</code></pre>

<p><code>TestShellUTF8Passthrough</code> covers this: the remote echoes <code>你好，世界 한국어 日本語 emoji🙂</code> and the test asserts the line is byte-identical with no U+FFFD. Another test pushes a 40,000-byte single line past the 16 KiB chunk cap to force multiple flush/ack rounds and confirms nothing is dropped. The non-interactive path has an 8 MiB flood command to confirm large output reads continuously.</p>

<p><strong>Cost.</strong> The backend gave up line-oriented processing, so keyword filtering, log writing or command auditing must happen in the frontend or a separate parser. Each chunk is copied because the read buffer is reused; a small memory cost for correct ownership. stdout and stderr ordering is not strictly guaranteed, though a PTY merges them and the result usually looks right.</p>

<h2>Problem 3: the ack loop and its three traps</h2>

<p><strong>Symptom.</strong> With a plain "read and send", running <code>cat</code> on a large local file makes the webview event queue grow without bound: the terminal lags, then the window freezes. Worse, once the frontend is destroyed the Go reader waits forever for an ack that will never arrive, so the session can be neither read nor closed.</p>

<p><strong>Cause.</strong> Wails event emission offers no "the frontend has processed this" signal. xterm's <code>write</code> is asynchronous; pushing more data before the buffer renders accumulates latency without limit. The SSH channel has a window, but that window covers Go's reader, not the webview renderer. The middle has no feedback loop, so pressure piles up in process memory.</p>

<p><strong>Fix.</strong> Make ack an explicit end-to-end backpressure signal: the backend sends one chunk at a time and waits for the frontend to ack inside xterm's <code>write</code> callback. Constants: at most 16 KiB per send, at most 8 ms of batching, at most 30 s waiting for an ack. <code>ackCh</code> has capacity 1, and <code>AckTermData</code> drops duplicates with <code>select/default</code>.</p>

<pre><code>flush := func() {
    if len(pending) == 0 {
        return
    }
    data := pending
    pending = nil
    sess.emit(sess.ctx, "term:data:"+sess.id, data)
    select {
    case &lt;-sess.ackCh:
    case &lt;-sess.done:
    case &lt;-time.After(termAckTimeout):
        wruntime.LogWarning(sess.ctx, "terminal: ack timeout, resuming reads")
    }
}
</code></pre>

<p>The frontend chains <code>write</code> and <code>ack</code> through a promise so slow rendering cannot reorder acks:</p>

<pre><code>this.chain = this.chain
  .then(() =&gt; this.handlers.onData(bytes))
  .then(() =&gt; (this.disposed ? undefined : backend.ackTermData(this.sessionId)))
  .catch((err) =&gt; console.error("[nanossh] terminal write failed:", err));
</code></pre>

<p>Three traps. First, the frontend can ack before the backend starts waiting, so <code>ackCh</code> needs capacity 1 or the first ack is lost. Second, <code>dispose</code> must send one final ack, or the reader hangs until the 30-second timeout. Third, duplicate acks must be discarded safely, because only one chunk is in flight at any moment.</p>

<p>One easily missed detail in <code>flush</code>: if <code>chunks</code> is drained while waiting, the timer may already have fired, so the next loop iteration must <code>Stop</code> and drain it or a second flush happens immediately. The 8 ms batch is not about reducing event count but about sending small packets like keystroke echoes promptly; batching only at 16 KiB makes interaction feel dull.</p>

<p>In tests, the collector acks synchronously inside the event callback — equivalent to the fastest possible "already rendered". A real browser also goes through Worker decoding, Transferable transfer and xterm rendering, so production chunk intervals are longer.</p>

<p><strong>Cost.</strong> Throughput is capped by rendering speed, deliberately: terminals want low latency, not maximum bandwidth. Acks carry no chunk sequence number, so the implementation guarantees only one chunk in flight; parallel chunks would need IDs. The 30-second timeout is a safety net, not a normal path — it converts "frontend hung" into "backend keeps reading", which can mask a real rendering fault, so it must be visible in logs.</p>

<h2>Problem 4: PTY width and height order</h2>

<p><strong>Symptom.</strong> <code>vim</code> opens fine locally but the whole screen misaligns through NanoSSH, and <code>htop</code> columns do not line up. Resizing sometimes makes it "accidentally" correct. The initial suspicion was xterm's <code>fit</code>; the bug was in the backend.</p>

<p><strong>Cause.</strong> Two contradictory naming conventions. RFC 4254's <code>pty-req</code> and <code>window-change</code> encode width first, then height; <code>golang.org/x/crypto/ssh</code>'s <code>RequestPty(term, h, w, modes)</code> and <code>WindowChange(h, w)</code> take height first, then width. Following the RFC field order into x/crypto swaps the two, so vim receives 80 rows and 24 columns.</p>

<p><strong>Fix.</strong> The project's own API is uniformly <code>(rows, cols)</code>: <code>sshcore.ShellOptions</code>, <code>Shell.Resize</code>, <code>shell.StartShellRequest</code> and the frontend <code>resizeShell</code> all follow it, with comments explaining the RFC versus x/crypto difference. A test pins it: <code>TestStartShellPTYParamOrder</code> has the test sshd parse <code>pty-req</code> exactly per RFC and asserts <code>rows=30, cols=100</code>.</p>

<pre><code>if err := sess.RequestPty(term, rows, cols, opts.Modes); err != nil {
    sess.Close()
    return nil, fmt.Errorf("sshcore: request PTY (%dx%d) failed: %w", cols, rows, err)
}
</code></pre>

<p>Note that the error text still says "(cols x rows)" for humans while the real argument order is <code>rows, cols</code>; both perspectives must coexist or readers get confused.</p>

<p>Defaults exist too: <code>rows</code> or <code>cols</code> of zero or less fall back to 24×80 so a frontend that has not laid out yet cannot send zeros. <code>Resize</code> errors on invalid sizes and never writes 0×0 to the remote. The frontend's <code>fit()</code> can throw before layout; the wrapper swallows it and returns the current <code>term.rows</code> and <code>term.cols</code>, deferring to the next <code>ResizeObserver</code>.</p>

<p><strong>Cost.</strong> <code>fit()</code> returns <code>{ rows, cols }</code> and callers must pass <code>(rows, cols)</code>, which the code comments repeat. <code>window-change</code> is fire-and-forget with <code>wantReply=false</code>: returning only means bytes were written, not applied, so tests must poll the server. Dragging a window generates many resizes, debounced at 150 ms, at the cost of a slightly delayed remote size.</p>

<h2>Problem 5: known_hosts and the hard edges of TOFU</h2>

<p><strong>Symptom.</strong> First connection to an unknown host should show a fingerprint card; a changed key should block clearly, not offer an "ignore once" button people click reflexively. In practice the error types returned by <code>knownhosts</code> get lumped together, mixing "unknown host" with "fingerprint changed".</p>

<p><strong>Cause.</strong> In the <code>KeyError</code> returned by <code>knownhosts.New</code>, an empty <code>Want</code> means "no record for this host", while a non-empty one means "record exists but the presented key does not match". The former is TOFU; the latter may signal a man in the middle. There is also a distinct <code>RevokedError</code> for <code>@revoked</code> lines, which must block unconditionally. Mixing the three produces the classic "fingerprint changed, allow once" vulnerability.</p>

<p><strong>Fix.</strong> Handle <code>RevokedError</code> first and return an error; then check whether <code>KeyError.Want</code> is non-empty. Unknown hosts offer three choices: once, trust and save, cancel. A changed key accepts only an explicit replacement; <code>HostKeyAcceptOnce</code> and refusal both yield <code>ErrHostKeyRejected</code>. Replacement matches the old entry by address and writes a new public-key line atomically (temp file, fsync, rename) at mode 0600. <code>knownhosts.New</code> requires the file to exist, so first connections call <code>ensureFile</code> to create the parent directory and an empty file, otherwise the fingerprint prompt never appears and parsing fails first.</p>

<pre><code>if len(keyErr.Want) &gt; 0 {
    change := &amp;HostKeyChange{Info: info}
    for _, wk := range keyErr.Want {
        change.OldFingerprints = append(change.OldFingerprints,
            ssh.FingerprintSHA256(wk.Key))
    }
    decision, perr := prompt(info, change)
    if perr != nil {
        return perr
    }
    if decision != HostKeyAcceptAndSave {
        return fmt.Errorf("%w (fingerprint changed)", ErrHostKeyRejected)
    }
    return writeKnownHost(knownHostsPath, hostname, key, true)
}
</code></pre>

<p>Tests cover three behaviors: first prompt then save, no second prompt, and a server key rotation that must block while the callback still receives the old fingerprint; another test confirms "once" is not persisted and both connections prompt again.</p>

<p><strong>Cost.</strong> <code>known_hosts</code> supports hashed hostnames (<code>|1|...</code>) and the replacement logic cannot reverse a hash, so such lines are skipped and a new line appended. Old hashed entries remain and may keep reporting changes until the user cleans them by hand — a documented edge, with a comment saying hashed forms are treated as misses and preserved. On Windows, mode 0600 is only intent; real access control comes from ACLs inherited from <code>%APPDATA%</code>.</p>

<h2>Problem 6: the Windows ssh-agent named pipe</h2>

<p><strong>Symptom.</strong> Windows OpenSSH is installed and <code>ssh-add</code> lists keys, but agent auth in NanoSSH always fails; with Git Bash installed, <code>SSH_AUTH_SOCK</code> exists yet dialling it also fails.</p>

<p><strong>Cause.</strong> Windows has no Unix domain sockets; Windows OpenSSH's agent listens on the fixed named pipe <code>\\\\.\\pipe\\openssh-ssh-agent</code>. <code>SSH_AUTH_SOCK</code>, even when present, may be a Cygwin or MSYS private format that Go's <code>net.Dial("unix", ...)</code> cannot reach. Also, when the pipe exists but all instances are busy, <code>CreateFile</code> returns <code>ERROR_PIPE_BUSY</code>; reporting that directly tells users "agent unavailable".</p>

<p><strong>Fix.</strong> Hand-written <code>CreateFile</code> plus <code>WaitNamedPipe</code>-equivalent logic, no <code>winio</code>. Fixed pipe name, a 3-second deadline, retry every 50 ms on <code>ERROR_PIPE_BUSY</code>. On success wrap with <code>agent.NewClient</code> and call <code>List()</code> once before authenticating; an empty list says "run ssh-add first" rather than surfacing <code>no supported methods remain</code>. <code>authMethods</code> returns an <code>io.Closer</code>, closed on handshake failure and otherwise attached to the <code>Client</code> so a failed handshake cannot leak the pipe.</p>

<pre><code>deadline := time.Now().Add(agentDialTimeout)
for {
    h, err := windows.CreateFile(name, windows.GENERIC_READ|windows.GENERIC_WRITE,
        0, nil, windows.OPEN_EXISTING, 0, 0)
    if err == nil {
        return os.NewFile(uintptr(h), agentPipeName), nil
    }
    if err != windows.ERROR_PIPE_BUSY || time.Now().After(deadline) {
        return nil, fmt.Errorf("sshcore: cannot reach ssh-agent (%s): %w; "+
            "check that the Windows OpenSSH Authentication Agent service is running",
            agentPipeName, err)
    }
    time.Sleep(50 * time.Millisecond)
}
</code></pre>

<p>A Windows-only test asserts the path really enters the pipe namespace: with no agent, the error must be <code>ERROR_FILE_NOT_FOUND</code> or <code>ERROR_PIPE_BUSY</code>, never <code>ERROR_INVALID_NAME</code>. If Go or <code>x/sys</code> changes device-path handling, the test fails first.</p>

<p><strong>Cost.</strong> Only the Windows OpenSSH agent is supported — no PuTTY Pageant, and no third-party protocol dependency to support it. Three seconds is a hard cap: better a clear error than an endless spinner. Multiple SSH clients cause pipe contention and failures inside the retry window are normal; only past three seconds is it truly unavailable. That is shorter than the 15-second TCP connect timeout because the agent is local and should answer in milliseconds.</p>

<h2>Problem 7: the tray icon clicks do nothing</h2>

<p><strong>Symptom.</strong> After closing the window to the tray, the icon is visible but double-clicking does nothing and the context menu never opens. No errors in the log, process still alive.</p>

<p><strong>Cause.</strong> Win32 window messages are delivered per thread, so the message window and the <code>GetMessage</code> loop must live on the same OS thread. Go goroutines can migrate between OS threads around blocking calls; create the window on one thread and pump messages on another and messages never arrive. The symptom looks exactly like "the icon did not attach".</p>

<p><strong>Fix.</strong> The tray thread calls <code>runtime.LockOSThread()</code> on entry and unlocks on exit; both the message window creation and the <code>GetMessage</code> loop run on that locked thread. The window is an <code>HWND_MESSAGE</code> window that takes no screen space; callbacks, balloons and the context menu are delivered via custom messages. Creation is a synchronous handshake: <code>newTray</code> blocks until ready or 3 seconds, and on failure returns an error so the caller can shut down normally — never leaving "window hidden, icon not attached".</p>

<pre><code>func (t *tray) run(done chan&lt;- error) {
    runtime.LockOSThread()
    defer runtime.UnlockOSThread()
    // register class, create message window, Shell_NotifyIcon, then GetMessage loop
}
</code></pre>

<p>The tray is created lazily: no notification-area slot while the window is open, an icon only when actually minimizing. That also means a failed tray creation still lets the user exit instead of being trapped in a background process with no exit. The balloon shows once (a <code>trayTipShown</code> flag); the context menu uses <code>TPM_RETURNCMD</code> to read the selection directly instead of routing <code>WM_COMMAND</code>; quitting destroys the icon via a custom message and ends the loop.</p>

<p><strong>Cost.</strong> One OS thread is locked for the whole tray lifetime and must not block; callbacks only send messages and flip state, with heavy work pushed back to the business layer. The <code>wndProc</code> defends every branch against panics, menu commands travel over a channel, and the tray thread never touches the database or network. Only one tray icon is supported, so <code>wndProc</code> is bound via a package variable rather than <code>SetWindowLongPtr</code>. The handwritten Win32 code is about two hundred lines — less maintainable than a library, but zero new dependencies and a smaller binary.</p>

<h2>Problem 8: the 14 MB size ceiling</h2>

<p><strong>Symptom.</strong> As features accumulated the artefact grew past 13.23 MB, leaving under 0.8 MB before the 14 MB limit. At that point any casual "just add a library" decision can fail the build.</p>

<p><strong>Cause.</strong> The Wails runtime is not small, and the SSH implementation from <code>x/crypto</code>, the WebView2 loader and the frontend bundle all live inside. The dependency graph also carries a batch of Wails transitive dependencies — echo, gorilla/websocket, string and template helpers — not all reachable but all in the module graph. Add SQLite or a third-party tray library and size runs away.</p>

<p><strong>Fix.</strong> Turn size from a verbal agreement into a build assertion. <code>build.ps1</code> fixes <code>GOARCH=amd64</code> and <code>CGO_ENABLED=0</code>, builds with <code>-ldflags "-s -w"</code>, checks that the PE header machine field is <code>0x8664</code>, then rounds the size and <code>throw</code>s past the threshold.</p>

<pre><code>$sizeMB = [math]::Round((Get-Item $exe).Length / 1MB, 2)
if ($sizeMB -gt $MaxSizeMB) {
    throw "size exceeded: $sizeMB MB &gt; $MaxSizeMB MB. The goal is 'extremely light' — check dependency growth before raising the limit."
}
</code></pre>

<p>The specific choices: no SQLite (server data is dozens of rows; <code>modernc.org/sqlite</code> would add 4–6 MB for nothing) — JSON with atomic writes and a <code>.bak</code> instead, which is small and easy to repair by hand; no third-party tray, just <code>Shell_NotifyIconW</code>; seven frontend runtime dependencies and no UI framework; keys, known_hosts and servers.json in standard formats with no bespoke binary containers; the frontend embedded via <code>go:embed all:frontend/dist</code> with no external asset directory. <code>wails.json</code> drives the frontend build while <code>build.ps1</code> owns the Go side and the assertions. CI also runs <code>govulncheck</code>, because advisories in <code>x/crypto</code> need continuous discovery rather than after-the-fact checks.</p>

<p><strong>Cost.</strong> JSON storage rewrites the whole file on save — O(n), acceptable for dozens of servers, and no SQL for complex queries later. Handwritten Win32 and a hand-rolled DOM builder add maintenance. The size guard itself is brittle: a Go, Wails or frontend dependency bump can move the number, so thresholds need re-checking after upgrades. The assertion runs after the Wails build, so the failing artefact is kept for analysis but CI fails. One easily missed point: a 32-bit Go toolchain produces 386 by default, so the script must pin <code>amd64</code> or you get a working binary of the wrong architecture.</p>

<h2>Problem 9: high-DPI flicker and zero-sized terminals</h2>

<p><strong>Symptom.</strong> Dragging the window between a 100% and a 150% display makes WebView2 repaint repeatedly and flicker. Switching from the terminal tab to files and back leaves the xterm cursor misaligned to the old column count, sometimes collapsing the terminal to a thin line.</p>

<p><strong>Cause.</strong> Two problems overlap. First, WebView2 receives dense resize events on high DPI or multi-monitor switches; reflowing on every one flickers. Second, in-session view switching uses <code>display:none</code>, so the hidden <code>.term-host</code> measures zero and <code>ResizeObserver</code> reports 0×0; calling <code>fit()</code> then computes a tiny grid, and switching back leaves it wrong.</p>

<p><strong>Fix.</strong> The window layer sets <code>ResizeDebounceMS=120</code> so Wails debounces WebView2 repaints; the frontend debounces resize another 150 ms, skips observations below 4 pixels in either dimension, and re-<code>fit</code>s plus syncs size inside <code>requestAnimationFrame</code>. Returning to the terminal view also goes through <code>rAF</code> so layout finishes first. Switching from the keys page back to servers calls <code>refitAll()</code> so every visible terminal re-fits its container.</p>

<pre><code>const ro = new ResizeObserver(() =&gt; {
  for (const [id, handle] of terminals) {
    const host = hosts.get(id);
    if (!host || panes.get(id)?.hidden) continue;
    if (host.clientWidth &lt; 4 || host.clientHeight &lt; 4) continue;
    handle.fit();
    handle.syncSize();
  }
});
</code></pre>

<p>WebGL is downgraded at the same layer: <code>new WebglAddon()</code> sits in a <code>try</code>, initialization failure keeps xterm's DOM renderer, and context loss calls <code>dispose()</code> and falls back the same way. Nothing breaks; long output just costs more CPU. The window also declares PerMonitorV2 DPI awareness in the manifest, otherwise WebView2 gets bitmap-stretched across displays and text blurs. Light/dark follows the system, and Mica only enables on build 22621+, with older systems staying opaque so a transparent window never lacks a background.</p>

<p><strong>Cost.</strong> The two debounces stack (120 ms then 150 ms), so the remote PTY receives the final size a moment after dragging ends — perceptible but not painful. Skipping sub-4-pixel sizes avoids 0×0 but also means tiny layout changes do not recompute. The WebGL downgrade is silent; users just notice scrolling got slower, a trade made to keep the main flow undisturbed.</p>

<h2>Problem 10: SFTP and forwarding share a connection, not a lifetime</h2>

<p><strong>Symptom.</strong> Initially every file panel opened a new SSH connection and each forwarding rule dialled its own, so opening files added a handshake and another login record on the server. Worse, closing a session tab left the local listening port occupied because forwards were not released with the session.</p>

<p><strong>Cause.</strong> SFTP and port forwarding are just extra channels on the same SSH connection: an <code>sftp</code> subsystem channel and a <code>direct-tcpip</code> channel per forwarded connection. Neither needs a new dial, handshake or auth. What needs designing is lifetime: channels belong to the session and must be torn down with it, along with listeners and rules.</p>

<p><strong>Fix.</strong> SFTP is created lazily and cached: the first <code>SftpOpen</code> starts the subsystem on the existing <code>ssh.Client</code> and later calls reuse the same <code>sftp.Client</code>; a test asserts two opens produce one SSH connection and one SFTP channel. Forwarding keeps a rule table per session: validate port and host, listen on <code>127.0.0.1</code>, open a <code>direct-tcpip</code> channel per incoming local connection via <code>ssh.Dial</code>, shuttle both directions through 32 KiB buffers, and count active, total and per-direction bytes. On session close, <code>dropForwards</code> closes listeners, cuts live connections and pushes a <code>removed</code> state.</p>

<pre><code>func (f *Forward) handle(local net.Conn) {
    remote, err := f.ssh.Dial("tcp", f.remoteAddr)
    if err != nil {
        local.Close()
        return
    }
    // register the pair and splice both directions; either side closing ends both
}
</code></pre>

<p>Smaller patches matter too. Rename prefers <code>PosixRename</code> and falls back to standard <code>Rename</code>; symlinks only trigger a <code>Stat</code> when the entry is a link and not a directory, avoiding a round trip per entry in big directories; delete only removes empty directories, never recursively, because a wrong path in recursion is irreversible. Forwarding binds <code>127.0.0.1</code> only — exposing a service to the LAN must be an explicit decision — and a port conflict errors instead of leaving half a rule. Transfer progress is rate-limited to 120 ms so every 32 KiB does not flood the webview; cancellation travels through <code>context</code>, <code>shuttle</code> checks <code>ctx.Err()</code> before each block, and the terminal state is <code>canceled</code> rather than <code>done</code>. Forwarding stats share the same interval and only push on change, so idle rules emit nothing.</p>

<p><strong>Cost.</strong> All channels share one TCP connection, so terminal, SFTP and forwarding contend for the same bandwidth and connection-level resources; a single large transfer can slow terminal echo. Remote forwarding (<code>-R</code>) and dynamic forwarding (<code>-D</code>) are not implemented — only local <code>-L</code>. Downloads open the remote file once to get its size and reopen for the transfer, costing a round trip to avoid holding two handles. Recursive upload and recursive delete are explicitly unsupported.</p>

<h2>Problem 11: passwords, stale passwords and credential self-healing</h2>

<p><strong>Symptom.</strong> After changing the remote password, every connection attempt fails and there is no way to enter a new one; conversely a mistyped password in the dialog gets saved, and later attempts keep failing.</p>

<p><strong>Cause.</strong> If "the user typed a password" and "save the password" are the same call, a failed auth still persists; if a stale saved password is never removed, the frontend sees <code>HasPassword</code> true, never prompts, and the user is stuck. Deleting a server while leaving its credential behind also orphans a password pointing at a host that no longer exists.</p>

<p><strong>Fix.</strong> Save only after successful authentication; if auth fails and the user supplied no password this time, delete the saved one so the next attempt prompts. Deleting a server deletes the <code>NanoSSH/server/&lt;id&gt;</code> credential. <code>HasPassword</code> answers only "is there one", never returns the secret, and drives whether the frontend connects directly or prompts; <code>ForgetPassword</code> is idempotent. The frontend asks <code>HasPassword</code> first when auth is password-based and no password was supplied, so normal use is not prompted every time. Key passphrases work the same way: on failure with a stored passphrase, delete it and re-prompt with a <code>retry</code> flag, at most three times.</p>

<pre><code>if srv.Auth == sshcore.AuthPassword &amp;&amp; req.Password != "" {
    if serr := a.secrets.Set(store.PasswordTarget(srv.ID), req.Password); serr != nil {
        wruntime.LogWarning(a.ctx, "failed to save server password: "+serr.Error())
    }
}
</code></pre>

<p>Credentials live in Windows Credential Manager as generic credentials with <code>PersistLocalMachine</code>, target <code>NanoSSH/server/&lt;id&gt;</code> or <code>NanoSSH/key/&lt;id&gt;</code>. No bespoke encrypted file, because that is the classic "roll your own crypto" trap; the credential manager uses DPAPI bound to the current user and does not travel with the data directory.</p>

<p><strong>Cost.</strong> Self-healing depends on <code>strings.Contains(err.Error(), "unable to authenticate")</code>, a string match against <code>x/crypto</code>'s message; change the wording and healing stops. Detecting a typed auth error would be sturdier, but the simpler path was chosen. Credentials bound to the Windows account cannot be decrypted on another machine — correct behavior — so copying <code>servers.json</code> and <code>keys</code> means re-entering passwords. Passwords are still plaintext in process memory; there is no master password or memory encryption, which is the usual desktop SSH boundary. Other programs running as the same user can enumerate the targets: that is the Windows credential model, not something NanoSSH can fix alone. It guarantees only that secrets are not in a plaintext JSON file and do not travel with the data directory.</p>

<h2>Problem 12: three edges of key management</h2>

<p><strong>Symptom.</strong> Importing a FIDO security key reports "failed to parse private key", looking like corruption; generating RSA defaults to 2048, which the baseline rejects; deleting a key still referenced by a server can quietly change that server's auth and break the next connection.</p>

<p><strong>Cause.</strong> A FIDO key's private handle never leaves the hardware, Go's <code>ssh</code> library does not support it, and users must be told "the algorithm is unsupported", not "the file is broken". RSA 2048 is no longer enough and 4096 takes seconds to generate. Deleting a referenced key creates a dangling reference, and silently rewriting server config is harder to diagnose than an error.</p>

<p><strong>Fix.</strong> Only ed25519, RSA 3072 and ECDSA P256, generated in native OpenSSH format, with public lines that paste straight into <code>authorized_keys</code> and fingerprints matching <code>ssh-keygen -lf</code>. FIDO detection must inspect the decoded PEM payload, because OpenSSH private keys store the algorithm name as a plain string inside the binary body; searching the PEM text for <code>sk-</code> finds nothing.</p>

<pre><code>if block, _ := pem.Decode(pemBytes); block != nil {
    if bytes.Contains(block.Bytes, []byte("sk-ssh-ed25519")) ||
        bytes.Contains(block.Bytes, []byte("sk-ecdsa-sha2")) {
        return nil, ErrKeyFIDOUnsupported
    }
}
</code></pre>

<p>Key files are named by ULID rather than the user's name: no collisions, no path traversal, and renaming is free. Import parses before writing, so success proves the key is usable and yields the exact public key and fingerprint; failure leaves no half-record with an empty fingerprint. Three failure paths are distinguished deliberately: passphrase needed returns <code>ErrKeyEncrypted</code>, hardware keys return <code>ErrKeyFIDOUnsupported</code>, anything else means the file itself is bad. Without a name, import uses the source filename minus extension; a passphrase-protected import stores the passphrase so the first connection does not ask again. Deleting scans the server list and refuses while referenced, naming the servers. The order is record first, file second, so no "record exists, file gone" dangling state.</p>

<p><strong>Cost.</strong> No FIDO keys and no agent forwarding — both stated in the error text rather than failing silently. RSA 3072 generation is slower than 2048 but far better than 4096, a middle ground. Mode 0600 on Windows is again only intent; protection comes from the <code>%APPDATA%</code> ACL. No rotation, no multi-key binding — the surface stays deliberately narrow.</p>

<h2>Closing</h2>

<p>The value of NanoSSH is not how many features it has but that it pins down a few boundaries that are easy to get wrong. IPC chose Wails' base64 event bridge, accepted the 33% inflation and offset it with Worker decoding and Transferable; terminal bytes stay <code>[]byte</code> end to end with no line splitting or decoding, using 16 KiB chunks, 8 ms batching and an ack loop to keep latency at the renderer; PTY parameters are uniformly <code>(rows, cols)</code> with a test preventing the RFC/x-crypto swap from returning; host keys distinguish unknown, changed and revoked, with changed keys allowing only explicit replacement; the Windows details land in named pipes, <code>LockOSThread</code>, resize debouncing and a 14 MB size guard.</p>

<p>Each decision has a cost: throughput is bound to rendering, hashed known_hosts entries cannot be replaced automatically, JSON cannot be queried, handwritten Win32 costs maintenance, and stale-password healing depends on error text. They are written into comments, tests and error messages rather than hidden.</p>

<p>Testing is part of the architecture: an in-process <code>testsshd</code> provides a real SSH server, an <code>eventCollector</code> replaces the event outlet and acks immediately on receipt, and the credential backend is swapped for an in-memory implementation so tests never write to the real credential manager. Conclusions like "terminal bytes are never lost", "PTY order is correct", "forwarding reuses one connection" and "closing a session releases the port" are repeatable without a window. What transfers to similar tools is not a function but the order of operations: write the boundaries down first, then pick the implementation.</p>

<h2>Further reading</h2>
<ul>
<li><a href="/en/article/nanobrowser-tauri-webview2/">NanoBrowser: Tauri and WebView2 in practice</a> — another lightweight webview shell; compare the window and IPC trade-offs.</li>
<li><a href="/article/websocket-production-deep-dive/">WebSocket in production</a> — on why "looks like WebSocket" and "what channel it actually uses" must both be stated.</li>
<li><a href="/en/article/nanohermes-rust-coding-agent/">NanoHermes: a coding agent in Rust</a> — another way to separate a protocol core from its shell.</li>
<li><a href="/article/file-upload-production-deep-dive/">File upload in production</a> — progress, cancellation and chunking strategies that mirror SFTP transfers.</li>
</ul>
`,
  },
  {
    slug: 'nanohermes-rust-coding-agent',
    zhSlug: 'nanohermes-rust-coding-agent',
    topicSlug: 'projects',
    title: 'NanoHermes: a coding agent in Rust with no async runtime and three dependencies',
    excerpt:
      'A coding agent with no async runtime, three crates, no libc and a hard cap on every output — plus a Tauri shell and a daemon for a 1 GB VPS.',
    date: '2026-10-22',
    readingTime: 38,
    html: `
<p>Coding agents are not scarce in 2026. Claude Code, Codex, Trae and Cursor each own a niche, and open-source clones appear every week. What they share is weight: a Node or Python runtime, hundreds of transitive dependencies, a tokio or asyncio event loop, installers hundreds of megabytes wide, and idle processes that sit on hundreds of megabytes of memory.</p>

<p>NanoHermes asks a much smaller engineering question.</p>

<p><strong>If all I need is a terminal agent that can read files, edit code, run commands and speak MCP, how small can it be?</strong></p>

<p>The answer is a set of trade-offs. One binary, with a design target around 2 MB. Resident memory that depends on context length and nothing else. Three dependency crates. No async runtime. Not even <code>libc</code>. And it still runs as a resident HTTP service on a 1 GB Debian VPS.</p>

<p>This post does not sell concepts. It takes the implementation apart. The technical density is in five places: how an agent loop is organized without async, which primitive concurrency uses, how Landlock and signal handling work without <code>libc</code>, how long-term memory does Chinese retrieval with no embedding service, and how every layer of context gets a ceiling. Each of those has details you cannot guess from outside.</p>

<h2>What it is in one minute</h2>

<p><strong>An OpenAI-compatible terminal coding agent in Rust, a Tauri desktop shell, and a deployable HTTP daemon.</strong> One codebase, three distribution shapes.</p>

<table>
<thead><tr><th>Shape</th><th>Artefact</th><th>Use</th></tr></thead>
<tbody>
<tr><td>CLI and REPL</td><td><code>agent</code> (release binary at <code>target/release/agent</code>)</td><td>One-shot tasks, interactive REPL, stdin pipe, <code>--json</code> and <code>--stream-json</code></td></tr>
<tr><td>Desktop</td><td><code>NanoHermes</code> (Tauri v2, <code>gui/</code> and <code>ui/</code>)</td><td>Four-column GUI, each task with its own session, permissions, model and persona</td></tr>
<tr><td>HTTP service</td><td><code>agent --daemon</code></td><td>Resident service on a VPS, consumed from the desktop as cloud tasks</td></tr>
</tbody>
</table>

<p>Capabilities, ordered by how quickly you notice them.</p>

<ul>
<li><strong>Real tools.</strong> Read, write and edit files, apply patches, list directories, grep, glob, run shell commands, fetch and search the web, maintain todos, drive git, and manage background tasks.</li>
<li><strong>Planning and memory.</strong> <code>todo_write</code> and <code>todo_read</code> let the model keep a plan across turns. Long-term memory distils lessons, preferences, corrections and facts into local files, and re-injects them by relevance.</li>
<li><strong>Extensibility.</strong> MCP servers over stdio and streamable HTTP, skills at <code>.nanohermes/skills/&lt;name&gt;/SKILL.md</code>, subagent delegation, and lifecycle hooks that can veto a tool call.</li>
<li><strong>Safety.</strong> Three approval tiers and, on Linux, a Landlock filesystem sandbox.</li>
<li><strong>A desktop shell.</strong> Four columns, a virtualized transcript, incremental Markdown, a docked results panel, a command palette and three themes.</li>
</ul>

<p>One fact is easy to miss. The desktop front end is React 19 with TypeScript and Vite, and the Rust side is a single 72 KB <code>gui/src/main.rs</code>. No plugins, no glue framework, no state machine generator. Tauri commands are ordinary functions with an attribute macro.</p>

<h2>Three disciplines</h2>

<p><strong>One: no async runtime.</strong> HTTP uses the blocking <code>ureq</code> client. Concurrent tool calls use <code>std::thread::scope</code>. Each MCP server gets a dedicated reader thread. No tokio means no per-task state machines, no thread pools and no runtime memory overhead.</p>

<p><strong>Two: dependency minimalism, close to fanaticism.</strong> The <code>agent</code> crate depends on <code>serde_json</code>, <code>ureq</code> with TLS, and <code>base64</code>. Not serde's derive macro, so every value is a <code>serde_json::Value</code>. Not even <code>libc</code>, so Landlock and SIGINT handling detour through a hand-written syscall module.</p>

<p><strong>Three: every output has a ceiling.</strong> Tool results clamp to 20 KB. Command output caps at 256 KB per stream. A file read over 4 MB is refused outright. Web response bodies clip at 2 MB. Grep returns at most 200 matches, glob at most 500 files. Project guidance and skill bodies are limited to 20 KB each. Context and process memory are both held down by those numbers.</p>

<p>Together they define the character of the project. Push complexity into the layer that must be written and is worth writing, and cut everything else.</p>

<h2>Stack, dependencies and release profile</h2>

<p>The workspace <code>Cargo.toml</code> is the single source of truth. Both crates inherit version, edition and license from it.</p>

<pre><code>[workspace]
resolver = "2"
members = ["agent", "gui"]

[workspace.package]
version = "0.1.0"
edition = "2021"
license = "MIT"

[profile.release]
opt-level = "z"    # optimize for size
lto = true         # link-time optimization across crates
codegen-units = 1  # slower compile, more aggressive optimization
panic = "abort"    # no unwind tables
strip = true       # strip symbols
</code></pre>

<p>The agent dependency table is short enough to paste whole, and the comment above it states the design goal rather than describing the code.</p>

<pre><code># Minimal dependency footprint is a design goal:
#  - no async runtime (no tokio) =&gt; no per-task state machines / thread pools
#  - one blocking HTTP client (ureq) instead of reqwest/hyper
#  - serde_json only (no serde derive proc-macro)
[dependencies]
serde_json = "1"
ureq = { version = "2", features = ["json", "tls"] }
base64 = "0.22"
</code></pre>

<p>The GUI side is equally restrained, and it reuses the same blocking HTTP client. The comment explains why: the TLS feature keeps Caddy-fronted HTTPS daemons reachable.</p>

<pre><code>[dependencies]
agent = { path = "../agent" }
tauri = { version = "2", features = [] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
ureq = { version = "2", features = ["json", "tls"] }
</code></pre>

<p>The frontend keeps five runtime dependencies: the Tauri API, highlight.js, marked, react and react-dom. Tooling is Vite 6, Vitest 5, TypeScript 5.7 and jsdom 30.</p>

<p>The Tauri window configuration is plain, with two settings worth noting. <code>withGlobalTauri</code> is on, so the frontend uses the global API directly with no injection package. And decorations are off, because the title bar is drawn by the frontend.</p>

<h2>Repository layout</h2>

<table>
<thead><tr><th>Path</th><th>What lives there</th></tr></thead>
<tbody>
<tr><td><code>agent/</code></td><td>The agent itself: CLI, loop, tool set, MCP client, daemon mode</td></tr>
<tr><td><code>gui/</code></td><td>The desktop shell: Tauri config, <code>src/main.rs</code>, icons, capabilities</td></tr>
<tr><td><code>ui/</code></td><td>The desktop frontend: Vite, React 19, TypeScript</td></tr>
<tr><td><code>scripts/</code></td><td><code>deploy-debian.sh</code>, which installs the daemon on Debian or Ubuntu in one command</td></tr>
<tr><td><code>target/</code></td><td>Build output shared by the workspace</td></tr>
</tbody>
</table>

<p><code>agent/src</code> is about 9,200 lines of Rust, split finely. The three largest files are <code>agent.rs</code> at 52 KB for the loop, <code>main.rs</code> at 58 KB for the CLI and REPL, and <code>mcp.rs</code> at 38 KB for the MCP client. In other words, the core loop, a terminal UI and one protocol client take more than half the code, and everything else is tools.</p>

<p><code>ui/src</code> is about 8,800 lines of TypeScript. The largest files are <code>lib/store.ts</code> at 45 KB, which holds global state and the IPC glue, <code>components/SettingsPage.tsx</code> at 33 KB, <code>styles/shell.css</code> at 65 KB, and <code>App.e2e.test.tsx</code> at 26 KB.</p>

<h2>Core 1: the agent loop, without async</h2>

<p><code>Agent::run</code> in <code>agent/src/agent.rs</code> is a bit over a hundred lines and takes one user turn from start to finish.</p>

<pre><code>pub fn run(&amp;mut self, content: Value) -&gt; Result&lt;String, String&gt; {
    // A Ctrl-C during this turn sets a flag instead of killing the process.
    let _guard = InterruptGuard::new();
    // Cross-session memory: retrieve for this instruction, replace the injected block.
    let user_text = memory::content_text(&amp;content);
    if let Some(dir) = self.ctx.memory_dir.clone() {
        let block = memory::retrieve_block(&amp;dir, &amp;user_text);
        self.set_memory_block(&amp;block);
    }
    self.messages.push(json!({ "role": "user", "content": content }));

    for _ in 0..self.cfg.max_iterations {
        // Abort only at a step boundary so the history never keeps an
        // assistant tool-call without its matching tool result.
        if crate::interrupt::take() { interrupted = true; break; }
        let turn = self.complete()?;
        // ... accumulate token usage, push the assistant message
        if turn.tool_calls.is_empty() { completed = true; break; }
        // ... run tools concurrently, backfill tool messages in call order
        self.compact();
    }
    // Only fully completed turns distill memories
    if completed &amp;&amp; self.cfg.memory { self.distill_memories(&amp;user_text, had_tools); }
    self.persist();
    Ok(final_text)
}
</code></pre>

<p>Four things in that shape deserve their own paragraph.</p>

<p><strong>Interruption happens at step boundaries, not anywhere.</strong> The single break point is at the top of the loop. The comment explains why: interrupting after a tool call was issued but before its result was written leaves an assistant tool call with no matching result, and the API rejects the next request. The cost is at most one step of extra latency.</p>

<p><strong>Long-term memory is re-retrieved and replaced each turn.</strong> <code>set_memory_block</code> overwrites the old block by its markers instead of appending. A hundred turns still inject exactly one block. This is the classic failure of injected memory, where the prompt quietly grows until it dominates everything else.</p>

<p><strong>Token usage reports the delta, not the running total.</strong> A daemon serving many sessions would make a cumulative total useless to the client. Deltas let the client compute a per-task total, and locally they sum to the same number anyway.</p>

<p><strong>Distillation has a hard gate.</strong> It runs only when the turn completed normally, not when it was interrupted and not when it hit the iteration cap. A half conversation never becomes a lesson. A failed distillation degrades silently and does not affect the answer.</p>

<p>One model round trip is wrapped in <code>complete</code>, which lands in <code>llm::chat</code>. It builds the request body, attaches tools and tool choice when needed, sets <code>reasoning_effort: "high"</code> when thinking is enabled, adds <code>stream_options.include_usage</code> so token counts arrive inside the stream, and then enters the retry loop.</p>

<pre><code>fn backoff_ms(base_ms: u64, attempt: u32) -&gt; u64 {
    base_ms
        .saturating_mul(2u64.saturating_pow(attempt.saturating_sub(1)))
        .min(30_000)
}
</code></pre>

<p>Backoff doubles from the base and caps at 30 seconds. Retryability is decided only by HTTP status: 429, 500, 502, 503 and 504. When the attempts are exhausted and a fallback model is configured, it gets one final call. Defaults are two retries with a 500 ms base.</p>

<h2>Core 2: concurrency through scoped threads</h2>

<p>When a turn returns several tool calls, NanoHermes runs them concurrently. With no tokio, the primitive is <code>std::thread::scope</code>.</p>

<pre><code>let results: Vec&lt;String&gt; = if turn.tool_calls.len() == 1 {
    vec![self.execute(&amp;turn.tool_calls[0])]
} else {
    // Reborrow as \`&amp;Agent\` so the scoped threads can share it
    // (\`execute\` takes \`&amp;self\`, and \`Agent\` is \`Sync\`).
    let this: &amp;Agent = self;
    std::thread::scope(|s| {
        let handles: Vec&lt;_&gt; = turn.tool_calls.iter()
            .map(|call| s.spawn(move || this.execute(call)))
            .collect();
        handles.into_iter()
            .map(|h| h.join().unwrap_or_else(|_| "ERROR: tool thread panicked".to_string()))
            .collect()
    })
};
</code></pre>

<p>Four details matter here.</p>

<ul>
<li><strong>A single call takes the direct path.</strong> Threads are spawned only when there is more than one call, and most turns call one tool.</li>
<li><strong>Results are collected in call order.</strong> <code>join</code> runs in the same order as <code>tool_calls</code>, so the completion order cannot mismatch a result with its <code>tool_call_id</code>.</li>
<li><strong><code>Agent</code> must be <code>Sync</code>.</strong> That is the precondition for the whole scheme. On the MCP side, each server's child process and reader handle sit inside a <code>Mutex&lt;Server&gt;</code>, which makes the manager and therefore the agent <code>Sync</code>.</li>
<li><strong>A panicking thread does not take down the turn.</strong> <code>join</code> returns an error, which becomes a string that looks like a tool error. The model sees a failed call and carries on.</li>
</ul>

<p>MCP concurrency has a finer grain. Calls to the same server serialize on its stdin lock, because the protocol is request and response over a single connection. Different servers run in parallel.</p>

<h2>Core 3: not even libc</h2>

<p>Both <code>sandbox.rs</code> and <code>interrupt.rs</code> need syscalls that the Rust standard library does not expose: the Landlock family, and <code>rt_sigaction</code>. The usual answer is the <code>libc</code> crate. Here it is <code>agent/src/sys.rs</code>.</p>

<pre><code>#[cfg(target_arch = "x86_64")]
pub mod nr {
    pub const CLOSE: usize = 3;
    pub const RT_SIGACTION: usize = 13;
    pub const OPENAT: usize = 257;
    pub const PRCTL: usize = 157;
}
</code></pre>

<p>Each architecture gets its own table, because the numbers differ: <code>openat</code> is 257 on x86_64 and 56 on aarch64, <code>prctl</code> is 157 and 167. On top of that sits a <code>syscall()</code> taking up to six arguments, issuing the <code>syscall</code> instruction on x86_64 and <code>svc 0</code> on aarch64, with different register assignments on each.</p>

<p>The whole module is under 75 lines and is gated on Linux plus one of those two architectures, so it disappears entirely on other targets.</p>

<p><strong>This is the most expensive consequence of the minimalism discipline: portability and some audit surface traded for thirty lines of assembly.</strong> It is also defensible, because both features only mean anything on Linux.</p>

<h2>Core 4: nineteen tools and the bounded-output rule</h2>

<p>There are nineteen built-in tools in four groups, and up to 28 once conditional ones appear. The four <code>mcp_*</code> tools exist only when an MCP server is configured.</p>

<table>
<thead><tr><th>Group</th><th>Tools</th></tr></thead>
<tbody>
<tr><td>Files</td><td><code>read_file</code>, <code>write_file</code>, <code>edit_file</code>, <code>apply_patch</code>, <code>list_dir</code></td></tr>
<tr><td>Search</td><td><code>grep</code>, <code>glob</code></td></tr>
<tr><td>Execution</td><td><code>run_command</code>, <code>task_output</code>, <code>task_list</code>, <code>task_kill</code></td></tr>
<tr><td>Network</td><td><code>web_fetch</code>, <code>web_search</code></td></tr>
<tr><td>Git</td><td><code>git_status</code>, <code>git_diff</code>, <code>git_log</code>, <code>git_commit</code></td></tr>
<tr><td>Planning</td><td><code>todo_write</code>, <code>todo_read</code></td></tr>
<tr><td>Conditional</td><td><code>skill</code>, <code>subagent</code>, <code>agent_list</code>, <code>memory_save</code>, <code>memory_search</code>, <code>mcp_list_resources</code>, <code>mcp_read_resource</code>, <code>mcp_list_prompts</code>, <code>mcp_get_prompt</code></td></tr>
</tbody>
</table>

<p>Dispatch is a plain match. Every error becomes a string handed back to the model as a tool result, so nothing panics and nothing breaks the loop. The last line of dispatch is the one that matters.</p>

<pre><code>r.map(|s| clamp(s, ctx.max_output))
</code></pre>

<p><strong>Every tool result is clamped to <code>max_output</code>, which is 20 KB.</strong> That line is where the bounded-output discipline is enforced: whichever tool runs, whatever arguments the model passes, no single tool result ever exceeds 20 KB of context.</p>

<p>Each tool also has a second ceiling, and the numbers are chosen rather than arbitrary.</p>

<table>
<thead><tr><th>Location</th><th>Limit</th><th>Reason</th></tr></thead>
<tbody>
<tr><td>Tool results</td><td>20 KB</td><td>Hold the context down</td></tr>
<tr><td>Command stdout and stderr</td><td>256 KB each</td><td>Survive an exploding build log</td></tr>
<tr><td><code>read_file</code></td><td>Hard refusal above 4 MB</td><td>Force the model to use offset and limit</td></tr>
<tr><td><code>web_fetch</code> response body</td><td>2 MB</td><td>Pages are untrusted; clip before parsing</td></tr>
<tr><td><code>grep</code></td><td>200 matches</td><td>One screen is enough</td></tr>
<tr><td><code>glob</code></td><td>500 files</td><td>Same</td></tr>
<tr><td><code>todo_write</code></td><td>50 items</td><td>A plan need not be infinite</td></tr>
<tr><td>Project guidance and skill bodies</td><td>20 KB each</td><td>Prompts need budgets too</td></tr>
</tbody>
</table>

<p>One detail is security relevant. Command output is read with a capped reader that clips while reading, not after. Otherwise a stray <code>yes</code> or a runaway build script eats memory before anything gets trimmed.</p>

<p><code>apply_patch</code> has a trade-off worth stating. Patches match on content, not on line numbers, so a small drift in the source still applies.</p>

<h2>Core 5: compaction</h2>

<p>Context management lives in <code>compact_with</code>, and two constants set the policy.</p>

<pre><code>const CONTEXT_CHAR_BUDGET: usize = 120_000;
const KEEP_RECENT: usize = 10;
</code></pre>

<p>Past 120,000 characters, or past one message more than the keep count, compaction starts. It walks back ten messages, finds a safe starting point, drains the older span for a summary, and inserts that summary as a system message at index one.</p>

<p>Three details prevent the usual accidents.</p>

<ul>
<li><strong>It never cuts inside a tool-call chain.</strong> If the starting point lands on a <code>role == "tool"</code> message, it moves forward until it does not. Otherwise the summary would drop an assistant tool call while the tool result stayed behind.</li>
<li><strong>A failed summary still loses nothing.</strong> The span is replaced by a single line saying earlier conversation was omitted, rather than an error or silent loss.</li>
<li><strong>It can be triggered by hand.</strong> <code>/compact</code> forces one compaction regardless of size.</li>
</ul>

<p>Keeping ten recent messages is empirical. Ten cover the file being edited plus the last tool result, and older context decays quickly in value.</p>

<h2>Core 6: memory without a vector database</h2>

<p>Memory lives in <code>agent/src/memory.rs</code> and persists to <code>~/.nanohermes/memory.json</code>. The practical question it answers is this: <strong>how do you search Chinese with no embedding service at all?</strong> The answer is two stages. Tokenize, then score with BM25.</p>

<p>The tokenizer handles mixed Chinese and English text.</p>

<ul>
<li>Runs of ASCII letters and digits become words and are lowercased, and anything shorter than two characters is dropped, which removes noise like single letters.</li>
<li>Runs of CJK characters are split into bigrams, using a two-character sliding window, with isolated characters kept whole. A four-character phrase therefore becomes three overlapping pairs.</li>
<li>The CJK test covers Han characters, kana, hangul and the compatibility blocks, not just the unified ideographs.</li>
</ul>

<p>Scoring is standard BM25 with the usual parameters.</p>

<pre><code>let idf = (1.0 + (n - n_q + 0.5) / (n_q + 0.5)).ln();
score += idf * (f * (k1 + 1.0))
       / (f + k1 * (1.0 - b + b * len / avg_len.max(1.0)));
</code></pre>

<p>Two details go beyond the textbook. <strong>Category words participate in matching.</strong> Every memory has a kind, and that kind's labels are added to the document bag, so a question about what was corrected earlier hits correction entries directly. And <strong>zero-score entries are filtered before ranking</strong>, so an unrelated memory cannot crowd out a relevant one.</p>

<p>Because the number of entries is small, scoring is linear with no inverted index. One vector and one hash map are enough. Retrieval is recomputed every turn and injected by the same marker mechanism as the memory block.</p>

<p>Writing has two gates. <code>memory_save</code> skips text that already exists, and automatic distillation only runs on completed turns. Small talk and half conversations never pollute the store.</p>

<p>The system is closer to an index than to a brain. It does not summarize conversations, and it does not decay the weight of a memory that went unused. What it does guarantee is that every entry can be seen, edited and deleted in the UI, so a user can explain why the model mentioned something. For a personal assistant, that is worth more than recall.</p>

<h2>Core 7: the MCP client</h2>

<p>Both transports are implemented. Over stdio, frames follow the LSP shape: a content-length header, a blank line, then the JSON body, byte for byte.</p>

<pre><code>let frame = format!("Content-Length: {}\\r\\n\\r\\n", body.len());
</code></pre>

<p>Over streamable HTTP, requests are synchronous posts with an accept header covering both JSON and server-sent events. The session id the server returns is remembered and echoed on later requests. Responses may be plain JSON or an event stream, and both are parsed.</p>

<p>The handshake is the standard three steps: initialize with the protocol version, send the initialized notification, then list tools. Declared tools are converted into OpenAI function definitions and merged into the agent's table, and from that point they are dispatched by name. An MCP tool is indistinguishable from a built-in one, from the model's point of view.</p>

<p>Four auxiliary tools expose resources and prompts, and they only appear when a server is configured. Configuration is one JSON file where a command means stdio and a URL means HTTP, both inside the same servers object.</p>

<h2>Core 8: skills and progressive disclosure</h2>

<p>Skills are reusable instruction packs. One directory per skill, with a markdown file and optional frontmatter declaring a name and a description.</p>

<p>Discovery is workspace first: the workspace skills directory, then the user skills directory, with workspace entries overriding global ones of the same name. The implementation deduplicates by name while walking a sorted directory list.</p>

<p>The important property is that the body never enters context at startup.</p>

<pre><code>const MAX_BODY_CHARS: usize = 20_000;

/// A discovered skill. \`body\` is read lazily so startup only pays for parsing
/// the frontmatter.
</code></pre>

<p>Startup parses only the frontmatter. The system prompt lists each skill's name and description. When the model needs a body, it calls the skill tool and the body arrives, capped at 20 KB. That is progressive disclosure: <strong>the library can be large while the base prompt stays small.</strong></p>

<p>Missing frontmatter falls back to the directory name and the first line of the body.</p>

<h2>Core 9: the subagent board and the gate</h2>

<p>Subagents come from a JSON file passed on the command line. Each one can carry its own prompt, model and tool allowlist. Once configured, two tools appear: one to delegate and one to inspect the board.</p>

<p><strong>The board</strong> records every delegated task: an incrementing id, the name, the description, the status, the duration and a result preview. The preview is capped.</p>

<pre><code>const RESULT_PREVIEW: usize = 500;
</code></pre>

<p>The clipper respects UTF-8 boundaries, stepping back until the cut point is a character boundary, so a multi-byte character is never split into a panic. The full result still returns to the model as the tool result. The board keeps a summary only so the board reads cleanly.</p>

<p><strong>The gate</strong> is a textbook counting semaphore built from a mutex and a condition variable. Acquiring waits when the limit is reached, and the returned guard decrements and notifies on drop. The cap is four concurrent delegations.</p>

<p>Why it is needed: the loop spawns one thread per tool call, and a single turn can emit several delegations. Without the gate, one turn could fire a dozen concurrent model requests.</p>

<h2>Core 10: hooks that can veto a tool call</h2>

<p>Hooks are shell commands of two kinds, before tool use and after tool use, matched by a wildcard or a comma-separated list of tool names.</p>

<p>They run through the shell with the workspace root as the working directory, and the tool call arrives on stdin as JSON.</p>

<pre><code>let payload = json!({ "tool": tool, "event": event, "arguments": args }).to_string();
</code></pre>

<p>Two environment variables are exported as well, so a hook does not have to parse stdin just to branch on the event.</p>

<p>Two implementation details are worth copying.</p>

<ul>
<li><strong>Both pipes get their own draining thread.</strong> If only one is read, the other fills its 64 KB buffer and the hook deadlocks. Chatty hooks are the normal case, not the exception.</li>
<li><strong>Hooks must be fast or they fail.</strong> The timeout is 30 seconds, after which the process is killed and a distinct exit code returned. A hook is a quick check and a notification; a stuck hook must not stall the agent forever.</li>
</ul>

<p>The semantics are deliberately asymmetric. A non-zero exit from a pre-hook blocks the tool call and returns the hook's output to the model. A non-zero exit from a post-hook can only append a warning to a result that already happened. If you want to stop something, stop it before.</p>

<h2>Core 11: Landlock and three approval tiers</h2>

<p>Two independent switches govern this: whether to ask, and what is permitted.</p>

<p><strong>The approval policy</strong> decides when confirmation is required.</p>

<table>
<thead><tr><th>Policy</th><th>Behaviour</th></tr></thead>
<tbody>
<tr><td><code>never</code></td><td>Never ask, for any command. This is the default, and what the yes flag selects.</td></tr>
<tr><td><code>on-request</code></td><td>Ask only for commands that are not recognized as read-only.</td></tr>
<tr><td><code>untrusted</code></td><td>Ask for everything, read-only commands included.</td></tr>
</tbody>
</table>

<p>Read-only detection is stricter than it looks. The first gate is metacharacters.</p>

<pre><code>if cmd.chars().any(|c| matches!(c, '|' | '&amp;' | ';' | '&lt;' | '&gt;' | '\`' | '$' | '(' | ')' | '\\n')) {
    return false;
}
</code></pre>

<p>Any pipe, ampersand, semicolon, redirect, backtick, dollar sign, parenthesis or newline makes the command untrusted, whatever the program at the front of it is. In other words, a shell metacharacter means the thing is a program rather than a binary.</p>

<p>Past that gate comes allowlist matching. Leading environment assignments are skipped, path prefixes are stripped, and the remaining binary is checked against a list of read-only programs. Git gets its own check, because its global options consume the following token as a value, so those are skipped before the subcommand is judged.</p>

<p><strong>The sandbox mode</strong> uses Landlock to restrict what a spawned command can see.</p>

<table>
<thead><tr><th>Mode</th><th>Behaviour</th></tr></thead>
<tbody>
<tr><td><code>off</code></td><td>No restriction. Default.</td></tr>
<tr><td><code>read-only</code></td><td>Read and execute, no writes at all.</td></tr>
<tr><td><code>workspace-write</code></td><td>Read and execute, writes only inside the workspace.</td></tr>
</tbody>
</table>

<p>The most interesting part of the implementation is that <strong>it refuses to degrade</strong>. Landlock is installed between fork and exec, so the restriction covers every child the command spawns. If the kernel does not expose Landlock, or an outer sandbox blocks it, NanoHermes <strong>refuses to run the command</strong> rather than quietly running it unsandboxed. The comment makes the argument: a security mechanism that always falls back gracefully is not a mechanism.</p>

<p>All of this still goes through the hand-written syscall shim, with no external crate.</p>

<h2>Core 12: Ctrl-C that does not kill, and undo</h2>

<p>In interactive use, Ctrl-C is redefined. It does not kill the process. It flips a flag, and the current turn exits cleanly at the next step boundary with the conversation intact.</p>

<p>The implementation depends on a piece of timing.</p>

<pre><code>static INTERRUPTED: AtomicBool = AtomicBool::new(false);
/// Nesting depth of active turns; the handler is installed at 0 -&gt; 1 and
/// removed at 1 -&gt; 0.
static DEPTH: AtomicUsize = AtomicUsize::new(0);
</code></pre>

<p>Reference counting keeps nested turns sharing one handler, and the outermost exit restores the default action. <strong>Ctrl-C while idle still quits.</strong> Only while busy does it mean "stop this turn". One signal, two meanings, decided by when the handler is installed rather than by inspecting a flag.</p>

<p>One more engineering detail. On x86_64, the kernel refuses to deliver a caught signal unless the caller supplies a restorer that executes <code>rt_sigreturn</code>. That is the only hand-written assembly in the project beyond the syscall instruction itself: a few lines, hidden from the symbol table, that issue syscall 15.</p>

<pre><code>core::arch::global_asm!(
    ".globl nanohermes_sigrestorer",
    ".hidden nanohermes_sigrestorer",
    "nanohermes_sigrestorer:",
    "mov rax, 15",
    "syscall",
);
</code></pre>

<p>The desktop has no signal to send, so a request function flips the same flag directly. The GUI stop button and the terminal Ctrl-C take one path, and the loop never learns who asked.</p>

<p>Paired with it is <code>/undo [n]</code>, which deletes the last n complete user turns, including everything that followed each one, and persists the result. Interrupt preserves, undo erases, and both are needed, because "it went sideways and I want to correct it" and "it went sideways and I want to pretend it did not happen" are different intentions.</p>

<h2>The desktop shell</h2>

<p><code>gui/</code> wraps the same agent as a desktop application in four columns.</p>

<table>
<thead><tr><th>Column</th><th>Contents</th></tr></thead>
<tbody>
<tr><td>Title bar</td><td>Drawn by the frontend: brand, model and location pill, toggles for the task list and results panel, settings, window buttons</td></tr>
<tr><td>Task list, left, collapsible</td><td>Execution location and accumulated tokens per task, plus search, pin, rename, delete and export</td></tr>
<tr><td>Conversation, centre</td><td>A task bar with title, state, tokens, export and clear-context, then a streaming Markdown transcript</td></tr>
<tr><td>Results, right, collapsible</td><td>The workspace file tree, this task's artefacts split into all, changed and read, a read-only preview, and a word-level diff</td></tr>
</tbody>
</table>

<p>There are five permission modes, and their differences are larger than their names suggest.</p>

<table>
<thead><tr><th>Mode</th><th>Label</th><th>Behaviour</th></tr></thead>
<tbody>
<tr><td><code>default</code></td><td>Agent</td><td>All tools available, edits and commands without asking</td></tr>
<tr><td><code>accept-edits</code></td><td>Accept</td><td>File edits auto-approved, commands still gated</td></tr>
<tr><td><code>plan</code></td><td>Plan</td><td>Read-only: no writes, no commands</td></tr>
<tr><td><code>goal</code></td><td>Goal</td><td>Unattended: every tool runs until the task completes</td></tr>
<tr><td><code>debug</code></td><td>Debug</td><td>Read files and run commands to reproduce, never write</td></tr>
</tbody>
</table>

<p>Plan, goal and debug inject a mode instruction into the system prompt as well. The reason is in the source comment: the model should behave according to how it was launched, rather than discover that tools are missing and keep retrying them.</p>

<p>Desktop performance notes come from four hard-won conclusions.</p>

<ul>
<li><strong>No blocking Tauri commands.</strong> A synchronous command runs on the window's main thread, so any disk or network work freezes the whole UI for that turn. Everything touching the filesystem, processes or HTTP is async and handed to the blocking pool. Only two memory-only commands stay synchronous. Settings writes are also serialized behind a static mutex so two flushes cannot land out of order.</li>
<li><strong>Streaming text stays out of the global store.</strong> Deltas go through a dedicated subscription that only the bubble being written listens to, and each stage, such as a tool call or the end of a turn, commits once to the transcript. A long answer therefore does not re-render the sidebar, the results panel and the title bar. Events batch on dedicated channels at 40 ms intervals.</li>
<li><strong>The transcript is virtualized.</strong> Only messages in or near the viewport mount, height measurement is skipped while the last bubble is still growing, and follow-scroll is driven by the stream rather than by React.</li>
<li><strong>Markdown is incremental.</strong> During streaming the text is split into blocks on blank lines outside code fences. Stable blocks render once and stay, an unterminated fence only updates its own code text node, and syntax highlighting runs per block after the turn instead of over the whole answer.</li>
</ul>

<p>The IPC surface is sixteen commands plus two stream readers, all inside a 72 KB file.</p>

<h2>Daemon mode and VPS deployment</h2>

<p><code>agent --daemon</code> turns the agent into a resident HTTP service with two endpoints.</p>

<table>
<thead><tr><th>Endpoint</th><th>Method</th><th>Auth</th><th>Behaviour</th></tr></thead>
<tbody>
<tr><td><code>/</code></td><td>POST</td><td>Bearer when a token is configured</td><td>Takes a prompt, returns the response and a session id</td></tr>
<tr><td><code>/health</code></td><td>GET</td><td>None</td><td>Returns status and session count, for liveness probes</td></tr>
</tbody>
</table>

<p>Sessions are isolated by a request header. Supplying a session id selects that session, different ids never share context, and omitting it uses the default. Each session persists to its own JSON file.</p>

<p>The desktop connects cloud tasks this way, each with its own session id, so <strong>one daemon serves many desktop tasks without cross-talk</strong>. The cost is that cloud configuration is fixed at daemon startup, meaning model, persona, temperature and permission mode all come from flags, and that <strong>a cloud turn cannot be cancelled midway</strong> because the request is held by the daemon.</p>

<p>The deployment script does the whole job.</p>

<table>
<thead><tr><th>Step</th><th>What happens</th></tr></thead>
<tbody>
<tr><td>Install</td><td>Binary to <code>/opt/nanohermes/nanohermes</code>, workspace to <code>/opt/nanohermes/workspace</code>, session directory permission 700</td></tr>
<tr><td>Token</td><td>Generated with <code>openssl rand -hex 24</code> into <code>/opt/nanohermes/.daemon_token</code>, reused on re-runs</td></tr>
<tr><td>Service</td><td>A systemd unit running the daemon with the workspace, a session file and workspace-write sandboxing, with restart-always</td></tr>
<tr><td>Hardening</td><td>No new privileges, strict system protection, plus explicit writable paths</td></tr>
<tr><td>Start</td><td>Enable and start, then curl the health endpoint and print the token</td></tr>
</tbody>
</table>

<p>One trap is documented. Strict system protection blocks writes to the memory file, so long-term memory needs an explicit writable path in a drop-in. A 1 GB instance also needs swap added first, because compilation is the only memory-hungry step.</p>

<p>Exposure has three documented options: an SSH tunnel with no open port, a Caddy reverse proxy on 443 or 8443 while remembering that certificate validation still needs port 80, or a Cloudflare Tunnel. The warning is worth quoting unchanged: <strong>never expose the daemon port directly</strong>, because the only credential is the bearer token and the traffic is plaintext.</p>

<h2>Sessions and multimodal input</h2>

<p>A session file is a JSON array of OpenAI-style messages, written atomically: a temporary sibling file is written and then renamed over the target. A crash mid-write therefore cannot truncate history. Saves happen after each completed turn and after clearing; a failed read at startup falls back to a fresh conversation with a warning rather than refusing to start.</p>

<p>Multimodal input is available for vision models: a flag for one-shot use, a command in the REPL, and paste, drag or picker on the desktop. Limits are four images per turn, a long edge scaled to 1024 pixels, and rejection with a reason for undecodable or oversized files. Transfer is by data URL, so the model must support vision.</p>

<h2>Tests</h2>

<p>Rust tests are per-module unit tests plus a genuine end-to-end suite, all run by one workspace command. The end-to-end suite starts a local mock OpenAI server that depends only on the standard library and needs no network, and drives the real agent through tool round trips, streaming and non-streaming replies, a retry after one transient 5xx, and a hard API error. A mock MCP server written in Python covers the other transport.</p>

<p>The unit list says a lot about which parts are assumed to break: patch application including multi-hunk and missing context, glob matching, MCP resource and prompt listing, MCP tool dispatch, streamable HTTP handshake and calls, MCP concurrency under mixed load, concurrent tool execution including a mix of built-in and MCP tools, HTML to text and search result parsing, session task lists, git round trips, token usage parsing and backoff arithmetic, multimodal content assembly, session persistence round trips, project guidance injection including the off switch, skill discovery including frontmatter fallback and workspace override, hook execution covering exit codes and matching and stdin payloads, subagent board ordering and the concurrency gate, approval decisions and trusted command detection, the Landlock workspace boundary, signal flag set and clear, and long-term memory covering Chinese bigrams, BM25 ordering, deduplication and the distillation gate.</p>

<p>The frontend uses Vitest with jsdom. Pure logic tests cover theme resolution and persistence, store migrations, Markdown sanitization, image attachments, in-session search and diff blocks. Component tests cover the settings page, the command palette, the results panel and the shortcuts panel. One end-to-end test renders the real store and components against a mocked Tauri IPC bridge and verifies virtual scrolling over a long transcript, search across screens, jump-to-change in a diff, and the input state while a task is running or stopping.</p>

<p>One regression test exists solely to assert that long-running commands never execute synchronously on the main thread, because that is the performance contract most likely to be broken quietly by a later change.</p>

<h2>Known limits</h2>

<ul>
<li><strong>Sandboxing and SIGINT handling are Linux-only.</strong> Both rest on raw syscalls and disappear on Windows and macOS, so the Windows desktop runs without a sandbox and with default signal handling.</li>
<li><strong>Cloud turns cannot be cancelled.</strong> The request is held by the daemon and the desktop can only wait. Only local tasks stop at step boundaries.</li>
<li><strong>The daemon runs as root, and the token is the only credential.</strong> Anyone holding it can read, write and execute inside the workspace, which is exactly why the documentation insists on not exposing the port.</li>
<li><strong>No async has real costs.</strong> A stuck HTTP request occupies a thread until its timeout, 120 seconds by default. That is fine for a CLI and a desktop app, and wrong for a high-concurrency gateway.</li>
<li><strong>The Windows installer is unsigned</strong>, so the first run trips SmartScreen.</li>
</ul>

<h2>Verdict</h2>

<p>What is worth reading in NanoHermes is not the feature list but the discipline. Coding agents converge on similar feature sets. Holding four constraints all the way through is what produced these implementations: no async runtime, three crates, no <code>libc</code>, and a ceiling on every output.</p>

<p>Those constraints buy a single binary with a design target around 2 MB, memory that tracks context length rather than framework overhead, and one codebase that is simultaneously a CLI, a desktop application and a systemd service on a small VPS.</p>

<p>When everyone else is adding dependencies, taking them away is also an engineering skill.</p>

<h2>Where to look</h2>

<ul>
<li>The loop and compaction: <code>agent/src/agent.rs</code></li>
<li>Model calls and retries: <code>agent/src/llm.rs</code></li>
<li>Memory and BM25: <code>agent/src/memory.rs</code></li>
<li>MCP client: <code>agent/src/mcp.rs</code></li>
<li>Sandbox and approvals: <code>agent/src/sandbox.rs</code></li>
<li>Signal handling: <code>agent/src/interrupt.rs</code></li>
<li>Raw syscall shim: <code>agent/src/sys.rs</code></li>
<li>Subagent board: <code>agent/src/board.rs</code></li>
<li>Hooks: <code>agent/src/hooks.rs</code></li>
<li>Desktop IPC: <code>gui/src/main.rs</code></li>
</ul>

<p>Related: <a href="/en/article/nanobrowser-tauri-webview2/">NanoBrowser, hand-writing an in-process CDP</a> and <a href="/article/agent-loop-two-hundred-lines/">The essence of an agent: a two-hundred-line loop</a>.</p>
`,
  },
  {
    slug: 'nanodb',
    zhSlug: 'nanodb',
    topicSlug: 'database',
    title: 'NanoDB: an embedded document database in Go, with zero dependencies',
    excerpt:
      'JSON documents, snapshot + WAL persistence, secondary/text/geo indexes, optimistic transactions and a read-only SQL subset in 9,791 lines of dependency-free Go.',
    date: '2026-10-26',
    readingTime: 38,
    html: `
<p>SQLite has two million lines. LevelDB is a compact LSM textbook. MongoDB is a distributed system. Writing another database in 2026 looks like reinventing a wheel.</p>

<p>But the point of building a wheel is never the wheel. NanoDB answers a specific set of questions.</p>

<ul>
<li>What is the shortest path to a database that supports transactions?</li>
<li>After removing all the engineering jargon, how many lines does "committed data survives a crash" actually take?</li>
<li>How do a document model, secondary indexes and optimistic concurrency control fit together on a single in-memory data structure?</li>
</ul>

<p>The answer is about ten thousand lines of Go with zero third-party dependencies and one <code>go build</code>. More useful than the line count: every part of it can be read by one person in an hour, which is close to impossible in a real database. How long does SQLite's pager layer take to read? How long does RocksDB's compaction?</p>

<p>So read this two ways. <strong>As a usable tool, and as an anatomy specimen.</strong> The first tells you when to reach for it. The second tells you, if you write your own, what to build first, what to build later, and what has to be right the first time.</p>

<h2>What it is</h2>

<p>NanoDB is a lightweight <strong>embedded document database</strong> written in Go, currently version 0.1.0. Embedded means there is no daemon and no wire protocol. It is a library inside your process, with a CLI, an interactive shell and a REST service wrapped around it.</p>

<table>
<thead><tr><th>Dimension</th><th>Detail</th></tr></thead>
<tbody>
<tr><td>Language</td><td>Go 1.22+, single module <code>nanodb</code></td></tr>
<tr><td>Third-party dependencies</td><td>Zero. Standard library only, no cgo</td></tr>
<tr><td>Size</td><td>34 <code>.go</code> files, 9,791 lines: 6,592 source and 3,199 tests, measured</td></tr>
<tr><td>Data model</td><td>Collection to JSON document, with a non-empty string <code>_id</code></td></tr>
<tr><td>Persistence</td><td><code>snapshot.json</code> for the full state, <code>wal.log</code> in JSON Lines for changes</td></tr>
<tr><td>Concurrency</td><td>Safe across goroutines in one process; the data directory is locked at the OS level</td></tr>
<tr><td>Entry points</td><td>One-shot CLI, interactive shell, REST service</td></tr>
<tr><td>Tests</td><td>About 80% coverage on <code>engine</code> and <code>server</code>, about 75% on <code>cmd</code></td></tr>
<tr><td>Target</td><td>Small to medium data, tooling projects, desktop and edge deployments</td></tr>
</tbody>
</table>

<p>The trade-off in one sentence: <strong>do single-machine, memory-resident, JSON-native well, and give up distribution explicitly.</strong> No replicas, no sharding, no clustering, and one process per data directory at a time. Those are outside the boundary by design, and the README lists all of them under known limits.</p>

<p>One detail says a lot about the project. <code>go build -o bin/nanodb ./cmd/nanodb</code> needs no network, because nothing has to be downloaded. In an era of dependency trees measured in hundreds of megabytes, that belongs in the introduction.</p>

<h2>Five minutes to first query</h2>

<h3>The one-shot CLI</h3>

<pre><code>go build -o bin/nanodb ./cmd/nanodb

# insert, with a generated _id
./bin/nanodb -db ./data put users '{"name":"Alice","age":30}'

# filter, sort, paginate
./bin/nanodb -db ./data find users '{"age":{"$gte":18}}' -sort age:-1 -limit 10

# update, count, delete
./bin/nanodb -db ./data update users u2 '{"$inc":{"age":1}}'
./bin/nanodb -db ./data count users '{"age":{"$gt":20}}'
./bin/nanodb -db ./data delete users u2
</code></pre>

<p>Successful commands print indented JSON to stdout. Failures exit with status 1 and write the error to stderr behind an <code>Error:</code> prefix, so a script can branch on the exit code.</p>

<h3>The interactive shell</h3>

<p>Run without a subcommand and you get a shell. Inside a transaction the prompt becomes <code>nano(tx)&gt;</code>, and quitting or reaching EOF rolls back anything uncommitted.</p>

<pre><code>$ ./bin/nanodb -db ./data
NanoDB 0.1.0 interactive shell. Quote JSON arguments with single quotes.
nano&gt; begin
transaction started
nano(tx)&gt; put users '{"name":"Bob"}'
nano(tx)&gt; commit
transaction committed
</code></pre>

<h3>The REST service</h3>

<pre><code>./bin/nanodb -db ./data serve -addr :8080 -token secret
curl -H 'X-NanoDB-Token: secret' localhost:8080/v1/users
</code></pre>

<p>All three entry points share one engine rather than being three implementations. <code>cmd/nanodb/main.go</code> at 722 lines only dispatches arguments. <code>server/server.go</code> at 764 lines only routes and authenticates. The logic sits in <code>engine/</code>. That is the first architectural decision worth copying: <strong>thin entry points, one engine.</strong></p>

<h3>Go embedding, which is the real usage</h3>

<p>For an embedded database, the CLI and the REST service are attachments. The body is the library call.</p>

<pre><code>db, err := engine.Open("./data", &amp;engine.Options{
    Sync:             true,        // fsync every write
    CompactThreshold: 4 &lt;&lt; 20,     // compact when the WAL exceeds 4 MiB
})
if err != nil {
    panic(err)
}
defer db.Close()

doc, _ := db.Insert("users", map[string]any{"name": "Alice", "age": 30})
fmt.Println(doc["_id"])

docs, _ := db.Find("users", engine.Query{
    Filter: map[string]any{"age": map[string]any{"$gte": 18}},
    Sort:   []engine.SortField{{Field: "age", Desc: true}},
    Limit:  10,
})
fmt.Println(len(docs))
</code></pre>

<p>The API is a flat method table that mirrors the CLI subcommands: insert, insert many, get, find, count, replace, update, update many, delete, delete many, batch, aggregate, query SQL, create index, drop index, compact, stats and close.</p>

<p>Two notes on using it. Passing <code>nil</code> for options gives the default behaviour, which is sync enabled, while passing an empty <code>Options</code> literal actually means <strong>you chose</strong> sync disabled, because Go's zero values decide. The README calls that trap out explicitly. And every read and write returns a copy, so mutating a returned document never writes back. To change data, go through update or replace.</p>

<h2>Architecture and code map</h2>

<pre><code>NanoDB/
├── cmd/nanodb/
│   └── main.go              # CLI args, dispatch, shell, serve, user admin (722)
├── server/
│   ├── server.go            # REST routes, transaction sessions (764)
│   ├── auth.go              # auth, roles, collection allowlists
│   └── users.go             # users.json account store
├── engine/                  # all core logic
│   ├── db.go                # storage engine, CRUD, WAL, snapshot, compaction (928)
│   ├── query.go             # filter compilation, sort, Top-N, projection (585)
│   ├── index.go             # single and compound indexes, query planning (804)
│   ├── text.go / geo.go     # inverted text index, geo index
│   ├── sql.go               # read-only SQL: lexer, parser, execution (624)
│   ├── aggregate.go         # aggregation pipeline
│   ├── tx.go                # explicit transactions
│   ├── batch.go             # atomic batches
│   ├── lock*.go             # directory lock (LockFileEx / flock)
│   └── id.go / copy.go      # id generation, document deep copy
└── docs/
    └── transaction-isolation.md   # full isolation level documentation
</code></pre>

<p>Dependencies run in one direction. <code>cmd</code> and <code>server</code> depend on <code>engine</code>, and <code>engine</code> depends on nobody. There is no abstract interface forest. <code>collection</code>, <code>index</code> and <code>Tx</code> are concrete types, because there is one implementation, and reserving interfaces for a hypothetical second one is how small projects turn into large ones.</p>

<table>
<thead><tr><th>Module</th><th>Lines</th><th>Job in one sentence</th></tr></thead>
<tbody>
<tr><td><code>engine/db.go</code></td><td>928</td><td>In-memory structures, WAL, snapshot compaction, directory lock</td></tr>
<tr><td><code>engine/index.go</code></td><td>804</td><td>Index structures and query plan selection</td></tr>
<tr><td><code>server/server.go</code></td><td>764</td><td>REST routing and HTTP transaction sessions</td></tr>
<tr><td><code>cmd/nanodb/main.go</code></td><td>722</td><td>CLI and shell</td></tr>
<tr><td><code>engine/sql.go</code></td><td>624</td><td>The three-stage read-only SQL implementation</td></tr>
<tr><td><code>engine/query.go</code></td><td>585</td><td>Filter compilation, matching, sorting, paging, projection</td></tr>
</tbody>
</table>

<h2>Data model</h2>

<p>The data directory holds only a few files.</p>

<pre><code>data/
├── snapshot.json   # full data and index definitions at a point in time
├── wal.log         # operations since the snapshot, JSON Lines
├── LOCK            # exclusive process lock (empty file, OS-level lock)
└── users.json      # optional: HTTP accounts
</code></pre>

<p>The hierarchy is collection to document. A collection resembles a table with no fixed schema. The rules are few, and each one is deliberate.</p>

<ul>
<li>A document must be a JSON object. Its <code>_id</code> must be a non-empty string, and when absent it is generated as <strong>a 13-hex-digit millisecond timestamp plus 12 random characters</strong>. The time prefix keeps generated ids roughly ordered, so an insert does not scatter the index.</li>
<li>Writes deep-copy, so mutating your object afterwards cannot affect the database, and reads return copies as well. That rule eliminates a whole class of concurrency bug where a shared map is edited somewhere else, at the price of one copy per operation. For memory-resident data of moderate size, it is cheap insurance.</li>
<li>Field names accept dotted paths for filters, sorts, projections and indexes, while documents themselves stay freely nested.</li>
<li>Field names beginning with <code>$</code> are treated as operators. That is a MongoDB compatibility constraint, and the README warns against using <code>$</code> for ordinary field names.</li>
<li>Numbers written through the CLI or HTTP decode as <code>float64</code>, numbers passed through Go keep their type, and comparisons are numeric either way. Cross-entry type behaviour is defined rather than left to be discovered.</li>
</ul>

<table>
<thead><tr><th>JSON type</th><th>Stored</th><th>Filter and sort</th><th>Indexable</th></tr></thead>
<tbody>
<tr><td>string</td><td>Yes</td><td>Equality, regex, lexicographic order</td><td>Yes</td></tr>
<tr><td>number</td><td>Yes</td><td>Numeric comparison</td><td>Yes</td></tr>
<tr><td>boolean</td><td>Yes</td><td>Equality</td><td>Yes</td></tr>
<tr><td><code>null</code></td><td>Yes</td><td>Only <code>$eq: null</code> and <code>$exists</code></td><td>Not written to indexes</td></tr>
<tr><td>array</td><td>Yes</td><td>Multikey, any element matches</td><td>Each element indexed</td></tr>
<tr><td>object</td><td>Yes</td><td>Whole-object equality</td><td>Not written to indexes</td></tr>
</tbody>
</table>

<p>Null and objects staying out of indexes is easy to overlook: an index-driven candidate set can then miss documents. NanoDB handles the variants with an incomplete flag plus a rule that the candidate set is only a pre-filter, with the full match still running.</p>

<h2>Persistence</h2>

<p>This is the core of the project. Every durability problem reduces to one question: <strong>what happens if power is lost mid-write?</strong> NanoDB's answer has three layers, none of them longer than a few dozen lines.</p>

<h3>What a record looks like</h3>

<p><code>wal.log</code> holds one complete record per line, in write order.</p>

<pre><code>{"op":"put","coll":"users","doc":{"_id":"u1","name":"Alice","age":30}}
{"op":"delete","coll":"users","id":"u2"}
{"op":"index.create","coll":"users","field":"age","unique":true}
{"op":"batch","ops":[{"op":"put","coll":"users","doc":{"_id":"u3"}}]}
{"op":"drop","coll":"users"}
</code></pre>

<p>There are seven operation types: put, delete, drop, batch, tx, index creation and index drop. Updates are written as overwriting puts. Batches and transactions are one parent record with children in an ops array, which is what keeps "all of it or none of it" atomic during recovery too.</p>

<p>JSON Lines is a blunt trade. It is readable, greppable, one full record per line, and it costs more space and parse time than a binary format. For a database aimed at moderate data that is a fair exchange, and it reduces crash recovery to "parse line by line, truncate the bad tail".</p>

<h3>Layer one: truncating a torn record</h3>

<p>If the process dies mid-line, the file ends with half a line. Replay returns the length of the valid prefix, and the WAL is truncated to that length.</p>

<pre><code>// replay applies the WAL in order and returns the length of the valid prefix.
func (db *DB) replay(data []byte) (int, error) {
    offset := 0
    for offset &lt; len(data) {
        nl := bytes.IndexByte(data[offset:], '\\n')
        if nl &lt; 0 {
            return offset, nil   // no newline: the tail is torn, stop here
        }
        ...
        if err := json.Unmarshal(line, &amp;rec); err != nil {
            return 0, fmt.Errorf("nanodb: corrupt wal near byte %d: %w", offset, err)
        }
        ...
    }
    return offset, nil
}
</code></pre>

<p>Two failures are treated differently on purpose. <strong>A missing trailing newline</strong> is a normal tear: truncate it, and everything committed before it stays. <strong>A parse failure in the middle</strong> is real corruption, and the database refuses to open. Silently skipping a bad line in the middle would disguise data loss as a successful recovery, and that is the one boundary recovery logic must never cross.</p>

<h3>Layer two: the writer rolls back its own damage</h3>

<p>Recovery alone is not enough. The writer must not leave half a record behind for the next recovery to find, and one function handles it with a comment worth reading in full.</p>

<pre><code>n, err := db.wal.Write(data)
if err != nil || n != len(data) {
    // A failed write may leave half a record at the tail, so roll back to the
    // previous complete record. Otherwise the next append fuses with the
    // fragment into an invalid line, and the database cannot be opened.
    db.rollbackWALLocked()
    ...
}
</code></pre>

<p>The rollback truncates to the offset of the last complete record and seeks back to it. That offset is both an in-memory counter and the recovery anchor. The same rollback is attached to a failing fsync.</p>

<p>There is a Windows trap hidden in the open path, and it is worth quoting as written.</p>

<pre><code>// Not O_APPEND: on Windows that flag removes GENERIC_WRITE, so a later
// Truncate fails with Access is denied. Writes are serialized by db.mu, so an
// explicit seek to the end preserves append semantics.
f, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, filePerm)
</code></pre>

<p>"Cross-platform" is usually a claim in a README. Here it is a decision about one flag, made by someone who actually ran the thing on Windows.</p>

<h3>Layer three: a generation number for the compaction window</h3>

<p>Any snapshot plus WAL design has a dangerous window: a crash after the snapshot is renamed but before the WAL is cleared. Replay would then reapply records already folded into the snapshot. For a plain put that is harmless. For a unique index it is a false conflict. For a delete followed by an insert, it can resurrect data.</p>

<p>NanoDB closes the window with generations. The snapshot records a generation, compaction increments it, and every WAL record carries the generation it was written in. Replay has one rule.</p>

<pre><code>// Records older than the current snapshot generation are already covered.
if rec.Gen &lt; db.walGen {
    offset += nl + 1
    continue
}
</code></pre>

<p>Whichever step compaction crashed on, the result is self-consistent: either the old-generation records are skipped, or the snapshot is still the old generation and replays normally. One <code>uint64</code> and one comparison is all it takes. That is the line between designed correctness and luck.</p>

<p>Compaction order matters too: <strong>write a temporary snapshot, fsync it, rename it into place, then clear the WAL.</strong> At any moment a complete old or new snapshot exists on disk. The compaction check is also called from points where the in-memory state has been fully applied, such as after a transaction commit or a completed batch. Compacting inside the write path could snapshot a state that is ahead of the data, missing a pending delete or index creation.</p>

<h3>The directory lock</h3>

<p>"One process per data directory" as a convention eventually fails, and two processes write at once. NanoDB makes it a physical fact with an operating-system file lock: <code>LockFileEx</code> on Windows, <code>flock</code> on Unix. A second process gets a distinct error, and a crashed process releases the lock automatically, so there is no zombie lock after a crash. A few dozen lines per platform, selected by build tags.</p>

<h2>Query execution</h2>

<p>A find call runs through five steps, each one with a clear motive.</p>

<pre><code>planCandidates   (choose a candidate set from indexes)
    → compileFilter
    → match each document
    → Top-N or full sort
    → skip and limit → projection copy
</code></pre>

<h3>Step one: the smallest candidate set</h3>

<pre><code>// planCandidates picks the index with the smallest candidate set from the
// filter, and returns nil to mean a full scan.
func (c *collection) planCandidates(filter map[string]any) map[string]struct{} {
    ...
    conds := make(map[string][]any, len(filter))
    collectConditions(filter, conds)
    ...
    consider := func(ids map[string]struct{}) {
        if ids == nil { return }
        if best == nil || len(ids) &lt; len(best) { best = ids }
    }
    for _, ix := range c.indexes { consider(ix.lookup(conds)) }
    for _, tx := range c.texts    { consider(tx.lookup(conds["$text"])) }
    for field, gx := range c.geos { consider(gx.lookup(conds[field])) }
    return best
}
</code></pre>

<p>No cost model, no statistics, no histograms. Every usable index is asked for a candidate set, and the smallest one wins. For a single-machine in-memory database that is the best planner per line of code, because an index lookup is logarithmic and asking three or four is far cheaper than choosing badly and scanning.</p>

<p>The rule in <code>collectConditions</code> matters more than the cleverness. It gathers top-level conditions and those inside <code>$and</code>. A union of branches under <code>$or</code> cannot be narrowed safely, because a candidate set that is too small silently drops documents, so the planner declines to use an index rather than risk it. The most important quality of a planner is <strong>knowing when not to be clever</strong>. The chosen set is also only a pre-filter: the full match still runs afterwards as a second safety net.</p>

<h3>Step two: compile the filter once</h3>

<pre><code>// compileFilter flattens the filter into a slice so per-document matching does
// not allocate map iterators, and precompiles regexes so a scan does not
// recompile the same pattern for every document.
func compileFilter(filter map[string]any) []filterClause { ... }
</code></pre>

<p>An invalid regex compiles to a nil matcher that never matches, rather than producing one error per document. On a scan of a hundred thousand documents, those two decisions are the difference between roughly two thousand allocations and hundreds of thousands.</p>

<h3>Step four: sort through a heap when there is a limit</h3>

<pre><code>if len(q.Sort) &gt; 0 {
    if q.Limit &gt; 0 {
        k := len(out)
        if q.Skip &lt; len(out) &amp;&amp; q.Limit &lt; len(out)-q.Skip {
            k = q.Skip + q.Limit
        }
        out = topNSortDocs(out, q.Sort, k)   // max-heap of size k
    } else {
        sortDocs(out, q.Sort)
    }
}
</code></pre>

<p>Asking for the first fifty means one pass with a heap of size skip plus limit, where the top of the heap is the worst of the current best k, and then sorting k elements. Complexity drops from n log n to n log k. Measured on a hundred thousand randomly ordered documents, that is <strong>6.5 ms against 85.3 ms</strong>.</p>

<p>Sort keys are also extracted up front, so a comparison never has to walk back into nested fields. And skip is handled by fetching skip plus limit rather than sorting the whole result and then slicing.</p>

<h2>Indexes</h2>

<h3>Secondary indexes and the incomplete flag</h3>

<p>An index is an ordered key to a set of document ids. It supports single fields, compound keys, uniqueness, and arrays where each element is indexed and any element matching counts. Range queries binary-search the boundaries.</p>

<pre><code>// spanFor binary-searches the entry range for a first-field range condition.
func (ix *index) spanFor(op string, val any) (entrySpan, bool)
</code></pre>

<p>That makes a range query logarithmic plus the number of hits instead of a full walk. It is where the measured gap between 3.1 ms indexed and 27.3 ms scanned comes from.</p>

<p>Compound indexes have one honest limitation. A document containing an array field cannot enter a compound index under tuple semantics, so the index is marked incomplete, and lookups against an incomplete index return nil, which means unusable. The planner then falls back to a scan. <strong>Slow is better than wrong.</strong> A partially visible index treated as complete would silently drop documents, which is far worse than one order of magnitude of latency.</p>

<h3>Text indexes: Chinese search without a dictionary</h3>

<p>The full-text index covers every string in a document and is queried with <code>$text</code>. The tokenizer is about thirty lines.</p>

<pre><code>// tokenizeText splits on letters and digits, and additionally emits bigrams
// for runs of Han characters, so Chinese queries match fragments without a
// segmentation dictionary.
func tokenizeText(s string) []string {
    ...
    if han &amp;&amp; len(word) &gt; 1 {
        for i := 0; i &lt; len(word)-1; i++ {
            out = append(out, string(word[i:i+2]))   // 数据库 -&gt; 数据, 据库
        }
    } else {
        out = append(out, strings.ToLower(string(word)))
    }
    ...
}
</code></pre>

<p>Bigrams are a classic dictionary-free approach. A phrase becomes overlapping pairs, a query is sliced the same way, and every term must match. No segmentation dictionary is needed anywhere in the pipeline.</p>

<p>The limits are stated plainly in the README: no stop words, no stemming, no synonyms, no relevance score, multi-term queries are pure AND, and results come back unordered. It is <strong>usable retrieval, not a search engine</strong>. For an embedded database that is the right scope, because most cases only need the documents containing these words.</p>

<h3>Geo indexes: longitude order plus haversine</h3>

<p>Geo entries are ordered by longitude and support <code>$geoWithin</code> with a box and a metric circle. Circles use haversine distance.</p>

<pre><code>// haversineMeters returns the great-circle distance between two points.
func haversineMeters(lon1, lat1, lon2, lat2 float64) float64
</code></pre>

<p>A box narrows candidates through the ordered structure first, and only then does the circle test run, so the expensive trigonometry is limited to a small set. The limits are equally explicit: no polygons and no GeoJSON geometry, no handling of the 180th meridian, and results are not distance-ordered.</p>

<h2>Transactions</h2>

<p>No lock waiting, no deadlocks, no MVCC undo chain. NanoDB uses the plainest scheme that fits "in memory, one process": <strong>collection snapshots plus version validation.</strong></p>

<pre><code>type Tx struct {
    mu       sync.Mutex
    db       *DB
    snap     map[string]*collection // per-collection snapshot
    versions map[string]uint64      // version when first accessed
    writes   map[string]bool        // collections written in this tx
    walOps   []walRecord
    done     bool
}
</code></pre>

<p>The workflow is short.</p>

<ol>
<li><strong>Begin takes no database lock at all.</strong></li>
<li><strong>The first access to a collection</strong> takes a read lock, records the version and deep-copies the whole collection. Everything after that reads and writes the snapshot, which gives repeatable read for free and lets the transaction see its own uncommitted writes.</li>
<li><strong>Commit takes the write lock once</strong> and validates the entire read set.</li>
</ol>

<pre><code>// Validate the whole read set to avoid lost updates and non-repeatable reads;
// read-only transactions validate snapshot consistency the same way.
for name, ver := range tx.versions {
    if tx.db.versions[name] != ver {
        tx.finishLocked()
        return fmt.Errorf("%w: collection %q changed during transaction", ErrConflict, name)
    }
}
</code></pre>

<p>If validation passes, the whole change set becomes <strong>one</strong> WAL record, the affected collections are replaced and their versions increment. If it fails, the caller gets a conflict error, every change is discarded, and it retries from begin.</p>

<p>Four consequences follow from that design.</p>

<ul>
<li><strong>Conflict granularity is the collection.</strong> If anyone touched any collection you read, even a different document, the commit fails. That is the acknowledged false conflict. A single version comparison is far cheaper than per-document tracking, which is the right trade for low-conflict workloads and a poor one for hot collections under heavy writes.</li>
<li><strong>There are no deadlocks.</strong> Nothing waits on a lock. The only synchronization point is the brief commit, and conflicts return an error rather than queueing. Between begin and commit the database stays fully writable.</li>
<li><strong>Read-only transactions still call commit.</strong> That is what certifies a consistent cross-collection view.</li>
<li><strong>Transaction methods are goroutine-safe</strong> behind one mutex. After the transaction ends every method returns a done error, and deferred rollback is idempotent.</li>
</ul>

<p>The canonical example is a transfer.</p>

<pre><code>tx, err := db.Begin()
if err != nil { return err }
defer tx.Rollback() // idempotent; returns a done error after commit

if _, err := tx.Update("accounts", from, map[string]any{"$inc": map[string]any{"balance": -100}}); err != nil {
    return err
}
if _, err := tx.Update("accounts", to, map[string]any{"$inc": map[string]any{"balance": 100}}); err != nil {
    return err
}
if err := tx.Commit(); err != nil {
    if errors.Is(err, engine.ErrConflict) {
        // A related collection changed; Begin again and retry.
    }
    return err
}
</code></pre>

<p>Full isolation levels, semantic details and retry advice live in <code>docs/transaction-isolation.md</code>. Keeping transaction semantics in their own document rather than scattering them through comments says something about the project's documentation.</p>

<h2>Atomic batches</h2>

<p>Transactions cover multi-step work with rollback. Batches cover "all at once, no intermediate state", and the strategy is <strong>clone and stage</strong>.</p>

<ul>
<li>Every write in the batch runs against clones of the affected collections. Any failure, whether a duplicate id, a unique index conflict, an invalid update expression or a missing target, discards the whole batch with the real data never touched.</li>
<li>On success the whole change set is written as one batch record, which is <strong>one</strong> WAL entry, replayed atomically, so there is no half-commit.</li>
<li>Batches span collections. Updating a missing target is an error; deleting a missing target is not, and the result reports that nothing was deleted. Both directions follow what the caller most likely meant.</li>
</ul>

<p>Cloning costs peak memory during the batch and buys <strong>atomicity without rollback logic</strong>. A failing path throws the clone away, and there is no code that has to undo half-applied index maintenance, which is the hardest code in a database to get right. The mechanism is the same snapshot family as transactions.</p>

<p>Batches also read from stdin, and because success writes one record, importing a hundred thousand documents costs one fsync instead of a hundred thousand. Under a WAL, batching pays multiplicatively.</p>

<h2>Read-only SQL and aggregation</h2>

<h3>SQL: three stages, same engine</h3>

<p><code>engine/sql.go</code> at 624 lines is a hand-written read-only subset: lex, parse, execute. It supports select with from, where, order by and limit or offset, plus count star.</p>

<p>The important property is that it <strong>brings no execution engine of its own</strong>. The parse result is translated into the same query structure the REST and CLI paths use, with filter, sort, limit, skip and fields, and then runs through the same filter compiler, the same index planning and the same Top-N sort. SQL and find performing identically is not a coincidence. They are one pipeline with two front doors.</p>

<p>The boundary is explicit, and the cost of that simplicity is stated too: no joins, no group by, no having, no distinct, no subqueries, no union and no column aliases; aggregation supports only count star; and like is case-sensitive. For query convenience on an embedded store, that subset covers most of "pull data out for a script".</p>

<h3>Aggregation pipeline</h3>

<p>Eight stages: match, group, sort, skip, limit, project, unwind and count. Accumulators are sum, average, minimum, maximum, first, last and push, named to match MongoDB so people who know it need no learning time.</p>

<p>The limits are honest in the same way: no lookup, no facet, no window functions, no out or merge, and <strong>aggregation does not use indexes</strong>. A match at the head of a pipeline can still benefit from the caller pushing filters down, but the pipeline itself does no index planning.</p>

<h2>HTTP service</h2>

<p>The server package wraps the engine in REST.</p>

<ul>
<li><strong>Routes.</strong> Health, CRUD under a versioned collection path with filter, sort, limit, skip, fields and count carried in query parameters, and admin endpoints such as compaction.</li>
<li><strong>Auth.</strong> An empty token disables authentication. Otherwise requests carry a token header. The shared token is the admin credential, and per-user tokens can be limited to admin, write or read with an exact-match collection allowlist.</li>
<li><strong>HTTP transactions.</strong> A post opens a transaction and returns an id, operations run under that id, and the caller commits or rolls back. Sessions live <strong>in server memory</strong>, roll back after thirty idle minutes, and roll back at shutdown, so a forgotten transaction cannot pin snapshot memory indefinitely.</li>
<li><strong>Defensive details.</strong> An 8 MiB request body cap, with large imports pushed to the CLI; parameter validation; consistent error codes; and request parsing that never leaves a connection half-open.</li>
</ul>

<p>HTTP transactions <strong>share the same transaction implementation</strong> as the Go API. The session layer only maps ids to transactions and reaps the idle ones. Thin entry points, one engine, again.</p>

<h2>Measured performance</h2>

<p>A hundred thousand documents, with equality and range queries matching a thousand of them. These are local Windows numbers, and they move with the machine and the load.</p>

<table>
<thead><tr><th>Scenario</th><th>Time</th><th>Allocations per op</th></tr></thead>
<tbody>
<tr><td>Equality, indexed</td><td>3.0 ms</td><td>2,037</td></tr>
<tr><td>Equality, full scan</td><td>12.0 ms</td><td>2,012</td></tr>
<tr><td>Range, indexed</td><td>3.1 ms</td><td>2,037</td></tr>
<tr><td>Range, full scan</td><td>27.3 ms</td><td>2,012</td></tr>
<tr><td>Projection, indexed</td><td>3.1 ms</td><td>2,037</td></tr>
<tr><td>Sort and paginate, 10k hits, skip 500, limit 50</td><td>12.9 ms</td><td>208</td></tr>
<tr><td>Random-order Top-50, 100k hits</td><td>6.5 ms</td><td>6</td></tr>
<tr><td>Random-order full sort, 100k hits</td><td>85.3 ms</td><td>6</td></tr>
</tbody>
</table>

<p>Four readings from that table.</p>

<ol>
<li><strong>Indexes are worth four to nine times</strong>, and the range case shows the wider gap because a scan recompares per document while an index binary-searches and walks the hit span.</li>
<li><strong>Top-N is worth thirteen times</strong>. Never fully sort when you only need the first N.</li>
<li><strong>Allocations per op are more trustworthy than wall time.</strong> The README notes that consecutive benchmark runs throttle the CPU and absolute timings can swing by more than 30%, so compare allocation counts.</li>
<li><strong>Sort with pagination allocates only 208 times</strong>, because extracting sort keys and using a heap decouples comparison from field lookup.</li>
</ol>

<p>The tuning advice is just those mechanisms again. Index hot filter fields, but not too many. Project with the fields parameter when you need a subset, since projection copies while copying and costs the same allocations. Pair sort with limit whenever you only need the first N. Accept losing recent writes with the no-sync flag if throughput matters more. And raise the compaction threshold for write-heavy workloads, at the cost of a longer replay on restart.</p>

<h2>Tests and engineering quality</h2>

<pre><code>go vet ./...
go test ./...
go test -cover ./...
go test -race ./...        # needs cgo and a C compiler
go test ./engine -run '^$' -bench Benchmark -benchmem
</code></pre>

<p>All three packages pass: <code>cmd</code> in 0.87 s, <code>engine</code> in 1.08 s, <code>server</code> in 1.58 s. Coverage is about 80% on engine and server, 75% on cmd.</p>

<p>The coverage list shows where the emphasis sits.</p>

<ul>
<li><strong>Engine:</strong> CRUD, query operators, sort, paging and projection, four kinds of index and uniqueness, aggregation, SQL parsing and execution, batch atomicity, transaction isolation and conflict, <strong>WAL replay, compaction and the directory lock</strong>, behaviour after close, and update error paths.</li>
<li><strong>Server:</strong> auth, roles and allowlists, account storage, routing, method handling, parameter validation, error codes, transaction sessions and timeout reaping, and the body cap.</li>
<li><strong>CLI:</strong> argument parsing, the full path of a one-shot command, shell transactions and EOF rollback, and starting and stopping the server.</li>
</ul>

<p>What deserves credit is that crash and boundary scenarios are part of the regular suite rather than a happy-path check. Recovery, compaction, locking and EOF rollback are exactly where durability projects fail in production. Benchmarks use a hundred thousand documents, with a paired A/B between a full sort and Top-N on randomly ordered data.</p>

<p>The git history shows the process being maintained as well: semantic version tags and releases on each commit, normalised line endings, explicit module cache handling. A 0.1.0 project that builds its release pipeline first intends to be around.</p>

<h2>Where it sits</h2>

<table>
<thead><tr><th>Dimension</th><th>NanoDB</th><th>SQLite</th><th>LevelDB / BadgerDB</th><th>MongoDB</th></tr></thead>
<tbody>
<tr><td>Shape</td><td>Embedded, single process</td><td>Embedded, single process</td><td>Embedded key-value</td><td>Service, distributed</td></tr>
<tr><td>Model</td><td>JSON documents and collections</td><td>Relational tables and SQL</td><td>Byte key-value</td><td>JSON documents</td></tr>
<tr><td>Query language</td><td>Mongo-like plus read-only SQL and aggregation</td><td>Full SQL</td><td>Keys and iterators</td><td>Mongo queries and aggregation</td></tr>
<tr><td>Transactions</td><td>Explicit, optimistic, collection granularity</td><td>Single-database ACID</td><td>None, or limited MVCC in Badger</td><td>Multi-document since 4.0</td></tr>
<tr><td>Secondary indexes</td><td>Yes, including text and geo</td><td>B-trees</td><td>Build your own</td><td>Yes, many kinds</td></tr>
<tr><td>Persistence</td><td>Snapshot plus JSON Lines WAL</td><td>Pager plus WAL</td><td>LSM plus WAL</td><td>WiredTiger plus WAL</td></tr>
<tr><td>Dependencies</td><td>None</td><td>None, in C</td><td>None</td><td>Server and driver</td></tr>
<tr><td>Data size</td><td>What fits in memory</td><td>Terabytes on disk</td><td>Terabytes on disk</td><td>Cluster scale</td></tr>
</tbody>
</table>

<p>The differences in positioning come down to three points.</p>

<p><strong>Against SQLite:</strong> SQLite is relational, with full SQL and disk paging, and its data can far exceed memory. NanoDB is a document model that lives in memory, and it sells native JSON plus friction-free Go embedding. For analytical SQL over a lot of data, choose SQLite. For dropping a JSON store into a Go service, NanoDB is less work.</p>

<p><strong>Against the LevelDB family:</strong> those are key-value engines with no query language and no index abstraction. Using one for documents means writing the whole layer above it, which is exactly what NanoDB ships.</p>

<p><strong>Against MongoDB:</strong> Mongo is a network protocol, replica sets and sharding, with an operational cost in a different category. NanoDB has no distributed ambition. It is a data directory inside your process.</p>

<h2>Known limits</h2>

<p>This section comes straight from the project's own statement, and a database project that documents its limits more carefully than its features is easier to trust.</p>

<ul>
<li><strong>Memory resident.</strong> Documents and indexes live in memory, so data size is bounded by RAM. The WAL is JSON Lines, which costs more space than a binary format.</li>
<li><strong>No distribution.</strong> No replicas, no sharding, no clustering, one process per directory at a time.</li>
<li><strong>Transaction boundaries.</strong> Isolation is fixed and not configurable. Conflict granularity is the collection, so false conflicts happen. No savepoints, no DDL inside a transaction, no cross-process transactions.</li>
<li><strong>Text search is approximate.</strong> Bigram tokenization, no stop words, no stemming, no synonyms, no relevance scoring, multi-term queries are AND, and the indexed field is fixed.</li>
<li><strong>Geo is limited.</strong> Box and circle only, no polygons or GeoJSON geometry, no 180th meridian, and results are not distance-ordered.</li>
<li><strong>SQL is read-only and partial.</strong> No joins, group by, having, distinct, subqueries or union. Aggregation is count star.</li>
<li><strong>Aggregation skips indexes.</strong> No lookup, no facet, no window functions, no out or merge.</li>
<li><strong>Compound indexes fall back on arrays.</strong> A document containing an array field never enters a compound index, and planning falls back to a scan.</li>
<li><strong>Coarse permissions.</strong> Collection allowlists are exact match, with no wildcards or field-level rights, and the HTTP body cap is 8 MiB.</li>
<li><strong>Array inserts are not atomic.</strong> Use a batch or a transaction when atomicity matters.</li>
</ul>

<h2>When to use it, and when not to</h2>

<p><strong>A good fit:</strong> local storage inside Go tools and services, such as configuration, task queues, crawler state or desktop application data, where you do not want to run a database service to store tens of thousands of JSON rows. Read-heavy workloads whose data fits in memory, where indexes and Top-N give millisecond responses. Teaching and forking, because ten thousand dependency-free lines with every part present make an excellent starting point for changing the WAL format, adding an index kind or practising transactions. And edge or single-machine deployment, where one binary with no cgo and no external service is the entire story.</p>

<p><strong>A poor fit:</strong> data larger than memory, or terabyte-scale durability, which belongs to SQLite and the LSM family. Multi-process writes to one directory, or multi-node high availability, which the project explicitly gives up. Transaction-heavy writes on hot collections, where collection-level optimistic conflicts cause large numbers of retries. And production requirements around relevance-ranked search, complex SQL analytics or precise geospatial computation.</p>

<h2>Closing</h2>

<p>Back to the three opening questions.</p>

<p><strong>How short is the shortest path to a transactional database?</strong> A transaction struct plus a version-check loop. The whole file is "collection snapshot plus read-set validation at commit". No lock manager, no undo log, and it still provides repeatable read, protection against lost updates, and an explicit conflict error for the caller to retry.</p>

<p><strong>How many lines is "committed data survives a crash"?</strong> Three layers: replay finds the valid prefix and truncates a torn record, the writer rolls back a failed write to the previous complete record, and a generation number makes a crash inside the compaction window self-resolve. Under a hundred lines of core. The hard part is not the code, it is thinking through the state at every crash point.</p>

<p><strong>How do documents, indexes and concurrency fit together?</strong> Every write goes through one entry point that maintains all four index kinds synchronously. Transactions carry those indexes inside the cloned snapshot. And planning only chooses the smallest candidate set, with the full match as the backstop.</p>

<p>NanoDB will not replace SQLite, and has no intention of replacing MongoDB. Its value is putting the black box on the table: <strong>the WAL is newline-delimited JSON, a transaction is a version comparison, and query planning is picking the smallest candidate set.</strong> The mechanisms are plain enough to memorise, and that plainness is exactly why they can be trusted.</p>

<p>If you have ever thought about writing a database, the answer here is yes, and it does not take many lines. The next step is not reading more papers. Clone it and break replay, commit and planning one at a time, then check whether the tests still pass. That is a faster introduction than any article.</p>
`,
  },
  {
    slug: 'nanobrowser-tauri-webview2',
    zhSlug: 'nanobrowser-tauri-webview2',
    topicSlug: 'projects',
    title: 'NanoBrowser, part 1: a Chrome-like browser that ships no engine',
    excerpt:
      'A 4.5 MB Tauri browser shell that drives the system WebView2, never opens a debugging port, and implements its own in-process CDP bridge and WebSocket server.',
    date: '2026-10-16',
    readingTime: 25,
    html: `
<p>NanoBrowser is an open-source project at <a href="https://github.com/zhoujungis/NanoBrowser" rel="noopener noreferrer" target="_blank">zhoujungis/NanoBrowser</a>. It asks one small question: <strong>if I refuse to bundle Chromium, can I still ship a desktop browser that feels like Chrome?</strong></p>

<p>Most attempts at this drift the same way. Chromium or Electron goes into the installer, the download starts at 100 MB, and every app carries its own copy of the engine and its own memory footprint. Nobody wants to pay that for a shell.</p>

<p>NanoBrowser takes the other road: <strong>build no engine, only the shell.</strong> Rendering is the WebView2 already installed on Windows. The app does tabs, an address bar, bookmarks, history, downloads, find-in-page, shortcuts and themes, plus something harder: it wires the DevTools protocol into its own process.</p>

<p>The result is two binaries. The visible browser <code>nanobrowser.exe</code> is about <strong>4.52 MB</strong>. The headless automation browser <code>nanoagent.exe</code> is about <strong>4.24 MB</strong>. They share one library crate and one in-process protocol bridge.</p>

<p>This is part one of two. Part two covers the tab engine, the headless agent, the five security layers and the fourteen pitfalls that cost real debugging time.</p>

<h2>What it does</h2>

<table>
<thead><tr><th>Binary</th><th>Purpose</th><th>Release size</th></tr></thead>
<tbody>
<tr><td><code>nanobrowser.exe</code></td><td>Visible GUI browser</td><td>~4.52 MB</td></tr>
<tr><td><code>nanoagent.exe</code></td><td>Headless automation browser (CLI and MCP)</td><td>~4.24 MB</td></tr>
</tbody>
</table>

<p>The browser side covers a full Chrome-shaped surface. Tabs drag to reorder with FLIP animation, pin and unpin, close on middle click, and reopen with <code>Ctrl+Shift+T</code>. There is an omnibox with suggestions, a bookmarks bar, find-in-page, a download manager, history, zoom, light and dark themes, and native window buttons.</p>

<p>The unusual part is DevTools. The <em>real</em> DevTools frontend loads into a child webview of the same window, docked to the bottom or the right, resizable by dragging a splitter. It is not a popup.</p>

<p>Internal pages live under <code>nano://</code>: new tab, history, bookmarks, downloads, settings, about. The agent half runs as one-shot CLI commands or as an MCP server over stdio, with redacted traffic capture, trusted input synthesis and screenshots.</p>

<p>The frontend is hand-written HTML, CSS and JavaScript with no bundler. No npm, no Vite, no framework. That is a size and complexity trade, and the costs show up later.</p>

<h2>Three decisions that go against instinct</h2>

<p><strong>No engine.</strong> The project contains no rendering engine, no disassembler, no JavaScript engine. It drives the WebView2 already on the machine. The cost is Windows-only, because the whole stack rests on WebView2's COM interop. The benefit is single-digit megabytes and the system's security updates for free.</p>

<p><strong>No debugging port, ever.</strong> Neither binary passes <code>--remote-debugging-port</code>. All CDP traffic goes through <code>ICoreWebView2::CallDevToolsProtocolMethod</code> inside the process. The DevTools panel does need a WebSocket, but that socket is a loopback service the process opens itself. It has an admission requirement, it lives only while the panel lives, and nothing outside the process can use it.</p>

<p><strong>Hand-write the hard dependencies.</strong> The WebSocket bridge behind DevTools is implemented here: SHA-1 handshake, base64 accept key, text and close frame codec. No <code>tungstenite</code>, no equivalent library.</p>

<p>The three add up to a rule: reuse what the system already has, and shrink the self-written surface to the part that must be written and is worth writing.</p>

<h2>Stack and release profile</h2>

<table>
<thead><tr><th>Layer</th><th>Choice</th><th>Version</th></tr></thead>
<tbody>
<tr><td>App framework</td><td>Tauri</td><td>2.12.4</td></tr>
<tr><td>WebView abstraction</td><td>wry</td><td>0.57.0</td></tr>
<tr><td>Engine</td><td>Microsoft Edge WebView2 (Chromium)</td><td>System-installed</td></tr>
<tr><td>WebView2 COM bindings</td><td><code>webview2-com</code></td><td>0.39.1</td></tr>
<tr><td>Win32 bindings</td><td><code>windows</code></td><td>0.62.2</td></tr>
<tr><td>Serialization</td><td><code>serde</code> / <code>serde_json</code></td><td>1.0.154</td></tr>
<tr><td>Language</td><td>Rust</td><td>edition 2021</td></tr>
</tbody>
</table>

<p>Two Tauri features are enabled and both are required:</p>

<pre><code>tauri = { version = "2", features = ["unstable", "devtools"] }
</code></pre>

<p><code>unstable</code> gates the child webview API: <code>add_child</code>, <code>get_webview</code>, per-webview <code>devtools(false)</code>. Without it the core topology does not exist. <code>devtools</code> exposes the <code>ICoreWebView2</code> interop the bridge needs.</p>

<p>The release profile is tuned entirely for size: <code>opt-level = "s"</code>, <code>lto = true</code>, <code>codegen-units = 1</code>, <code>strip = true</code>, <code>panic = "abort"</code>. That last flag has a consequence worth knowing. There is no catch-unwind safety net, so every panic ends the process, which is why the code returns <code>Option</code> or <code>Err</code> at boundaries instead of writing first and fixing later.</p>

<h2>Repository layout</h2>

<pre><code>NanoBrowser/
├─ start.bat                  launcher: release first, debug fallback
├─ ui/                        frontend: plain HTML/CSS/JS, no bundler
│  ├─ index.html              trusted shell: tab strip, toolbar, SVG sprite
│  ├─ shell.js / shell.css    shell behaviour and styles
│  ├─ internal.css / internal.js   shared internal-page assets
│  ├─ ntp.html|js             nano://newtab
│  ├─ history.html|js         nano://history
│  ├─ bookmarks.html|js       nano://bookmarks
│  ├─ downloads.html|js       nano://downloads
│  ├─ settings.html|js        nano://settings
│  └─ about.html              nano://about
└─ src-tauri/
   ├─ tauri.conf.json         productName, frontendDist=../ui, withGlobalTauri
   ├─ capabilities/           per-webview permission scopes
   └─ src/
      ├─ lib.rs               library crate exporting cdp
      ├─ main.rs              GUI binary: window, shell webview, wiring
      ├─ cdp.rs               in-process CDP bridge (shared by both binaries)
      ├─ state.rs             Settings / Profile / AppState / Tab / constants
      ├─ profile.rs           data dirs, profile.json read and atomic save
      ├─ tabs.rs              tab lifecycle, layout, downloads, shortcuts
      ├─ inject.rs            per-tab init script
      ├─ commands.rs          the #[tauri::command] surface
      ├─ devtools.rs          docked panel and WebSocket bridge
      └─ bin/nanoagent/
         ├─ main.rs           hidden window, mode dispatch
         ├─ browser.rs        navigate/read/click/fill/screenshot/cookies/wait
         ├─ cli.rs            one-shot command front end
         ├─ mcp.rs            MCP server over stdio
         ├─ traffic.rs        Network.* capture with redaction
         └─ paths.rs          data dirs and the automation profile
</code></pre>

<p>Two things stand out in that tree. <code>cdp.rs</code> is exported as a library, and both <code>main.rs</code> and <code>bin/nanoagent/main.rs</code> depend on it. That is "one core, two entry points" made physical. And <code>devtools.rs</code> is named as the hardest module, with its own chapter in the README.</p>

<h2>Core 1: N+1 webviews in one window</h2>

<p>The architecture rests on one fact. NanoBrowser has exactly one OS window, and inside it live up to three kinds of <strong>child webview</strong>, each a <strong>sibling HWND</strong> rather than a true child.</p>

<pre><code>┌─ main window ─────────────────────────────────────────────┐
│  shell webview  (label "shell")   ← y: 0 .. shell_h       │
│    tab strip (40) + toolbar (44) + bookmarks bar (28)      │
├──────────────────────────┬────────────────────────────────┤
│  page webview            │  devtools panel webview        │
│  (label "tab-&lt;id&gt;")      │  (label "devtools")            │
│  one per tab, only the   │  exists only while open;       │
│  active one is visible   │  bottom or right               │
└──────────────────────────┴────────────────────────────────┘
</code></pre>

<p>The shell is the trusted chrome at <code>ui/index.html</code>, and it holds every IPC command. Each tab gets its own webview under the label <code>tab-&lt;id&gt;</code>, created lazily and hidden or shown on switch. All tab webviews share one WebView2 user-data directory, so cookies and login state carry across tabs. The DevTools panel is created the first time it opens.</p>

<p>Layout is computed in Rust and applied per webview with <code>set_position</code> and <code>set_size</code>. The shell height is derived, not guessed: <code>STRIP_H(40) + TOOLBAR_H(44) + (bookmarks_bar ? BM_H(28) : 0)</code>, which is 84 logical pixels, or 112 with the bookmarks bar. Everything below is page area. Sizes are logical and scaled by <code>scale_factor</code>, so window coordinates and logical coordinates never mix on a HiDPI display.</p>

<p><code>AppState</code> sits behind a single mutex and holds the tab list, the active id, the reopen stack, the shell height, the profile, the id counter, the system dark flag, the overlay flag, and the DevTools state. A <code>Tab</code> carries its id, label, URL, title, loading state, pin state, icon, internal flag, a <code>live</code> flag, zoom index, back and forward availability, navigation counters, and an opaque per-tab token that the security model depends on.</p>

<p>The <code>live</code> flag is the interesting one. It says whether the tab's real webview exists yet, because a tab can be logically open before it has a webview. That is why session restore paints immediately.</p>

<p>The shell reaches Rust through 40 commands covering state, navigation, tabs, UI, DevTools and data. Rust pushes state back through Tauri events: tab state, omnibox state, bookmark changes, theme changes, find results, focus requests and drag state. The frontend never polls. Even the window title is composed on the Rust side.</p>

<h3>Why sibling HWNDs matter</h3>

<p>This is the source of every counter-intuitive problem later in the post. Child webviews are sibling HWNDs, and later-created windows paint above earlier ones. The shell is created first and page webviews after it, so by default the page covers the shell.</p>

<p>Two consequences follow. Any shell UI that overflows the chrome area, such as the main menu, the omnibox dropdown or a tab context menu, is clipped by the page webview. And a child webview cannot see pointer movement outside its own bounds, which makes drag-resizing the DevTools panel awkward in a way that has nothing to do with DevTools.</p>

<h2>Core 2: the in-process CDP core</h2>

<p><code>cdp.rs</code> is the heart of the project, shared by both binaries, and its shape comes from two properties of <code>CallDevToolsProtocolMethod</code>.</p>

<p><strong>There is no <code>{"id": ...}</code> envelope.</strong> A CDP client written against a debugging port sends <code>{"id":7,"method":"Page.navigate","params":{...}}</code> and matches the reply by id. <code>CallDevToolsProtocolMethod</code> has no such layer. You pass a method and params, and the completion callback receives that method's result object. No id. No envelope.</p>

<p>Replies therefore cannot be matched by id. The project assigns each call an incrementing sequence number, bakes it into the callback closure created for that call, and dispatches the result to the matching waiter when the callback fires.</p>

<p><strong>The callback runs on the WebView2 UI thread.</strong> This one is worse. Waiting for a callback on that thread means waiting for yourself, which deadlocks immediately, and it happens most easily in the hidden-window agent.</p>

<p>So every call is fire-and-forget, and the caller is always a worker thread, never the UI thread. The caller parks on a condition variable until the reply lands in shared state. Internally that is an atomic sequence counter, a mutex-guarded sink, a condition variable, and a pending map for callback replies.</p>

<p>Two calling styles sit on top, and the split is a hard constraint rather than a preference. The blocking style waits for a reply with a 30-second default timeout and is used by the automation agent. The non-blocking style hands the reply to a callback and is used by the DevTools bridge, whose service loop runs on its own socket thread and would deadlock if it blocked.</p>

<p>The timeout message is <code>CDP &lt;method&gt; timed out</code>. Putting the method name in the error is worth copying, because it tells you where it hung.</p>

<p>A few more details matter. Empty replies are normalized to <code>null</code> rather than an empty string. <code>on_event</code> subscribes through <code>GetDevToolsProtocolEventReceiver</code>, and once registered the subscription belongs to WebView2, so the callback lives as long as the webview and there is no unsubscribe. <code>with_webview</code> must be called off the main thread. And <code>Cdp::webview()</code> is the single entry point that resolves both child webviews and the agent's window.</p>

<p>All of that adds up to one job: turn a callback-based, UI-thread-bound COM interface with no request ids into a blocking, worker-thread-safe, sequence-correlated Rust API. It is the most infrastructure-like piece of the project.</p>

<h2>Core 3: a hand-written WebSocket server</h2>

<p>The DevTools frontend needs a WebSocket, and the project implements the server itself in <code>ws.rs</code>.</p>

<p>The handshake reads HTTP headers from the TCP stream with two guards: a 2048-byte read buffer, and abandonment once headers exceed 16384 bytes. It scans for the blank line, takes <code>Sec-WebSocket-Key</code>, and computes the accept key as <code>base64(sha1(key + GUID))</code> against the fixed GUID. SHA-1, base64 and the accept helper are all written here.</p>

<p>Framing handles masking, 1/2/4-byte length extensions, and fragmentation, where one logical message arrives across several reads. Outgoing frames never mask, as the RFC requires of servers. Text, PONG and CLOSE are supported.</p>

<p>After the handshake, <code>accept</code> sets a 25 ms read timeout. That is not a failure timeout. It is the service loop's tick. The loop polls the socket: a zero-byte read means the panel left, and a would-block result means no data yet. One thread therefore handles both panel messages and CDP events without select or epoll.</p>

<p>The tests use an independently written client encoder rather than round-tripping the decoder against itself. They cover a completed handshake with the exact status and accept value, a connection without the session key receiving no headers and no bytes at all, a 70 KB payload reassembled across reads, PING answered with PONG, and CLOSE answered with an empty-payload close.</p>

<h2>Core 4: the docked DevTools panel</h2>

<p>This is the hardest part of the project and the most worth reading.</p>

<p>WebView2 does ship the real DevTools frontend, but only through <code>OpenDevToolsWindow</code>, which is a separate window. A Chrome-style docked panel needs another route, and both easier options are dead ends. <code>--remote-debugging-port</code> fails because only the shell webview becomes a CDP target, so the official frontend cannot attach to a page. Writing a minimal custom panel loses Elements, Console, Network and Sources.</p>

<p>The route taken is the official frontend plus an in-process loopback WebSocket bridge. The panel loads a <code>devtools://devtools/bundled/inspector.html</code> URL with the socket address in the query string and the dock side in the fragment.</p>

<blockquote>
<p>Appending a second query key after <code>?ws=</code> makes WebView2's <code>devtools://</code> handler fail the entire load, and the panel shows Chromium's "this page cannot be reached" error. A fragment is parsed by the browser before that handler runs, so it is safe.</p>
</blockquote>

<p>There is a nastier follow-up. While debugging this, <code>webview.url()</code> lies, because the error page still reports the URL you asked for. The reliable signals are whether the bridge received a client and how many domains it registered.</p>

<p>Three constraints keep the bridge from being a debugging port. It binds a random loopback port, it accepts only the single session id minted for this panel's URL, and every CDP request is forwarded to a page webview through <code>CallDevToolsProtocolMethod</code>. A page that scans localhost finds a listener that answers nothing without that id, and the id exists only while the panel does.</p>

<p>Events exposed a gap in the protocol. <code>Schema.getDomains</code> lists 35 domains and returns no event names, so events cannot be discovered dynamically. The project keeps a static event table and subscribes lazily per domain, only for domains the frontend actually enabled. Two robustness rules follow: a failed subscription is skipped rather than abandoning the domain, and calls WebView2 does not implement, such as <code>Page.startScreencast</code>, come back as CDP errors instead of breaking the bridge.</p>

<p>Geometry is computed in one function that returns both the page rectangle and the panel rectangle, and takes state as a parameter so docking rules are unit-testable without a window. Six constants bound it: minimum and default panel size for each dock side, plus a minimum page size. The two minimums are enforced together, so neither the panel nor the page can squeeze the other out of existence.</p>

<p>Dragging the splitter runs into the sibling-window limit. A child webview cannot see pointer movement outside itself, so the pointer leaving the panel is invisible to the panel. The fix routes the pointer through the shell. On pointer down the panel asks Rust to expand the shell over the whole window and raise it. A full-window capture layer in the shell forwards coordinates to a command that computes the new panel size. On pointer up the layer is removed. The same overlay flag serves this and the menu-clipping fix, which is one mechanism for two problems.</p>

<p>Signalling needed a trick, because the panel loads a <code>devtools://</code> document where Tauri's IPC does not exist and <code>window.chrome.webview</code> does not exist either. Both normal channels are cut. So the panel calls <code>window.open</code> with a URL on <code>nano-dt.invalid</code>, a domain that can never resolve. Rust sees the popup request, reads the action from the path, and denies it. Nothing navigates and nothing loads. The side effect is the message.</p>

<p>Lifecycle is small but precise. <code>F12</code>, <code>Ctrl+Shift+I</code> and the main menu toggle the panel. Activating or creating a tab retargets the panel so it follows the active tab. Closing a tab forgets its protocol state. Pressing <code>F12</code> inside the panel closes it. The dock side persists in settings, and switching sides reloads the panel so the splitter lands on the right edge.</p>

<p>Every webview, including the panel itself, calls <code>.devtools(false)</code>. That disables the native DevTools popup and does not affect <code>CallDevToolsProtocolMethod</code>, which is what makes the whole docking approach possible.</p>

<h2>Core 5: z-order and the overlay trick</h2>

<p>The mine planted in Core 1 needs defusing. The page webview is created later, so it covers the shell and clips every overflowing menu.</p>

<p>While a menu or suggestion list is open, the shell expands to the whole window and is raised with <code>SetWindowPos</code> against <code>HWND_TOP</code>. On close it returns to its normal height. After any tab create, activate or close, a helper re-asserts z-order, because the new page webview would otherwise climb back on top.</p>

<pre><code>SetWindowPos(hwnd, HWND_TOP, 0, 0, 0, 0,
             SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_SHOWWINDOW)
</code></pre>

<p>The flags read together mean: change z-order only. No move, no resize, no focus steal, stay visible. <code>SWP_NOACTIVATE</code> is the one people forget, and without it every menu open re-activates the window and focus jumps.</p>

<p>So "expand and raise" is used by exactly two things, menu overflow and splitter dragging. One mechanism, two scenarios.</p>

<hr>
<p><em>Continues in <a href="/en/article/nanobrowser-tauri-webview2-part-2/">part two</a>: the tab engine, the zero-framework front end, the headless agent, the MCP server, traffic capture, the five security layers, the size accounting and the fourteen pitfalls.</em></p>
`,
  },
  {
    slug: 'nanobrowser-tauri-webview2-part-2',
    zhSlug: 'nanobrowser-tauri-webview2',
    topicSlug: 'projects',
    title: 'NanoBrowser, part 2: tabs, the headless agent, and fourteen pits',
    excerpt:
      'The second half of the NanoBrowser teardown: tab engine algorithms, a zero-framework front end, a headless MCP-driven browser, traffic capture with capture-time redaction, five security layers and fourteen hard-won pitfalls.',
    date: '2026-10-16',
    readingTime: 24,
    html: `
<p>This is part two. <a href="/en/article/nanobrowser-tauri-webview2/">Part one</a> covered the shell, the in-process CDP core, the hand-written WebSocket server and the docked DevTools panel.</p>

<h2>Core 6: the tab engine</h2>

<p><code>tabs.rs</code> is the largest business file, and it is full of small algorithms worth looking at on their own.</p>

<p><strong>Omnibox parsing</strong> has three branches. Empty input goes to the new tab page. An internal <code>nano://</code> address is used as written. Anything that looks like a URL gets <code>https://</code> prepended if needed. Everything else is handed to the configured search engine.</p>

<p>The "looks like a URL" test is where the judgement lives. An explicit scheme must also survive <code>Url::parse</code>. A string containing spaces, or an empty string, is treated as a search, because that is a strong signal the user is typing words. Otherwise the candidate gets <code>https://</code> and must then have a host of <code>localhost</code>, or parse as an IP, or contain at least two dot-separated segments, and must start with an ASCII letter or digit.</p>

<p>Those rules draw the least-wrong line between "<code>example.com</code> is an address" and "<code>how to code</code> is a query".</p>

<p><strong>Downloads</strong> handle name collisions with <code>report (1).pdf</code> and so on. That sounds trivial until two downloads start together. Both can decide the path is free and both can write the same file.</p>

<p>The fix is an atomic reservation. The winner claims the path with an exclusive create, and only then does WebView2 fill in the content. The naming helper tries up to a thousand candidates. In one line: let the filesystem arbitrate the name, not an in-memory check.</p>

<p><strong>Favicons</strong> must include the port. Dropping it on a site running on a non-default port points at a different origin's icon, which is not just ugly but wrong.</p>

<p><strong>Zoom</strong> is a fixed fifteen-step ladder. The index is clamped before use, so an out-of-range value in an old profile cannot panic. In a build with <code>panic = "abort"</code>, one out-of-bounds read ends the process, so a test pins the clamp.</p>

<p><strong>Shortcuts</strong> are handled in two places. Keystrokes inside a page are reported by the injected script and handled in Rust. Keystrokes inside the shell are handled by <code>shell.js</code>. The map covers tab creation and closing, reopen, cycling and number selection, address bar focus, find, bookmark, history, downloads, bookmark manager, back and forward, zoom, reload, fullscreen, and the DevTools toggle.</p>

<p>One act of restraint is worth noting. Editing keys, <code>Ctrl+R</code>, <code>Ctrl+P</code> and <code>Ctrl+Shift+1</code> through <code>9</code> are left to the engine. The worst thing a browser shell can do is swallow a key the page needs. <code>F5</code> is left alone for the same reason.</p>

<h2>Core 7: the zero-framework frontend</h2>

<p>The frontend is hand-written HTML, CSS and JavaScript in <code>ui/</code>. No bundler, no framework, no npm.</p>

<p>Three things improve. There is no build step, so editing a line of HTML and reloading is the whole cycle. UI asset size is close to zero. And the interface to Rust is trivial, because <code>withGlobalTauri</code> is on and the page calls the 40 commands directly.</p>

<p>Two things get worse. There is no component reuse and no type checking, and state plus DOM are managed by hand. That is why so much of <code>shell.js</code> is careful, manual interaction code.</p>

<p><strong>Tab dragging</strong> is the most delicate part. Pointer move, up and cancel drive it. The dragged tab follows the cursor while its siblings slide aside with FLIP transitions, so the strip always previews where the drop will land. On release, a command tells Rust to reorder for real.</p>

<p>One detail decides whether this feels broken. The browser still fires a <code>click</code> after a drag, so without care you drag a tab and accidentally select it. The project sets a suppression flag and clears it on the next pointer down, not on a timer. That is deterministic and does not depend on task-queue timing.</p>

<p>Smaller notes. Suggestions ask Rust for matches across history and bookmarks, at most eight and deduplicated. Themes resolve the setting plus the system flag into a final value and set one attribute on the document element, so no component knows about themes. And window control icons are injected by JavaScript, which means the SVG's CSS class must travel with the markup, or glyphs sized by that class render at their default enormous size.</p>

<h2>Core 8: nanoagent, an invisible browser</h2>

<p><code>nanoagent</code> is the same browser engine in a window that is never shown, driven by AI tools.</p>

<p>The window is created hidden, without a taskbar entry and without decorations. It uses its own WebView2 user-data directory, fully separate from the GUI profile, so automated logins and personal cookies never mix. Control goes through the in-process bridge, which means no debugging port. One-shot commands start a fresh browser each time. MCP mode keeps a single warm page across many calls.</p>

<pre><code>nanoagent --mcp                              MCP over stdio (long session)
nanoagent &lt;command&gt; [args...]                run one action and exit

navigate &lt;url&gt;                               open a URL, print {url,title}
read &lt;url&gt; [selector] [--html]               print page text (or HTML)
shot &lt;url&gt; &lt;out.png&gt;                         save a PNG screenshot
cookies &lt;url&gt;                                list cookies for that page
traffic &lt;url&gt; [limit]                        print recorded requests (redacted)
eval &lt;url&gt; &lt;js&gt;                              run JS, print the value
click &lt;url&gt; &lt;selector&gt;                       click with a trusted mouse event
fill &lt;url&gt; &lt;selector&gt; &lt;value&gt;                type into an input
wait &lt;url&gt; &lt;selector&gt; [timeout_ms]           wait for an element
</code></pre>

<p>Three implementation details, all of them earned.</p>

<p><strong>Input is real.</strong> Clicking dispatches mouse events and typing inserts text through the input domain. The page sees genuine user input rather than a scripted assignment to a DOM property, which is what defeats pages that detect automation through <code>isTrusted</code>.</p>

<p><strong>Screenshots go through screencast.</strong> WebView2 does not implement <code>Page.captureScreenshot</code>. A hidden window still composites, so the agent subscribes to the screencast stream and caches frames. The README keeps one fallback on record: if hidden windows ever stop compositing, move the window off-screen instead of setting it invisible.</p>

<p><strong>Readiness needs discipline on both sides.</strong> The worker polls for readiness up to 600 times at 50 ms intervals, because a webview must have a running event loop before it answers CDP. And while waiting for a reply it never blocks the UI thread. The reply lands in shared state and the worker waits on a condition variable. That is exactly what the bridge design buys in agent scenarios.</p>

<h2>Core 9: the MCP server and its nine tools</h2>

<p><code>--mcp</code> speaks JSON-RPC 2.0 over stdin and stdout, implements <code>tools/list</code> and <code>tools/call</code>, and reports its name as <code>nanobrowser-agent</code>.</p>

<p>The nine tools map cleanly onto what an agent needs. Navigate, read, click, fill, wait, screenshot and eval are hands and eyes. Cookies are the session. Traffic is observability.</p>

<p>The loop is deliberately plain: read a line, parse method, params and id, dispatch initialize, list or call, write the reply. Pure stdio means no network and no port, which makes the process easy for a local agent to own and easy to kill.</p>

<h2>Core 10: traffic capture and capture-time redaction</h2>

<p><code>traffic.rs</code> subscribes to network events and records requests. Its security rule is one sentence: <strong>redact at capture time, not at output time.</strong></p>

<p>The difference matters. Store first and redact later, and the plaintext secret has already sat in a log buffer where any dump can take it. Redacting at capture means the secret never entered the buffer.</p>

<p>Eighteen key substrings are matched case-insensitively, covering password, token, secret, API key, auth, cookie, session, CSRF, card, CVV, SSN and OTP. A hit becomes three asterisks in both JSON bodies and header maps. Authorization and cookie headers and form bodies follow the same rules. Bodies are truncated, the buffer holds 500 entries, and the log lives only in memory. Redaction cannot be turned off.</p>

<p>One trap sits underneath. A redirect reuses the same CDP request id, so keying records by that id lets a later record overwrite the original request and lose its body. Entries are keyed by a unique id derived from the redirect chain instead.</p>

<h2>Five security layers</h2>

<p><strong>Layer one: event origin.</strong> Each tab's init script embeds an opaque random token minted in Rust, twenty-four hex digits. A page cannot forge events for another tab because it does not know that tab's token, and Rust resolves the sender through the token rather than trusting a self-reported id. Tab identity is minted on the Rust side and injected into the page.</p>

<p><strong>Layer two: favicons are hostile input.</strong> A favicon is reported by a page and displayed by the trusted shell, so it is escaped before insertion and gets an error handler that swaps in a built-in globe. A page can never inject a URL of its choosing into the shell.</p>

<p><strong>Layer three: per-webview capabilities.</strong> Tauri capabilities are scoped by webview label. The shell gets defaults plus window control. Internal pages get defaults plus the ability to emit, which is the full application IPC. Remote pages get the ability to emit and nothing else, so a remote page can report UI events and can never call a command.</p>

<p>That last cell is the crux of the model. But it comes with a trap the README calls out. The remote capability must cover all ports. A site on a non-default port matched by no capability declaration loses every injected feature at once: shortcuts, hover state, find highlighting and favicon reporting all fail together. A configuration problem that looks like broken code is the hardest kind to diagnose.</p>

<p><strong>Layer four: no debugging socket.</strong> Neither binary passes <code>--remote-debugging-port</code>, and the DevTools WebSocket binds a random loopback port that accepts only the session id minted for the panel.</p>

<p><strong>Layer five: profile isolation.</strong> The automation browser has its own data directory, and cookies never cross between it and the human profile in either direction.</p>

<h2>Where 4.52 MB comes from</h2>

<p>Add up the earlier decisions. No rendering engine removes the largest block. The release profile is tuned entirely for size. No WebSocket library removes a dependency tree. No framework and no bundler keep UI assets near zero. And Tauri never bundles a webview, which is an order of magnitude smaller than embedding Chromium.</p>

<p>The GUI binary lands at 4.52 MB and the agent at 4.24 MB, sharing one library crate, so the protocol bridge exists once.</p>

<p>Startup follows the same logic. The launcher prefers the release binary and falls back to debug. For a shell, cold start is a window creation plus loading local HTML, with no engine to initialise.</p>

<h2>Persistence</h2>

<p>Every path derives from the executable's location, with environment overrides for tests. Runtime data, caches, downloads and the WebView2 user-data directory all stay inside the project directory and never write to the system drive.</p>

<p>The profile file holds settings, bookmarks, history capped at 500, downloads capped at 100, the session and the window geometry. Three practices are worth copying.</p>

<p>Saving is atomic: write a temporary file in the same directory, then rename over the profile, so a crash mid-write cannot corrupt it. Loads are cap-tolerant: history and downloads are truncated on read, so a hand-edited oversized file cannot exhaust memory. And window geometry is debounced, so dragging the window does not write to disk on every frame.</p>

<h2>Fourteen pitfalls that cost real time</h2>

<p>The README keeps these in their own section because they are the most valuable artefact of the project. Each one came out of a debugging session.</p>

<p><strong>Layout and z-order.</strong> Every tab is an independent window, so a later-created page covers the shell and clips menus; expand and raise the shell while a menu is open, then re-assert order after any tab change. A child webview cannot see pointer movement outside itself, so panel resizing must route the pointer through the shell. And injected window icons need their CSS classes, or class-sized glyphs render enormous.</p>

<p><strong>Concurrency and downloads.</strong> Closing tabs by index concurrently deletes the wrong neighbours, so look the tab up inside the lock. Concurrent downloads of the same URL overwrite each other when matched by URL, so reserve the path atomically.</p>

<p><strong>CDP.</strong> Waiting for a reply on the UI thread deadlocks, especially in a hidden window. A redirect reusing the request id overwrites the original record. <code>--remote-debugging-port</code> is a dead end because only the shell becomes a target. <code>Schema.getDomains</code> lists domains without event names, so a static table and lazy subscription are required. And disabling native DevTools does not disable in-process CDP, which is the reason docking works at all.</p>

<p><strong>Docked DevTools.</strong> The <code>devtools://</code> page has neither the host object nor Tauri IPC, so a popup request the app denies is the only signalling channel. A second query key fails the whole load, which pushes extra data into the fragment, and while debugging that, the reported URL lies. The splitter sits on the edge facing the page, and the drag maths is a subtraction from the window edge.</p>

<p><strong>Capabilities.</strong> A site on a non-default port matched by no declaration loses every injected feature at once.</p>

<p>Three of the fourteen are worth memorising outright. The DevTools URL rejects a second query key. Disabling native DevTools does not disable in-process CDP. And sibling webviews cannot see anything outside themselves. They are the most counter-intuitive, and the most likely to reappear in another project.</p>

<h2>Known limits</h2>

<ul>
<li>History and the new tab page still guess favicons from the host, while only bookmarks store the icon a page actually reported.</li>
<li>The panel docks bottom or right only, with no left side and no detaching into a separate window.</li>
<li>Windows only, because the stack rests on WebView2 COM interop.</li>
<li>No release pipeline beyond the installer target declared in the Tauri config.</li>
<li>No LICENSE file yet, which the README itself flags before distribution.</li>
</ul>

<h2>Verdict</h2>

<p>Three things are worth taking away, and none of them is really about writing a browser.</p>

<p><strong>Building no engine is a capability, not laziness.</strong> Most projects default to implementing whatever they need. NanoBrowser asks what the system already has, finds Chromium, and builds only the shell. That buys 4.5 MB and near-zero engine maintenance, at the cost of Windows-only. Recognising which costs are acceptable matters more than any comparison table.</p>

<p><strong>The hard part is the host's boundaries, not the features.</strong> Nearly all the complexity here comes from four invariants: sibling windows, callbacks on the UI thread without request ids, a privileged page with no conventional IPC, and a URL that rejects a second query key. Those constraints shape the architecture, and they explain the whole list of pitfalls.</p>

<p><strong>A side effect can be a signal channel.</strong> When both legitimate channels are cut, find an effect the host is guaranteed to intercept and hang the parameters on it. It is not elegant. It is correct, reliable, and needs no cooperation from the host.</p>

<p>Put the three decisions together, no engine, no debugging port, hand-written hard dependencies, and they say one thing: push reuse to its limit, and shrink the self-written surface to the part that must be written and is worth writing. A 4.5 MB browser is not the result of trimming. It is the result of choosing not to rebuild something at every fork.</p>

<h2>References</h2>
<ul>
<li><a href="https://github.com/zhoujungis/NanoBrowser" rel="noopener noreferrer" target="_blank">zhoujungis/NanoBrowser</a></li>
<li><a href="https://tauri.app/" rel="noopener noreferrer" target="_blank">Tauri 2 documentation</a></li>
<li><a href="https://learn.microsoft.com/microsoft-edge/webview2/" rel="noopener noreferrer" target="_blank">WebView2 documentation</a></li>
<li><a href="https://chromedevtools.github.io/devtools-protocol/" rel="noopener noreferrer" target="_blank">Chrome DevTools Protocol</a></li>
<li><a href="https://modelcontextprotocol.io/" rel="noopener noreferrer" target="_blank">Model Context Protocol</a></li>
</ul>

<p>Related: <a href="/en/article/nanohermes-rust-coding-agent/">NanoHermes, a Rust agent with no runtime</a> and <a href="/en/article/aidevops-terminal-client/">aidevops, an AI DevOps copilot in your terminal</a>.</p>
`,
  },
]

// 列表页、快照和 sitemap 都按这个顺序渲染：新稿在前，和中文站的列表一致。
EN_ARTICLES.sort((a, b) => String(b.date).localeCompare(String(a.date)))

export const EN_BY_SLUG = new Map(EN_ARTICLES.map((a) => [a.slug, a]))
