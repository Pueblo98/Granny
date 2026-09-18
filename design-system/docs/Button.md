---
category: Buttons and form controls
---

# Button

CMP-007. One primary next action per decision region.

`primary` is the single next action in a region. `secondary` is an equally reachable alternative. `danger` is deletion and removal **only**.

Sending a message is `primary` with exact wording — it is not `danger`.

Whenever `disabled` is set, set `disabledReason`. It renders beside the control at full supporting contrast, never in the dimmed label colour. A control that is off without a stated reason is off-specification.

`loading` keeps the label and freezes against duplicate submission; `loadingNote` names what is being waited on.

Do not use this component to approve a consequential action — that is `ConsequencePreview`.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
