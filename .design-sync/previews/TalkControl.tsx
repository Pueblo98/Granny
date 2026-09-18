import * as React from 'react';
import { TalkControl } from '@granny/design-system';

/** Resting. Talk and Type are both offered — speech is never required. */
export const Idle = () => <TalkControl />;

/** Capturing. The word Listening carries the state, not only the icon. */
export const Listening = () => <TalkControl state="listening" />;

/** The gentle prompt after roughly ten seconds of silence. */
export const NoSpeechYet = () => <TalkControl state="no-speech" />;

/** Microphone denied or broken — distinct from a muted speaker. */
export const Unavailable = () => (
  <TalkControl
    state="unavailable"
    unavailableReason="You can still type requests. You can enable the microphone later in Settings."
  />
);
