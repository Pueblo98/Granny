---
category: Activity and outcome
---

# ActivityStatus

CMP-004. Goal, last verified step, current step — and Stop.

Shows the person's goal in their terms, the last independently verified step and the current one.

Never a chain of thought, never a guessed percentage, never a simulated progress bar, and never a narration of individual taps.

At roughly 5s name what is being waited on (`waitingOn`); at roughly 15s expose the manual path (`manualPath`).

Stop is built in — an active task always carries its escape.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
