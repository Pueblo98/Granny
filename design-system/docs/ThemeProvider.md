---
category: Foundations
---

# ThemeProvider

Root wrapper that supplies the theme, the text scale and the reduced-motion presentation.

Every Granny screen and every specimen starts here. It sets `data-ds-theme`, which the token layer switches on, and `--ds-text-scale`, which every type role multiplies by.

`theme` chooses between the two candidate territories. `open-day` is the working review baseline; `bright-signal` is the challenger. Neither is accepted, and the role names are identical in both — swapping the territory never requires editing a component.

`textScale` is the in-app setting (1, 1.15, 1.3, 1.5). It multiplies on top of whatever the operating system already applied; the system scale is never overridden downward.

```jsx
<ThemeProvider theme="open-day" textScale={1.3}>
  <ConsequencePreview … />
</ThemeProvider>
```

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
