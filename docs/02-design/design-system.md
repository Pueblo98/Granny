---
title: "Stage 1 Design System Contracts"
status: proposed
owner: Simon
last_updated: 2026-09-20
tags: [design, tokens]
related:
  - product-design-spec.md
  - shared-conversation-state-surfaces.md
  - brand-and-visual-identity.md
  - accessibility.md
  - figma.md
---

# Design-system contract

**Design review update:** the earlier browser UI had too many buttons and a generic AI appearance. The component catalog remains bounded by [ADR-0013](../09-decisions/ADR-0013-bounded-interface-composition.md); future Context Rooms Home work now starts from [ADR-0016](../09-decisions/ADR-0016-explicit-home-room-row.md)'s selected Explicit Scroll Row and the Harbour Blue system. The catalog below does not prescribe displaying all controls at once. Historical Figma authoring remains quota-blocked; it is not a dependency of the current local design route.

Current composition is implemented as native HTML controls in the [browser prototype](browser-prototype.md). Reusable rendering helpers map to CMP contracts; semantic CSS custom properties are provisional grayscale review values, not accepted production tokens. Figma instances are no longer the required current handoff. Prototype discrepancies remain named gaps, not new component requirements.

This file owns semantic roles and reusable behavior. [Product design](product-design-spec.md) owns screens/states; [brand territories](brand-and-visual-identity.md) own candidate color/font identity values. Accepted ADR boundaries and confirmed requirements apply where linked; remaining component details are proposed. No final public name, logo, palette or typeface is accepted.

## Token roles and provisional dimensions

Color: background, surface, surface-raised, text-primary, text-secondary, border, action-primary, action-on-primary, accent-decorative, success, warning, danger, focus, disabled. State always includes text/icon/position, never hue alone. Decorative accents cannot carry essential text without measured contrast. High-consequence is not automatically red: Send uses primary with explicit wording; deletion uses danger.

Typography: display (32sp/40 line), heading (28/36), body (20/30), body-large (24/34), button (20/28), status (20/28), supporting (18/26). Values scale with user/system preference; do not cap font size. Body regular 400–450, labels 600, headings 600–700; do not rely on light weights. Numbers are proposed starting geometry, not external standards.

Proposed in-app TextScale choices: 1.0, 1.15, 1.3 and 1.5 times base sp, labeled Standard / Larger / Larger still / Largest; system font scaling still applies and is never overridden downward. Include combined 200% system + 1.5 app scale in own-layout tests, beyond the minimum 200% baseline. Show live readable preview and Restore previous size. SpeechRate choices: 0.75, 1.0, 1.25, 1.5 relative to provider normal; user previews voice before saving and unsupported rates are explained, not silently substituted. PrivateSpeech and ReducedMotion are explicit On/Off controls; private content is not spoken automatically by default.

Spacing: 4/8/12/16/24/32/48dp. Screen inset 24dp nominal, 16dp narrow; 12dp between distinct primary targets; 8dp internal label/icon gap. Interactive target ≥56dp; primary, Stop and consequential action ≥64dp height. Labels wrap and targets grow. Content measure roughly 45–65 characters where practical; no fixed line counts.

Shape: semantic small/control/container/dialog radii; candidate values vary by territory. Elevation: flat primary layout; border and spacing carry grouping, shadow optional; no depth-only action meaning. Focus: ≥3:1 distinguishable ring, 3dp plus 2dp separation, not clipped by cards. Motion: 120ms press/180ms state change/240ms panel proposal; reduced motion is immediate state replacement with static icon/text. No flashing, infinite decorative pulse or simulated progress.

## Component contracts

All components have stable IDs and share enabled/focused/pressed/selected/loading/disabled/error/completed semantics. Focus stays visible; pressed changes fill/border, not position; selection includes a check plus label; loading retains label and explanation; disabled gives a reason; error is text plus icon; completed is based on verified state. Destructive/action dispatch controls lock against duplicate submission but Stop never disables.

### Bounded composition contract

The model may emit only a typed composition plan referencing registered CMP IDs, versioned variants, typed content slots and allowed action references. The app renderer validates the whole plan, supplies native semantics and owns focus/source order. Unknown IDs/variants/slots, invalid nesting, duplicate consequential controls, hidden required fields, unsafe order or content beyond component bounds reject the plan and use a known fallback.

Composition can choose which relevant components appear and how nonconsequential content flows within the current task. It cannot create executable code/event handlers, rename a registered consequence, bypass preview/confirmation, remove Stop, move stable Talk/Type/Menu anchors or convert observed content into a control. At large text/narrow width, renderer-owned reflow overrides model ordering when required for reading/focus. Temporary task components may appear automatically. The MVP Home permits CMP-010 as its optional context region; the selected Context Rooms Home may combine one compact CMP-010 continuation with one renderer-owned CMP-012 row under ADR-0016.

