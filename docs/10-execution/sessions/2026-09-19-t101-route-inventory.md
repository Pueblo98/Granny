---
title: "T-101 route and device evidence session"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, android, evidence, session]
related:
  - ../backlog.md
  - ../task-packets.md
  - ../../08-research/android-stage-1-feasibility.md
  - ../../04-architecture/capability-admission.md
record_type: session
session_state: complete
record_basis: contemporaneous
agent: Codex
branch: docs/t101-route-inventory
next_action: Obtain explicit access for Step B read-only physical inventory on the pseudonymous tablet; authorize each Step C device experiment separately afterward.
changed_paths:
  - docs/01-product/traceability.md
  - docs/04-architecture/capability-admission.md
  - docs/07-hardware/reference-hardware.md
  - docs/08-research/2026-09-19-t101-route-inventory.md
  - docs/08-research/README.md
  - docs/08-research/android-stage-1-feasibility.md
  - docs/10-execution/backlog.md
  - docs/10-execution/current-milestone.md
  - docs/10-execution/development-readiness.md
---

# T-101 route and device evidence session

## Scope and authority

Simon authorized the documentation-only desk-research portion of [T-101](../backlog.md#t-101), including all five ADR-0009 workflow routes and preparation of the Step B physical-inventory and Step C synthetic-experiment worksheets. Device commands, ADB, installs, developer-setting or permission changes, account access, app actuation, store/provider contact, personal-data inspection, Android scaffolding and T-104 implementation are excluded.

The session uses the isolated `docs/t101-route-inventory` worktree created from fetched `origin/main` at `b1efc8d7b70d00b8f9a8239b6fe280e2fe9d9b2d`. The primary checkout's unrelated modified and untracked work remains untouched.

## What changed

The [T-101 desk artifact](../../08-research/2026-09-19-t101-route-inventory.md) records current official sources, five per-workflow matrices, route/build/grant/action/oracle/Stop/version/disposition fields, the unrun Step B worksheet and five smallest Step C plans. Canonical feasibility, admission, hardware, traceability, task, milestone and gate summaries now link the findings.

Sent-photo provenance has no ordinary candidate route; the exact integration remains unknown and a fixed semantic recipe is conditional lab work only. Scoped screen explanation and a named media integration are conditional. Local message preparation and Granny-owned text adjustment can proceed to synthetic experiments, but manual compose handoff and the internal setting do not count as externally verified delegation. With only explanation and media left as plausible external candidates, the accepted two-workflow kill criterion is at high risk, not yet triggered.

## Evidence

Source/desk evidence was collected from current Android Developers, Google Play/Android Help and Spotify primary documentation on 2026-09-19. Statements, project inference and unknowns are separated in the artifact. The Meta WhatsApp documentation endpoints were not reliably retrievable, so no consumer-messenger capability was inferred.

No device, account, provider, participant or external app was accessed. Every physical-inventory field and all Step C experiments remain unrun. Documentation validation and Git publication results are recorded below after execution.

Pre-publication checks from the isolated worktree:

- `python3 scripts/cockpit.py --write` — exit 0; snapshot written with 41 records.
- `python3 scripts/cockpit.py --check` — exit 0; fresh snapshot, 41 records, 12 Canvas nodes/3 edges and three Base views/embeds; structural only.
- `python3 scripts/validate-docs.py` — exit 0; PASS, 0 errors, 149 Markdown files, 2,151 local links, 48 requirements/trace rows, 17 evals, 18 tasks and four preserved source hashes. External URLs and Android/runtime/policy claims are outside the validator.
- `python3 -m unittest discover -s scripts -p 'test_*.py'` — exit 0; 47 tests passed. A printed `fatal: Needed a single revision` is an expected fixture subprocess message inside the passing suite.
- `python3 scripts/check_handoff.py --base origin/main` — exit 0; handoff coverage PASS.
- `git diff --check` — exit 0; no whitespace errors.
- Targeted `rg` scans over every changed path for private-key blocks, common GitHub/Google/OpenAI/Bearer token shapes, populated serial/IMEI/Android-ID/SSID fields and email addresses — exit 1 with no matches. The complete diff was also reviewed for personal data and unsupported device/store claims.

## Handoff

The bounded desk-and-planning session is complete; T-101 itself is not. GATE-03/04 and GATE-06 device/real-data conditions remain open. The exact next authorization is physical access to `TBL-01` plus explicit permission for manual read-only collection of the listed non-identifying fields. Any transport commands, installs, grants/settings changes, synthetic accounts, provider/network use or external-app actuation require a later exact authorization.
