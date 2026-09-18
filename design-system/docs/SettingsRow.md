---
category: Lists, media and settings
---

# SettingsRow

CMP-009. A setting with its current value visible on the row.

The current value is on the row, so nothing has to be opened to find out what a setting is set to.

Set `appliesImmediately={false}` wherever the change alters layout; those settings preview before applying and offer a way back.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
