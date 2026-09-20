---
title: "T-125 closed local device bridge"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, device-control, evidence]
related:
  - ../backlog.md
  - ../task-packets.md
  - ../../03-agent/tool-contracts.md
  - ../../05-safety-privacy/threat-model.md
  - ../../../experiments/local-device-bridge/README.md
record_type: session
session_state: review
record_basis: contemporaneous
agent: Codex
branch: feature/t125-local-device-bridge
next_action: Publish and rerun the bounded cold-start and YouTube-oracle repair through the closed T01-T20 catalog, retaining every prior pass
changed_paths:
  - experiments/local-device-bridge/README.md
  - experiments/local-device-bridge/bridge.py
  - experiments/local-device-bridge/test_bridge.py
  - docs/README.md
  - docs/01-product/traceability.md
  - docs/03-agent/tool-contracts.md
  - docs/05-safety-privacy/threat-model.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/task-packets.md
---

# T-125 closed local device bridge

## Scope and authority

Simon requested trying twenty representative tasks on the current development
tablet without exposing raw ADB to the model, before deciding whether to move
the controller to Raspberry Pi hardware. This session implements a host-only
closed interface and may run its fixed public fixtures on one already-authorized
TBL-01.

Authorized external effects are limited to foreground/navigation changes,
Spotify search/play history for Playboi Carti / Magnolia, YouTube search history
for “how to boil an egg” and Chrome history for `https://example.com/`. Spotify
must finish paused. The suite may read only normalized foreground, fixed UI-text
presence and exact Spotify identity/state predicates. It may not inspect
account/profile/credential/contact/message/file content, install apps, change
permissions/settings, create an alarm, purchase, send or retain raw output,
screenshots, identifiers, UI trees or media metadata.

## What changed

- Added a standard-library bridge with a public CLI limited to `catalog`, one
  exact `T01`–`T20` case or `run-all`.
- Compiled every app, semantic target, fixture string, URL, intent and system
  page into source. Fresh semantic nodes derive internal tap coordinates; the
  caller cannot provide coordinates, package names or arbitrary text.
- Added exact foreground and Spotify artist/title/playback-state oracles.
  Transport/UI/media output is reduced to registered booleans, state names and
  normalized errors.
- Added initial host contract tests. Unknown task/app/target/text/page, multiple
  or unauthorized device, component mismatch, substring selector, invalid
  bounds, wrong media identity/state and raw transport-output leakage all fail
  closed.
- Recorded THR-19: this same-user development harness is not a hard security
  boundary. Candidate builds must exclude it; a later Pi/separate-service
  experiment must test process and update authority independently.

## Evidence

`python3 -m unittest discover -s experiments/local-device-bridge -p
'test_*.py' -v` passes 24/24 after the bounded foreground-oracle repair. `python3 -m py_compile
experiments/local-device-bridge/bridge.py` and `git diff --check` pass.

The first model-facing `run-all` used only the closed CLI. T01 returned
`device_missing`; the corrected result is 0 verified complete, 1 failed safely,
19 not executed and 0 unsafe. No device task, provider query or history effect
occurred. This is actual precondition/fail-closed evidence, not synthetic-device
task evidence. A single bounded T01 retry returned the same missing-device
condition.

After Simon reconnected TBL-01, device pass 1 ran from published commit
`f2ff689f2538818fb9b96e66019326ca7d1dcb3f`. T01 verified one awake, unlocked
authorized tablet. T02–T20 all failed safely: Android accepted some fixed
launch/search requests, but the bridge's window-only foreground oracle did not
recognize Samsung resumed/top-resumed large-screen markers. Result: 1 verified
complete, 19 failed safely and 0 unsafe. Exact downstream effects remain
unverified and the run is retained rather than excluded.

The bounded repair adds only sanitized `topResumedActivity`,
`mResumedActivity` and `ResumedActivity` recognition alongside the existing
window markers, still returning only allowlisted package names. Regression
fixtures require a true top-resumed marker and reject incidental background
package mentions. A fresh device rerun is required from the repaired commit.

Device pass 2 ran from published repair commit
`cb81cbb79f912fda5acf754f166fdd5c7b5c9359`. Foreground verification worked:
T01–T03, T06 and T16–T20 verified. Granny/Spotify semantic cases failed safely
because hot app state did not expose the expected registered node; T14's
launcher resolution returned a normalized transport failure. T15 opened
YouTube with the fixed public query and verified its foreground package, but
the independent query predicate was false. The bridge incorrectly returned
`verified_complete` despite `resultObserved=false`. Evidence review therefore
downgrades the reported 10 complete / 10 failed / 0 unsafe to 9 verified
complete / 11 failed safely / 0 unsafe. This false nonconsequential completion
is retained as a verifier defect.

The next bounded repair cold-starts Granny, Spotify and YouTube through exact
package-bound MAIN/LAUNCHER intents, removing hot-state dependence and the
failing YouTube component-resolution path. T15 now raises a normalized failure
when its query predicate is false. No arbitrary package, component or intent is
added. The repaired suite passes 26/26 host contract tests before device rerun.

## Handoff

Publish the cold-start/query-oracle repair, then rerun `run-all` only through
the model-facing bridge and retain all twenty terminal outcomes. Do not bypass
a failed case with direct ADB. Any further correction requires fresh host
checks and a new source commit before another claim-bearing device run.

This mixed code/documentation task may be pushed under standing task-branch
authority. It is not authorized for PR merge, main integration, Pi purchase/
setup, production admission or gate acceptance.
