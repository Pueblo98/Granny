---
category: Buttons and form controls
---

# StepperControl

CMP-007. Stepped value with minus/plus and a spoken current value.

Dragging is never the only way to change a value. Minus and plus are ordinary 56dp buttons and the current value is stated in words.

Use `preview` wherever the change affects reading, and `onRestore` wherever it changes layout.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
