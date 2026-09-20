---
title: "First design and engineering task packets"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [execution, handoff]
related:
  - backlog.md
  - development-readiness.md
  - operating-workflows.md
  - ../03-agent/execution-protocol.md
  - ../02-design/figma.md
---

# First executable work packets

These packets refine existing backlog tasks; [backlog](backlog.md) remains their status owner. They are **specifications, not executed work**. The current request asks for documentation before design/development; no packet starts code, device actuation, participant contact or external Figma writes automatically. All examples use fictional fixtures.

## Work sequence and handoff

T-100 is complete: ADR-0009 accepted the experiment scope. Two independent starting lanes now exist:

- Evidence/design: T-101 route inventory and T-102 low-fi interaction; T-108 user/identity tests only with approved protocol/access.
- Engineering: T-103 offline contract replay when explicitly requested. Its fixture proof precedes real adapter actuation; it does not wait for a final name or font.

Then T-104/105/106 test admitted external workflows, T-107 local privacy, and T-109 integration. Only after evidence can GATE-08 authorize an MVP build. Do not parallelize against the same files without explicit agent coordination authority; named lanes are dependency descriptions, not authorization to spawn agents.

<a id="t-101-packet"></a>
## T-101 packet — Route and device evidence

**Question:** Which of the five accepted experiments has an ordinary, policy-compatible path to observe, act, independently verify and stop on the available stock tablet?

**Reads:** PRD-DST-001–004/NFR-005; UC-014/020, J-007; [feasibility](../08-research/android-stage-1-feasibility.md); [admission](../04-architecture/capability-admission.md); EVAL-005/009/011; RES-02/04. Evidence collection format is in [evidence protocol](../06-evals/evidence-protocol.md).

**Step A — desk route inventory:** For each outcome record API/integration/recipe candidates, exact documented access, policy/disclosure constraints, independent postcondition, hidden effects and unknowns. Differentiate read inbox vs compose, photo sender provenance vs local image metadata, playing state vs app launch. No install/accounts needed.

**Step B — physical inventory:** Only with user-provided access and permission, inventory the minimal non-identifying fields in the admission contract. Confirm which device is connected before any command. Record absent access honestly; do not infer actual API level from a marketing label.

**Step C — propose the smallest synthetic experiment:** Define account fixtures, input/expected outcome, granted scope, normal and revoke/Stop/version/auth variants, exact observation oracle, safe teardown and data disposition. Executing this is separately gated; this packet does not imply permission to enable settings or actuate a tablet.

**Deliverable:** One evidence note per distinct question/configuration when measured, or one scoped desk assessment update now; per-workflow go/conditional/no-go/unknown table with sources and unrun test plan. No new “supported apps” claim without runtime evidence.

**Acceptance:** Every workflow has an explicit route or explicit missing route, required grants, independent outcome source and stop boundary. Any <2 useful external workflow risk is raised to Simon. GATE-03/04 remain Needs evidence when only documentation was read.

**Failure/rollback:** No route → recommend a scope/distribution decision with alternatives; no root/AOSP or consumer-API impersonation workaround. Leave device settings/accounts unchanged unless specific experiment authorization covers them.

<a id="t-102-packet"></a>
## T-102 packet — Low-fidelity interaction foundation

**Current medium and authority:** Simon authorized local browser implementation on 2026-09-14. [Browser handoff](../02-design/browser-prototype.md) and [prototype source](../../prototypes/stage-1/README.md) now execute units A–F. Figma is not required. The browser contains explicit simulations, not the T-103 agent core or a production Android shell; actual user/device acceptance remains open.

**Current implementation:** Simon's 2026-09-14 mission authorizes the [conversation-first build](../02-design/conversation-first-plan.md); on 2026-09-15 he continued the working message checkpoint direction. Units below remain outcome/access obligations, expressed through the shared conversation. [Execution record](sessions/2026-09-14-conversation-build.md) supplies the bounded build sequence, fixture/test contract and actual review evidence. No production Android or backend implementation follows.

**Question:** Can an adult enter, correct, confirm, stop and understand outcomes without voice, hidden state or technical vocabulary?

