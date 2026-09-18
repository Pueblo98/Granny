import * as React from 'react';
import { ConsequencePreview } from '@granny/design-system';

/** The canonical POL-03 approval: exact recipient, exact body, exact effect. */
export const AdmittedSend = () => (
  <ConsequencePreview
    target="David Okonjo (mobile, 07700 900461)"
    channel="Messages"
    body="I'll call after dinner."
    effect="This sends a message straight away."
    reversibility="It cannot be unsent once it has gone."
    approveLabel="Send to David"
  />
);

/** Expired: the preview stays readable, approval is replaced by Renew. */
export const Expired = () => (
  <ConsequencePreview
    target="David Okonjo (mobile, 07700 900461)"
    channel="Messages"
    body="I'll call after dinner."
    effect="This sends a message straight away."
    reversibility="It cannot be unsent once it has gone."
    approveLabel="Send to David"
    expired
  />
);

/** Edited since preparation: the digest is invalidated, not silently re-minted. */
export const EditedSincePrepared = () => (
  <ConsequencePreview
    target="David Okonjo (mobile, 07700 900461)"
    channel="Messages"
    body="I'll call after dinner — maybe closer to eight."
    effect="This sends a message straight away."
    reversibility="It cannot be unsent once it has gone."
    approveLabel="Send to David"
    edited
  />
);

/** A handoff, where Granny cannot send and says so. */
export const PreparedHandoff = () => (
  <ConsequencePreview
    target="David Okonjo (mobile, 07700 900461)"
    channel="Messages"
    body="I'll call after dinner."
    effect="This opens the draft in Messages. You'll still need to tap Send there."
    reversibility="Nothing is sent until you tap Send yourself."
    approveLabel="Open this draft"
  />
);

/** A long body and a long recipient, neither of which may be truncated. */
export const LongContent = () => (
  <ConsequencePreview
    target="Dr. Margaret Ellsworth-Whitfield (work, margaret.ellsworth-whitfield@riverside-practice.example)"
    channel="Email"
    body={
      'Dear Dr Ellsworth-Whitfield,\n\n' +
      'Thank you for seeing me on Tuesday. I wanted to confirm that I have collected the new prescription ' +
      'from the pharmacy on Bridge Street, and I have started taking it as you described.\n\n' +
      'I would like to book the follow-up appointment for some time in the second half of next month, if that ' +
      'still suits.\n\nWith thanks,\nRosa'
    }
    effect="This sends an email straight away."
    reversibility="It cannot be recalled once it has gone."
    approveLabel="Send this email"
  />
);
