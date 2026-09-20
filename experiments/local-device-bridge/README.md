---
title: "T-125 closed local device bridge"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [experiment, android, device-control, evidence]
related:
  - ../../docs/10-execution/backlog.md
  - ../../docs/10-execution/task-packets.md
  - ../../docs/03-agent/tool-contracts.md
  - ../../docs/05-safety-privacy/action-policy.md
  - ../../docs/06-evals/evidence-protocol.md
---

# T-125 closed local device bridge

This lab-only host experiment tests a narrow interface between a planner and
one already-authorized Android tablet. The public command accepts only twenty
named cases. It has no arbitrary shell, ADB arguments, packages, coordinates,
text, URLs, intents, screenshot export, installation, permissions, account,
credential, purchase, message or deletion operation.

The bridge privately translates fixed cases into Android Debug Bridge calls.
This validates schema closure, semantic targeting, bounded external actions and
independent postcondition checks. It does **not** create a hard security
boundary while the same development user can edit or invoke the bridge; a Pi or
separate service account/process boundary would be a later experiment.

## Cases and effects

`T01`–`T05` check the device and navigate Granny. `T06`–`T13` use the public
fixture Playboi Carti / Magnolia in Spotify, verify exact metadata and
PLAYING/PAUSED state, and leave playback paused. `T14`–`T15` open YouTube and
search the public fixture “how to boil an egg”. `T16` opens only
`https://example.com/`. `T17`–`T18` open read-only Android Settings pages;
`T19` opens Clock without creating an alarm; `T20` returns Home.

Spotify and YouTube may add the fixed public fixtures to provider history.
No account/profile screen is intentionally opened or inspected. The bridge
returns normalized booleans and state names rather than raw transport output,
UI hierarchies, media metadata or device identifiers.

## Run

Use the reviewed local platform-tools binary through an environment variable;
do not commit a machine-specific path:

```bash
GRANNY_BRIDGE_ADB=/absolute/path/to/adb \
  python3 experiments/local-device-bridge/bridge.py catalog

GRANNY_BRIDGE_ADB=/absolute/path/to/adb \
  python3 experiments/local-device-bridge/bridge.py run-all
```

The model-facing invocation contains a catalog operation or case ID only. The
bridge rejects unknown cases before touching the transport. A nonzero exit may
still be a safe run: inspect each case's `failed_safely` reason and retain it in
the denominator. If T01 cannot establish exactly one awake, unlocked authorized
tablet, T02–T20 are recorded as `not_executed` rather than misreported failures.

## Host checks

```bash
python3 -m unittest discover -s experiments/local-device-bridge -p 'test_*.py'
python3 -m py_compile experiments/local-device-bridge/bridge.py
```

The tests cover the closed twenty-case catalog, unknown task/app/target/text and
system-page refusal, multiple/unauthorized device denial, component binding,
exact semantic matching, UI bounds, media identity/state, transport setup,
raw-output suppression and public-method schema inspection.

## Rollback and limits

Delete this experiment directory to remove the bridge. It installs nothing,
does not change the Granny APK and creates no persistent runtime state in the
repository. Search/play history in third-party providers is an external side
effect and is not silently deleted. Device/app/OS changes invalidate results.
