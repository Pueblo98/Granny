---
title: "Stage 1 Product Design Specification"
status: proposed
owner: Simon
last_updated: 2026-09-15
tags: [design, interaction]
related:
  - design-system.md
  - accessibility.md
  - voice-ux.md
  - figma.md
  - ../01-product/user-journeys.md
---

# Stage 1 product design specification

**Proposed interaction contract.** Product behavior is owned by the [PRD](../01-product/prd.md); [journeys](../01-product/user-journeys.md) define sequence; [design system](design-system.md) defines component contracts; [brand](brand-and-visual-identity.md) supplies candidate visual values. The [browser prototype](browser-prototype.md) now supplies a self-tested, low-fidelity simulation; Figma is paused. User/device tests remain unrun, and the prototype's explicit gaps do not weaken this contract.

## Current conversation composition

Simon authorized implementation of the [conversation-first plan](conversation-first-plan.md) on 2026-09-14 and continued the message checkpoint direction on 2026-09-15. The proposed screen IDs below now describe logical surfaces within one conversation, with secondary settings/dialogs where useful. Exact confirmation, Stop, privacy and accessibility obligations remain. This browser exploration does not accept production interaction/identity or prove Android capability.

## Experience architecture

Granny opens as an ordinary Android application, not a replacement OS. MVP does not require the default launcher role. Home, task, history and settings are app-owned. External apps, Android navigation, permission dialogs, IME, authentication, status/navigation bars and capture selectors remain system/app-owned. Optional launcher role is a separate V1 feasibility choice, not deeper authority.

Home has one invitation, a persistent labeled text composer, labeled Talk and quiet Menu. Supported typed requests resolve directly through a documented prototype grammar. Clarification asks one question only for unresolved slots; content/results and exact previews appear inline. Menu exposes History, Settings, Privacy, People and Help; typed secondary requests reach the same local functions. No capability grid or mandatory category picker.

```text
Conversation: request → clarify if needed → inline exact preview → activity → result
                   └→ inline photos / screen explanation / media / text preview
Menu → local settings / people / privacy / history / help → same conversation
```

**Back** moves one app navigation level; from a pending confirmation it cancels that approval and preserves local draft. **Granny Home** cancels automation then goes to SCR-003; it is distinct from Android Home. **Android Home/Recents** retain ordinary Android behavior; returning never resumes automation silently. **Stop** latches task cancellation, including pending speech/capture, and reconciles already-dispatched effects. **Take over** performs Stop and leaves external app state intact. **Cancel** exits an uncommitted preview or input. **Stop speaking** only mutes output and is explicitly labeled; it does not mean microphone off.

During external actions a visible stop/return surface must be demonstrated on each admitted device/control route. An accessibility overlay is a candidate requiring service grant and policy/device validation; there is no always-on overlay promise. If the surface is unavailable, switch to explicit manual handoff. Never overlay a credential or Android permission screen or capture hidden underlying content to simulate persistence.

## Adaptive layout and shared screen rules

Proposed native test widths remain 360, 600 and 840dp; portrait/landscape; 200% font and supported display-size settings. The browser uses one bounded reading column and CSS-pixel fixtures at tablet/narrow widths; there is no permanent task sidebar. Content reflows before truncation. IME resizes/scrolls content; Stop and confirmation escape remain reachable. Respect insets, TalkBack and switch focus. No forced orientation or gesture precision. Browser geometry is not native dp/sp evidence.

Every screen below inherits: title/heading semantics; normal visual reading order = accessibility traversal; native button/switch/text-field roles; text labels on icons; decorative images excluded; keyboard Tab/Shift-Tab traversal, Enter/Space on focused action only, Escape/Back as escape; switch traversal covers all actions. Destructive/consequential action is never default autofocus. On entry focus title, on return restore invoking control, on state update announce once without stealing focus. Captions remain visible when speech off. Shared minimum targets, contrast, typography and timing are in [accessibility](accessibility.md).

