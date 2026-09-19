---
title: "Prepare T-120 tablet integration metaprompt"
status: accepted
owner: Simon
last_updated: 2026-09-20
tags: [execution, session, android, voice, tablet, metaprompt]
related:
  - ../t120-tablet-integration-handoff.md
  - ../current-milestone.md
  - ../../../android/stage1/README.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: feature/t120-native-voice
next_action: Paste the metaprompt into the tablet implementation session and complete its first bounded Android integration slice.
changed_paths:
  - android/stage1/README.md
  - docs/README.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/t120-tablet-integration-handoff.md
---

# Prepare T-120 tablet integration metaprompt

## Scope and authority

Simon requested a metaprompt for another session implementing tablet features
so the native voice decision and current tablet work converge in one app. This
session prepares and publishes that repository handoff. It does not modify
Android source, connect to a device, run MediaProjection, operate an external
app or integrate mixed code/documentation into `main`.

The work continues on `feature/t120-native-voice` so the handoff remains beside
the implementation it describes. Current `origin/main` was merged first; the
generated cockpit conflict was resolved by regeneration from the combined
session records. The dirty primary Obsidian checkout remains untouched.

## What changed

The new metaprompt directs the next session to treat `android/stage1` as the
product shell unless a newer native product module exists. It joins Type and
Android on-device voice through one conversation coordinator, maps the accepted
shared state surfaces to Android and places tablet functions behind a closed
capability, Stop and outcome-verification boundary.

The first vertical slice proves one reversible Granny-local capability,
preferably the identified C5 in-app text-size/readability adjustment if its
canonical readiness is complete. The C2 MediaProjection observer remains a
separate disabled lab capability: its recent source/host repairs can inform the
interface, but selected-package identity and independent retention/egress
evidence still block product admission.

The prompt includes branch/worktree safety, authority reading order,
architecture and lifecycle invariants, test oracles, device-evidence separation,
publication requirements and a concrete handoff format. It tells the coding
session to implement the slice rather than return another plan.

## Evidence

`python3 scripts/validate-docs.py` passes with zero errors across 221 Markdown
files and 2,845 local links. The documentation-tool suite passes 47 tests;
cockpit write/check passes with 78 session records, 13 Canvas nodes/five edges
and three Base views/embeds; handoff coverage and `git diff --check` pass.

No Android source, APK, runtime, browser, tablet, microphone, screen-capture,
accessibility or participant evidence is changed by this documentation-only
handoff.

## Handoff

Paste [the metaprompt](../t120-tablet-integration-handoff.md) into the tablet
implementation session. That session owns source inspection, code changes,
tests, exact permission/dependency audit and its own scoped session record. It
must stop after the first integrated vertical slice and leave each additional
tablet capability to its own readiness and evidence gate.
