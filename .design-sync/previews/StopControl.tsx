import * as React from 'react';
import { StopControl } from '@granny/design-system';

/** The resting state during an active task. */
export const Stop = () => <StopControl note="This ends the task. I'll tell you what had already happened." />;

/** Stop beside Take over, which preserves the external screen. */
export const WithTakeOver = () => (
  <StopControl showTakeOver note="Take over leaves the app open where it is." />
);

/**
 * Shown only while reconciling what already happened. Note that the control is
 * still live — Stop has no disabled state anywhere in this system.
 */
export const Stopping = () => (
  <StopControl mode="stopping" note="Working out what had already happened before you stopped me." />
);

/** Cancel exits a preview or an input without ending the task. */
export const Cancel = () => <StopControl mode="cancel" />;
