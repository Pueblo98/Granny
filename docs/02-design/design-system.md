---
title: "Stage 1 Design System Contracts"
status: proposed
owner: Simon
last_updated: 2026-09-14
tags: [design, tokens]
related:
  - product-design-spec.md
  - brand-and-visual-identity.md
  - accessibility.md
  - figma.md
---

# Design-system contract

Current composition is implemented as native HTML controls in the [browser prototype](browser-prototype.md). Reusable rendering helpers map to CMP contracts; semantic CSS custom properties are provisional grayscale review values, not accepted production tokens. Figma instances are no longer the required current handoff. Prototype discrepancies remain named gaps, not new component requirements.

This file owns semantic roles and reusable behavior. [Product design](product-design-spec.md) owns screens/states; [brand territories](brand-and-visual-identity.md) own candidate color/font identity values. Everything below is proposed. No final public name, logo, palette or typeface is accepted.

## Token roles and provisional dimensions

Color: background, surface, surface-raised, text-primary, text-secondary, border, action-primary, action-on-primary, accent-decorative, success, warning, danger, focus, disabled. State always includes text/icon/position, never hue alone. Decorative accents cannot carry essential text without measured contrast. High-consequence is not automatically red: Send uses primary with explicit wording; deletion uses danger.

Typography: display (32sp/40 line), heading (28/36), body (20/30), body-large (24/34), button (20/28), status (20/28), supporting (18/26). Values scale with user/system preference; do not cap font size. Body regular 400–450, labels 600, headings 600–700; do not rely on light weights. Numbers are proposed starting geometry, not external standards.

Proposed in-app TextScale choices: 1.0, 1.15, 1.3 and 1.5 times base sp, labeled Standard / Larger / Larger still / Largest; system font scaling still applies and is never overridden downward. Include combined 200% system + 1.5 app scale in own-layout tests, beyond the minimum 200% baseline. Show live readable preview and Restore previous size. SpeechRate choices: 0.75, 1.0, 1.25, 1.5 relative to provider normal; user previews voice before saving and unsupported rates are explained, not silently substituted. PrivateSpeech and ReducedMotion are explicit On/Off controls; private content is not spoken automatically by default.

Spacing: 4/8/12/16/24/32/48dp. Screen inset 24dp nominal, 16dp narrow; 12dp between distinct primary targets; 8dp internal label/icon gap. Interactive target ≥56dp; primary, Stop and consequential action ≥64dp height. Labels wrap and targets grow. Content measure roughly 45–65 characters where practical; no fixed line counts.

Shape: semantic small/control/container/dialog radii; candidate values vary by territory. Elevation: flat primary layout; border and spacing carry grouping, shadow optional; no depth-only action meaning. Focus: ≥3:1 distinguishable ring, 3dp plus 2dp separation, not clipped by cards. Motion: 120ms press/180ms state change/240ms panel proposal; reduced motion is immediate state replacement with static icon/text. No flashing, infinite decorative pulse or simulated progress.

## Component contracts

All components have stable IDs and share enabled/focused/pressed/selected/loading/disabled/error/completed semantics. Focus stays visible; pressed changes fill/border, not position; selection includes a check plus label; loading retains label and explanation; disabled gives a reason; error is text plus icon; completed is based on verified state. Destructive/action dispatch controls lock against duplicate submission but Stop never disables.

<a id="cmp-001"></a>
### CMP-001 — Stop / Cancel / Take over

Persistent during active task; text + stop-square icon, highest reachable escape priority, ≥64dp. Stop sends local cancel latch synchronously, stops capture/output and clears permits before waiting on a model. Take over also preserves external screen. Cancel exits preview/input. Show “Stopping” only during reconciliation, never continue queued actions. When in-flight effect is unknown, display that outcome in result. Test EVAL-006 races. Position remains stable per layout; no gesture-only escape.

<a id="cmp-002"></a>
### CMP-002 — Microphone and transcript

Talk starts explicit capture; label becomes Listening and control Done listening. Microphone-off icon + words are distinct from speaker mute. Show partial transcript as “Heard so far”, then editable final text. Do not read partial words over user speech. Use this request commits interpretation, not external action. Audio error offers Type a request. TalkBack receives state announcements, not every streaming token. No ambient wake-word indicator in MVP.

<a id="cmp-003"></a>
### CMP-003 — Consequence / deletion preview

Full-page content with target, channel, exact body/diff, effect, reversibility and approval controls. Approval label is specific; Change and Cancel are equally reachable. No preselection, timed auto-approval, swipe-to-send, double-tap shortcut or generic keyboard Enter submit. Repeat reads exact preview without minting approval. Expiry offers Renew preview; material edits invalidate digest. Delete local data names categories and external limits; destructive color plus text/icon. Screen reader focus starts at heading and reads effect before controls. EVAL-003/010/012.

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

One primary next action per decision region; secondary buttons text+outline, no low-contrast essential labels. Switches state explicit On/Off and explain scope. Slider includes −/+ alternatives and numeric/current value. Text fields have persistent labels, clear correction and no submit from incidental focus. Disabled reason in same region. Loading freezes duplicate actions, retains Cancel.

<a id="cmp-008"></a>
### CMP-008 — Guidance and permission education

Inline explanation for recoverable obstacles; full-screen decision for grants/data changes. Each disclosure names data, purpose, destination and decline effect. OS handoff control never claims a grant. Return triggers actual permission read. Do not copy Android system dialog visuals to imitate authority.

<a id="cmp-009"></a>
### CMP-009 — Lists, media and settings

Rows show descriptive labels and state; cards group related content without making the whole surface ambiguously tappable. Media includes metadata and labeled play/pause/next controls; no autoplay previews. Lists preserve position and focus on return. History rows contain no message body. Settings apply previews explicitly where layout changes; local reversible switches may apply immediately and show restore.

## Transient surfaces

Toast/snackbar: optional nonessential acknowledgement only, never sole failure/confirmation/undo control. In-page banner: persistent dependency/permission status. Dialog: short local destructive preview with focus containment and Back escape; long previews use full page. Sheet: nonconsequential bounded choice only if large text/focus work; otherwise full page. No stacked dialogs or hidden essential actions behind overlays.

## Identity-to-token workflow

Brand foundation → four territories → Simon review + accessibility/user evidence → selected proposed direction → validated semantic values and logo assets → browser components/prototypes (Figma optional) → accepted Git-backed tokens and Android.

The local [identity review board](identity-review.html) is an exploratory artifact, not production tokens. Candidate values and calculated color-pair contrast live in the brand document; no device/user measurement is implied. Feasibility screens use the [neutral token fixture](../../design-tokens/README.md) and system sans with proposed dimensions; label them provisional in engineering/design metadata, not as a product warning in every UI.

After selection record token name/value/unit/theme/status, originating territory, contrast pair, font license/version and Figma variable link/version in the repository's design-tokens boundary. Generate Android mappings only from reviewed tokens. Designer and engineer inspect a reference screenshot diff; a code-only override must return to this spec or be logged as debt with expiry.