Every screen emits only `screen_enter(screen_id,state,task_id?)`, `control_invoked(component_id,action_enum)` and `screen_exit(reason_enum)` into the local bounded audit when useful; no label text, people, transcript or image. State changes add previous/next state, version, coarse duration and failure code. Events cannot be used to reconstruct private browsing. Optional export is previewed.

Loading has an explicit cause and bounded deadline. Empty explains absence and gives one useful action. Disabled controls carry a visible reason, remain understandable to assistive tech, and never hide permission failure. Critical errors remain in-page until resolved/dismissed. Interrupted states restore readable content while invalidating execution authority.

## Screen inventory

<a id="scr-001"></a>
### SCR-001 — First launch

**Purpose/links:** J-007 / PRD-FR-003.
**Entry/exit:** New install or reset → continue to preferences/permissions; Try by touch → Home.
**Hierarchy/content:** Title, what app can do, software-assistant identity, experimental scope, privacy summary.
**Controls:** Continue; Try by touch; Android Back exits. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** No personal data; setup-step only.
**Loading/empty/disabled/error/interrupted:** No loading gate; empty not applicable; failed setup storage → retry/local demo; interruption retains only safe step. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Title → purpose → limits → Continue → Try by touch; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Browser realization:** A short skippable introduction sits with the opening invitation; typing works immediately. Menu can reopen it. The Talk transcript is fictional and editable; declining microphone use leaves the touch path usable. No device setup, grant or persistence is simulated as real.
**Design review question:** Reading rhythm; avoid age-coded welcome imagery.

<a id="scr-002"></a>
### SCR-002 — Permission education and OS handoff

**Purpose/links:** J-007 / PRD-FR-003, PRD-DST-004.
**Entry/exit:** Feature requires grant → individual disclosure → Android → recheck → task/limited mode.
**Hierarchy/content:** One permission purpose, data touched, destination/retention, decline consequence, current state.
**Controls:** Continue to Android settings; Skip for now; Back; Recheck. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** Grant status and consent version; never credential/token.
**Loading/empty/disabled/error/interrupted:** Checking shows status; missing shows limited capability; denied no nag; revoked cancels task; external return is not proof. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Heading → data/purpose → consequence → grant action → Skip; announce actual grant change; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Separate microphone, accessibility, capture and cloud consent variants.

<a id="scr-003"></a>
### SCR-003 — Home

**Purpose/links:** J-007 / PRD-FR-001/002.
**Entry/exit:** Setup complete/skip or return → current conversation; a fresh conversation first resolves unfinished work.
**Hierarchy/content:** Welcome invitation, readable thread, persistent labeled composer and Talk, quiet Menu. Content appears for the current request.
**Controls:** Talk; Type a request; submit intent; Menu with secondary history/settings/privacy/help. Submit requests interpretation, never approval of a consequence.
**Data/sensitivity:** No unsolicited private preview; local preferences only.
**Loading/empty/disabled/error/interrupted:** No history leaves the invitation available; offline status names usable local functions; interrupted work retains its truthful result and has no automatic resumption.
**Focus, semantics, keyboard/switch and speech:** Stable Stop when active → Header/Menu → thread content → composer/Talk/submit. Updates preserve reading position and input focus; new task controls never autofocus approval.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Can the person express a goal and find the next useful action without learning a feature taxonomy?

<a id="scr-004"></a>
### SCR-004 — Listening, transcript and interpretation

**Purpose/links:** J-001/003/007 / PRD-FR-001.
**Entry/exit:** User activates input → transcript; Done → planning; Edit → heard; Cancel → cancelled.
**Hierarchy/content:** Microphone state in words+icon, partial text styled provisional, final editable intent, scope hint.
**Controls:** Done listening; editable transcript; submit transcript; Cancel/Stop; typed alternative. Sufficient typed requests progress without an extra Use/category step. In the browser Talk is explicitly simulated and never captures audio.
**Data/sensitivity:** Ephemeral audio/text; mark private speech option.
**Loading/empty/disabled/error/interrupted:** No speech: prompt Type or Try again; ASR fail preserves typed route; revoked mic stops capture; changed draft cancels old plan. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Mic status → transcript → Done/Edit → Use → Cancel; do not announce every partial token; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Partial/final transcript distinction without low contrast.

