---
category: Buttons and form controls
---

# SettingSwitch

CMP-007. On/off setting, with the state written as a word.

The word On or Off sits next to the track, so the setting is readable without interpreting a colour or a knob position.

`scope` says what the switch actually governs — what changes and what does not.

## Rules that apply to every component here

- Wrap everything in `<ThemeProvider>`. Outside it the design tokens are undefined and the component renders unstyled.
- Never write a raw colour, size, radius or duration. Use the `--ds-*` custom properties, or a component's own props.
- State is never carried by colour alone. Every state also has a word, an icon or a boundary.
- Action labels name the specific effect. "OK", "Yes", "Confirm" and "Submit" are not labels in this system.
- Targets grow with their label. Nothing truncates an action label to make it fit.
- Every value in this system is **proposed**. No palette, typeface, radius or motion value is accepted.
