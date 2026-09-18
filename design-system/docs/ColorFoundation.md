---
category: Foundations
---

# ColorFoundation

Semantic colour roles with their measured contrast.

A review sheet, not a building block. Renders every colour role for a theme and the measured contrast for each pair the components actually use. Ratios come from the generated contrast report, so the sheet cannot display a number that was not computed.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
