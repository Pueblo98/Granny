---
title: "Qwen conversation experiment — setup, boundaries and evidence"
status: review
owner: Simon
last_updated: 2026-09-15
tags: [research, prototype, ai, evidence]
related:
  - ../10-execution/backlog.md
  - ../10-execution/development-readiness.md
  - ../04-architecture/system-overview.md
  - ../05-safety-privacy/safety-and-privacy.md
  - ../02-design/browser-prototype.md
  - ../../prototypes/stage-1/README.md
---

# Qwen conversation experiment

## Authority and maturity

Simon requested Qwen3.8 testing with his local OpenRouter key on 2026-09-15, to improve communication and agency. This authorizes **opt-in synthetic-text model calls through a local development proxy**, not production infrastructure, personal-data testing, Android control, account access or real sends. It supersedes the browser prototype's previous blanket no-model/no-egress rule only for this experiment. Scripted mode remains the default. Stage 1 remains an Android tablet app; this is a browser design/communication experiment, not T-103 or a release backend.

Working choice: `qwen/qwen3.8-flash`, not a production vendor lock. One local Node adapter, no dependency install. More natural conversation and a model-proposed task can be explored now. Tool reliability, dignity, latency and usefulness are **not established** by a few examples. Human review and production gates remain open.

This branch is based on conversation-first commit `387662f`, ahead of main. The parent conversation session is still evolving; its later code/docs must be reconciled during a separately authorized integration. Do not copy files into the primary vault to simulate a merge.

## Run locally

From the task checkout root, using installed Node (tested 26.8.1):

```bash
node --env-file=/absolute/path/to/private/.env prototypes/stage-1/serve.mjs 4180 --cloud
```

The private file must define `OPENROUTER_API_KEY`. The committed [.env.example](../../.env.example) contains only an empty placeholder. Use an absolute path to the existing private file when running in a worktree. Do not copy the secret into a tracked file, browser bundle, screenshot, command argument value, agent message or public environment variable. Never `source` an untrusted env file. Node loads it without executing shell commands. The server does not auto-read arbitrary parent directories. Stop it with Ctrl+C.

Open http://127.0.0.1:4180 on the same computer. **Menu → AI mode → consent → Continue** starts a fresh conversation. No paid request is made by loading the page or opening that disclosure. Try fictional examples:

- “Can we take this one step at a time?”
- “Tell David Brother I will call after dinner via Example Messages.”
- “Find photos from Sophie.”
- “Play Nina Simone.”
- “Make text larger.”

AI mode can propose a task; **Review this simulated task** enters the existing local flow. Check the proposed request for changed wording or mistaken meaning. Person/channel ambiguity and exact unsent-draft confirmation remain local. The model does not receive local confirmation/results or execute another tool round. “Yes” in chat does not grant a tool permit. Menu → AI mode turns cloud off; reload returns to scripted mode. Start a new conversation clears tab history and cloud context. Text size and local aliases follow the existing clear-session contract and are not uploaded.

Without `--cloud`, or without a key, the same server runs scripted examples only. There is no browser key field. No cloud request is queued offline. Do not deploy, bind to LAN/0.0.0.0, expose through a tunnel or treat the local endpoint as authenticated production infrastructure.

## Implemented interface and limits

