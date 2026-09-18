---
category: Activity and outcome
---

# OutcomePanel

CMP-006. The result, with its evidence level.

The `outcome` enum drives the icon, the heading and the language together, so a prepared handoff never reads as a completed send and an unknown effect never reads as a success.

| outcome | when |
|---|---|
| `verified-complete` | an independent read-back confirmed the postcondition |
| `prepared` | ready for the person to finish; nothing was dispatched |
| `partial` | some of the work landed |
| `unknown` | dispatched, effect unconfirmed |
| `interrupted` | stopped, with the actual effect stated |
| `cancelled` | never dispatched |
| `safely-failed` | failed with no effect |

`evidence` is required. A result without an evidence level is not a result.

Offer `onRetry` only when the executor marked the action safe to repeat, and `onUndo` only when the adapter defines a reversible postcondition. Dismissing or repeating this panel cannot re-execute anything.

There is no success toast in this system.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
