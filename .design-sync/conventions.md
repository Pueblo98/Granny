# Building with the Granny design system

Granny is a stock-Android tablet app for independent older adults. Every visual
value here is **proposed** — no palette, typeface, radius or motion value is
accepted. React is a transfer format for design review, not a framework
decision.

## Wrap everything in ThemeProvider

`ThemeProvider` is where the design tokens live. Outside it every `--ds-*`
custom property is undefined, declarations are silently dropped, and components
render unstyled with no error.

```jsx
import { ThemeProvider, ConsequencePreview } from '@granny/design-system';

<ThemeProvider theme="open-day" textScale={1}>
  {/* everything else */}
</ThemeProvider>
```

`theme` is `"open-day"` (the working baseline) or `"bright-signal"` (the
challenger). Role names are identical in both, so switching territory never
requires editing a component. `textScale` is `1 | 1.15 | 1.3 | 1.5`.

## Styling idiom: CSS custom properties and `ds-` classes

There is no utility-class system and no styling props. Use the shipped
`ds-` classes for layout, and read `--ds-*` custom properties for any value of
your own. **Never write a raw colour, size, radius or duration.**

Layout classes: `ds-stack`, `ds-stack-tight`, `ds-stack-loose` (vertical
rhythm), `ds-actions` (a row of action buttons, wrapping, 12dp apart),
`ds-list`, `ds-rule`, `ds-measure` (45–65 character reading width),
`ds-visually-hidden`, `ds-scroll-x` (wide tables scroll inside, not the page).

Type classes: `ds-type-display`, `ds-type-heading`, `ds-type-body-large`,
`ds-type-body`, `ds-type-button`, `ds-type-status`, `ds-type-supporting`.

Token families, all prefixed `--ds-`:

| Family | Examples |
|---|---|
| Surface | `--ds-surface-canvas`, `--ds-surface-panel`, `--ds-surface-selected`, `--ds-surface-pressed`, `--ds-surface-disabled` |
| Text | `--ds-text-primary`, `--ds-text-secondary`, `--ds-text-disabled`, `--ds-text-on-primary`, `--ds-text-on-danger`, `--ds-text-on-accent` |
| Action | `--ds-action-primary`, `--ds-action-primary-hover`, `--ds-action-primary-pressed`, `--ds-action-secondary` |
| Status | `--ds-status-success`, `--ds-status-warning`, `--ds-status-danger` |
| Border and focus | `--ds-border-control`, `--ds-border-subtle`, `--ds-border-disabled`, `--ds-border-selected`, `--ds-focus-ring`, `--ds-focus-ring-width`, `--ds-focus-ring-offset` |
| Space | `--ds-space-1` … `--ds-space-7` (4/8/12/16/24/32/48dp), `--ds-space-inset-nominal`, `--ds-space-gap-primary-targets` |
| Shape | `--ds-radius-small`, `--ds-radius-control`, `--ds-radius-container`, `--ds-radius-dialog` |
| Motion | `--ds-motion-press`, `--ds-motion-state`, `--ds-motion-panel`, `--ds-motion-easing-standard` |
| Targets | `--ds-size-target-min` (56dp), `--ds-size-target-primary` (64dp) |
| Accent | `--ds-accent-decorative` — decorative punctuation only |

## Rules that are not style preferences

These encode accepted safety and accessibility decisions. Breaking one produces
a design that cannot ship.

- **Sending is not danger.** Use `variant="primary"` with exact wording.
  `variant="danger"` is deletion and removal only.
- **Approve consequential actions through `ConsequencePreview`**, never a plain
  `Button`. No autofocus on approval, no countdown, no auto-approval, no
  swipe/double-tap/Enter-to-send, no truncation of recipient or body.
- **`StopControl` is never disabled.** It has no `disabled` prop, deliberately.
- **Action labels name the effect**: "Send to David", not "Confirm"/"OK"/"Yes".
- **A disabled control always states its reason** via `disabledReason`, which
  renders at full supporting contrast — never in the dimmed label colour.
- **State is never colour alone.** Every state also carries a word, an icon or
  a boundary. Switches render the word On or Off.
- **`OutcomePanel` requires `evidence`.** `outcome="verified-complete"` only
  when an independent read-back confirmed it; use `"prepared"`, `"unknown"` or
  `"partial"` honestly. There is no success toast in this system.
- **Labels wrap and controls grow.** Never truncate a label to fit.
- **The accent is never a fill** for a control, a status or a warning surface.
- **Grouping is spacing and rules**, not stacks of raised cards. Avoid AI
  gradients, sparkles, orbs, glass effects and dense button collections — the
  prototype was rejected for exactly that.
- A catalogue is not a layout: show the components the current state needs.

## Where the truth lives

- `styles.css` and its imports — the complete token layer and component CSS.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage rules.
- `guidelines/brand-guide.md` — purpose, voice, do/don't, measured contrast,
  font coverage limits, and what is explicitly out of scope.

## One idiomatic composition

```jsx
<ThemeProvider theme="open-day">
  <div className="ds-stack">
    <h1 className="ds-type-display">Yesterday</h1>
    <p className="ds-type-body ds-measure">
      I found the conversation with Sophie, but no photos for that date.
    </p>
    <div className="ds-actions">
      <Button variant="primary">Change the date</Button>
      <Button variant="secondary">Done</Button>
    </div>
  </div>
</ThemeProvider>
```
