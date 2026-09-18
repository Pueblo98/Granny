import * as React from 'react';
import { TypeFoundation } from '@granny/design-system';

/** The scale with the default specimen sentence. */
export const Scale = () => <TypeFoundation />;

/** A longer sentence, to read wrapping and measure rather than a single line. */
export const RunningText = () => (
  <TypeFoundation
    sample="I found the conversation with Sophie, but there are no photos for that date."
    showScales={false}
  />
);
