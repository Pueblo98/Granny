import * as React from 'react';
import { ActivityStatus } from '@granny/design-system';

/** Running: last verified step, then the current one. No percentage. */
export const Running = () => (
  <ActivityStatus
    goal="Looking for Sophie's photos from yesterday in Messages."
    steps={[
      { label: 'Opened Messages', state: 'verified' },
      { label: 'Found the conversation with Sophie', state: 'verified' },
      { label: 'Reading yesterday’s messages', state: 'current' },
    ]}
  />
);

/** After roughly five seconds, the awaited dependency is named. */
export const Waiting = () => (
  <ActivityStatus
    goal="Looking for Sophie's photos from yesterday in Messages."
    steps={[
      { label: 'Opened Messages', state: 'verified' },
      { label: 'Waiting for the conversation to load', state: 'current' },
    ]}
    waitingOn="Messages is still loading the conversation."
  />
);

/** After roughly fifteen seconds, the manual path is exposed. */
export const ManualPathOffered = () => (
  <ActivityStatus
    goal="Looking for Sophie's photos from yesterday in Messages."
    steps={[
      { label: 'Opened Messages', state: 'verified' },
      { label: 'Waiting for the conversation to load', state: 'current' },
    ]}
    waitingOn="Messages is taking longer than usual."
    manualPath="Open Messages yourself"
  />
);
