---
title: "Opt-in Qwen conversation and simulated task proposals"
status: review
owner: Simon
last_updated: 2026-09-15
tags: [execution, session, prototype, ai]
related:
  - ../backlog.md
  - ../../08-research/openrouter-qwen-prototype.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/qwen-prototype
next_action: Review synthetic Qwen conversation and reconcile the parent conversation branch before separately authorized integration.
changed_paths:
  - .env.example
  - AGENTS.md
  - docs/README.md
  - docs/01-product/traceability.md
  - docs/02-design/browser-prototype.md
  - docs/04-architecture/system-overview.md
  - docs/05-safety-privacy/safety-and-privacy.md
  - docs/08-research/README.md
  - docs/08-research/openrouter-qwen-prototype.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
  - docs/10-execution/open-questions.md
  - prototypes/stage-1/README.md
  - prototypes/stage-1/app.js
  - prototypes/stage-1/browser-driver.mjs
  - prototypes/stage-1/cloud-browser-check.mjs
  - prototypes/stage-1/cloud.js
  - prototypes/stage-1/index.html
  - prototypes/stage-1/model.js
  - prototypes/stage-1/openrouter.mjs
  - prototypes/stage-1/openrouter.test.mjs
  - prototypes/stage-1/qwen-smoke.mjs
  - prototypes/stage-1/serve.mjs
  - prototypes/stage-1/serve.test.mjs
---

# Qwen experiment handoff

## Scope and authority

Simon requested Qwen3.8 testing using the private project env file, to refine communication and agency. [T-116](../backlog.md#t-116) is opt-in synthetic conversation and user-reviewed fictional task proposals only. No production backend, real device action, send, capture, personal data, dependency installation or model-vendor lock. Skills used: task-slice for bounded implementation and session-lifecycle for scoped handoff/maintenance.

## What changed

[Setup/interface/evidence](../../08-research/openrouter-qwen-prototype.md) owns the provider research and actual results. Added a dependency-free local proxy with server-only secret, exact origin/Host checks, input/output/cost/request/time bounds, one allowlisted proposal function and no automatic retries/execution. Added Menu AI consent, in-tab cloud conversation, unverified AI labels, proposal review, cancellation/late-response rejection and unsent local task handoff. Documented privacy exception and production-gate exclusions.

## Evidence

- `node --test --test-isolation=none prototypes/stage-1/openrouter.test.mjs prototypes/stage-1/serve.test.mjs prototypes/stage-1/model.test.mjs prototypes/stage-1/scheduler.test.mjs`: 70/70 passed after loopback permission. Initial sandbox run failed only the two loopback tests; a later Host test incorrectly used fetch, which did not send the requested Host override; corrected test uses node:http and passed. No production code bypass was added.
- `node prototypes/stage-1/cloud-browser-check.mjs`: passed consent/zero-autocall, proposal review, local unsent confirmation, Stop/late reply, mode-off and browser error/egress checks. Stub provider, not a paid call; 800px screenshot inspected in disposable profile.
- Live smoke: six successful responses across iterations; provider failures also occurred. Initial tone and later exact-wording review failed. Final v3 completed the greeting but stopped at provider-unavailable before exact draft/refusal. Narrow checks and reported usage are in the evidence owner; do not label this a clean quality pass.
- `python3 scripts/validate-docs.py`: PASS, zero errors; 99 Markdown, five skills, 1,683 local links, four preserved source hashes. `python3 scripts/cockpit.py --write` / `--check`: fresh, ten records. `python3 -m unittest discover -s scripts -p 'test_*.py'`: 46 tests OK; the expected negative Git fixture prints “fatal: Needed a single revision”. `git diff --check`: clean.
- `python3 scripts/check_handoff.py --base 387662f`: PASS for this task. `--base origin/main`: FAIL for nine inherited parent paths (assets, fixtures, intent, tests, scheduler and styles); the separate conversation session's final handoff is not in this snapshot. This is an explicit dependency blocker for a main-targeted PR, not grounds to fabricate another session's coverage or disable CI.
- A browser rerun exposed a test readiness race (HTML present before deferred app script). The check now waits for AI-mode initialization; rerun passed. Canonical Android/runtime/human evals, broader tone/repeatability and deployment checks remain unrun.

## Git and integration boundary

Isolated branch `feature/qwen-prototype`, based on unmerged conversation-first commit `387662f`. Later parent changes were observed and left untouched. The primary main checkout's user-modified action policy and Canvas, private .env and Obsidian state remain outside this task. No source-artifact changes. Publication follows standing task-branch authority; PR creation/main merge requires separate current approval. This record covers this task delta, not the other session's unfinished documentation. A combined PR must include its final session handoff and reconcile docs/test references.
