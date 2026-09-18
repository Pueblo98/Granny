import * as React from 'react';
import { Button } from '@granny/design-system';

/** The three variants. Danger is deletion only — sending is primary. */
export const Variants = () => (
  <div className="ds-actions">
    <Button variant="primary">Send to David</Button>
    <Button variant="secondary">Change it</Button>
    <Button variant="danger" icon="trash">
      Delete these aliases
    </Button>
  </div>
);

/** Pressed fill, rendered statically. Primary darkens; secondary inverts. */
export const Pressed = () => (
  <div className="ds-actions">
    <Button variant="primary" pressed>
      Send to David
    </Button>
    <Button variant="secondary" pressed>
      Change it
    </Button>
  </div>
);

/** Disabled always states its reason, at full supporting contrast. */
export const DisabledWithReason = () => (
  <div className="ds-stack">
    <Button variant="primary" disabled disabledReason="The connection is unavailable, so I can't send anything right now.">
      Send to David
    </Button>
    <Button variant="secondary" disabled disabledReason="There isn't a supported calling app set up on this tablet.">
      Start a call
    </Button>
  </div>
);

/** Loading keeps the label and names what it is waiting on. */
export const Loading = () => (
  <Button variant="primary" loading loadingNote="Waiting for Messages to confirm.">
    Send to David
  </Button>
);

/** A long label wraps and the control grows. Nothing truncates. */
export const LongLabel = () => (
  <div style={{ maxWidth: 320 }}>
    <Button variant="primary" fullWidth>
      Send this message to David Okonjo using Messages
    </Button>
  </div>
);
