---
title: "Handoff metaprompt — begin T-101 route and device evidence"
status: proposed
owner: Simon
last_updated: 2026-09-19
tags: [execution, android, evidence, handoff, prompt]
related:
  - task-packets.md
  - backlog.md
  - development-readiness.md
  - ../08-research/android-stage-1-feasibility.md
  - ../04-architecture/capability-admission.md
---

# Handoff metaprompt — begin T-101 route and device evidence

## How to use this handoff

Start a fresh session in `/home/lgtw/Work/granny` and paste the prompt below. T-101 is the next dependency-ordered task after Simon's 2026-09-19 acceptance of the bounded T-103 offline core. It is an evidence task, not a new runtime module.

The pasted instruction authorizes current-source desk research, a complete route matrix, physical-inventory preparation and the corresponding repository documentation changes. It does not authorize device commands, installs, developer settings, USB debugging, permission changes, accounts, app actuation, store contact/submission or personal-data inspection. If the physical tablet and explicit permission are not supplied in that session, finish Step A and the Step B/C plans, record device evidence as unrun and hand off the exact next authorization needed.

## Copy into the new session

> Use `$granny-session-lifecycle`, `$granny-evidence-review` and `$granny-task-slice` to begin T-101, **Inventory tablet and map permitted capability routes**. Complete the desk route inventory for all five accepted Stage 1 experiments and prepare the physical-inventory and smallest-synthetic-experiment worksheets. This is a T-101 evidence request, not authorization to build T-104 or operate a device.
>
> Start by reading `AGENTS.md`, `docs/README.md`, the current milestone, development readiness and Definition of Ready, `docs/10-execution/backlog.md#t-101`, `docs/10-execution/task-packets.md#t-101-packet`, ADR-0009, the PRD/scope, capability admission, system overview, tool and device-control contracts, action/privacy/threat policies, the reference-tablet note, Android feasibility assessment, EVAL-005/009/011, RES-02/04 and the evidence protocol. Confirm that T-103 is complete only for its accepted offline fake scope and that GATE-03/04/06 device conditions remain open.
>
> Fetch the verified `Pueblo98/Granny` origin. Preserve all dirty and untracked work in the primary checkout. Create a short-lived `docs/t101-route-inventory` branch and isolated worktree from current `origin/main`, then create one contemporaneous session record. Do not edit the primary checkout or another session's worktree.
>
> Reverify time-sensitive Android, Google Play and candidate-integration claims against current primary sources. Prefer Android Developers, Google Play policy/help and the owning service's official developer documentation. Record access dates, exact source/version where available, what the source states, and any inference separately. Do not turn documentation into measured compatibility or store approval. If current primary evidence conflicts with the repository, update the canonical feasibility/source owner and identify the affected gate; do not smooth over the conflict.
>
> Produce one per-workflow route matrix for ADR-0009's five experiments: sent family photos; scoped screen explanation/recovery; exact message preparation/confirmation; requested media; and Granny-owned text adjustment. For each, record the exact outcome, candidate API/integration/manual handoff or finite-recipe route, candidate versus synthetic-lab build mode, required grants/authentication/consent, observation source, action, independent postcondition, Stop/takeover boundary, hidden or collateral effects, version/distribution constraints, present evidence class, and go/conditional/no-go/unknown disposition. Distinguish inbox observation from compose, sender/channel/date provenance from local image metadata, playback from app launch/search, draft opened from sent, and Granny-local text from device-wide settings.
>
> Apply these non-negotiable route rules: no general-assistant dynamic AccessibilityService public route; no root, AOSP, device-owner, unrestricted shell, coordinates or credential tool; no consumer-messenger API assumption; no gallery substitution for sent photos; no adapter receipt or UI arrival counted as an independently verified effect. Keep unsupported routes disabled and retain truthful partial/unknown outcomes. Raise the accepted kill criterion if fewer than two useful externally verified delegated workflows have a plausible permitted route.
>
> Prepare the Step B physical worksheet without executing it. Include the pseudonymous device label and only the admitted non-identifying fields: exact model/SKU, Android/API, OEM/One UI build, security patch, locale/timezone, display/window/font settings, relevant input/access settings, available speech support, app package/version, synthetic account fixture, grants/app-ops, network profile and build/adapter identity. Explicitly exclude serial, IMEI, MAC, Android ID, SSID, account names, contacts, screenshots and personal content. Include a connected-device identity checkpoint before any future command and leave developer settings, USB debugging, permissions and accounts unchanged.
>
> Prepare Step C as the smallest synthetic experiment for each route still rated go or conditional. Define synthetic account/content fixtures, input, expected and forbidden effects, independent oracle, normal and revoke/Stop/version/auth/offline variants, teardown, retention and invalidation triggers. Execution remains separately gated. Do not install an SDK, create an Android scaffold, run ADB, enable a service, sign into an account, contact a provider/store or actuate an external app in this session unless Simon separately supplies the exact device/access and explicitly authorizes that action.
>
> Update only canonical consumers affected by actual findings: T-101 status, feasibility/source register, capability-admission worksheet, reference hardware unknowns, readiness/gate gaps, traceability and current milestone as applicable. Do not mark T-101 complete without the accepted device/configuration evidence required by its packet. Do not start T-104–T-109, implement an Android adapter, refactor T-103/T-117, use live models or handle personal data.
>
> Run `python3 scripts/cockpit.py --write`, `python3 scripts/cockpit.py --check`, `python3 scripts/validate-docs.py`, `python3 -m unittest discover -s scripts -p 'test_*.py'`, `python3 scripts/check_handoff.py --base origin/main` and `git diff --check`. Review the staged diff and secrets/personal data explicitly. Commit and push the scoped branch under standing authority, verify the remote SHA, and use the documentation-only PR/main integration workflow when the finished diff remains within that authorized class. Safely synchronize the primary vault only if incoming paths do not overlap dirty work.
>
> Hand off the exact workflows/routes assessed, source dates, go/conditional/no-go/unknown table, unrun physical fields and why, proposed synthetic experiments, gate consequences, changed files, commands/results, branch/commit/remote SHA, integration/vault state and the next bounded authorization. Do not claim Android support, Play approval, GATE-03/04/06 passage or T-101 completion from desk evidence alone.

## Required completion evidence

| Evidence | Required content |
|---|---|
| Scope | T-101 desk inventory plus physical/synthetic plans; no T-104 implementation |
| Routes | All five ADR-0009 experiments with access, effect, oracle, Stop and disposition |
| Sources | Dated current primary sources; facts separated from inference and unknowns |
| Device | Minimal non-identifying worksheet; execution and missing access reported honestly |
| Safety | Candidate/lab separation, forbidden routes, collateral effects and kill criterion |
| Gates | Exact remaining GATE-03/04/06 evidence; no desk-only promotion |
| Git | Isolated worktree, scoped commit, matching remote SHA and integration/vault state |
