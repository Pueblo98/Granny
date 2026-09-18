---
category: Control and escape
---

# Transcript

CMP-002. Provisional and final recognised text, editable before use.

"Heard so far" is provisional and visibly distinct from the committed text.

"Use this request" commits the *interpretation* only. It never commits an external consequence — that always belongs to `ConsequencePreview` and its own approval control.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
