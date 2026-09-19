---
title: "Metaprompt — Integrate native voice with the Stage 1 tablet app"
status: accepted
owner: Simon
last_updated: 2026-09-20
tags: [execution, android, voice, tablet, integration, metaprompt]
related:
  - task-packets.md
  - backlog.md
  - development-readiness.md
  - current-milestone.md
  - ../../android/stage1/README.md
  - ../02-design/shared-conversation-state-surfaces.md
  - ../02-design/voice-ux.md
  - ../04-architecture/system-overview.md
  - ../09-decisions/ADR-0011-explicit-activation-and-access.md
---

# Metaprompt — Integrate native voice with the Stage 1 tablet app

## How to use this handoff

Paste the prompt below into the session implementing the current Android tablet
features. Simon requested this handoff on 2026-09-20 so that native voice, the
accepted shared conversation states and separately gated tablet capabilities
converge on one app architecture.

The pasted prompt is an explicit coding request for the **first bounded
integration slice**. It authorizes repository code, tests and documentation in
an isolated task worktree. It does not authorize connecting to a tablet,
installing an APK, granting permissions, capturing a screen, operating another
app, using a real account or merging mixed code/documentation into `main`.

## Copy into the tablet implementation session

```text
Continue the Granny Stage 1 Android tablet implementation and complete the
first bounded integration slice that makes native voice, typed input, shared
conversation states and Granny-local tablet behavior work through one app
contract. This is an implementation request. Do not return another plan or
metaprompt.

Use `$granny-session-lifecycle` and `$granny-task-slice`. Use `$testing-setup`
for the Android test boundary. Use `adaptive` or `edge-to-edge` only if the
inspected native UI actually needs that work. Do not select Compose, a new UI
framework, dependency-injection framework or navigation library merely because
a skill is available; the current bounded shell intentionally uses Android
Views and manual injection.

## Start with repository and branch safety

Repository root:

  /home/lgtw/Work/granny

The primary checkout may contain Simon's uncommitted Obsidian or design work.
Before editing, confirm `pwd`, repository root, branch, HEAD, worktrees, remote
and `git status --short --branch`. Fetch the verified `Pueblo98/Granny` origin.
Preserve every dirty and untracked primary-checkout path. Never reset, stash,
overwrite or copy files over it.

The native voice implementation is on:

  origin/feature/t120-native-voice

The newest C2 tablet safety work was published on:

  origin/feature/t101-c2-local-safety-sprint

Current accepted shared-state design sources are on `origin/main`. Verify the
current branch tips rather than trusting a copied SHA. If this is already a
valid tablet task worktree, preserve and continue its work after inspecting its
relationship to those branches. Otherwise create a fresh short-lived task
branch and isolated worktree from the newest relevant product-app branch,
normally `origin/feature/t120-native-voice`, then integrate current
`origin/main` when safe. Do not edit another session's worktree. Do not merge
the C2 lab branch wholesale into the product app; inspect it read-only and copy
only an explicitly reviewed contract or independently reimplement a required
boundary.

Create one contemporaneous session record before source changes. Record exact
changed paths, authority, baseline, tests, unrun device evidence and the final
remote SHA.

## Read authority before implementation

Read these sources in order:

1. `AGENTS.md`, `docs/README.md`, the current milestone and development
   readiness/Definition of Ready.
2. `docs/10-execution/backlog.md#t-120` and
   `docs/10-execution/task-packets.md#t-120-packet`.
3. `docs/09-decisions/ADR-0011-explicit-activation-and-access.md`,
   `docs/02-design/voice-ux.md`, `docs/04-architecture/system-overview.md` and
   the T-120 requirement/trace rows.
4. `docs/02-design/shared-conversation-state-surfaces.md` and
   `docs/02-design/mockups/2026-09-20-shared-state-pack/iteration-1/SHARED-STATE-IMPLEMENTATION-METAPROMPT.md`.
   Treat the browser implementation as interaction evidence and reusable state
   language, not Android production code.
5. `android/stage1/README.md`, its manifest, Gradle files, Activity, voice
   interfaces/controller/cleaner and every host test. Build and test the
   baseline before changing it.
6. `docs/10-execution/backlog.md#t-101`, its task packet and research evidence;
   `experiments/c2-screen-explanation/README.md`; the latest T-101 C2 session
   record; and `docs/10-execution/t101-c2-local-safety-verification.md` if it is
   present on the inspected branch.
7. The T-103 fake authority-core contract and its action/permit/verifier
   boundaries, plus `docs/05-safety-privacy/action-policy.md`, privacy policy,
   threat model, device-control budgets, capability admission and applicable
   evals. Reuse its separation of proposal, authority, execution and verified
   outcome as an interface rule; do not embed the Node prototype in Android.

Resolve conflicts by authority: accepted canonical requirements and ADRs own
behavior; the Android shell owns the current native implementation; the shared
state document owns interaction semantics; the C2 project supplies lab
evidence only. Record any material conflict instead of silently choosing code
behavior over an accepted contract.

## Establish the actual product-app target

