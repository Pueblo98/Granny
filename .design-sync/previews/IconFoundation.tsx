import * as React from 'react';
import { IconFoundation } from '@granny/design-system';

/** The full set with names. */
export const Set = () => <IconFoundation />;

/** Shapes alone, to judge whether each reads without its caption. */
export const ShapesOnly = () => <IconFoundation withLabels={false} />;
