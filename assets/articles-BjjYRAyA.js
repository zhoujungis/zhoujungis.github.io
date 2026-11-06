var e=[{slug:`aidevops-terminal-client`,zhSlug:`aidevops-terminal-client`,title:`aidevops: an AI DevOps copilot that lives in your terminal`,excerpt:`An open-source terminal client that stitches requirements, commits, tests, bugs and releases into one traceable chain — with an LLM layer that can only propose, never act.`,date:`2026-10-16`,readingTime:17,html:`
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
`}],t=new Map(e.map(e=>[e.slug,e]));export{t as n,e as t};