Inventory every Android module before designing the integration. At this
handoff, `android/stage1` is the first bounded own-app product shell. The C2
observer under `experiments/c2-screen-explanation` is a separate laboratory
app, and the browser prototype is a fictional interaction reference. If no
newer production Android app exists, extend `android/stage1`; do not create a
third shell.

Write a short source map in the session record covering:

- Activity, view rendering, lifecycle and focus ownership;
- voice adapter, session controller, transcript revision and cleanup;
- typed request entry and exact submitted-text boundary;
- place state: Home or current Room;
- temporary conversation/task state;
- current tablet capability adapters, experiments and fixtures;
- Stop/cancel ownership and operation generations;
- manifest permissions, runtime dependencies, persistence and network paths.

Run the existing host unit tests, assemble and lint before editing. Inspect the
built manifest/permission set and dependency graph. Preserve Type as a complete
path throughout the work.

## Target architecture

Build one small, explicit integration seam rather than connecting UI callbacks
directly to device behavior.

Retain the useful T-120 boundaries:

- `VoiceRecognizerAdapter` owns the Android recognizer API;
- `VoiceSessionController` owns capture generation and stale-callback refusal;
- `TranscriptCleaner` remains deterministic whitespace/punctuation cleanup;
- the final visible transcript remains editable and its revision is the only
  text that can be submitted for interpretation.

Add or adapt one process-local `ConversationSessionCoordinator` (name may fit
the codebase) and a pure state/reducer model. It must own:

- Home/current Room identity separately from temporary surface state;
- one monotonically increasing session/operation generation;
- input provenance: typed, partial voice, final voice or edited transcript;
- current editable request and revision;
- clarification/preview/activity/result state;
- one global Stop/cancel path;
- restoration of the valid originating place, focus and scroll state;
- rejection of every callback from an invalidated generation.

Use one post-transcript request path for typed and spoken input. A partial voice
hypothesis only updates the provisional `Heard so far` field. A final result
opens editable transcript review. `Use this request` freezes the exact visible
revision and requests interpretation; it does not authorize a capability.
Editing, listening again, cancelling, replacing a request or leaving the
foreground invalidates older callbacks and prepared authority.

Represent these accepted shared surface states without turning them into seven
independent Activities or replacement Room routes:

  idle
  listening
  transcript review
  clarification
  exact consequence preview
  active task with Stop
  prepared/known result
  unknown outcome

Home or the current Room remains the underlying place. The stable bottom
composer expands for listening/transcript review, or one temporary task surface
appears above it. Constrained height, keyboard and large text may expand the
same state into a scrollable focused surface. Preserve the accepted labels,
controls and safety distinctions. Do not copy browser DOM/CSS or browser fixture
timers into Android.

Keep interpretation, authority and execution separate through narrow types:

  RequestRevision
    -> InterpretationProposal
    -> Clarification or ExactPreview
    -> UserApproval bound to the exact revision/consequence
    -> CapabilityPermit
    -> CapabilityAdapter
    -> IndependentOutcomeObservation
    -> Known or Unknown result

A planner, parser, model or browser fixture can propose meaning but cannot mint
approval, choose a device capability or declare success. Do not add a live
model in this slice. Use deterministic fake interpretation for the exact test
fixture, behind a replaceable interface.

Define a closed capability registry. Every tablet function must state its
availability, required permission/consent, input schema, cancellation support,
outcome oracle and admitted build modes. Unknown or disabled capabilities fail
closed and leave Type/conversation usable. Never expose a general shell,
coordinates, arbitrary intents, credential access or unrestricted
accessibility automation.

## First vertical slice

Implement and prove this sequence before adding another device function:

1. Render the shared Listening and editable-transcript states in the actual
   Android Home/conversation shell.
2. Feed both typed and accepted voice revisions into the same coordinator.
3. Use a deterministic fictional request to exercise clarification or exact
   preview with no external effect.
4. Add one Granny-local tablet capability through the closed registry. Prefer
   the already identified C5 in-app text-size/readability adjustment, or an
   equally reversible own-app setting already authorized by current canonical
   docs. Keep the setting process-local unless persistence has an accepted data
   contract. Show its exact consequence before applying it and independently
   observe the resulting app-owned state.
5. Make global Stop/cancel invalidate the operation, cancel voice when active,
   ask the selected adapter to cancel when supported and restore a usable
   conversation surface. If an effect may have crossed the boundary, report
   unknown outcome and never retry or resend automatically.

If C5 is not Definition-of-Ready complete in the current sources, use a
test-only fake capability and document the blocker. Do not invent authority to
turn the fake into a production setting.

The C2 screen-explanation experiment must remain isolated and disabled in the
product shell. It may inform a narrow future `ScreenExplanationCapability`
interface, but do not import its MediaProjection service, permission flow or
lab ledger into the product app during this slice. Selected-package identity
and independent retention/egress evidence remain unresolved; C2 is not
admitted, T-101 remains in progress and GATE-03/04/06 remain open. The product
registry must therefore report that capability as unavailable outside an
explicit lab build. Do not present a disabled stub as a working feature.

