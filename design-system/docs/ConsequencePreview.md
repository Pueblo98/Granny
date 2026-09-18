---
category: Consequence
---

# ConsequencePreview

CMP-003. The component a consequential (POL-03) action is approved through.

Use this for anything that leaves the tablet: sending, sharing, purchasing, changing an account. Never approve such an action through a plain `Button`.

Reading order is effect → target and content → controls, so the consequence is read before the buttons are reached.

What this component deliberately does **not** support, each a requirement rather than a gap:

- no autofocus on approval and no preselected control;
- no countdown, timer or auto-approval;
- no swipe, double-tap or Enter-to-send shortcut;
- no truncation of the recipient or the body, at any text size.

`approveLabel` must name the effect: `"Send to David"`, not `"Confirm"`.

Sending is **not** danger. Use the primary role with exact wording; `DeletionPreview` owns the destructive role.

```jsx
<ConsequencePreview
  target="David Okonjo (mobile, 07700 900461)"
  channel="Messages"
  body="I'll call after dinner."
  effect="This sends a message straight away."
  reversibility="It cannot be unsent once it has gone."
  approveLabel="Send to David"
/>
```

Rendering this grants nothing. Approval is enforced by local policy against a single-use permit; the UI only collects the touch.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
