import * as React from 'react';
import { SpacingFoundation, Button, ContentRow } from '@granny/design-system';

/** The 4dp step scale and the layout rules that consume it. */
export const Scale = () => <SpacingFoundation />;

/**
 * The same rules applied to a real composition: 24dp inset, 12dp between
 * distinct primary targets, a rule instead of a card to separate the groups.
 *
 * (The scale itself is theme-independent — only shape differs between the two
 * territories — so this cell varies the composition rather than the theme.)
 */
export const AppliedToAComposition = () => (
  <div className="ds-stack">
    <p className="ds-type-heading">Yesterday</p>
    <div className="ds-list">
      <ContentRow label="Sent a message to David" detail="6:42pm — delivered" onOpen={() => {}} />
      <ContentRow label="Looked for photos from Sophie" detail="6:31pm — nothing found for that date" onOpen={() => {}} />
    </div>
    <hr className="ds-rule" />
    <div className="ds-actions">
      <Button variant="primary">Ask for something</Button>
      <Button variant="secondary">See everything</Button>
    </div>
  </div>
);