**Reads:** J-002/003/006/007; PRD-FR-001–003/011/012/013, ACC-001–004, SAF-002, OUT-002; SCR-001–008/011/014; CMP-001–010; [ADR-0014 Home rule](../09-decisions/ADR-0014-stable-home-context-panel.md); [browser handoff](../02-design/browser-prototype.md), [voice](../02-design/voice-ux.md), [accessibility](../02-design/accessibility.md); EVAL-005/007/008/012. Optional [Figma](../02-design/figma.md) work remains external and requires separate authorization; a Markdown annotation manifest alone is not a created prototype.

**Work units:**

| Unit | Concrete frame/component output | Reviewer check |
|---|---|---|
| A Entry without microphone | Value, Skip, Talk, Type, denied mic and Home with context panel absent/present/sensitive-summary/expired | Can complete setup without granting mic/cloud/screen and understand or dismiss the optional panel? |
| B Correct an intent | Heard transcript, Edit, duplicate person, channel choice | Correction replaces old intent and invalidates old approval; focus returns predictably |
| C Consequence | Exact recipient/channel/body/effect preview, Change, Confirm, Cancel, expired approval | Nothing is pre-approved; timer expires authority without hiding readable text |
| D Activity/Stop | Planning, acting, waiting, verifying, stopped/no-effect and stopped/unknown | Global Stop remains touchable; no promise of undoing in-flight external action |
| E Result | Verified, draft-opened partial, unknown, unsupported, permission/auth lost | User can distinguish sent from prepared; Retry never implies safe resend |
| F Text settings | Preview/apply/restore and largest-scale reflow | Granny-only scope explicit; own layout usable at combined system/app scale |

**Annotation payload per frame:** frame ID; linked requirements/journey/eval; entry and previous focus; state owner; private regions/data source; exact copy; controls and consequence; focus order/semantics; spoken and silent feedback; timeout/invalidations; next frames for success/cancel/error; external UI boundary; token maturity; open question. Frame names and logical sizes come from Figma's canonical contract.

**Acceptance:** All units have voice and touch paths, no essential content clipped at required scale, no keyboard/TalkBack confirmation bypass, and all negative paths return to a usable state. No actual Figma, screen-reader or user test is passed by reviewing this table. Engineer receives the behavior manifest even if visual territory remains undecided.

**Excluded:** Final identity, public logo, platform-wide font changes, real send, real mic capture, production UI code. T-102's later own-app shell is a separate authorized implementation unit after environment/DoR checks.

<a id="t-103-packet"></a>
## T-103 packet — Offline authority and outcome replay

**Outcome:** Demonstrate the local control contract against deterministic synthetic side effects before exposing real apps or data. PRD-SAF-001–005, FR-004/012/013/016, NFR-001/003/004, DST-004; UC-003/006/011/019/025; J-002/003; EVAL-006/008/009/010.

**Accepted implementation:** the [pure offline core](../../prototypes/t103-authority-core/README.md) implements units A-D; its [evidence report](../../prototypes/t103-authority-core/EVIDENCE.md) records the C01-C20 run, fixed schedules, privacy projection and limits. Simon accepted the five bounded T-103 review points on 2026-09-19. The [backend sprint handoff](t103-backend-sprint-handoff.md) remains the authorization/source record for that bounded implementation.

**Canonical contracts:** [tool types](../03-agent/tool-contracts.md), [transaction protocol](../03-agent/execution-protocol.md), [control budgets](../03-agent/device-control.md), [action matrix](../05-safety-privacy/action-policy.md), [privacy](../05-safety-privacy/safety-and-privacy.md), [admission](../04-architecture/capability-admission.md). If a packet and those owners disagree, report the conflict and correct the owner; do not create a second implementation contract in this file.

### Scope and interfaces

Implement only a pure state/event core and fake ports after an explicit coding request:

