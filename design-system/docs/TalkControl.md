---
category: Control and escape
---

# TalkControl

CMP-002. Tap-to-talk capture, with a typed path always available.

No wake word, no ambient listening, no always-listening indicator. The capture state is a word plus an icon, and microphone-off is visibly distinct from a muted speaker.

Every state keeps "Type a request" reachable — no task in this system depends on speech.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
