import * as React from 'react';
import { TextField } from '@granny/design-system';

/** Persistent label, never a placeholder standing in for one. */
export const Enabled = () => (
  <TextField label="Your request" defaultValue="Find Sophie's photos from yesterday" help="You can change this before I start." />
);

/** Error is an icon and a sentence, not a red border on its own. */
export const WithError = () => (
  <TextField
    label="Contact name"
    defaultValue="Sophy"
    error="There is no saved contact by that name. Check the spelling, or choose from your contacts."
  />
);

/** Multi-line, for a draft the person edits before it is previewed. */
export const Multiline = () => (
  <TextField
    label="Message to David"
    multiline
    rows={4}
    defaultValue={"I'll call after dinner."}
    help="Pressing Enter adds a new line. Nothing sends from this field."
  />
);

/** Disabled with its reason in the same region. */
export const DisabledWithReason = () => (
  <TextField
    label="Message to David"
    defaultValue="I'll call after dinner."
    disabled
    disabledReason="I'm waiting for Messages to respond. You can stop at any time."
  />
);
