import * as React from 'react';
import { ColorFoundation } from '@granny/design-system';

/** Open Day roles with the full measured-contrast table. */
export const OpenDay = () => <ColorFoundation theme="open-day" />;

/** Bright Signal, identical roles and identical measurements. */
export const BrightSignal = () => <ColorFoundation theme="bright-signal" />;

/** Swatches alone, for scanning the palette without the evidence table. */
export const SwatchesOnly = () => <ColorFoundation theme="open-day" showContrast={false} />;
