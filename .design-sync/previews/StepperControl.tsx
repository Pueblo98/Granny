import * as React from 'react';
import { StepperControl } from '@granny/design-system';

const TEXT_SCALE = [
  { value: 1, label: 'Standard' },
  { value: 1.15, label: 'Larger' },
  { value: 1.3, label: 'Larger still' },
  { value: 1.5, label: 'Largest' },
];

/** Text size, with a live preview and a way back to the previous value. */
export const TextScale = () => (
  <StepperControl
    label="Text size in Granny"
    options={TEXT_SCALE}
    defaultIndex={1}
    preview={<p className="ds-type-body">The tablet app you can ask.</p>}
    onRestore={() => {}}
  />
);

/** Speech rate. The person previews the voice before saving. */
export const SpeechRate = () => (
  <StepperControl
    label="Speaking speed"
    options={[
      { value: 0.75, label: 'Slower' },
      { value: 1, label: 'Normal' },
      { value: 1.25, label: 'Faster' },
      { value: 1.5, label: 'Fastest' },
    ]}
    defaultIndex={1}
    preview={<p className="ds-type-supporting">Play a sample before saving this.</p>}
  />
);

/** At the end of the range, minus and plus stay visible rather than vanishing. */
export const AtMaximum = () => (
  <StepperControl label="Text size in Granny" options={TEXT_SCALE} defaultIndex={3} onRestore={() => {}} />
);
