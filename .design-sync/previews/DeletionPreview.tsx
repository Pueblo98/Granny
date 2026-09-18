import * as React from 'react';
import { DeletionPreview } from '@granny/design-system';

/** Deletion names categories, never a bare count. */
export const LocalData = () => (
  <DeletionPreview
    categories={[
      { name: 'Saved contact aliases', detail: '4 saved names, including "Sophie" and "the doctor"' },
      { name: 'Request history', detail: '38 entries from the last 30 days — labels and dates only, no message text' },
      { name: 'Reading and speech preferences', detail: 'Text size, speaking speed, reduced motion' },
    ]}
    externalLimits="This removes what is stored on this tablet. Messages you have already sent stay in the apps that hold them, and Granny cannot reach those."
    reversibility="This cannot be undone."
    approveLabel="Delete these three kinds of data"
  />
);

/** A single narrow category. */
export const SingleCategory = () => (
  <DeletionPreview
    categories={[{ name: 'Saved contact aliases', detail: '4 saved names' }]}
    externalLimits="Your contacts in Android are not changed."
    reversibility="This cannot be undone."
    approveLabel="Delete these 4 saved aliases"
  />
);