| Boundary | Contract / enforcement |
|---|---|
| Browser → proxy | POST `/api/chat`, JSON `{consent:true,messages:[{role,content}]}` only. Exact loopback Host and same-origin Origin required; no CORS grants. GET `/api/config` exposes availability/model/remaining process calls, never credentials |
| Request limits | At most 12 messages, 3,000 characters each, 12,000 total; HTTP body 60,000 bytes. Client input 2,000 characters; carries at most ten prior cloud messages. No system/tool roles or arbitrary options accepted from client |
| Provider | Fixed HTTPS OpenRouter chat-completions URL, fixed model, redirects rejected, one request at a time, six/minute, 20/process, 768 output tokens, 25-second upstream timeout, 30-second client deadline; no app retry or tool loop |
| Routing/cost | `require_parameters:true`, `data_collection:"deny"`, `allow_fallbacks:false`, provider price ceilings $0.15/M input and $0.47/M output. No alternate model or silent relaxation when unavailable. These are per-token ceilings and process caps, **not an account-wide dollar budget**; set an OpenRouter key credit limit separately |
| Model → proposal | One function, `prepare_simulation({request:string})`, maximum 1,000 characters. Reject malformed/multiple/unknown tools, extra keys, restricted/unknown intent, truncated output. The existing parser must classify photos/explain/media/readability/message. No generic shell/network/coordinate/credential action exists |
| Proposal → simulation | Preview the complete proposed request; explicit local click dispatches it. Reviewer send mode is forced off. Existing local task policy, ambiguity and specific confirmations apply. This is intent preparation, **not autonomous multi-step tool execution** |
| Result | Assistant text is textContent, not HTML/Markdown execution; raw reasoning/provider metadata/errors are dropped. AI text is labeled unverified. Only local simulation may report its fixture outcome. The model can still hallucinate; the label/prompt are not a guarantee of truthful prose |
| Stop / edits | Abort in-flight client request; server disconnect aborts upstream; generation guards discard late replies. Local task interaction invalidates pending AI proposals. New cloud request archives/stops an old local task and invalidates its approval. Stop cannot recall data already transmitted or guarantee a provider charge is canceled |
| Privacy | Only new cloud-mode text plus bounded cloud history and fixed fictional catalogue leave the machine. No microphone, screen, files, aliases, real contacts or local task history. No server transcript persistence or content logging. Browser DOM/history stays in tab memory; no localStorage or database. Clearing the tab does not delete provider-held data |
| Recovery | Generic bounded error with no raw upstream body; use scripted mode or explicitly retry by resubmitting text. Failed requests are not added to future cloud context. The visible user turn remains available for reference. A model/provider outage cannot disable local Stop or scripted flows |

The server is a local developer trust boundary, not protection against malicious software already running as this user. Origin/Host checks prevent ordinary cross-site browser abuse and DNS-rebinding access, not an authenticated local API. Request limits reset on server restart; never present them as billing enforcement. Account privacy settings were not inspected or changed.

## Communication and agency hypotheses

Prompt v1 produced an unwanted endearment and offered “send”; v2 banned pet names explicitly, shortened the style and distinguished draft preparation. Another response decorated an exact draft with quotes/brackets; v3 clarified optional grammar and added an exact-draft smoke assertion. These are observed weaknesses, not solved globally by better prompting.

Proposed interaction: short adult reply, one question at a time, no dashboard of capabilities. Ask a relevant clarification rather than treating every sentence as a command. Retain touch controls only when needed for a specific ambiguity, preview, Stop or recovery. Cloud text is not permission, a tool receipt or a factual memory record. Do not tune toward agreeable claims that an action succeeded.

Next refinement should replace the request-string proposal with strictly typed semantic slots, preserving original message text and provenance, before attempting richer multi-step agency. Alternatives: keep deterministic phrases (more predictable, less natural) or unrestricted agent framework (too much authority and cost for this experiment). This deliberately small adapter tests the conversation boundary first. No framework/provider decision is accepted for the eventual app.

## Evidence, 2026-09-15

Evidence author: this Codex session. Environments: installed Node 26.8.1, Linux Chromium in a disposable profile, fictional repository fixtures, supplied OpenRouter key held server-side. No personal prompts or real app actions.

| Evidence | Observed result / limitation |
|---|---|
| Public model catalogue | HTTP 200; exact Flash ID, prices and supported parameters confirmed against live API |
| First API attempt + diagnostic | HTTP 404 parameter/endpoint mismatch. `parallel_tool_calls` was absent from advertised support; removing it allowed subsequent requests. One-tool constraint is enforced locally regardless |
| First complete live set | Three transport/tool-shape checks passed: conversation, unsent-draft proposal, refusal of screen-injected shell/upload. However greeting used “love” and offered “send”; **tone review failed**. Old script checked tool shape only, not comprehensive quality |
| After tone tightening | Greeting passed narrow endearment check, draft tool matched kind but added bracket/quote punctuation; injection request failed with provider-unavailable. Not a clean quality pass |
| Final prompt v3 attempt | Greeting passed in 515 ms, 1,135 tokens, reported $0.00017665. Next draft request was unavailable; suite stopped without retry. Final v3 exact-draft and injection cases remain **unproven live** |
| Reported usage | Six successful responses across iterations reported approximately $0.000893 total. Failed-request cost was not reported; this is not a reconciled account bill or a future cost estimate |
| Synthetic regression | 70 Node tests passed after enabling loopback permission; includes prior model/scheduler/static-server cases and seven new adapter/API/state tests. No paid calls in this suite |
| Browser integration | Stubbed model: consent before request, proposal never autoruns, unsent local preview/confirmation, no model call for approval, Stop drops late reply, mode-off, no browser errors or external browser requests passed. Screenshot inspected at 800px; not a screen-reader/user study |

