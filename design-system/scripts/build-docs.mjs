#!/usr/bin/env node
/**
 * Emits one Markdown doc per component into design-system/docs/.
 *
 * These become each component's `.prompt.md` in the synced system — the
 * reference the design agent reads when it composes with these parts. The
 * frontmatter `category` sets the group the component appears under.
 *
 * Content lives here rather than in 28 loose files so the category mapping,
 * the shared prohibitions and the house voice stay consistent.
 *
 *   node design-system/scripts/build-docs.mjs
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', 'docs');
mkdirSync(outDir, { recursive: true });

/** Rules that bind every component. Repeated in each doc because the design agent reads one file at a time. */
const HOUSE_RULES = `
## Rules that apply to every component here

- Wrap everything in \`<ThemeProvider>\`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the \`--ds-*\` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
`.trim();

const DOCS = {
  // ---------------------------------------------------------------- Foundations
  ThemeProvider: {
    category: 'Foundations',
    summary: 'Root wrapper that supplies the theme, the text scale and the reduced-motion presentation.',
    body: `Every Granny screen and every specimen starts here. It sets \`data-ds-theme\`, which the token layer switches on, and \`--ds-text-scale\`, which every type role multiplies by.

\`theme\` chooses between the two candidate territories. \`open-day\` is the working review baseline; \`bright-signal\` is the challenger. Neither is accepted, and the role names are identical in both — swapping the territory never requires editing a component.

\`textScale\` is the in-app setting (1, 1.15, 1.3, 1.5). It multiplies on top of whatever the operating system already applied; the system scale is never overridden downward.

\`\`\`jsx
<ThemeProvider theme="open-day" textScale={1.3}>
  <ConsequencePreview … />
</ThemeProvider>
\`\`\``,
  },
  Icon: {
    category: 'Foundations',
    summary: 'Stroke icon at 2–2.5dp, sized to the text it sits beside.',
    body: `Shapes are authored in this repository, so the system carries no third-party icon licence.

Defaults to \`1em\` so it scales with its text role, including at 200%. Pass \`label\` only when the icon stands alone — which on an essential action it never should, because every essential action carries a visible word.

\`\`\`jsx
<button className="ds-button ds-button--primary">
  <Icon name="mic" />
  <span>Talk</span>
</button>
\`\`\``,
  },
  ColorFoundation: { category: 'Foundations', summary: 'Semantic colour roles with their measured contrast.', body: 'A review sheet, not a building block. Renders every colour role for a theme and the measured contrast for each pair the components actually use. Ratios come from the generated contrast report, so the sheet cannot display a number that was not computed.' },
  TypeFoundation: { category: 'Foundations', summary: 'The type scale and the in-app text-scale options.', body: 'A review sheet. Sizes are proposed Android sp, mapped 1sp to 1px for the browser at scale 1.0. Body is 20sp — the reading size, not a caption size.' },
  SpacingFoundation: { category: 'Foundations', summary: 'The 4dp spacing scale and the layout rules that use it.', body: 'A review sheet. Grouping in this system comes from spacing and rules rather than a stack of raised cards.' },
  ShapeFoundation: { category: 'Foundations', summary: 'Corner radii per territory, and the elevation rule.', body: 'A review sheet. Radius is the one dimension that differs between the territories: Open Day 12/16dp, Bright Signal 8dp. Role names are identical in both.' },
  TargetFoundation: { category: 'Foundations', summary: 'Target floors and focus-ring geometry, drawn at real size.', body: 'A review sheet. 56dp floor, 64dp for primary, Stop and consequential actions, 12dp between distinct primary targets, 3dp focus ring with 2dp separation.' },
  IconFoundation: { category: 'Foundations', summary: 'The icon set with provenance.', body: 'A review sheet. Every shape is authored in this repository; there is no third-party icon licence to attribute.' },
  MotionFoundation: { category: 'Foundations', summary: 'Durations, easing and the reduced-motion contract.', body: 'A review sheet, deliberately static — a specimen that animated on load would violate the rule it documents. Reduced motion is an immediate static state change, not merely less animation.' },
  ThemeComparison: { category: 'Foundations', summary: 'Open Day against Bright Signal on the identical specimen.', body: 'A review sheet. Same component, same content, same structure in both columns, so a preference between them is about the territory rather than about a layout difference.' },

  // --------------------------------------------------------------- Composition
  RegistrySheet: {
    category: 'Composition',
    summary: 'The ADR-0013 composition registry, with live fail-closed validator output.',
    body: `A review sheet for the bounded-composition boundary.

The agent may select registered components, variants, typed slots and allowed action references. It may not create controls, define behaviour, rename a consequence, or move the renderer-owned anchors (Stop, the Talk/Type input, the current task status).

The rejection examples on this sheet are produced by \`validateCompositionPlan\` at render time — real output, not a table of intentions.`,
  },

  // ------------------------------------------------------------------- Control
  StopControl: {
    category: 'Control and escape',
    summary: 'CMP-001. The escape from a running task. Never disabled.',
    body: `Present for the whole of any active task, in a stable position.

There is deliberately **no \`disabled\` prop**. Stop stays live while loading, while stopping, and while waiting on a model. If you find yourself wanting to disable it, the design is wrong.

\`mode="stopping"\` appears only while reconciling what already happened, and never implies queued work will continue.

\`\`\`jsx
<StopControl showTakeOver note="Take over leaves the app open where it is." />
\`\`\``,
  },
  TalkControl: {
    category: 'Control and escape',
    summary: 'CMP-002. Tap-to-talk capture, with a typed path always available.',
    body: `No wake word, no ambient listening, no always-listening indicator. The capture state is a word plus an icon, and microphone-off is visibly distinct from a muted speaker.

Every state keeps "Type a request" reachable — no task in this system depends on speech.`,
  },
  Transcript: {
    category: 'Control and escape',
    summary: 'CMP-002. Provisional and final recognised text, editable before use.',
    body: `"Heard so far" is provisional and visibly distinct from the committed text.

"Use this request" commits the *interpretation* only. It never commits an external consequence — that always belongs to \`ConsequencePreview\` and its own approval control.`,
  },

  // --------------------------------------------------------------- Consequence
  ConsequencePreview: {
    category: 'Consequence',
    summary: 'CMP-003. The component a consequential (POL-03) action is approved through.',
    body: `Use this for anything that leaves the tablet: sending, sharing, purchasing, changing an account. Never approve such an action through a plain \`Button\`.

Reading order is effect → target and content → controls, so the consequence is read before the buttons are reached.

What this component deliberately does **not** support, each a requirement rather than a gap:

- no autofocus on approval and no preselected control;
- no countdown, timer or auto-approval;
- no swipe, double-tap or Enter-to-send shortcut;
- no truncation of the recipient or the body, at any text size.

\`approveLabel\` must name the effect: \`"Send to David"\`, not \`"Confirm"\`.

Sending is **not** danger. Use the primary role with exact wording; \`DeletionPreview\` owns the destructive role.

\`\`\`jsx
<ConsequencePreview
  target="David Okonjo (mobile, 07700 900461)"
  channel="Messages"
  body="I'll call after dinner."
  effect="This sends a message straight away."
  reversibility="It cannot be unsent once it has gone."
  approveLabel="Send to David"
/>
\`\`\`

Rendering this grants nothing. Approval is enforced by local policy against a single-use permit; the UI only collects the touch.`,
  },
  DeletionPreview: {
    category: 'Consequence',
    summary: 'CMP-003. Removal of local data, with categories named.',
    body: `The one place the destructive role is used as a fill. The colour is always accompanied by the word and the icon, so the consequence survives a greyscale reading.

Name the categories. A bare count ("delete 12 items") is not an exact preview and does not satisfy CMP-003. State plainly what the deletion cannot reach — copies already held by other services.`,
  },

  // ------------------------------------------------------------------ Activity
  ActivityStatus: {
    category: 'Activity and outcome',
    summary: 'CMP-004. Goal, last verified step, current step — and Stop.',
    body: `Shows the person's goal in their terms, the last independently verified step and the current one.

Never a chain of thought, never a guessed percentage, never a simulated progress bar, and never a narration of individual taps.

At roughly 5s name what is being waited on (\`waitingOn\`); at roughly 15s expose the manual path (\`manualPath\`).

Stop is built in — an active task always carries its escape.`,
  },
  OutcomePanel: {
    category: 'Activity and outcome',
    summary: 'CMP-006. The result, with its evidence level.',
    body: `The \`outcome\` enum drives the icon, the heading and the language together, so a prepared handoff never reads as a completed send and an unknown effect never reads as a success.

| outcome | when |
|---|---|
| \`verified-complete\` | an independent read-back confirmed the postcondition |
| \`prepared\` | ready for the person to finish; nothing was dispatched |
| \`partial\` | some of the work landed |
| \`unknown\` | dispatched, effect unconfirmed |
| \`interrupted\` | stopped, with the actual effect stated |
| \`cancelled\` | never dispatched |
| \`safely-failed\` | failed with no effect |

\`evidence\` is required. A result without an evidence level is not a result.

Offer \`onRetry\` only when the executor marked the action safe to repeat, and \`onUndo\` only when the adapter defines a reversible postcondition. Dismissing or repeating this panel cannot re-execute anything.

There is no success toast in this system.`,
  },

  // -------------------------------------------------------------------- Choice
  ChoiceList: {
    category: 'Choice',
    summary: 'CMP-005. Up to five options, each with a differentiator.',
    body: `The whole row is one target. Selection is carried by a check mark, a spoken selected state and the row boundary together — the tinted fill is the faintest of the three and never the only signal.

\`differentiator\` is required, not decorative: two people share a name, and a list of identical-looking options is not a choice.

Use a stable entity \`id\`, never the display name. "None of these" and Cancel are always present. Beyond five options, "More results" is an explicit control — never an automatic carousel.`,
  },

  // --------------------------------------------------------------------- Forms
  Button: {
    category: 'Buttons and form controls',
    summary: 'CMP-007. One primary next action per decision region.',
    body: `\`primary\` is the single next action in a region. \`secondary\` is an equally reachable alternative. \`danger\` is deletion and removal **only**.

Sending a message is \`primary\` with exact wording — it is not \`danger\`.

Whenever \`disabled\` is set, set \`disabledReason\`. It renders beside the control at full supporting contrast, never in the dimmed label colour. A control that is off without a stated reason is off-specification.

\`loading\` keeps the label and freezes against duplicate submission; \`loadingNote\` names what is being waited on.

Do not use this component to approve a consequential action — that is \`ConsequencePreview\`.`,
  },
  TextField: {
    category: 'Buttons and form controls',
    summary: 'CMP-007. Text input with a persistent label.',
    body: `The label is always visible. A placeholder never stands in for it.

Nothing submits from incidental focus: Enter inserts a newline in the multiline case and does nothing in the single-line case. A consequential action is committed only by its own dedicated control.

\`error\` renders as an icon plus a sentence. The border colour never carries the error alone.`,
  },
  SettingSwitch: {
    category: 'Buttons and form controls',
    summary: 'CMP-007. On/off setting, with the state written as a word.',
    body: `The word On or Off sits next to the track, so the setting is readable without interpreting a colour or a knob position.

\`scope\` says what the switch actually governs — what changes and what does not.`,
  },
  StepperControl: {
    category: 'Buttons and form controls',
    summary: 'CMP-007. Stepped value with minus/plus and a spoken current value.',
    body: `Dragging is never the only way to change a value. Minus and plus are ordinary 56dp buttons and the current value is stated in words.

Use \`preview\` wherever the change affects reading, and \`onRestore\` wherever it changes layout.`,
  },

  // ------------------------------------------------------------------ Guidance
  GuidanceNote: {
    category: 'Guidance and disclosure',
    summary: 'CMP-008. Inline explanation for a recoverable obstacle.',
    body: `Describes the current state and the way forward. It never tells the person they did something wrong, and never asks them to remember a step they cannot see.

Use \`tone="warning"\` only where there is a consequence to weigh — not for ordinary obstacles.`,
  },
  DisclosurePanel: {
    category: 'Guidance and disclosure',
    summary: 'CMP-008. Permission and data disclosure: data, purpose, destination, decline effect.',
    body: `All four facts, every time. "Stays on this tablet" is a destination and is stated as plainly as a remote one.

The handoff control never claims a grant has happened — it only opens the OS screen, and the actual permission is re-read on return.

This panel deliberately looks like Granny. Do not imitate an Android system dialog's visuals to borrow its authority.`,
  },

  // --------------------------------------------------------------------- Lists
  ContentRow: {
    category: 'Lists, media and settings',
    summary: 'CMP-009. A content or history row.',
    body: `A row is either a target or it is not. Omit \`onOpen\` for a read-only row rather than rendering an ambiguously tappable surface.

History rows carry a label and a date and never a message body.`,
  },
  SettingsRow: {
    category: 'Lists, media and settings',
    summary: 'CMP-009. A setting with its current value visible on the row.',
    body: `The current value is on the row, so nothing has to be opened to find out what a setting is set to.

Set \`appliesImmediately={false}\` wherever the change alters layout; those settings preview before applying and offer a way back.`,
  },
  MediaRow: {
    category: 'Lists, media and settings',
    summary: 'CMP-009. Media with labelled transport controls.',
    body: `Controls are labelled words, not bare glyphs. The playing app is named, not implied. Nothing autoplays because the row appeared.`,
  },
};

let count = 0;
for (const [name, d] of Object.entries(DOCS)) {
  const md = `---
category: ${d.category}
---

# ${name}

${d.summary}

${d.body}

${HOUSE_RULES}
`;
  writeFileSync(join(outDir, `${name}.md`), md);
  count++;
}

console.log(`wrote ${count} component docs to ${outDir}`);