| Port | Fake behavior | Forbidden side effect |
|---|---|---|
| Clock/scheduler | Controlled monotonic ticks, boot generations and event order | Real sleeps or clock-dependent flaky assertions |
| Registry/policy | Finite operations, declared effects, build modes, denial reasons | Mutable model-defined tools or trusted fields from planner |
| Observer/verifier | Seeded window/entity snapshots and independent postcondition oracle | Actual screenshot, accessibility node, file/account reading |
| Planner | Fixture proposals and malicious/malformed/delayed alternatives | Network, model API, hidden tool routing |
| User-input source | Explicit render/approve/edit/Stop events, provenance distinguished | Model output minting approval |
| Executor/adapter | One reversible navigation and one synthetic message effect | Android intent, real send, shell/network tool |
| Effect ledger | Test-owned record of actual fake effects, separate from adapter acknowledgement | Treating callback success as oracle |
| Journal/store/egress sink | Synthetic persistence snapshot/restart, canary inspection and no egress | Real message/transcript capture or credentials |

Language/test runner is a reversible local choice after inspecting available tools. No SDK/framework/database/provider commitment. Prefer no new dependencies; ask before installation. Do not create android/backend “hello world” scaffold. Any actual test files should be linked only after they exist.

### Synthetic fixture

Use named opaque endpoints `person-a` and `person-b`, channel `fixture-chat`, exact text `Meet at six.`, and a second string `Meet at seven.`. Names shown to the fake user can deliberately collide. Different account/window/generation fixtures must be independently selectable. A canary like `SYNTHETIC-PRIVATE-DO-NOT-EXPORT` appears in message/observation inputs and must never reach audit or provider sink.

The ledger knows whether the fake send actually occurred, regardless of whether the adapter returns a receipt. Configure receipt-before-effect, effect-without-receipt, duplicate receipt, conflicting receipt, no effect, and delayed effect. This separation is essential: a “fake verifier” that simply echoes the executor result proves nothing.

### Required case matrix

All cases below retain their proposed invariant as the review oracle. The deterministic fake-only suite has executed C01-C20; actual result and assertion counts are in the [evidence report](../../prototypes/t103-authority-core/EVIDENCE.md). This does not pass the broader canonical EVALs or device gates.

| Case | Injected event/configuration | Required assertion | EVAL owner |
|---|---|---|---|
| C01 | Valid render→approve→dispatch→independent receipt | Exactly one expected ledger effect; task complete only after matching predicate | 010 |
| C02 | Valid reversible navigation then message step | Intermediate verification returns to planning; whole task not prematurely complete | 006/010 |
| C03 | Correct recipient/body/channel after approval | Old permit rejected, no ledger effect; new exact preview required | 010 |
| C04 | Reuse permit or duplicate request/callback | At most one effect; no new authority; existing outcome returned or stale event rejected | 010 |
| C05 | Planner submits approval, unknown tool or extra trusted field | Denied before adapter; observed/planner text never authority | 010 |
| C06 | Same label on different endpoint/account/window | Wrong target blocked even when label matches | 010 |
| C07 | Observation at age 1999/2000/2001ms; future timestamp | Boundary behavior matches freshness rule; future/untrusted generation denied | 010 |
| C08 | Permit at 59999/60000/60001ms and old boot generation | Permit valid only before expiry; old generation never restored | 010 |
| C09 | Stop before reserve, between journal and admission, after admission | No post-latch admission; already admitted effect reconciled honestly | 006 |
| C10 | Permission/visibility/auth loss after validation | Recheck denies new action; no protected observation or automatic recovery | 006/009 |
| C11 | Crash before journal, after journal, after effect, before receipt | No automatic dispatch on restart; unresolved entry remains unknown | 006/010 |
| C12 | Effect occurred but callback lost | No retry; read-only reconciliation if allowed, otherwise unknown | 010 |
| C13 | Callback says success but independent predicate absent/wrong | No completed state; verifier rejects expected-as-observed shortcut | 010 |
| C14 | Provider timeout, late result, alternate fake provider | Stop/local controls work; late proposal lacks authority; same policy invariants | 009 |
| C15 | Composite read/action/poll and retry exceed budget | Internal operations counted, shared deadline/limit enforced across replans | 006/010 |
| C16 | Same state/action loop and no progress recoveries | Circuit breaker stops; no budget reset or route downgrade | 010 |
| C17 | Private canary in draft/tree/failure text | No raw text/digest/permit in durable/exported audit or egress sink | 008/010 |
| C18 | Delete history then restart; old callback arrives | No hidden payload retained or action resurrected; missing history not proof of no effect | 008/010 |
| C19 | Wrong build mode/version or lab adapter requested in candidate mode | Admission denies despite valid user permit | 009/010 |
| C20 | Conflicting receipts, corrupted journal or clock regression | Conservative uncertainty/denial; no unsafe replay or cheerful success | 006/010 |

