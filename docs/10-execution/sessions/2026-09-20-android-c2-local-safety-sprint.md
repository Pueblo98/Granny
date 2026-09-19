---
title: "Android C2 local safety sprint"
status: review
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, safety, synthetic]
related:
  - ../backlog.md
  - ../task-packets.md
  - ../../../experiments/c2-screen-explanation/README.md
  - ../../06-evals/evidence-protocol.md
record_type: session
session_state: active
record_basis: contemporaneous
agent: GPT-6 Astra root with GPT-5.6 Terra implementation and GPT-5.6 Sol independent review
branch: feature/t101-c2-local-safety-sprint
next_action: Implement and independently review the bounded C2 local capture and Stop state repair.
changed_paths: []
---

# Android C2 local safety sprint

## Scope and authority

Simon requested a bounded useful Android source slice, host checks, independent
review and a concrete future device verification packet on 2026-09-20. This
session uses granny-session-lifecycle, granny-task-slice and
granny-evidence-review. Tablet commands, installation, grants, capture, accounts,
egress and external app actions are not authorized. No device action is run.

The fetched Pueblo98/Granny origin/main is
`ee386eda0f0e4b47394bb3a84b1d782f51ffdb3e`, the required C2 merge.
The primary checkout is dirty and remains untouched. Root integration worktree
is `/tmp/granny-android-sprint`; Terra's exclusive source worktree is
`/tmp/granny-android-terra`, branch `fix/t101-c2-local-safety`. Sol is read-only.

## File ownership and peer dependency

| Owner | Assigned paths / boundary |
|---|---|
| Terra | Existing C2 observer Java main/test directories only; no manifest, Gradle or fixture changes |
| Astra | C2 README, this session, separate C2 verification packet, derived cockpit snapshot; integrates reviewed Terra commit |
| Sol | Read-only independent review of source, tests, evidence and readiness |
| Voice peer | `feature/t120-native-voice`, inspected at `51afeb0c46a0e5b9b0b9c3759bf6abe5da844b81`; shared shell/build/navigation/state and voice contract files excluded from this sprint |

All worktrees and local/remote branches were inspected before assignment. Voice
has ongoing PRD, traceability, voice-UX, architecture, feasibility, ADR-0011 and
open-question edits; none are ours to mutate. No competing native app is created.
Later read-only inspection found its in-progress shared shell under
`android/stage1/`, still uncommitted at the inspected branch HEAD. Backlog,
milestone, readiness, task packets and docs index are also being edited there;
this sprint links them without competing edits. The generated cockpit snapshot
will be regenerated from combined records when these branches are integrated.

## Readiness and outcome

The bounded T-101 C2 experiment already exists on main. Its local Stop/capture
state gaps take priority over starting a second function. Owners are UC-003/
UC-019, J-002, SCR-005/008, CMP-004/006, CAP-02/CAP-12, PRD-FR-005/013,
PRD-SAF-003/004, EVAL-002/006 and the T-101 packet; production
admission stays disabled. Exact source findings and test evidence follow after
implementation/review. Rollback is reverting this source slice; no migration or
persisted user data is introduced.

C5 Granny-owned text adjustment is the next local function candidate under
UC-007/CAP-11, but belongs in the voice peer's shared native shell after its
interface is available. This session will not create another application scaffold.

| Definition of Ready item | Bounded disposition |
|---|---|
| Observable outcome | One synthetic capture request at a time; old grants/results cannot reopen or replace it; Stop intent and confirmed cleanup remain distinct |
| State/interface owner | Existing C2 Activity/service/process ledger and pure consent state; no production typed-port or shell integration |
| Policy/data | POL-00 explicit per-session scope, CAP-12 Stop; no new permission, persistent payload or external route |
| Oracle | Test-owned attempted-effect history and controlled event ordering for host invariants; Android indicator plus fixture-owned scene and human result observations remain prospective |
| Dependencies | Existing cached JDK/SDK/Gradle/JUnit only; no dependency installation or device access needed for source/host slice |
| Exclusions | C2 admission, general screen understanding, package identity, runtime retention/egress proof, capture timing and complete access validation |
| Rollback | Revert scoped source commit; lab stays separate from candidate build; no data migration or shared voice-shell change |

Independent retention/egress admission cannot be supplied by adding another
counter to the observer itself. The new local effect tests are independent of
UI labels but remain offline fixtures; an authorized runtime monitor and its
own privacy/measurement protocol are still absent. No extra runtime collection
or device authority is inferred to fill that gap.

## Evidence

Startup evidence: verified origin URL, fetched remote main, confirmed required
merge ancestry, inspected branches/worktrees and dirty primary/voice paths.
Baseline host build passes 36 tests, debug assembly and lint (zero errors, six
warnings). An independent temporary Java probe against the baseline reproduces
three forbidden transitions: requesting over an active capture, activating the
same terminal generation and replacing an outstanding chooser. Final repaired
host validation is pending. Device tests are unrun. Existing C2 observations
remain bounded synthetic evidence, not selected-package identity or independent
retention/egress proof. T-101 remains in progress; C2 remains unadmitted;
T-104 remains blocked and GATE-03/04/06 remain open.

Primary-source review on 2026-09-20: Android's
[foreground-service troubleshooting](https://developer.android.com/develop/background-work/services/fgs/troubleshooting)
requires timely foreground promotion after `startForegroundService`; the
[Service API](https://developer.android.com/reference/android/app/Service)
documents start-ID-scoped stopping. These informed review of refused/delayed
starts and closing service instances; they are not evidence of this build's
Android runtime behavior.

Review-lane deviation: Sol ran one offline Gradle command in Terra's worktree,
writing ignored build/cache outputs despite its read-only assignment. No tracked
source was edited. Root stopped further review-lane writes; that intermediate
run is excluded from final artifact evidence. Root's final build in its own
exclusive worktree is authoritative for the delivered APKs and host results.

## Handoff

Implementation and review in progress. Mixed-code main integration needs Simon's
explicit authority after the reviewed PR exists. Primary-vault synchronization
is excluded while overlapping design work remains.
