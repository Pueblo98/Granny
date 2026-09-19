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
session_state: review
record_basis: contemporaneous
agent: GPT-6 Astra root with GPT-5.6 Terra implementation and GPT-5.6 Sol independent review
branch: feature/t101-c2-local-safety-sprint
next_action: Review the published code PR for main integration and authorize the exact synthetic tablet packet separately.
artifact_commit: e83ee9578b6ca16b5711efc941ff1921add80d11
changed_paths:
  - docs/10-execution/t101-c2-local-safety-verification.md
  - experiments/c2-screen-explanation/README.md
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/CaptureService.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/CaptureSessionStateMachine.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/CaptureStartAdmission.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/LabSessionLedger.java
  - experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/MainActivity.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/CaptureSessionStateMachineTest.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/CaptureStartAdmissionTest.java
  - experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/LabSessionLedgerTest.java
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
admission stays disabled. The reviewed source and host evidence below establish only this local
repair. Rollback is reverting this source slice; no migration or
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
same terminal generation and replacing an outstanding chooser. The repaired probe rejects all three transitions. Final repaired
host validation passes 49/49 cases in ten suites, with no failures/errors/skips. Device tests are unrun. Existing C2 observations
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

## Delivered source and independent review

Terra committed `ad1a793078de15a613ccdb2855c7cb8b25aab146`; root verified the Git
object rather than relying on the initially mistyped handoff hash, cherry-picked
it as `ad40ec2`, and completed reviewed integration fixes in
`e83ee9578b6ca16b5711efc941ff1921add80d11`. Terra ceased writes before root took
over source integration in its separate worktree. Root interrupted its pending
build during handoff; those incomplete runs are not final evidence.

The process ledger now excludes overlapping/replayed starts and preserves a
first terminal result. STOPPING survives UI recreation until cleanup reports a
terminal result. Late success racing with Stop is suppressed. Generation-only
broadcasts refresh canonical state, including ACTIVE, without carrying stale
success into another session. Recreated chooser consent is refused safely;
C2-07 cancellation permits a new explicit request afterward. Start/chooser
exceptions fail unavailable, and dynamic status text uses a polite accessibility
live region instead of a fixed description hiding the result.

[CaptureStartAdmission](../../../experiments/c2-screen-explanation/observer/src/main/java/org/pueblo98/granny/c2observer/CaptureStartAdmission.java)
is used by both queued service startup and the
[test-owned effect spy](../../../experiments/c2-screen-explanation/observer/src/test/java/org/pueblo98/granny/c2observer/CaptureStartAdmissionTest.java).
The scheduled order admits START, latches Stop, then attempts the queued effect;
its independent attempt count is zero. In an isolated temporary mutation copy,
removing the execution guard makes the test fail (`expected 0, observed 1`);
normal source passes. This is an offline ordering oracle, not an Android resource
or physical timing monitor. The check and physical effect are not an atomic
cancellation guarantee; admission of work already in flight remains a device
measurement and production-design limitation.

GPT-5.6 Sol's final read-only review reports **PASS for bounded source and host
transition scope**, with Android timing/resource cleanup, package identity,
retention/egress and TalkBack/large-text reachability explicitly unproved.
No production capability or gate was accepted.

## Final validation

Using the existing cached JDK 17, API 36 SDK, Gradle 9.6.0 and pinned project
libraries, from `experiments/c2-screen-explanation`:

```text
JAVA_HOME=/tmp/granny-c2-toolchain/jdk \
ANDROID_HOME=/tmp/granny-c2-toolchain/android-sdk \
GRADLE_USER_HOME=/tmp/granny-c2-gradle-home \
./gradlew --offline --no-daemon :observer:testDebugUnitTest \
  :fixture:assembleDebug :observer:assembleDebug lintDebug
```

