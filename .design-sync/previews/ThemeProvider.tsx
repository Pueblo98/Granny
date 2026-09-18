import * as React from 'react';
import { ThemeProvider, ConsequencePreview } from '@granny/design-system';

const Specimen = () => (
  <ConsequencePreview
    target="David Okonjo (mobile, 07700 900461)"
    channel="Messages"
    body="I'll call after dinner."
    effect="This sends a message straight away."
    reversibility="It cannot be unsent once it has gone."
    approveLabel="Send to David"
  />
);

/** The working baseline. Every component must be rendered inside this. */
export const OpenDay = () => (
  <ThemeProvider theme="open-day">
    <Specimen />
  </ThemeProvider>
);

/** The challenger territory, identical markup. */
export const BrightSignal = () => (
  <ThemeProvider theme="bright-signal">
    <Specimen />
  </ThemeProvider>
);

/** Largest in-app text scale, on top of whatever the OS already applied. */
export const LargestTextScale = () => (
  <ThemeProvider theme="open-day" textScale={1.5}>
    <Specimen />
  </ThemeProvider>
);

/** Reduced motion forced on, for reviewing the static equivalents. */
export const ReducedMotion = () => (
  <ThemeProvider theme="open-day" forceReducedMotion>
    <Specimen />
  </ThemeProvider>
);
