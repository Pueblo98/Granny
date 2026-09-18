import * as React from 'react';
import { Transcript } from '@granny/design-system';

/** Provisional recognition, labelled and visibly distinct from committed text. */
export const HeardSoFar = () => <Transcript partial="find sophie's photos from" />;

/** The final text, editable before it is used. */
export const EditableFinal = () => (
  <Transcript final="Find Sophie's photos from yesterday" editable />
);

/** Committed text with the interpretation control. This commits nothing external. */
export const ReadyToUse = () => <Transcript final="Find Sophie's photos from yesterday" />;

/** Partial and final together, during the hand-over between them. */
export const PartialAndFinal = () => (
  <Transcript partial="and send them to" final="Find Sophie's photos from yesterday" editable />
);
