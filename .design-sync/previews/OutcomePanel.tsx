import * as React from 'react';
import { OutcomePanel } from '@granny/design-system';

/** Verified: an independent read-back confirmed the postcondition. */
export const VerifiedComplete = () => (
  <OutcomePanel
    outcome="verified-complete"
    message="The app reports the message sent to David."
    evidence="Messages returned a delivery receipt for this conversation."
    onDone={() => {}}
  />
);

/** Prepared is not sent. The wording never borrows the success language. */
export const Prepared = () => (
  <OutcomePanel
    outcome="prepared"
    message="The draft is open. Review it there and tap Send."
    evidence="I opened the draft; I can't send it for you."
    manualLabel="Continue manually"
    onDone={() => {}}
  />
);

/** The honest unknown — the outcome this system exists to be able to say. */
export const Unknown = () => (
  <OutcomePanel
    outcome="unknown"
    message="I can't confirm whether it sent. Check the conversation before trying again."
    evidence="Messages did not report a result, so I have nothing to go on."
    onReviewStatus={() => {}}
  />
);

/** Interrupted by Stop, stating precisely what had already happened. */
export const Interrupted = () => (
  <OutcomePanel
    outcome="interrupted"
    message="I stopped. The draft was saved but nothing was sent."
    evidence="I read the draft back from Messages after stopping."
    manualLabel="Continue manually"
    onDone={() => {}}
  />
);

/** A safe failure, with a retry the executor actually marked safe. */
export const SafelyFailed = () => (
  <OutcomePanel
    outcome="safely-failed"
    message="I couldn't reach Messages, so nothing was sent or changed."
    evidence="The app did not respond. No action was dispatched."
    onRetry={() => {}}
    onDone={() => {}}
  />
);

/** Partial, where some of the work landed and the rest did not. */
export const Partial = () => (
  <OutcomePanel
    outcome="partial"
    message="I found the conversation with Sophie, but no photos from that date."
    evidence="I read the conversation; the date filter returned nothing."
    manualLabel="Change date"
    onDone={() => {}}
  />
);
