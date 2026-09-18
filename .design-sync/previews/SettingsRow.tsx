import * as React from 'react';
import { SettingsRow } from '@granny/design-system';

/** The current value is on the row, so nothing has to be opened to read it. */
export const CurrentValues = () => (
  <div>
    <SettingsRow label="Text size" value="Larger" scope="Affects Granny only, not other apps." appliesImmediately={false} />
    <SettingsRow label="Speaking speed" value="Normal" />
    <SettingsRow label="Microphone" value="Off — Android has not granted access" />
  </div>
);

/** A setting that changes layout warns that it previews first. */
export const PreviewedChange = () => (
  <SettingsRow
    label="Text size"
    value="Largest"
    scope="Affects Granny only, not other apps."
    appliesImmediately={false}
    changeLabel="Change text size"
  />
);