<a id="scr-005"></a>
### SCR-005 — Task activity and stop surface

**Purpose/links:** All MVP / PRD-FR-004/013, PRD-NFR-001.
**Entry/exit:** Planning/acting/waiting/verifying → result, clarification, confirmation, recovery.
**Hierarchy/content:** Goal, latest verified step, current action/wait reason, Stop, Take over; no speculative percent.
**Controls:** Stop; Take over; Repeat status; Continue manually when waiting. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** Minimal current task, sensitive names only when needed; no audit raw copy.
**Loading/empty/disabled/error/interrupted:** 5s concrete waiting message; 15s manual option; deadline safe stop; permission/auth loss separate state. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Goal → status → Stop → Take over; Stop always reachable and never disabled; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** External stop surface is conditional on device proof; cannot promise universal overlay.

<a id="scr-006"></a>
### SCR-006 — Clarification / entity choice

**Purpose/links:** J-001/003/006 / PRD-FR-007, PRD-ACC-004.
**Entry/exit:** Ambiguity → chosen value → new plan/preview; Cancel ends task.
**Hierarchy/content:** One question, 2–5 choices initially, user-entered differentiators, current request.
**Controls:** Select labeled row; None of these; Edit request; Cancel. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** Minimum contact/content detail, no guessed family labels.
**Loading/empty/disabled/error/interrupted:** Empty: choose/add manually; loading bounded; stale candidates refresh; interruption invalidates selection authority. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Question → options → None → Edit → Cancel; rows single semantic targets; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Distinguish people without relying only on avatar/color.

<a id="scr-007"></a>
### SCR-007 — Action confirmation

**Purpose/links:** J-003/008 / PRD-SAF-002, PRD-FR-009.
**Entry/exit:** Prepared version → approve exact action → revalidate; Change → new version; Cancel ends.
**Hierarchy/content:** Recipient+endpoint/channel, exact content or effect, reversibility/handoff statement, approval controls.
**Controls:** Send to [person] OR Open this draft in [app]; Change it; Cancel; Repeat; Renew preview on expiry. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** Highly private draft kept local; approval token never displayed.
**Loading/empty/disabled/error/interrupted:** Loading cannot approve; missing target disables with explanation; expiry keeps readable content and requires refreshed approval; interrupted invalidates token. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Heading/recipient → consequence → full preview → Change → Cancel → action; no commit autofocus or generic Enter-to-send; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Inline exact preview is the proposed default; long content can expand into a focused reading surface. The full recipient/channel/body/effect remains inspectable at maximum scale, with Change/Cancel and specific approval.

<a id="scr-008"></a>
### SCR-008 — Result and recovery

**Purpose/links:** All / PRD-FR-012/016.
**Entry/exit:** Verification/stop/failure → Home, manual continuation, safe retry, review status.
**Hierarchy/content:** Outcome label, evidenced work, unresolved part, one safe next step, optional details.
**Controls:** Done; Continue manually; Review status; Retry only when safe; Undo only supported reversible change. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** Content minimal; evidence strength visible, no raw diagnostic default.
**Loading/empty/disabled/error/interrupted:** Completed/partial/unknown/interrupted/cancelled/failed distinct; no-result explains; loading status reconciliation bounded; repeat never repeats effect. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Outcome → evidence → unresolved part → next step → Done; announce once; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Use text and icon; partial must not look like full success.

<a id="scr-009"></a>
### SCR-009 — Task history

