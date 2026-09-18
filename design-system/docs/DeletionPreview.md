---
category: Consequence
---

# DeletionPreview

CMP-003. Removal of local data, with categories named.

The one place the destructive role is used as a fill. The colour is always accompanied by the word and the icon, so the consequence survives a greyscale reading.

Name the categories. A bare count ("delete 12 items") is not an exact preview and does not satisfy CMP-003. State plainly what the deletion cannot reach — copies already held by other services.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