## Lifecycle, privacy and Stop invariants

- Voice capture is foreground, explicit and session-scoped. Use only Android's
  on-device recognizer and never fall back to the generic/network recognizer.
- `RECORD_AUDIO` is requested only from Talk. Denial, permanent denial,
  unavailable recognizer or missing locale keeps Type available.
- Do not add `INTERNET`, cloud speech, Whisper, a bundled ASR model, a cleanup
  language model, background capture, wake word or raw-audio access.
- Keep raw hypotheses only for the active in-memory session. Do not persist,
  log, export or include transcript content in diagnostics.
- Stop/cancel must invalidate the generation before adapter cleanup so a late
  partial, final, success or failure cannot revive old state.
- Backgrounding, lock, task removal, Activity replacement and process restart
  must not silently resume capture or action. Preserve only explicitly allowed
  process-local state; after uncertain dispatch, restore an honest unknown
  result rather than assuming failure or success.
- Stop is visible during every active operation. Capture's Stop ends capture;
  task Stop cancels the active capability when possible. Neither approves or
  repeats a pending action.
- No external-app action, real message, personal data, account, screen capture
  or device command belongs in this integration slice.

## Required tests and evidence

Keep the reducer/coordinator and capability contracts host-testable. Add
meaningful tests for at least:

- typed and voice input reaching the same accepted-revision path;
- partial speech never submitting or authorizing a request;
- final speech opening an editable field with the exact cleaned revision;
- edit/listen-again/cancel invalidating the prior revision;
- late partial/final/interpretation/adapter callbacks being rejected;
- permission denial, recognizer unavailable, empty/no-match and timeout keeping
  Type usable;
- one temporary surface at a time while the underlying Home/Room identity is
  retained;
- clarification and preview binding to the exact request revision;
- approval being specific and one-use;
- the Granny-local capability's effect being observed independently of its
  adapter acknowledgement;
- Stop before admission, during active work and racing with a late result;
- known result versus unknown outcome and no automatic retry;
- Activity recreation/background/foreground state restoration where host tests
  can cover it;
- disabled/unregistered capability refusal;
- no transcript/audio persistence, network permission or model dependency.

Use fakes and a controlled clock/generation for race orderings. Keep expected
values separate from the observed outcome source. A green adapter response is
not independent verification.

Run the complete affected Android host tests, `assembleDebug` and `lintDebug`.
Inspect the merged manifest, APK permissions and runtime dependency graph.
Run repository documentation validation, cockpit write/check, documentation
tool tests, session handoff coverage and `git diff --check`. Run existing
browser/runtime checks only when shared files or their contract consumers are
changed; do not count them as Android evidence.

Do not connect to or operate a physical tablet in this session unless Simon
gives fresh, exact authority for the named device actions. Leave a separate
device matrix for:

- microphone grant, deny, permanent deny and revoke;
- exact on-device recognizer component, locale/model availability and offline
  behavior;
- partial/final behavior, no-speech cap, Stop, Done, rotation, background,
  lock and task removal;
- synthetic names, numbers and dates in quiet and ordinary home-like noise;
- TalkBack, keyboard/switch reachability, 200%/300% text and responsive layout;
- the selected local capability's actual UI/effect/rollback;
- combined voice-to-capability lifecycle races.

Record exact device, OS/API, app SHA, recognizer, fixture, observations,
timings, correction effort and teardown when that matrix is separately run.
Retain no raw audio or personal transcript. Device evidence for one capability
does not admit C2 or another route.

## Completion and handoff

The first slice is ready for review only when the actual Android shell has one
coherent typed/voice conversation path, the accepted state model, one
reversible Granny-local capability or an honestly disabled fake, global Stop,
host race coverage and a clean permission/dependency audit. Do not broaden the
slice merely to claim that every tablet feature is integrated.

Update canonical architecture, traceability, task/eval and milestone text only
for behavior that actually exists. Keep device/human evidence explicitly
unrun. Do not claim a gate, Play eligibility, production capability or accepted
external-app route.

Commit only scoped files, push the task branch under the existing task-branch
authority and verify the remote SHA. Mixed code/documentation work requires
separate main-integration authority, so do not create or merge a PR unless the
current session has that authority.

Return a handoff containing:

- worktree, branch, base, commits and matching remote SHA;
- the chosen product Android module and why;
- a state/ownership diagram for place, conversation, voice and capability;
- exact interfaces and enabled/disabled capability registry entries;
- exact test/build/lint/doc commands and counts;
- manifest permissions, runtime dependencies, persistence and network audit;
- implemented behavior, rollback and all unrun device/access/human evidence;
- any conflict with T-101/T-103/shared-state authority;
- the next single tablet capability that is ready to integrate.
```

## Expected outcome

The next session should extend one Android product shell rather than create a
parallel app. Its first reviewable result joins voice and Type through the same
conversation state machine, proves one reversible app-owned function and leaves
unadmitted device routes visibly disabled. Later tablet functions can then plug
into the same capability, Stop and outcome contracts one at a time.