Listening, transcript, clarification, consequence, activity and outcome
components follow the accepted [shared conversation state-surface
contract](shared-conversation-state-surfaces.md). They normally expand from the
stable bottom composer or appear as one temporary surface above it. They do not
create seven destination pages or erase the current Home/Room context. A
safety-critical or large-text variant may temporarily occupy most of the
viewport while preserving its origin and return state.

<a id="cmp-001"></a>
### CMP-001 — Stop / Cancel / Take over

Persistent during active task; text + stop-square icon, highest reachable escape priority, ≥64dp. Stop sends local cancel latch synchronously, stops capture/output and clears permits before waiting on a model. Take over also preserves external screen. Cancel exits preview/input. Show “Stopping” only during reconciliation, never continue queued actions. When in-flight effect is unknown, display that outcome in result. Test EVAL-006 races. Position remains stable per layout; no gesture-only escape.

<a id="cmp-002"></a>
### CMP-002 — Microphone and transcript

Talk starts explicit capture; label becomes Listening and control Done listening. Microphone-off icon + words are distinct from speaker mute. Show partial transcript as “Heard so far”, then editable final text. Do not read partial words over user speech. Use this request commits interpretation, not external action. Audio error offers Type a request. TalkBack receives state announcements, not every streaming token. No ambient wake-word indicator in MVP.

<a id="cmp-003"></a>
### CMP-003 — Consequence / deletion preview

Persistent structured content within the conversation, expandable for long reading, with target, channel, exact body/diff, effect, reversibility and approval controls. This proposed composition is authorized for the browser exploration by the [conversation-first direction](conversation-first-plan.md). Approval label is specific; Change and Cancel are equally reachable. No preselection, timed auto-approval, swipe-to-send, double-tap shortcut or generic keyboard Enter submit. Repeat reads exact preview without minting approval. Expiry offers Renew preview; material edits invalidate digest and preserve unsaved local edits. Historical turns cannot approve a later task. Delete local data names categories and external limits; destructive color plus text/icon. Focus reads effect before controls and never automatically selects approval. EVAL-003/010/012.

Native assistive activation of the deliberately focused approval button (including TalkBack double tap or keyboard Enter/Space) remains valid; the prohibition is a custom shortcut bypassing preview/focus, not an accessibility gesture ban.

<a id="cmp-004"></a>
### CMP-004 — Activity and wait status

Show user goal, current safe step and last verified step, not internal chain of thought or guessed percentage. Spinner only accompanies text and bounded wait. At 5s name awaited dependency; at 15s expose manual path. Announce new semantic state once; don't narrate taps. Waiting on user never silently consumes a confirmation. Include CMP-001.

<a id="cmp-005"></a>
### CMP-005 — Choice row and entity card

Whole row is one target with stable entity key, visible name and minimum differentiator. Selection uses explicit mark and spoken selected state. Person photo optional and decorative if label sufficient; never face identification as proof. Up to five choices, More results is explicit, no automatic carousel. No match and Cancel always available. Content choices include date/source when relevant.

<a id="cmp-006"></a>
### CMP-006 — Outcome / recovery

Outcome enum controls icon, heading and language: verified complete, prepared/handoff, partial, unknown, interrupted, cancelled, safely failed. Show evidence level and next action. Retry only if executor marks safe; Review status for uncertain consequence; Undo only when adapter defines reversible postcondition. Dismiss/repeat cannot re-execute. No success toast in place of result.

<a id="cmp-007"></a>
### CMP-007 — Buttons and form controls