Final run: **BUILD SUCCESSFUL**, 90 tasks (17 executed, 73 up-to-date), 49 tests,
zero failures/errors/skips. Lint: zero errors, six warnings total—OldTargetApi,
GradleDependency and MissingApplicationIcon once per lab module. No dependency
was installed. Initial sandbox failure (`usable wildcard IP`) was resolved by
the approved offline host-build escalation; no tablet access followed.

Binary `aapt2 dump permissions` confirms zero fixture permissions and only
`FOREGROUND_SERVICE`/`FOREGROUND_SERVICE_MEDIA_PROJECTION` in observer. Merged
manifests retain a nonexported capture service, exported launcher activities,
debug-only artifacts, no cleartext traffic and disabled backup. Source scans
found no network/socket/WebView, persistent file/database, logging, microphone,
account or accessibility route. This is static inspection, not runtime privacy
proof. Both APKs verify with signature scheme v2 using the toolchain JDK and
`build-tools/36.0.0/lib/apksigner.jar`; the shell launcher first failed because
`java` was absent from PATH, then direct-JDK verification passed.

| APK | SHA-256 |
|---|---|
| Fixture | `044a693583f95ad6bb98e2038019546871cea36b39b570ae07217bc03a070678` |
| Observer | `f5f902dd7359cfe282f51af7b3fdce4b928ef0fb4cfadcbfa596822c0cc74b13` |

The [exact seven-case packet](../t101-c2-local-safety-verification.md) carries
source/APK identity, permissions, taps, independent content-free observations,
stop conditions, setup/teardown and one-run authorization text. **All device
cases, instrumentation, process-kill, TalkBack/keyboard/large-text layouts,
runtime retention/egress and voice-combined tests remain unrun.** No device
commands, install, grant, capture, microphone or external-app action occurred.

Repository checks pass: `python3 scripts/validate-docs.py` (0 errors, 211
Markdown files); `python3 -m unittest discover -s scripts -p 'test_*.py'`
(47 passed); `python3 scripts/cockpit.py --write` then `--check` (73 records);
`python3 scripts/check_handoff.py --base origin/main` (PASS); and
`git diff --check` (clean). An earlier coverage run correctly failed while this
record was active/incomplete; final handoff coverage passes. These checks are
structural repository evidence only.

## Handoff

Root worktree `/tmp/granny-android-sprint`, branch
`feature/t101-c2-local-safety-sprint`; implementation worktree
`/tmp/granny-android-terra`, branch `fix/t101-c2-local-safety`. The root branch
also merges remote-main design-only commit
`f873f652e25425e48835ffcffe43be54d0a4a3b6`; its sole generated-snapshot conflict
was regenerated from both records. No source conflict occurred.

[PR #33](https://github.com/Pueblo98/Granny/pull/33) is open and mergeable.
The publication checkpoint `d03f8dcd09dc09c841bd50b897cf0b296122e0d6` matched
`git ls-remote` for the task branch on 2026-09-20; subsequent handoff-only commits
are identified by this file's Git history and reverified at final delivery.
Repository maintenance and security checks passed at that checkpoint; the
runtime CI job was still pending at this record update. Main integration requires
Simon's explicit mixed-code authority. The primary checkout
remains untouched and unsynchronized with its dirty design work preserved.
Final read-only inspection found voice's `feature/t120-native-voice` advanced to
`dc3d69a2371e568314f541b1e04d82feaa3fc0cf` (native on-device voice shell committed),
with a peer-managed merge in progress and a cockpit-snapshot conflict. Root did
not alter that worktree or integrate/build its code here. Before later combined
integration, inspect its exact commit and rerun combined build/unit/lint,
permissions/docs and relevant lifecycle/accessibility checks.

Next bounded action: review the code PR and separately authorize the exact
synthetic tablet packet. The next function candidate is C5 in-app text sizing
within the shared voice shell once that shell's committed interface and file
ownership are available. T-101 remains in progress, C2 unadmitted, T-104 blocked,
and GATE-03/04/06 unchanged.
