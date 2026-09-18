import * as React from 'react';
import { SettingSwitch } from '@granny/design-system';

/** On and Off are words, so the state survives a greyscale reading. */
export const OnAndOff = () => (
  <div className="ds-stack">
    <SettingSwitch
      label="Read private messages aloud"
      scope="Only affects what Granny speaks. It does not change what is shown on screen."
      defaultChecked={false}
    />
    <SettingSwitch
      label="Reduce motion"
      scope="Replaces every transition with an immediate change."
      defaultChecked
    />
  </div>
);

/** Disabled states why, and the reason keeps full supporting contrast. */
export const DisabledWithReason = () => (
  <SettingSwitch
    label="Use the microphone"
    scope="Lets you speak your requests instead of typing them."
    disabled
    disabledReason="Android has not granted microphone access. You can change that in Settings."
  />
);

/** A long label wraps and the row grows rather than squeezing the control. */
export const LongLabel = () => (
  <div style={{ maxWidth: 380 }}>
    <SettingSwitch
      label="Let Alice suggest changes to your text size and reading settings"
      scope="Alice can propose a change. You approve or reject each one. She cannot see your messages or your screen."
      defaultChecked={false}
    />
  </div>
);