**Accepted composer shape, Simon, 2026-09-17:** use [Round conversation](brand-and-visual-identity.md#accepted-shape-direction--round-conversation), including its compact and expanded reference, for future composer specimens. Carry the same rounded speech-balloon silhouette through normal sizing. Shape acceptance does not promote the PNG's colors, copy or typography to tokens; the contracts below still apply.

One primary next action per decision region; secondary buttons text+outline, no low-contrast essential labels. Switches state explicit On/Off and explain scope. Slider includes −/+ alternatives and numeric/current value. Text fields have persistent labels, clear correction and no submit from incidental focus. Disabled reason in same region. Loading freezes duplicate actions, retains Cancel.

<a id="cmp-008"></a>
### CMP-008 — Guidance and permission education

Inline explanation for recoverable obstacles; full-screen decision for grants/data changes. Each disclosure names data, purpose, destination and decline effect. OS handoff control never claims a grant. Return triggers actual permission read. Do not copy Android system dialog visuals to imitate authority.

<a id="cmp-009"></a>
### CMP-009 — Lists, media and settings

Rows show descriptive labels and state; cards group related content without making the whole surface ambiguously tappable. Media includes metadata and labeled play/pause/next controls; no autoplay previews. Lists preserve position and focus on return. History rows contain no message body. Settings apply previews explicitly where layout changes; local reversible switches may apply immediately and show restore.

<a id="cmp-010"></a>
### CMP-010 — Home context panel

One semantic region for a single verified, timely or explicitly kept item. Allowed content is a short descriptive heading, state/source when needed, one clear next action, and secondary Keep here or Hide controls; Reset Home stays in Menu. The panel contains a registered content component, never model-defined actions, and never stacks multiple continuation cards, paginates or auto-rotates. In the ADR-0016 Home it uses the compact continuation variant and may coexist with CMP-012. Sensitive details stay hidden until explicit open. Absent is a complete normal state. Expiry or invalid evidence removes the panel without moving the fixed Talk/Type/Menu anchors or stealing focus. Renderer-owned reflow places the whole panel after the input region at large text/narrow widths.

<a id="cmp-011"></a>
### CMP-011 — Context Room identity, entry and source cue

One semantic family with three registered variants: **room entry** (written name, short purpose, optional reviewed `room_portrait` and concise state), **current-room identity** (persistent name/purpose plus plain scope cue) and **cross-room source cue** (source room, reason used and View source/Exclude source). The whole room-entry row is one target; icon/illustration never replaces its label. [Room atmosphere assets](context-room-visual-system.md) are decorative and cannot alter control meaning, action colors, focus order, target sizes or the Round composer. Source cues appear whenever another room materially affects meaning, privacy or correction. At large text all variants become a vertical reading sequence and preserve the room name, scope and source actions while decor may disappear. EVAL-008/012.

<a id="cmp-012"></a>
### CMP-012 — Home explicit room portrait row

Selected under [ADR-0016](../09-decisions/ADR-0016-explicit-home-room-row.md)
from the [Explicit Scroll Row reference](mockups/2026-09-19-harbour-blue-home/selected-explicit-scroll-row/README.md).
The renderer owns one open, borderless row of CMP-011 room-entry targets on the
Home Linen canvas. Each target combines a removable portrait, live written name
and short purpose as one broad semantic target; it never becomes a card grid,
boxed shelf, app icon or separate-agent identity.

When Rooms overflow, expose written **Previous** and **Next** controls with
accurate enabled/disabled state, announce the newly foregrounded range once and
preserve focus. Swipe, drag, wheel and a partial-next crop are optional
reinforcement, not the only route. Always expose written **See all rooms** to
SCR-016. When every Room fits, do not imply false overflow: suppress unavailable
movement or show its disabled state and reason accessibly. No auto-rotation,
timed movement, dot-only pagination or artwork behind live text.

At large text or narrow width, reflow to a vertical sequence/direct-list
treatment before shrinking labels or requiring essential horizontal scroll.
Image failure removes decor only. Empty, one-room, all-fit, overflow, loading,
error and offline states retain Home conversation access. Focus uses the
separated `#4930A1` ring without clipping; the component cannot move the stable
Round composer or active Stop. EVAL-008/012.

## Transient surfaces

Toast/snackbar: optional nonessential acknowledgement only, never sole failure/confirmation/undo control. In-page banner: persistent dependency/permission status. Dialog: short local destructive preview with focus containment and Back escape; long previews use full page. Sheet: nonconsequential bounded choice only if large text/focus work; otherwise full page. No stacked dialogs or hidden essential actions behind overlays.

## Identity-to-token workflow

**Current visual selection, Simon, 2026-09-19:** [Harbour Blue final board and written transcription](mockups/2026-09-19-style-boards/final-harbour-blue/README.md) now supply the selected visual reference for the rounded composer, controls and context panel. This supersedes the earlier open palette shortlist, not the component behavior above. Exact production measurements, font files and accessibility evidence remain separate.

Brand foundation → four territories → Simon review + accessibility/user evidence → selected proposed direction → validated semantic values and logo assets → browser components/prototypes (Figma optional) → accepted Git-backed tokens and Android.

The local [identity review board](identity-review.html) is an exploratory artifact, not production tokens. Candidate values and calculated color-pair contrast live in the brand document; no device/user measurement is implied. Feasibility screens use the [neutral token fixture](../../design-tokens/README.md) and system sans with proposed dimensions; label them provisional in engineering/design metadata, not as a product warning in every UI.

After selection record token name/value/unit/theme/status, originating territory, contrast pair, font license/version and Figma variable link/version in the repository's design-tokens boundary. Generate Android mappings only from reviewed tokens. Designer and engineer inspect a reference screenshot diff; a code-only override must return to this spec or be logged as debt with expiry.