**Purpose/links:** J-007 / PRD-FR-015.
**Entry/exit:** History → task summary; Back restores previous focus.
**Hierarchy/content:** Chronological task type/time/result and evidence class; detail optional.
**Controls:** Open summary; Clear history; Back. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** Local minimal audit, no body/screenshots/audio.
**Loading/empty/disabled/error/interrupted:** Empty: No saved task history; loading local skeleton; failed read no fabricated entries; clear failure remains pending. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Heading → rows newest first → Clear history → Back; row label includes outcome; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Readable unknown/stopped status; no surveillance dashboard.

<a id="scr-010"></a>
### SCR-010 — Memory and people

**Purpose/links:** J-007 / PRD-PRV-002/003.
**Entry/exit:** Settings → saved items; save/correct/delete → verify store → list.
**Hierarchy/content:** Item, value, source/date, explicit vs inferred (inferred saving unavailable), private scope.
**Controls:** Add alias; Edit; Delete item; Export (V1 personal memory); Back. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** Explicit preferences/aliases MVP; dates V1; local/private.
**Loading/empty/disabled/error/interrupted:** Empty: Nothing saved here; delete preview names item/derivatives; failed write keeps old value; interruption cannot claim success. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Title → items → source/scope → Edit/Delete → Back; editable fields labeled; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Avoid database language; source is understandable without technical confidence scores.

<a id="scr-011"></a>
### SCR-011 — Accessibility and voice settings

**Purpose/links:** J-006/007 / PRD-ACC-001/003.
**Entry/exit:** Settings or Make text larger → preview/apply → return.
**Hierarchy/content:** Text-size preview, contrast preference, speech speed/sample, spoken-content choice, captions, reduced motion.
**Controls:** Adjust labeled setting; Hear sample; Apply; Restore previous size; Back. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** Local preferences, no inferred disability.
**Loading/empty/disabled/error/interrupted:** Works offline; missing voice pack offers text; unsupported setting explains; rotation retains preview; revert failure honest. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Title → preview → each control/value → Apply/Restore → Back; sliders also have +/− buttons; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Large-text screenshots and narrow layout; no dense control grid.

<a id="scr-012"></a>
### SCR-012 — Privacy, data and helper boundaries

**Purpose/links:** J-007 / PRD-PRV-001/004/006.
**Entry/exit:** Settings → Privacy → consent/grants/history/data controls.
**Hierarchy/content:** What is active, what stays local, what may go to provider, retained categories, no helper access in MVP.
**Controls:** Manage Android permissions; Disable cloud processing; Clear history; Delete local data; Helpers (V1); Back. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** Consent/settings/retention; deletion affects local stores only unless cloud receipt proven.
**Loading/empty/disabled/error/interrupted:** Offline revocation immediate local; remote deletion pending explicitly; no helper empty default; interrupted deletion resumed as local maintenance only. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Heading → collection states → retained data → controls → destructive preview → Back; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Separate reversible switches from whole-data deletion.

<a id="scr-013"></a>
### SCR-013 — Helper invitations and proposal review

**Purpose/links:** J-004 / PRD-PRV-005; V1 only.
**Entry/exit:** Explicit invite → separate authentication → scope → pending proposals → local approval/revoke.
**Hierarchy/content:** Helper identity, scope/expiry, cannot-see list, old/new values, revoke status.
**Controls:** Invite; Approve this change; Reject; Revoke access; Back. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** Contact/configuration diffs only; no private task/history/content.
**Loading/empty/disabled/error/interrupted:** No helper: explain optional; expired/invitation failure no access; offline blocks new grants; revocation local immediate. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Identity → scope → diff → Reject → Approve → Revoke/Back; no helper auto-consent; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Deferred remote-help frames visually marked and excluded from MVP prototype.

<a id="scr-014"></a>
### SCR-014 — Offline / permission / authentication / restricted

