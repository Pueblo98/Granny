---
category: Foundations
---

# Icon

Stroke icon at 2–2.5dp, sized to the text it sits beside.

Shapes are authored in this repository, so the system carries no third-party icon licence.

Defaults to `1em` so it scales with its text role, including at 200%. Pass `label` only when the icon stands alone — which on an essential action it never should, because every essential action carries a visible word.

```jsx
<button className="ds-button ds-button--primary">
  <Icon name="mic" />
  <span>Talk</span>
</button>
```

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
