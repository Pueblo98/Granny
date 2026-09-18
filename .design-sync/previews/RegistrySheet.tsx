import * as React from 'react';
import { RegistrySheet } from '@granny/design-system';

/**
 * The five plans that must never render, with the real output of
 * `validateCompositionPlan` beneath each — not a table of intentions.
 */
export const FailClosedChecks = () => <RegistrySheet showSchema={false} />;

/** What a composition plan may reference: schema, variants, typed slots, actions. */
export const Schema = () => <RegistrySheet showRejections={false} />;