The inherited `browser-check.mjs` still targets the old tile UI at this branch's parent commit; the conversation session owns its replacement. Do not claim it passed here. The new [cloud browser check](../../prototypes/stage-1/cloud-browser-check.mjs) targets the current chat shell. Cross-session integration must run the parent's final conversation suite plus this suite. Browser fixture success is not Android success.

## Repeatable checks and follow-up evaluation

```bash
node --test --test-isolation=none prototypes/stage-1/openrouter.test.mjs prototypes/stage-1/serve.test.mjs prototypes/stage-1/model.test.mjs prototypes/stage-1/scheduler.test.mjs
node prototypes/stage-1/cloud-browser-check.mjs
```

Separately authorized paid check, never in CI:

```bash
node --env-file=/absolute/path/to/private/.env prototypes/stage-1/qwen-smoke.mjs --live
```

At most three requests, stops at provider error, no implicit retries. Synthetic inputs/output and sanitized usage print; no keys or raw provider errors. Narrow assertions: supported tool kind, exact fixed draft, no listed English endearments/send offer in greeting. A pass is not a general safety/refusal/comprehension score.

Trace: [PRD-FR-002/003/008/013](../01-product/prd.md), UC-006/J-003 and SCR-003/005/007, plus [EVAL-003/006/009/010](../06-evals/canonical-tasks.md) themes. New tests are **prototype evidence only**, not passage of those canonical device/runtime evals. [POL-02/03](../05-safety-privacy/action-policy.md) informs preview/consequence boundaries; no real action is admitted. Provider/planner/shell component owners remain in [architecture](../04-architecture/system-overview.md).

Next proposed batch: 20 deidentified synthetic prompts across plain conversation, exact message preservation, ambiguous people, mid-task correction, prompt injection, restricted requests, uncertain outcomes and dependency failure. Capture model/prompt commit, route, latency, tokens/cost, manual dignity review and verified tool shape separately. Repeat each important case at least three times with a pre-agreed spend cap. Kill criteria: bypassed local authorization, real-data leakage or any non-allowlisted effect. Do not expand autonomy while those fail. Multi-language, hearing/vision access profiles and representative human preference remain unrun; no inferred acceptance from age.

## Sources and limitations

All accessed 2026-09-15; publisher OpenRouter. These sources document the API, not Granny's reliability, legal compliance or store approval.

| Source | Establishes | Does not establish |
|---|---|---|
| [Model page](https://openrouter.ai/qwen/qwen3.8-flash), [live model catalogue](https://openrouter.ai/api/v1/models) | ID, advertised input/output prices, tools/schema support; live API was independently checked | Our task success, universal route availability, future pricing |
| [Tool calling](https://openrouter.ai/docs/guides/features/tool-calling) | Model suggests tools; client executes and can return results | That model suggestions are authorized, correct or safe |
| [Provider routing](https://openrouter.ai/docs/guides/routing/provider-selection) | Required parameters, collection filter, fallback setting, per-million price ceilings | Guaranteed provider availability or whole-account dollar limit |
| [Data collection](https://openrouter.ai/docs/guides/privacy/data-collection) | Separate OpenRouter/provider data-policy considerations | Reviewed account settings, legal suitability, or verified deletion; `data_collection:deny` is not our independently audited ZDR guarantee |
| [Reasoning tokens](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens) | Reasoning configuration controls | Guaranteed task quality when reasoning is disabled; this prototype does not expose raw reasoning |
