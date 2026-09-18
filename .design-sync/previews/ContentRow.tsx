import * as React from 'react';
import { ContentRow } from '@granny/design-system';

/** Actionable rows carry a chevron and are one target each. */
export const Actionable = () => (
  <div className="ds-list">
    <ContentRow label="Three photos from the garden" detail="Sent by Sophie, 16 September" icon="play" onOpen={() => {}} />
    <ContentRow label="One photo of the cat" detail="Sent by Sophie, 16 September" onOpen={() => {}} />
  </div>
);

/** Read-only rows are visibly not targets — no chevron, no press state. */
export const ReadOnly = () => (
  <div className="ds-list">
    <ContentRow label="Messages" detail="Connected" />
    <ContentRow label="Photos" detail="Not set up yet" />
  </div>
);

/** History rows carry a label and a date, and never a message body. */
export const HistoryRows = () => (
  <div className="ds-list">
    <ContentRow label="Sent a message to David" detail="Yesterday, 6:42pm — delivered" onOpen={() => {}} />
    <ContentRow label="Looked for photos from Sophie" detail="Yesterday, 6:31pm — nothing found for that date" onOpen={() => {}} />
    <ContentRow label="Changed text size" detail="14 September — from Standard to Larger" onOpen={() => {}} />
  </div>
);
