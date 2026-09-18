---
category: Composition
---

# RegistrySheet

The ADR-0013 composition registry, with live fail-closed validator output.

A review sheet for the bounded-composition boundary.

The agent may select registered components, variants, typed slots and allowed action references. It may not create controls, define behaviour, rename a consequence, or move the renderer-owned anchors (Stop, the Talk/Type input, the current task status).

The rejection examples on this sheet are produced by `validateCompositionPlan` at render time — real output, not a table of intentions.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
