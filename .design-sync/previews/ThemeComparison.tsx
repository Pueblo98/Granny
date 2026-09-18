import * as React from 'react';
import { ThemeComparison } from '@granny/design-system';

/** Both territories on the identical specimen, side by side. */
export const SideBySide = () => <ThemeComparison />;

/** Stacked, for a narrow review width. */
export const Stacked = () => <ThemeComparison sideBySide={false} />;
