import * as React from 'react';
import { DisclosurePanel } from '@granny/design-system';

/** A permission request. All four facts, every time. */
export const MicrophonePermission = () => (
  <DisclosurePanel
    title="Granny would like to use the microphone"
    data="What you say while you are holding Talk. Nothing is captured before you press it, or after you press Done listening."
    purpose="To turn your spoken request into text you can read and correct before anything happens."
    destination="Speech is sent to the transcription service and is not kept afterwards. Your messages and photos are not sent."
    declineEffect="Everything still works by typing. You can turn the microphone on later in Settings."
    handoffLabel="Open Android settings"
  />
);

/**
 * A local-only destination. "Stays on this tablet" is a destination and is
 * stated as plainly as a remote one would be.
 */
export const LocalDataOnly = () => (
  <DisclosurePanel
    title="Granny would like to remember a few facts about your contacts"
    data="Names you correct, and who people are to you — for example that Rosa is your daughter."
    purpose="So you don't have to explain the same thing twice."
    destination="Stays on this tablet. It is not uploaded and not shared with anyone who helps you."
    declineEffect="Granny will ask each time instead. Nothing else changes."
    handoffLabel="Turn this on"
  />
);

/** A helper proposal, where the adult's primacy is the point. */
export const HelperProposal = () => (
  <DisclosurePanel
    title="Alice suggests a change to your text size"
    data="Only the text size setting. Alice sees nothing else."
    purpose="Alice thinks the current size may be hard to read."
    destination="Nothing leaves this tablet. Alice cannot see your messages or your screen."
    declineEffect="Your text size stays exactly as it is, and Alice is not told why."
    handoffLabel="Approve this change"
  />
);
