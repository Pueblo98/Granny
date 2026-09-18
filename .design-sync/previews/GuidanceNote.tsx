import * as React from 'react';
import { GuidanceNote } from '@granny/design-system';

/** A recoverable obstacle, described as a state rather than a user error. */
export const Informational = () => (
  <GuidanceNote
    message="This app is asking you to sign in. I'll stop reading the screen while you do that."
    actionLabel="Open the app yourself"
    secondaryLabel="Home"
  />
);

/** A consequence worth weighing before continuing. */
export const Warning = () => (
  <GuidanceNote
    tone="warning"
    message="Opening this conversation will mark it as read for the other person."
    actionLabel="Open it anyway"
    secondaryLabel="Leave it unread"
  />
);

/** No action offered — sometimes the state is simply worth knowing. */
export const StatementOnly = () => (
  <GuidanceNote message="The connection is unavailable. You can still change Granny's settings or use the tablet yourself." />
);

/** A restricted request, explained without lecturing. */
export const Restricted = () => (
  <GuidanceNote
    tone="warning"
    message="I can't make payments for you. You can open your banking app yourself."
    actionLabel="Home"
  />
);
