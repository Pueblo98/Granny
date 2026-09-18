import * as React from 'react';
import { ChoiceList } from '@granny/design-system';

const SOPHIES = [
  { id: 'c-1041', name: 'Sophie Adeyemi', differentiator: 'Mobile 07700 900118 — messaged yesterday' },
  { id: 'c-2277', name: 'Sophie Adeyemi', differentiator: 'Work 020 7946 0312 — last messaged in March' },
  { id: 'c-3390', name: 'Sophie Laurent', differentiator: 'Mobile 07700 900884 — saved as "Sophie next door"' },
];

/** Two people share a name; the differentiator is what makes this a choice. */
export const Unselected = () => <ChoiceList question="Which Sophie do you mean?" choices={SOPHIES} />;

/** Selected carries a check, a boundary and a spoken state — not just a tint. */
export const Selected = () => (
  <ChoiceList question="Which Sophie do you mean?" choices={SOPHIES} selectedId="c-1041" />
);

/** More results is an explicit control, never an automatic carousel. */
export const WithMoreResults = () => (
  <ChoiceList question="Which Sophie do you mean?" choices={SOPHIES} hasMore />
);

/** Content choices carry their date and source. */
export const ContentChoices = () => (
  <ChoiceList
    question="Which photos did you mean?"
    choices={[
      { id: 'p-1', name: 'Three photos from the garden', differentiator: 'Sent by Sophie, 16 September' },
      { id: 'p-2', name: 'One photo of the cat', differentiator: 'Sent by Sophie, 16 September' },
      { id: 'p-3', name: 'Five photos from the market', differentiator: 'Sent by Sophie, 11 September' },
    ]}
  />
);

/** Long names wrap; the row grows and the whole row stays one target. */
export const LongNames = () => (
  <div style={{ maxWidth: 360 }}>
    <ChoiceList
      question="Which appointment did you mean?"
      choices={[
        {
          id: 'a-1',
          name: 'Dr. Margaret Ellsworth-Whitfield, Riverside Practice',
          differentiator: 'Tuesday 23 September, 9:40am — follow-up appointment',
        },
        {
          id: 'a-2',
          name: 'Riverside Practice — blood test, nurse clinic',
          differentiator: 'Thursday 25 September, 8:15am',
        },
      ]}
    />
  </div>
);
