---
category: Buttons and form controls
---

# TextField

CMP-007. Text input with a persistent label.

The label is always visible. A placeholder never stands in for it.

Nothing submits from incidental focus: Enter inserts a newline in the multiline case and does nothing in the single-line case. A consequential action is committed only by its own dedicated control.

`error` renders as an icon plus a sentence. The border colour never carries the error alone.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
