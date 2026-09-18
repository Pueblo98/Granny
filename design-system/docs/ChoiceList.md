---
category: Choice
---

# ChoiceList

CMP-005. Up to five options, each with a differentiator.

The whole row is one target. Selection is carried by a check mark, a spoken selected state and the row boundary together — the tinted fill is the faintest of the three and never the only signal.

`differentiator` is required, not decorative: two people share a name, and a list of identical-looking options is not a choice.

Use a stable entity `id`, never the display name. "None of these" and Cancel are always present. Beyond five options, "More results" is an explicit control — never an automatic carousel.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