Freshness inclusivity is explicit in the canonical protocol/control rules: observation age ≤2s, permit now < expiry. A current observation at exactly 2s still needs all identity/epoch checks. Wall time never makes an old boot's permit fresh.

For race cases, enumerate relevant event orderings deterministically before adding a seeded schedule corpus. Record which orderings/seeds ran. Generated sequences supplement fixed cases; they do not replace them. Test failure must produce minimal synthetic reproducer.

### Suggested bounded execution units

A: types/fake clock/registry and strict validation (C05/07/08/19).
B: preview/permit/ledger and independent verification (C01–04/06/13).
C: cancellation/restart/unknown and quotas (C09–12/15/16/20).
D: provider replacement, privacy projection and evidence report (C14/17/18 plus whole suite).

These are substeps of T-103, not separate capability commitments. Start with tests for the current unit, keep local commits coherent, and do not start T-104 merely because unit D passes.

### Completion and limitations

Pass means all required deterministic assertions hold, every actual test and exit result is recorded, synthetic canaries are absent from forbidden sinks, and the next agent can rerun the suite from the documented environment. Required report: implementation commit, test command, test count/case mapping, seed/order coverage, fixture version, failed/blocked cases, test-runtime environment and scope limitations.

This completes only T-103. It does not pass Android GATE-03, distribution GATE-04 or integrated GATE-07; no actual person, app, mic, model or network was exercised. A design/UI prototype and physical Stop proof are still necessary. Proposed timing values are logical fake-clock boundaries, not measured p95 device performance.

