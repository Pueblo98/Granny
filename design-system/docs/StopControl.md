---
category: Control and escape
---

# StopControl

CMP-001. The escape from a running task. Never disabled.

Present for the whole of any active task, in a stable position.

There is deliberately **no `disabled` prop**. Stop stays live while loading, while stopping, and while waiting on a model. If you find yourself wanting to disable it, the design is wrong.

`mode="stopping"` appears only while reconciling what already happened, and never implies queued work will continue.

```jsx
<StopControl showTakeOver note="Take over leaves the app open where it is." />
```

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