**Purpose/links:** All / PRD-FR-016, PRD-DST-004.
**Entry/exit:** Dependency/policy loss → status-specific manual step → explicit Resume with new context.
**Hierarchy/content:** Exact obstacle, completed work, what remains possible locally, no technical stack errors.
**Controls:** Continue manually; Open owning settings/app; Retry after safe recheck; Home; Cancel. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** Dependency codes; protected content hidden.
**Loading/empty/disabled/error/interrupted:** Offline no send queue; auth no capture; revoked invalidates permits; unsupported route no action; no endless retry. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Obstacle → known status → safe option → Home/Cancel; announce reason once; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Different causes share structure but use distinct plain-language labels.

<a id="scr-015"></a>
### SCR-015 — Help, feedback and diagnostics

**Purpose/links:** J-007 / PRD-FR-017, PRD-NFR-005.
**Entry/exit:** Help → capabilities/support → optional preview/export.
**Hierarchy/content:** Supported version/capability status, plain next step, feedback, exact diagnostic preview.
**Controls:** Practice stopping; View permissions; Report a problem; Preview export; Share export; Back. Primary is the next goal-specific action; Back/Cancel are escape, and delete/revoke are destructive actions with named previews.
**Data/sensitivity:** Versions, timings, codes; optional user note independently reviewed.
**Loading/empty/disabled/error/interrupted:** Offline local help/export; no events empty; failed export no upload; interruption cancels sharing. Remaining states inherit shared rules; no hidden background work on exit.
**Focus, semantics, keyboard/switch and speech:** Help → next step → optional note → preview → export → Back; shared native-role and silent-equivalent rules apply.
**Orientation/window:** shared reflow; content scrolls before controls shrink. Confirmation/actions stack vertically in narrow or large-text mode.
**Telemetry/eval:** shared events with this screen ID; journey-linked eval in [traceability](../01-product/traceability.md).
**Design review question:** Support copy should not demand model/API vocabulary.

## Authoritative interaction-state model

The local session coordinator owns state; the model cannot assign completed. This table defines allowed outgoing edges. Any active nonterminal state may additionally transition to interrupted/cancelled on local user request, permission lost when a dependency is revoked, authentication required on a recognized protected boundary, or offline/degraded on dependency loss. An unrecoverable local denial/error may transition to failed safely only when absence of unintended effects is known; otherwise use partially completed with explicit unknown effect. Those exceptional edges revoke pending permits before rendering. All other unlisted transitions are rejected and audited.

