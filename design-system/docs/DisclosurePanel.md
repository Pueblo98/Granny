---
category: Guidance and disclosure
---

# DisclosurePanel

CMP-008. Permission and data disclosure: data, purpose, destination, decline effect.

All four facts, every time. "Stays on this tablet" is a destination and is stated as plainly as a remote one.

The handoff control never claims a grant has happened — it only opens the OS screen, and the actual permission is re-read on return.

This panel deliberately looks like Granny. Do not imitate an Android system dialog's visuals to borrow its authority.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