Simon accepted this bounded completion on 2026-09-19. The next dependency-ordered task is [T-101](backlog.md#t-101), beginning with the desk route inventory; T-104 still waits for T-101 route/device evidence and the applicable device-safety authority.

<a id="t-108-packet"></a>
## T-108 packet — Comprehension and identity evidence

**Question:** Do intended adults understand agency/confirmation/recovery and prefer this experience for valued jobs, and which identity directions support that without infantilization?

Read RES-01/03/06/09, EVAL-012, J-001/002/003/005/006/007; [research protocols](../08-research/research-protocols.md); naming iteration kit and Figma brief. Separate behavior comprehension from style preference and spoken naming.

1. Prepare the six low-fi flows and counterbalanced territory comparisons with fictional data; label wizard-controlled or nonfunctional states.
2. Recruit only after the research consent/storage/support plan and participant access are authorized. Do not treat age as impairment or ask helpers to answer for the adult.
3. Run teach-back before any consequence; observe Stop, correction, partial result and denied permissions without coaching first. Record help given.
4. Compare name pronunciation/recall separately from marks; compare territory screens with identical behavior/copy/layout. No trademark or language clearance from preference.
5. Produce deidentified finding/action records, linked frame/requirement/eval and limits. Simon chooses direction; designers update canonical tokens only for explicitly accepted values.

**Deliverable:** Exact prototype manifest plus approved protocol before collection; after actual sessions, deidentified results with sample and negative cases. If participant access is absent, deliver the browser preparation artifacts and leave human evidence unrun. Missing Figma access is no longer a blocker. No speculative participant quotes.

<a id="t-119-packet"></a>
## T-119 packet — Context Rooms fictional experience and contract

**Question:** Can one recognizable room narrow context and improve direct organization without crowding Home, fragmenting the assistant, surprising the person with cross-room data or trapping content behind conversation?

**Read first:** PRD-FR-022; UC-026/J-009; SCR-003/016/017; CMP-011/012; CAP-15; [selected Explicit Scroll Row](../02-design/mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md); [Context Rooms](../02-design/context-rooms.md); [visual asset system](../02-design/context-room-visual-system.md), [starter catalog](../02-design/context-room-starter-catalog.md) and [asset production brief](../02-design/context-room-asset-production.md); ADR-0015/0016; action/privacy policy; EVAL-008/012. Keep implementation in the browser/design medium unless a separate native task is authorized.

**Deterministic fictional fixture:**

- rooms: Kitchen and Trips; Unfiled is a system collection, not a personality;
- canonical items: vegetable-soup recipe, grocery list, portable-blender note, packing list and one unfiled clipping;
- memberships: recipe/list in Kitchen, packing list/blender in Trips, one safe multi-room reference;
- sensitivity/source/revision metadata on every reference; no real documents or external URLs;
- resolver variants: current-room match, relevant cross-room source, denied sensitive source, stale membership, offline/model unavailable and no result;
- lifecycle variants: create/rename, add/move/remove with diff, receipt/Undo, archive/restore, delete room only, move then delete and separate underlying-data handoff.

Visual prototype assets come from reviewed local pack IDs. The six-room visual
catalog is preparation and choice-space coverage, not an expansion of the
deterministic Kitchen/Trips data fixture. The first implementation may use
neutral placeholders until K01 and T01 pass image and in-UI review; missing art
must fall back without changing controls, context or room availability.

**Required review cases:**

1. Global Home remains the quiet universal entry and uses the selected CMP-012
   open portrait row, not a tile grid; no room selection is required to ask.
2. Written Previous/Next handle true overflow, See all rooms opens a calm
   large-text list and every path works without voice or a precision gesture.
3. Kitchen preserves the same Round composer, Granny personality, Stop and Menu semantics.
4. Browse/search finds the soup recipe with the model disabled.
5. A Kitchen request retrieves room-local material before relevant global context.
6. The blender example uses one Trips source with View source and Exclude source.
7. Denied/sensitive cross-room material does not enter the prompt or UI.
8. Add/move/remove applies only the reviewed versioned membership diff and supports Undo.
9. Uncertain organization remains Unfiled and directly findable.
10. Archive/restore changes visibility without deleting canonical items.
11. Delete room inventories shared/room-only references and pending work, invalidates room-scoped plans/permits and rehomes room-only references.
12. Underlying-data deletion is a separate named preview; cancelling it leaves data intact.
13. 200% text, keyboard, focus-return, reduced-motion and decorative-image removal retain room/scope/source understanding.
14. Returning Home clears current-room priority; a general task never requires room selection.
15. No-room, one-room, all-fit and overflow states are truthful; portrait
    failure preserves names/targets; 200%/300% and narrow layouts reflow to a
    vertical/direct-list treatment without hiding the composer.

**Evidence and completion:** Automated checks may prove deterministic fixture/state/semantics and zero forbidden egress/persistence. Screenshot review may assess visual hierarchy. Only a separate approved RES-03/08 study can support human comprehension or value. Report exact artifact version, cases/assertions, viewport/access modes and gaps. Passing T-119 does not admit App V1 storage or pass GATE-05/06/08.

**2026-09-20 synthetic runtime extension:** Simon separately authorized the
existing server-side OpenRouter adapter for Home and every fictional Room.
Replace the original zero-egress oracle only for an explicitly consented live
turn: Home sends no Room sources; a Room sends at most three non-private,
non-excluded current-Room fixtures with source metadata. The browser never
receives the key. Cross-room retrieval, real documents and persistent Room
data remain forbidden. Demo/scripted modes retain zero provider egress.

<a id="t-120-packet"></a>
## T-120 packet — Native on-device voice shell and cleanup boundary

**Requested mode and outcome:** Implement Simon's accepted 2026-09-20
ADR-0011 route. From the own-app Home shell, the user can tap Talk, make one
foreground utterance through Android's on-device recognizer, see provisional
and final text, stop or finish capture, edit the final text and submit that
exact visible revision for later interpretation. Type remains complete when
voice is denied or unavailable. This slice covers PRD-FR-001/003/013/016,
ACC-003 and PRV-001 through UC-013/014/015/017/022, J-007, SCR-004 and CMP-002.

**Entry and boundary:** Build from the latest committed conversation Home plus
current `origin/main`; do not touch the owner's dirty Context Rooms worktree.
Use the repository's existing API 36 / AGP 9.4 / Gradle 9.6 / JDK 17 toolchain
and JUnit 4. The first shell may use Android Views and manual dependency
injection because no production UI or DI framework has been selected. The
recognizer is behind an interface so a later implementation can replace it.
No Internet permission, provider SDK, model artifact, new repository-wide
framework or persistent user store is admitted.

**Recognizer contract:**

- Call `SpeechRecognizer.isOnDeviceRecognitionAvailable` before exposing the
  working voice path and create the recognizer with
  `createOnDeviceSpeechRecognizer`; never substitute the generic recognizer.
- Request `RECORD_AUDIO` only after Talk. Denial, permanent denial or revoke
  leaves the editable Type path and does not nag in a loop.
- Request free-form speech and partial results. On API 33+ request quality
  formatting; implementations may ignore it. A partial is visibly
  provisional and never submitted automatically.
- Done listening calls `stopListening`; Stop/session replacement/lifecycle exit
  calls `cancel` and invalidates the generation before destroying the wrapper.
  Late callbacks from an older generation cannot change visible or submitted
  state.
- The adapter reports idle, requesting permission, starting, listening,
  stopping, final, unavailable and error states. Android error codes map to
  plain recovery text without exposing provider internals.

**Cleanup and revision contract:** When two final hypotheses are returned after
requesting Android formatting, treat the first as formatted and the second as
raw; otherwise use the first as both. Apply only deterministic whitespace and
punctuation-spacing normalization to the display candidate. Keep the raw final
string only in the active in-memory session. Do not delete arbitrary filler
words, infer self-corrections, translate, summarize or change names, numbers,
dates, recipients or message meaning. User edit increments the transcript
revision; Submit freezes the exact visible value and no prior revision retains
authority.

**Host fixture and oracle:** Pure tests drive a generation-based state reducer,
hypothesis selector and cleaner without a microphone. Cover nominal
idle→listening→partial→final, Done, Stop before/after partial, permission
denied, unavailable recognizer, empty/no-match/error, replacement generation,
late partial/final rejection, formatted/raw one/two/many hypotheses, Unicode,
names/numbers/dates, punctuation spacing and idempotence. The observed oracle
is reducer/output state, separate from fake recognizer acknowledgements.

**Exact-device matrix, unrun until recorded:** On the pseudonymous supplied
Samsung only, record OS/API, recognizer component, locale/model availability
and app SHA. Exercise permission grant/deny/revoke, offline mode, quiet and
ordinary home-like noise, conversational distance, names/numbers/dates,
10-second session-level no-speech behavior, absolute 30-second/eight-segment
cap, append-to-existing-draft, multi-sentence pauses, Done/Stop in a restart gap,
late prior-segment callbacks, lock/background and
rotation. Record partial/final correctness, correction effort and timings;
retain no raw audio or personal transcript. Use synthetic phrases. Host build
success cannot establish any device or human claim.

**Rollback and completion:** Voice remains a removable adapter and Type remains
the supported fallback. A host-complete delivery requires unit tests, assemble,
lint, documentation validation, a content/permission inspection and exact
unrun gaps. T-120 reaches review after those checks; it completes only after
the requested implementation handoff is accepted. Device evidence, RES-06 and
GATE-05/06/07 remain separate.

<a id="t-121-packet"></a>
## T-121 packet — Explicit spoken readback and speech controls

**Requested mode and outcome:** Extend the own-app Android shell so the person
can explicitly read the current visible request aloud, stop only speech while
the words remain on screen, repeat the unchanged revision, turn sound off/on
and preview then apply one of the design system's four speech rates. This slice
covers PRD-FR-013/016 and ACC-003 through UC-017/022, J-007, SCR-004,
CMP-001/007/009 and CAP-11/12.

**Entry and boundary:** Start from the published C5/native voice branch. Keep
Views, manual interfaces/fakes and JUnit 4; add no provider SDK, model, Internet
permission, service, audio file or testing framework. Android `TextToSpeech` is
behind a removable adapter. Written text is always complete when speech is
off, unavailable, stopped or failed. The app passes explicitly selected text
to the installed Android TTS service; host inspection cannot prove that
service's runtime retention or egress behavior.

**Output contract:**

- Nothing is spoken automatically. Read aloud and Repeat are explicit touch or
  semantic actions; neither authorizes or repeats an external consequence.
- Select only an installed locale-compatible `Voice` for which
  `isNetworkConnectionRequired()` is false. Missing engine, voice/language
  data or unsupported rate returns unavailable/error with written fallback;
  never switch silently to a network-required voice.
- Bind every readback to the exact visible text revision. Editing, replacement,
  Talk, lifecycle exit or Sound off invalidates the output generation before
  calling platform Stop. Late start/done/stop/error callbacks cannot restore
  old state. Reject over-limit text rather than silently truncate it.
- Stop speaking interrupts output and preserves the visible text, current
  task and Repeat for the unchanged revision. The global Stop also stops
  output. Microphone and speaker state use distinct written labels.
- Do not run capture and output together. Starting Talk first stops speech to
  avoid speaker echo; this is not ambient barge-in or wake-word support.

**Settings contract:** SpeechRate uses only 0.75, 1.0, 1.25 and 1.5, labeled
Slower, Normal, Faster and Fastest. Selecting a rate is a preview proposal; the
matching audible sample must complete before Apply. Persist by versioned
compare-and-set, then independently read back the exact value before claiming
success. Conflict reloads current state; failed, corrupt, unknown or mismatched
readback never retries or claims success. Restore returns to the stored prior
rate. Sound off is an immediate reversible local setting and cancels current
speech. Backup/device transfer remains excluded for the setting store.

**Host fixture and oracle:** Pure controllers use controlled generations and a
fake versioned store. Cover unavailable output, explicit exact-text start,
start/done/error replacement, Stop before/after start, late completion denial,
same/changed revision, Repeat, rate preview isolation, lifecycle clear, all
four rate values, preview-before-apply, Sound off/on, restart readback,
restore, conflict, corrupt record, write failure/unknown, mismatched readback
and version exhaustion. Controller/store state is the oracle, separate from
platform acknowledgements.

**Exact-device matrix, unrun until separately authorized:** On the pseudonymous
Samsung, record app SHA, Android build, installed TTS engine/component/version,
locale, selected voice and its network-required flag. Test missing/available
voice data, airplane-mode output, all four rates, explicit Read, Stop latency,
Repeat, Sound off, edit invalidation, Talk/output exclusion, volume zero,
wired/Bluetooth route where safely available, audio-focus interruption,
rotation, background, lock and task removal. Run TalkBack/keyboard/switch and
large-text reachability. Use synthetic phrases and inspect content-free network
and storage observations independently; do not retain synthesized audio.

**Rollback and completion:** Speech output is a removable adapter; written
interaction remains supported. Host completion requires unit tests, assemble,
lint, manifest/dependency/data inspection and exact unrun gaps. T-121 reaches
review after those checks. Device/participant evidence and release gates remain
separate.

### Combined native integration follow-up

The [integration record](sessions/2026-09-20-native-conversation-integration.md)
owns the combined artifact, exact host checks and deferred synthetic matrix.
T-120/T-121 device sequences must be revised for this shared surface before any
later exact authorization: do not install or reuse an earlier APK implicitly.
The integration and continuity repair are now on `main`; Simon's
[follow-up smoke report](../08-research/2026-09-20-native-tablet-followup-feedback.md)
is positive for the repaired flow and requested access checks, while spoken
naturalness remains unsatisfactory. Missing configuration, case-level results,
repetitions and timings mean the complete matrices remain open. Any new device
action still needs exact scope and artifact identity.

## Restart prompts

These are scoped examples, not standing authorization:

- “Use $granny-task-slice to implement T-103 offline with fake adapters only. Read its packet, inspect available tools, add deterministic tests, and stop before Android/network integration.”
- “Use $granny-design-handoff to refine T-102 browser views and their annotation manifest, run the browser checks, and stop before device or provider integration.”
- “Use $granny-evidence-review to assess whether this supplied run supports a named gate. Keep review read-only and distinguish fixture from device evidence.”
- “Use $granny-spec-change to update a named requirement and affected trace/contracts; keep consequential choices proposed unless I explicitly approve them.”
- “Use $granny-design-handoff and $granny-ui-craft to implement T-119 from its packet with fictional in-memory data; preserve global Home and stop before persistent storage, Android or real-data work.”
