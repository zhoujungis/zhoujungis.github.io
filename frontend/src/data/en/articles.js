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
<blockquote>
<p>Who this is for: engineers who want desktop-grade developer tooling without leaving the terminal; people building AI features that must stay on a leash; anyone interested in how four systems of record can be joined into one traceable chain.</p>
<p><strong>TL;DR:</strong> aidevops joins requirements, commits, tests, bugs and releases into one chain, then answers four questions from it. The model layer can read everything and write nothing. Every attribution, every risk contribution and every model claim is traceable back to a record you can open.</p>
<p>Reading time around 17 minutes. Level: intermediate.</p>
</blockquote>

<p>A few days ago I put <strong><a href="https://pypi.org/project/aidevops/" rel="noopener noreferrer" target="_blank">aidevops</a></strong> on PyPI. It's the terminal client for an AI DevOps and QA copilot, and <code>pipx install aidevops</code> is the whole installation. The source is on <a href="https://github.com/zhoujungis/ai_devops" rel="noopener noreferrer" target="_blank">GitHub</a> under MIT, and the project is fully open source.</p>

<p>This post covers what problem it solves, how data moves through it, how the risk score is computed, what the model is allowed to do and why it is kept in a cage, how each command works, and what I chose not to build.</p>

<strong>Contents</strong>
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

<p>A team generates a lot of development data every day. Requirements sit in Jira, commits in GitHub, test results in CI, bugs in a defect tracker, and release records in a pipeline. All of it exists. None of it knows about the others.</p>

<p>So every developer does the same manual work, every day. Which modules did this change touch? What broke in those modules before? Do the tests cover them? If we ship this release, where is the risk concentrated? The answers are all in the system, but assembling them means opening five browser tabs, exporting three reports, and trusting your memory for the rest.</p>

<p>aidevops links that chain and answers four questions from it:</p>

<ul>
<li>Where is the <strong>risk</strong> in this commit, which module, which signal, and why;</li>
<li>What should be <strong>regression-tested</strong>, meaning the historical bugs and the candidate test list;</li>
<li>Where did this production incident <strong>most likely start</strong>, traced back to a requirement and a release;</li>
<li>After reading all of it, what does the model <strong>suggest</strong>?</li>
</ul>

<p>The terminal client exists because people who live in a terminal should not have to open a browser to read one risk report.</p>

<h2>Architecture: a thin client over a thick server</h2>

<p><code>aidevops</code> is a client. It's a CLI with a full-screen TUI, and it holds no business logic. Every capability is an HTTP call to a Django service backed by PostgreSQL, Redis and pgvector.</p>

<p>That boundary is deliberate, for three reasons.</p>

<p><strong>The data is too large for a client.</strong> Commit history, test records and bug lists run to hundreds of thousands of rows. The correlation engine, the risk model and the agents all need the complete picture. Putting that on a laptop turns the product into a demo.</p>

<p><strong>Credentials stay on the server.</strong> Git tokens and model API keys are encrypted with Fernet and stored server-side. The client holds exactly one access token, in its own config directory, with mode 0600.</p>

<p><strong>There is one set of rules.</strong> The CLI, the TUI and any future web UI read the same REST API under <code>/api/v1</code>. Logic can't drift between surfaces, because there is no second copy of it.</p>

<p>This is why installing the client alone gets you a login failure on the first step. That's the architecture, not a bug. To run the backend locally, copy <code>.env.example</code> to <code>.env</code> and run <code>docker compose up -d --build</code>, with Swagger at <code>/api/docs/</code>. Or run <code>make install &amp;&amp; make migrate &amp;&amp; make run</code> and start Celery with <code>make worker</code> and <code>make beat</code>.</p>

<p>The client stack is Typer for the command line, Textual for the TUI, Rich for output and httpx for HTTP. Pure Python, no compiled extensions, Python 3.11 and up.</p>

<h2>Getting data in: two cursors and idempotent ingestion</h2>

<p>Without data, everything downstream is an empty state. Ingestion is the least glamorous part of the system, and it has three channels.</p>

<p><strong>GitHub sync.</strong> Two cursors are maintained separately: one for new commits, one for the initial history backfill. Rate limits are handled with backoff, because hitting them is normal rather than exceptional.</p>

<p><strong>Webhooks.</strong> Pushes, CI results and issue changes arrive in real time. Two checks guard the door. An HMAC-SHA256 signature proves the request actually came from GitHub, and idempotency on the delivery id means a redelivered event can't create a second record.</p>

<p><strong>Scheduled reconciliation.</strong> Webhooks get lost when the network hiccups or the service restarts, so a Celery beat job periodically reconciles and guarantees eventual consistency.</p>

<p>Attribution and test correlation run asynchronously after ingestion completes. The trade-off is explicit: <strong>ingestion prefers slow over lost or duplicated</strong>, because every downstream calculation assumes the data is trustworthy.</p>

<h2>Pinning a commit to a module</h2>

<p>Correlation starts with a question that sounds trivial: which modules did this commit touch? It's a parsing problem in disguise. <code>src/auth/</code> clearly belongs to auth, but who owns <code>utils/date.py</code>? Should a change under <code>tests/</code> count against a business module?</p>

<p>Attribution runs in three levels, in priority order.</p>

<ol>
<li><strong>Overrides.</strong> A maintainer declares a path-to-module mapping, and that decision is final.</li>
<li><strong>Source-root inference.</strong> Without an override, the layout is read the way the language expects, taking top-level directories under <code>src/</code> or <code>lib/</code>.</li>
<li><strong>Fallback.</strong> Everything else lands in an explicit bucket rather than floating unassigned.</li>
</ol>

<p>The important half is the last sentence of the design: every attribution carries a reason you can read. "This file belongs to auth because it matched the override <code>src/auth/**</code>." Attribution isn't a guess. Risk scores and regression candidates are built on that traceable layer.</p>

<h2><code>explain</code>: everything behind one commit</h2>

<p><code>aidevops explain &lt;sha&gt;</code> is the command people try first. Give it a SHA and it returns the commit's place in the chain.</p>

<ul>
<li><strong>The requirement</strong> this change serves, or the requirement cluster it belongs to.</li>
<li><strong>Module impact</strong>: which modules changed, and how central each one is.</li>
<li><strong>Regression candidates</strong>: the tests and bugs historically entangled with those modules.</li>
<li><strong>Historical bugs</strong>: what went wrong in the same area before, and in what pattern.</li>
<li><strong>The release</strong> that contains this commit, and when its window is.</li>
<li><strong>Data gaps</strong>: which of the above has no data behind it.</li>
</ul>

<p>That last item matters more than it looks. The gap field separates "nothing was found" from "we have no data". A tool loses trust fastest by dressing ignorance as a conclusion. In a repository that never ingested test results, "no regression candidates" has to mean "unknown", not "safe". Making that distinction part of the output is the product's integrity floor.</p>

<h2>The risk engine: ten signals, each one inspectable</h2>

<p><code>aidevops risk &lt;sha&gt;</code>, and <code>aidevops module-risk &lt;id&gt;</code> for a module view, return a normalized score. The ten signals are listed with their individual contributions, and the contributions sum to the score.</p>

<table>
<thead><tr><th>Signal</th><th>What it measures</th></tr></thead>
<tbody>
<tr><td><code>change_volume</code></td><td>Lines and files changed</td></tr>
<tr><td><code>historical_bug_density</code></td><td>Bug density of the modules involved</td></tr>
<tr><td><code>test_failure_rate</code></td><td>Recent failure rate of the related tests</td></tr>
<tr><td><code>module_centrality</code></td><td>How central those modules are in the dependency graph</td></tr>
<tr><td><code>change_frequency</code></td><td>How often this area changes, which is hotspot detection</td></tr>
<tr><td><code>coverage_gap</code></td><td>Coverage on the changed paths</td></tr>
<tr><td><code>open_high_severity_bugs</code></td><td>Open high-severity bugs on those modules</td></tr>
<tr><td><code>test_coverage_gap</code></td><td>Test coverage for the module</td></tr>
<tr><td><code>release_proximity</code></td><td>Distance to the next release, because risk costs more near a cut</td></tr>
<tr><td><code>data_freshness_penalty</code></td><td>A penalty applied when the data is too old to trust</td></tr>
</tbody>
</table>

<p>Three engineering decisions sit under that table.</p>

<p><strong>Weights are configuration, not code.</strong> They live on the server and can be tuned in Django admin without a deploy.</p>

<p><strong>Weights inherit in three levels</strong>: defaults, then organization, then project. A team that ships constantly can raise the weight on release proximity. A team with weak test infrastructure can emphasize coverage gaps.</p>

<p><strong>Contributions sum to the score.</strong> That isn't decoration. It turns "I don't believe this number" into a concrete question: find the largest contributor and inspect its input. A black-box score gives you nowhere to look.</p>

<h2>The model layer: five agents, evidence checks, full tracing</h2>

<p>The model layer answers a narrower question than it sounds: given all this data, what can be automated safely?</p>

<p><strong>Providers are pluggable.</strong> Credentials are managed per organization through the provider commands, over an OpenAI-compatible protocol, with presets for DeepSeek, Qwen and Ollama. Keys are encrypted with Fernet and live on the server, exactly like the Git tokens.</p>

<p>Five agents ship with explicit input and output contracts.</p>

<table>
<thead><tr><th>Agent</th><th>What it does</th></tr></thead>
<tbody>
<tr><td>Code Impact</td><td>Analyzes the blast radius of a commit</td></tr>
<tr><td>Test Generation</td><td>Generates cases along an eleven-category scenario matrix</td></tr>
<tr><td>Bug Investigation</td><td>Builds an evidence chain around one bug</td></tr>
<tr><td>Root Cause Analysis</td><td>Works backwards from symptoms to plausible root-cause areas</td></tr>
<tr><td>Requirement Analysis</td><td>Extracts verifiable acceptance points from requirement text</td></tr>
</tbody>
</table>

<p>Start one with <code>aidevops analyse -a test-generation --wait</code>. History is in <code>analyses</code> and <code>job</code>. The trace command shows every model call and tool call behind one analysis, with timings, so the agent is never a black box.</p>

<p><strong>Findings carry citations.</strong> Anything the model says has to resolve back to real data: a commit, a bug, a test. Unresolvable references are dropped rather than shown. Triage moves each finding from open to confirmed or false positive, and that trail becomes team knowledge.</p>

<p><strong>The tool surface is closed on purpose.</strong> The model can call thirteen read-only tools, all scoped to the project. No write operation appears in its tool list. It can see the data and can't change it, which is the precondition for the next section.</p>

<h2>Proposals and audit: the model suggests, a person approves</h2>

<p>Everything the model produces is a proposal: a batch of tests, an investigation conclusion, a remediation plan. None of it takes effect on its own.</p>

<pre><code>aidevops proposals                 # pending proposals
aidevops approve &lt;id&gt;              # approve; a fixed executor runs it
aidevops reject &lt;id&gt;               # reject and discard
</code></pre>

<p>Three rules make that real. Only approval executes, and the executor is code rather than a model decision. No approval means no writes, with no implicit adoption and no "run by default, undo on objection". Everything lands in the audit log, queryable from the same client.</p>

<p>For QA the trade-off is easy to state. Tests are a line of defense, and you don't put something that acts on its own on a line of defense.</p>

<p>Multi-tenancy follows the same logic. The tenant id comes from the URL and never from the request body. Non-member access returns 404 without leaking existence, an insufficient role returns 403, and every query goes through one scoped entry point, so there is nowhere to forget the filter.</p>

<h2>Install and a five-minute tour</h2>

<pre><code>pipx install aidevops        # recommended: isolated venv, command on PATH
# or
pip install aidevops
</code></pre>

<p>Login uses the GitHub device flow. You type a code in the browser and never paste a password into a terminal. Remote machines and containers use the no-browser variant.</p>

<pre><code>aidevops login                       # GitHub device-flow login
aidevops org-add "My Team"           # first run: create an org, you become admin
aidevops projects                    # list projects, * marks the current one
aidevops use qa-copilot-platform     # select a project for later commands
aidevops status                      # backend, account and project
</code></pre>

<p>Connecting a repository is the real entry point. Skip it and <code>commits</code>, <code>risk</code> and <code>explain</code> all return empty state.</p>

<pre><code>aidevops connections                              # list Git credentials
aidevops connection-add -l my-github -t &lt;PAT&gt;     # private repos need repo read
aidevops connection-verify &lt;connection-id&gt;        # verify before using it
aidevops repo-add -c &lt;connection-id&gt; -f owner/repo  # register the repository
aidevops sync &lt;repository-id&gt; --wait              # pull history; ready when it returns
</code></pre>

<p>A connection is an organization-level credential managed by admins, and can register several repositories. A repo update adjusts the sync window and the attribution depth.</p>

<p>Upgrades go through the upgrade command. The client compares itself against PyPI on every run and warns in red when it is behind; the result is cached for 24 hours and an environment variable turns it off. One guardrail is worth calling out: the upgrade command refuses to run inside an editable checkout, because that would silently replace your working tree with the released version. It tells you to pull instead.</p>

<h2>Scripting and CI</h2>

<p>The JSON flag is global and goes before the subcommand.</p>

<pre><code>aidevops --json findings | jq '.[] | select(.severity == "critical")'
</code></pre>

<p>Two details exist for pipelines. In JSON mode the upgrade notice goes to stderr, so stdout stays clean. And setting the environment variable is equivalent to passing the flag. In CI, inject the token through the environment and point the base URL at a test backend for integration checks.</p>

<p>A realistic pipeline step: run the risk command against the commit SHA, and if the score crosses a threshold, post the regression candidates as a pull request comment.</p>

<h2>Tests, types and releases</h2>

<p>The client lives in the repository's <code>cli/</code> directory.</p>

<pre><code>python -m pytest          # 50 client tests, including Textual pilot TUI tests
python -m ruff check .
python -m mypy ai_devops_cli
</code></pre>

<p>The TUI is tested with Textual's pilot, so keystroke flows and panel switches are covered without manual clicking. The backend has 569 tests, with four network cases skipped by default, and none of them needs the internet, so CI stays fast.</p>

<p>Every multi-tenant write path funnels through one scoped query helper, which lets tests assert case by case that tenant A can't see tenant B's data.</p>

<p>Releases use tag-triggered trusted publishing. Push a tag, GitHub Actions builds, and short-lived OIDC credentials upload to PyPI. No local packaging, no long-lived token.</p>

<h2>Where it stands, and what is missing</h2>

<p>It is alpha, and the limits are worth stating.</p>

<ul>
<li><strong>It needs its own backend.</strong> The client has no standalone value; trying the full flow means running the server first, either through compose or through the local make targets.</li>
<li><strong>Single organization with multiple projects</strong> works. The cross-organization permission model is still settling.</li>
<li><strong>End-to-end testing against a real model</strong> is on the roadmap. Agent tests currently use a stub model, so the logic paths are covered and the output contract of real models isn't.</li>
<li><strong>Attribution wants one override per repository.</strong> Zero-configuration accuracy depends on how well source-root inference guesses.</li>
</ul>

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
<p>Who this is for: people who want long-running data collection on GitHub Actions without renting a server; people designing a crawl, dedupe, render, LLM pipeline; people wondering how to spread one analysis across several days on a free quota.</p>
<p><strong>TL;DR:</strong> writing crawlers was never the hard part of InterviewAtlas. Three things were: deciding what is new <em>before</em> sending the request, making writes idempotent, and turning model calls into a budgeted, cacheable two-stage pipeline. Anti-bot defenses never held it back either. Two silent failures did: a collector that swallowed exceptions, and an analysis step blocked at compile time by a Python 3.11 f-string restriction.</p>
<p>Reading time around 28 minutes. Level: advanced.</p>
</blockquote>

<strong>Contents</strong>
<ul>
<li>Origin: turning scattered interview reports into a queryable dataset</li>
<li>Architecture: one collection chain, one analysis chain</li>
<li>Data model: one record, three layers of normalization</li>
<li>Collection: three sites, three strategies</li>
<li>Incremental crawling: saving requests before deduplication</li>
<li>Storage and rendering: sharding, idempotency, write amplification</li>
<li>LLM summarization: a two-stage map-reduce</li>
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

<p>Interview reports have a short half-life. A report from the autumn 2026 hiring season is down to its process skeleton by spring, because the questions and the interviewers' style have already turned over. They are also scattered across systems that don't talk to each other: Nowcoder's forums, Juejin's columns, Mianshiya's question banks. Each has its own search, its own login wall, and site search that only answers "contains this keyword", never "what did this company ask this role recently".</p>

<p>InterviewAtlas is an attempt at that aggregation problem. Crawl three sites daily, normalize company and role, dedupe and merge by URL, render a README plus per-company-per-role Markdown, then use a model to summarize each group into four sections: interview process, high-frequency topics, representative questions, preparation advice. Everything runs on GitHub Actions. No server, no database, and model calls go through GitHub Models' free quota.</p>

<p>At the time of writing the repository holds 41,771 records, 157 companies and 1,634 company-role files. <code>data/interviews</code> contains 158 <code>.json.gz</code> files (35.9 MB) and <code>interviews/</code> holds 1,791 Markdown files (92.3 MB). The source is 22 Python files with exactly four runtime dependencies: <code>requests</code>, <code>bs4</code>, <code>lxml</code>, <code>PyYAML</code>. What follows isn't a feature list. It's the design reasoning and the holes I actually fell into.</p>

<h2>Architecture: one collection chain, one analysis chain</h2>

<p><code>src/main.py</code> contains no crawling logic. It only orchestrates. It calls each source in configured order, hands results to normalization, storage and rendering, then prints how many records were added and how long it took. The real code sits in two layers.</p>

<pre><code>src/main.py                 orchestration and timing
  ├─ sources/nowcoder.py    Nowcoder: search + detail
  ├─ sources/mianshiya.py   Mianshiya: bank list → questions
  ├─ sources/juejin.py      Juejin: deep pagination + body
  ├─ normalize.py           company/role detection, cleaning, relevance
  ├─ storage.py             merge, shard by company, write
  └─ render.py              README and per-group Markdown
src/analyze.py              separate process: reads stored data, calls GitHub Models
</code></pre>

<p>Analysis is a separate process rather than a function call after collection, for three reasons.</p>

<p><strong>Isolation.</strong> Rate limits, an exhausted quota or empty responses must not rot data that has already been collected in memory.</p>

<p><strong>Runtime.</strong> Collection takes thirty minutes, and analysis on a free quota may not finish the same day. It has to be resumable tomorrow.</p>

<p><strong>Cache.</strong> Analysis output is written to <code>analysis/</code> and committed, so it becomes repository state like the data itself, not something held in one run's memory.</p>

<p>Skipping the database comes from the same reasoning. Actions runners are ephemeral, so the only durable state is git, and 41,771 records read fully into memory are nowhere near needing an index. The price of that choice is the write amplification discussed below.</p>

<p>The orchestration layer also does something easy to overlook: it prints each source's duration separately. The daily log shows record counts and seconds for Nowcoder, Mianshiya and Juejin. That's performance telemetry and a failure signal at once. Mianshiya finishing in one second while the other two take a dozen minutes is jarring, and the contrast is itself the anomaly. With only a total runtime, a missing ten minutes hides inside thirty.</p>

<h2>Data model: one record, three layers of normalization</h2>

<p>A report is one JSON object. Few fields, but each has a job.</p>

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

<p>Normalization has three layers.</p>

<p><strong>Company aliases.</strong> <code>COMPANY_ALIASES</code> matches the longest string first, so "Alibaba Cloud" is never swallowed by "Alibaba".</p>

<p><strong>Role detection</strong> in a fixed order: backend, frontend, algorithms, testing, product, falling back to "other role".</p>

<p><strong>The fallback layer.</strong> Unknown companies and roles both land in "other", and those are excluded from LLM analysis because they can't support a meaningful summary. The final 157 companies and 1,634 company-role pairs are what survives all three.</p>

<p>The alias table looks dumb and is the precondition for the dataset being usable at all. ByteDance appears as 字节, 字节跳动 and "bytedance" depending on the site. Without normalization you get three thin sets of statistics. Yet Alibaba Cloud and Alibaba have to stay separate, or the cloud unit's roles get diluted by group-level reports. Longest-match-first solves exactly this containment problem: try the long alias, stop on a hit, and let short aliases fire only when nothing else matched.</p>

<h2>Collection: three sites, three strategies</h2>

<p>The three sites expose completely different interfaces, so the strategies differ too.</p>

<table>
<thead><tr><th>Source</th><th>Entry point</th><th>Pagination ceiling</th><th>Body text from</th></tr></thead>
<tbody>
<tr><td>Nowcoder</td><td><code>POST gw-c.nowcoder.com/api/sparta/pc/search</code></td><td>3 pages × 20 per keyword</td><td>Search truncates; detail completes</td></tr>
<tr><td>Juejin</td><td><code>search_api</code> cursor deep pagination</td><td>Pages until there is no next cursor</td><td><code>web_html_content</code> in search results</td></tr>
<tr><td>Mianshiya</td><td>Bank list → question list</td><td>Hard limit of 5 pages per query</td><td>Question stem + bank description</td></tr>
</tbody>
</table>

<p><strong>Nowcoder</strong> coverage comes from a keyword matrix: ten generic terms plus 157 companies times two templates ("company interview report", "company interview experience"). That's well over three hundred queries, each capped at three pages. It necessarily produces duplicates, but the search API offers no stable full-scan cursor, so cross-coverage through keywords is the only option. Search returns truncated bodies, so every unseen record gets one more detail request before storage. Details run on six threads with a 0.2-second per-thread interval, which keeps total runtime down without hammering the site.</p>

<p><strong>Juejin</strong> supports cursor pagination, so paging isn't the bottleneck. Body formatting is. The search API's <code>web_html_content</code> is an escaped string: quotes, newlines and backslashes each carry an extra layer, and standard JSON decoding doesn't yield usable HTML. The code contains a hand-written unescape routine that restores the string segment by segment, then hands it to the shared cleaner. No library helps here, because the payload's escaping sits on top of JSON's own escaping, and decoding twice eats legitimate backslashes in the body. It's code you only dare write once you know exactly what the platform emits.</p>

<p><strong>Mianshiya</strong> is a third shape: walk the bank list, then expand each bank into questions. The question endpoint has a hard limit of five pages per query. To get more data, the collector runs three variants per bank: no filter, <code>difficulty:1</code> and <code>difficulty:3</code>. That turns "five pages per query" into "three groups of five pages". The cost is triple the requests, with overlap between groups that needs local dedupe by question id. And it only relieves the ceiling. It doesn't remove it.</p>

<p>Anti-bot handling is uniform across all three: a Chrome/124 User-Agent, a per-site Referer, <code>Retry(total=3, backoff_factor=1.0, status_forcelist=[429, 5xx])</code>, and a global 0.5-second request interval. No browser automation and no login handling, so only publicly visible content is covered. That's the capability boundary, and the reason the sites don't block us.</p>

<h2>Incremental crawling: saving requests before deduplication</h2>

<p>Re-crawling all three sites daily is impossible. Three hundred keywords on Nowcoder, a dozen deep pages on Juejin, a thousand banks on Mianshiya: the request count alone blows the budget. The pipeline's first act is <code>load_records()</code>, which reads all history back and builds two sets: <code>known_urls</code> and <code>known_content</code>, the latter holding bodies of 300 characters or more only.</p>

<p>When the collector gets a search result, it first computes the normalized URL. A hit in <code>known_urls</code> means skip, and not even a detail request. A URL miss whose body exactly matches something in history is also skipped.</p>

<p>What this saves is the expensive detail request, not the search request. Searches still page through, but detail calls only land on new or incomplete content.</p>

<p>Merging is by URL, and <code>merge_records()</code> behaves as "old record wins, new record fills blanks". Title, source, company and role are overwritten only when missing. The body is replaced only when the new one is longer. <code>last_seen</code> refreshes every thirty days rather than daily, because otherwise every shard gets rewritten every day over one timestamp field. The returned <code>new_count</code> and <code>new_records</code> feed the README's "this run" block. Retention is <code>retention_days: 365</code>, so anything unseen for a year is dropped.</p>

<p>Deduplication happens in three layers.</p>

<p><strong>URL normalization.</strong> Strip the <code>#</code> fragment, the query string and the trailing slash, then lowercase. A shared link and a tracked link to the same post collapse into one key.</p>

<p><strong>Mianshiya's cross-bank merge.</strong> One question can be indexed by several banks. Merged by <code>external_id</code>, preferring the bank that lets us identify a company.</p>

<p><strong>Before the model sees anything</strong>, <code>_dedupe()</code> filters again on "title plus first 120 characters of body", because different sources repost the same report: different URL, near-identical content, invisible to the first two layers.</p>

<pre><code>def record_key(record: dict) -&gt; str:
    url = (record.get("url") or "").split("#")[0].split("?")[0].rstrip("/").lower()
    if url:
        return url
    source = record.get("source") or ""
    external_id = record.get("external_id") or ""
    return f"{source}:{external_id}" if (source or external_id) else (record.get("id") or "")
</code></pre>

<p>The payoff is direct. Daily runs only handle increments, and detail requests are spent only on genuinely new posts. The cost is that every run decompresses, deserializes and indexes 35.9 MB of compressed data, a fixed startup cost. One order of magnitude more data and this would need lazy per-company loading.</p>

<p>One detail decides whether "incremental" is trustworthy: the content set only accepts bodies of 300 characters or more. A very short body may be a truncation artifact, and using it as evidence of "already crawled" would permanently lock an incomplete record in place, because later visits to the same URL would never fill it in. The threshold keeps incomplete records out of the known set, leaving room for completion.</p>

<h2>Storage and rendering: sharding, idempotency, write amplification</h2>

<p>Storage is sharded by company, one <code>.json.gz</code> each rather than one big JSON. The reason is practical: GitHub caps a single file at 100 MB, and 41,771 records in one file would hit that eventually. Sharded, every file stays small and <code>_meta.json</code> holds only totals. <code>load_records()</code> reads both the legacy single-file format and the new directory format, preferring <code>.json.gz</code>, so a company is never read twice during migration.</p>

<p>Writes are idempotent in two layers. <code>_write_if_changed()</code> never writes identical content, so there is no spurious git change. And <code>gzip.compress(raw, mtime=0)</code> pins the timestamp in the gzip header, so the same content produces the same bytes. Without that, every compression differs and git reports all shards modified every day.</p>

<pre><code>raw = (json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\\\\n").encode("utf-8")
data = gzip.compress(raw, mtime=0)   # same content → same bytes, no meaningless diff
if path.exists() and path.read_bytes() == data:
    return
</code></pre>

<p>Rendering produces two things: the root README and <code>interviews/&lt;company&gt;/&lt;role&gt;.md</code>. The README is an index of companies, roles, totals, per-source statistics and "this run". The split files hold the human-readable bodies.</p>

<p>The catch is that the README is fully re-sorted daily. One new record can change company ordering, role counts and the update time, so the whole page is rewritten. The measured daily README diff is about 3,404 lines, far more than the data increment itself.</p>

<p>Write amplification is the most expensive hidden cost of this design. A daily commit is 53,614 insertions and 41,513 deletions. The weekly run with <code>--full</code> reaches 541,773 insertions and 372,746 deletions, and the initial commit was 2.03 million lines. The repository is 348 MB while the current snapshot is about 128 MB, and the difference is mostly blobs from whole-file rewrites throughout history. Git compresses. Git doesn't forget.</p>

<p>It is worth stressing how little new information those diffs contain. A few hundred new reports per day may be a few hundred lines. The remaining fifty-something thousand lines are whole sections moving because a sort position, a count or a timestamp changed. Git's diff algorithm records that as deletions plus insertions, and history grows. Idempotency can guarantee "don't write when nothing changed". It can't prevent "one thing changed, the page reshuffled".</p>

<h2>LLM summarization: a two-stage map-reduce</h2>

<p>Analysis has a threshold, <code>min_records: 20</code>. A company-role pair needs at least twenty reports to be worth summarizing, otherwise the model can only invent. Groups that qualify get a group-level report first, then group reports roll up into a role-level report. That's textbook map-reduce.</p>

<p>I deliberately didn't take the easy route of stuffing every report into one prompt. 41,771 bodies far exceed any context window, and even if they fit, cost and latency would be uncontrollable. Map-reduce splits the problem into "eight reports per company-role" and "sixteen companies per role", and both inputs stay budgetable. The cost is information loss across two truncation layers: anything the group report omitted is gone at role level.</p>

<p>The group prompt's input is selective: company, role, total count, sample time span, and at most eight samples. Half the samples are the longest bodies for high information density, half the newest for the closest match to the current process. Each is clipped to 1,200 characters and the whole block to 16,000. The prompt mandates four headings and asks the model to write "insufficient sample" rather than invent process steps, salaries or rounds.</p>

<pre><code>Requirements:
1. Use only the material provided. Do not invent company process, salary, interview rounds, or questions absent from the material. If the material is insufficient, write "insufficient sample".
2. Use level-2 headings (##) and output exactly these four sections: process and rounds, high-frequency topics, representative questions, difficulty and preparation advice.
3. "Representative questions" must be a bulleted list of 5-10 items, preserving the original wording where possible.
</code></pre>

<p>Call parameters are <code>temperature: 0.3</code> and <code>max_tokens: 1600</code>. Low temperature keeps two runs over the same material close together, which also makes cache decisions easier. 1600 tokens is enough for four sections of 400 to 800 characters and discourages drift. The clipper <code>_clip()</code> cuts on paragraph boundaries, namely newline, full stop, exclamation mark and question mark, and appends "(truncated)" so a sentence is never cut in half.</p>

<p>There are two quality guards. <code>_missing_sections()</code> checks that all four headings exist, and a missing one triggers one retry with an explicit "these four headings are mandatory" instruction. If it is still missing, there is no further retry. A note is prepended to the body saying which sections are absent, so readers know this is a degraded artifact rather than a complete report.</p>

<p>Role level is the second stage: collect each company's group reports for a role, clip each to 700 characters, allow at most sixteen companies, and skip the role entirely below three. It never looks at raw reports, only at summaries already produced. That bounds the input and avoids reading the same originals twice.</p>

<p>Sample selection has one more fallback. After taking the longest half and the newest half, if there are still fewer than eight, it keeps adding from the remaining longest records up to the cap. Small groups therefore don't end up with two or three samples just because the newest half is all short posts, and length still prioritizes information density. The three caps, eight samples, 1,200 characters and 16,000 characters, aren't arbitrary. Together they fix the per-prompt token budget, which fixes how many groups 100 calls can cover.</p>

<h2>Cache, budget and invalidation</h2>

<p>Analysis isn't recomputed every run. <code>analysis/manifest.json</code> records <code>PROMPT_VERSION</code>, the model name, and per-group counts and generation time. <code>PROMPT_VERSION</code> is currently <code>2026-10-29.1</code>. If either the prompt version or the model name changes, the whole cache is invalidated and everything is recomputed. That's blunt but correct: once the prompt changes, old reports no longer represent the current standard, and partial reuse would leave two standards in the repository.</p>

<p>A single group is recomputed after <code>refresh_after_days: 30</code>, or once its count grows by <code>max(5, 10%)</code>. The first prevents stale material. The second ensures a re-call only happens when enough new samples justify it, because for one or two new reports the benefit is below the cost.</p>

<p>Budget is the other hard constraint. The free tier is about 15 RPM, so the config is conservatively <code>rpm: 12</code>, <code>workers: 2</code> and <code>max_calls_per_run: 100</code>. A hundred calls means one day covers only part of the groups, and the rest rolls to tomorrow. Hence the budget split: <code>reserve = min(roles, max_calls // 6)</code> calls are held for role-level summaries before company groups get anything, so groups can't starve the rollups forever.</p>

<p>Failures are routed by status code.</p>

<ul>
<li><strong>429.</strong> Read <code>x-ratelimit-remaining</code>. Zero means the daily quota is gone, so throw <code>QuotaExceeded</code> and stop the whole round instead of retrying pointlessly. Non-zero means read <code>Retry-After</code> and retry after at most 60 seconds.</li>
<li><strong>403 with rate limiting in the body</strong> is treated as quota exhaustion. Other 401 and 403 cases are permission errors pointing at <code>models: read</code>.</li>
<li><strong>5xx</strong> gets exponential backoff and three attempts.</li>
</ul>

<p>The point of routing is to separate "waiting will help" from "don't try again today".</p>

<p>Cache decisions happen before the call, in this order. Read the manifest and compare prompt version and model name. Then per group compare count and generation date. Only when both pass is the group skipped. That order ensures a changed version can't accidentally reuse an old report just because the count didn't move. The manifest doubles as an observability surface: which groups were analyzed, with which model, when. No need to dig through Actions logs.</p>

<h2>GitHub Actions: an unattended pipeline</h2>

<p>Two workflows, one daily and one weekly. <code>daily.yml</code> runs on cron <code>0 1 * * *</code>, which is 09:00 Beijing time, with <code>timeout-minutes: 60</code>. <code>weekly-full.yml</code> runs Sunday at 10:00 with <code>--full --limit 150</code> and a 180-minute timeout. <code>--full</code> enables more pagination and more company query templates, and <code>--limit</code> caps detail completion per source so the weekly run doesn't drain the quota in one go.</p>

<p>Permissions are only two: <code>contents: write</code> for commits and <code>models: read</code> for GitHub Models. Credentials come from the repository's own <code>GITHUB_TOKEN</code>, with no extra secret, so forks and pull requests never get write access. Concurrency uses <code>group: interview-crawl</code> with <code>cancel-in-progress: false</code>. When daily and weekly collide they queue rather than cancel each other, because collection is idempotent but a mid-flight cancellation leaves half a dataset.</p>

<pre><code>permissions:
  contents: write
  models: read
concurrency:
  group: interview-crawl
  cancel-in-progress: false
</code></pre>

<p>The commit step first runs <code>git status --porcelain -- README.md data/ interviews/ analysis/</code> and exits 0 when there is nothing. Only when there are changes does it <code>git add</code> those four paths and commit. Note the absence of <code>git add -A</code>, which keeps temp files, logs and local config out of the repository.</p>

<p>The analysis step is marked <code>continue-on-error: true</code>, on the theory that quota or permission trouble should not block committing collected data. That decision was reasonable in itself, and it later amplified the second incident.</p>

<p>Step order matters too: collect, then analyze, then commit once. That way a failed analysis still commits collected data, whereas the reverse could end the run early and lose both. The price is that analysis shares the job with collection and its runtime stacks behind it, inside the same 60-minute timeout. Daily runs currently sit just over 30 minutes, which is enough headroom, but not a structure that can absorb unlimited new sources.</p>

<h2>Postmortem one: "0 banks, 0 records" from Mianshiya</h2>
<h3>Symptom</h3>

<p>One day's Actions run (41792215767) logged exactly two lines for Mianshiya: <code>Mianshiya: 0 banks, expanding questions</code> and <code>Mianshiya done: 0 banks, 0 records</code>. From commit <code>116976f8</code> onward those two lines appeared every day, for days.</p>

<p>More confusingly, the whole pipeline was green. No failed step, no alert, the README updated as usual, and Mianshiya still showed 1,962 records in the source statistics.</p>

<p>The investigation started from "this doesn't look right". A full bank traversal can't finish in one second, and the daily run was still thirty minutes, so the other two sources were fine and only Mianshiya was spinning idle. Scrolling back through logs showed the same two lines repeating after a specific commit. Following that commit hash landed inside the Mianshiya changes. Reading the code path, the chain was complete: request, exception, catch, <code>break</code>, return empty list. Nothing in it could ever fail the job.</p>

<h3>Cause</h3>

<p>The immediate cause was the bank-list endpoint returning a 567 Server Error. <code>MianshiyaSource.fetch()</code> wraps that request in <code>try/except Exception</code>, logs a warning and <code>break</code>s. The function continues, <code>banks</code> is empty, and <code>fetch()</code> returns an empty list. Upstream, <code>main.py</code> treats "returned an empty list" as a normal result and proceeds to merge, render and commit. Historical data is never deleted, so the README keeps reporting the old 1,962 records and nothing on the page suggests the source stopped updating.</p>

<p>The real problem is error semantics. The collector uses "empty result" to mean two completely different states: "there genuinely is nothing new today" and "this source is broken". The first should succeed. The second should fail. The code collapses them into one return value.</p>

<p>On top of that, <code>except Exception</code> swallows HTTP errors, parse errors and structural changes alike, leaving one warning line. And no assertion anywhere checks the most basic health condition: banks &gt; 0.</p>

<h3>Fix and current state</h3>

<p>As recorded, the API side has not recovered and the silent <code>break</code> is still there. So the state is: Mianshiya returns zero every day, historical data stays, and the README numbers look unchanged. This isn't fixed. It's a documented, unfixed defect.</p>

<p>Three changes should land.</p>

<p>First, stop swallowing collector exceptions. A failure on the first page of the bank list should raise <code>SourceError</code>, which <code>main.py</code> catches and marks the source failed instead of returning an empty list.</p>

<p>Second, add a minimum-output assertion per source: banks &gt; 0, questions &gt; 0, with violations recorded. "Nothing new today" should mean "request succeeded, zero new", never "request failed, so zero".</p>

<p>Third, surface per-source last-success time and current status in the README, so a dead source is visible on the page rather than buried in logs.</p>

<h3>Cost</h3>

<p>Data missed while the source was down doesn't come back by itself. Only a <code>--full</code> rerun recovers it, at far higher request volume and runtime than a daily run. The more expensive cost is trust. A pipeline that is green every day with unchanging numbers convinces both maintainer and reader that everything is fine. The later such a silent failure is found, the higher the backfill cost, and every statistic produced in between carries a known gap.</p>

<h2>Postmortem two: analysis stuck at 0/237</h2>
<h3>Symptom</h3>

<p><code>analysis/README.md</code> showed "analyzed 0/237" for a long time and <code>analysis/</code> held no company reports. The Actions step named "Analyze with GitHub Models" finished in 0 seconds as a success every time. 237 is the number of groups meeting <code>min_records: 20</code>, so the data side was fine. The analysis side had never actually started.</p>

<p>The investigation ran in reverse order: first the model, then the quota, and only then whether the code ran at all. The log had no model request, no 401, no 429, no timeout, and not even a "cache skipped" line, which matches no known call failure. Zero seconds also contradicts "walk 237 groups and check each cache".</p>

<p>Running the same code locally with <code>python -m src.analyze</code> produced the real error: a SyntaxError in the f-string inside <code>_dedupe()</code>. The error happens at import time, not runtime, which is why no runtime log line ever appeared.</p>

<h3>Cause</h3>

<p>The root cause is in <code>_dedupe()</code>.</p>

<pre><code>key = f"{title}|{re.sub(r'\\\\s+', '', (record.get('content') or '')[:120])}"
</code></pre>

<p>This line is legal from Python 3.12 and illegal on 3.11. A 3.11 f-string expression may not contain a backslash, so <code>r'\\\\s+'</code> makes the whole module fail at compile time with <code>SyntaxError</code>. The workflow pins <code>python-version: "3.11"</code>, so <code>python -m src.analyze</code> exited before the first line of business code ran.</p>

<p>Why nobody noticed takes three factors. The analysis step had <code>continue-on-error: true</code>, so a compile failure counted as an ignorable analysis exception and the job stayed green. A 0-second duration reads like "nothing needed analysis, returned fast". And locally, a newer Python runs the same line fine, so the environment difference hid the error even deeper. Stacked together, they turned one compile-time error into something that looked like an analysis that ran normally and produced nothing.</p>

<h3>Fix and current state</h3>

<p>Still unfixed. The <code>_dedupe()</code> line remains, the workflow is still 3.11, and the step still has <code>continue-on-error: true</code>. Either fix works: move the workflow to 3.12, or hoist the <code>re.sub</code> out of the f-string.</p>

<pre><code>normalized = re.sub(r"\\\\s+", "", (record.get("content") or "")[:120])
key = f"{title}|{normalized}"
</code></pre>

<p>But that one line isn't enough. The intent of <code>continue-on-error</code>, which isn't losing data when the model is down, should stay. What must change is that failure can't disappear as "0 seconds, success".</p>

<p>A sturdier shape is to split analysis into its own job, commit collected data regardless, and mark the job red with the reason in the summary. Or read <code>steps.analyze.outcome</code> in the same job and emit an annotation on failure. The rule: failure is allowed, invisibility isn't.</p>

<h3>Cost</h3>

<p>Not a single call for 237 groups was sent, so no quota was consumed. But the core "LLM summary" feature effectively didn't exist, and the README showing 0 made readers think the data didn't meet the threshold.</p>

<p>The subtler cost is debugging time. Zero seconds, no logs and no artifacts all point at "there was no work to do", while the truth was one layer down: the code never loaded. When a step is wrapped in <code>continue-on-error</code>, the failure signal decays in exactly the direction you least want.</p>

<h2>Problem list: truncation, dirty characters, duplicates</h2>
<h3>Truncated bodies from the search API</h3>

<p><strong>Symptom.</strong> Some reports land with only one or two hundred characters ending in an ellipsis, and some posts vanish from results entirely.</p>

<p><strong>Cause.</strong> Nowcoder's search API returns abstracts, not full text. Only the detail endpoint has the body. Normalization has <code>_is_truncated()</code>, which treats "under 300 characters and ending in an ellipsis" as a crawl failure and drops it. That heuristic blocks most broken records, and it also misfires on genuinely short posts that happen to end with an ellipsis.</p>

<p><strong>Fix.</strong> For unseen records, make one detail request and decide after fetching the full body. For records already seen, the content set skips them, so there is no repeat request. The mechanism is live: the daily run makes 2,900+ detail requests in 18 minutes 46 seconds, and that is where most of the time goes.</p>

<p><strong>Cost.</strong> "Short but complete" content may still be dropped, with no separate counter. It's an invisible loss.</p>

<h3>The same post collected three times</h3>

<p><strong>Symptom.</strong> One report appears several times, company-role counts inflate, and the model sees duplicated samples.</p>

<p><strong>Cause.</strong> Three of them. The keyword matrix overlaps by design. Share links carry <code>#</code>, query parameters and trailing slashes. And Mianshiya indexes one question in several banks.</p>

<p><strong>Fix.</strong> The three-layer dedupe above: URL normalization, cross-bank merge by <code>external_id</code>, and a title-plus-120-characters filter before the model.</p>

<p><strong>Cost.</strong> Over-aggressive normalization can merge pages whose query parameters genuinely distinguish content, and the title-plus-opening heuristic can merge two reports that share an opening but diverge later.</p>

<h3>Invisible characters</h3>

<p><strong>Symptom.</strong> Bodies contain <code>&amp;nbsp;</code>, zero-width spaces and runs of blank lines, and sentences are glued together by <code>&lt;br&gt;</code>.</p>

<p><strong>Cause.</strong> All three sites return HTML fragments or rich text, mixing tags, entities and platform-injected invisible characters.</p>

<p><strong>Fix.</strong> A single <code>clean_content</code>: convert <code>&lt;br&gt;</code> and <code>&lt;/p&gt;</code> into newlines, run <code>html.unescape</code>, strip <code>\\\\u200b</code> and <code>\\\\xa0</code>, then collapse whitespace.</p>

<p><strong>Cost.</strong> Cleaning order is sensitive. Unescape before stripping tags turns text that was meant to be visible into real tags and deletes it. Cleaning also happens before dedupe, so changing the rules changes both content hashes and dedupe results.</p>

<h2>Problem list: 100 MB, quota, a source going dark</h2>
<h3>A single file approaching 100 MB</h3>

<p><strong>Symptom.</strong> Early on all records lived in one JSON. As counts grew, the file approached GitHub's 100 MB per-file hard limit, past which pushes are rejected outright.</p>

<p><strong>Cause.</strong> Not only current size but git history. Every whole-file rewrite leaves a new blob, so the repository grew far faster than the data.</p>

<p><strong>Fix.</strong> Sharding by company into 158 <code>.json.gz</code> files totalling 35.9 MB, reading the legacy single file, and deleting shards for companies that no longer exist.</p>

<p><strong>Cost.</strong> 158 files opened per run, slug collisions need a digest suffix, and the shard add and remove logic is itself a new failure surface.</p>

<h3>The hard edge of a free quota</h3>

<p><strong>Symptom.</strong> Analysis stops halfway and later groups never get results. Occasionally 429s repeat and retries do nothing.</p>

<p><strong>Cause.</strong> GitHub Models' free tier is roughly 15 RPM, and 237 groups far exceed a single day's budget.</p>

<p><strong>Fix.</strong> <code>max_calls_per_run: 100</code>, <code>rpm: 12</code>, <code>workers: 2</code>, 429 handling through <code>Retry-After</code> and <code>x-ratelimit-remaining</code>, a 403 rate-limit response raising <code>QuotaExceeded</code> to stop the round, and <code>reserve = min(roles, max_calls // 6)</code> holding quota for rollups.</p>

<p><strong>Cost.</strong> A complete analysis spans several days. The "company groups first, rollups later" order means new roles lag forever. The split prevents starvation, not unfairness.</p>

<h3>Turning off a source means deleting its history</h3>

<p><strong>Symptom.</strong> PracHub is mostly foreign companies while the config has <code>exclude_foreign_companies: true</code>, so most of what it returned was filtered out. Poor value for the request cost.</p>

<p><strong>Cause.</strong> The source no longer matched the goal.</p>

<p><strong>Fix.</strong> <code>prachub: enabled: false</code> plus <code>exclude_sources: [prachub]</code>, and the next run drops its history per the dropped list.</p>

<p><strong>Cost.</strong> Irreversibility. Once deleted, re-enabling means crawling from scratch, and old links may already be dead. It's a straight trade between data assets and running cost, with no both-ways option.</p>

<h3>Three things still unresolved</h3>

<p>First, there is no robots.txt check. Collection covers only public content and is rate-limited, but "are we allowed to crawl this" was never verified in code. That's an explicit compliance gap.</p>

<p>Second, Juejin requests carry no signature parameters. They work today, but the day the API requires signing they will fail again, and that failure will very likely present as "0 records", re-enacting Mianshiya's silent failure.</p>

<p>Third, the README derives its last-update time from file mtime, and Actions always checks out fresh, so unchanged files all get the same timestamp. The "updated at" readers see isn't real. All three are open items, not decorations on a to-do list.</p>

<h2>Measured numbers and known limits</h2>

<p>A daily run measures 30 minutes 08 seconds. Nowcoder takes 18:46 for 12,945 records and 2,900+ details. Mianshiya takes 1 second, the zero described above. Juejin takes 10:46 for 3,924 search results and 3,333 bodies. The weekly run takes 24:48, shorter than daily, mainly because <code>--limit 150</code> caps detail completion. Timeouts are 60 and 180 minutes, so both have more than double the headroom they need. The real risk is API change and quota, not duration.</p>

<p>The breakdown shows the bottleneck. Nowcoder accounts for over 60% of runtime, almost all of it those 2,900+ detail requests. Juejin fetched 3,333 bodies in just over ten minutes because its search API returns full text, so far fewer detail calls are needed. That's exactly why the incremental design must prioritize saving detail requests: search paging is a fixed cost, and details scale linearly with new records.</p>

<p>Three judgments.</p>

<p>First, the architecture holds under its constraints of zero server, free quota and one run a day. Incremental checks eliminate most detail requests, idempotent writes avoid meaningless commits, and the two-stage analysis turns an unfinishable job into a resumable one.</p>

<p>Second, its weakest point isn't anti-bot defense but the way failure is expressed. A dead source or a compile failure can both leave the pipeline green.</p>

<p>Third, the repository will keep growing. The full README re-sort and the history of whole-file rewrites are the main sources, so either accept it or make rendering incremental.</p>

<p>If work continues, the priority is: fix the f-string and the workflow version so analysis actually runs; add health assertions and last-success times per source; only then robots.txt, Juejin signing and the mtime correctness issues. Collection volume is no longer the bottleneck. Visibility is.</p>

<h2>Closing</h2>

<p>InterviewAtlas is a long-running data pipeline held up by four dependencies, two workflows and one git repository. Its design compresses into four sentences: decide what is new before sending the request; dedupe in three layers at three different stages; pin the gzip timestamp to buy idempotency; version the manifest and budget the calls to buy control.</p>

<p>The holes it fell into are worth more than the features. Mianshiya's zero shows that "empty result" can't mean both success and failure. The 0/237 shows a compile-time error can be dressed up as normal operation by <code>continue-on-error</code>. Truncation, duplicates and dirty characters show every cleaning heuristic has collateral damage. Write amplification shows the storage cost of a git repository lives in history, not in the snapshot.</p>

<p>Neither of the two worst problems is fixed. Mianshiya's API has not recovered and the silent <code>break</code> remains. The f-string-and-3.11 combination remains, and 0/237 won't become 237/237 on its own. Writing the fix down plainly is more honest than claiming it is solved.</p>

<p>If I started again, I would write "failure is visible" before writing collection. Every source needs three distinct states: success, failure, zero output. And every background step's exit code must reach the summary instead of being flattened by <code>continue-on-error</code>. Most pipeline incidents aren't "we could not fetch". They are "we could not fetch and nobody knew".</p>

<h2>Further reading</h2>
<ul>
<li><a href="/en/article/nanohermes-rust-coding-agent/">NanoHermes: a Rust agent with zero runtime</a>, another "minimal dependencies, bounded output" trade-off worth comparing with this post's budget and clipping design.</li>
<li><a href="/article/agent-loop-two-hundred-lines/">The essence of an agent: a two-hundred-line loop</a>, a different kind of loop, starting from the smallest implementation.</li>
<li><a href="/article/agent-evaluation-not-a-benchmark/">Agent evaluation: a single run isn't a test</a>, useful when generated reports themselves need a quality judgment.</li>
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
<p>Who this is for: Go and frontend developers building single-file Windows desktop apps; anyone weighing a WebView2 shell or planning to hand-write a Markdown parser; engineers who care about binary size, startup time, save semantics and the security boundary.</p>
<p><strong>TL;DR:</strong> MicroMD fits a 3.17 MiB exe, a dependency-free HTML interface and a hand-written Markdown parser into one process. The small size isn't the interesting part. Four trade-offs are: leaning on the system WebView2, hosting the UI on <code>file://</code>, connecting native and JavaScript with exactly three bindings, and a two-pass parser that protects both escaping and placeholders. Seven problems remain open, each with its cost spelled out below.</p>
<p>Reading time around 30 minutes. Level: advanced.</p>
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

<p>A 3 MB single-file Markdown reader sounds like compressing something that was never big. Markdown isn't the hard part. A parser for headings, lists and tables can be short. The hard part is the Windows desktop shell: windows, DPI, icons, the WebView2 runtime, file permissions, and the distribution problem behind "double-click and it works".</p>

<p>MicroMD answers by externalizing as much cost as possible. No bundled rendering engine, just the system WebView2. No UI framework, just one HTML file. No Markdown library, just a hand-written parser of a couple hundred lines of JavaScript. The native layer stays down to window creation, three bindings and argument parsing. The result is one exe, unzip and run, writing only to its own app-data directory, installing no service and needing no network.</p>

<p>Boundaries first, though. It isn't cross-platform. Heavy Win32 usage and the WebView2 dependency pin it to Windows 10 and 11. It isn't a complete editor either: no syntax highlighting, no sidebar outline, no file watching, no recent-file list. Those aren't roadmap items. They are the current state.</p>

<p>Get the size right too. The stripped release build is 3,323,392 bytes, meaning 3.17 MiB or about 3.32 MB decimal. Unstripped, it is 4,943,872 bytes, so <code>-s -w</code> saves 32.8%. "3 MB" in the title describes an order of magnitude, not an exact 3.00 MB.</p>

<p>This post follows the implementation order: the shell and the disk writes, then the three bindings and the parser, then the seven exposed problems one at a time.</p>

<h2>One exe and its native shell</h2>

<p>What is actually inside? No Chromium is bundled, so "3 MB" means 3 MB of shell plus an engine that is already on the system. It doesn't mean a 3 MB browser. The shell has five layers.</p>

<table>
<thead><tr><th>Layer</th><th>Implementation</th><th>Verified fact</th></tr></thead>
<tbody>
<tr><td>Native shell</td><td>Go plus <code>github.com/jchv/go-webview2</code></td><td>Three direct Go modules, all three mislabeled <code>// indirect</code> in <code>go.mod</code></td></tr>
<tr><td>Interface</td><td>A single <code>web/index.html</code></td><td>29,520 bytes, zero JavaScript libraries</td></tr>
<tr><td>Rendering engine</td><td>Microsoft Edge WebView2, installed by the system</td><td>Not shipped with the exe</td></tr>
<tr><td>Icon and version resource</td><td>A <code>.syso</code> file produced by <code>go-winres</code></td><td>The <code>.syso</code> is gitignored. Skip generating it locally and the app has no icon</td></tr>
<tr><td>Packaging</td><td><code>//go:embed</code></td><td><code>main.go:18</code> compiles the HTML into the binary</td></tr>
</tbody>
</table>

<p>The native entry point is short. <code>main.go</code> initializes DPI, computes the app-data directory, writes the embedded HTML to disk, parses command-line arguments, then creates a window and calls <code>Run()</code>. The window comes from <code>webview2.NewWithOptions</code> with only a few parameters: title <code>MicroMD</code>, size from <code>windowSize()</code>, <code>IconId: 1</code>, <code>Center: true</code>, and <code>DataPath</code> pointing at <code>%LOCALAPPDATA%\\\\MicroMD\\\\webview</code>. <code>Debug: false</code> turns off the default context menu and DevTools, which makes this a release configuration rather than a development one. Window style comes from <code>go-webview2</code>'s defaults. The comment says <code>WS_OVERLAPPEDWINDOW</code>, so there is no custom title bar and no native menu bar. Appearance is entirely the system's.</p>

<p>That choice saves work and hard-codes limits. Without a custom title bar there is no drag region of your own, and no window shadow to adapt. Without a menu bar, every action has to live in HTML buttons and keyboard shortcuts. Pointing <code>DataPath</code> at the app directory keeps the WebView2 cache, cookies and localStorage inside <code>%LOCALAPPDATA%\\\\MicroMD\\\\webview</code>, so it never pollutes another browser profile and uninstalling is deleting a directory. The cost is that this directory grows with use and nothing cleans it up.</p>

<p>One easily missed detail: when <code>NewWithOptions</code> returns <code>nil</code>, <code>main</code> calls <code>openExternal(page)</code> to open the same page in the default browser, then returns. That path is the fallback for a missing WebView2 runtime and gets its own section later. Note that not every initialization failure returns <code>nil</code>. Some error paths inside <code>go-webview2</code> call <code>log.Fatal</code> directly, so the fallback covers window creation failure, not all startup failures.</p>

<h2>Why the interface is written to disk first</h2>

<p><code>//go:embed web/index.html</code> compiles the 29,520-byte interface into the binary. The code then doesn't call <code>NavigateToString</code>. It writes the file out and navigates with <code>file://</code>. Startup order:</p>
<ol>
<li><code>appDataDir()</code> reads <code>LOCALAPPDATA</code> and builds <code>%LOCALAPPDATA%\\\\MicroMD</code>. On failure it falls back to <code>os.UserCacheDir()</code>, then to the relative path <code>MicroMD</code>.</li>
<li>Append <code>app\\\\index.html</code> and call <code>os.MkdirAll(appDir, 0o755)</code>.</li>
<li>Read the existing file and compare it with <code>indexHTML</code>. Only on a read failure or a difference does it call <code>os.WriteFile(page, indexHTML, 0o644)</code>.</li>
<li>Call <code>view.Navigate(fileURL(page))</code>, where <code>fileURL</code> uses <code>net/url</code> for drive letters, slashes and escaping.</li>
</ol>

<p>Why not navigate from a string? The benefits are observable. The page gets a stable <code>file://</code> origin, which is what lets localStorage persist per origin. <code>&lt;input type="file"&gt;</code>, the File System Access API and relative resource resolution all behave like they do on an ordinary page. And there is no custom scheme to register and no local HTTP server.</p>

<p>That last point matters most. A local port brings port conflicts, firewall prompts and the "is this thing online?" question, while one of the project's selling points is that rendering is entirely local.</p>

<p>The write policy is "rewrite only when the bytes differ", not every launch. The good part: upgrades update the UI, and a normal launch costs one 29,520-byte read. The bad part: if a user hand-edits <code>%LOCALAPPDATA%\\\\MicroMD\\\\app\\\\index.html</code>, the next launch overwrites it. There is no "use an external UI" switch, deliberately.</p>

<p>Two silent failure points sit on this path. A <code>MkdirAll</code> failure returns immediately, and so does a <code>WriteFile</code> failure. Neither shows a dialog, so the user sees "double-click does nothing". Under normal permissions this almost never happens. With an antivirus lock, a full disk or an unwritable <code>LOCALAPPDATA</code>, there is nothing to diagnose from. That's the direct cost of one file and no installer: no setup program checks directory permissions for you.</p>

<h2>Three bindings and the meaning of "save"</h2>

<p>Native and JavaScript share exactly three bindings, all plainly named.</p>

<table>
<thead><tr><th>Binding</th><th>Native behavior</th><th>Return</th></tr></thead>
<tbody>
<tr><td><code>micromdLoad</code></td><td>If a file path came on the command line, read it and <code>json.Marshal</code> it into <code>{name, content}</code></td><td>Empty string when there is no file</td></tr>
<tr><td><code>micromdSave</code></td><td>If <code>docPath</code> is non-empty, <code>os.WriteFile</code> it back</td><td><code>ok</code> on success, the error <code>no file</code> without a path</td></tr>
<tr><td><code>micromdOpenExternal</code></td><td>Accept only <code>http://</code>, <code>https://</code> and <code>mailto:</code> prefixes, then call <code>ShellExecuteW</code></td><td><code>ok</code> when accepted, empty otherwise</td></tr>
</tbody>
</table>

<p><code>micromdLoad</code> is economical. It returns no path, only a filename and content. The frontend sets <code>app.native = true</code> when it receives JSON, so <code>Ctrl+S</code> calls <code>micromdSave</code>. <code>micromdSave</code> takes no path argument and honors only the <code>docPath</code> parsed at startup. When the frontend calls it with no native file, the native side rejects it with <code>no file</code>, which is one layer of defense.</p>

<p>The real semantic fork is in the frontend. <code>native</code> is true in exactly one case: a file path on the command line, or a <code>.md</code> dropped on the exe icon, which Windows also presents as an argument. Every other way of opening a document goes through <code>setDocument(file, handle)</code>, whose first act is <code>app.native = false</code>. Saving therefore has three paths.</p>
<ul>
<li>A native file. <code>micromdSave</code> writes back to the original path and shows "saved to filename".</li>
<li>The file picker. If <code>showOpenFilePicker</code> exists, keep the <code>FileSystemHandle</code> and write through <code>createWritable()</code>. The toast says "saved to handle.name".</li>
<li>A file dropped into the window or loaded through the <code>&lt;input type="file"&gt;</code> fallback. There is neither a native path nor a writable handle, so saving degrades to a Blob download and says "exported filename".</li>
</ul>

<p>The downgrade is explicit in <code>saveFile()</code>.</p>

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

<p>One detail deserves credit. <code>setDocument</code> resets <code>native</code> every time a new file is opened. Open <code>A.md</code> from the command line and the native <code>docPath</code> points at A. Then open <code>B.md</code> through the picker. Without the reset, <code>Ctrl+S</code> could write B's content into A. The code ties "can this document be written natively" to "which document this is", which avoids the most dangerous class of mis-write.</p>

<p>The cost is three meanings for one shortcut. The same <code>Ctrl+S</code> means "overwrite the original", "overwrite the picker file" or "download a copy", depending on how the document was opened. The README documents the rules. The UI distinguishes only "saved" from "exported" in a toast, and never warns at open time that this file won't be written back. That's not an implementation error but a gap between the safety model and user expectation, covered below.</p>

<h2>A hand-written parser: two passes and a block state machine</h2>

<p>The parser sits between <code>/* md:start */</code> and <code>/* md:end */</code> in <code>web/index.html</code>, roughly lines 166 to 412. No marked, no markdown-it. It implements <code>inline()</code> and <code>blocks()</code> itself. The interesting part is <code>inline()</code>'s two-pass design, because it solves two seemingly contradictory problems at once: Markdown syntax must still be recognized, and the source must never inject HTML.</p>

<p>The first pass isn't parsing but hiding. Code spans, autolinks and backslash escapes are replaced with placeholders of the form <code>\\\\u0001</code> plus a number plus <code>\\\\u0001</code>, and the matching HTML goes into a <code>stash</code> array.</p>

<pre><code>const stash = [];
const put = (html) =&gt; '\\\\u0001' + (stash.push(html) - 1) + '\\\\u0001';
t = t.replace(/(\\\`+)([\\\\s\\\\S]*?)\\\\1/g, (m, ticks, code) =&gt;
  put('&lt;code&gt;' + esc(code.replace(/^ ([\\\\s\\\\S]*?) $/, '$1')) + '&lt;/code&gt;'));
t = t.replace(/&lt;((?:https?:\\\\/\\\\/|mailto:)[^\\\\s&lt;&gt;]+)&gt;/g, (m, url) =&gt;
  put('&lt;a href="' + esc(url) + '"&gt;' + esc(url) + '&lt;/a&gt;'));
t = t.replace(/\\\\\\\\([\\\\\\\\\\\`*_{}\\\\[\\\\]()#+\\\\-.!&gt;~|])/g, (m, ch) =&gt; put(esc(ch)));
t = esc(t);
</code></pre>

<p>The second pass escapes everything. <code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code> and <code>"</code> become entities. The third pass recognizes images, links, bare URLs and emphasis on the escaped text, then restores the placeholders.</p>

<p>The order is the point. Escape first and backticks inside code spans plus brackets inside links get mangled by entities, which breaks syntax recognition. Recognize first and the <code>&lt;a&gt;</code> and <code>&lt;img&gt;</code> you emitted get escaped as if they were user input. Placeholders move "HTML that must survive" out of the text temporarily, so <code>esc</code> only touches real user text, and put it back afterwards.</p>

<p><code>blocks()</code> is a line-by-line state machine. It normalizes newlines and expands tabs to four spaces, then loops with priority dispatch: fenced code, horizontal rule, heading, blockquote, table, list, and finally a paragraph. Each block type has its own boundary rules.</p>
<ul>
<li>Fenced code records the number of backticks or tildes. Only a closing line with the same character and at least the same length ends it. The body gets <code>esc</code>aped wholesale, and the language becomes <code>class="language-xxx"</code>.</li>
<li>Headings match <code>^ {0,3}(#{1,6})</code>. The <code>id</code> strips tags and punctuation, then turns whitespace into hyphens. Repeated headings produce repeated ids.</li>
<li>Blockquotes strip the <code>&gt;</code> prefix from consecutive lines and recurse into <code>blocks()</code>, so lists and code fences work inside quotes.</li>
<li>Tables split the header row, read the separator row for alignment, and split body rows on <code>\\\\|</code> with a negative lookbehind, so escaped pipes aren't column boundaries.</li>
<li>Lists record the first item's indent and ordered or unordered type, absorb deeper-indented lines into the current item, and recurse <code>blocks()</code> per item, which is what makes nesting work. Task items match <code>^\\\\[([ xX])\\\\][ \\\\t]+</code> and render a disabled checkbox.</li>
</ul>

<p>Paragraphs join consecutive non-blank lines with <code>&lt;br&gt;</code> rather than CommonMark's soft-break-to-space. That's a deliberate choice, not a bug. In a local reader, an author's line break usually means they want a visible break. It also means the output isn't strictly CommonMark, so the same Markdown copied elsewhere may have different paragraph shapes.</p>

<p>There is no syntax highlighting. <code>class="language-xxx"</code> is left for future or external styles, and no color rules exist. There is no sidebar outline either. Heading ids are generated, but nothing scans them into navigation. The block machine is line-oriented with no AST, so complex nesting, cross-line emphasis and extreme list and table combinations are covered by rules rather than automated tests. The repository contains no <code>*_test.go</code>, so parser quality rests on manual samples.</p>

<h3>Security boundary: escape before parsing</h3>

<p>The parse order is the first boundary. A <code>&lt;script&gt;</code>, an <code>&lt;iframe&gt;</code> or an <code>onerror=</code> in the source passes through <code>esc</code> and appears as text instead of entering the DOM. The second boundary is <code>safeUrl()</code>: before building an image or a link, it checks for <code>javascript:</code>, <code>vbscript:</code> or <code>data:text/html</code> prefixes, and on a hit it renders the original text escaped.</p>

<p>The third is click interception. Ordinary links and bare URLs in the preview carry <code>target="_blank"</code> and <code>rel="noreferrer noopener"</code>. A capture-phase handler allows only <code>http(s)</code> and <code>mailto</code>, calls <code>preventDefault()</code>, then hands off to <code>micromdOpenExternal</code>. The native side applies the prefix allowlist again before <code>ShellExecuteW</code>. <code>Debug: false</code> removes DevTools and the context menu, which narrows the ways to poke at the page from inside the app.</p>

<p>These layers block ordinary script injection, with two caveats worth stating. First, remote images aren't disabled. An <code>https://</code> image in the Markdown will still be fetched. "Rendering is local, no network" means the app itself needs no network, not that remote resources inside a document never load. Second, <code>safeUrl</code> blocks only three dangerous schemes. Other schemes and relative paths pass through, and relative links under <code>file://</code> resolve against the current page's base, which is exactly the image-path problem below. Note also that ordinary links and bare URLs get <code>target</code> and <code>rel</code>, while the angle-bracket autolink branch doesn't. It's still intercepted on click, and the real boundary remains the native allowlist.</p>

<h2>Problem one: missing WebView2 and the browser fallback</h2>

<p><strong>Symptom.</strong> On a Windows machine without the WebView2 runtime, double-clicking the exe opens no app window. Instead the default browser opens showing what still looks like MicroMD, except "save" becomes a download and native write-back is gone. <code>micromd.bat</code> offers another route: try Edge, then Chrome, then the system default browser with <code>--app</code> on <code>web/index.html</code>.</p>

<p><strong>Cause.</strong> The whole rendering layer depends on the system-installed WebView2 Runtime. Most Windows 10 and 11 installs have it. LTSC, slimmed images and some managed enterprise fleets may not. When window creation inside <code>webview2.NewWithOptions</code> fails, it returns <code>nil</code> and leaves <code>main</code> with <code>openExternal(page)</code> as the only fallback. In that mode <code>typeof window.micromdLoad</code> isn't a function, <code>micromdSave</code> doesn't exist, and saving degrades. The batch file also depends on <code>web/index.html</code> in the source tree, while the release ships only an exe, so it helps people who cloned the repository and not end users.</p>

<p><strong>Fix.</strong> The native layer detects <code>nil</code> and opens the already-written page through <code>ShellExecuteW</code>. The README documents "no runtime, open it in a browser". The batch file tries Edge, Chrome, then the default browser to reuse whatever Chromium exists. The frontend needs no branch for these modes, because it already treats native bindings as optional.</p>

<p><strong>Cost and leftovers.</strong> The two modes have different capabilities, and the UI gives almost no indication which one you are in. Browser mode has no native window, no icon, no direct write-back, and draft localStorage depends on the browser's <code>file://</code> policy. The code never says "please install WebView2" and offers no install link. The fallback covers only window creation failure. Some initialization errors call <code>log.Fatal</code> inside the library, so the process exits silently. The essence of the problem: externalizing the engine buys size, and the price is a runtime you don't control.</p>

<h2>Problem two: relative image paths resolve against the wrong base</h2>

<p><strong>Symptom.</strong> A document containing <code>![shot](images/shot.png)</code> renders fine elsewhere and shows a broken image in MicroMD. The URL resolves to <code>%LOCALAPPDATA%\\\\MicroMD\\\\app\\\\images\\\\shot.png</code> instead of <code>images\\\\shot.png</code> next to the Markdown file.</p>

<p><strong>Cause.</strong> The page is navigated from the app directory over <code>file://</code>, so the browser's relative base is the directory holding <code>app/index.html</code>. The parser puts <code>src</code> into <code>&lt;img&gt;</code> verbatim. No <code>&lt;base href="..."&gt;</code> is injected and no rewrite against the document path happens. The native binding returns only a filename and content, never a directory, so the frontend could not rewrite even if it wanted to. In command-line mode the native side knows <code>docPath</code>. It simply never passes it to the page.</p>

<p><strong>Fix.</strong> Not fixed in the current version. Workarounds exist: absolute paths such as <code>file:///C:/docs/images/shot.png</code>, or images embedded as <code>data:</code>. Both pass <code>safeUrl</code> and load in WebView2. But absolute paths destroy portability and <code>data:</code> balloons the file, so neither is general.</p>

<p><strong>Cost and leftovers.</strong> This is the direct side effect of writing the UI to disk. Fixing it means returning a directory from <code>micromdLoad</code> and rewriting relative <code>src</code> into absolute <code>file://</code> URLs after render, or injecting a <code>&lt;base&gt;</code> computed from the document directory. The first has to handle URL encoding, drive letters, <code>..</code> and mixed slashes. The second affects every relative URL on the page, links included.</p>

<p>Worse, dropping a file into the window and the file picker never expose a full path for security reasons, only a File object. The same document therefore behaves differently depending on how it was opened. That's why this stays a known limit rather than a fixed item.</p>

<h2>Problem three: full re-render and large-file throttling</h2>

<p><strong>Symptom.</strong> Typing into a long document keeps the cursor moving while the preview stutters. The longer the document, the more obvious the lag. Scrolling sometimes desynchronizes preview and editor.</p>

<p><strong>Cause.</strong> <code>render()</code> has one line of core logic: <code>preview.innerHTML = MD.render(editor.value)</code>. Every keystroke re-parses the entire document and replaces the whole preview tree's HTML string. No incremental parsing, no DOM diff, no worker. <code>scheduleRender()</code> only merges several keystrokes inside one frame via <code>requestAnimationFrame</code>. It merges call counts, not work. Parsing and layout still run on the main thread at full-document scale.</p>

<p><strong>Fix.</strong> There is a threshold, <code>BIG_DOC = 200000</code>. Above 200k characters, <code>scheduleRender()</code> drops <code>requestAnimationFrame</code> for a 150 ms <code>setTimeout</code>, roughly six or seven renders per second. Below it, everything renders every frame. That's a very cheap degradation: no worker, no incrementality, just a coarser cadence.</p>

<p><strong>Cost and leftovers.</strong> The threshold is character-based and doesn't map cleanly to parse cost. A 199k-character document still renders every frame. At 201k it suddenly slows, so the experience is discontinuous across the boundary. The 150 ms is fixed and doesn't adapt to document size or machine speed. On longer documents a single parse can exceed 150 ms, so throttling reduces frequency but not the length of each stall.</p>

<p>Replacing <code>innerHTML</code> also loses the preview selection, reloads images and changes scroll height abruptly. Scroll sync computes <code>scrollTop</code> proportionally and goes wrong when heights jump. A real fix needs incremental parsing, virtualized lists or at least a worker, and all of those raise code size and state-management cost, against the project's size goal.</p>

<h2>Problem four: draft quota and an unused MAX_DRAFT</h2>

<p><strong>Symptom.</strong> The README claims "very long drafts aren't written to local storage", but <code>MAX_DRAFT = 1000000</code> is declared and referenced nowhere. Actual behavior: every keystroke tries to write localStorage, failures are swallowed by <code>try/catch</code>, the UI says nothing, and the draft may already be gone when the window closes.</p>

<p><strong>Cause.</strong> <code>saveDraft()</code> runs 400 ms after typing stops and calls <code>store.set('draft', editor.value)</code> and <code>store.set('name', app.name)</code>. <code>store.set</code> is <code>try { localStorage.setItem(...) } catch (e) {}</code>, so quota errors, private-mode restrictions and serialization failures never surface. <code>MAX_DRAFT</code> was probably meant for a "skip when over the limit" branch that never got wired up.</p>

<p>localStorage quota is typically a few MB per origin depending on the browser and its <code>file://</code> policy. Writing the whole document as one string over and over means <code>setItem</code> throws past the quota, and the draft freezes at the last successful version.</p>

<p><strong>Fix.</strong> No real oversize protection exists, only "exceptions aren't fatal". Straightforward options: check <code>editor.value.length &gt; MAX_DRAFT</code> in <code>saveDraft()</code>, skip and toast once; move drafts to IndexedDB; or, in native mode, write a draft file into the app directory. All three are more honest than an empty catch.</p>

<p><strong>Cost and leftovers.</strong> Users are promised automatic draft saving and get best-effort saving. The 400 ms debounce resets on every keystroke, so a write happens only after a pause. Type for ten minutes and lose power, and everything since the last successful write is at risk. When a native file has unsaved changes, the draft is the only recovery path, which makes "opened from the command line, edited, never saved" the most dangerous scenario. That README sentence should be read as a current defect, not a shipped limit.</p>

<h2>Problem five: size, icon and startup time</h2>

<p><strong>Symptom.</strong> The release exe is 3,323,392 bytes and 4,943,872 unstripped. An empty <code>windowsgui</code> Go program is 1,214,976 bytes. The embedded <code>WebView2Loader.dll</code> is about 134 KB. Window handle appearance measured 203 ms, 112 ms and 106 ms on this machine. And an exe built locally with plain <code>go build</code> has no custom icon.</p>

<p><strong>Cause.</strong> Size has four parts: the Go runtime and link baseline, the code from <code>go-webview2</code> and <code>golang.org/x/sys</code>, the 134 KB WebView2Loader, and the 29,520-byte HTML. <code>-H windowsgui</code> removes the console window and <code>-s -w</code> removes the symbol table and debug info. Together they take 4.94 MB down to 3.17 MiB, a 32.8% saving.</p>

<p>Icons aren't something Go code can carry directly. <code>IconId: 1</code> only looks the icon up by resource id at window creation. The actual icon and version info are written by <code>go-winres</code> into <code>rsrc_windows_amd64.syso</code>, and that file is gitignored. CI installs <code>go-winres</code> and generates resources before building. Skip that locally and <code>IconId: 1</code> finds nothing, so the window is missing its icon.</p>

<p><strong>Fix.</strong> The build command is fixed at <code>-trimpath -buildvcs=false -ldflags "-H windowsgui -s -w"</code>. The release workflow installs and generates <code>go-winres</code> output before building and fails if <code>rsrc_windows_amd64.syso</code> is missing. <code>windowSize()</code> clamps a 1280 by 860 request to 92% and 88% of the screen so small displays aren't overrun. DPI tries <code>SetProcessDpiAwarenessContext(-4)</code> first and falls back to <code>SetProcessDpiAwareness(2)</code>. The icon itself is generated by <code>tools/icon/main.go</code> with a signed distance field and 4x supersampling, emitting sizes from 16 to 256 pixels with no external design file.</p>

<p><strong>Cost and leftovers.</strong> <code>-s -w</code> strips symbols from the release binary, which makes crash diagnosis harder. Local builds gain a toolchain step: forget the <code>.syso</code> and you get "runs, but no icon", with no compile-time error.</p>

<p>The startup numbers measure "window handle appeared", not first frame and not finished rendering. After the window appears, WebView2 still creates its environment, navigates to <code>file://</code>, runs the boot script and reads the draft or native document. Calling 106 ms "startup complete" is inaccurate. It says the native window is created quickly.</p>

<p>Size is the same story. 3.17 MiB is what you get from not shipping an engine, not from compressing Chromium to 3 MB.</p>

<h2>Problem six: save semantics versus user expectations</h2>

<p><strong>Symptom.</strong> Drop <code>notes.md</code> into the window, edit a few lines, press <code>Ctrl+S</code>. The toast says "exported notes.md" and the original is untouched. Drop it again and you still see the old content. Drop the same file onto the exe icon instead and <code>Ctrl+S</code> writes back to the original. The UI makes the difference hard to see.</p>

<p><strong>Cause.</strong> The browser security model doesn't let a page write to an arbitrary path from a <code>File</code> object, and <code>native</code> is true only when a startup argument exists. Dropping into the window yields a File API <code>File</code> with no writable handle. The picker yields a <code>FileSystemHandle</code> through <code>showOpenFilePicker</code>, but <code>setDocument</code> still sets <code>native = false</code> and saving goes through the handle, not a native path. The code chose "safe by default": without an explicit native path it never guesses which file to overwrite, preferring to export a copy.</p>

<p><strong>Fix.</strong> The three-level degradation covers three capabilities: native path, writable handle, Blob download. <code>setDocument</code> resets <code>native</code> to prevent cross-file writes, <code>micromdSave</code> rejects path-less calls natively, and toasts distinguish "saved to" from "exported". The implementation isn't wrong. It turns "can we write back" into a capability probe instead of a memory test for the user.</p>

<p><strong>Cost and leftovers.</strong> The probe result isn't surfaced in advance. Nothing tells you on drop that this document will be saved by export, and you find out at <code>Ctrl+S</code>. There is no native "save as" dialog either. Once in the download branch, WebView2's download policy decides the location, usually the Downloads folder, with a duplicate for identical names.</p>

<p>The picker branch depends on the File System Access API, whose availability and permission prompts inside WebView2 vary by runtime. When it is unavailable, the app silently falls back to <code>&lt;input type="file"&gt;</code> with no handle at all. No extra branch closes this gap. The UI would have to show the save mode at open time, or expose a native "save as".</p>

<h2>Problem seven: no file watching, no recent files</h2>

<p><strong>Symptom.</strong> Edit <code>notes.md</code> in another editor and MicroMD still shows the old content. Press <code>Ctrl+S</code> in native mode and the old content overwrites the external change with no conflict prompt. Close and reopen and there is no recent list, so you drag the file in again or retype the command.</p>

<p><strong>Cause.</strong> The native layer reads the file once at startup through <code>micromdLoad</code> and then does nothing. No <code>ReadDirectoryChangesW</code>, no <code>fsnotify</code>, no mtime polling. Frontend state is <code>app.name</code>, <code>app.saved</code>, <code>app.handle</code> and <code>app.native</code>. localStorage holds only <code>draft</code>, <code>name</code>, <code>theme</code>, <code>view</code> and <code>split</code>, with no path history. There is no single-instance lock and no IPC either, so a second instance can't tell the first that the file changed.</p>

<p><strong>Fix.</strong> No auto-reload and no conflict detection in this version. Workarounds are closing and reopening, re-dropping, or reopening through the picker. None of them warn that the on-disk version moved. The minimal addition would be native polling of <code>docPath</code>'s mtime, notifying the page through a binding or <code>Eval</code>, and showing a bar offering "reload / keep current". The fuller version uses <code>ReadDirectoryChangesW</code> and handles rename, delete and atomic replace.</p>

<p><strong>Cost and leftovers.</strong> Without watching, the boundary between reader and author disappears. As a pure reader that would be acceptable. But the app also edits and writes back, so stale content overwriting newer content is a real data risk. No recent files pushes the cost of opening onto the file system, which sits oddly with "double-click and it works".</p>

<p>Watching also introduces decisions. Auto-reload loses unsaved edits, a prompt interrupts reading, and saving needs an overwrite-versus-copy policy. Adding it carelessly would be more dangerous than not having it.</p>

<h2>Known limits and design trade-offs</h2>

<p>Pulling the scattered limits into one table, so you can judge whether this fits your use.</p>

<table>
<thead><tr><th>Limit</th><th>Current state</th><th>Impact</th></tr></thead>
<tbody>
<tr><td>Relative image paths</td><td>Base is the app directory; no <code>&lt;base&gt;</code>, no <code>src</code> rewrite</td><td>Images beside the document don't display</td></tr>
<tr><td>Draft ceiling</td><td><code>MAX_DRAFT</code> declared but unused; quota errors swallowed</td><td>Very long drafts may vanish silently</td></tr>
<tr><td>Large documents</td><td>Full <code>innerHTML</code> replacement; 150 ms throttle past 200k characters</td><td>Typing lags, scroll sync can drift</td></tr>
<tr><td>File changes</td><td>No watching, no polling, no conflict prompt</td><td>External edits can be overwritten</td></tr>
<tr><td>Recent files</td><td>No path history; localStorage stores no path</td><td>Every open requires reselecting</td></tr>
<tr><td>Syntax highlighting</td><td>Only a <code>language-xxx</code> class, no colorizer</td><td>Code blocks are plain text</td></tr>
<tr><td>Outline sidebar</td><td>Heading ids exist, no navigation generated</td><td>Long documents require scrolling</td></tr>
<tr><td>Parser tests</td><td>No <code>*_test.go</code> in the repository</td><td>Edge-case syntax verified by hand</td></tr>
<tr><td>Local build icon</td><td>Depends on <code>go-winres</code> output, which is gitignored</td><td>Skip generation and there is no icon</td></tr>
<tr><td>Startup failure message</td><td><code>MkdirAll</code> and <code>WriteFile</code> failures return silently</td><td>Double-click does nothing in extreme environments</td></tr>
</tbody>
</table>

<p>Most of these aren't oversights but "not done within the size and complexity budget". They group into four trade-offs.</p>
<ul>
<li><strong>Externalize the engine for size.</strong> No bundled Chromium, accepting a WebView2 dependency and two capability modes.</li>
<li><strong>One file for engineering simplicity.</strong> UI, parser and styles in one HTML file, accepting no module split, no build step and no frontend tests.</li>
<li><strong>Full render for short code.</strong> One <code>innerHTML</code> line works, accepting a performance ceiling on long documents.</li>
<li><strong>Safe by default.</strong> No native path means no write-back, accepting three outcomes from one shortcut.</li>
</ul>

<p>If work continues, data safety should outrank experience polish. Wire up the draft ceiling and handle external-change conflicts first, then consider incremental rendering and image bases. Highlighting and an outline are reading comfort and don't risk data loss, so they come later. That ordering is also why this post spends more words on the seven problems than on the features. Features can be added. Lost data can't.</p>

<h2>Closing</h2>

<p>MicroMD compresses into three sentences.</p>
<ol>
<li>Size isn't one optimization but a budget split. The 3.17 MiB exe is roughly a 1.21 MB empty <code>windowsgui</code> baseline, three Go modules, a 134 KB WebView2Loader, 29,520 bytes of HTML and link output. The Chromium that was omitted is supplied by the system WebView2.</li>
<li>Shell complexity concentrates in Windows details. Writing to disk for <code>file://</code>, three bindings, save semantics, DPI fallback, icon resources and the runtime-missing fallback are each small, and each can break "double-click and it works".</li>
<li>The hand-written parser's key is order, not syntax coverage. Hide code spans, autolinks and escapes in placeholders, escape everything, then restore. The two-pass design solves "syntax must be recognized" and "source must not inject" at once.</li>
</ol>

<p>It isn't a finished product either. Relative images, draft quota, full re-render, file changes, recent files, highlighting, outline and parser tests are all missing or half-done. They are documented as current state because the value of a 3 MB single-file app isn't how small it is. It's what it cost to get there, and whether those costs are stated honestly.</p>

<h2>Further reading</h2>
<ul>
<li><a href="/en/article/nanobrowser-tauri-webview2/">NanoBrowser: hand-writing an in-process CDP</a>, another desktop shell leaning on the system WebView2 that goes deeper into windows, child webviews and the debugging protocol.</li>
<li><a href="/article/nanoss-windows-ssh-client/">NanoSSH: a Windows SSH client</a>, another single-file delivery wrapping native Windows capability. Compare how the shell and the terminal split the work.</li>
<li><a href="/article/nanodb/">NanoDB: an embedded document database in Go</a>, likewise single-process, few dependencies, complexity pushed inside.</li>
<li><a href="/article/search-inverted-index-to-engine/">From inverted index to search engine</a>, the next step if you want a searchable Markdown knowledge base.</li>
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
<p>I wanted a music tool that works the moment you open a browser. Type a song name, get results from several platforms at once. Click a track and it plays, with lyrics scrolling along. Keep favourites and organize them into playlists. That idea became <a href="https://github.com/zhoujungis/halo_music" rel="noopener noreferrer" target="_blank">HALO Music</a>, my own music square.</p>

<p>The point was never to rebuild someone else's platform page. It was to fit multiple audio sources, a browser player, user data and a desktop wrapper into one lightweight architecture. The frontend is a static page you can deploy straight to Cloudflare Pages. Pages Functions provide the API. D1 holds accounts, libraries and caches. Electron wraps the same web app as a Windows desktop client.</p>

<blockquote>
<p>The project is for learning, research and demonstration. Music content, audio URLs, lyrics and cover art belong to the respective platforms and their original authors. Use must comply with local law, upstream terms of service and copyright policy.</p>
</blockquote>

<h2>1. The architecture at a glance</h2>

<p>There is no separate frontend and desktop player. Both the browser and Electron load the same <code>index.html</code>. The only difference is whether a native window wraps it.</p>

<pre><code>flowchart TB
    subgraph Client[Client]
        Browser[Browser]
        Electron[Electron BrowserWindow]
        UI[index.html\\\\nHTML + CSS + runtime JS]
        Audio[HTMLAudioElement]
        Local[localStorage\\\\ntheme / favourites / playlists]
    end
    subgraph Cloudflare[Cloudflare Pages]
        Static[Pages static assets]
        Functions[Pages Functions\\\\n/api/*]
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

<p>The split buys three things. Static assets ride Pages' CDN. Requests that need keys, signatures or CORS handling live in Functions. Player state stays in the browser, so audio never streams through my own server.</p>

<h2>2. Frontend: one static entry point carrying a whole player</h2>
<h3>2.1 Driving interaction with plain runtime state</h3>

<p>To keep deployment and the desktop build small, there is no large UI framework. Structure, styles and runtime logic live in <code>index.html</code>, <code>styles.css</code> and <code>app.js</code>. A handful of variables describe the current session.</p>

<pre><code>let tracks = []
let currentIndex = 0
let currentList = tracks
let isPlaying = false
let repeatOn = true
let liked = new Set(JSON.parse(localStorage.getItem("halo-liked-tracks") || "[]"))
const audio = new Audio()
</code></pre>

<p>Search, player, lyrics and queue all re-render around that state. Track rows, album cards and player buttons use event delegation, so clicking a song only updates the index, the playback context and the <code>&lt;audio&gt;</code> element. It never spawns a second player instance.</p>

<h3>2.2 Parallel multi-source search, then one merge and dedupe</h3>

<p>The platforms answer differently. Each adapter pulls song id, title, artist, album, cover and duration into a common object. In the browser, search fans out to Netease, QQ Music and Kuwo at once.</p>

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

<p><code>Promise.allSettled</code> is deliberate. When one source is temporarily down, the other two still show up. <code>interleave</code> alternates platforms so the first half of the list isn't all from one place. <code>dedupeTracks</code> filters on platform id plus a normalized "title + artist" key, and normalization strips spaces, hyphens and brackets so the same recording doesn't appear three times.</p>

<p>Server-side adapters also cover QQ, Kuwo and JOOX, meaning the cases that need proxying or a fallback resolver. Playlist import additionally accepts public Netease, Qishui and QQ links. That lets search indexing and audio URL resolution evolve separately. One platform changing its API can't take every feature down with it.</p>

<h3>2.3 Lazy detail loading, audio resolved only on play</h3>

<p>Search results carry only the metadata needed to render a list. Real playback URLs for QQ and Kuwo tracks are fetched when the user presses play. <code>ensureTrackDetails</code> picks an adapter from <code>track.source</code> and collapses concurrent requests for the same track through <code>loadingPromise</code>.</p>

<pre><code>async function ensureTrackDetails(track) {
  if (track.detailsLoaded &amp;&amp; track.audioUrl) return true
  if (track.loadingPromise) return track.loadingPromise

  track.loadingPromise = resolveBySource(track)
    .finally(() =&gt; { track.loadingPromise = null })
  return track.loadingPromise
}
</code></pre>

<p>Only after an address arrives does the code set <code>audio.src</code> and call <code>audio.load()</code>. On failure it never writes short-lived URLs permanently into favourites or playlists. Instead it offers a refresh, an alternate candidate, or a switch to another source. Netease paths go through a compatible resolver for both URL and lyrics, while QQ and Kuwo prefer <code>/api/music</code>.</p>

<h3>2.4 One clock for LRC lyrics and the player timeline</h3>

<p>Lyric sync doesn't start another timer. It listens to the <code>&lt;audio&gt;</code> element's <code>timeupdate</code>. The parser handles multiple time tags per line and both the <code>mm:ss.xx</code> and <code>mm:ss:xxx</code> forms.</p>

<pre><code>function parseLrc(text) {
  const lines = []
  for (const line of String(text || "").split(/\\\\r?\\\\n/)) {
    const tags = [...line.matchAll(/\\\\[(\\\\d{1,3}):(\\\\d{1,2})(?:[.:](\\\\d{1,3}))?\\\\]/g)]
    const content = line.replace(/\\\\[[^\\\\]]+\\\\]/g, "").trim()
    if (!content) continue
    for (const tag of tags) {
      const fraction = tag[3] ? Number(\\\`0.\\\${tag[3].padEnd(3, "0").slice(0, 3)}\\\`) : 0
      lines.push({ time: Number(tag[1]) * 60 + Number(tag[2]) + fraction, text: content })
    }
  }
  return lines.sort((a, b) =&gt; a.time - b.time)
}
</code></pre>

<p>Rendering walks backwards to the last line with <code>line.time &lt;= audio.currentTime</code> and marks it active. Clicking a lyric line sets <code>audio.currentTime</code> to that timestamp. Progress bar, lyric highlight and current track therefore stay consistent by construction, not by coordination.</p>

<h3>2.5 Responsive layout isn't just shrinking</h3>

<p>Desktop is a three-column workspace: search, then player and lyrics, then queue. Mobile switches to bottom navigation between search, lyrics and library. Layout uses CSS Grid, media queries and independent scroll containers, so lyrics and queue never push the page past the viewport. Theme, favourites and playlists sit in <code>localStorage</code>, which means search and local organization work before you ever sign in.</p>

<h2>3. HALO Track: the data model that isolates platform differences</h2>

<p>If every component read platform-specific fields, adding a source would turn into conditional hell. The project defines one track shape instead.</p>

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

<p>The view layer reads only stable fields: <code>title</code>, <code>artist</code>, <code>album</code>, <code>cover</code> and <code>source</code>. Adapters translate platform responses into them. The detail layer fills <code>audioUrl</code> and lyrics by <code>source</code>. <code>serializeTrack()</code> filters out short-lived audio URLs, lyrics and detail state, persisting only reusable identifiers and display data, so expired resources never reach localStorage or D1.</p>

<h2>4. Backend: Pages Functions as adapter and safety boundary</h2>
<h3>4.1 Files as routes</h3>

<p>Cloudflare Pages maps files under <code>functions/api/</code> to <code>/api/*</code>. The main endpoints fall into three groups.</p>

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

<p><code>/api/music</code> dispatches on <code>action</code>: <code>qq_search</code>, <code>kuwo_search</code>, <code>qq_detail</code>, <code>kuwo_detail</code>, <code>qq_audio</code> and <code>kuwo_audio</code>. The server caps keyword length, result count and upstream timeouts, so one misbehaving platform can't occupy the whole Function invocation.</p>

<h3>4.2 Caching and verifying resolved addresses</h3>

<p>Audio resolution runs into short-lived URLs, dead candidates and upstream throttling far more often than search does. The strategy is candidates, then playability checks, then caching.</p>
<ol>
<li>Build a cache key from song id, quality and duration.</li>
<li>Check the Worker's in-process LRU, then the shared D1 cache.</li>
<li>On a miss, try the primary endpoint and a fallback.</li>
<li>Validate the returned address with an HTTP request, song id and duration.</li>
<li>Store the verified candidate. On playback failure, force a re-resolve with <code>refresh=1</code>.</li>
</ol>

<p>The in-memory LRU holds about 500 entries, search caching defaults to roughly 45 seconds, and D1 acts as the cross-request, cross-instance second level. Only reusable resolution results are cached. Audio files are never copied into my storage, and temporary URLs are never treated as permanent links.</p>

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

<p>Favourites and playlists are "write localStorage first, sync to D1 asynchronously". Signed out, the data belongs to that browser. Signed in, the page submits the library to <code>/api/library</code>, and a weak connection still leaves local data usable.</p>

<p>The cloud library is stored as JSON. That's simple and appropriate to a personal project. Collaboration, incremental sync or audit trails would warrant splitting tracks, playlists and the relation between them into proper tables.</p>

<h2>6. How does the Electron app keep accounts safe?</h2>

<p>Passwords are never stored in plaintext. The server uses Web Crypto PBKDF2-SHA-256 with 100,000 iterations and a 16-byte random salt, writing only the hash and salt to D1. After login a random UUID becomes a session token in an <code>HttpOnly; Secure; SameSite=Lax</code> cookie, valid for 30 days by default.</p>

<p>The desktop security goal is one sentence: a window shell only, never Node privileges for the page.</p>

<pre><code>webPreferences: {
  preload: path.join(__dirname, "preload.cjs"),
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: true,
}
</code></pre>

<p><code>preload.cjs</code> exposes only minimal platform information through <code>contextBridge</code>, and external links open in the system browser. The main process creates a 1440 by 920 window with a 960 by 640 minimum, and can point at a custom Pages domain through <code>HALO_MUSIC_URL</code> or <code>--url=</code>.</p>

<h2>7. Tests, development and deployment</h2>

<p>Local development needs Node.js 20 LTS or newer, npm and Wrangler 4.</p>

<pre><code>npm install
npx wrangler d1 execute halo-music-db --local --file schema.sql
npm run dev
</code></pre>

<p>Tests use Node's built-in <code>node:test</code>. They cover sessions, favourites and playlist persistence, field normalization across platforms, playlist link recognition, QQ signing and pagination, LRC parsing, audio container detection, next-track playback context, plus a syntax check of the browser's inline scripts.</p>

<pre><code>npm test
</code></pre>

<p>Deployment publishes the static files and Functions together, with D1 bound in <code>wrangler.toml</code>.</p>

<pre><code>name = "halo-music"
compatibility_date = "2025-01-01"
pages_build_output_dir = "."

[[d1_databases]]
binding = "DB"
database_name = "halo-music-db"
database_id = "your D1 database_id"
</code></pre>

<p>The desktop build reuses the deployed Pages URL, so there is no second local HTTP server.</p>

<pre><code>npm run desktop:dev
npm run desktop:all
npm run desktop:portable
</code></pre>

<p>Windows installers and the portable build land in <code>release/</code>. The app id is <code>com.halomusic.desktop</code>.</p>

<h2>8. What the project taught me</h2>

<p>What is worth recording isn't any single platform API but several reusable engineering decisions.</p>
<ol>
<li><strong>Unify the domain model before adding sources.</strong> HALO Track keeps platform differences inside adapters, so the player and playlist logic never learn upstream field names.</li>
<li><strong>Separate search from playback resolution.</strong> Search optimizes for parallelism and tolerance. Resolution optimizes for validation, caching and retry. Their performance goals differ, so their code should too.</li>
<li><strong>Never treat temporary resources as database facts.</strong> Audio URLs expire. Store the song id and display data, and re-resolve on play.</li>
<li><strong>Local-first removes dependence on login and network.</strong> localStorage makes favourites usable on a weak connection, and D1 adds cross-device sync for signed-in users.</li>
<li><strong>Reuse the web build on desktop.</strong> Electron supplies a native window and a security boundary, while business logic, player and API stay one implementation.</li>
</ol>

<p>Clear boundaries remain. Upstream APIs and audio addresses can change without warning. Functions execution time limits bulk import. The frontend entry point could still be split into modules. The more valuable next steps are a finer-grained playlist model, incremental sync, Playwright visual regression, and stable contract tests per source adapter.</p>

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
<p>Who this is for: engineers who want desktop tools in Go without dragging in Electron; developers who need a lightweight HTTP client; anyone curious about Wails v2, WebView2 and the details of Go's standard HTTP stack.</p>
<p><strong>TL;DR:</strong> NanoAPI's bet is to reuse the system WebView2, build a minimal HTTP engine, and store everything in one JSON file. Sending a request is the easy part. Aligning timeouts, redirects, Windows paths, multipart boundaries and crash-safe writes is the work.</p>
<p>Reading time around 30 minutes. Level: advanced.</p>
</blockquote>

<strong>Contents</strong>
<ul>
<li>Why a Postman that is just enough</li>
<li>Architecture: edit in the frontend, execute in the backend</li>
<li>The full path of one request</li>
<li>The HTTP engine: written, not wrapped</li>
<li>Variable interpolation: one pass, three levels</li>
<li>cURL both ways: lexing, mapping and warnings</li>
<li>Upload and download: how bytes get in and out</li>
<li>Storage: reliability for a single JSON file</li>
<li>Bulk edit and backups</li>
<li>Problem list one: four network traps</li>
<li>Problem list two: four Windows and cURL traps</li>
<li>Problem list three: four desktop traps</li>
<li>Build and release: the cost of one exe</li>
<li>Known limits</li>
<li>Closing</li>
</ul>

<h2>Why a Postman that is just enough</h2>

<p>Postman is powerful, and that power rests on size, accounts, cloud sync, a plugin ecosystem and telemetry. For a developer who wants to enter a URL, pick a method, add a few headers and read the JSON back, most of that is background noise.</p>

<p>NanoAPI compresses the goal into one sentence: a sufficient HTTP debugging client, one executable, double-click to run, data stays local.</p>

<p>"Sufficient" isn't an adjective here. It's a checkable set of constraints. The module file has exactly one direct dependency, the Wails runtime. The frontend has no npm dependencies and no build step, and native ES modules are embedded straight into the binary. The release executable is 11,341,824 bytes, about 10.8 MiB. The NSIS installer for the same version is about 6.3 MB and the MSI about 4.5 MB. An Electron application's installer usually starts in the hundreds of megabytes.</p>

<p>Those numbers don't come from cutting features. They come from choices: rendering belongs to the system WebView2, network and files belong to the Go standard library, and the frontend keeps only the DOM plus a little glue. So there is no Chromium copy, no Node runtime, no third-party HTTP client and no database. There isn't even auto-update or crash reporting.</p>

<p>What "sufficient" leaves out is worth naming, because the omissions are structural rather than temporary. There are no team workspaces, no shared collections, no OAuth 2.0 browser flows that call back to a local port, no mock servers, no monitors running on a schedule, and no generated client code. Those features all assume a server, an account or a background scheduler. Adding any one of them would put a boundary this project deliberately keeps clean, so they stay out. If your daily work depends on them, another tool is the right answer and this one isn't.</p>

<p>What is left is a workflow that covers whole categories of debugging: verify an API contract while reading someone else's documentation, reproduce a failing request from a bug report, paste a cURL command out of a browser's network tab, hit a local development server without fighting CORS, or save a request collection next to the project it belongs to. Those tasks are frequent and short, and a large client charges startup cost for every one of them.</p>

<p>The boundary has to be stated too. NanoAPI supports its own bundle format, version 1, plus a bare settings file. It doesn't import Postman collections, Bruno, OpenAPI or HAR, and the repository contains no parser for any of them. That's scope control rather than an oversight. A format adapter layer turns "a project one person can maintain on weekends" into "a compatibility layer that is never finished". For migration, users go through cURL, the universal channel, or tidy the JSON by hand.</p>

<h2>Architecture: edit in the frontend, execute in the backend</h2>

<p>This is a two-layer Wails v2 application. <code>main.go</code> owns the window and the embedded assets, and <code>app.go</code> binds the application struct to the frontend. The internal packages split by responsibility into proxy, interp, curl, store, bundle and model. The frontend lives in a dist directory as one HTML file plus a set of ES modules, with no <code>node_modules</code> and no Vite.</p>

<p>At runtime Wails exposes bound methods on a global object. A small bridge module wraps calls in promises so a synchronous throw becomes a rejection and callers can't forget to catch it.</p>

<pre><code>function call(method, ...args) {
  try {
    return Promise.resolve(backend()[method](...args));
  } catch (err) {
    return Promise.reject(err);
  }
}
</code></pre>

<p>That boundary decides the division of labour. The frontend owns tabs, the collection tree, the request editor, response rendering, context menus and shortcuts. The backend owns URL merging, variable interpolation, authentication, multipart bodies, TLS, redirects, timeouts, timing capture, response reading, file saving and bundle import and export.</p>

<p>The frontend never calls fetch directly, so there is no "two sets of network rules" problem. Every bound method returns a promise, handled with await or catch. Because all I/O sits in Go, the frontend never deals with CORS, certificates, cookies or filesystem permissions.</p>

<p>That split also explains why response bodies never touch disk. Wails bindings transfer JSON strings, and a large response crossing that boundary once is enough. Persisting another copy only multiplies memory and disk cost. When a response must be kept, the user clicks save body and goes through the system save dialog.</p>

<p>Frontend state lives in tab objects, each owning its own request and response. Response bodies stay in memory and tab state, never in the data file. A restart restores tabs and unsaved edits, but not the last response. That keeps the data file small and stable, and avoids repeatedly serializing potentially large bodies.</p>

<p>Startup checks whether the backend global exists. If the backend isn't ready the app shows an error page rather than a blank window. A failed initial load raises a toast but initialization continues, so one read error can't block the whole application.</p>

<p>The package map is short enough to hold in your head, which matters when you are debugging a request at odd hours.</p>

<pre><code>main.go          window, embedded assets, startup order
app.go           bound methods: request, history, settings, bundle, files
internal/proxy   URL merge, transport, redirect policy, timing, response read
internal/interp  placeholder parsing and three-level resolution
internal/curl    lexer, option table, import mapping, export quoting
internal/store   JSON data file, field repair, atomic write, debounce
internal/bundle  version-1 export and append-merge import
internal/model   request, response, environment, tab types
frontend/dist    index.html plus ES modules: bridge, api, render, state
</code></pre>

<p>One consequence of the split is that the frontend can't cheat. There is no second code path where the renderer opens a socket, and no hidden fetch call in a component. If a feature needs the network, it has to go through a bound method, which means it inherits variable resolution, permission-free file access and consistent error shapes. That constraint is why an editor change can't accidentally invent a second set of transport rules three months later.</p>

<h2>The full path of one request</h2>

<p>The send button lives in the frontend. It guards against re-entry, records the originating tab key, and after the await finds that tab again and writes the result back to the caller. Switching tabs while waiting therefore can't leak a result into the wrong tab.</p>

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

<p>The backend handler is a one-way pipeline. It takes a snapshot of the store, builds the variable table, resolves the request on a copy, builds the body and its content type, assembles transport options, and sends.</p>

<p>Network failures aren't returned as Go errors. They land in a result object with an error kind, so the frontend can distinguish "the request failed" from "the program is broken". Only program state, such as an unavailable store, travels as a Go error.</p>

<p>Request options use pointer booleans to distinguish "the frontend didn't specify, use global settings" from "explicitly off". Timeout, redirect following and TLS skipping all resolve through settings then defaults, so a single request can override settings without rewriting them.</p>

<p>If building the body fails to read a file, that is also not a Go error. It produces a result with a file error kind and records history as usual, so the frontend shows "file read failed" instead of an unhandled exception. The model holds across the chain: once a request has been attempted, failure comes back as a result.</p>

<p>History stores the original request, never the resolved one, so it keeps placeholders rather than resolved secrets. Response bodies, timings and headers aren't persisted, only status code, size, time and an error summary. History caps at 200 entries, dropping from the tail. Success and failure both record, so history contains 200s as well as timeouts and DNS failures.</p>

<p>Each history entry carries the whole request that produced it: method, URL, parameter rows including disabled ones, header rows, body type and body text, auth type and its fields, and the environment id that was selected at the time. That makes "send this again" faithful. It also makes "send it again in a different environment" possible, which is how you compare a staging response with a production one without retyping anything.</p>

<p>Cancellation is part of the same contract. A running request can be aborted from the interface, which cancels the context and ends the read loop. The result then comes back with an aborted kind rather than a network error, so the interface can stay quiet instead of showing a scary message for something the user did on purpose. The same abort path runs when the window closes, so a request in flight doesn't hold the process open.</p>

<h2>The HTTP engine: written, not wrapped</h2>

<p>There is no third-party HTTP client. The proxy package uses the standard library directly, because it needs full control over TLS verification, redirect policy, timeouts, connection closing and phase timings. High-level wrappers tend to flatten exactly those.</p>

<p><strong>Layer one is URL merging.</strong> A bare domain gets its scheme filled in, then the original query string is parsed and the parameter table is merged in. Same-name keys overwrite, the rest keep their order, and query-form API keys append at the end.</p>

<p>One detail is easy to miss: a bare flag parameter with no equals sign has to keep its valueless state and must not become an empty assignment. The implementation records that with an explicit has-value flag, and the same function is shared by sending and by cURL export, so the two can't drift apart.</p>

<p>Concretely, with the original query string holding a page and a flag, and a parameter table adding a size while overriding the page, the final query keeps the flag bare, applies the override, and appends the new key. Spaces become plus signs and non-ASCII text is percent-encoded.</p>

<p><strong>Layer two is request construction.</strong> The timeout and the trace hook have to be attached to the context before the request is created.</p>

<pre><code>ctx, cancel := context.WithTimeout(ctx, timeout)
defer cancel()
ctx = httptrace.WithClientTrace(ctx, &amp;httptrace.ClientTrace{ /* DNS, connect, TLS, first byte */ })
req, err := http.NewRequestWithContext(ctx, method, finalURL, bodyReader)
</code></pre>

<p>Reverse the order and the request keeps a parent context with no deadline, which makes the timeout a decoration. That trap gets its own entry in the problem list.</p>

<p><strong>Layer three is transport.</strong> Every request clones the default transport, sets the skip-verify flag when the user turned off certificate checks, and closes idle connections when done. Redirect handling does two things: with following off it returns the last response so 3xx bodies surface as-is; with following on it allows at most ten hops and records each hop's URL and status.</p>

<p><strong>Layer four is reading the response.</strong> A limited reader takes 20 MB plus one byte. Past that, the body is cut and marked truncated, so memory stays bounded and "exactly 20 MB" is distinguishable from "truncated". Content type, UTF-8 validity and NUL bytes decide whether the body is binary; binary becomes base64, text passes through. Cookies live in a shared jar, and clearing swaps in a new jar rather than deleting entries one by one.</p>

<p>One special case in header writing: the host header is assigned to the request's host field rather than the header map, because the map doesn't participate in host selection. Authentication is applied after headers. Basic auth uses the standard helper, bearer writes the authorization header, and API keys go to a header or a query parameter depending on their placement setting.</p>

<p>Protocol, remote address, redirect count and the phase timings in the result aren't decoration. They let a user see whether a request is slow in DNS, TCP, TLS or time to first byte, and where a redirect went. When the network fails, timings already collected are kept and the frontend says so.</p>

<p>Status text is sliced out of the raw status line, the protocol field records HTTP/1.1 or HTTP/2, and headers stay a multi-value map, so the frontend can show repeated headers on separate lines instead of merging them into one.</p>

<p>Two behaviours are inherited from the standard library on purpose, and both surprise people who have only used high-level clients.</p>

<p><strong>Compression is negotiated, not forced.</strong> When the client adds the accept-encoding header itself, it also decompresses the body. When a user writes that header by hand, the transport assumes the caller wants the raw bytes and stops decompressing. The interface then shows what looks like garbage, and the honest explanation is "you took over negotiation". The same rule applies to deflate and brotli, which this build has no decoders for. Both facts live in the known limits, because they are a consequence of the design rather than a bug to patch.</p>

<p><strong>Cookies follow the jar, not the tab.</strong> Every request shares one cookie jar, which is what makes a login flow work across three requests typed by hand. Clearing cookies replaces the jar instead of walking its entries, so a stale set can never survive a clear. The trade is that two unrelated hosts in the same session share one jar, which is fine for a local tool and wrong for anything approximating a browser profile.</p>

<h2>Variable interpolation: one pass, three levels</h2>

<p>The syntax is a double-brace placeholder, matched by a regular expression that allows whitespace. Resolution recurses at most three levels, replacing matching keys each round. It exits early when a round changes nothing, and placeholders still unresolved after three rounds stay as written.</p>

<p>That handles a placeholder inside a path and a variable that refers to another variable, without looping forever on a pair that refer to each other.</p>

<p>A worked example, because the three-level rule is easier to see than to describe. Suppose the environment holds <code>host</code> as a staging domain, <code>base</code> as a placeholder pointing at <code>host</code>, and <code>token</code> as a literal string. A URL of <code>{{base}}/users</code> resolves in two rounds: the first replaces <code>base</code>, the second would resolve anything the replacement introduced. A header of <code>Authorization: Bearer {{token}}</code> resolves in one. Both land in the same request, and neither is written back to the environment or to the request editor.</p>

<p>Rounds stop early when a round changes nothing, which is the common case. That detail matters for performance as much as correctness: most requests have shallow placeholders, so the usual path is one match and one replacement pass over a handful of short strings, not three passes over everything.</p>

<p>Precedence is explicit. All global environments merge first, then the selected environment overrides same-name keys. Global variables are the floor and environment variables are the override. Disabled rows and empty keys are skipped.</p>

<p>For example, with a global base URL and a global token, and the current environment overriding the base URL, a placeholder for the base goes to the environment's host while the token still resolves to the global value. When several global environments share a key, the later merged one wins, and that order follows the environment list.</p>

<p>The three-level boundary matters too. A two-step chain resolves. A longer chain leaves placeholders from the fourth level onward in the unresolved list rather than expanding forever. It's a hard anti-cycle cap, not "try a few more times".</p>

<p>Resolution only ever touches a copy. The clone duplicates the slices that may be rewritten, such as parameters, headers, form fields and file fields, while URL, body and auth fields are copied by value. Resolution covers the URL, parameter keys and values, header values, raw and form and file bodies, plus basic username and password, bearer tokens and API key pairs. Enumerated fields such as method and body type aren't interpolated.</p>

<p>Unresolved variables don't fail the request. It's sent as written, and the names come back in the result. The frontend shows them in red with a note that they were sent as-is. That degradation is deliberate, because during debugging you often need to see how the server responds to an unfilled path rather than being blocked client-side.</p>

<h2>cURL both ways: lexing, mapping and warnings</h2>

<p>Import doesn't shell out. It ships a small lexer handling single and double quotes, backslash continuations, cmd's caret continuation, the PowerShell prefix and the explicit <code>curl.exe</code> name. The lexer emits tokens, which are then parsed against an option table.</p>

<p>The supported set covers day-to-day debugging: request method, header, data, raw data, binary data, JSON, form, user, OAuth bearer, cookie, user agent, referer, GET redirection, and head. Unknown options are never silently dropped; they land in a warnings list shown with the import result.</p>

<p>Method inference follows cURL's habits. An explicit method wins. A head flag yields HEAD. A form or data flag yields POST. A GET flag moves the data into the query string and returns to GET. The JSON flag sets a JSON body and adds an accept header. When an explicit method conflicts with inference, the explicit one wins.</p>

<p>A few mappings deserve detail.</p>

<ul>
<li>Data and binary data read a file behind an at sign, capped at 20 MB and requiring UTF-8. Raw data keeps the literal and reads nothing.</li>
<li>Multiple data flags join with ampersands into one body, matching cURL's form behavior.</li>
<li>With a form flag the request becomes multipart. Per-file options such as type and filename are stripped with a warning, because NanoAPI's file fields hold only a key and a path.</li>
<li>The insecure flag isn't written into the request. It warns that certificate verification lives in settings.</li>
<li>The proxy flag warns and is ignored, because there is no proxy configuration screen.</li>
<li>Upload-file, config and client certificates also only warn. The tool never pretends to support them.</li>
</ul>

<p>Export takes a different path but reuses the same URL builder and the same dedupe rules. Output is a Bash-style command with single quotes, and inner single quotes are replaced by the usual escape sequence. Basic auth becomes a user flag, bearer and header-form API keys become header flags, and multipart becomes form-string for text fields plus form flags for files.</p>

<p>Dedupe removes content-length, transfer-encoding, a hand-written multipart content type, and any authorization or API key header that duplicates the auth section.</p>

<p>Since both directions share one option table, it is worth reading the mapping as a table rather than as a list of rules.</p>

<table>
<thead><tr><th>cURL option</th><th>Request field</th><th>Note</th></tr></thead>
<tbody>
<tr><td>request</td><td>method</td><td>Overrides any inference</td></tr>
<tr><td>header</td><td>header row</td><td>Split on the first colon; a header with no value keeps an empty value</td></tr>
<tr><td>data, binary-data</td><td>raw body</td><td>At sign reads a file, 20 MB cap, UTF-8 required</td></tr>
<tr><td>data-raw</td><td>raw body</td><td>Literal text, no file read</td></tr>
<tr><td>data-urlencode</td><td>raw body</td><td>Imported verbatim with a warning that nothing was encoded</td></tr>
<tr><td>json</td><td>JSON body</td><td>Also adds an accept header</td></tr>
<tr><td>form</td><td>multipart body</td><td>Text fields become form rows, at-sign values become file rows</td></tr>
<tr><td>user</td><td>basic auth</td><td>Split on the first colon, so a password may contain colons</td></tr>
<tr><td>oauth2-bearer</td><td>bearer auth</td><td>Header-form API keys map here too</td></tr>
<tr><td>cookie, user-agent, referer</td><td>header rows</td><td>Written as the ordinary header they correspond to</td></tr>
<tr><td>get, head</td><td>method plus body handling</td><td>GET moves data into the query string</td></tr>
<tr><td>insecure, proxy, upload-file, cert</td><td>nothing</td><td>Warn only, never silently applied</td></tr>
</tbody>
</table>

<p>Export reuses the same table in reverse, which is the whole reason the two directions can't drift. A change to how a header row is written during import shows up in export the same day, because it is one function and not two.</p>

<p>Multipart text fields use form-string deliberately, so an at sign or a less-than in the value isn't read as a file reference. File fields use a file form, with the path handed to shell quoting. HEAD exports as a head flag rather than an explicit method, because the explicit form can leave clients waiting for a body that never comes. The quoting helper guarantees safety under Bash only, so export targets Bash, WSL or Git Bash. That's an explicit platform assumption.</p>

<p>This isn't a complete cURL. The goal is to bring the common debugging commands in, not to interpret every part of the cURL language, which makes the warning policy important. Anything unrecognized is reported instead of quietly producing a request that looks right and behaves differently. An unclosed quote returns an error rather than guessing intent.</p>

<h2>Upload and download</h2>

<p>Uploads assemble multipart bodies on the Go side. Text fields are written directly. File fields are stat-checked first, directories are rejected, a single file is capped at 20 MB and the total at 50 MB, and the body uses the file's base name.</p>

<p>All files are read into memory before assembly, which is exactly why the caps have to exist. One enormous file would otherwise take the process down. File paths are interpolated too, so a placeholder directory works, and resolution happens before sending. A missing path returns a file error.</p>

<p>One step before sending is crucial. If the body is multipart, any user-written content type is dropped. The boundary is generated for this request, so a hand-written one can't match, and keeping it only makes the server fail to parse. Import removes a manual content type when a form flag is present and warns; export skips it for the same reason.</p>

<p>Download runs the other way. The filename is chosen in order: the name in the content-disposition header, then the last segment of the final response URL, then the request name. The header supports both the plain form and the RFC 5987 UTF-8 form.</p>

<p>The chosen name is reduced to a base name, characters that are illegal on Windows are replaced, trailing dots and spaces are trimmed, and the result is capped at 120 runes. Both sides clean the name: the frontend for the suggestion, the backend as the final guard. Image preview has an extra 8 MB ceiling; beyond it, or when the body was truncated, the view falls back to base64 rather than stuffing a huge data URL into the DOM.</p>

<p>Binary responses show as base64, and the backend decodes back to raw bytes when saving. Image responses preview directly when untruncated and small. The viewer therefore needs no renderer per format, and binary data never reaches a text highlighter.</p>

<p>The three caps aren't arbitrary round numbers. Twenty megabytes for a single file keeps one attachment from dominating memory while still covering screenshots, PDFs and small datasets. Fifty megabytes for the total bounds a request body that has to be held in memory and then copied into the transport. Twenty megabytes for a response bounds the string that crosses the binding boundary, which is the step that actually hurts when it gets large. Raising any of them is easy. Raising them without measuring the copy cost is how a debugging tool starts swapping.</p>

<p>Filename sanitation is the kind of code that never gets written until it bites. The backend reduces to a base name so a header can't write outside the chosen directory, replaces the characters Windows rejects, trims trailing dots and spaces that Windows silently drops, and caps the length so a long title plus a quota can't produce a path the filesystem refuses. The frontend runs the same cleanup to suggest a name in the save dialog. Duplicated logic usually means two places to fix a bug, and here it is deliberate: the frontend version exists for convenience, the backend version exists for safety, and only the second one is trusted.</p>

<h2>Storage: reliability for a single JSON file</h2>

<p>The data file sits under the user's application data directory, derived from the standard config path. It holds collections, environments, global variables, settings, history and open tabs. There is no database, no schema version and no migration framework.</p>

<p>If the config directory is unavailable, the application falls back to the system temp directory so it still starts, with no persistence across restarts.</p>

<p>Reads do no whole-file validation, only per-field repair. A timeout of zero or less resets to the default, an empty theme resets to the default, and nil collections, environments, history and tabs become empty slices. One bad field therefore can't cost the user their chosen theme.</p>

<p>The repair pass is deliberately short, and each rule exists because a specific value would break the interface downstream. A negative timeout would make every request fail instantly with an aborted kind that looks like a network fault. An unknown theme name would render the app with no colors at all. Nil slices would turn every list render into a null check spread across the frontend. Repairing four things is cheaper than defending against them at twenty call sites.</p>

<p>If JSON parsing fails, the original file is renamed with a corrupt marker and a timestamp, and the app starts empty. Nothing is deleted, so manual repair or restoring a backup stays possible.</p>

<p>Writes are debounced by 300 ms, so typing doesn't hit the disk. The actual write creates a temporary file in the same directory, writes, syncs, closes, then renames over the target, so a process exiting mid-write leaves no half-written JSON.</p>

<p>Snapshots return slice copies so callers can't mutate underlying data while it is being serialized. That copy looks fussy and is the core of concurrency safety: while a request runs in the background, the frontend may be editing collections or environments, and serialization has to work from a stable copy.</p>

<p>Close performs a final flush, and closing the window also triggers the frontend's tab save. Both paths use the same atomic write, so there is no separate close-time logic. History keeps 200 entries, and bodies and timings never persist. The file usually stays small, and "you can see the previous response after restart" is explicitly not a capability.</p>

<h2>Bulk edit and backups</h2>

<p>Bulk editing of environment variables is pure frontend logic. Input is dotenv-style key-value text. Parsing skips blank lines and comments, drops an export prefix, supports single and double quotes, and inside double quotes resolves newline, carriage return, tab, escaped quote and escaped backslash.</p>

<p>Duplicate keys take the last line, and invalid lines are counted without blocking the import. Existing variables keep their enabled flag and their description, so one bulk paste can't wipe notes someone wrote carefully.</p>

<p>Formatting is the reverse. Values containing newlines, tabs, leading or trailing spaces, or already quoted, get double quotes and escaping. Frontend tests cover parse-format round-trip consistency, which catches quote and escape edge cases that single-line tests miss.</p>

<p>For example, given an export line, a quoted value with an escaped newline, a comment and a line with no equals sign, parsing yields two variables and one invalid count, and the escaped newline becomes a real line break. A repeated key overrides the earlier one while preserving its flags.</p>

<p>Backups use only the project's own format, version 1, exporting collections and environments but never history, settings or tabs. Import caps at 32 MB and also accepts a bare settings file.</p>

<p>Import isn't overwrite but append-merge. The collection tree generates fresh ids recursively, so nodes can't collide. Environments get fresh ids, with an "imported" suffix on name clashes and a number after that. Global variables exist once only, merging by key with existing values winning, duplicates skipped and a count reported.</p>

<p>To repeat: this import recognises no Postman collection, no Bruno, no OpenAPI and no HAR. No format sniffing, no field mapping. If you hold a Postman export, the path is to export cURL and import that, or convert the JSON by hand.</p>

<h2>Problem list one: four network traps</h2>
<h3>Problem 1: the timeout appeared to do nothing</h3>

<p><strong>Symptom.</strong> Set a 200 ms timeout against an endpoint that takes two seconds. The client still waits two seconds and reports something other than a timeout.</p>

<p><strong>Cause.</strong> The original code created the request first and attached the timeout and trace afterwards. The request keeps the deadline-free context it was built with, and deriving a new context later doesn't affect it. The timer was never on the executed path.</p>

<p><strong>Fix.</strong> Reorder: timeout first, trace second, request third. A test now asserts that a 200 ms timeout against a two-second server reports a timeout error kind.</p>

<p><strong>Cost.</strong> Every request creates and cancels a context, which makes the code path wordier. And the timeout is a deadline for the whole request, including DNS, connect, TLS, first byte and body read, not a connect timeout. Per-phase limits aren't configurable; the timing panel is how you inspect phases.</p>

<h3>Problem 2: a specific redirect error swallowed by a generic one</h3>

<p><strong>Symptom.</strong> Following redirects into an endless loop shows "network error" rather than "more than ten redirects", and the internal error kind becomes the generic network kind.</p>

<p><strong>Cause.</strong> The redirect check noticed the hop limit, wrote a specific error into the result, and returned an error. The HTTP client wrapped that error, and the outer handler then overwrote the result fields with a translated generic error. A specific error lost to a vaguer one.</p>

<p><strong>Fix.</strong> In the error branch, check whether the result already carries the specific redirect kind and keep it. A test asserts both the kind and the message survive.</p>

<p><strong>Cost.</strong> Error handling now has a branch for one specific kind, coupling the redirect callback to the outer handler. Any future "write the result inside a callback" error type has to remember the same guard.</p>

<h3>Problem 3: Windows connection errors didn't match the message table</h3>

<p><strong>Symptom.</strong> Connecting to a closed port is recognized as connection refused on Linux and falls into the generic network error on Windows. Same condition, different text per platform.</p>

<p><strong>Cause.</strong> Classification originally matched Linux strings. On Windows the same condition surfaces as "actively refused" or "no connection could be made", so string matching failed. The underlying error is also wrapped by operation and URL error types, which makes the outermost text unreliable.</p>

<p><strong>Fix.</strong> Extract the operation error, then try the syscall errno and compare against the refused, reset and timed-out codes. When no errno is available, fall back to lowercase text matching covering both Windows phrasings.</p>

<p><strong>Cost.</strong> String fallbacks are fragile across system languages and Go versions, and can misclassify unrelated errors that happen to contain the phrase. The errno path is primary and strings are insurance.</p>

<h3>Problem 4: self-signed certificate errors looked like network failures</h3>

<p><strong>Symptom.</strong> Hitting a self-signed HTTPS service shows a network error, with no hint that certificate verification can be turned off in settings.</p>

<p><strong>Cause.</strong> TLS error types vary across Go versions. Besides an unknown authority error there are certificate verification and hostname errors, usually wrapped in a URL error. Checking one type misses most certificate problems.</p>

<p><strong>Fix.</strong> Classify by matching the verification, hostname and unknown-authority types in order, then fall back to certificate and TLS substrings, all mapping to one TLS kind that the interface renders as a certificate error.</p>

<p><strong>Cost.</strong> Substring fallbacks can misread a server error that mentions TLS as a certificate problem. And the project has no client certificates, no CA import and no chain inspection, so enterprise mutual TLS means using something else.</p>

<h2>Problem list two: four Windows and cURL traps</h2>
<h3>Problem 5: the shell lexer ate Windows paths</h3>

<p><strong>Symptom.</strong> Importing a form field that references a Windows path loses the backslashes, and the file isn't found.</p>

<p><strong>Cause.</strong> The lexer treated backslashes as escapes by shell rules. Rules meant for backslash, escaped quote and doubled backslash also swallow the backslash before ordinary letters, which destroys Windows paths, and Windows users rarely add extra quotes.</p>

<p><strong>Fix.</strong> Escape only spaces, tabs, quotes, backslash, dollar signs and backticks. Keep the backslash for every other character. A test pins the behavior with a Windows path.</p>

<p><strong>Cost.</strong> One lexer serves both POSIX shell habits and Windows habits, so the semantics can't be identical. An unquoted path containing spaces still splits into tokens, and an escaped n inside double quotes is still a newline rather than a path fragment.</p>

<h3>Problem 6: cmd's caret continuation wasn't recognized</h3>

<p><strong>Symptom.</strong> Copying a multi-line cURL command out of a cmd window, where lines end with a caret, produces shifted arguments or a parse failure.</p>

<p><strong>Cause.</strong> The lexer knew backslash continuations and plain newlines but not the caret. And Windows text can carry CRLF, so a caret followed by CRLF was never treated as one continuation.</p>

<p><strong>Fix.</strong> The caret branch handles both line ending forms as continuations, while a standalone caret stays literal. The PowerShell prefix and the explicit executable name are accepted too, which covers commands copied from PowerShell.</p>

<p><strong>Cost.</strong> Only continuation is implemented, not cmd's full escaping. Variable expansion, command separation and caret-escaping of other characters aren't simulated, so complex batch commands still warn or parse imperfectly.</p>

<h3>Problem 7: cURL options that look alike but aren't</h3>

<p><strong>Symptom.</strong> Users assume that data and raw data both read a file, then the latter sends a literal at sign path. Or they assume the insecure flag disables certificate checks, and importing leaves settings untouched.</p>

<p><strong>Cause.</strong> These differences belong to cURL. Data and binary data read files behind the at sign, while raw data explicitly keeps the literal. The insecure flag is a per-run TLS option in cURL, whereas certificate verification here is a global setting that one command should not silently change.</p>

<p><strong>Fix.</strong> Dispatch by option name. Data flags read files, capped and UTF-8 validated. Raw data keeps text. The insecure flag only warns and points at settings. The urlencode flag imports verbatim with a warning that no encoding was applied.</p>

<p><strong>Cost.</strong> Option semantics live in a lookup table that has to grow with each new option. Standard input, config files, client certificates and proxies are unsupported. And users may ignore warnings, especially when pasting a large command.</p>

<h3>Problem 8: a hand-written multipart boundary conflicted with the server</h3>

<p><strong>Symptom.</strong> Writing a multipart content type by hand with a boundary, then choosing multipart upload, makes the server fail to parse or receive fields.</p>

<p><strong>Cause.</strong> The writer generates the boundary at send time, so a hand-written one differs from the one actually used. Mismatched header and body are rejected by any strict server.</p>

<p><strong>Fix.</strong> After building the body and before sending, if the body is multipart, delete the content type from the header copy and use the generated value. Import removes a manual content type when a form flag is present and warns; export skips it as well.</p>

<p><strong>Cost.</strong> Users lose the ability to customize the multipart content type, for example to set a charset. That's the intended trade: making a wrong configuration impossible beats preserving a freedom that usually produces errors.</p>

<h2>Problem list three: four desktop traps</h2>
<h3>Problem 9: a per-request transport gives up keep-alive</h3>

<p><strong>Symptom.</strong> Consecutive requests each re-establish a connection, so load runs and batch debugging take longer than expected. Sharing a transport without closing it, on the other hand, leaves idle connections hanging until timeout.</p>

<p><strong>Cause.</strong> The application must switch certificate verification per request, and TLS configuration belongs to the transport, which can't be safely mutated on a shared one. Sharing would also let one request's TLS policy leak into another. Per-request transports mean no connection reuse.</p>

<p><strong>Fix.</strong> Clone the default transport per request, set its TLS configuration, and close idle connections when the request finishes. Connection lifetime is bound to the request, nothing hangs, and TLS policies stay separate.</p>

<p><strong>Cost.</strong> No keep-alive reuse. Consecutive requests repeat DNS, TCP and TLS. That's acceptable for a debugging tool and poor for high-frequency batch calls. Getting both reuse and per-request TLS would need a transport pool keyed by policy, a clear step up in complexity.</p>

<h3>Problem 10: large responses froze the webview</h3>

<p><strong>Symptom.</strong> A multi-megabyte JSON response makes the response pane unresponsive and the editor laggy. A large request body triggers validation on every keystroke and stutters as well.</p>

<p><strong>Cause.</strong> The renderer parsed, formatted and highlighted the entire body, and live validation ran on every input. At scale, string processing and DOM construction dominate the main thread.</p>

<p><strong>Fix.</strong> Three thresholds. Response reads cap at 20 MB, truncated with a notice. Bodies over 1 MB skip prettifying and highlighting and show raw text. Request bodies over 512 KB skip live validation, debounced to 200 ms. Truncation propagates to the save dialog, which says so.</p>

<p><strong>Cost.</strong> Responses over 20 MB are never fully available, and saving keeps the truncated part. JSON over 1 MB loses folding and color. Request bodies over 512 KB stop reporting syntax errors, which then wait for the server.</p>

<h3>Problem 11: an interrupted process left half a JSON file</h3>

<p><strong>Symptom.</strong> Killing the application mid-write makes the data file unparsable on restart, and collections and environments disappear.</p>

<p><strong>Cause.</strong> Overwriting the target in place isn't atomic. Exiting mid-write leaves invalid JSON, and a reader with no recovery strategy shows empty data.</p>

<p><strong>Fix.</strong> Write a temporary file, sync it, close it, then rename over the target. On a read failure, rename the original with a corrupt marker and start empty. Fill defaults per field, so one bad field can't sink the whole configuration. Tests assert that every flush leaves valid JSON, that no temporary files remain, and that a corrupt file is backed up and recoverable.</p>

<p><strong>Cost.</strong> No schema version means field upgrades rely on filling what is missing and ignoring what is unknown, with no real migration. Corruption recovery is "keep the file, lose the data", which needs manual repair. And a 300 ms debounce can lose the last few hundred milliseconds of edits, which the forced flush on close only partly compensates.</p>

<h3>Problem 12: ids, name clashes and global variables after import</h3>

<p><strong>Symptom.</strong> Importing a backup twice produces duplicate collection nodes where deleting one affects the other, two identically named environments that can't be told apart, and global variables overwritten wholesale.</p>

<p><strong>Cause.</strong> Bundle nodes carry their original ids and collide when appended. Environment names have no uniqueness constraint. And global variables are supposed to exist exactly once, so appending them as ordinary environments creates a second copy.</p>

<p><strong>Fix.</strong> Collection nodes get fresh recursive ids, and request nodes gain default method, body type and auth type. Environments get fresh ids with an imported suffix and an incrementing number. Global variables stay single, merging by key with existing values winning, duplicates skipped and counted in a warning.</p>

<p><strong>Cost.</strong> Import appends rather than deduplicating, so the same backup imported twice still yields two collection sets; only the ids avoid collision. Renamed environments change what the user sees, and "existing value wins" can silently ignore newer values from the backup, leaving only a count in the warning.</p>

<h2>Build and release: the cost of one exe</h2>

<p>The build command deliberately bypasses the frontend toolchain.</p>

<pre><code>wails build -platform windows/amd64 -s -skipbindings -webview2 browser
</code></pre>

<p>The size flag skips the frontend build, the bindings flag skips generating bindings, and the frontend calls through the runtime global instead. Frontend files are embedded, so the artifact is a single executable with no asset directory beside it.</p>

<p>The release script then drives the NSIS template and WiX to produce a portable executable, an NSIS installer and an MSI. The script writes the version into the Wails config before building and restores it afterwards; the portable executable gets its version through a linker flag, while installer metadata comes from the config. The two version sources must stay in sync, or the settings page and the file properties disagree.</p>

<p>The three artifacts serve three distribution stories: the portable build for running anywhere, NSIS for Start Menu and desktop shortcuts plus WebView2 bootstrapping, and the MSI for domain deployment and silent installs.</p>

<p>For version 0.1.0 the portable executable is 11,341,824 bytes, NSIS about 6.3 MB and MSI about 4.5 MB. Three files solve three distribution scenarios, not three feature levels.</p>

<p>The path also surfaced two classic Windows engineering problems. Line endings: running the formatter check on a Windows runner fails on CRLF, so a commit added a gitattributes entry to normalize to LF. MSI shortcuts: WiX enforces component ownership rules for shortcuts, and the first definition failed until a later commit reorganized components and shortcuts.</p>

<p>The costs extend to distribution reality. There is no code signing, so SmartScreen warns about an unknown publisher. The MSI requires WebView2 to be present, while NSIS tries to install it. And the version must be synced between the config and the linker flag. A single executable buys simplicity for users and more manual constraints in the build chain.</p>

<h2>Known limits</h2>

<p><strong>Compression isn't handled directly.</strong> Go's transport only decompresses automatically when it added the accept-encoding header itself. If a user writes that header by hand, the transport won't decompress on their behalf, and NanoAPI has no brotli or deflate decoder, so the pane shows raw compressed bytes. It isn't "gzip unsupported". It's "don't write that header, let the transport negotiate".</p>

<p><strong>Sensitive headers follow the standard redirect policy.</strong> Authorization is dropped on a cross-origin hop, and the application neither replays it nor tells the user that it was removed. Same-origin hops are usually fine, but cross-origin debugging produces the classic "it worked, then 401 after the redirect".</p>

<p><strong>Proxies are inherited implicitly.</strong> Because transports are cloned from the default one, the environment proxy function still applies, so the usual proxy variables affect requests. There is no proxy screen, and the cURL proxy flag only warns. Anyone with proxy variables set may egress from an unexpected place.</p>

<p><strong>Import formats are closed.</strong> Only the project bundle, version 1, and a bare settings file. No Postman, Bruno, OpenAPI or HAR, with no sniffing and no migration wizard.</p>

<p><strong>There is no schema version.</strong> Upgrades rely on per-field defaults and ignoring unknown fields, so the file can't express when a field became meaningful, and destructive migration is unsafe.</p>

<p><strong>The capability boundary also includes</strong> no client certificates or custom CAs, no custom multipart content type, a hard 20 MB response cap, and history limited to 200 entries without bodies.</p>

<p>Each of those has a workaround, and each workaround has a cost worth knowing in advance.</p>

<table>
<thead><tr><th>Limit</th><th>What you can do instead</th><th>What it costs</th></tr></thead>
<tbody>
<tr><td>No brotli or deflate decoding</td><td>Leave accept-encoding unset and let the transport negotiate</td><td>You can't test a server that only answers brotli</td></tr>
<tr><td>Authorization dropped cross-origin</td><td>Re-add the header manually on the redirected host</td><td>Two requests instead of one, and the first 401 stays in history</td></tr>
<tr><td>Proxy inherited from the environment</td><td>Clear the proxy variables for that process</td><td>Other tools in the same shell lose their proxy too</td></tr>
<tr><td>No Postman import</td><td>Export cURL from Postman, import that</td><td>Collection structure is lost, only the requests survive</td></tr>
<tr><td>No schema version</td><td>Keep a backup before upgrading</td><td>Manual recovery is the only recovery</td></tr>
<tr><td>No client certificates</td><td>Use a different client for mutual TLS</td><td>Two tools for one API</td></tr>
<tr><td>20 MB response cap</td><td>Save the body before truncation matters, or query a narrower endpoint</td><td>Large exports need another tool</td></tr>
</tbody>
</table>

<p>One more boundary is easy to miss. History stores the original request, so placeholders never become plaintext secrets, but a token typed directly into a URL or a header does land in the data file as plaintext. The tool does no field-level encryption and makes no promise against a local reader.</p>

<p>What those leftovers share is that each needs extra infrastructure: decompression needs an encoding library, auth replay needs a custom redirect policy, proxies need a settings screen, format compatibility needs adapters, and schema versioning needs a migration framework. None of them is a one-line change.</p>

<h2>Closing</h2>

<p>NanoAPI compresses into three sentences. Rendering belongs to the system WebView2, network and files belong to the Go standard library, and the frontend stays dependency-free native modules. It never tries to replace Postman. It makes the most common debugging path solid: request construction, variables, cURL, upload and download, response inspection and single-file storage.</p>

<p>What decides quality isn't the feature list but the unglamorous failure paths. A timeout has to be attached to the right context. A specific redirect error must not be overwritten by a generic one. Windows connection errors and paths need their own handling. Multipart boundaries must not be user-supplied. Writes must be atomic and corruption must leave evidence. Large responses must be bounded at read, render and validate.</p>

<p>Its leftovers are equally explicit: no brotli or deflate decoding, no auth replay across origins, proxies inherited from the environment, a closed import format, and no schema version. Saying so plainly is worth more than claiming everything is supported. A sufficient tool should tell you where it is sufficient and where it isn't.</p>

<p>None of these conclusions came from reading code and guessing. Timeouts, redirects, paths, storage and import all have unit tests or reproducible mock servers, so breaking any one of them fails the tests first.</p>

<h2>Further reading</h2>

<ul>
<li><a href="/en/article/nanobrowser-tauri-webview2/">NanoBrowser, hand-writing an in-process CDP</a>, the same WebView2 shell family with the browser protocol inside the process.</li>
<li><a href="/article/file-upload-production-deep-dive/">File upload in production</a>, which covers the multipart and object-storage half this post stops short of.</li>
<li><a href="/article/websocket-production-deep-dive/">WebSocket in production</a>, the next lesson if a debugging tool grows from one-shot HTTP to long-lived connections.</li>
<li><a href="/en/article/micromd-3mb-markdown-reader/">MicroMD, a 3 MB Markdown reader</a>, another desktop project treating single-file and small as hard constraints.</li>
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
<p>Who this is for: people who want an AI assistant on their own machine without handing chat history and file paths to a cloud; people building desktop agents in Electron and fighting permissions, paths and packaging; people who want to see where a local-first product has to compromise.</p>
<p><strong>TL;DR:</strong> the core of Z Bot isn't "plug in a model". It's putting the model inside a box the main process controls. The database, keys, tool execution and system capabilities all stay in the main process, and the renderer gets only a whitelisted API. Every action with a side effect asks for permission first. Memory starts with SQLite FTS5 rather than a vector store. Reminders, context and retries all have hard caps.</p>
<p>Reading time around 55 minutes. Level: advanced.</p>
</blockquote>

<h2>Why build a local-first personal assistant</h2>

<p>Cloud chat products are already strong, but "personal assistant" and "general question answering" are different products. General Q&amp;A doesn't need to know your project directories, last week's todos or your writing voice. A personal assistant does, and that information naturally should not leave the machine.</p>

<p>Z Bot starts from a plain idea. Keep personal context, long-term memory, tasks and reminders in a local SQLite database. Let the model handle reasoning and generation. Execute file reads, web fetches and reminder creation on the machine, with the user's authorization each time.</p>

<p>That positioning brings three hard constraints.</p>

<p><strong>Data has to be explainable, backup-able and deletable.</strong> There must be no state where memory lives in some cloud table that the user can neither see nor remove.</p>

<p><strong>The model has to be swappable.</strong> OpenAI, OpenAI-compatible endpoints, Anthropic, Google and Ollama all work. The product can't lock anyone to one vendor.</p>

<p><strong>The assistant has to be resident.</strong> It has to keep standing by after the window closes, send system notifications and read local files. That makes it a desktop application rather than a web page.</p>

<p>Z Bot isn't a coding agent. Its loop is understand, remember, reason, help, act, learn, and the focus is personal context and daily tasks rather than editing a repository. The README says plainly that complex software work belongs to a specialized agent such as NanoHermes, while Z Bot understands the request, dispatches work, receives results and reminds the user. That boundary matters. The moment it sees itself as a general coding agent, the tool set, the permission model and the context budget all run out of control.</p>

<p>Local-first has costs too. There is no multi-device sync and no server push. A new machine means reconfiguring models and authorized directories. Reminders are reliable only while the process is alive, with no catch-up after a full exit. And local OCR is capped by whatever engine Windows ships. Those costs recur throughout this post, so it is worth stating the product boundary before the technical choices.</p>

<h2>Architecture: the main process and six packages</h2>

<p>The stack is Electron 45, React 19 and TypeScript 6. The database is Node's built-in SQLite module, with FTS5 for search. The repository is a pnpm workspace with six packages: shared, database, model, memory, tools and bot-core. The desktop application sits in <code>apps/desktop</code>. Tests are 32 unit tests plus 2 end-to-end tests, covering path guards, memory deduplication, reminder recurrence, provider normalization, the runtime and project-stall reminders.</p>

<p>The layering is direct.</p>

<ul>
<li><code>shared</code> holds types, Zod schemas, IPC channel constants and default settings.</li>
<li><code>database</code> wraps the SQLite module, migrations and individual stores.</li>
<li><code>model</code> collapses five provider kinds into one streaming event shape.</li>
<li><code>memory</code> owns writing, deduplication, retrieval and prompt formatting.</li>
<li><code>tools</code> is the registry, the path guard, the web safety policy and the concrete tools.</li>
<li><code>bot-core</code> is the runtime, the context manager, the permission manager, intent routing and the agent loop.</li>
</ul>

<p>The Electron main process in <code>apps/desktop</code> assembles those packages and exclusively owns the database, secrets, tool execution and system capabilities.</p>

<p>One conversation flows like this. The renderer calls <code>chat.send</code> through preload. The IPC layer validates the payload with Zod. The runtime's <code>startChat</code> immediately writes the user message and an empty assistant message, creates a request id and an abort controller, then runs asynchronously. Execution first judges intent. A direct answer takes one model call; a multi-step task enters the agent loop. Model events are normalized into one chat event shape and pushed back over <code>chat.event</code>. Tool calls pass through the permission manager first, results are appended to the message array, and the assistant message is persisted at the end.</p>

<p>Two database decisions deserve their own paragraphs.</p>

<p><strong>Why the built-in SQLite module.</strong> It avoids native compilation, so the installer never faces node-gyp or ABI mismatches. The cost is a synchronous API, which puts every query on the main process's single event loop.</p>

<p>Z Bot manages that in five ways: short transactions, serialized migrations, WAL mode, <code>synchronous=NORMAL</code> and a 5-second busy timeout on open. Before exit it runs a WAL checkpoint. Before a version upgrade it copies the whole database as a backup. It didn't move the database to a worker, so a long query can still stall the window and IPC.</p>

<h3>Problem 1: a synchronous database on the main process</h3>

<p><strong>Symptom.</strong> During migrations, bulk queries or checkpoints, window events and IPC responses can be blocked by the same thread. The interface looks briefly unresponsive.</p>

<p><strong>Cause.</strong> The database API is synchronous, and Z Bot deliberately gives the main process exclusive ownership without a worker or a separate database process.</p>

<p><strong>Fix.</strong> WAL raises read and write concurrency, <code>synchronous=NORMAL</code> lowers the fsync cost per commit, the busy timeout is set on open, migrations serialize inside an immediate transaction, a checkpoint runs before exit, and upgrades are guarded by the schema version with a full backup taken first.</p>

<p><strong>Cost.</strong> The root problem of a synchronous API doesn't disappear, it is confined to short transactions. A full export, an index rebuild or log searching over a large model history would still need a worker thread. This version chooses simplicity over throughput.</p>

<h2>Process boundary: what the renderer can and can't do</h2>

<p>The first rule of Electron security isn't to hand Node to a page. Z Bot's window uses context isolation, no Node integration and a sandbox. The renderer has no <code>require</code>, no <code>process</code> and no filesystem.</p>

<p>What the page can load is narrowed by CSP as well: only <code>self</code> and a custom media scheme, not arbitrary HTTPS. All web permission requests are denied by default, so camera, microphone, geolocation and notifications never open just because a page asked once.</p>

<p>Attachments are capped before saving: 25 MB each, at most 6 per message. That keeps one conversation from blowing up local storage and later requests. Attachment images are read through a custom protocol of the form <code>zbot-media://attachment/&lt;id&gt;</code>. The main process accepts only the attachment host, treats the path as an attachment id, looks it up in the database and the attachment directory, returns 404 when missing, and adds a restrictive CSP to the response.</p>

<p>The renderer therefore can't reach an arbitrary local path. It can only reach an image that is already recorded in the attachment table. That's far safer than exposing file URLs, but it also means attachments must pass through the main process first and can't be dropped into an image tag from anywhere.</p>

<p><strong>Preload is the only bridge.</strong> It exposes one API object through the context bridge, with roughly 40 methods grouped under app, chat, conversations, memory, settings, providers, web search, projects, roots, tasks, todos, reminders, home, permissions, clipboard, screenshot and events. Raw IPC is never handed over, so the page can't compose channel names or listen to arbitrary events.</p>

<p>Event subscriptions are closed off in the same way. The chat event, navigation, screenshot and theme subscriptions all return an unsubscribe function, wrapping the listener internally before removing it. That looks cosmetic and actually fixes listener leaks after React unmounts: callers can unsubscribe in an effect cleanup without remembering which function reference they passed.</p>

<p>This boundary isn't "configure once and stay safe". Add one generic invoke method to preload and the whitelist is decoration. Expose a shell open call directly to the renderer and the path guard is bypassed. Z Bot keeps every IPC channel in one registration file behind a uniform wrapper with per-channel schemas, but a few channels slipped through, and they are covered below.</p>

<h2>IPC contract: whitelist, Zod and redaction</h2>

<p>IPC registration goes through one wrapper that takes a channel, a handler and an optional schema. Each call validates the raw payload with Zod. The strict schema mode rejects extra fields, so the renderer can't smuggle unexpected properties in. A validation failure turns the issue list into a readable message. A handler throw passes through a redaction function before the message goes back to the renderer. Logs record one failure line per channel, without raw keys, tokens or cookies.</p>

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

<p>The value here is safe by default. Adding a channel forces an explicit decision about a schema, and a channel without one stays visible in review.</p>

<p>There is also an obvious gap. The third argument is optional, so two channels genuinely have no schema: the open-path channel and the search-key channel. The first only checks that the target string sits inside the data directory, and the second uses the incoming value as a string directly. Neither is the most dangerous channel, but together they show that a uniform wrapper isn't uniform validation.</p>

<h3>Problem 2: inconsistent IPC surface and validation</h3>

<p><strong>Symptom.</strong> The open-path and search-key channels have no schema. Clipboard read and screenshot capture execute over IPC without a permission prompt, while tools with the same names go through the permission manager. More subtly, the renderer never calls those two channels, so they are high-privilege surfaces that exist unused.</p>

<p><strong>Cause.</strong> IPC is the UI's fast path and tools are the model's controlled path. The two evolved separately, and the permission model only covers the second. Optional schema arguments make omissions easy.</p>

<p><strong>Fix.</strong> The open-path channel compares paths relatively instead of by naive string containment. Secret-writing channels accept only strings and go through the encrypted secret service. Logging and error messages are redacted uniformly. Clipboard and screenshot tools go through full permission confirmation, with the risk written into the prompt.</p>

<p><strong>Cost.</strong> Unused high-privilege IPC stays on the attack surface. The right move is deleting channels nobody needs, or giving them a schema and a confirmation. The repository keeps them because the UI may need them later, so this is an explicit to-do rather than a solved problem.</p>

<h3>Problem 3: secrets on disk and redaction in logs</h3>

<p><strong>Symptom.</strong> Model API keys and web search keys are sensitive. Written in plaintext or leaked into logs, even a local application exposes them.</p>

<p><strong>Cause.</strong> A desktop app has to persist keys, but the OS keychain facility is unavailable in some Windows environments. Logs, error messages and IPC payloads can all carry configuration objects.</p>

<p><strong>Fix.</strong> The secret service throws when encryption is unavailable instead of saving plaintext. The database stores the encrypted value. Outbound DTOs strip the encrypted field entirely and tell the UI only that a key is configured. The logger redacts key, password, cookie and encrypted-key fields including nested variants, and error messages get a regex pass as well.</p>

<p><strong>Cost.</strong> The OS keystore is tied to the system credential service, so keys can't be decrypted after a machine change or a broken profile, and the user has to re-enter them. Redaction is a double line of defense, field names plus regex, and it still can't guarantee that a key concatenated into an arbitrary string is caught. For a local application that is an acceptable compromise, not absolute safety.</p>

<h2>Permissions: declare first, confirm every time</h2>

<p>Registering a tool doesn't make it runnable. Every tool calls its permission declaration before executing, producing a spec with title, description, risk level, scope and operation list. The permission manager checks persisted rules first: an allow hit passes, a deny hit rejects. Only a miss creates a permission request, pushes it to the UI over a chat event, and awaits the user's decision.</p>

<pre><code>tool.run()
  -&gt; getPermission() -&gt; ToolPermissionSpec
  -&gt; PermissionManager.authorize(spec)
       -&gt; rule allow / deny
       -&gt; miss: chat.permission -&gt; wait for the UI
       -&gt; AbortSignal cancel -&gt; cancelForChat
</code></pre>

<p>Users have four choices: deny, allow once, allow for the scope, or cancel the task. Allow-once is deliberately not persisted, so the same action asks again next time. Allow-for-scope persists on the pair of tool name and scope, where the scope is usually an authorized directory or an operation type. Deny doesn't run the tool and returns a tool result saying the operation wasn't executed, so the model learns the path is blocked and the conversation doesn't collapse. Cancellation rejects every pending promise through the abort signal, so a permission dialog never hangs forever.</p>

<p>The key idea is that <strong>a denial isn't an exception</strong>. Many agent implementations throw when a tool is refused, which leaves the model blind to the reason and retrying the same action next turn. Z Bot makes denial an ordinary tool result: the model can take another route or explain why it didn't act.</p>

<p>The cost is that the model may ask for the same permission repeatedly. There is no soft "don't ask again in this conversation", only persisted deny rules.</p>

<p>Scope granularity is a separate question. Allow-for-scope binds a tool and a scope, not specific arguments. Once write access to a directory is allowed, later writes there never prompt. That matches the goal of reducing interruptions, but high-risk tools then depend on scopes designed narrowly enough. Z Bot models write, delete and batch move separately, sends deletes to the Recycle Bin and previews batch operations first, which is using tool design to compensate for permission granularity.</p>

<p>Tasks and permissions also interact. If the agent stalls while waiting for permission, the task state becomes waiting for permission. On application exit, the runtime marks running and pending tasks as paused, so a restart never automatically replays an interrupted task that may already have had side effects. That trades automatic resume for never quietly deleting or moving files again.</p>

<h2>Path safety: an authorized directory isn't a string prefix</h2>

<p>The first gate for every file tool resolves an authorized path. It rejects relative paths, drive roots, device paths and UNC shares, caps the length at 4096 bytes, and refuses embedded NUL bytes. Then it canonicalizes the target and checks containment against every authorized root's real path. Writes additionally require that root to permit writing, and the existence and kind checks verify whether the target is a file or a directory.</p>

<p>Containment must not use a string prefix. A directory named <code>Documents</code> and a sibling named <code>Documents-evil</code> differ by a suffix, and a prefix check misjudges them. Z Bot computes a relative path, rejects parent traversal and absolute escapes, and lowercases both sides on Windows before comparing. That detail is easy to miss in cross-platform code, and missing it is a directory traversal bug.</p>

<h3>Problem 4: Windows 8.3 short paths broke the test assertions</h3>

<p><strong>Symptom.</strong> A test creates a temporary directory and compares it against a canonicalized path. The two differ, and the test fails on Windows. Two commits fixed tests for exactly this.</p>

<p><strong>Cause.</strong> Windows generates 8.3 short names for long paths, so the temporary directory and its real path can come back in different forms. The test compared strings while production code canonicalized, so the test concluded the product was wrong when the assertion wasn't normalized.</p>

<p><strong>Fix.</strong> Tests normalize their expectations the same way. Production code resolves path components level by level, reattaches missing segments to the real parent, and lowercases before comparing.</p>

<p><strong>Cost.</strong> Path canonicalization is best effort, not cryptographic equivalence. Short names, casing and junctions can make two strings look different or identical. Tests have to follow platform behavior rather than assume POSIX semantics.</p>

<h3>Problem 5: symlink escapes and targets that don't exist yet</h3>

<p><strong>Symptom.</strong> Canonicalizing only the target makes a not-yet-created write path fail with a missing-file error. If the target is a junction or a symlink pointing outside the authorized directory, canonicalization lands outside the root. The two failures are opposite: one false positive, one false negative.</p>

<p><strong>Cause.</strong> Write targets often don't exist and can't be required to resolve, and a symlink can carry a path outside the authorized range after resolution, so checks are needed before and after.</p>

<p><strong>Fix.</strong> A helper walks upward from the target to the nearest existing parent, at most 64 levels, collecting missing segments, resolves that parent, then reattaches the segments in order. Roots are canonicalized too. The kind check rejects symbolic links after a link status call. A Windows system-directory blacklist rejects the system root, Program Files and similar locations.</p>

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

<p><strong>Cost.</strong> A time-of-check to time-of-use window remains. An attacker can swap a parent directory for a link between the check and the write. The 64-level cap rejects very deep paths, and the system blacklist depends on environment variables that may be missing. The guard stops ordinary mistakes and naive attacks, not a kernel-level sandbox.</p>

<h2>The agent loop: when to answer, when to act</h2>

<p>The first step of starting a chat isn't calling the model. It's persisting. The runtime confirms or creates the conversation, writes the user message, updates the title, and writes an empty assistant message. Then it creates the request id and abort controller, emits a started event, and runs asynchronously.</p>

<p>That ordering guarantees the user message and a failure placeholder exist even if the model call fails, so the interface never shows a message that was sent but is missing from history.</p>

<p>Two shortcuts sit at the entrance. The first is an explicit memory pattern: sentences that begin with "remember" go straight to memory writing without a model call. The second is intent routing: short sentences, greetings and questions take the direct path, while todos, reminders, files, web requests and long sentences take the agent path. Routing isn't a semantic classifier but an ordered set of regular expressions, which is cheap, testable, needs no extra model call, and is occasionally wrong.</p>

<p>Direct mode calls the model once, which suits "explain this concept" or "write one line of copy". Agent mode loops: the model emits text and tool calls, results are appended to the message array, the model is called again, and the loop ends when there are no more tool calls or a cap is reached.</p>

<p>The loop allows at most 20 steps, 30 tool calls and a 5-minute total timeout. Usage and retry counts accumulate on the task record. If a tool result fails its own verification, the step is marked failed rather than pretending success.</p>

<h3>Problem 6: the boundary of regular-expression routing</h3>

<p><strong>Symptom.</strong> Routing depends only on keywords and sentence length. A chatty sentence containing the word "file" can enter the agent, while a long sentence with no keyword that genuinely needs several steps can be misrouted.</p>

<p><strong>Cause.</strong> There is no trained classifier and no model call to judge intent first. Regular expressions plus an 80-character threshold were chosen to save a call and reduce latency.</p>

<p><strong>Fix.</strong> High-frequency intents became separate patterns, matched in a fixed order: memory, todo, reminder, web, system, file, recall, image, greeting, question, short sentence. Explicit memory and shortcuts short-circuit before routing. Long or unclassifiable requests default to the agent, spending one extra tool loop rather than treating a multi-step task as chat.</p>

<p><strong>Cost.</strong> Pattern maintenance grows with every intent, and mixed Chinese and English or colloquial phrasing slips through. The 80-character threshold is empirical, not semantic. A small local classifier could replace this layer later; that has not been done.</p>

<h2>Context budget: how 72,000 characters get spent</h2>

<p>Z Bot doesn't stuff the whole history into the prompt. The context manager loads the project, the authorized roots and the relevant memories, assembles the system prompt, and then fills history against a character budget.</p>

<p>The total budget is 72,000 characters. History holds at most 20 messages, newest first, and any single message is truncated to 8,000 characters. The current user input is cut at 20,000. OCR text is capped at 24,000 characters and wrapped in a tag that tells the model plainly it is untrusted data rather than instructions.</p>

<p>Memory retrieval uses the first 500 characters of the current question as the query and takes 8 full-text hits. If fewer than four arrive, it tops up with the four most recent by project and time, deduplicates, and caps at eight. Ordering is by BM25 ascending, then importance descending, then update time descending. The strategy is conservative: give a few recent memories rather than let the model answer with none.</p>

<p>History loading is short code with a clear boundary.</p>

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

<p><strong>Symptom.</strong> When a single historical message is longer than the remaining budget, the loop breaks and no older messages load at all. One long old reply truncates the entire history instead of being skipped.</p>

<p><strong>Cause.</strong> The implementation chose to load continuously from newest backwards, which keeps the context as one contiguous run with no holes. The cheapest way to handle a message that doesn't fit is to stop.</p>

<p><strong>Fix.</strong> Each message is truncated to 8,000 characters first, which lowers the chance of hitting the case at all. The system prompt and memories are kept inside the budget. The current user message is truncated separately and never competes with history.</p>

<p><strong>Cost.</strong> This is a known rough edge. Skipping the oversized message and continuing with older ones would be more reasonable, and budgeting in tokens rather than characters would be more accurate. Neither is done, because contiguous history helps the model and the 8,000-character cut already excludes most cases.</p>

<p>Character budgets carry another error. Chinese, English and code have different token densities, so 72,000 characters isn't 72,000 tokens. Characters were chosen because they can be estimated cheaply without a tokenizer, at the risk of occasionally exceeding the model window. Provider errors surface in the interface as model error codes, so the user sees the failure rather than a silently dropped message.</p>

<h2>The model layer: streaming, retries and the fallback boundary</h2>

<p>The provider layer wraps OpenAI, OpenAI-compatible endpoints, Anthropic, Google and Ollama. The first four use official or compatible SDKs. Ollama goes through the OpenAI-compatible interface, at the usual local address by default.</p>

<p>The AI SDK's streaming call performs the request, and Z Bot normalizes its output into its own events: text delta, tool call, finish, usage, error and aborted. The agent above never needs to know which provider is in use or how each one streams.</p>

<p>The retry policy is at most three attempts per provider, with backoff of 500 ms, 1000 ms and 2000 ms. The SDK's own retry is set to zero, so a second layer doesn't retry underneath. Only retryable errors retry; configuration failures such as a missing key or a missing base URL fail immediately. The fallback model is used only after every primary attempt fails, and never once text has already been emitted.</p>

<pre><code>const retryable = normalized instanceof ModelRequestError ? normalized.retryable : true;
if (!retryable || attemptNumber &gt;= maxAttempts || textEmittedRef.value) {
  break;
}
retries += 1;
await delay(500 * 2 ** (retries - 1), signal);
</code></pre>

<h3>Problem 8: retries duplicated text in the interface</h3>

<p><strong>Symptom.</strong> Streaming has already produced a few words, the request fails midway, the retry answers from the beginning, and the interface shows partial text followed by a complete answer.</p>

<p><strong>Cause.</strong> Retry logic cared only about "the request failed" and not about whether visible deltas had already been emitted. The SDK could also retry internally and amplify it.</p>

<p><strong>Fix.</strong> A flag records whether this attempt emitted any text delta. Once true, the current provider may not retry and fallback is forbidden. The provider sets its own retry count to zero, concentrating retries in one layer.</p>

<p><strong>Cost.</strong> Emitted partial text isn't retracted, so a user may see half a sentence followed by an error. And if the model fails after a tool call, retry is also forbidden and the task simply fails. This buys "no duplicates" over "always succeed", which is the right trade for chat.</p>

<p>The 5-minute overall timeout is a second gate covering the whole conversation rather than one request. When it fires, the abort controller cancels the running stream, permission waits and tool execution, and the run is marked cancelled rather than treated as a successful partial answer.</p>

<h2>Memory: no vector store, full-text search first</h2>

<p>Memory has five kinds: user, project, event, task and global. Rows live in a strict memories table holding content, kind, project id, importance, confidence, expiry and archive time. Tags live in a separate table with cascading deletes. Retrieval uses an FTS5 virtual table, contentless-linked to the memories table, kept in sync by three triggers for insert, update and delete.</p>

<p>Chinese retrieval is the most underrated problem in this area. The default FTS5 tokenizer targets space-separated languages, so a whole Chinese sentence tends to become a single token and a query matches only an exact phrase. Z Bot switches to the trigram tokenizer, indexing three-character windows so phrases can be matched partially. Queries shorter than three characters can't use FTS, so they degrade to a substring scan.</p>

<pre><code>CREATE VIRTUAL TABLE memories_fts USING fts5(
  content,
  content='memories',
  content_rowid='rowid',
  tokenize='trigram'
);
</code></pre>

<h3>Problem 9: the default FTS5 tokenizer doesn't split Chinese</h3>

<p><strong>Symptom.</strong> English keywords match and whole Chinese sentences don't. After switching the tokenizer to trigram, two-character queries stop matching entirely.</p>

<p><strong>Cause.</strong> The default tokenizer expects spaces, and Chinese has none. The trigram tokenizer needs at least three characters to build a window.</p>

<p><strong>Fix.</strong> The table is created with the trigram tokenizer. Queries of three or more characters use a full-text match with the query quoted and inner quotes escaped. Shorter queries use a case-folded substring scan. A test covers the degraded path specifically with a two-character word.</p>

<p><strong>Cost.</strong> A trigram index is larger than the default and costs more on write. Two-character queries become full scans and get slower as memory grows. There are no synonyms, no pinyin and no semantic recall, so "go live" and "release" stay unconnected. Version 0.1 accepts those limits and defers a vector store.</p>

<p>Memory has exactly two write paths. The entry pattern recognizes an explicit "remember" instruction and writes directly, or the model calls the remember tool during a conversation. The second is gated by an auto-extract switch; with it off, the model can't write on its own. There is no post-conversation extraction pass, deliberately, because that needs extra model calls plus handling for duplicates and hallucination. Version 0.1 first makes "the user explicitly said remember" reliable.</p>

<p>Deduplication is exact equality after normalization: same kind, same project, and equal case-folded trimmed content. A hit takes the larger of importance and confidence and merges tags. There is no semantic dedupe and no decay scoring. Expiry only archives rows, with no time-decayed ranking. Retrieval orders by BM25, then importance, then update time, which is simple, explainable and fast enough.</p>

<p>This system is closer to an index than to a brain. It doesn't summarize conversations, and a memory that went unused never loses weight. Its strength is that every item can be seen, edited and deleted in the interface, so a user can explain why the model mentioned something. For a personal assistant, explainability matters more than recall.</p>

<h2>Reminder scheduling: the ceiling of the timer</h2>

<p>The scheduler is light. Each enabled reminder gets one timer, and a refresh call clears every timer and re-plans when the app starts or a reminder changes. A fired reminder writes an event, sends a Windows notification according to settings, and computes the next trigger. One-off reminders are disabled, and recurring ones advance to the next future moment.</p>

<p>The problem is the timer ceiling. Node's timer delay overflows above 2^31 minus 1 milliseconds, which is about 24.8 days, and an overflowing delay fires immediately. Z Bot clamps to just under that value, sleeps one segment, then re-reads the reminder and re-plans, forming a chain.</p>

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

<h3>Problem 10: long reminders overflowed the timer</h3>

<p><strong>Symptom.</strong> A reminder set a month out fires immediately after startup.</p>

<p><strong>Cause.</strong> The timer delay is a signed 32-bit value. Past the maximum it wraps to a negative number or zero, and the timer runs at once.</p>

<p><strong>Fix.</strong> Sleep one segment and re-read the reminder in the callback. Treat a negative delay as zero so an already-overdue reminder fires once. Disable one-off reminders after firing, and advance recurring ones instead of replaying missed occurrences.</p>

<p><strong>Cost.</strong> Chained re-planning requires the process to stay alive. A full exit loses the timers and missed reminders never fire, which the README states plainly. It doesn't use Windows Task Scheduler, and it doesn't scan at startup for reminders that should have fired in the last 24 hours, because catch-up policy is a product decision, whether to fire once or fire every missed occurrence, and version 0.1 declines to choose.</p>

<p>There is one more boundary. At startup a negative delay fires immediately. For a one-off reminder that surfaces an overdue item. For a recurring one it fires the current occurrence and advances, without replaying every missed day. The semantics are right, but a user expecting a full catch-up will feel one is missing.</p>

<h2>Proactive checks and task recovery</h2>

<p>The proactive service handles project-stall reminders. It checks ten seconds after start and then every six hours. A running flag prevents re-entry, so a second check can't stack on the first.</p>

<p>Each pass reads 400 events and finds the latest inactivity notification per project. If that notification is newer than the project's latest activity, the project is skipped. Otherwise the threshold decides. The default threshold is seven days, and a directory modification time counts as activity only when the directory is inside an authorized root.</p>

<p>The deduplication solves "notify the same stalled project on every pass". It compares the last notification time with the latest activity time: activity after a notification restarts the clock, and silence since then stops repeats. The cost is that the event table has to retain enough history. Four hundred rows is an empirical cap, and a busy event stream can squeeze out old records and cause a duplicate notification.</p>

<p>Task recovery is the other half. On exit, the runtime marks running and pending tasks as paused, and nothing resumes automatically. Agent tasks can have side effects: writing files, moving files, deleting to the Recycle Bin, sending notifications. Replaying them after a restart could delete or move twice, which is far worse than a task sitting paused.</p>

<h3>Problem 11: side effects replayed after a restart</h3>

<p><strong>Symptom.</strong> The app closes halfway through a task, and resuming from the stored state on restart can execute a tool call a second time.</p>

<p><strong>Cause.</strong> Task state and tool-call records persist, but "which step ran" and "whether the side effect happened" have no transactional link, so the model can replay a tool.</p>

<p><strong>Fix.</strong> On startup the runtime marks interrupted tasks as paused, and tasks waiting on permission become waiting-for-permission. Nothing resumes automatically; the user confirms and re-issues. Tools add idempotency of their own: writes carry content hashes, moves and deletes preview first, and deletes go to the Recycle Bin.</p>

<p><strong>Cost.</strong> Users lose automatic resume, and a long interrupted task must be described again. Paused tasks have no one-click resume. That's safety over completeness.</p>

<p>Tray residency, minimize-on-close, single instance and launch at login are the foundation of that residency. A single-instance lock makes a second launch exit and focus the existing window. Closing the window minimizes to the tray, and only an explicit quit ends the process. That gives reminders and proactive checks somewhere to run, and it makes it easy for a user to think the app already exited.</p>

<h2>Windows integration: notifications, OCR and the tray</h2>

<p>Windows notifications are mandatory for a desktop assistant, and they are the classic case of correct code that produces no visible result.</p>

<p>Z Bot sets the app user model id at startup, which is the prerequisite for Windows notifications. Before sending, it checks whether notifications are supported and returns false instead of throwing. A click can navigate, so a reminder opens the home page and a stalled project opens memory.</p>

<h3>Problem 12: Windows notifications never appeared</h3>

<p><strong>Symptom.</strong> A reminder fires, the log shows it fired, and no desktop notification appears.</p>

<p><strong>Cause.</strong> Windows needs the correct app user model id or it can't attribute the notification. Focus assist, disabled notification permissions, or a tray process that isn't running also suppress it silently.</p>

<p><strong>Fix.</strong> Set the model id in the main process, check support before showing, and document the diagnostic steps: system notification settings, focus assist, and whether the app is running in the tray.</p>

<p><strong>Cost.</strong> Support checks report platform capability, not whether the user muted notifications. There is no in-app banner fallback, so a reminder can be missed. That's a blank spot in this version.</p>

<p>OCR better illustrates how plans change. The repository ends up using the OCR engine built into Windows, called through a PowerShell child process with no profile, no interaction, a bypassed execution policy and a hidden window. The call has a 30-second timeout and a 1 MB output buffer. Results are written to a temporary file, read back, clipped to 20,000 characters, and a failure returns null so the vision model can take over.</p>

<h3>Problem 13: OCR moved from Tesseract to the system engine</h3>

<p><strong>Symptom.</strong> The project started with Tesseract, and the build configuration still carries a plugin that copies the Tesseract data package, while runtime code no longer references it.</p>

<p><strong>Cause.</strong> Tesseract needs extra language data and native dependencies, with unfavourable size, startup time and Chinese accuracy. Windows 10 and 11 ship an OCR engine with language packs already installed, and calling it is lighter.</p>

<p><strong>Fix.</strong> Move to a PowerShell child process driving the system OCR API, packaging the script as a resource. Return null on failure so the vision model handles it. Hide the window and cap the timeout and the output size so the main process can't hang.</p>

<p><strong>Cost.</strong> The child process has startup overhead, and 30 seconds may be too short for very large images. It depends on Windows language packs, so Chinese recognition can fail on a system without them. The leftover Tesseract build configuration is technical debt: harmless at runtime, misleading to the next reader.</p>

<p>The tray and the shortcuts are the last piece. The tray menu offers show, quick ask and quit. One shortcut opens quick ask, another captures the primary screen into the chat. Single instance and launch at login keep those entry points stable, which also means the lifetime is longer than a normal window application. Quit order therefore matters: stop the scheduler, stop the proactive service, close the database, and checkpoint the WAL, in that sequence.</p>

<h2>Tests and packaging</h2>

<p>The 32 unit tests cover what is easy to get wrong and hard to notice afterwards: short paths and symlinks in the path guard, exact memory deduplication, reminder recurrence rules, provider event normalization, runtime permission denial, and project-stall deduplication. Two end-to-end tests cover starting a real window and a basic conversation. The suite is small, but each case maps to a real hole, which is worth more than a coverage number.</p>

<p>Packaging is another category of trap. Automated releases ship only the portable build and the MSI, because the NSIS uninstaller gets locked by antivirus during the build. Unsigned Windows installers trigger SmartScreen, which asks the user for one extra click. Playwright and jsdom sit in runtime dependencies and inflate the installer, and the repository has no measured size, so this post states the cost without inventing a number.</p>

<h3>Problem 14: NSIS locked and runtime dependencies bloated</h3>

<p><strong>Symptom.</strong> The NSIS installer never reaches release artifacts, only the portable build and the MSI. The installer is also larger than expected.</p>

<p><strong>Cause.</strong> The NSIS uninstaller is held or locked by antivirus during the build. Playwright and jsdom, which belong in tests or tooling, were written into runtime dependencies, so the packager bundles them.</p>

<p><strong>Fix.</strong> The release script builds portable and MSI directly, bypassing NSIS. ASAR packaging is enabled. The signing gap is documented rather than pretended away. Dependency cleanup, meaning moving test-only packages to development dependencies or excluding them in the bundler, is deferred.</p>

<p><strong>Cost.</strong> Without NSIS there is no classic setup wizard or Start Menu uninstall entry, only the portable build or the MSI. Unsigned builds warn in SmartScreen. And no size measurement exists to judge the benefit. All three remain open.</p>

<h2>Closing</h2>

<p>Z Bot compresses into four sentences.</p>

<ol>
<li><strong>Keep dangerous capability in the main process.</strong> The database, keys, tools and system calls never enter the renderer, and preload exposes only whitelisted methods.</li>
<li><strong>Make permissions a flow rather than a switch.</strong> Tools declare a spec, matching rules pass, misses wait for the user, and denial becomes a tool result rather than an exception.</li>
<li><strong>Write the budgets down.</strong> Seventy-two thousand context characters, 20 history messages, 8 memories, 20 agent steps, 30 tool calls, 5 minutes, and a 24.8-day timer ceiling. Numbers can be audited; intentions can't.</li>
<li><strong>Make memory an explainable index.</strong> Full-text search with trigrams, exact deduplication, archival on expiry, and no vector store.</li>
</ol>

<p>Its value isn't the feature count but that every feature has a traceable boundary: which step runs in the main process, which needs authorization, which can fail, and what the user sees when it does. Its rough edges are equally explicit. An oversized history message ends the loop, some IPC lacks validation, OCR build configuration is stale, NSIS and signing are unresolved, and reminders don't catch up after a full exit. Writing those down beats pretending they don't exist.</p>

<p>If you are building a desktop agent, copy these three first: main-process exclusivity with a whitelisted preload, the declare-check-wait permission flow, and canonicalization in the path guard. Context budgets, memory retrieval and scheduling can be tuned to your own product.</p>

<h2>Further reading</h2>

<ul>
<li><a href="/article/agent-memory-without-vector-db/">Agent memory without a vector database</a></li>
<li><a href="/article/agent-prompt-injection-boundary/">Where the prompt-injection boundary sits in an agent</a></li>
<li><a href="/article/agent-concurrency-without-async/">Agent concurrency without an async runtime</a></li>
<li><a href="/article/metrics-and-distributed-tracing/">Metrics and distributed tracing, from instrumentation to debugging</a></li>
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
<p>Don't go looking for a game. Just start one. That's the pitch for Happy Games, a browser arcade written in plain HTML, CSS and JavaScript: 24 games, zero frameworks, zero build steps, zero dependencies. The AI ranges from pattern scoring to WebAssembly, multiplayer runs on D1 plus polling, narration streams from a language model, and the whole site deploys to Cloudflare Pages in one command.</p>

<p><strong>Play:</strong> <a href="https://happygames.pages.dev" rel="noopener noreferrer" target="_blank">happygames.pages.dev</a> · <strong>Source:</strong> <a href="https://github.com/zhoujungis/happy_games" rel="noopener noreferrer" target="_blank">github.com/zhoujungis/happy_games</a></p>

<h2>Why another mini-game collection</h2>

<p>The web doesn't lack game portals. It lacks a <strong>sample project that can be read end to end and cloned in one click</strong>. Happy Games is positioned as three things:</p>

<ol>
<li><strong>A teaching sample.</strong> Every folder runs on its own. There is no "install 300 MB of node_modules, then work through five layers of abstraction" tax.</li>
<li><strong>Real technical depth.</strong> Under the zero-framework constraint it still covers AI from heuristics to a WASM engine, realtime multiplayer, streamed narration, accounts and end-to-end tests.</li>
<li><strong>Deployable.</strong> The whole site is static files plus Cloudflare Pages Functions and D1. No containers, no servers, one wrangler command.</li>
</ol>

<p>Read this if you want a starting scaffold for a browser game, a real case of organizing a large frontend without a framework, a minimal full stack on the Cloudflare stack, or simply ten minutes of play.</p>

<h2>Thirty-second overview</h2>

<table>
<thead><tr><th>Dimension</th><th>Key fact</th></tr></thead>
<tbody>
<tr><td><strong>Games</strong></td><td><strong>24</strong>, across four sections: board games 6, puzzles 6, casual 6, Chinese history 6</td></tr>
<tr><td><strong>Constraints</strong></td><td>Native HTML, CSS and JavaScript with ES modules. <strong>No framework, no build, no dependencies.</strong> Double-click an HTML file to run it locally</td></tr>
<tr><td><strong>AI</strong></td><td>Pattern scoring for gomoku, alpha-beta pruning for Chinese chess, GNU Go compiled to WebAssembly for Go, three difficulty tiers for jungle chess and reversi</td></tr>
<tr><td><strong>Multiplayer</strong></td><td>Aeroplane chess for 2 to 4 players in real time, rooms with passwords, D1 state, polling sync, AI seats for missing players</td></tr>
<tr><td><strong>Narration</strong></td><td>Life simulation and the history brawl call OpenRouter, with the server proxying server-sent events to the browser</td></tr>
<tr><td><strong>Backend</strong></td><td>Cloudflare Pages Functions, where the file path is the route, plus D1 as a SQLite database</td></tr>
<tr><td><strong>Tests</strong></td><td>The Node test runner over 25 files and 288 cases on pure functions and engines, plus Playwright smoke tests on desktop and mobile</td></tr>
<tr><td><strong>Deploy</strong></td><td>One npm script that runs a Pages deploy of the whole site, with layered caching configured in a headers file</td></tr>
<tr><td><strong>Design rules</strong></td><td>Self-contained folders, pure-function isolation, a data-driven home page, offline capability</td></tr>
</tbody>
</table>

<h3>The four sections</h3>

<table>
<thead><tr><th>Section</th><th>Theme</th><th>The six games</th></tr></thead>
<tbody>
<tr><td><strong>Board games</strong></td><td>Strategy on a small board</td><td>Gomoku, <strong>Chinese chess</strong>, <strong>Go (GNU Go in WASM)</strong>, jungle chess, reversi, <strong>aeroplane chess (multiplayer)</strong></td></tr>
<tr><td><strong>Puzzles</strong></td><td>Logic and deduction</td><td>Rule blocks, light refraction, sudoku, maze escape, echo walker, sokoban</td></tr>
<tr><td><strong>Casual</strong></td><td>Pick up and play</td><td>Spark survivors, <strong>life simulation (AI narration)</strong>, flappy bird, hiking sim, jump jump, stack tower</td></tr>
<tr><td><strong>Chinese history</strong></td><td>Figures and institutions</td><td>Seven days of decree, Chinese merchant, Tang magistrate, guess the emperor, <strong>history brawl (AI judge)</strong>, imperial exam</td></tr>
</tbody>
</table>

<h2>All 24 games</h2>

<h3>Board games</h3>

<table>
<thead><tr><th>Game</th><th>One line</th><th>The hard part</th></tr></thead>
<tbody>
<tr><td><strong>Gomoku</strong></td><td>15 by 15 against the computer</td><td>The AI scores eight pattern weights, with five in a row at 100000, an open four at 10000, a four-three at 1000 and so on. Three difficulties map to different search depths</td></tr>
<tr><td><strong>Chinese chess</strong></td><td>Human versus machine</td><td>A port of the open-source engine: move generation from piece rules, nine piece-square value tables with values such as horse 3.5, rook 9 and cannon 4.5, and alpha-beta search. The server also offers a model-based move proxy as a fallback</td></tr>
<tr><td><strong>Go</strong></td><td>Human versus machine</td><td><strong>GNU Go compiled to WebAssembly at about 8.7 MB</strong>, running asynchronously in a web worker with a Komi of 7.5. The main thread talks to it through init, play and generate-move messages, with colour normalization and a crash move log</td></tr>
<tr><td><strong>Jungle chess</strong></td><td>River and trap rules</td><td>Elephant beats lion, rat beats elephant, rivers and traps, three AI tiers, and animal emoji on the pieces</td></tr>
<tr><td><strong>Reversi</strong></td><td>Eight-direction flipping</td><td>Three AI tiers plus undo</td></tr>
<tr><td><strong>Aeroplane chess</strong></td><td>The only multiplayer game</td><td>2 to 4 players in real time, classic roll, jump and fly rules, and AI filling empty seats so a table can start at any time</td></tr>
</tbody>
</table>

<h3>Puzzles</h3>

<table>
<thead><tr><th>Game</th><th>One line</th><th>Highlight</th></tr></thead>
<tbody>
<tr><td><strong>Rule blocks</strong></td><td>Push words to rewrite the rules, such as "wall is stop" or "water is sink"</td><td>Inspired by Baba Is You. A live panel shows the rules in effect, with multiple levels plus undo and reset. The goal is to make any "you" meet any "win"</td></tr>
<tr><td><strong>Light refraction</strong></td><td>Rotate mirrors and splitters to light the crystals</td><td>A dark grid, 45-degree rotation, and a physics puzzle built on laser splitting</td></tr>
<tr><td><strong>Sudoku</strong></td><td>Classic 9 by 9</td><td>Three difficulties, a timed challenge, pencil marks and conflict highlighting, on an off-white board</td></tr>
<tr><td><strong>Maze escape</strong></td><td>Cross a random maze against the clock</td><td>Higher difficulty means larger, twistier mazes, and a new map every round</td></tr>
<tr><td><strong>Echo walker</strong></td><td>Every six steps, your old path becomes an echo that chases you</td><td>A shadow mechanic: collect seals while avoiding your past self. Almost no tolerance for a bad route</td></tr>
<tr><td><strong>Sokoban</strong></td><td>Fifteen hand-built levels</td><td>Gradual difficulty and a warm retro floor palette</td></tr>
</tbody>
</table>

<h3>Casual</h3>

<table>
<thead><tr><th>Game</th><th>One line</th><th>Highlight</th></tr></thead>
<tbody>
<tr><td><strong>Spark survivors</strong></td><td>A vampire-survivors-like</td><td>Characters fire automatically, kills drop experience, and a three-choice upgrade offers fire rate, projectiles, armour and more. The build decides how many waves you survive</td></tr>
<tr><td><strong>Life simulation</strong></td><td>A text life sim</td><td>Allocate talents such as intellect, physique and fortune. The AI streams six chapters from childhood through a final verdict, ending with a life score from 0 to 100</td></tr>
<tr><td><strong>Flappy bird</strong></td><td>Tap to fly through pipes</td><td>Blue sky, green grass, classic feel, and a longer flight the better you get</td></tr>
<tr><td><strong>Hiking sim</strong></td><td>Three real routes: the Aotai traverse, the Gongga loop and the Wusun trail</td><td>Terrain, supplies, altitude and weather, all in a browser hiking simulator</td></tr>
<tr><td><strong>Jump jump</strong></td><td>Hold to charge, release to jump onto the next platform</td><td>A landing dead centre gives a combo bonus, and the subtle physics is the whole point</td></tr>
<tr><td><strong>Stack tower</strong></td><td>Drop swinging blocks precisely</td><td>Better alignment builds a taller tower, with overhang trimming and rising speed</td></tr>
</tbody>
</table>

<h3>Chinese history</h3>

<table>
<thead><tr><th>Game</th><th>One line</th><th>Highlight</th></tr></thead>
<tbody>
<tr><td><strong>Seven days of decree</strong></td><td>Complete an imperial decree in seven days</td><td>Three actions per day across seven resources: silver, grain, public support, order, gentry, reputation and intelligence. Report after three actions, settle on day seven against your record of governance</td></tr>
<tr><td><strong>Chinese merchant</strong></td><td>Trade across famous cities</td><td>Compete for wealth against three AI merchants, with prices and rival strategies shifting as you go</td></tr>
<tr><td><strong>Tang magistrate</strong></td><td>Run a county for twelve seasons, three years</td><td>Farms, markets and random events, balancing tax revenue, public support, the granary and public order</td></tr>
<tr><td><strong>Guess the emperor</strong></td><td>Identify one of more than 200 emperors</td><td>Unlimited guesses. The first few give conventional clues; from the fifth onward there is a 50 percent chance of revealing an attribute comparison directly</td></tr>
<tr><td><strong>History brawl</strong></td><td>Two players draft, an AI judges</td><td>A random dynasty, ten posts to fill with historical figures, and an AI that judges in the order dynasty fit, then role fit, then actual ability, then lineup synergy, in a storyteller's voice</td></tr>
<tr><td><strong>Imperial exam</strong></td><td>Seven stages, three multiple-choice questions each</td><td>Classics, history and ancient institutions. One wrong answer ends the run, and placing in the top three is the ultimate romantic ending</td></tr>
</tbody>
</table>

<h2>The hard parts</h2>
<h3>Four levels of AI, from pattern scoring to WebAssembly</h3>

<p>The AI here is never "pick a random move". It spans four technical levels.</p>

<p><strong>One: pattern scoring, in gomoku.</strong> Eight directions scan the board shapes, and each shape is scored.</p>

<table>
<thead><tr><th>Pattern</th><th>Score</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>Five in a row</td><td>100000</td><td>Already won</td></tr>
<tr><td>Open four</td><td>10000</td><td>Four with both ends open, a forced win</td></tr>
<tr><td>Blocked four, open three</td><td>1000</td><td>Four blocked at one end, or three open at both</td></tr>
<tr><td>Blocked three, open two</td><td>100</td><td>Three blocked at one end, or two open</td></tr>
<tr><td>Two</td><td>10</td><td></td></tr>
<tr><td>Single stone</td><td>1</td><td></td></tr>
</tbody>
</table>

<p>Difficulty controls search depth. The easy level looks one move ahead and can slip; the hard level looks several ahead and prefers blocking your open three over completing its own blocked four. All of it is pure functions, so the test runner exercises it directly.</p>

<p><strong>Two: alpha-beta pruning, in Chinese chess.</strong> The engine is ported from an MIT-licensed open-source project, keeping the core: move generation per piece rule, including horse legs, elephant eyes and palace diagonals; piece-square value tables capturing what a piece is worth on each square, such as a pawn before and after crossing the river; and alpha-beta search with position evaluation, pruning branches that can't beat the best line found so far.</p>

<p>Board logic and the AI engine are fully separated. The server also exposes a model-based move proxy as a fallback, for the extreme positions where the local engine can't produce a move in time.</p>

<p><strong>Three: GNU Go compiled to WebAssembly, for Go.</strong> This is the hardest technical path in the project. The open-source GNU Go engine is compiled to WebAssembly at about 8.7 MB and runs inside a web worker, communicating with the main thread over a small message protocol.</p>

<pre><code>main to worker:  { cmd: 'init', size, seed }    start a game with Komi 7.5
main to worker:  { cmd: 'play', i, j }          the player moves
main to worker:  { cmd: 'genmove' }             the engine thinks and moves
worker to main:  { ok, cmd, board, last }       board snapshot, colour-normalized
</code></pre>

<p>The worker also does three things that matter. <strong>Colour normalization</strong> makes the player's colour map to one and the opponent to two after the first move, independent of the engine's internal constants, so rendering stays consistent. A <strong>move log</strong> records every coordinate, so a crashed game can be replayed. And standard output and error are captured through the module's print hooks, which makes diagnosis possible.</p>

<p>A world-class board engine running in the browser without blocking the main thread is a complete demonstration that a frontend can host heavy AI.</p>

<p><strong>Four: three difficulty tiers, in jungle chess and reversi.</strong> Both split AI by search depth into three tiers, and reversi adds undo. Same pure-function approach, fully unit-testable.</p>

<h3>Aeroplane chess: realtime multiplayer on D1</h3>

<p>The only multiplayer game among the 24, and its architecture has three layers.</p>

<pre><code>create or join  →  advance state (roll, move, start)  →  polling sync
      │                       │                                │
      ▼                       ▼                                ▼
create and join          roll and move              the client polls every 1.5s in
endpoints                and start                  game, every 2s in the lobby;
                                                    the server runs tick() to advance
                                                    AI turns before responding
</code></pre>

<ul>
<li><strong>Rooms.</strong> One endpoint creates a password-protected room and another joins it. Room state serializes as JSON into a single D1 row holding the code, the password, the state blob and timestamps.</li>
<li><strong>State advance.</strong> Every move is validated server-side, which stops cheating. Empty seats are driven by server-side AI, so a table can start with one human.</li>
<li><strong>Polling.</strong> The client periodically fetches state. Before responding, the server runs one tick to advance AI turns, so a player always sees the newest position with everyone else's moves already applied.</li>
</ul>

<p>D1 is both database and cache here. It's simple enough, and it avoids the operational cost of WebSockets.</p>

<h3>Streamed AI narration</h3>

<p>Life simulation and the history brawl bring a language model into the game, with the server proxying server-sent events.</p>

<p><strong>Life simulation.</strong> After the player allocates birth attributes, the frontend posts them. The server calls OpenRouter and forwards the event stream verbatim to the browser. Six chapters, childhood through a final verdict, generate character by character, so it reads like someone telling a story on the other side of the screen. A rate limit triggers automatic backoff, up to three attempts with a growing interval, and the prompt pins the output shape: 130 to 180 characters per chapter, and a final line that states a life score.</p>

<p>The prompt constraints are explicit.</p>

<pre><code>You are the randomising AI of a Chinese life simulator. Output exactly six headings,
one per line: childhood, youth, adulthood, middle age, later life, verdict.
The first five are 130-180 characters each and must include concrete events in that
stage, their impact, and how they change the next stage. The final section must begin
with a life score from 0 to 100.
</code></pre>

<p><strong>History brawl.</strong> Two players take turns drafting historical figures for ten posts, such as vanguard or logistics. When drafting finishes, they ask the AI judge. The AI scores ten matchups in the order dynasty fit, then role fit, then actual ability, then lineup synergy, with each round precise to one decimal and every round summing to ten. The voice is a storyteller's, and the answer also streams.</p>

<blockquote>
<p>Both are lightweight patterns for combining a game with a language model. The server only authenticates, rate-limits and forwards the stream, and never stores model state. The client consumes standard events, and a failure doesn't block the game loop.</p>
</blockquote>

<h3>Accounts and the admin console</h3>

<ul>
<li><strong>Register, log in, log out.</strong> Passwords live in a D1 users table holding the username as primary key, the password and a creation timestamp. Sessions use a random token in a cookie with a 30-day expiry check.</li>
<li><strong>Current user.</strong> One endpoint reports the login state, which the home page uses to show the username and a logout link. The admin account unlocks a hidden console entry point.</li>
<li><strong>Middleware.</strong> A shared middleware redirects unauthenticated HTML requests to the login page, while static assets and API routes pass through. Admin paths check the username as well and return 403 otherwise.</li>
<li><strong>Admin endpoints.</strong> A user list and game statistics.</li>
</ul>

<h3>Fast, without trying</h3>

<ul>
<li><strong>Zero dependencies and zero build.</strong> Static assets open immediately, with no bundle to download first.</li>
<li><strong>Layered caching</strong> in the headers file. CSS, JavaScript and module files get five minutes of strong caching plus a day of stale-while-revalidate. WebAssembly gets seven days and is marked immutable, so the Go engine loads once and stays cached. Images get a day, with a week of background refresh.</li>
<li><strong>The home page</strong> picks three random games as recommendations on every visit and offers a "start something random" button, which is a small cure for decision paralysis.</li>
<li><strong>Responsive layout</strong> with breakpoints at 850 and 600 pixels, touch and keyboard input, and playability on phone and desktop.</li>
<li><strong>A shared runtime</strong> manages lifecycle, score and event reporting for every game, and a failure there never blocks the game loop.</li>
</ul>

<h2>Stack</h2>

<table>
<thead><tr><th>Layer</th><th>Technology</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>Frontend</td><td>Native HTML, CSS and JavaScript with ES modules</td><td>No framework, no build, no dependencies. A shared stylesheet defines the whole visual vocabulary: ink, vermilion, gold and jade</td></tr>
<tr><td>Board rendering</td><td>Hand-written SVG and canvas</td><td>Depends on the game. Pure-function preview images come from the landing module</td></tr>
<tr><td>AI</td><td>GNU Go in WebAssembly, alpha-beta pruning, pattern scoring, minimax</td><td>A world-class engine inside the browser</td></tr>
<tr><td>Cloud AI</td><td>OpenRouter for streamed narration, a model provider for the chess move proxy</td><td>Server-sent events, proxied</td></tr>
<tr><td>Backend</td><td>Cloudflare Pages Functions</td><td>The file path becomes the route, with no configuration</td></tr>
<tr><td>Database</td><td>Cloudflare D1</td><td>Seven tables: users, sessions, battle rooms, aeroplane rooms, game sessions, game events and game scores</td></tr>
<tr><td>Tests</td><td>Node's built-in runner plus Playwright</td><td>288 cases on pure functions, plus browser smoke tests</td></tr>
<tr><td>Deploy</td><td>Cloudflare Pages</td><td>The wrangler config binds Pages and D1</td></tr>
<tr><td>Caching</td><td>A headers file and a routes file</td><td>Fine-grained control, and static assets skip Functions entirely</td></tr>
</tbody>
</table>

<h2>Architecture</h2>
<h3>Frontend: self-contained folders and a data-driven home</h3>

<pre><code>index.html          home: section cards, daily picks, start something random
board, puzzle, fun, history   section pages with that section's cards
shared/landing.js   the single source of truth: sections, game config, SVG previews
shared/game-runtime.js  lifecycle, score and the feedback event queue
shared/theme.css, cards.css, game.css

each game is one self-contained folder
&lt;game&gt;/index.html      page shell and the rules dialog
&lt;game&gt;/&lt;game&gt;.js       interaction and rendering, may include a worker
&lt;game&gt;/&lt;game&gt;.css      its own styles
&lt;game&gt;/ai.js           pure AI, no DOM, unit-testable
&lt;game&gt;/engine.js       pure logic: moves, rules, state machine
&lt;game&gt;/logic.js        board rules such as captures and liberties
&lt;game&gt;/levels.js       level data, such as fifteen sokoban levels
</code></pre>

<p><strong>Three design rules.</strong></p>

<ol>
<li><strong>A shared theme.</strong> One stylesheet defines the CSS variables for ink, accent red, accent gold, borders, surfaces and soft shadows. A second styles the home and section cards. A third styles the in-game layout and state feedback. Every game reuses one visual language instead of inventing colours.</li>
<li><strong>A data-driven home page.</strong> The landing module is the only data source. Its sections array defines four sections of six games, each with an id, name, description, href, accent colour and preview SVG. One function renders the home cards, another renders a section's cards. The three recommendations, the random button and the counts all derive from that config, so <strong>adding a game touches one place</strong>.</li>
<li><strong>Self-containment.</strong> One folder per game holds the page, the styles, the logic and the AI. Adding a game touches no other game, and deleting one is deleting a folder.</li>
</ol>

<pre><code>// adding a game to the landing module is one more entry
{
  id: 'mygame',
  name: 'My game',
  description: 'One-line summary',
  href: '/mygame/',
  accent: '#2980b9',
  previewSvg: \`&lt;svg viewBox="0 0 120 120"&gt;…&lt;/svg&gt;\`,
}
</code></pre>

<p><strong>The shared runtime</strong> creates a session for each game, records key events, syncs score snapshots and submits a result when the game ends or the page is left.</p>

<ul>
<li>A factory generates a session id, starts the session through an API call, deduplicates score pushes into snapshots, and finishes through another call plus a flush.</li>
<li>An event queue batches uploads with a maximum queue of 60, a flush size of 6 and a 1600 ms delay. Events carry idempotent ids, and a network failure requeues instead of blocking the game loop.</li>
<li>A DOM observer watches score and status elements, extracting the score and recognizing win or loss keywords, which triggers a finish.</li>
<li>Games can also report directly by dispatching custom score and event events.</li>
<li>A page-hide handler sends the finish beacon, so a score isn't lost when the tab closes.</li>
</ul>

<blockquote>
<p>The design philosophy: <strong>the domain layer must not know about the DOM, canvas, network or database</strong>. Pages consume domain snapshots, the runtime owns lifecycle and feedback, and the AI and engine files stay pure so Node can test them. The architecture document fixes the boundary: page, then shared UI and runtime, then game domain, then API client, then Pages Functions, then D1.</p>
</blockquote>

<h3>Backend API</h3>

<p>Everything lives under the functions directory, and the filename is the route.</p>

<table>
<thead><tr><th>Endpoint</th><th>Method</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td>register</td><td>POST</td><td>Create a user in D1</td></tr>
<tr><td>login</td><td>POST</td><td>Sign in and issue a cookie valid for 30 days</td></tr>
<tr><td>logout</td><td>POST</td><td>Sign out and destroy the session</td></tr>
<tr><td>me</td><td>GET</td><td>Current login state, or 401</td></tr>
<tr><td>chess move proxy</td><td>POST</td><td>Takes a position, returns a move, through the model provider</td></tr>
<tr><td>life narration</td><td>POST</td><td>Streams a life story from birth attributes</td></tr>
<tr><td>battle create, join, pick, state</td><td>POST and GET</td><td>History brawl rooms, drafting and state</td></tr>
<tr><td>battle analyse and analysis</td><td>POST and GET</td><td>The AI judge, round by round, streamed</td></tr>
<tr><td>aeroplane create, join, start, roll, move, state</td><td>POST and GET</td><td>Rooms, starting, rolling, moving and polling</td></tr>
<tr><td>admin users and game stats</td><td>GET</td><td>The console's user list and statistics</td></tr>
<tr><td>game sessions</td><td>POST</td><td>Start a game session</td></tr>
<tr><td>game events</td><td>POST</td><td>Batch key events with idempotent ids and a type allowlist</td></tr>
<tr><td>game finish</td><td>POST</td><td>Settle a game and write the final score</td></tr>
</tbody>
</table>

<p>Shared helpers live in per-feature shared files, for JSON responses, cookie parsing, identity, loading and saving rooms. Business logic sits in a service module and database access in a repository module, so <strong>Functions are transport adapters, services own the workflow, and repositories own the SQL</strong>.</p>

<h3>Database</h3>

<p>A schema file defines seven tables, incremental changes live in a migrations directory, new databases run the whole schema and existing ones apply migrations in order.</p>

<pre><code>users            -- username primary key, password, created_at
sessions         -- token primary key, username, expiry, indexed by username
battle_rooms     -- code primary key, password, state JSON, timestamps
feixingqi_rooms  -- same shape, state holds seats, pieces, turn, dice and log
game_sessions    -- id, game_id, username, anonymous_id, started_at, ended_at,
                 --   status, score, duration_ms, metadata JSON
game_events      -- event_id unique, session_id, game_id, type, score, payload, client time
game_scores      -- session_id primary key, game_id, username, score, outcome, duration
</code></pre>

<p>Room state is a single JSON row, which is simple enough for this size. Multiplayer uses client polling plus a server state machine, with D1 acting as both database and cache.</p>

<p>Indexes cover the hot queries: sessions by game and start time, events by session and creation time, and scores by game with descending score.</p>

<h2>Quick start</h2>

<p><strong>Requires</strong> Node.js 18 or newer, because both the wrangler CLI and the test runner need it.</p>

<pre><code># 1. clone
git clone https://github.com/zhoujungis/happy_games.git
cd happy_games

# 2. install, only wrangler and playwright, no frontend dependencies
npm install

# 3. run locally, serving static assets and Functions together
npm run dev
# open http://localhost:8788
</code></pre>

<blockquote>
<p>The dev server reads the D1 binding from the wrangler config. <strong>Local D1</strong> has to be created or synced first.</p>

<pre><code># local database, recommended while developing
npx wrangler d1 create happy-games-db   # put the database_id into wrangler.toml
npx wrangler d1 execute happy-games-db --local --file=schema.sql
# or connect to a remote database you already created in the dashboard
npx wrangler d1 execute happy-games-db --remote --file=schema.sql
</code></pre>
</blockquote>

<h3>Tests</h3>

<pre><code>npm test          # Node's runner over 25 files and 288 cases
npm run check     # JS syntax plus HTML charset and viewport checks
npm run test:e2e  # Playwright smoke: desktop and mobile home, canvas games, overflow
</code></pre>

<p>Testing in Node works because every AI and engine is <strong>a DOM-free pure function</strong>: gomoku, Chinese chess, Go logic, aeroplane chess and the rest. Importing a module is enough to assert on it.</p>

<h2>Deploying to Cloudflare Pages</h2>

<p>The site publishes directly, with no build step, because the wrangler config points the output directory at the repository root.</p>

<h3>Step 1: create the D1 database</h3>

<p>In the Cloudflare dashboard, open Workers and Pages, then D1 SQL Database, and create a database named <code>happy-games-db</code>. Put the returned id into the wrangler config.</p>

<pre><code># wrangler.toml
name = "happy-games"
compatibility_date = "2025-01-01"
pages_build_output_dir = "."

[[d1_databases]]
binding = "DB"
database_name = "happy-games-db"
database_id = "your-database-id"
</code></pre>

<p>Then create the tables, apply any migrations in order, and verify.</p>

<pre><code>npx wrangler d1 execute happy-games-db --remote --file=schema.sql
# if a migrations directory exists, apply each file in order
for f in migrations/*.sql; do npx wrangler d1 execute happy-games-db --remote --file="$f"; done
# verify
npx wrangler d1 execute happy-games-db --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
</code></pre>

<h3>Step 2: environment variables</h3>

<p>In the Pages project settings, under variables and secrets, add the OpenRouter key if you want the life-simulation narration. Without it that one feature returns 503 and nothing else is affected.</p>

<blockquote>
<p>The chess move proxy needs its own provider key if you use it. The comment at the top of that function explains the configuration.</p>
</blockquote>

<h3>Step 3: publish</h3>

<pre><code>npm run deploy
# equivalent to npx wrangler pages deploy .
</code></pre>

<ul>
<li>The first run creates the Pages project.</li>
<li>Later runs publish incrementally, and Cloudflare handles the domain and HTTPS.</li>
<li>After that, visit the Pages URL or a bound custom domain.</li>
</ul>

<p><strong>Caching and routing.</strong> Layered caching is already configured in the headers file. The routes file excludes static assets from Functions, so only API routes and HTML reach the worker, which saves invocations.</p>

<pre><code>{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/*.css","/*.js","/*.mjs","/*.wasm","/*.png","/*.svg","/robots.txt","/rss.xml"]
}
</code></pre>

<p><strong>Custom domains</strong> are configured in the dashboard, and Cloudflare issues the certificate automatically.</p>

<p><strong>Common traps</strong></p>

<table>
<thead><tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>The current-user endpoint returns 401 while signed in</td><td>The auth cookie isn't being sent</td><td>Check the fetch credentials mode and confirm you are on the Pages domain, not a local file</td></tr>
<tr><td>Life simulation returns 503</td><td>The OpenRouter key is missing</td><td>Add the variable, then retry the deployment</td></tr>
<tr><td>D1 reports no such table</td><td>The schema never ran remotely</td><td>Run the schema again against the remote database</td></tr>
<tr><td>WebAssembly loads slowly</td><td>A cache miss</td><td>Confirm the headers mark it immutable; a second visit should come from cache</td></tr>
</tbody>
</table>

<h2>Adding a game: two places, and the whole site follows</h2>

<p>Thanks to the data-driven design, adding a game takes two steps.</p>

<p><strong>1. Create the folder</strong>, following an existing game's structure.</p>

<pre><code>&lt;game&gt;/
├── index.html     # shell: header, board or canvas, rules dialog, shared CSS
├── &lt;game&gt;.css     # game-specific styles
├── &lt;game&gt;.js      # interaction and rendering, may include a worker
└── ai.js          # pure AI, testable with the Node runner
</code></pre>

<p>The HTML needs a charset declaration, a viewport declaration, a board container, score and status elements for the runtime's automatic snapshot, and a rules dialog. A module script at the bottom imports the game and creates the runtime.</p>

<p><strong>2. Register it</strong> by adding one entry to the matching section's games array in the landing module, with an id that matches the folder, a name, a description, the href, an accent colour and a preview SVG.</p>

<p><strong>Optional 3: a backend endpoint</strong>, if the game needs one. The filename becomes the route.</p>

<p>That is all. Home section cards, section pages, daily picks and the random button all pick up the new game without touching another file. That's what a single source of truth buys.</p>

<blockquote>
<p>Constraints from the architecture document: keep existing URLs and static deployment behavior stable, migrate a representative game before batch migration, keep the pure-logic tests green, and add browser coverage for lifecycle, score, offline and responsive behavior.</p>
</blockquote>

<h2>Project structure</h2>

<pre><code>├── index.html                  home: section entries, daily picks, random game
├── login.html                  login and registration
├── adminPages/                 admin console, owner only
├── board|puzzle|fun|history/   section pages
├── shared/
│   ├── theme.css               global variables and base styles
│   ├── cards.css               card styles
│   ├── game.css                shared in-game styles
│   ├── game-runtime.js         lifecycle, score and event reporting
│   └── landing.js              the single data source
├── functions/
│   ├── _middleware.js          login guard and admin auth
│   ├── services/               business services
│   ├── repositories/           D1 access
│   └── api/                    register, login, logout, me, chess proxy,
│                               life narration, battle, feixingqi, game, admin
├── &lt;game&gt;/                     24 self-contained game folders
├── schema.sql                  seven tables
├── migrations/                 incremental D1 migrations
├── tests/                      25 files, 288 cases
├── e2e/                        Playwright smoke tests
├── tools/check.mjs             syntax and HTML meta checks
├── wrangler.toml               Pages and D1 configuration
├── _headers                    layered cache policy
├── _routes.json                static assets skip Functions
├── assets/                     README preview images exported from the landing module
└── docs/architecture.md        boundaries and migration rules
</code></pre>

<h2>Why zero frameworks</h2>

<p>This isn't nostalgia. It's a trade made after weighing the alternatives.</p>

<ol>
<li><strong>Readability first.</strong> Twenty-four games with completely different logic gain little from the abstractions a framework offers, and those abstractions add a "understand the framework before the game" step. Native code lets a newcomer follow one game end to end in ten minutes.</li>
<li><strong>Portability.</strong> The AI and engine files depend on nothing. Node imports them directly, and moving to a mini-program, an Electron shell or a server would only mean rewriting the rendering layer.</li>
<li><strong>Performance and offline.</strong> No framework means no runtime overhead, no hydration and no bundle. Apart from narration and multiplayer, every game works without a network, and the cache policy makes repeat visits nearly offline.</li>
<li><strong>Teaching value.</strong> This is a frontend project that can be read completely. No black-box bundler, no two thousand lines of configuration, just HTML files that run once uploaded. <strong>Put the complexity in the game logic and keep the engineering simple.</strong></li>
</ol>

<p>Zero frameworks doesn't mean zero conventions. The variable system in the theme stylesheet, the single data source in the landing module, the lifecycle contract in the runtime and the layering in the functions directory together form an invisible framework. They are agreed upon rather than depended upon.</p>

<h2>Closing</h2>

<p>Happy Games tries to prove one thing: that in the age of heavy frontend frameworks, native technology can still deliver a complete, maintainable, deployable full-stack product, as long as the boundaries are drawn clearly, the AI is written as pure functions, multiplayer becomes a state machine, and deployment is handed to a platform that already exists.</p>

<p>Each of the 24 games is its own small world. You can be the strategist on a board, the escapee in a maze, the merchant on a trade route, the courtier under a seven-day decree, or the scholar in an imperial exam. Don't look for a game. Start one.</p>

<blockquote>
<p><strong>Further reading.</strong> Source and play: <a href="https://github.com/zhoujungis/happy_games" rel="noopener noreferrer" target="_blank">github.com/zhoujungis/happy_games</a> and <a href="https://happygames.pages.dev" rel="noopener noreferrer" target="_blank">happygames.pages.dev</a>. GNU Go: <a href="https://www.gnu.org/software/gnugo/" rel="noopener noreferrer" target="_blank">gnu.org/software/gnugo</a>. Cloudflare Pages Functions and D1: <a href="https://developers.cloudflare.com/pages/" rel="noopener noreferrer" target="_blank">Pages</a> and <a href="https://developers.cloudflare.com/d1/" rel="noopener noreferrer" target="_blank">D1</a>.</p>
<p><em>Written against the project's current main branch as of September 2026. Endpoints and tables follow the schema file and the wrangler config, and may drift with later versions.</em></p>
</blockquote>

<p>Along the same chain: <a href="/en/article/nanobrowser-tauri-webview2/">NanoBrowser, hand-writing an in-process CDP</a> and <a href="/en/article/halo-music-square-architecture/">Halo Music, a multi-source music app</a>.</p>
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
<p><strong>TL;DR:</strong> the interesting part of this project isn't the feature count but a handful of boundaries that are easy to get wrong: how IPC serializes, how terminal backpressure works, PTY parameter order, the host-key trust model, and Windows platform details.</p>
<p>Reading time around 30 minutes. Level: advanced.</p>
</blockquote>

<strong>Contents</strong>
<ul>
<li>A deliberately narrow Windows SSH client</li>
<li>Architecture: put the risk in the replaceable layer</li>
<li>Problem 1: the README says binary WebSocket, the code is a base64 event bridge</li>
<li>Problem 2: multi-byte characters split across chunks become replacement characters</li>
<li>Problem 3: the ack loop and its three traps</li>
<li>Problem 4: PTY width and height order</li>
<li>Problem 5: known_hosts and the hard edges of trust on first use</li>
<li>Problem 6: the Windows ssh-agent named pipe</li>
<li>Problem 7: the tray icon ignores clicks</li>
<li>Problem 8: the 14 MB size ceiling</li>
<li>Problem 9: high-DPI flicker and zero-sized terminals</li>
<li>Problem 10: SFTP and forwarding share a connection, not a lifetime</li>
<li>Problem 11: passwords, stale passwords and credential self-healing</li>
<li>Problem 12: three edges of key management</li>
<li>Closing</li>
</ul>

<h2>A deliberately narrow Windows SSH client</h2>

<p>The positioning first. NanoSSH is a Windows SSH client that does five things: a server list, a terminal, SFTP, local port forwarding and key management. No accounts, no cloud sync, no plugin market, no AI assistant and no auto-update. The narrow scope is the product thesis, not an unfinished roadmap.</p>

<p>The stack is Wails v2 plus WebView2. The Go backend splits into three parts.</p>

<ul>
<li><code>internal/sshcore</code> is a pure SSH core with no UI dependency.</li>
<li><code>internal/shell</code> is the Wails binding facade, owning sessions, files, forwards, keys and the tray.</li>
<li><code>internal/store</code> handles persistence.</li>
</ul>

<p>The frontend is framework-free TypeScript. The DOM is built by a hand-written helper, state uses a signals library, and the terminal is xterm.js 6. Seven runtime dependencies in total, six of them xterm and its addons.</p>

<p>The artifact is a single executable, 13.23 MB on x64, with no external runtime. The build script sets 14 MB as a hard ceiling and fails the build when the binary goes past it. Five direct Go dependencies, twenty-seven indirect.</p>

<p>Those numbers aren't marketing. They constrain a lot of later decisions: no SQLite, a hand-written tray, no third-party systray library, and as few new modules as possible.</p>

<p>Because the constraints are hard, the problems in this project are concrete. Not "should we support feature X", but "why did this Chinese character turn into a question mark", "why does clicking the tray icon do nothing", "why does vim open misaligned". Each problem below has a symptom, a cause, a fix and a cost.</p>

<h2>Architecture: put the risk in the replaceable layer</h2>

<p>The most important architectural decision is separating SSH protocol logic from the UI shell completely. <code>sshcore</code> doesn't know that Wails, WebView2 or xterm exist. It exposes connections, sessions, SFTP, forwarding and key parsing. <code>shell</code> translates those capabilities into callable bindings and moves byte streams into event channels. The frontend reaches the backend through two layers, an API module and a transport module.</p>

<p>The benefit is that risk sits in the replaceable layer. Wails is the shell. Replacing it with bare WebView2 or another window container means changing <code>main.go</code>, the bindings in <code>internal/shell</code> and two frontend files. <code>sshcore</code> doesn't move.</p>

<p>The reverse holds too. Protocol tests need no window, because an in-process test SSH server exercises connections, PTYs, SFTP and forwarding directly.</p>

<p>The backend's event outlet is a function type rather than a hard-coded Wails call.</p>

<pre><code>type emitFunc func(ctx context.Context, eventName string, data ...any)
</code></pre>

<p>Both the app and each shell session hold that function. Production assigns the real Wails emitter; tests assign a collector. That small indirection is the precondition for testing backpressure, host-key prompts and transfer progress automatically.</p>

<p>Persistence follows the same narrow rule. <code>servers.json</code> is the only database, versioned at 1. Reads run a pure-function migration, saves write a backup first and then go through a temporary file, an fsync and a rename. <code>known_hosts</code> uses standard OpenSSH format, so it can be exchanged with the system file. Private keys are standard OpenSSH keys. Logs live in their own directory. The data root defaults to <code>%APPDATA%\\\\NanoSSH</code>, overridden by an environment variable for tests and portable mode. There are no hidden binary formats; when something goes wrong, everything opens in a text editor.</p>

<p>The window layer has a few pieces of plumbing that aren't business logic but do shape the experience. The frameless title bar is drawn by the frontend, while Wails keeps resize hot zones and shadow. A single-instance lock focuses the existing window rather than starting a second process. The Mica background reads the Windows build number from the registry and enables translucency only from build 22621 onward, falling back to opaque on older systems, which prevents a transparent window with no background. The frontend asks whether Mica is enabled and decides whether the title bar and sidebar become translucent surfaces.</p>

<p>The frontend has one deliberate seam as well. Views, terminal and components never touch the global Wails object. Every binding call and event subscription goes through the API module. Byte transport lives alone in the transport module, the only frontend file strongly tied to the shell, so replacing Wails later rewrites a bounded area.</p>

<h2>Problem 1: the README says binary WebSocket, the code is a base64 event bridge</h2>

<p><strong>Symptom.</strong> The README mentions binary WebSocket IPC with ack-based backpressure, yet there is no WebSocket server and no binary framing anywhere in the code. Terminal data travels over the Wails event emitter, with event names like <code>term:data:&lt;sessionId&gt;</code>.</p>

<p><strong>Cause.</strong> The README described the original design intent, and the implementation settled on Wails' own event bridge. A later section of the same README says a worker decodes base64, which contradicts the first claim.</p>

<p>Wails binding calls are JSON-serialized, and so are event payloads. A Go byte slice arrives in the frontend as a base64 string. The dependency tree does contain a WebSocket library, but as a transitive Wails dependency rather than this IPC implementation.</p>

<p><strong>Fix.</strong> Rather than build a WebSocket to match the document, the project accepted the bridge's limits and compensated for them. The frontend decodes base64 in a web worker and transfers the array buffer to the main thread, so decoding never blocks rendering. The decoded bytes go straight to xterm's write call, with no string concatenation on the main thread.</p>

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

<p><strong>Cost.</strong> Base64 inflates byte volume by roughly a third, so a 16 KiB terminal chunk becomes a string of about 21.8 KiB. Go also serializes JSON and the webview decodes base64.</p>

<p>What that buys isn't having to maintain a WebSocket service, no connection authentication to design, and no extra port outside Wails. For a local SSH client that is an acceptable trade, but the README was inaccurate. The correct fix was to document "Wails event bridge plus base64 decoding" instead of keeping a faster-sounding noun. Engineering documents should describe the implementation, not the wish.</p>

<p>If the project ever did move back to binary WebSocket, it would lose single-instance behavior, same-origin event dispatch and the no-extra-port property, and it would have to solve local authentication and a new attack surface. That's why the implementation wasn't changed to match the document.</p>

<p>When a worker is unavailable, in some restricted webview environments, the decoder falls back to synchronous base64 decoding on the main thread. Decoding then occupies the render thread and long output stutters more, but nothing is functionally missing. Each terminal session owns a worker, kept across tab switches and terminated only when the session closes, at the cost of a few more worker instances in memory.</p>

<h2>Problem 2: multi-byte characters split across chunks</h2>

<p><strong>Symptom.</strong> An echo containing Chinese, Korean or emoji occasionally shows a replacement character in the middle of the output. It's intermittent, and more likely with longer output or a slower machine.</p>

<p><strong>Cause.</strong> The backend originally converted each read to a string and split it into lines before sending. SSH channel read boundaries have nothing to do with character boundaries: a three-byte character can straddle two reads. Converting half a character to a string forces Go to emit a replacement character, and once a UTF-8 decode has happened the pieces can never be rejoined.</p>

<p><strong>Fix.</strong> Byte slices end to end. The read buffer is a fixed 32 KiB, every read is copied immediately into a channel of depth eight, and the pump only merges, batches and sends. No line splitting and no decoding anywhere in the backend. Standard output and standard error have separate reader goroutines writing into the same channel, consumed by a single writer. xterm receives raw bytes and does its own decoding and wide-character handling.</p>

<p>Two paths must be distinguished. An interactive shell streams through the pump. A non-interactive command run collects output in a limited buffer capped at 8 MiB, silently dropping the excess without blocking the remote. The second path is for probes and batch work only; large output has to go through the shell or the SFTP streaming interface.</p>

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

<p>A test covers this specific path. The remote echoes a line containing Chinese, Korean, Japanese and an emoji, and the test asserts the line is byte-identical with no replacement character. Another test pushes a 40,000-byte single line past the 16 KiB chunk cap, forcing several flush and ack rounds and confirming that nothing is dropped. The non-interactive path has an 8 MiB flood command to confirm large output reads continuously.</p>

<p><strong>Cost.</strong> The backend gave up line-oriented processing. Keyword filtering, log writing or command auditing on the server side would have to happen in the frontend or in a separate parser. Each chunk is also copied, because the read buffer gets reused by the next read, which is a small memory cost for correct ownership semantics. Ordering between the two streams is still not strictly guaranteed; a PTY merges them, so in practice it looks right.</p>

<h2>Problem 3: the ack loop and its three traps</h2>

<p><strong>Symptom.</strong> With a plain read-and-send approach, running <code>cat</code> on a large local file makes the webview event queue grow without bound. The terminal lags, then the window freezes. Worse, once the frontend is destroyed, the Go reader waits forever for an ack that will never arrive, so the session can neither be read nor closed.</p>

<p><strong>Cause.</strong> Wails event emission provides no signal that the frontend has processed anything. xterm's write call is asynchronous; pushing more data before the buffer renders accumulates latency without limit. The SSH channel has a window, but that window covers Go's reader, not the webview renderer. The middle has no feedback loop, so the pressure piles up in process memory.</p>

<p><strong>Fix.</strong> Make ack an explicit end-to-end backpressure signal. The backend sends one chunk at a time and waits for the frontend to ack inside xterm's write callback. Three constants govern it: at most 16 KiB per send, at most 8 ms of batching, and at most 30 seconds waiting for an ack. The ack channel has capacity one, and duplicate acks are dropped.</p>

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
        wruntime.LogWarning(sess.ctx, "terminal: waiting for ack timed out, resuming reads")
    }
}
</code></pre>

<p>The frontend chains write and ack through a promise, so slow rendering can't reorder acks.</p>

<pre><code>this.chain = this.chain
  .then(() =&gt; this.handlers.onData(bytes))
  .then(() =&gt; (this.disposed ? undefined : backend.ackTermData(this.sessionId)))
  .catch((err) =&gt; console.error("[nanossh] terminal write failed:", err));
</code></pre>

<p>Three traps sit here.</p>

<ol>
<li>The frontend can ack before the backend starts waiting, so the ack channel needs capacity one, otherwise the first ack is lost.</li>
<li>Disposal must send one final ack, or the reader hangs until the 30-second timeout.</li>
<li>Duplicate acks must be discarded safely, because only one chunk is in flight at any moment.</li>
</ol>

<p>One detail inside flush is easy to miss. If the chunk channel is drained while waiting for an ack, the timer may already have fired, so the next loop iteration has to stop the timer and drain it, or a second flush happens immediately.</p>

<p>The 8 ms batch isn't about reducing event count. It's about sending small packets, such as keystroke echoes, promptly. Batching only at 16 KiB makes interaction feel sluggish.</p>

<p>In tests, the collector acks synchronously inside the event callback, which is equivalent to the fastest possible "already rendered". A real browser also goes through worker decoding, a buffer transfer and xterm rendering, so production chunk intervals are longer.</p>

<p><strong>Cost.</strong> Throughput is capped by rendering speed, deliberately, because terminals want low latency rather than maximum bandwidth. Acks carry no chunk sequence number, so the implementation guarantees only one chunk in flight; parallelizing would require ids. The 30-second timeout is a safety net rather than a normal path, and it converts "the frontend hung" into "the backend keeps reading", which can mask a real rendering fault, so it has to be visible in logs. Without that timeout, the pump would wait forever after the first send once the collector stopped acking.</p>

<h2>Problem 4: PTY width and height order</h2>

<p><strong>Symptom.</strong> vim opens fine locally but the whole screen misaligns through NanoSSH, and htop columns don't line up. Resizing the window sometimes makes it accidentally correct. The first suspicion was xterm's fit calculation, and the bug turned out to be in the backend.</p>

<p><strong>Cause.</strong> Two contradictory naming conventions. RFC 4254 encodes the PTY request and window change with width first and height second, meaning columns then rows. The Go crypto SSH library's request and change calls take height first and width second. Following the RFC field order into the library swaps the two values, so vim receives 80 rows and 24 columns.</p>

<p><strong>Fix.</strong> The project's own API is uniformly rows then columns. Shell options, resize, the start-shell request and the frontend resize call all follow that order, with comments spelling out the difference between the RFC and the library. A test pins it: the test server parses the PTY request exactly per the RFC and asserts the rows and columns arrive when expected.</p>

<pre><code>if err := sess.RequestPty(term, rows, cols, opts.Modes); err != nil {
    sess.Close()
    return nil, fmt.Errorf("sshcore: requesting PTY (%dx%d) failed: %w", cols, rows, err)
}
</code></pre>

<p>Note that the error text still reads columns by rows, because that is for humans, while the actual argument order is rows then columns. Both perspectives have to coexist, or readers get confused.</p>

<p>There are defaults as well. A rows or columns value of zero or less falls back to 24 by 80, so a frontend that has not laid out yet can't send zeros. Resize rejects invalid sizes and never writes a zero-sized terminal to the remote. The frontend's fit call can throw before layout, so the wrapper swallows it and returns the current terminal size, deferring to the next resize observation.</p>

<p><strong>Cost.</strong> The fit call returns rows and columns, and callers must pass them in that order, which the comments repeat more than once. The window-change message is fire-and-forget with no reply, so a successful return only means the bytes were written, not that the remote applied them, which means tests must poll the server's record. Dragging a window produces many resize requests, debounced at 150 ms, at the cost of a slightly delayed remote size.</p>

<h2>Problem 5: known_hosts and the hard edges of trust on first use</h2>

<p><strong>Symptom.</strong> The first connection to an unknown host should show a fingerprint card. A changed host key should block clearly rather than offer an "ignore once" button that people click reflexively. In practice the error types returned by the known-hosts helper get lumped together, mixing unknown hosts with changed fingerprints.</p>

<p><strong>Cause.</strong> In the key error returned by the helper, an empty wanted-key list means there is no record for that host, and a non-empty one means a record exists but the presented key doesn't match. The first is trust on first use; the second may signal a man in the middle. There is a third case as well, a distinct revoked error for hosts marked revoked in the file, which must block unconditionally. Mixing the three produces the classic "fingerprint changed, allow once" vulnerability.</p>

<p><strong>Fix.</strong> Handle the revoked error first and return immediately. Then check whether the wanted-key list is non-empty. Unknown hosts offer three choices: this time only, trust and save, or cancel. A changed key accepts only an explicit replacement; both accept-once and refusal produce a rejected error. Replacement matches the old entry by address and writes a new public-key line. The write is atomic, with a temporary file, an fsync and a rename, at mode 0600.</p>

<p>The known-hosts helper requires the file to exist, so a first connection has to create the parent directory and an empty file first. Otherwise the first connect fails with a parsing error before the fingerprint card ever appears.</p>

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

<p>Tests cover three behaviours: prompting and saving on first contact, not prompting the second time, and blocking after the server rotates its key while the callback still receives the old fingerprint. Another test confirms that "this time only" isn't persisted and that both connections prompt again.</p>

<p><strong>Cost.</strong> The known-hosts format supports hashed hostnames, and the replacement logic can't reverse a hash. Such lines are skipped and a new line is appended, so the old hashed record stays in the file and later connections may keep reporting a change until the user cleans it by hand. That's a documented boundary, with a comment saying hashed forms are treated as misses and preserved. On Windows, mode 0600 is only an intention; the actual access control comes from ACLs inherited from the application data directory.</p>

<h2>Problem 6: the Windows ssh-agent named pipe</h2>

<p><strong>Symptom.</strong> Windows OpenSSH is installed and <code>ssh-add</code> lists keys, but agent authentication in NanoSSH always fails. With Git Bash installed as well, the agent socket environment variable exists, yet dialling it also fails.</p>

<p><strong>Cause.</strong> Windows has no Unix domain sockets. The Windows OpenSSH agent listens on a fixed named pipe. The agent socket environment variable, even when present, may hold a Cygwin or MSYS private format that Go's Unix dial can't reach.</p>

<p>There is a second problem. When the pipe exists but all instances are busy, opening it returns a pipe-busy error, and reporting that directly tells the user the agent is unavailable.</p>

<p><strong>Fix.</strong> Hand-written file opening plus wait-for-pipe logic, with no extra dependency. The pipe name is fixed, the deadline is three seconds, and a busy pipe retries every 50 ms. On success the handle is wrapped in an agent client, and the key list is fetched once before authenticating. An empty list produces a clear "run ssh-add first" message instead of the library's "no supported methods remain". The auth methods return a closer, which is closed on handshake failure and otherwise attached to the connection so it closes with it, so a failed handshake can't leak the pipe.</p>

<pre><code>deadline := time.Now().Add(agentDialTimeout)
for {
    h, err := windows.CreateFile(name, windows.GENERIC_READ|windows.GENERIC_WRITE,
        0, nil, windows.OPEN_EXISTING, 0, 0)
    if err == nil {
        return os.NewFile(uintptr(h), agentPipeName), nil
    }
    if err != windows.ERROR_PIPE_BUSY || time.Now().After(deadline) {
        return nil, fmt.Errorf("sshcore: cannot connect to ssh-agent (%s): %w; "+
            "check that the Windows OpenSSH Authentication Agent service is running",
            agentPipeName, err)
    }
    time.Sleep(50 * time.Millisecond)
}
</code></pre>

<p>A Windows-only test asserts that the path really reaches the pipe namespace. With no agent running, the error must be file-not-found or pipe-busy, never invalid-name. If Go or the syscall bindings ever change device path handling, that test fails first, rather than a user reporting that agent authentication never works.</p>

<p><strong>Cost.</strong> Only the Windows OpenSSH agent is supported. PuTTY's agent isn't, and no third-party protocol is pulled in to support it. Three seconds is a hard cap: better a clear error than a spinner that never resolves. Multiple SSH clients contend for the pipe, so failures inside the retry window are normal, and only past three seconds is it genuinely unavailable. Three seconds is shorter than the 15-second TCP connect timeout because the agent is a local resource that should answer in milliseconds.</p>

<h2>Problem 7: the tray icon ignores clicks</h2>

<p><strong>Symptom.</strong> After closing the window the app minimizes to the tray. The icon is visible, but double-clicking does nothing and the context menu never opens. The log shows no errors and the process is alive.</p>

<p><strong>Cause.</strong> Win32 window messages are delivered per thread, so the message window and the message loop must live on the same OS thread. Go goroutines can migrate between OS threads around blocking calls. Create the window on one thread and pump messages on another, and messages never arrive. The symptom looks exactly like "the icon didn't attach", when the message loop is simply not receiving callbacks.</p>

<p><strong>Fix.</strong> The tray thread locks itself to its OS thread on entry and unlocks on exit. Both creating the message window and entering the message loop happen on that locked thread. The window is a message-only window, so it takes no screen space, and callbacks, balloons and the context menu are delivered through custom messages.</p>

<p>Creation is a synchronous handshake: the constructor blocks until ready or three seconds elapse, and on failure it returns an error so the caller can shut down normally. It never leaves the state where the window is hidden but the icon was never attached.</p>

<pre><code>func (t *tray) run(done chan&lt;- error) {
    runtime.LockOSThread()
    defer runtime.UnlockOSThread()
    // register the window class, create the message window, Shell_NotifyIcon,
    // then enter the GetMessage loop
}
</code></pre>

<p>The tray is created lazily. It takes no notification-area slot while the window is open; the icon appears only when the app actually minimizes. That also means a failed tray creation still lets the user exit, instead of being trapped in a background process with no way out.</p>

<p>The first balloon shows once, guarded by a flag, so it doesn't nag. The context menu returns the chosen command directly instead of routing window messages. Quitting destroys the icon through a custom message and ends the message loop.</p>

<p><strong>Cost.</strong> One OS thread is locked for the tray's lifetime and must not block. Callbacks only post messages and flip state, with heavy work pushed back to the business layer. The window procedure defends every branch against panics, menu commands travel over a channel, and the tray thread never touches the database or the network. Only one tray icon is supported, so the window procedure is bound through a package-level variable rather than a window property. The handwritten Win32 code is about two hundred lines, less maintainable than a library, in exchange for zero new dependencies and a smaller binary.</p>

<h2>Problem 8: the 14 MB ceiling</h2>

<p><strong>Symptom.</strong> As features accumulated, the artifact grew past 13.23 MB, leaving under 0.8 MB before the 14 MB limit. At that point any casual "just add a library" decision can fail the build.</p>

<p><strong>Cause.</strong> The Wails runtime isn't small, and the SSH implementation from the crypto package, the WebView2 loader and the frontend bundle all live inside. The dependency graph also carries a batch of transitive Wails dependencies, such as an HTTP framework, a WebSocket library, and string and template helpers. Not all of them are reachable, but all of them are in the module graph. Add SQLite or a third-party tray library, and size runs away.</p>

<p><strong>Fix.</strong> Turn size from a verbal agreement into a build assertion. The build script fixes the architecture and disables cgo, builds with stripped symbols and debug info, verifies that the executable's machine field matches x64, and then rounds the size and throws when it exceeds the threshold.</p>

<pre><code>$sizeMB = [math]::Round((Get-Item $exe).Length / 1MB, 2)
if ($sizeMB -gt $MaxSizeMB) {
    throw "size exceeded: $sizeMB MB &gt; $MaxSizeMB MB. The goal is 'extremely light'; check dependency growth before raising the limit."
}
</code></pre>

<p>The specific choices follow from that. No SQLite, because the server list is dozens of rows and a pure-Go SQLite would add four to six megabytes for nothing; a JSON file with atomic writes and a backup is smaller and easier to repair by hand. No third-party tray library; the notification icon call is written directly. Seven frontend runtime dependencies and no UI framework. Keys, known hosts and the server list all use standard formats, with no bespoke binary containers. The frontend is embedded into the executable, so there is no external asset directory.</p>

<p>The Tauri configuration drives the frontend build, and the build script owns the Go side and the assertions. CI also runs a vulnerability check, because advisories in the crypto package need continuous discovery rather than after-the-fact checks.</p>

<p><strong>Cost.</strong> JSON storage rewrites the whole file on save, which is linear in the number of servers and fine for dozens, but there is no SQL for complex queries later. Handwritten Win32 and a hand-rolled DOM helper add maintenance. The size guard itself is brittle: a Go, Wails or frontend dependency bump can move the number, so the threshold needs re-checking after upgrades. The assertion runs after the build, so a failing artifact is kept for analysis while CI fails. And a 32-bit Go toolchain produces 386 by default, so the script must pin the architecture, or you get a binary that runs on the wrong target.</p>

<h2>Problem 9: high-DPI flicker and zero-sized terminals</h2>

<p><strong>Symptom.</strong> Dragging the window between a 100% and a 150% display makes WebView2 repaint repeatedly and flicker. Switching from the terminal view to files and back leaves the xterm cursor misaligned against the old column count, and sometimes the terminal collapses into a thin line.</p>

<p><strong>Cause.</strong> Two problems overlap. First, WebView2 receives dense resize events on high DPI or multi-monitor switches, and reflowing on each one flickers. Second, in-session view switching uses display none, so the hidden terminal host measures zero and the resize observer reports a zero-sized box. Calling fit at that moment computes a tiny grid, and switching back leaves it wrong.</p>

<p><strong>Fix.</strong> The window layer debounces WebView2 repaints at 120 ms. The frontend debounces resize another 150 ms, skips observations below four pixels in either dimension, and refits plus syncs size inside an animation frame. Returning to the terminal view also goes through an animation frame, so layout finishes first. Switching from the keys page back to servers refits every visible terminal.</p>

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

<p>WebGL is downgraded at the same layer. The WebGL addon is constructed inside a try block, and initialization failure keeps xterm's DOM renderer; context loss disposes the addon and falls back the same way. Nothing breaks functionally, long output just costs more CPU.</p>

<p>The window declares per-monitor DPI awareness in its manifest, otherwise WebView2 is bitmap-stretched across displays and text blurs. Light and dark follow the system, and Mica enables only on recent builds, with older systems staying opaque so a transparent window never lacks a background.</p>

<p><strong>Cost.</strong> The two debounces stack, so the remote PTY receives the final size a moment after dragging ends, which is perceptible but not painful. Skipping tiny sizes avoids the zero-sized case but also means a very small layout change doesn't recompute. The WebGL downgrade is silent, so users only notice that scrolling got slower, a trade made to keep the main flow undisturbed.</p>

<h2>Problem 10: SFTP and forwarding share a connection, not a lifetime</h2>

<p><strong>Symptom.</strong> Initially every file panel opened a new SSH connection and every forwarding rule dialled its own, so opening files added a handshake and another login entry on the server. Worse, closing a session tab left the local listening port occupied, because the forward was never released with the session.</p>

<p><strong>Cause.</strong> SFTP and port forwarding are just extra channels on the same SSH connection. SFTP is a subsystem channel and local forwarding is one direct-tcpip channel per forwarded connection. Neither needs a new dial, handshake or authentication. What needs designing is the lifetime: channels belong to the session and have to be torn down with it, along with listeners and rules.</p>

<p><strong>Fix.</strong> SFTP is created lazily and cached. The first open starts the subsystem on the existing connection, and later calls reuse the same client; a test asserts that two opens produce one SSH connection and one SFTP channel.</p>

<p>Forwarding keeps a rule table per session. Adding a rule validates the port and host, then listens on loopback. Each incoming local connection opens a direct-tcpip channel through SSH, shuttles both directions through 32 KiB buffers, and counts active connections, total connections and bytes in each direction. Closing the session closes listeners, cuts live connections and pushes a removed state.</p>

<pre><code>func (f *Forward) handle(local net.Conn) {
    remote, err := f.ssh.Dial("tcp", f.remoteAddr)
    if err != nil {
        local.Close()
        return
    }
    // register the pair and splice both directions; either side closing ends both
}
</code></pre>

<p>Several smaller details matter. Rename prefers the POSIX rename and falls back to the standard one. A symlink triggers an extra stat only when the entry is a link and not a directory, avoiding a round trip per entry in large directories. Delete removes only empty directories, never recursively, because a wrong path in a recursive delete is irreversible. Forwarding binds loopback only, so exposing a service to the local network is an explicit decision, and a port conflict is an error rather than a half-written rule.</p>

<p>Transfer progress is rate-limited to 120 ms, so every 32 KiB doesn't flood the webview with events. Cancellation travels through a context, the copy loop checks it before each block, and the terminal state is cancelled rather than done. Forwarding statistics share the same interval and only push when a value changes, so idle rules emit nothing.</p>

<p><strong>Cost.</strong> All channels share one TCP connection, so terminal, SFTP and forwarding contend for the same bandwidth and connection-level resources; a single large transfer can slow terminal echo. Remote forwarding and dynamic forwarding aren't implemented, only local. A download opens the remote file once to learn its size and reopens it for the transfer, which costs a round trip but avoids holding two handles for a long time. Recursive upload and recursive delete are explicitly unsupported.</p>

<h2>Problem 11: passwords, stale passwords and credential self-healing</h2>

<p><strong>Symptom.</strong> After changing the remote password, every connection attempt fails and there is no way to enter a new one. In the other direction, a password mistyped once in the dialog gets saved, and later attempts keep failing.</p>

<p><strong>Cause.</strong> If "the user typed a password" and "save the password" are the same call, a failed authentication still persists it. If a stale saved password is never removed, the frontend sees that a password exists, never prompts, and the user is stuck in a corner where clicking connect always fails. Deleting a server while leaving its credential behind also orphans a password pointing at a host that no longer exists.</p>

<p><strong>Fix.</strong> Save only after successful authentication. If authentication fails and no password was supplied this time, delete the saved one so the next attempt prompts. Deleting a server deletes its credential. The password-exists check answers only whether one is stored, never returns the secret itself, and drives whether the frontend connects directly or prompts first. Clearing a password is idempotent, so repeating it isn't an error.</p>

<p>The frontend asks whether a password exists before connecting, and only prompts when it doesn't, so normal use isn't interrupted every time. Key passphrases work the same way: on failure with a stored passphrase, delete it, then prompt again with a retry marker, up to three times.</p>

<pre><code>if srv.Auth == sshcore.AuthPassword &amp;&amp; req.Password != "" {
    if serr := a.secrets.Set(store.PasswordTarget(srv.ID), req.Password); serr != nil {
        wruntime.LogWarning(a.ctx, "failed to save server password: "+serr.Error())
    }
}
</code></pre>

<p>Credentials live in Windows Credential Manager as generic credentials scoped to the local machine, with targets such as a server password or a key passphrase. There is no bespoke encrypted file, because that is the classic roll-your-own-crypto trap. The credential manager uses the platform data protection API bound to the current user, and it doesn't travel with the data directory.</p>

<p><strong>Cost.</strong> Self-healing depends on matching the library's authentication error text, which is a string comparison against a message that could change. Detecting a typed authentication error would be sturdier, but the simpler path was chosen. Credentials bound to the Windows account can't be decrypted on another machine, which is correct behaviour, so copying the server list and keys to a new machine means re-entering passwords.</p>

<p>Passwords are still plaintext in process memory. There is no master password and no memory encryption, which is the usual boundary for a desktop SSH client. Credentials are also not invisible to other programs running as the same user: anything running as that user can enumerate the targets and read them. That's a property of the Windows credential model rather than something NanoSSH can fix on its own. What it does guarantee is that secrets are never in a plaintext JSON file and never travel with the data directory.</p>

<h2>Problem 12: three edges of key management</h2>

<p><strong>Symptom.</strong> Importing a FIDO security key reports that the private key could not be parsed, which looks like file corruption. Generating an RSA key defaults to 2048 bits, which the baseline rejects. Deleting a key that a server still references can quietly change that server's authentication and break the next connection.</p>

<p><strong>Cause.</strong> A FIDO key's private handle never leaves the hardware, and Go's SSH library doesn't support it, so the user has to be told the algorithm is unsupported rather than that the file is broken. RSA 2048 is no longer enough, and 4096-bit generation takes seconds, which is too slow for an interactive flow. Deleting a referenced key creates a dangling reference, and silently rewriting server configuration is harder to diagnose than an error.</p>

<p><strong>Fix.</strong> Only three algorithms are supported: ed25519, RSA 3072 and ECDSA P256, generated in the native OpenSSH format, with public lines that paste straight into an authorized-keys file and fingerprints that match the standard tool. FIDO detection has to inspect the decoded payload, because OpenSSH private keys store the algorithm name as a plain string inside the binary body; searching the visible text for the FIDO prefix finds nothing.</p>

<pre><code>if block, _ := pem.Decode(pemBytes); block != nil {
    if bytes.Contains(block.Bytes, []byte("sk-ssh-ed25519")) ||
        bytes.Contains(block.Bytes, []byte("sk-ecdsa-sha2")) {
        return nil, ErrKeyFIDOUnsupported
    }
}
</code></pre>

<p>Key files are named by a generated identifier rather than by whatever the user typed. That rules out collisions and path traversal, and lets a key be renamed freely. Import parses before writing, so success proves the key is usable and yields the exact public key and fingerprint; failure leaves no half-record with an empty fingerprint.</p>

<p>Three failure paths are distinguished on purpose: a needed passphrase returns a specific error, a hardware key returns its own error, and everything else means the file itself is wrong. Without a name, import uses the source filename without its extension. A passphrase-protected import stores the passphrase, so the first connection doesn't ask again.</p>

<p>Deleting a key scans the server list first and refuses while the key is referenced, naming the servers in the error. The order is record first and file second, so there is never a record pointing at a file that no longer exists.</p>

<p><strong>Cost.</strong> FIDO keys and agent forwarding are unsupported, and both say so in the error text rather than failing silently. RSA 3072 generation is slower than 2048 but far better than 4096, which is the middle ground taken. Mode 0600 on Windows is again only an intention; real protection comes from the application data directory's ACL. There is no key rotation and no multi-key binding, because the surface is deliberately narrow.</p>

<h2>Closing</h2>

<p>The value of NanoSSH isn't how many features it has. It's that a few boundaries that are easy to get wrong are pinned down.</p>

<p>IPC chose the Wails base64 event bridge, accepted the size inflation, and offset it with worker decoding and buffer transfer. Terminal bytes stay byte slices end to end with no line splitting or decoding, using 16 KiB chunks, 8 ms batching and an ack loop to keep latency at the renderer. PTY parameters are uniformly rows then columns, with a test preventing the RFC and library orders from swapping again. Host keys distinguish unknown, changed and revoked, and a changed key allows only explicit replacement. The Windows details land in the named pipe, the locked tray thread, resize debouncing and the 14 MB build assertion.</p>

<p>Every decision has a cost. Throughput is bound to rendering, hashed known-hosts entries can't be replaced automatically, JSON can't be queried, handwritten Win32 costs maintenance, and stale-password healing depends on error text. None of that is hidden; it lives in comments, tests and error messages.</p>

<p>Testing is part of the architecture rather than something added afterwards. An in-process test server provides a real SSH server. An event collector replaces the event outlet and acks immediately on receipt. The credential backend is swapped for an in-memory implementation, so tests never write to the real credential store. Conclusions such as "terminal bytes are never lost", "PTY order is correct", "forwarding reuses one connection" and "closing a session releases the port" can all be verified repeatably without a window. What transfers to similar tools isn't a particular function but the order of work: write the boundaries down first, then choose the implementation.</p>

<h2>Further reading</h2>

<ul>
<li><a href="/en/article/nanobrowser-tauri-webview2/">NanoBrowser: Tauri and WebView2 in practice</a>, another lightweight webview shell to compare window and IPC trade-offs.</li>
<li><a href="/article/websocket-production-deep-dive/">WebSocket in production</a>, on why the transport a README describes and the transport the code uses must match.</li>
<li><a href="/en/article/nanohermes-rust-coding-agent/">NanoHermes: a coding agent in Rust</a>, another way to separate a protocol core from its shell.</li>
<li><a href="/article/file-upload-production-deep-dive/">File upload in production</a>, whose progress, cancellation and chunking strategies mirror SFTP transfers.</li>
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
<p>Coding agents aren't scarce in 2026. Claude Code, Codex, Trae and Cursor each own a niche, and open-source clones appear every week. What they share is weight: a Node or Python runtime, hundreds of transitive dependencies, a tokio or asyncio event loop, installers hundreds of megabytes wide, and idle processes that sit on hundreds of megabytes of memory.</p>

<p>NanoHermes asks a much smaller engineering question.</p>

<p><strong>If all I need is a terminal agent that can read files, edit code, run commands and speak MCP, how small can it be?</strong></p>

<p>The answer is a set of trade-offs. One binary, with a design target around 2 MB. Resident memory that depends on context length and nothing else. Three dependency crates. No async runtime. Not even <code>libc</code>. And it still runs as a resident HTTP service on a 1 GB Debian VPS.</p>

<p>This post doesn't sell concepts. It takes the implementation apart. The technical density is in five places: how an agent loop is organized without async, which primitive concurrency uses, how Landlock and signal handling work without <code>libc</code>, how long-term memory does Chinese retrieval with no embedding service, and how every layer of context gets a ceiling. Each of those has details you can't guess from outside.</p>

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

<p><strong>Distillation has a hard gate.</strong> It runs only when the turn completed normally, not when it was interrupted and not when it hit the iteration cap. A half conversation never becomes a lesson. A failed distillation degrades silently and doesn't affect the answer.</p>

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
<li><strong>Results are collected in call order.</strong> <code>join</code> runs in the same order as <code>tool_calls</code>, so the completion order can't mismatch a result with its <code>tool_call_id</code>.</li>
<li><strong><code>Agent</code> must be <code>Sync</code>.</strong> That is the precondition for the whole scheme. On the MCP side, each server's child process and reader handle sit inside a <code>Mutex&lt;Server&gt;</code>, which makes the manager and therefore the agent <code>Sync</code>.</li>
<li><strong>A panicking thread doesn't take down the turn.</strong> <code>join</code> returns an error, which becomes a string that looks like a tool error. The model sees a failed call and carries on.</li>
</ul>

<p>MCP concurrency has a finer grain. Calls to the same server serialize on its stdin lock, because the protocol is request and response over a single connection. Different servers run in parallel.</p>

<h2>Core 3: not even libc</h2>

<p>Both <code>sandbox.rs</code> and <code>interrupt.rs</code> need syscalls that the Rust standard library doesn't expose: the Landlock family, and <code>rt_sigaction</code>. The usual answer is the <code>libc</code> crate. Here it is <code>agent/src/sys.rs</code>.</p>

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
<li><strong>It never cuts inside a tool-call chain.</strong> If the starting point lands on a <code>role == "tool"</code> message, it moves forward until it doesn't. Otherwise the summary would drop an assistant tool call while the tool result stayed behind.</li>
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

<p>Two details go beyond the textbook. <strong>Category words participate in matching.</strong> Every memory has a kind, and that kind's labels are added to the document bag, so a question about what was corrected earlier hits correction entries directly. And <strong>zero-score entries are filtered before ranking</strong>, so an unrelated memory can't crowd out a relevant one.</p>

<p>Because the number of entries is small, scoring is linear with no inverted index. One vector and one hash map are enough. Retrieval is recomputed every turn and injected by the same marker mechanism as the memory block.</p>

<p>Writing has two gates. <code>memory_save</code> skips text that already exists, and automatic distillation only runs on completed turns. Small talk and half conversations never pollute the store.</p>

<p>The system is closer to an index than to a brain. It doesn't summarize conversations, and it doesn't decay the weight of a memory that went unused. What it does guarantee is that every entry can be seen, edited and deleted in the UI, so a user can explain why the model mentioned something. For a personal assistant, that is worth more than recall.</p>

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

<p>Startup parses only the frontmatter. The system prompt lists each skill's name and description. When the model needs a body, it calls the skill tool and the body arrives, capped at 20 KB. That's progressive disclosure: <strong>the library can be large while the base prompt stays small.</strong></p>

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

<p>Two environment variables are exported as well, so a hook doesn't have to parse stdin just to branch on the event.</p>

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
<tr><td><code>on-request</code></td><td>Ask only for commands that aren't recognized as read-only.</td></tr>
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

<p>The most interesting part of the implementation is that <strong>it refuses to degrade</strong>. Landlock is installed between fork and exec, so the restriction covers every child the command spawns. If the kernel doesn't expose Landlock, or an outer sandbox blocks it, NanoHermes <strong>refuses to run the command</strong> rather than quietly running it unsandboxed. The comment makes the argument: a security mechanism that always falls back gracefully isn't a mechanism.</p>

<p>All of this still goes through the hand-written syscall shim, with no external crate.</p>

<h2>Core 12: Ctrl-C that doesn't kill, and undo</h2>

<p>In interactive use, Ctrl-C is redefined. It doesn't kill the process. It flips a flag, and the current turn exits cleanly at the next step boundary with the conversation intact.</p>

<p>The implementation depends on a piece of timing.</p>

<pre><code>static INTERRUPTED: AtomicBool = AtomicBool::new(false);
/// Nesting depth of active turns; the handler is installed at 0 -&gt; 1 and
/// removed at 1 -&gt; 0.
static DEPTH: AtomicUsize = AtomicUsize::new(0);
</code></pre>

<p>Reference counting keeps nested turns sharing one handler, and the outermost exit restores the default action. <strong>Ctrl-C while idle still quits.</strong> Only while busy does it mean "stop this turn". One signal, two meanings, decided by when the handler is installed rather than by inspecting a flag.</p>

<p>One more engineering detail. On x86_64, the kernel refuses to deliver a caught signal unless the caller supplies a restorer that executes <code>rt_sigreturn</code>. That's the only hand-written assembly in the project beyond the syscall instruction itself: a few lines, hidden from the symbol table, that issue syscall 15.</p>

<pre><code>core::arch::global_asm!(
    ".globl nanohermes_sigrestorer",
    ".hidden nanohermes_sigrestorer",
    "nanohermes_sigrestorer:",
    "mov rax, 15",
    "syscall",
);
</code></pre>

<p>The desktop has no signal to send, so a request function flips the same flag directly. The GUI stop button and the terminal Ctrl-C take one path, and the loop never learns who asked.</p>

<p>Paired with it is <code>/undo [n]</code>, which deletes the last n complete user turns, including everything that followed each one, and persists the result. Interrupt preserves, undo erases, and both are needed, because "it went sideways and I want to correct it" and "it went sideways and I want to pretend it didn't happen" are different intentions.</p>

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
<li><strong>No blocking Tauri commands.</strong> A synchronous command runs on the window's main thread, so any disk or network work freezes the whole UI for that turn. Everything touching the filesystem, processes or HTTP is async and handed to the blocking pool. Only two memory-only commands stay synchronous. Settings writes are also serialized behind a static mutex so two flushes can't land out of order.</li>
<li><strong>Streaming text stays out of the global store.</strong> Deltas go through a dedicated subscription that only the bubble being written listens to, and each stage, such as a tool call or the end of a turn, commits once to the transcript. A long answer therefore doesn't re-render the sidebar, the results panel and the title bar. Events batch on dedicated channels at 40 ms intervals.</li>
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

<p>The desktop connects cloud tasks this way, each with its own session id, so <strong>one daemon serves many desktop tasks without cross-talk</strong>. The cost is that cloud configuration is fixed at daemon startup, meaning model, persona, temperature and permission mode all come from flags, and that <strong>a cloud turn can't be cancelled midway</strong> because the request is held by the daemon.</p>

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

<p>A session file is a JSON array of OpenAI-style messages, written atomically: a temporary sibling file is written and then renamed over the target. A crash mid-write therefore can't truncate history. Saves happen after each completed turn and after clearing; a failed read at startup falls back to a fresh conversation with a warning rather than refusing to start.</p>

<p>Multimodal input is available for vision models: a flag for one-shot use, a command in the REPL, and paste, drag or picker on the desktop. Limits are four images per turn, a long edge scaled to 1024 pixels, and rejection with a reason for undecodable or oversized files. Transfer is by data URL, so the model must support vision.</p>

<h2>Tests</h2>

<p>Rust tests are per-module unit tests plus a genuine end-to-end suite, all run by one workspace command. The end-to-end suite starts a local mock OpenAI server that depends only on the standard library and needs no network, and drives the real agent through tool round trips, streaming and non-streaming replies, a retry after one transient 5xx, and a hard API error. A mock MCP server written in Python covers the other transport.</p>

<p>The unit list says a lot about which parts are assumed to break: patch application including multi-hunk and missing context, glob matching, MCP resource and prompt listing, MCP tool dispatch, streamable HTTP handshake and calls, MCP concurrency under mixed load, concurrent tool execution including a mix of built-in and MCP tools, HTML to text and search result parsing, session task lists, git round trips, token usage parsing and backoff arithmetic, multimodal content assembly, session persistence round trips, project guidance injection including the off switch, skill discovery including frontmatter fallback and workspace override, hook execution covering exit codes and matching and stdin payloads, subagent board ordering and the concurrency gate, approval decisions and trusted command detection, the Landlock workspace boundary, signal flag set and clear, and long-term memory covering Chinese bigrams, BM25 ordering, deduplication and the distillation gate.</p>

<p>The frontend uses Vitest with jsdom. Pure logic tests cover theme resolution and persistence, store migrations, Markdown sanitization, image attachments, in-session search and diff blocks. Component tests cover the settings page, the command palette, the results panel and the shortcuts panel. One end-to-end test renders the real store and components against a mocked Tauri IPC bridge and verifies virtual scrolling over a long transcript, search across screens, jump-to-change in a diff, and the input state while a task is running or stopping.</p>

<p>One regression test exists solely to assert that long-running commands never execute synchronously on the main thread, because that is the performance contract most likely to be broken quietly by a later change.</p>

<h2>Known limits</h2>

<ul>
<li><strong>Sandboxing and SIGINT handling are Linux-only.</strong> Both rest on raw syscalls and disappear on Windows and macOS, so the Windows desktop runs without a sandbox and with default signal handling.</li>
<li><strong>Cloud turns can't be cancelled.</strong> The request is held by the daemon and the desktop can only wait. Only local tasks stop at step boundaries.</li>
<li><strong>The daemon runs as root, and the token is the only credential.</strong> Anyone holding it can read, write and execute inside the workspace, which is exactly why the documentation insists on not exposing the port.</li>
<li><strong>No async has real costs.</strong> A stuck HTTP request occupies a thread until its timeout, 120 seconds by default. That's fine for a CLI and a desktop app, and wrong for a high-concurrency gateway.</li>
<li><strong>The Windows installer is unsigned</strong>, so the first run trips SmartScreen.</li>
</ul>

<h2>Verdict</h2>

<p>What is worth reading in NanoHermes isn't the feature list but the discipline. Coding agents converge on similar feature sets. Holding four constraints all the way through is what produced these implementations: no async runtime, three crates, no <code>libc</code>, and a ceiling on every output.</p>

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

<p>NanoDB is a lightweight <strong>embedded document database</strong> written in Go, currently version 0.1.0. Embedded means there is no daemon and no wire protocol. It's a library inside your process, with a CLI, an interactive shell and a REST service wrapped around it.</p>

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

<p>All three entry points share one engine rather than being three implementations. <code>cmd/nanodb/main.go</code> at 722 lines only dispatches arguments. <code>server/server.go</code> at 764 lines only routes and authenticates. The logic sits in <code>engine/</code>. That's the first architectural decision worth copying: <strong>thin entry points, one engine.</strong></p>

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
<li>A document must be a JSON object. Its <code>_id</code> must be a non-empty string, and when absent it is generated as <strong>a 13-hex-digit millisecond timestamp plus 12 random characters</strong>. The time prefix keeps generated ids roughly ordered, so an insert doesn't scatter the index.</li>
<li>Writes deep-copy, so mutating your object afterwards can't affect the database, and reads return copies as well. That rule eliminates a whole class of concurrency bug where a shared map is edited somewhere else, at the price of one copy per operation. For memory-resident data of moderate size, it is cheap insurance.</li>
<li>Field names accept dotted paths for filters, sorts, projections and indexes, while documents themselves stay freely nested.</li>
<li>Field names beginning with <code>$</code> are treated as operators. That's a MongoDB compatibility constraint, and the README warns against using <code>$</code> for ordinary field names.</li>
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

<p>JSON Lines is a blunt trade. It's readable, greppable, one full record per line, and it costs more space and parse time than a binary format. For a database aimed at moderate data that is a fair exchange, and it reduces crash recovery to "parse line by line, truncate the bad tail".</p>

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

<p>Recovery alone isn't enough. The writer must not leave half a record behind for the next recovery to find, and one function handles it with a comment worth reading in full.</p>

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

<p>Whichever step compaction crashed on, the result is self-consistent: either the old-generation records are skipped, or the snapshot is still the old generation and replays normally. One <code>uint64</code> and one comparison is all it takes. That's the line between designed correctness and luck.</p>

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

<p>The rule in <code>collectConditions</code> matters more than the cleverness. It gathers top-level conditions and those inside <code>$and</code>. A union of branches under <code>$or</code> can't be narrowed safely, because a candidate set that is too small silently drops documents, so the planner declines to use an index rather than risk it. The most important quality of a planner is <strong>knowing when not to be clever</strong>. The chosen set is also only a pre-filter: the full match still runs afterwards as a second safety net.</p>

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

<p>That makes a range query logarithmic plus the number of hits instead of a full walk. It's where the measured gap between 3.1 ms indexed and 27.3 ms scanned comes from.</p>

<p>Compound indexes have one honest limitation. A document containing an array field can't enter a compound index under tuple semantics, so the index is marked incomplete, and lookups against an incomplete index return nil, which means unusable. The planner then falls back to a scan. <strong>Slow is better than wrong.</strong> A partially visible index treated as complete would silently drop documents, which is far worse than one order of magnitude of latency.</p>

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

<p>The limits are stated plainly in the README: no stop words, no stemming, no synonyms, no relevance score, multi-term queries are pure AND, and results come back unordered. It's <strong>usable retrieval, not a search engine</strong>. For an embedded database that is the right scope, because most cases only need the documents containing these words.</p>

<h3>Geo indexes: longitude order plus haversine</h3>

<p>Geo entries are ordered by longitude and support <code>$geoWithin</code> with a box and a metric circle. Circles use haversine distance.</p>

<pre><code>// haversineMeters returns the great-circle distance between two points.
func haversineMeters(lon1, lat1, lon2, lat2 float64) float64
</code></pre>

<p>A box narrows candidates through the ordered structure first, and only then does the circle test run, so the expensive trigonometry is limited to a small set. The limits are equally explicit: no polygons and no GeoJSON geometry, no handling of the 180th meridian, and results aren't distance-ordered.</p>

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
<li><strong>Conflict granularity is the collection.</strong> If anyone touched any collection you read, even a different document, the commit fails. That's the acknowledged false conflict. A single version comparison is far cheaper than per-document tracking, which is the right trade for low-conflict workloads and a poor one for hot collections under heavy writes.</li>
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
<li>Batches span collections. Updating a missing target is an error; deleting a missing target isn't, and the result reports that nothing was deleted. Both directions follow what the caller most likely meant.</li>
</ul>

<p>Cloning costs peak memory during the batch and buys <strong>atomicity without rollback logic</strong>. A failing path throws the clone away, and there is no code that has to undo half-applied index maintenance, which is the hardest code in a database to get right. The mechanism is the same snapshot family as transactions.</p>

<p>Batches also read from stdin, and because success writes one record, importing a hundred thousand documents costs one fsync instead of a hundred thousand. Under a WAL, batching pays multiplicatively.</p>

<h2>Read-only SQL and aggregation</h2>

<h3>SQL: three stages, same engine</h3>

<p><code>engine/sql.go</code> at 624 lines is a hand-written read-only subset: lex, parse, execute. It supports select with from, where, order by and limit or offset, plus count star.</p>

<p>The important property is that it <strong>brings no execution engine of its own</strong>. The parse result is translated into the same query structure the REST and CLI paths use, with filter, sort, limit, skip and fields, and then runs through the same filter compiler, the same index planning and the same Top-N sort. SQL and find performing identically isn't a coincidence. They are one pipeline with two front doors.</p>

<p>The boundary is explicit, and the cost of that simplicity is stated too: no joins, no group by, no having, no distinct, no subqueries, no union and no column aliases; aggregation supports only count star; and like is case-sensitive. For query convenience on an embedded store, that subset covers most of "pull data out for a script".</p>

<h3>Aggregation pipeline</h3>

<p>Eight stages: match, group, sort, skip, limit, project, unwind and count. Accumulators are sum, average, minimum, maximum, first, last and push, named to match MongoDB so people who know it need no learning time.</p>

<p>The limits are honest in the same way: no lookup, no facet, no window functions, no out or merge, and <strong>aggregation doesn't use indexes</strong>. A match at the head of a pipeline can still benefit from the caller pushing filters down, but the pipeline itself does no index planning.</p>

<h2>HTTP service</h2>

<p>The server package wraps the engine in REST.</p>

<ul>
<li><strong>Routes.</strong> Health, CRUD under a versioned collection path with filter, sort, limit, skip, fields and count carried in query parameters, and admin endpoints such as compaction.</li>
<li><strong>Auth.</strong> An empty token disables authentication. Otherwise requests carry a token header. The shared token is the admin credential, and per-user tokens can be limited to admin, write or read with an exact-match collection allowlist.</li>
<li><strong>HTTP transactions.</strong> A post opens a transaction and returns an id, operations run under that id, and the caller commits or rolls back. Sessions live <strong>in server memory</strong>, roll back after thirty idle minutes, and roll back at shutdown, so a forgotten transaction can't pin snapshot memory indefinitely.</li>
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

<p><strong>Against MongoDB:</strong> Mongo is a network protocol, replica sets and sharding, with an operational cost in a different category. NanoDB has no distributed ambition. It's a data directory inside your process.</p>

<h2>Known limits</h2>

<p>This section comes straight from the project's own statement, and a database project that documents its limits more carefully than its features is easier to trust.</p>

<ul>
<li><strong>Memory resident.</strong> Documents and indexes live in memory, so data size is bounded by RAM. The WAL is JSON Lines, which costs more space than a binary format.</li>
<li><strong>No distribution.</strong> No replicas, no sharding, no clustering, one process per directory at a time.</li>
<li><strong>Transaction boundaries.</strong> Isolation is fixed and not configurable. Conflict granularity is the collection, so false conflicts happen. No savepoints, no DDL inside a transaction, no cross-process transactions.</li>
<li><strong>Text search is approximate.</strong> Bigram tokenization, no stop words, no stemming, no synonyms, no relevance scoring, multi-term queries are AND, and the indexed field is fixed.</li>
<li><strong>Geo is limited.</strong> Box and circle only, no polygons or GeoJSON geometry, no 180th meridian, and results aren't distance-ordered.</li>
<li><strong>SQL is read-only and partial.</strong> No joins, group by, having, distinct, subqueries or union. Aggregation is count star.</li>
<li><strong>Aggregation skips indexes.</strong> No lookup, no facet, no window functions, no out or merge.</li>
<li><strong>Compound indexes fall back on arrays.</strong> A document containing an array field never enters a compound index, and planning falls back to a scan.</li>
<li><strong>Coarse permissions.</strong> Collection allowlists are exact match, with no wildcards or field-level rights, and the HTTP body cap is 8 MiB.</li>
<li><strong>Array inserts aren't atomic.</strong> Use a batch or a transaction when atomicity matters.</li>
</ul>

<h2>When to use it, and when not to</h2>

<p><strong>A good fit:</strong> local storage inside Go tools and services, such as configuration, task queues, crawler state or desktop application data, where you don't want to run a database service to store tens of thousands of JSON rows. Read-heavy workloads whose data fits in memory, where indexes and Top-N give millisecond responses. Teaching and forking, because ten thousand dependency-free lines with every part present make an excellent starting point for changing the WAL format, adding an index kind or practising transactions. And edge or single-machine deployment, where one binary with no cgo and no external service is the entire story.</p>

<p><strong>A poor fit:</strong> data larger than memory, or terabyte-scale durability, which belongs to SQLite and the LSM family. Multi-process writes to one directory, or multi-node high availability, which the project explicitly gives up. Transaction-heavy writes on hot collections, where collection-level optimistic conflicts cause large numbers of retries. And production requirements around relevance-ranked search, complex SQL analytics or precise geospatial computation.</p>

<h2>Closing</h2>

<p>Back to the three opening questions.</p>

<p><strong>How short is the shortest path to a transactional database?</strong> A transaction struct plus a version-check loop. The whole file is "collection snapshot plus read-set validation at commit". No lock manager, no undo log, and it still provides repeatable read, protection against lost updates, and an explicit conflict error for the caller to retry.</p>

<p><strong>How many lines is "committed data survives a crash"?</strong> Three layers: replay finds the valid prefix and truncates a torn record, the writer rolls back a failed write to the previous complete record, and a generation number makes a crash inside the compaction window self-resolve. Under a hundred lines of core. The hard part isn't the code, it is thinking through the state at every crash point.</p>

<p><strong>How do documents, indexes and concurrency fit together?</strong> Every write goes through one entry point that maintains all four index kinds synchronously. Transactions carry those indexes inside the cloned snapshot. And planning only chooses the smallest candidate set, with the full match as the backstop.</p>

<p>NanoDB won't replace SQLite, and has no intention of replacing MongoDB. Its value is putting the black box on the table: <strong>the WAL is newline-delimited JSON, a transaction is a version comparison, and query planning is picking the smallest candidate set.</strong> The mechanisms are plain enough to memorise, and that plainness is exactly why they can be trusted.</p>

<p>If you have ever thought about writing a database, the answer here is yes, and it doesn't take many lines. The next step isn't reading more papers. Clone it and break replay, commit and planning one at a time, then check whether the tests still pass. That's a faster introduction than any article.</p>
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
<p>NanoBrowser is an open-source project at <a href="https://github.com/zhoujungis/NanoBrowser" rel="noopener noreferrer" target="_blank">zhoujungis/NanoBrowser</a>, and it asks one small engineering question.</p>

<p><strong>If I refuse to bundle all of Chromium, can I still build a desktop browser that works like Chrome?</strong></p>

<p>Most attempts at this slide towards the same answer. Chromium or Electron goes into the package, the installer starts at 100 MB, and every application carries its own copy of the engine and its own memory footprint. As of 2026, nobody wants to pay that for a shell.</p>

<p>NanoBrowser takes the other road: <strong>build no engine, only the shell.</strong> Rendering is the WebView2 already installed on Windows, which is the system's copy of Chromium and Edge. The application does the shell work: tabs, address bar, bookmarks, history, downloads, find in page, shortcuts and themes. It also does something harder, which is to wire the DevTools protocol into its own process.</p>

<p>The result is two binaries. The visible GUI browser, <code>nanobrowser.exe</code>, is about <strong>4.52 MB</strong>. The headless automation browser, <code>nanoagent.exe</code>, is about <strong>4.24 MB</strong>. Both share one library crate and one in-process DevTools protocol bridge.</p>

<p>This post doesn't sell concepts. It takes the implementation apart. The technical density is concentrated in four places: <strong>three kinds of sibling window inside one window</strong>, <strong>speaking CDP with no debugging port</strong>, <strong>hand-writing a SHA-1 handshake and a frame codec</strong>, and <strong>loading the official DevTools frontend into a child webview with a draggable docked panel</strong>. Each of those has a detail you only learn by trying it.</p>

<p>This is part one of two. Part two covers the tab engine, the headless agent, the five security layers and the fourteen pitfalls.</p>

<h2>One minute</h2>

<p><strong>A Chrome-shaped browser shell written in Tauri 2, plus a headless browser that AI tools can drive.</strong></p>

<table>
<thead><tr><th>Binary</th><th>Purpose</th><th>Release size</th></tr></thead>
<tbody>
<tr><td><code>nanobrowser.exe</code></td><td>The visible GUI browser</td><td>About 4.52 MB</td></tr>
<tr><td><code>nanoagent.exe</code></td><td>Headless automation browser, CLI and MCP</td><td>About 4.24 MB</td></tr>
</tbody>
</table>

<p>Browser features, ordered by how quickly you notice them.</p>

<ul>
<li><strong>A Chrome-style tab strip.</strong> Drag to reorder with FLIP animation, pin and unpin, middle-click to close, a per-tab context menu, overflow handling, and <code>Ctrl+Shift+T</code> to reopen the last closed tab.</li>
<li><strong>A complete shell.</strong> An omnibox with a suggestion dropdown, a bookmarks bar, find in page, a download manager, history, zoom, three-state theming (light, dark, follow system), and native window buttons.</li>
<li><strong>Docked DevTools.</strong> The <strong>real</strong> official DevTools frontend loaded into a child webview of the same window, dockable to the <strong>bottom</strong> or the <strong>right</strong>, with a draggable splitter that resizes it. It isn't a popup.</li>
<li><strong>Internal pages</strong> under the <code>nano://</code> scheme: new tab, history, bookmarks, downloads, settings and about.</li>
<li><strong>A headless agent.</strong> One-shot CLI commands and an MCP server over stdio, with redacted traffic capture, trusted input synthesis and screenshots.</li>
</ul>

<p>One thing is worth noting up front. The entire frontend is <strong>hand-written HTML, CSS and JavaScript with no bundler</strong>. No npm, no Vite, no framework. That's not novelty for its own sake. It's a deliberate trade of size and complexity, and the costs show up later in this post.</p>

<h2>Three decisions that go against instinct</h2>

<p><strong>Decision one: no engine.</strong> NanoBrowser contains no rendering engine, no disassembler and no JavaScript engine. It drives the WebView2 that is already installed. The cost is Windows only, because the whole stack rests on WebView2's COM interop. The benefit is an application measured in single-digit megabytes that shares the system's security updates for free.</p>

<p><strong>Decision two: never open a debugging port.</strong> Neither the GUI nor the agent passes <code>--remote-debugging-port</code>. All CDP traffic goes through <code>ICoreWebView2::CallDevToolsProtocolMethod</code> inside the process. The counter-intuitive part is this: the DevTools panel does need a WebSocket, but that socket is a <strong>loopback service the process opens for itself</strong> rather than a debugging port exposed by the browser. It has an admission requirement, its lifetime is tied to the panel, and nothing outside the process can use it.</p>

<p><strong>Decision three: hand-write the hard dependencies.</strong> The hardest piece, the WebSocket bridge that DevTools talks to, is this project's own SHA-1 handshake, base64 accept key and text and close frame codec. No <code>tungstenite</code>, no similar library.</p>

<p>Together those three define the character of the project. Reuse what the system already provides, and shrink the self-written surface to the layer that must be written and is worth writing.</p>

<h2>Stack, versions and release profile</h2>

<table>
<thead><tr><th>Layer</th><th>Choice</th><th>Version</th></tr></thead>
<tbody>
<tr><td>Application framework</td><td>Tauri</td><td>2.12.4</td></tr>
<tr><td>WebView abstraction</td><td>wry</td><td>0.57.0</td></tr>
<tr><td>Engine</td><td>Microsoft Edge WebView2, which is Chromium</td><td>Installed on the system</td></tr>
<tr><td>WebView2 COM bindings</td><td><code>webview2-com</code></td><td>0.39.1</td></tr>
<tr><td>Win32 bindings</td><td><code>windows</code></td><td>0.62.2</td></tr>
<tr><td>Serialization</td><td><code>serde</code> and <code>serde_json</code></td><td>1.0.154</td></tr>
<tr><td>Language</td><td>Rust</td><td>edition 2021</td></tr>
</tbody>
</table>

<p>Two Tauri features are enabled, and <strong>both are required</strong>.</p>

<pre><code>tauri = { version = "2", features = ["unstable", "devtools"] }
</code></pre>

<p><code>unstable</code> gates the whole child webview API: adding a child, getting a webview, and per-webview <code>devtools(false)</code>. Without it the core topology of this project doesn't exist. <code>devtools</code> exposes the <code>ICoreWebView2</code> interop that the protocol bridge needs.</p>

<p>The release profile is tuned item by item for size.</p>

<pre><code>[profile.release]
opt-level = "s"    # optimize for size, not speed
lto = true         # link-time optimization, cross-crate inlining and pruning
codegen-units = 1  # slower compiles in exchange for more aggressive optimization
strip = true       # drop symbols
panic = "abort"    # drop unwinding tables
</code></pre>

<p>Those lines together are what keeps a Rust and Tauri application at the 4 MB mark. Note the side effect of aborting on panic: <strong>there is no catch-unwind safety net</strong>, so any panic terminates the process. That's why the code prefers returning an option or an error at boundaries rather than writing first and worrying afterwards.</p>

<p>Crate sources go through a mirror configured in <code>.cargo/config.toml</code>.</p>

<h2>Repository layout</h2>

<pre><code>NanoBrowser/
├─ start.bat                       # launcher: release first, debug fallback
├─ .cargo/config.toml              # crate mirror
├─ ui/                             # frontend: plain HTML, CSS and JS, no bundler
│  ├─ index.html                   # trusted shell: tab strip, toolbar, SVG sprite
│  ├─ shell.js / shell.css         # shell behaviour and styles
│  ├─ internal.css / internal.js   # shared internal-page assets
│  ├─ ntp.html|js                  # nano://newtab
│  ├─ history.html|js              # nano://history
│  ├─ bookmarks.html|js            # nano://bookmarks
│  ├─ downloads.html|js            # nano://downloads
│  ├─ settings.html|js             # nano://settings
│  └─ about.html                   # nano://about
└─ src-tauri/
   ├─ tauri.conf.json              # productName, frontendDist, withGlobalTauri
   ├─ capabilities/
   │  ├─ default.json              # for the "shell" webview
   │  └─ tabs.json                 # for "tab-*": local pages vs remote pages
   └─ src/
      ├─ lib.rs                    # library crate, exports cdp
      ├─ main.rs                   # GUI binary: window, shell webview, wiring
      ├─ cdp.rs                    # in-process CDP bridge, shared by both binaries
      ├─ state.rs                  # settings, profile, app state, tab, constants
      ├─ profile.rs                # data directory, profile.json read and atomic save
      ├─ tabs.rs                   # tab lifecycle, layout, downloads, shortcuts
      ├─ inject.rs                 # per-tab init script
      ├─ commands.rs               # the command surface
      ├─ devtools.rs               # docked panel and WebSocket bridge, the hardest module
      └─ bin/nanoagent/
         ├─ main.rs                # hidden window, mode dispatch
         ├─ browser.rs             # navigate, read, click, fill, screenshot, cookies, wait
         ├─ cli.rs                 # one-shot commands and help
         ├─ mcp.rs                 # MCP server over stdio
         ├─ traffic.rs             # network capture with redaction
         └─ paths.rs               # data directories and the automation profile
</code></pre>

<p>Two signals in that structure are worth attention.</p>

<p>First, <strong><code>cdp.rs</code> is exported as a library</strong>, and both the GUI <code>main.rs</code> and <code>bin/nanoagent/main.rs</code> depend on it. That's where "one core, two entry points" becomes physical: the two binaries share one protocol bridge implementation instead of each writing its own.</p>

<p>Second, <strong><code>devtools.rs</code> is called out as the most complex module</strong>, and the README gives its design a chapter of its own. Core 4 below expands on it.</p>

<h2>Core 1: N+1 webviews in a single window</h2>

<p>This is the architectural foundation, and the key to everything that follows.</p>

<h3>Topology: three kinds of sibling window</h3>

<p>NanoBrowser's entire interface is <strong>one operating-system window</strong>. Inside it live up to three kinds of <strong>child webview</strong>, and every child is a <strong>sibling HWND</strong> rather than a true child.</p>

<pre><code>┌─ main window ───────────────────────────────────────────────┐
│  shell webview  (label "shell")   ← y: 0 .. shell_h         │
│    tab strip (40) + toolbar (44) + bookmarks bar (28, optional)
├──────────────────────────┬──────────────────────────────────┤
│  page webview            │  devtools panel webview          │
│  (label "tab-&lt;id&gt;")      │  (label "devtools")              │
│  one per tab, only the   │  exists only while open;         │
│  active one is visible   │  bottom or right                 │
└──────────────────────────┴──────────────────────────────────┘
</code></pre>

<ul>
<li><strong>shell.</strong> The trusted browser chrome at <code>ui/index.html</code>, holding every IPC command. In Tauri terms it is the only webview that is trusted.</li>
<li><strong><code>tab-&lt;id&gt;</code>.</strong> One child webview per tab, <strong>created lazily</strong> and hidden or shown on switch. All tab webviews share <strong>one</strong> WebView2 user-data directory, so cookies and login state carry across tabs.</li>
<li><strong><code>devtools</code>.</strong> The docked panel, created the first time it opens.</li>
</ul>

<p>Layout is computed in Rust in <code>tabs.rs::layout</code> and applied to each webview with position and size calls.</p>

<h3>Deriving the shell height</h3>

<p>The chrome height is derived rather than guessed, from three pieces.</p>

<pre><code>shell_h = STRIP_H(40) + TOOLBAR_H(44) + (bookmarks_bar ? BM_H(28) : 0)
</code></pre>

<p>That is <strong>84 logical pixels without the bookmarks bar and 112 with it</strong>. The page area is everything below the chrome.</p>

<p>All of it is in <strong>logical pixels</strong>, Tauri's logical size and position types, with scaling folded in through the scale factor. The window-size helper reads the inner size and divides by the scale factor, so window coordinates and logical coordinates never get mixed on a HiDPI display.</p>

<h3>State model</h3>

<p>The application state is guarded by <strong>a single mutex</strong> and handed to Tauri to manage.</p>

<table>
<thead><tr><th>Field</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>tabs</code></td><td>The live tabs</td></tr>
<tr><td><code>active</code></td><td>The current tab id</td></tr>
<tr><td><code>closed</code></td><td>A stack of url and title pairs, feeding reopen</td></tr>
<tr><td><code>shell_h</code></td><td>The chrome height described above</td></tr>
<tr><td><code>profile</code></td><td>Persisted settings, bookmarks, history, downloads, session and window geometry</td></tr>
<tr><td><code>next_id</code></td><td>Tab id allocator</td></tr>
<tr><td><code>sys_dark</code></td><td>System dark mode flag</td></tr>
<tr><td><code>overlay</code></td><td>Whether the shell is currently stretched over the whole window</td></tr>
<tr><td><code>devtools_open</code></td><td>Whether the panel is visible</td></tr>
<tr><td><code>devtools_h</code></td><td>Panel height when docked at the bottom</td></tr>
<tr><td><code>devtools_w</code></td><td>Panel width when docked at the right</td></tr>
<tr><td><code>win_save_pending</code></td><td>Debounce flag for persisting window geometry</td></tr>
</tbody>
</table>

<p>A tab carries its id, label, URL, title, loading state, pin state, icon, an internal flag, a <code>live</code> flag, the zoom index, back and forward availability, navigation counters and pending navigation. It also carries an <strong>opaque per-tab token</strong>, which is central to the security model in part two.</p>

<p>The <code>live</code> flag deserves a note. It says whether the tab's real webview has been created yet. A tab can exist logically while its webview doesn't, which is exactly how session restore paints a window full of tabs immediately.</p>

<h3>The IPC surface</h3>

<p>The shell calls Rust through <strong>40 commands</strong>, all in <code>commands.rs</code> and registered with one macro, grouped by purpose.</p>

<ul>
<li><strong>State reads:</strong> initial state, tabs, settings, bookmarks, history, downloads, top sites.</li>
<li><strong>Navigation:</strong> navigate, new tab, activate, back, forward, reload, stop, internal navigation.</li>
<li><strong>Tabs:</strong> close, toggle pin, move, duplicate, close others, close to the right, reopen.</li>
<li><strong>UI:</strong> zoom, omnibox suggestions, find query, find move, find close, chrome overlay, system theme changed.</li>
<li><strong>DevTools:</strong> toggle, set size, set side, drag end.</li>
<li><strong>Data:</strong> add, remove and update bookmarks, delete and clear history, set settings, open the downloads folder.</li>
</ul>

<p>Rust pushes state back through events: tab state, omnibox state, bookmark changes, theme changes, system theme, find results, focus requests, open find bar, and drag state.</p>

<p>One detail is worth copying: <strong>the frontend never polls and Rust pushes.</strong> The tab-state emitter serializes the whole tab list into an array of view models. The omnibox emitter sends the current tab's URL, title, loading state, zoom, star state, back and forward availability and id. Even the window title is composed on the Rust side.</p>

<pre><code>title = current tab title is non-empty ? "&lt;title&gt; - NanoBrowser" : "NanoBrowser"
</code></pre>

<h3>Why sibling windows matter</h3>

<p>This single fact is the source of every counter-intuitive problem later in the post. <strong>Child webviews are sibling HWNDs, so a later-created window paints above an earlier one.</strong> The shell is created first and page webviews after it, so by default <strong>the page covers the shell</strong>.</p>

<p>Two consequences follow immediately.</p>

<ol>
<li>Any shell UI that overflows the chrome region, such as the main menu, the omnibox dropdown or a tab context menu, is clipped by the page webview.</li>
<li>A child webview <strong>can't see pointer movement outside its own bounds</strong>, which makes drag-resizing the DevTools panel genuinely awkward.</li>
</ol>

<p>Those two consequences map to Core 5 and Core 4 below.</p>

<h2>Core 2: the in-process CDP core</h2>

<p><code>cdp.rs</code> is the heart of the project, shared by both binaries. Its design is shaped by two properties of <code>CallDevToolsProtocolMethod</code>.</p>

<h3>Property one: no request envelope</h3>

<p>Anyone who has written a CDP client against a debugging port is used to this shape, with replies matched by id.</p>

<pre><code>{"id": 7, "method": "Page.navigate", "params": {"url": "..."}}
</code></pre>

<p><code>CallDevToolsProtocolMethod</code> has <strong>no such layer</strong>. You pass a method name and parameters, and its completion callback receives <strong>that method's own result object</strong>. No id, no envelope.</p>

<p>Replies therefore can't be matched by id. The project's solution is to give each call an <strong>incrementing sequence number</strong>, allocated from an atomic counter, and <strong>bake that number into the callback closure</strong> created for that specific call. When the callback fires, the result is dispatched to the matching waiter.</p>

<h3>Property two: callbacks run on the UI thread</h3>

<p>The second property is more dangerous. <strong>The completion callback runs on the WebView2 UI thread.</strong> Waiting for that callback on that same thread means waiting for yourself, which deadlocks immediately, and the bug appears most easily in the hidden-window agent.</p>

<p>So the calling model is this.</p>

<ul>
<li><strong>Every call is fire-and-forget.</strong> It is issued and returns without waiting.</li>
<li><strong>The caller is always a worker thread, never the UI thread.</strong> After issuing the request it blocks on a mutex and condition variable until the reply lands in shared state and wakes it.</li>
<li>Internally that is an atomic sequence counter for issuing, a mutex-guarded sink, a condition variable for waiting, and a pending map for callback-style replies.</li>
</ul>

<h3>Two calling styles</h3>

<p>Two styles sit on top, with a strict split of purpose.</p>

<table>
<thead><tr><th>API</th><th>Style</th><th>Who uses it</th></tr></thead>
<tbody>
<tr><td><code>call</code>, <code>call_raw</code>, <code>call_within</code></td><td><strong>Block</strong> for a reply, with a 30-second default timeout</td><td>The automation agent</td></tr>
<tr><td><code>send</code></td><td>Hand the reply to a callback, <strong>non-blocking</strong></td><td>The DevTools bridge, which must not block because it answers on its own socket thread</td></tr>
</tbody>
</table>

<p>That split isn't a matter of taste. It's a hard constraint. The DevTools bridge service loop runs on its own thread, and if it blocked while issuing a CDP request it would deadlock against its own replies to the panel.</p>

<p>The default timeout is 30 seconds, and the error message is fixed.</p>

<pre><code>CDP &lt;method&gt; timed out
</code></pre>

<p>Putting the method name in the error is worth copying, because when something hangs you can see which protocol method it hung on.</p>

<h3>Other details that matter</h3>

<ul>
<li><strong>Empty replies become <code>null</code>.</strong> Some CDP methods return nothing, so the callback receives an empty value. It's normalized to null rather than an empty string or undefined.</li>
<li><strong><code>on_event</code></strong> subscribes through <code>GetDevToolsProtocolEventReceiver</code>. The important point: <strong>once registered, the subscription belongs to WebView2</strong>, so the callback lives as long as the webview does. There is no unsubscribe; the webview must go away.</li>
<li><strong><code>with_webview</code> must be called off the main thread.</strong> That thread constraint is easy to trip over.</li>
<li><strong><code>Cdp::webview()</code> is the single entry point.</strong> It resolves child webviews by label and also resolves a <code>WebviewWindow</code>. One implementation serves the GUI's three child webviews and the agent's main window, which is how "one core, two entry points" is cashed out in code.</li>
</ul>

<p>Put together, <code>cdp.rs</code> does one job: <strong>wrap a callback-based COM interface that runs on the UI thread and has no request ids into a Rust API that can block, can be called from any worker thread, and correlates replies by sequence number.</strong> It is the most infrastructure-like piece in the project.</p>

<h2>Core 3: a hand-written WebSocket server</h2>

<p>The DevTools frontend needs a WebSocket to talk over. Rather than pull in <code>tungstenite</code>, the project writes the server by hand in <code>ws.rs</code>.</p>

<h3>The handshake</h3>

<p>It is the standard upgrade handshake, implemented item by item.</p>

<ol>
<li>Read HTTP request headers from the TCP stream, with two guards: a <strong>2048-byte read buffer</strong>, and abandonment once headers exceed <strong>16384 bytes</strong>, which stops anyone from flooding the port with an enormous header.</li>
<li>Scan the headers byte by byte until the blank line, which is where the header section ends.</li>
<li>Take <code>Sec-WebSocket-Key</code> and compute the accept key per RFC 6455, as the base64 of the SHA-1 of the key plus the fixed GUID. <strong>SHA-1 and base64 are both implemented here.</strong></li>
<li>Reply with <code>101 Switching Protocols</code> and the accept header.</li>
</ol>

<h3>Frame codec</h3>

<ul>
<li><strong>Receiving</strong> handles masking, the length extensions for one, two and four byte lengths, and <strong>fragmentation</strong>, where one logical message spans several reads.</li>
<li><strong>Sending</strong> picks the length encoding by payload size. <strong>Server frames aren't masked</strong>, as the RFC requires.</li>
<li>Text, pong and close are supported.</li>
</ul>

<h3>The heartbeat of the service loop</h3>

<p>After reading the headers, the accept function does one small thing that decides the shape of the entire bridge.</p>

<pre><code>s.set_read_timeout(25ms)
</code></pre>

<p>That isn't a failure timeout. <strong>It is the service loop's tick.</strong> The loop polls the socket: a zero-byte read means the panel left, and a would-block or timed-out result means no data yet, detected by an idle check. One thread therefore handles both panel messages and CDP events, with no need for select or epoll.</p>

<h3>Tests</h3>

<p><code>tests/ws_bridge.rs</code> validates the server with an <strong>independently implemented client encoder</strong>, deliberately not round-tripping the decoder against its own inverse. Coverage includes a completed handshake reporting its session path with the exact status and accept value; <strong>a connection without a session key receiving no headers and no bytes at all</strong>, which is the assertion that this port isn't a public debugging port; <strong>a 70 KB payload reassembled across several reads</strong>; ping answered with pong; and close answered with an empty-payload close frame.</p>

<h2>Core 4: the docked DevTools panel</h2>

<p>This is the most complex part of the project and the most worth reading. The README gives it its own chapter.</p>

<h3>Why it exists</h3>

<p>WebView2 does ship <strong>the real DevTools frontend</strong>, but exposes it only through <code>OpenDevToolsWindow</code>, which creates a <strong>separate window</strong>. A Chrome-style panel docked inside the window needs another route.</p>

<p>Two easier routes were rejected.</p>

<ul>
<li><strong><code>--remote-debugging-port</code></strong> isn't viable, because with that port open <strong>only the shell webview becomes a CDP target</strong>, and the official frontend can't attach to a page webview.</li>
<li><strong>Writing a minimal custom panel</strong> was rejected because it loses the complete Elements, Console, Network and Sources experience.</li>
</ul>

<p>The route taken is <strong>the official frontend plus an in-process loopback WebSocket bridge</strong>.</p>

<h3>The URL and the counter-intuitive fragment trap</h3>

<pre><code>devtools://devtools/bundled/inspector.html?ws=127.0.0.1:PORT/devtools/page/&lt;session-id&gt;#nanoSide=bottom|right
</code></pre>

<ul>
<li><code>devtools://devtools/bundled/</code> is the DevTools bundle WebView2 already ships, so the frontend needs no packaging of its own.</li>
<li>It speaks CDP over a <strong>loopback WebSocket served by this process</strong>.</li>
<li>The dock side lives in the <strong>fragment</strong>, and <strong>can't go into the query string</strong>.</li>
</ul>

<p>That last line is the most valuable non-obvious constraint in the project.</p>

<blockquote>
<p><strong>Appending a second query key after <code>?ws=</code>, for example <code>&amp;nanoSide=right</code>, makes WebView2's <code>devtools://</code> handler fail the entire load</strong>, and the page shows Chromium's "this page can't be reached" error. A fragment is parsed by the browser before that handler sees it, so it is safe.</p>
</blockquote>

<p>The trap has a nastier follow-up. <strong>While debugging it, <code>webview.url()</code> can't be trusted</strong>, because the error page still reports the URL you asked for. The reliable signals are whether the bridge received a client, and how many domains it registered.</p>

<h3>Admission: this isn't a debugging port</h3>

<p>The loopback WebSocket has three constraints.</p>

<ol>
<li>It binds to a <strong>random loopback port</strong>.</li>
<li>It <strong>accepts only the one session id minted for this panel's URL</strong>. The request path must match, and anything else gets no response.</li>
<li>Every CDP request is <strong>forwarded to a page webview</strong> through <code>CallDevToolsProtocolMethod</code>.</li>
</ol>

<p>Why that isn't a debugging port: a page scanning localhost finds a listener that answers nothing without the id, and the id exists only while the panel does. <strong>Nothing outside the process can attach to either browser.</strong> Combined with never passing the debugging-port flag, this is the "no debugging socket" layer of the security model.</p>

<h3>Events: a static table plus lazy subscription</h3>

<p>There is a very typical gap in the protocol here. <code>Schema.getDomains</code> <strong>reports 35 domains and returns no event names at all</strong>, so events can't be discovered dynamically.</p>

<p>The solution is a <strong>static table of event names</strong> plus <strong>lazy subscription per domain</strong>: only the domains the frontend actually enabled get subscriptions. The table covers the common domains, such as runtime console calls, exceptions and execution contexts; debugger script parsed, paused and resumed; profiler start and finish; heap snapshot chunks and progress; console messages; and page lifecycle events including navigation, dialogs, screencast frames and downloads.</p>

<p>Two robustness rules sit on top.</p>

<ul>
<li><strong>A single failed subscription is skipped</strong> rather than abandoning the whole domain.</li>
<li><strong><code>Page.startScreencast</code> isn't implemented on WebView2</strong>, which matters for the agent's screenshots. Calls like that come back to the frontend as <strong>CDP errors</strong> instead of breaking the bridge.</li>
</ul>

<p>The bridge loop also normalizes empty replies to an empty object, because the panel expects one; wraps errors as JSON-RPC errors; extracts the domain from the method name and deduplicates subscriptions per tab and domain; and fills empty parameters before pushing an event to the panel.</p>

<h3>Geometry: one split function and six constants</h3>

<p>Panel sizing lives in one function that returns the <strong>page rectangle</strong> and the <strong>panel rectangle</strong>. The benefit is that docking rules can be unit-tested without a real window, because the state is passed in as an argument.</p>

<table>
<thead><tr><th>Constant</th><th>Value</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>MIN_H</code></td><td>96</td><td>Minimum panel height when docked at the bottom</td></tr>
<tr><td><code>DEFAULT_H</code></td><td>320</td><td>Height on first open at the bottom</td></tr>
<tr><td><code>MIN_PAGE_H</code></td><td>96</td><td>Minimum height left for the page</td></tr>
<tr><td><code>MIN_W</code></td><td>240</td><td>Minimum panel width when docked at the right</td></tr>
<tr><td><code>DEFAULT_W</code></td><td>480</td><td>Width on first open at the right</td></tr>
<tr><td><code>MIN_PAGE_W</code></td><td>240</td><td>Minimum width left for the page</td></tr>
</tbody>
</table>

<p>For bottom docking, the page gets the content width and the content height minus the panel, and the panel sits at the bottom of the content. For right docking, the page gives up the panel width and the panel takes the right edge.</p>

<p>A clamp keeps both sides above their minimums, so a small window never squeezes the page out or the panel out.</p>

<p>There is also a timing detail. Opening computes the window layout <strong>before</strong> making the panel visible, so it doesn't flash at the previous session's geometry for one frame.</p>

<h3>Dragging the splitter when a child webview can't see outside itself</h3>

<p>The panel edge has a grip. It runs into a physical limit: <strong>a child webview can't see pointer movement outside its own bounds</strong>. The panel is only so tall or so wide, and once the pointer leaves it, the panel no longer receives pointer events.</p>

<p>The fix routes the pointer through the shell.</p>

<ol>
<li>On pointer down, the panel asks Rust to enable the overlay, which stretches the shell webview over the whole window and raises it.</li>
<li>The shell has a full-window capture layer that forwards coordinates to a size command.</li>
<li>Rust computes the new size:</li>
</ol>

<pre><code>bottom:  devtools_h = clamp(window_h - clientY)
right:   devtools_w = clamp(window_w - clientX)
</code></pre>

<ol>
<li>On pointer up, the capture layer is removed and the overlay is restored.</li>
</ol>

<p>Note that this chain uses <strong>the same overlay mechanism as Core 5</strong>. One flag serves both purposes: keeping menus from being clipped, and letting the grip drag across boundaries.</p>

<h3>Signalling between the panel and native code</h3>

<p>This is the prettiest trick in the project. The panel is a <code>devtools://</code> document, and in that environment <strong>Tauri's IPC doesn't exist</strong>, and <strong>WebView2's host object on the window doesn't exist either</strong>.</p>

<p>Both normal channels are cut. So the panel talks to Rust like this.</p>

<pre><code>window.open('https://nano-dt.invalid/&lt;action&gt;', '_blank');
</code></pre>

<p><code>nano-dt.invalid</code> is a domain that <strong>can't exist</strong>, so it is never actually visited. Rust sees the popup request in its new-window handler, reads the action from the path, and returns a deny response.</p>

<pre><code>NewWindowResponse::Deny
</code></pre>

<p><strong>Nothing navigates and nothing loads. The popup request is the message.</strong> It is a textbook use of a side-effect channel as a signal channel.</p>

<h3>Lifecycle</h3>

<ul>
<li><code>F12</code>, <code>Ctrl+Shift+I</code> and the main menu all toggle the panel.</li>
<li>Activate and create-tab retarget it, so the panel <strong>follows the active tab</strong>.</li>
<li>Close-tab forgets the dead tab's protocol state.</li>
<li><strong>Pressing <code>F12</code> inside the panel closes it.</strong></li>
<li>The dock side persists in settings, and <strong>switching sides reloads the panel</strong> so the grip lands on the correct edge.</li>
<li>Every webview, including the shell, the page tabs <strong>and the panel itself</strong>, calls <code>.devtools(false)</code>.</li>
</ul>

<p>That last line needs spelling out. <code>.devtools(false)</code> turns off the <strong>native DevTools popup</strong>, but it <strong>doesn't affect <code>CallDevToolsProtocolMethod</code></strong>. So the project can kill the native popup and keep full CDP at the same time. That's one of the pitfalls the README lists, and it is the precondition for the whole docking approach.</p>

<h2>Core 5: z-order and the overlay trick</h2>

<p>Back to the mine planted in Core 1: <strong>the page webview is created later and covers the shell</strong>, clipping every piece of overflowing shell UI, including the main menu, the omnibox dropdown and the tab context menu.</p>

<p>The fix is the chrome-overlay command, which does three things.</p>

<ol>
<li>While a menu or suggestion list is open, <strong>stretch the shell webview over the whole window</strong> and raise it to the top of the z-order.</li>
<li>On close, restore the shell to its normal chrome height.</li>
<li><strong>After any tab is created, activated or closed</strong>, re-assert the z-order, otherwise the newly created page webview climbs back over the chrome.</li>
</ol>

<pre><code>SetWindowPos(hwnd, HWND_TOP, 0, 0, 0, 0,
             SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_SHOWWINDOW)
</code></pre>

<p>The four flags together mean: <strong>change z-order only</strong>, without moving, resizing, stealing focus, or hiding. The one people forget is <code>SWP_NOACTIVATE</code>. Without it, every menu open re-activates the window and focus jumps.</p>

<p>So "stretch and raise" is reused in exactly two places: menu overflow and splitter dragging. One mechanism, two scenarios, and one of the few places in this project where the abstraction is exactly the right size.</p>

<hr>
<p><em>Continued in <a href="/en/article/nanobrowser-tauri-webview2-part-2/">part two</a>: the tab engine, the zero-framework frontend, the headless agent, the MCP server, traffic capture, the five security layers, the size accounting and the fourteen pitfalls.</em></p>
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
<p>This is part two. <a href="/en/article/nanobrowser-tauri-webview2/">Part one</a> covered the shell topology, the in-process CDP core, the hand-written WebSocket server and the docked DevTools panel. This half covers the tab engine, the frontend, the headless agent, the MCP server, traffic capture, the five security layers, the size accounting, persistence, and the fourteen pitfalls that cost real time.</p>

<h2>Core 6: the tab engine</h2>

<p><code>tabs.rs</code> is the largest business file, and it holds a number of small algorithms that deserve to be read on their own.</p>

<h3>Address bar parsing: three branches</h3>

<p>One function turns whatever the user typed into a navigation target.</p>

<ol>
<li>Empty input goes to the new tab page.</li>
<li>An internal page under the <code>nano://</code> scheme is used <strong>as written</strong>.</li>
<li>Something that looks like a URL gets <code>https://</code> prepended if it needs one.</li>
<li>Everything else is searched with the configured engine.</li>
</ol>

<p>The third branch is where the judgement lives, and it has precise rules.</p>

<ul>
<li>An explicit <code>http://</code> or <code>https://</code> prefix must also survive URL parsing.</li>
<li>A string containing spaces, or an empty string, is <strong>not</strong> a URL. That's a strong signal the user wants to search.</li>
<li>Otherwise the candidate gets <code>https://</code> and must then satisfy one of: the host is <code>localhost</code>, the host parses as an IP address, or the host has at least two dot-separated segments.</li>
<li>And the first character must be an ASCII letter or digit.</li>
</ul>

<p>Together they draw the least-wrong line between "<code>example.com</code> should be treated as an address" and "<code>how to code</code> should be treated as a query".</p>

<h3>Downloads: race-safe naming</h3>

<p>Same-name files don't overwrite. They become <code>report (1).pdf</code>, <code>report (2).pdf</code> and so on. That sounds simple until two downloads start at once: both can decide the path is free, and both write the same file.</p>

<p>The project removes the race with an <strong>atomic reservation</strong>. It claims the path by creating the file exclusively, and only the winner proceeds, so ownership is decided by the filesystem rather than by a check in memory. WebView2 fills in the content afterwards. The naming helper tries up to a thousand candidates, and the reservation is that exclusive create.</p>

<blockquote>
<p>In one line: <strong>let the filesystem's atomicity arbitrate the name, not an in-memory check.</strong></p>
</blockquote>

<h3>Favicons: keep the port</h3>

<p>The favicon guess has one detail that is easy to drop.</p>

<pre><code>scheme://host:port/favicon.ico
</code></pre>

<p><strong>The port must be included.</strong> A site running on a non-default port would otherwise point at a different origin's icon. Guessing wrong there isn't just ugly, it is semantically wrong.</p>

<h3>Zoom: a fixed fifteen-step ladder</h3>

<pre><code>0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0
</code></pre>

<p>The index is clamped against the array length before use, so an out-of-range value written into an old profile can't panic. In a build that aborts on panic that matters: one out-of-bounds read is the whole process. A test pins the behaviour, with index 999 still yielding 3.0.</p>

<h3>Shortcuts: split across two worlds</h3>

<p>Shortcuts are handled in two places, depending on whether focus is inside the page or inside the shell. A keystroke in a page is reported by the injected script and handled in Rust. A keystroke in the shell is handled directly by <code>shell.js</code>.</p>

<table>
<thead><tr><th>Shortcut</th><th>Action</th></tr></thead>
<tbody>
<tr><td><code>Ctrl+T</code></td><td>New tab</td></tr>
<tr><td><code>Ctrl+W</code></td><td>Close tab</td></tr>
<tr><td><code>Ctrl+Shift+T</code></td><td>Reopen the most recently closed tab</td></tr>
<tr><td><code>Ctrl+Tab</code>, <code>Ctrl+Shift+Tab</code></td><td>Next or previous tab</td></tr>
<tr><td><code>Ctrl+1</code> to <code>Ctrl+8</code></td><td>Select a tab by index</td></tr>
<tr><td><code>Ctrl+9</code></td><td>Select the last tab</td></tr>
<tr><td><code>Ctrl+L</code></td><td>Focus the address bar</td></tr>
<tr><td><code>Ctrl+F</code></td><td>Find in page</td></tr>
<tr><td><code>Ctrl+D</code></td><td>Bookmark the current page</td></tr>
<tr><td><code>Ctrl+H</code></td><td>History</td></tr>
<tr><td><code>Ctrl+J</code></td><td>Downloads</td></tr>
<tr><td><code>Ctrl+Shift+O</code></td><td>Bookmark manager</td></tr>
<tr><td><code>Alt+Left</code>, <code>Alt+Right</code></td><td>Back and forward</td></tr>
<tr><td><code>Ctrl++</code>, <code>Ctrl+-</code></td><td>Zoom in and out</td></tr>
<tr><td><code>Ctrl+0</code></td><td>Reset zoom</td></tr>
<tr><td><code>F5</code></td><td>Reload, passed to the engine</td></tr>
<tr><td><code>F11</code></td><td>Toggle fullscreen</td></tr>
<tr><td><code>F12</code>, <code>Ctrl+Shift+I</code></td><td>Toggle the docked DevTools panel</td></tr>
</tbody>
</table>

<p>One act of <strong>restraint</strong> is worth noticing. Editing keys, <code>Ctrl+R</code>, <code>Ctrl+P</code> and the <code>Ctrl+Shift</code> number combinations are <strong>deliberately left to the engine</strong> and not intercepted. The worst thing a browser shell can do is cleverly swallow a key the page needs. Under the same rule, <code>F5</code> isn't intercepted either.</p>

<h2>Core 7: the zero-framework frontend</h2>

<p>The frontend lives in <code>ui/</code> and is hand-written HTML, CSS and JavaScript, with <strong>no bundler, no framework and no npm</strong>.</p>

<p>Three things improve.</p>

<ul>
<li>No build step, so editing one line of HTML and reloading is the whole cycle.</li>
<li>UI asset size is close to zero, against a typical Electron plus React baseline.</li>
<li>The interface to Rust is trivial: with the global API enabled, the page calls those 40 commands directly through it.</li>
</ul>

<p>Two things get worse. There is <strong>no component reuse and no type checking</strong>, and state plus DOM are managed by hand. That's why <code>shell.js</code> spends so much effort on interactions that are manual but deterministic.</p>

<h3>Tab dragging: FLIP plus one deterministic click suppression</h3>

<p>This is the most delicate piece of the frontend.</p>

<ul>
<li>Pointer move, up and cancel drive it. The dragged tab follows the cursor while its siblings slide aside with FLIP transitions, so the strip <strong>always previews where the drop will land</strong>.</li>
<li>On release, a command tells Rust to reorder for real.</li>
<li>One detail decides whether it feels broken. <strong>The browser still fires a click after a drag</strong>, so without care you drag a tab and accidentally select it. The project sets a suppression flag and <strong>clears it on the next pointer down</strong>, rather than waiting a tick. It's <strong>deterministic</strong> and doesn't depend on task-queue timing.</li>
</ul>

<h3>Other frontend notes</h3>

<ul>
<li><strong>Suggestions.</strong> The function calls Rust, which matches against history and bookmarks, returns <strong>at most eight entries and deduplicates them</strong>. The frontend builds the DOM and handles both clicks and keyboard selection before navigating.</li>
<li><strong>Themes.</strong> One function resolves the setting plus the system dark flag into a final value, and then sets a data attribute on the document element. All design tokens hang off the root selector and its dark variant, so switching themes never touches a component class name.</li>
<li><strong>Window control icons.</strong> The icons are injected by JavaScript, and <strong>the SVG's CSS class must come with the markup</strong>. Without it, glyphs sized by class name, most visibly the fullscreen restore icon, render at their default enormous size. The README lists this as a pitfall.</li>
</ul>

<h2>Core 8: nanoagent, an invisible browser</h2>

<p><code>nanoagent</code> is <strong>the same browser engine in a window that is never shown</strong>, driven by AI tools.</p>

<ul>
<li>The window is created hidden, without a taskbar entry and without decorations. It uses <strong>its own</strong> WebView2 user-data directory under <code>data/automation</code>, <strong>fully isolated</strong> from the GUI profile, so automated logins and personal cookies never mix.</li>
<li>Control goes through the <strong>in-process</strong> CDP bridge, which means <strong>no debugging port</strong>.</li>
<li>One-shot commands start <strong>a fresh browser every time</strong>. MCP mode keeps <strong>one warm page across many tool calls</strong>.</li>
</ul>

<h3>One-shot CLI</h3>

<pre><code>nanoagent --mcp                              MCP over stdio, long session
nanoagent &lt;command&gt; [args...]                run one action and exit

navigate &lt;url&gt;                               open a URL, print url and title
read &lt;url&gt; [selector] [--html]               print page text, or HTML
shot &lt;url&gt; &lt;out.png&gt;                         save a PNG screenshot
cookies &lt;url&gt;                                list the profile's cookies for that page
traffic &lt;url&gt; [limit]                        print recorded requests, redacted
eval &lt;url&gt; &lt;js&gt;                              run JavaScript, print the value
click &lt;url&gt; &lt;selector&gt;                       click with a trusted mouse event
fill &lt;url&gt; &lt;selector&gt; &lt;value&gt;                type into an input
wait &lt;url&gt; &lt;selector&gt; [timeout_ms]           wait for an element
</code></pre>

<h3>Three implementation details, all of them pits</h3>

<p><strong>First, trusted input.</strong> A click dispatches mouse events in sequence, and filling inserts text through the input domain. The combined effect is that <strong>the page sees real user input rather than a scripted assignment to a DOM property</strong>. That matters against pages which detect automation through the trusted-input flag.</p>

<p><strong>Second, screenshots go around the missing API.</strong> WebView2 <strong>doesn't implement <code>Page.captureScreenshot</code></strong>. A hidden window, however, <strong>still composites</strong>, so the agent subscribes to the screencast stream and caches frames. The README leaves a fallback on record: if hidden windows ever stop compositing, move the window off-screen instead of hiding it.</p>

<p><strong>Third, readiness and thread discipline.</strong> The worker polls a readiness check <strong>up to 600 times at 50 ms intervals</strong>, because <strong>a webview must have a running event loop before it answers CDP</strong>. And while waiting for a reply it <strong>must never block the UI thread</strong>, which would deadlock. The reply lands in shared state and the worker waits on a condition variable. Those two rules are exactly what the <code>cdp.rs</code> design buys in the agent scenario.</p>

<h2>Core 9: the MCP server and its nine tools</h2>

<p>In <code>--mcp</code> mode the agent speaks <strong>JSON-RPC 2.0</strong> over stdin and stdout, implements <code>tools/list</code> and <code>tools/call</code>, and reports its name as <code>nanobrowser-agent</code>.</p>

<table>
<thead><tr><th>Tool</th><th>What it does</th></tr></thead>
<tbody>
<tr><td><code>browser_navigate</code></td><td>Opens a URL, returns url and title</td></tr>
<tr><td><code>browser_read</code></td><td>Page text or HTML, with an optional selector</td></tr>
<tr><td><code>browser_click</code></td><td>Synthesizes a <strong>trusted</strong> mouse event</td></tr>
<tr><td><code>browser_fill</code></td><td>Inserts text into a selector</td></tr>
<tr><td><code>browser_wait_for</code></td><td>Polls until a selector exists</td></tr>
<tr><td><code>browser_screenshot</code></td><td>Returns PNG bytes</td></tr>
<tr><td><code>browser_cookies</code></td><td>The automation profile's cookies</td></tr>
<tr><td><code>browser_traffic</code></td><td>Recorded requests, redacted</td></tr>
<tr><td><code>browser_eval</code></td><td>Runs JavaScript and returns its value</td></tr>
</tbody>
</table>

<p>The loop is simple and typical: read stdin line by line, parse method, params and id, dispatch initialize, list or call, and write the reply to stdout. It's pure stdio, with no network and no port, which makes it a natural child process for a local agent to manage.</p>

<p>Set against the capabilities, the design intent is clear. Navigate, read, click, fill, wait, screenshot and eval are <strong>hands and eyes</strong>. Cookies are <strong>the session</strong>. Traffic is <strong>observability</strong>. Together they are the minimal complete set for letting an agent operate a web page.</p>

<h2>Core 10: traffic capture and capture-time redaction</h2>

<p><code>traffic.rs</code> subscribes to network events and records requests. Its security rule is one sentence: <strong>redact at capture time, not at output time.</strong></p>

<p>The distinction matters. With "store first, redact later", the plaintext secret has already been sitting in a log buffer, and any dump can carry it away. Redacting at capture means <strong>the secret never entered the buffer</strong>.</p>

<p>The rules are specific.</p>

<ul>
<li><strong>Eighteen sensitive key substrings</strong>, matched case-insensitively: password, passwd, pwd, pass, token, secret, apikey, api_key, api-key, auth, cookie, session, csrf, credit, card, cvv, ssn and otp. A hit is replaced with three asterisks, in <strong>both JSON bodies and header maps</strong>.</li>
<li>Authorization and cookie headers, and form bodies, are covered by the same rules.</li>
<li>Bodies are truncated, with a separate cap for individual values. The buffer holds at most 500 entries.</li>
<li><strong>The log lives in memory only</strong> and is never written to disk.</li>
<li><strong>Redaction can't be turned off.</strong></li>
</ul>

<p>There is one more trap, about redirects. <strong>A redirect reuses the same CDP request id</strong>, so keying records by the raw id lets a later record <strong>overwrite the original request and lose its body</strong>. Entries are therefore keyed by a unique key derived from the redirect chain.</p>

<h2>The five security layers</h2>

<h3>Layer one: event origin, checked by token</h3>

<p>Each tab webview's init script embeds an <strong>opaque random token minted in Rust</strong>, twenty-four hex digits. Two properties follow.</p>

<ul>
<li><strong>A page can't forge events for another tab</strong>, because it doesn't know that tab's token.</li>
<li>Rust resolves the sender through the token and <strong>never trusts a tab id the page reports about itself</strong>.</li>
</ul>

<p>In other words, tab identity is <strong>minted on the Rust side and injected into the page</strong>, rather than something the page gets to declare. That's "pages are untrusted" made concrete.</p>

<h3>Layer two: favicons are hostile data</h3>

<p>A favicon is reported by a page and displayed by the trusted shell, so it is treated as <strong>hostile input</strong>.</p>

<ul>
<li>It is <strong>HTML-escaped before insertion</strong>.</li>
<li>It is given an error handler that swaps in a built-in globe icon when it fails to load.</li>
</ul>

<p>The conclusion: <strong>a page can never inject a URL of its choosing into the shell.</strong></p>

<h3>Layer three: per-webview capability scopes</h3>

<p>Tauri capabilities are scoped <strong>by webview label</strong>.</p>

<table>
<thead><tr><th>Capability</th><th>Applies to</th><th>Grants</th></tr></thead>
<tbody>
<tr><td><code>shell</code></td><td>The <code>shell</code> webview</td><td>Defaults plus window control and queries</td></tr>
<tr><td><code>tab-local</code></td><td><code>tab-*</code> webviews running internal pages</td><td>Defaults plus the ability to emit events, which is full application IPC</td></tr>
<tr><td><code>tab-remote</code></td><td><code>tab-*</code> webviews on external URLs</td><td><strong>Only</strong> the ability to emit events, so a remote page can report UI events and never call a command</td></tr>
</tbody>
</table>

<p>That last cell is the most important one in the whole security model. Internal pages are trusted with the full IPC surface. External pages can only emit. Even if the injected script is fooled by a page, all it can do is emit a UI event.</p>

<p>There is a counter-intuitive trap here, and the README names it. <strong><code>tab-remote</code> must cover all ports</strong>: both schemes with any port, plus the path form. A site running on a non-default port that <strong>no capability declaration matches</strong> will <strong>lose every injected feature at once</strong>. Shortcuts, hover state, find highlighting and favicon reporting all fail together. A configuration problem whose symptoms look like broken code is the hardest kind to diagnose.</p>

<h3>Layer four: no debugging socket</h3>

<p>Neither binary passes the debugging-port flag, and all CDP goes through the in-process call. The GUI's DevTools WebSocket does listen on loopback, but it binds a <strong>random port</strong> and accepts <strong>only the session id minted for this panel</strong>. Nothing outside the process can attach.</p>

<h3>Layer five: profile isolation</h3>

<p>The automation browser uses its own WebView2 data directory, separate from the GUI's. Cookies and login state <strong>never cross that boundary in either direction</strong>.</p>

<h2>Where 4.52 MB comes from</h2>

<p>Add up the earlier decisions.</p>

<ol>
<li><strong>No rendering engine.</strong> Reusing the system WebView2 removes the largest block.</li>
<li><strong>A release profile tilted entirely towards size</strong>: optimize for size, link-time optimization, one codegen unit, strip, abort on panic.</li>
<li><strong>No WebSocket library.</strong> A hand-written SHA-1 and frame codec removes a whole dependency tree.</li>
<li><strong>No framework and no bundler in the frontend.</strong> UI assets are close to zero.</li>
<li><strong>Rust and Tauri.</strong> Tauri never bundles a webview, which is an order of magnitude smaller than the route that puts Chromium inside the binary.</li>
</ol>

<p>That gives 4.52 MB for the GUI and 4.24 MB for the agent, <strong>sharing one library crate</strong>, so the protocol bridge exists once.</p>

<p>Startup follows the same logic. The launcher <strong>prefers the release binary and only falls back to debug</strong>. For a shell, cold start is essentially creating a window and loading local HTML. There is no engine to initialize.</p>

<h2>Persistence: atomic writes, caps and drive policy</h2>

<h3>Directories</h3>

<p>Every path derives from <strong>the executable's location</strong>, with environment overrides left for tests.</p>

<table>
<thead><tr><th>Content</th><th>Path</th><th>Environment variable</th></tr></thead>
<tbody>
<tr><td>Data root</td><td><code>&lt;project&gt;\\data</code></td><td><code>NANO_DATA_DIR</code></td></tr>
<tr><td>Persisted profile</td><td><code>&lt;project&gt;\\data\\profile.json</code></td><td>None</td></tr>
<tr><td>WebView2 user data, GUI</td><td><code>&lt;project&gt;\\data\\webview</code></td><td>None</td></tr>
<tr><td>Default downloads</td><td><code>&lt;project&gt;\\Downloads</code></td><td>None</td></tr>
<tr><td>Automation profile</td><td><code>&lt;project&gt;\\data\\automation</code></td><td><code>NANOBROWSER_AGENT_DIR</code></td></tr>
<tr><td>Agent data root</td><td><code>&lt;project&gt;\\data</code></td><td><code>NANOBROWSER_DATA_DIR</code></td></tr>
</tbody>
</table>

<p>That is where the project's "everything lives on the D: drive" comes from. Runtime data, caches, downloads and the WebView2 user-data directory all stay inside the project directory, and nothing is written to the system drive.</p>

<h3>profile.json</h3>

<pre><code>{
  "settings": {
    "searchEngine": "bing",        // bing | baidu | google
    "theme": "system",             // system | light | dark
    "homepage": "nano://newtab",
    "bookmarksBar": true,
    "startup": "session",          // session | ntp
    "downloadsDir": "",            // empty means the default directory
    "devtoolsSide": "bottom"       // bottom | right
  },
  "bookmarks": [ { "url": "...", "title": "...", "added": 0, "icon": "..." } ],
  "history":   [ { "url": "...", "title": "...", "time": 0 } ],   // capped at 500
  "downloads": [ { "url": "...", "name": "...", "path": "...", "time": 0,
                   "status": "done" } ],                          // capped at 100
  "session":   { "tabs": ["..."], "active": 0 },
  "window":    { "x": 0, "y": 0, "w": 1280, "h": 800, "maximized": false }
}
</code></pre>

<p>Three practices are worth copying.</p>

<ul>
<li><strong>Atomic save.</strong> The JSON is written to a temporary file and then renamed over the profile. A crash mid-write can't corrupt it, because the rename is atomic within a directory.</li>
<li><strong>Cap-tolerant loading.</strong> History and downloads are truncated on read, so a file someone edited by hand can't exhaust memory.</li>
<li><strong>Debounced window geometry.</strong> A pending flag plus a debounce keeps dragging the window from writing to disk on every frame.</li>
</ul>

<h2>Fourteen pitfalls that cost real time</h2>

<p>The README devotes a section to these counter-intuitive constraints, because they are the most valuable part of the project. Every one of them came out of a real debugging session.</p>

<p><strong>Layout and z-order</strong></p>

<ol>
<li>Every tab is an independent window, so <strong>a later-created page covers the shell</strong> and clips menus and suggestions. The fix is to expand the shell over the window and raise it while a menu is open, restore it on close, and re-assert z-order after any tab create, activate or close.</li>
<li><strong>A child webview can't see pointer movement outside its own bounds</strong>, so panel resizing has to route the pointer through a full-window capture layer in the shell.</li>
<li><strong>Window control icons are injected by JavaScript, and the SVG's CSS classes must travel with them</strong>, or class-sized glyphs such as the fullscreen restore icon render at default enormous size.</li>
</ol>

<p><strong>Concurrency and downloads</strong></p>

<ol start="4">
<li><strong>Closing tabs by index concurrently deletes the wrong neighbours</strong>, so the tab has to be looked up again inside the lock.</li>
<li><strong>Concurrent downloads of the same URL overwrite each other when matched by URL alone</strong>, so the path is reserved with an atomic exclusive create instead.</li>
</ol>

<p><strong>CDP</strong></p>

<ol start="6">
<li><strong>Waiting for a CDP reply on the UI thread deadlocks</strong>, especially with a hidden window. The callback writes shared state and a worker thread waits.</li>
<li><strong>A redirect reusing the same request id overwrites the original record and loses its body</strong>, so records are keyed by an id derived from the redirect chain.</li>
<li><strong>The debugging port is a dead end</strong>, because only the shell webview becomes a CDP target.</li>
<li><strong><code>Schema.getDomains</code> lists domains and returns no event names</strong>, so a static event table plus lazy per-domain subscription is required.</li>
<li><strong>Disabling native DevTools doesn't affect <code>CallDevToolsProtocolMethod</code></strong>, which is why the native popup can be killed while keeping full CDP.</li>
</ol>

<p><strong>Docked DevTools</strong></p>

<ol start="11">
<li><strong>The <code>devtools://</code> page is privileged</strong>: neither the WebView2 host object nor Tauri IPC exists, so a popup request that the app denies is the only signalling channel.</li>
<li><strong>A second query key after <code>?ws=</code> fails the entire load</strong>, so extra data must go in the fragment. And while debugging it, <strong>the reported URL can't be trusted</strong>, because the error page still reports what you asked for. The reliable signals are whether the bridge received a client and how many domains it registered.</li>
<li><strong>The grip sits on the edge facing the page</strong>, and the cursor follows the dock axis. The drag maths is a subtraction from the window edge on that axis.</li>
</ol>

<p><strong>Capabilities</strong></p>

<ol start="14">
<li><strong>A site on a non-default port that no declaration matches loses every injected feature at once</strong>: shortcuts, hover state, find highlighting and favicon reporting.</li>
</ol>

<p>Three of the fourteen are worth memorising outright: the DevTools URL rejects a second query key, disabling native DevTools doesn't disable in-process CDP, and sibling webviews can't see outside themselves. They are the most counter-intuitive, and the most likely to reappear in another project.</p>

<h2>Known limits</h2>

<p>The README lists these plainly, and they are worth passing on.</p>

<ul>
<li><strong>History and the new tab page still guess favicons</strong> from the host, while <strong>only bookmarks store the icon a page actually reported</strong>. Unifying them onto the bookmark logic is a known follow-up.</li>
<li>The docked panel <strong>supports the bottom and the right only</strong>. There is no left side, and no detaching into a separate window.</li>
<li><strong>Windows only</strong>, because the whole stack rests on WebView2 COM interop.</li>
<li>The repository ships <strong>no release pipeline</strong> beyond the installer target declared in the Tauri configuration.</li>
<li>There is <strong>no LICENSE file</strong> yet, which the README itself flags as something to add before distribution.</li>
</ul>

<h2>Verdict</h2>

<p>Three things are worth taking away from this codebase, and none of them is really about how to write a browser.</p>

<p><strong>First, building no engine is a capability, not laziness.</strong> Most projects default to implementing whatever they need. NanoBrowser asks the opposite question first: <strong>what does the system already have?</strong> Windows already has Chromium, so build only the shell. That buys 4.5 MB and near-zero engine maintenance, at the cost of Windows-only, and that cost is acceptable to its audience. Recognising which costs are acceptable matters far more than any comparison table.</p>

<p><strong>Second, the hard part isn't features but the host's boundaries.</strong> Almost all of the complexity here comes from four invariants: child webviews are siblings, CDP callbacks run on the UI thread with no request ids, the <code>devtools://</code> page has no conventional IPC, and its URL rejects a second query key. Those non-negotiable constraints shape the architecture, and they explain the whole list of pitfalls.</p>

<p><strong>Third, a side-effect channel can be a signal channel.</strong> When both legitimate channels are cut, find an effect the host is guaranteed to intercept and hang the parameters on it. It isn't elegant. It's correct, reliable, and needs no cooperation from the host.</p>

<p>Back to the three decisions: no engine, no debugging port, hand-written hard dependencies. Together they say one thing. <strong>Push reuse to its limit, and shrink the self-written surface to the part that must be written and is worth writing.</strong> A 4.5 MB browser isn't the result of trimming. It's the result of choosing not to rebuild something at every fork in the road.</p>

<h2>References</h2>

<ul>
<li>Repository: <a href="https://github.com/zhoujungis/NanoBrowser" rel="noopener noreferrer" target="_blank">zhoujungis/NanoBrowser</a></li>
<li>Project README, English: <a href="https://github.com/zhoujungis/NanoBrowser/blob/main/README.md" rel="noopener noreferrer" target="_blank">README.md</a></li>
<li>Project README, Chinese: <a href="https://github.com/zhoujungis/NanoBrowser/blob/main/README.zh-CN.md" rel="noopener noreferrer" target="_blank">README.zh-CN.md</a></li>
<li>Tauri 2: <a href="https://tauri.app/" rel="noopener noreferrer" target="_blank">tauri.app</a></li>
<li>Microsoft Edge WebView2: <a href="https://learn.microsoft.com/microsoft-edge/webview2/" rel="noopener noreferrer" target="_blank">learn.microsoft.com</a></li>
<li>Chrome DevTools Protocol: <a href="https://chromedevtools.github.io/devtools-protocol/" rel="noopener noreferrer" target="_blank">chromedevtools.github.io</a></li>
<li>Model Context Protocol: <a href="https://modelcontextprotocol.io/" rel="noopener noreferrer" target="_blank">modelcontextprotocol.io</a></li>
</ul>

<p>Related: <a href="/en/article/nanohermes-rust-coding-agent/">NanoHermes, a Rust agent with zero runtime</a> and <a href="/en/article/aidevops-terminal-client/">aidevops, an AI DevOps copilot in your terminal</a>.</p>
`,
  },
  {
    slug: 'lc-20-valid-parentheses',
    zhSlug: 'lc-20-valid-parentheses',
    topicSlug: 'leetcode',
    title: 'Valid Parentheses: the stack is forced by the structure',
    excerpt:
      'Three failure modes hide in nine lines of code, and the third check sits outside the loop. Why a counter cannot replace the stack, plus the priority variant and five sibling problems.',
    date: '2026-09-29',
    readingTime: 14,
    html: `
<h2>The problem</h2>

<p>Given a string <code>s</code> containing only <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, decide whether it is valid.</p>

<p>Valid means every opening bracket is closed by the <strong>same type</strong>, in the <strong>correct order</strong>, so nesting never crosses. Every closing bracket has a matching opener.</p>

<pre><code>Input:  s = "{[()]}"   Output: true
Input:  s = "()[]{}"   Output: true
Input:  s = "(]"       Output: false   (wrong type)
Input:  s = "([)]"     Output: false   (crossed nesting)
Input:  s = "(()"      Output: false   (unclosed)
</code></pre>

<p>It is a fixture in Chinese interview loops and the classic introduction to the stack.</p>

<h2>1. The core insight: the structure forces the stack</h2>

<p>The interesting part is that you never have to think "I should use a stack". The bracket structure hands you one.</p>

<p>Why is <code>"(]"</code> invalid while <code>"{[()]}"</code> is fine? Because every closing bracket matches the <strong>nearest</strong> unclosed opener of its type. Which is to say:</p>

<blockquote>
<p>The innermost unclosed opener has to close first. Last opened, first closed. That's LIFO.</p>
<p>"Remember the openers you haven't closed yet, and when a closer arrives look at the most recent one" is a stack, in plain English.</p>
</blockquote>

<p>So the solution reads like prose. On an opener, push it and record what you're waiting for. On a closer, ask the top of the stack whether it's the one you're waiting for. When the scan ends, the stack must be empty.</p>

<pre><code>def isValid(s: str) -> bool:
    pairs = {'(': ')', '[': ']', '{': '}'}
    stack = []
    for ch in s:
        if ch in pairs:                 # opener: push
            stack.append(ch)
        else:                           # closer: ask the top
            if not stack:               # failure two: nothing to close
                return False
            if pairs[stack.pop()] != ch:  # failure one: wrong type
                return False
    return not stack                    # failure three: leftovers
</code></pre>

<p>Nine lines, but three independent validity checks live in them. Miss one and a whole class of input goes wrong. That's the real test here, and section 2 breaks it down.</p>

<p>There is one implementation choice worth mentioning. The stack can hold the <strong>openers</strong> and look up the mapping on pop, or it can hold the <strong>expected closers</strong> directly: push <code>pairs[ch]</code> on an opener, then a closer only has to compare against <code>pop()</code>. The second version saves a lookup at pop time, and saying so in an interview is a small plus.</p>

<h2>2. Three failure modes, three checks</h2>

<p>"Valid" is not one condition. It is the conjunction of three negations, and each one has its own check. Miss one and you misjudge one family of input.</p>

<table>
<thead><tr><th>Failure</th><th>Example</th><th>Symptom</th><th>Where the check lives</th></tr></thead>
<tbody>
<tr><td><strong>Wrong type</strong></td><td><code>"(]"</code>, <code>"([)]"</code></td><td>The closer and the stack top are not a pair</td><td><code>pairs[stack.pop()] != ch</code></td></tr>
<tr><td><strong>Nothing to close</strong></td><td>the second <code>)</code> in <code>"())"</code>, or a lone <code>"]"</code></td><td>The stack is empty when a closer arrives</td><td><code>if not stack</code></td></tr>
<tr><td><strong>Left unclosed</strong></td><td><code>"(()"</code>, <code>"(((("</code></td><td>The scan ends with the stack non-empty</td><td><code>return not stack</code></td></tr>
</tbody>
</table>

<p>The first is "paired with the wrong partner", the second is "one too many", the third is "never finished". They are independent. A given input trips exactly one of them, and input is only valid when none of them fires.</p>

<p>Two positive-looking cases that catch people out:</p>

<ul>
<li><code>"(]"</code>: when <code>)</code> arrives the top is <code>(</code>. The count is right, one opener and one closer, but the <strong>type</strong> is wrong. Some people think "every opener got a closer" is enough. It isn't.</li>
<li><code>"([)]"</code>: right count, right types, wrong <strong>nesting order</strong>. <code>[</code> closes <code>]</code> while <code>(</code> is still open. The stack catches exactly this: when <code>)</code> arrives the top is <code>[</code>, not <code>(</code>.</li>
</ul>

<h2>3. The frames, step by step</h2>

<p>Walking <code>"{[()]}"</code> takes six steps: three pushes, three matched pops, and the stack ends empty. Read the stack from bottom to top and keep an eye on the top, because that's the only cell the algorithm ever looks at.</p>

<ul>
<li><strong>push frame</strong>: an opener enters the stack and records what it is waiting for.</li>
<li><strong>match frame</strong>: the current closer matches the top, and the top pops. The pair is settled.</li>
<li><strong>mismatch frame</strong>: the top and the current character disagree. The stack top was waiting for <code>"]"</code> and got <code>")"</code>.</li>
<li><strong>unmatched frame</strong>: the stack is empty and a closer has nowhere to go.</li>
<li><strong>done frame</strong>: valid means the whole string is consumed and the stack is empty. Leftovers mean the remaining openers are marked as failures.</li>
</ul>

<p>The main example uses eight frames: three pushes, three matched pops, and the stack happens to empty out.</p>

<h2>4. The full walkthrough</h2>

<p>Take <code>"{[()]}"</code> as the main example, six characters.</p>

<table>
<thead><tr><th>Frame</th><th>i</th><th>ch</th><th>Action</th><th>Stack (bottom to top)</th><th>Note</th></tr></thead>
<tbody>
<tr><td>init</td><td>-</td><td>-</td><td>-</td><td>[]</td><td></td></tr>
<tr><td>1</td><td>0</td><td><code>{</code></td><td>push</td><td>[<code>{</code>]</td><td>waiting for <code>"}"</code></td></tr>
<tr><td>2</td><td>1</td><td><code>[</code></td><td>push</td><td>[<code>{</code>, <code>[</code>]</td><td><code>[</code> becomes the innermost</td></tr>
<tr><td>3</td><td>2</td><td><code>(</code></td><td>push</td><td>[<code>{</code>, <code>[</code>, <code>(</code>]</td><td>three levels deep</td></tr>
<tr><td>4</td><td>3</td><td><code>)</code></td><td>pop, match</td><td>[<code>{</code>, <code>[</code>]</td><td>the top <code>(</code> was waiting for exactly this</td></tr>
<tr><td>5</td><td>4</td><td><code>]</code></td><td>pop, match</td><td>[<code>{</code>]</td><td>the top <code>[</code> was waiting for exactly this</td></tr>
<tr><td>6</td><td>5</td><td><code>}</code></td><td>pop, match</td><td>[]</td><td>stack empties exactly</td></tr>
<tr><td>done</td><td></td><td></td><td></td><td>[]</td><td><strong>valid</strong></td></tr>
</tbody>
</table>

<p>Compare the three failures on the same walkthrough:</p>

<ul>
<li><code>"(]"</code>: at frame 2, the top <code>(</code> is waiting for <code>")"</code> and <code>]</code> arrives. Mismatch, false immediately.</li>
<li><code>"())"</code>: at frame 3, the second <code>)</code> finds an empty stack. Unmatched, false immediately.</li>
<li><code>"(()"</code>: the scan finishes with <code>(</code> still on the stack. Leftover, false.</li>
</ul>

<h2>5. The priority variant, and sibling problems</h2>

<h3>5.1 Adding a priority constraint</h3>

<p>One common interview twist assigns priorities: <code>(</code> is 1, <code>[</code> is 2, <code>{</code> is 3. Beyond correct pairing, an <strong>inner bracket may not have lower priority than the one containing it</strong>. Priority can only rise as you go inward, never fall.</p>

<table>
<thead><tr><th>Input</th><th>Plain rules</th><th>With priority</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>([{}])</code></td><td>true</td><td><strong>true</strong></td><td>1, then 2, then 3, rising</td></tr>
<tr><td><code>{(})</code></td><td>true</td><td><strong>false</strong></td><td><code>(</code> at 1 sits inside <code>{</code> at 3, priority inverts</td></tr>
<tr><td><code>[({})]</code></td><td>true</td><td><strong>false</strong></td><td><code>{</code> at 3 sits inside <code>(</code> at 1</td></tr>
<tr><td><code>{[()]}</code></td><td>true</td><td>true</td><td>rising throughout</td></tr>
</tbody>
</table>

<p>The direction can be reversed: some versions require the outer bracket to be strictly higher, which just flips the comparison. The mechanism does not change. Carry one more field in the stack frame and compare against the top before pushing.</p>

<pre><code>def isValidWithPriority(s: str) -> bool:
    pairs = {'(': ')', '[': ']', '{': '}'}
    prio = {'(': 1, '[': 2, '{': 3}
    stack = []                       # holds (char, priority)
    for ch in s:
        if ch in pairs:
            if stack and prio[ch] &lt; stack[-1][1]:   # inner must not be lower
                return False
            stack.append((ch, prio[ch]))
        else:
            if not stack or pairs[stack[-1][0]] != ch:
                return False
            stack.pop()
    return not stack
</code></pre>

<p>This is where the stack approach earns its keep: <strong>any extra constraint becomes one more field in the frame</strong>. That is what the interviewer is usually probing when they keep twisting a familiar problem.</p>

<h3>5.2 The family</h3>

<table>
<thead><tr><th>Problem</th><th>How the stack is used</th></tr></thead>
<tbody>
<tr><td>LC 22, generate parentheses</td><td>Generation rather than validation: counters act as a simplified stack during backtracking</td></tr>
<tr><td>LC 32, longest valid parentheses</td><td>The stack holds <strong>indices</strong>, with -1 as a sentinel floor; the length comes from index differences</td></tr>
<tr><td>LC 921, minimum add to make valid</td><td>Counter version: <code>need</code> counts unclosed openers, negative <code>bal</code> counts stray closers</td></tr>
<tr><td>LC 1541, minimum insertions for balanced string</td><td>Same idea with one-to-many pairing</td></tr>
<tr><td>LC 1047, remove adjacent duplicates</td><td>The same stack: if the top matches, pop it</td></tr>
</tbody>
</table>

<p>The family rule: when the most recently handled thing must be handled first, reach for a stack. Pairing problems store <em>what I am waiting for</em>, counting problems store only the balance, and index problems store the position too.</p>

<h2>6. Java</h2>

<pre><code>public boolean isValid(String s) {
    Map&lt;Character, Character&gt; pairs = Map.of('(', ')', '[', ']', '{', '}');
    Deque&lt;Character&gt; stack = new ArrayDeque&lt;&gt;();
    for (char ch : s.toCharArray()) {
        if (pairs.containsKey(ch)) {
            stack.push(ch);
        } else {
            if (stack.isEmpty() || pairs.get(stack.pop()) != ch) {
                return false;      // failure two and failure one, merged
            }
        }
    }
    return stack.isEmpty();        // failure three
}
</code></pre>

<p>Java convention prefers <code>ArrayDeque</code> over <code>Stack</code>, which extends <code>Vector</code>, carries locks and mixes in index access. Note also that the merged condition relies on short-circuit evaluation: <code>stack.isEmpty()</code> runs first, so <code>pop()</code> never touches an empty stack.</p>

<h2>7. Edge cases</h2>

<table>
<thead><tr><th>Input</th><th>Output</th><th>What it tests</th></tr></thead>
<tbody>
<tr><td><code>""</code></td><td>true</td><td>Empty input: the loop never runs, the stack is empty by default</td></tr>
<tr><td><code>"("</code></td><td>false</td><td>One opener, leftover</td></tr>
<tr><td><code>"]"</code></td><td>false</td><td>A closer as the first character, unmatched</td></tr>
<tr><td><code>"([)]"</code></td><td>false</td><td>Crossed nesting with correct counts and types</td></tr>
<tr><td><code>"(){}}{"</code></td><td>false</td><td>Early return on the first failure</td></tr>
<tr><td>length 10<sup>4</sup></td><td>n/a</td><td>Linear scan, no pressure</td></tr>
</tbody>
</table>

<h2>8. Complexity</h2>

<ul>
<li><strong>Time O(n)</strong>: each character is pushed and popped at most once.</li>
<li><strong>Space O(n)</strong>: the worst case is all openers, <code>"(((("</code>, with a stack depth of n.</li>
</ul>

<h2>9. Common traps</h2>

<h3>9.1 Checking pairing but forgetting the final emptiness check</h3>

<p>In <code>"(()"</code> every closer finds its opener, but openers are left over. The stack has to be checked after the loop. This is the failure mode people miss most often, because its check lives <strong>outside</strong> the loop.</p>

<h3>9.2 Popping before checking for an empty stack</h3>

<p>For the second <code>)</code> in <code>"())"</code> or a lone <code>"]"</code>, <code>pop()</code> on an empty stack raises <code>IndexError</code> in Python and an exception in Java. Plenty of people write <code>pairs[stack.pop()]</code> first and add the empty check afterwards. The empty check has to come <strong>before</strong> the pop.</p>

<h3>9.3 Replacing the stack with two counters</h3>

<p>Do <code>count(</code> and <code>count)</code> matching make a string valid? <code>"(]"</code> defeats it immediately: <code>(</code> and <code>]</code> are not the same type and counters do not know types. Even with one counter per type, <code>"([)]"</code> slips through, because every count is correct. <strong>Counters can check the balance. They cannot check the order</strong>, and order is the whole point.</p>

<h3>9.4 Assuming crossed nesting is fine</h3>

<p><code>"([)]"</code> has the right counts and the right set of types, so intuition says true. What saves you is the top-of-stack comparison: when <code>)</code> arrives the innermost bracket is <code>[</code>, not <code>(</code>. Keep this case as a self-test.</p>

<h3>9.5 Mishandling the empty string</h3>

<p><code>""</code> should return true: there is nothing to pair. The loop does not run, the stack is empty, and <code>return not stack</code> gives the right answer. Adding <code>if not s: return False</code> at the top, on the assumption that empty means invalid, breaks it.</p>

<h3>9.6 Using java.util.Stack</h3>

<p>It runs, but <code>Stack</code> extends <code>Vector</code>: synchronized, with an index interface it should not expose. Modern Java uses <code>Deque</code> or <code>ArrayDeque</code>. Small engineering point, easy to earn.</p>

<h2>10. How to answer in an interview</h2>

<ol>
<li><strong>State the insight in one sentence.</strong> The innermost unclosed bracket has to close first, which is last-in-first-out, which is a stack. The structure chose the data structure for you.</li>
<li><strong>List the three failure modes before writing code.</strong> Wrong type, nothing to close, left unclosed. Three checks, none optional, and the last one sits outside the loop.</li>
<li><strong>Offer <code>"([)]"</code> yourself.</strong> Correct counts, correct types, crossed nesting. It proves you understand that the top-of-stack comparison is checking order.</li>
<li><strong>Complexity.</strong> O(n) time, O(n) space, worst case all openers.</li>
<li><strong>Extend.</strong> The expected-closer variant, the priority variant that adds a field to the frame, the counter version (LC 921) and the index version (LC 32). It shows you know where this problem sits in the family.</li>
</ol>

<h2>Closing</h2>

<p>Valid parentheses is the cleanest way to explain a stack, because it needs no tricks. One observation carries the whole solution: nested brackets are inherently last-in-first-out. Nine lines hold three checks for three failure modes, and none of them is optional. Every variant in the family, whether counting, index-based or priority-constrained, is a change to what the frame stores. Next time something has to handle the most recent unhandled item first, start here.</p>

<p>Read the Chinese edition: <a href="https://blog.zhoujun.dev/article/lc-20-valid-parentheses/">有效的括号：栈是被结构逼出来的</a>.</p>
`,
  },
  {
    slug: 'lc-146-lru-cache',
    zhSlug: 'lc-146-lru-cache',
    topicSlug: 'leetcode',
    title: 'LRU Cache: a hand-written hash map and doubly linked list',
    excerpt:
      'Why the design needs both structures, three fixed pointer operations, the double delete on eviction, and what changes when the follow-up question is thread safety or LFU.',
    date: '2026-10-12',
    readingTime: 18,
    html: `
<h2>The problem</h2>

<blockquote>
<p>Source: Tencent asks it 123 times, ByteDance 72. Among hand-written design questions, this is the cache problem that shows up most.</p>
</blockquote>

<p>Design and implement a data structure that satisfies the <strong>least recently used</strong> cache constraint.</p>

<ul>
<li><code>LRUCache(int capacity)</code>: initialize with a positive capacity.</li>
<li><code>int get(int key)</code>: return the value if the key exists, otherwise -1.</li>
<li><code>void put(int key, int value)</code>: update the value if the key exists, insert it if not, and <strong>evict the least recently used entry when the cache is full</strong>.</li>
<li>Both <code>get</code> and <code>put</code> must run in O(1).</li>
</ul>

<p>You have to <strong>hand-write the doubly linked list and the hash map</strong>. <code>LinkedHashMap</code> and <code>OrderedDict</code> are off limits. Two follow-ups usually come next:</p>

<blockquote>
<p>One: how would you make it thread-safe?</p>
<p>Two: how does it differ from LFU, LC 460?</p>
</blockquote>

<p>The canonical test case, which is also the default script for the walkthrough below:</p>

<pre><code>LRUCache(2)
put(1,1); put(2,2)        list: [1] then [2,1]
get(1)                    returns 1,  list becomes [1,2]
put(3,3)                  evicts 2,  list: [3,1]
get(2)                    -1
put(4,4)                  evicts 1,  list: [4,3]
get(1) -1; get(3) 3; get(4) 4
</code></pre>

<h2>1. The core insight: two legs for O(1)</h2>

<p>Start with why both structures are necessary.</p>

<ul>
<li><strong>A hash map alone</strong>: <code>get</code> is O(1), but nothing records who is least recently used. Every eviction would scan all keys, O(n), and the order of use cannot be maintained at all.</li>
<li><strong>A linked list alone</strong>: order is trivial, but <code>get(key)</code> has to find the node first, and searching a list is O(n).</li>
<li><strong>Both together</strong>: the map gives <code>key</code> to node lookup in one step, and the doubly linked list keeps usage order. Each does the job the other cannot.</li>
</ul>

<pre><code>front (head side) = most recently used (MRU)
back  (tail side) = least recently used (LRU)   evictions always come from here
</code></pre>

<p>Two "why" questions come up almost every time.</p>

<p><strong>Why doubly linked and not singly linked?</strong> A <code>get</code> hit has to detach the node from the middle of the list and move it to the front. A singly linked list needs the predecessor to detach a node, and finding the predecessor means scanning from the head, O(n). With a doubly linked list the node carries <code>prev</code>, so detaching is O(1).</p>

<p><strong>Why sentinels?</strong> With a dummy head and tail, every node's <code>prev</code> and <code>next</code> are non-null, so insertion and removal never need a null check. That is half the <code>if</code> statements gone, and the boundary cases, capacity one and single-node lists, stop being special.</p>

<h2>2. Hand-written structure: three fixed operations</h2>

<p>The whole implementation is three pointer operations. Memorize their order and you stop getting them wrong.</p>

<ul>
<li><code>addToFront(node)</code>: attach the node right behind the head sentinel.</li>
<li><code>unlink(node)</code>: remove the node, letting its neighbors point at each other.</li>
<li><code>moveToFront(node)</code>: <code>unlink</code> then <code>addToFront</code>.</li>
</ul>

<p>Python, with no <code>OrderedDict</code>:</p>

<pre><code>class Node:
    __slots__ = ("key", "value", "prev", "next")

    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}                    # key -> Node
        self.head = Node()                 # sentinel: head.next is the first real node
        self.tail = Node()                 # sentinel: tail.prev is the last real node
        self.head.next = self.tail
        self.tail.prev = self.head

    def _add_to_front(self, node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def _unlink(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _move_to_front(self, node):
        self._unlink(node)
        self._add_to_front(node)

    def get(self, key: int) -> int:
        node = self.cache.get(key)
        if node is None:
            return -1
        self._move_to_front(node)          # a hit is a use
        return node.value

    def put(self, key: int, value: int) -> None:
        node = self.cache.get(key)
        if node is not None:
            node.value = value
            self._move_to_front(node)      # rewriting counts as a use
            return
        if len(self.cache) == self.cap:    # full: evict from the tail
            victim = self.tail.prev
            self._unlink(victim)
            del self.cache[victim.key]     # delete from both, or you get a ghost
        node = Node(key, value)
        self.cache[key] = node
        self._add_to_front(node)
</code></pre>

<p><code>put</code> has exactly three cases: the key exists, so update and move to front; the cache is not full, so insert at the front; the cache is full, so evict the tail from both structures and then insert. Reeling those three off in an interview is worth far more than "it's an LRU, you know".</p>

<h2>3. Reading the two walkthroughs</h2>

<p><strong>Walkthrough one, the LRU itself.</strong> The top row is the linked list. <code>H</code> and <code>T</code> are sentinels, the front is the most recently used and the tail is the eviction candidate. Each node shows <code>key:value</code> and a node number. The middle row is the hash map, whose entries look like <code>key to #n</code>. Watch them change together: an insert adds to both, an eviction removes from both. On an eviction frame the tail shows a dashed ghost node, which is the entry that was just detached.</p>

<p><strong>Walkthrough two, the LFU contrast.</strong> The same operation script is fed to an LFU cache, where nodes are ordered by ascending frequency, so the leftmost node is the next eviction. Each node carries a frequency badge, and both <code>get</code> and a <code>put</code> hit increment it. Two frames tell the whole story: at <code>put(3,3)</code> the LRU evicts <code>(2,2)</code> while the LFU evicts <code>(1,1)</code>.</p>

<h2>4. The full walkthrough</h2>

<p>Running the default script through the LRU, with the list written head to tail:</p>

<table>
<thead><tr><th>Operation</th><th>List (head to tail)</th><th>Hash map</th><th>Returns</th></tr></thead>
<tbody>
<tr><td>init</td><td>empty</td><td>empty</td><td></td></tr>
<tr><td><code>put(1,1)</code></td><td><code>1:1</code></td><td><code>1 to #1</code></td><td></td></tr>
<tr><td><code>put(2,2)</code></td><td><code>2:2</code> then <code>1:1</code></td><td><code>1,#1 ; 2,#2</code></td><td></td></tr>
<tr><td><code>get(1)</code></td><td><code>1:1</code> then <code>2:2</code> (moved to front)</td><td>unchanged</td><td><strong>1</strong></td></tr>
<tr><td><code>put(3,3)</code></td><td>evict <code>2:2</code>, insert, giving <code>3:3</code> then <code>1:1</code></td><td>remove 2, add 3</td><td></td></tr>
<tr><td><code>get(2)</code></td><td>unchanged</td><td>unchanged</td><td><strong>-1</strong></td></tr>
<tr><td><code>put(4,4)</code></td><td>evict <code>1:1</code>, insert, giving <code>4:4</code> then <code>3:3</code></td><td>remove 1, add 4</td><td></td></tr>
<tr><td><code>get(1)</code></td><td>unchanged</td><td>unchanged</td><td><strong>-1</strong></td></tr>
<tr><td><code>get(3)</code></td><td><code>3:3</code> then <code>4:4</code></td><td>unchanged</td><td><strong>3</strong></td></tr>
<tr><td><code>get(4)</code></td><td><code>4:4</code> then <code>3:3</code></td><td>unchanged</td><td><strong>4</strong></td></tr>
</tbody>
</table>

<p>Both eviction moments are worth memorizing. <code>put(3,3)</code> evicts <code>(2,2)</code> even though 2 was inserted later than 1, because the <code>get(1)</code> in between used 1 and left 2 untouched. <code>put(4,4)</code> evicts <code>(1,1)</code>: 1 had been popular, but once 3 arrived it was the tail. <strong>LRU looks at whether something was used recently, not at how often it was used.</strong></p>

<p>The LFU contrast, same script, one divergence:</p>

<table>
<thead><tr><th>Step</th><th>Frequencies</th><th>Decision</th></tr></thead>
<tbody>
<tr><td><code>put(1,1)</code>, <code>put(2,2)</code></td><td><code>1:1, 2:1</code></td><td>both cold</td></tr>
<tr><td><code>get(2)</code> twice</td><td><code>1:1, 2:3</code></td><td>in LFU a get raises the frequency</td></tr>
<tr><td><code>get(1)</code></td><td><code>1:2, 2:3</code></td><td>1 heats up, but stays behind</td></tr>
<tr><td><code>put(3,3)</code></td><td>evicts <code>1</code>, the lowest frequency</td><td>the LRU evicts <code>2</code> here</td></tr>
</tbody>
</table>

<p>Same operations, same capacity, different key evicted. That is the entire difference between LRU and LFU compressed into one trace.</p>

<h2>5. Follow-up two: how LFU differs</h2>

<table>
<thead><tr><th></th><th>LRU (146)</th><th>LFU (460)</th></tr></thead>
<tbody>
<tr><td>Dimension remembered</td><td><strong>Time</strong>: was it used recently</td><td><strong>Frequency</strong>: how often was it used</td></tr>
<tr><td>What a get hit does</td><td>Move the node to the front, changing order</td><td>Increment frequency, changing eviction priority</td></tr>
<tr><td>Who gets evicted</td><td>The tail, the least recently used</td><td>The lowest frequency, and among equals the least recently used</td></tr>
<tr><td>Structure</td><td>Hash map plus one doubly linked list</td><td>Hash map plus frequency buckets plus a <code>minFreq</code> pointer</td></tr>
<tr><td>Difficulty of O(1)</td><td>Low, three operations</td><td>High, bucket churn and <code>minFreq</code> maintenance</td></tr>
<tr><td>Typical weakness</td><td>A single scan can flush the hot set, which is cache pollution</td><td>Historical hot keys stick around; new keys get killed instantly</td></tr>
</tbody>
</table>

<p>LFU reaches O(1) through frequency buckets: each frequency value owns a doubly linked list ordered by recency, and a <code>minFreq</code> pointer tracks the smallest bucket. A hit moves the node from bucket f to bucket f+1. An eviction takes the tail of the <code>minFreq</code> bucket. <strong>The hard part of LC 460 was never the linked list, it is the buckets and the pointer.</strong></p>

<p>Production caches take a fourth route. Caffeine uses W-TinyLFU, an admission window combined with a frequency sketch, which resists scan pollution without maintaining exact buckets. Mentioning that in an interview changes the level of the conversation.</p>

<h2>6. Follow-up one: making it thread-safe</h2>

<p>Start by killing an assumption: <strong><code>get</code> is not a read-only operation</strong>. It calls <code>moveToFront</code>, which mutates the list. "Use a read-write lock because reads dominate" is therefore a non-starter, since every read may write.</p>

<ul>
<li><strong>One global lock</strong> is the simple, correct answer: <code>synchronized</code> in Java, <code>threading.Lock</code> in Python. Correct, trivial, and fully serialized. Say this first, then talk about optimization.</li>
<li><strong>Striped locks</strong> are the engineering answer: hash the key into N shards, each with its own LRU and its own lock. Concurrency rises, but capacity stops being exact, since each shard evicts independently and the total can drift.</li>
<li><strong>Approximate algorithms</strong> are the production answer: CLOCK or W-TinyLFU reduce each access to a constant number of bit operations instead of precise list maintenance, trading eviction accuracy for scalability.</li>
</ul>

<p>An interview sentence that works: the simplest correct version serializes everything behind one lock, and the bottleneck is that <code>get</code> also writes to the list. In production you step back to striping or approximation, trading eviction precision for concurrency.</p>

<h2>7. Java, also hand-written</h2>

<pre><code>class LRUCache {
    private static final class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    private final int capacity;
    private final Map&lt;Integer, Node&gt; map = new HashMap&lt;&gt;();
    private final Node head = new Node(0, 0);   // sentinel
    private final Node tail = new Node(0, 0);   // sentinel

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        Node node = map.get(key);
        if (node == null) return -1;
        moveToFront(node);
        return node.value;
    }

    public void put(int key, int value) {
        Node node = map.get(key);
        if (node != null) {
            node.value = value;
            moveToFront(node);
            return;
        }
        if (map.size() == capacity) {
            Node victim = tail.prev;            // tail is least recently used
            remove(victim);
            map.remove(victim.key);             // delete from both
        }
        Node fresh = new Node(key, value);
        map.put(key, fresh);
        addToFront(fresh);
    }

    private void addToFront(Node node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void moveToFront(Node node) {
        remove(node);
        addToFront(node);
    }
}
</code></pre>

<p>One Java detail: the sentinels are never in the map and can never be overwritten by a <code>put</code>. After <code>remove</code> you <strong>must</strong> call <code>map.remove</code>, or the evicted key stays in the hash map and the next <code>get</code> finds a node that is no longer on the list.</p>

<p>If a written test ever allows the standard library, <code>new LinkedHashMap&lt;&gt;(cap, 0.75f, true)</code> with <code>removeEldestEntry</code> overridden, or <code>OrderedDict</code> with <code>move_to_end</code>, solves it in one line. This question exists precisely because it forbids that.</p>

<h2>8. The family: 460, 432, 707, 2296, interview 16.25</h2>

<p>LC 146 is the origin point for the design, linked list and hash map family.</p>

<ul>
<li><strong>LC 460, LFU cache</strong>: the contrast in section 5. Frequency buckets plus <code>minFreq</code>, the natural next step.</li>
<li><strong>LC 432, all O(1) data structure</strong>: increment, decrement, get max and get min in O(1), using the same value-to-list bucket idea.</li>
<li><strong>LC 707, design a linked list</strong>: no cache at all, just raw doubly linked list operations.</li>
<li><strong>LC 2296, design a text editor</strong>: a doubly linked list with a cursor, the other classic use.</li>
<li><strong>Interview 16.25</strong>: the same problem under the interview numbering, with comparable frequency.</li>
<li><strong>LC 588 and 1166</strong>: path-to-node hashing combined with trees and lists, same underlying idea.</li>
</ul>

<h2>9. Edge cases and traps</h2>

<ul>
<li><strong>A <code>put</code> on an existing key must move it to the front</strong> and update the value. Forgetting that an overwrite counts as a use is the most common bug in this problem.</li>
<li><strong>A get miss must not disturb anything</strong>: return -1 and leave the structure alone.</li>
<li><strong>Eviction is a double delete</strong>: detach from the list <strong>and</strong> delete the map entry. List only gives a ghost node; map only leaks the node.</li>
<li><strong>Writing the same value still counts as a use.</strong> <code>put(1, 5)</code> when <code>1:5</code> is present still moves the node to the front.</li>
<li><strong>Capacity one</strong> needs no special case with sentinels, which is exactly what they buy you.</li>
<li><strong>Pointer order matters.</strong> Four lines in <code>addToFront</code>, two in <code>remove</code>. Get them backwards and a single-node list points at itself.</li>
<li><strong>Do not use the library.</strong> The prompt forbids <code>LinkedHashMap</code> and <code>OrderedDict</code>. It compiles, and the interviewer counts it as not answering the question.</li>
<li><strong><code>__slots__</code> in Python</strong> is a nice touch, worth mentioning and worth nothing if you skip it.</li>
</ul>

<h2>10. Complexity</h2>

<table>
<thead><tr><th>Operation</th><th>Time</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>get</code></td><td>O(1) amortized</td><td>Hash lookup, then a constant number of pointer writes</td></tr>
<tr><td><code>put</code></td><td>O(1) amortized</td><td>Lookup, at most one eviction, one insert at the front</td></tr>
<tr><td>Space</td><td>O(capacity)</td><td>Map and list each hold at most capacity nodes</td></tr>
</tbody>
</table>

<p>No traversal, no scan. That is all "O(1) LRU" means. Against LFU: with buckets and <code>minFreq</code> maintained correctly it is also O(1), but with considerably more structure to keep alive.</p>

<h2>11. How to answer in an interview</h2>

<p><strong>First, structure selection.</strong> Two legs: the hash map gives O(1) lookup from key to node, the doubly linked list gives O(1) reordering and eviction. Then why doubly linked, because detaching a middle node needs the predecessor, and why sentinels, because they remove every null check. Most candidates are vague here, and clarity on this part is half the interview.</p>

<p><strong>Second, the hand-written part.</strong> Three operations, <code>addToFront</code>, <code>unlink</code>, <code>moveToFront</code>. Three cases in <code>put</code>. The double delete on eviction.</p>

<p><strong>Third, the follow-ups.</strong> Thread safety, led by the observation that <code>get</code> writes to the list, with the global lock, striped and approximate answers in that order. LFU, which is the time dimension against the frequency dimension, with the same script evicting different keys, and O(1) from buckets plus <code>minFreq</code>.</p>

<p>One sentence to close on: the whole question is <strong>hash map finds, doubly linked list queues</strong>, and when you write it by hand, watch the sentinels, the double delete, and the fact that a <code>put</code> hit still moves the node to the front.</p>

<h2>Closing</h2>

<p>LC 146 contains no algorithm and no math. It tests how well you command a combination of two basic structures: the map gives O(1) access, the list gives O(1) order. Get this one right and LFU's frequency buckets, 432's buckets of buckets, and the striped and approximate thread-safe variants are all the same map with more detail on it. Write it once by hand; reading it ten times will not do the same thing.</p>

<p>Read the Chinese edition: <a href="https://blog.zhoujun.dev/article/lc-146-lru-cache/">LRU 缓存：手写哈希表与双向链表</a>.</p>
`,
  },
]

// 列表页、快照和 sitemap 都按这个顺序渲染：新稿在前，和中文站的列表一致。
EN_ARTICLES.sort((a, b) => String(b.date).localeCompare(String(a.date)))

export const EN_BY_SLUG = new Map(EN_ARTICLES.map((a) => [a.slug, a]))