| State | Seen/heard | Allowed work | User controls | Timeout | Legal next states |
|---|---|---|---|---|---|
| idle | Ready; microphone off | No observation outside chosen scope | Talk, Type, Menu | No automatic timeout | listening, heard, offline/degraded |
| listening | Listening + text; optional start cue | Capture only visible user-started session | Done listening, Cancel; typed alternative | 30s capture cap; at 10s silence offer Done/Type; never auto-consent | heard, cancelled, permission lost, offline/degraded |
| heard | Editable transcript or submitted typed request | Resolve sufficient intent directly; no external consequence | Edit, Cancel; submit simulated transcript | Preview remains; raw context idle expiry follows privacy schedule | needs clarification, planning, cancelled |
| needs clarification | One concrete question + choices | Read minimum approved candidates | Select, Edit, Cancel, Repeat | No forced response; session expiry clears raw context and asks re-entry | heard, planning, ready to confirm, cancelled |
| planning | Goal + Preparing next step | Propose typed plan; policy validates | Stop, Take over | 5s progress; 15s manual option; machine deadline applies | acting, needs clarification, ready to confirm, unsupported/restricted, recovering, interrupted |
| ready to confirm | Exact target/content/effect + action label | No commit until independent fresh permit | Approve, Change, Cancel, Repeat | Permit TTL policy; preview stays; Renew preview after expiry | acting, heard, cancelled, interrupted, permission lost |
| acting | Current action and latest known progress | One permitted action at a time | Stop, Take over | Per-tool deadline and overall budget | waiting on app/network/user, verifying, interrupted, permission lost, authentication required, recovering |
| waiting on app/network/user | What is awaited; elapsed wait text | Wait for bounded predicate only; no speculative follow-up | Stop, Continue manually, Repeat | 5s reason; 15s manual option; 60s machine cap except user-read time | verifying, recovering, interrupted, offline/degraded, authentication required |
| verifying | Checking what happened | Read resulting evidence; no repeat consequence; if a step passed but goal remains, return to planning within original budget | Stop, Review status | 5s then one bounded re-observe; unresolved becomes partial/failed | planning, completed, partially completed, recovering, interrupted, failed safely |
| completed | Specific verified outcome | No next task automatically | Done, new request, supported Undo | Persist minimal result; raw data expires | idle, heard |
| partially completed | What completed; what is unknown/unfinished | Reconcile read-only if safe | Review status, Continue manually, Done | No auto-retry; preview expiration independent | verifying, recovering, idle, heard |
| interrupted | Stopped/takeover, possible in-flight outcome | Cancel latch; reconcile dispatched effect only | Continue manually, Review status, new request | Immediate local latch; no automatic resume | verifying, partially completed, cancelled, idle |
| cancelled | Cancelled; state what was already done | No dispatch; clear permits/audio | Home, new request | Terminal; retained minimal summary only | idle, heard |
| recovering | Concrete failure and one next step | One permitted recovery within remaining budget | Stop, Take over, select recovery | Original budget does not reset | planning, acting, failed safely, interrupted, unsupported/restricted |
| failed safely | Could not finish; no unsupported success claim | No further effect; preserve safe local draft while session active | Home, safe new attempt, Help | Terminal; next attempt new task/version | idle, heard |
| offline/degraded | Connection/service unavailable; available local options | Local UI, settings, help only; admitted cached reads identified | Type local request, Home, Retry connectivity | No queued consequences or auto-resume on reconnect | idle, planning, failed safely, cancelled |
| permission lost | Screen/mic access turned off | Invalidate tokens, stop protected collection/action | Open settings manually, Home, Cancel | Immediate pre-dispatch recheck; no automatic grant | idle, planning, cancelled |
| authentication required | Sign in privately in [app] | Suspend observation and execution; no credentials | Open app yourself, Home, Resume after return | No auth timeout submits anything; fresh context on resume | idle, planning, cancelled |
| unsupported/restricted | Specific capability limitation | No prohibited tool; explanation/manual handoff only | Open app yourself, Home, Help | Terminal for denied task | idle, heard |

**Race rule:** cancellation, permission loss and user-interaction epoch changes are processed before queued model/action messages. Already-dispatched external actions may finish; reporting enters verifying/partial and never promises rollback. A new request after terminal state starts a new task ID; resumption after pause uses a new plan version. No transition resets the action budget.

## Confirmation and content boundaries

SCR-007 uses [CMP-003](design-system.md#cmp-003), not a transient toast. Name person, exact content, channel and consequence. “Open draft” and “Send” are distinct verbs with different outcomes. The whole preview is inspectable at large text and through speech; never abbreviate recipient/body to fit. The user can replay/edit without issuing another action. Expiry removes authority but leaves content visible and offers Renew preview; no countdown pressure.

Success/result components distinguish attempted, prepared, opened, sent, delivered, uncertain and stopped. A green check is reserved for verified claimed outcome and always accompanies text. “Done” alone is insufficient for a consequential action.

## Browser-first design and implementation handoff

[Browser design/handoff](browser-prototype.md) names current views, controls, test scenarios and limitations. The [Figma package](figma.md) remains optional historical execution guidance. Low-fidelity interaction review precedes comparison of four concrete identity territories on identical Home and confirmation structures. All numerical design values remain proposed until Simon's decision and device/accessibility evidence. Local feasibility UI may use provisional neutral tokens; production styling requires GATE-05. Screen IDs and state names survive changes in visual style.
