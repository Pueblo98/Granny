import * as React from 'react';
import { Icon, type IconName } from '../Icon';

export type Outcome =
  | 'verified-complete'
  | 'prepared'
  | 'partial'
  | 'unknown'
  | 'interrupted'
  | 'cancelled'
  | 'safely-failed';

export interface OutcomePanelProps {
  /**
   * The outcome enum. This drives the icon, the heading tone and the language
   * — it is not a free-text status, and "verified-complete" may only be used
   * when an independent read-back confirmed the postcondition.
   */
  outcome: Outcome;
  /** The outcome sentence, in the voice contract's terms. */
  message: string;
  /**
   * How the outcome is known: "the app reports…", "I could not verify…".
   * Always shown — a result without an evidence level is not a result.
   */
  evidence: string;
  /** Offered only when the executor marked the action safe to repeat. */
  onRetry?: () => void;
  /** Offered when a consequence is uncertain. */
  onReviewStatus?: () => void;
  /** Offered only when the adapter defines a reversible postcondition. */
  onUndo?: () => void;
  onDone?: () => void;
  /** Label for the manual continuation path, when one applies. */
  manualLabel?: string;
  onManual?: () => void;
}

const PRESENTATION: Record<
  Outcome,
  { icon: IconName; tone: 'complete' | 'unknown' | 'failed' | 'neutral'; heading: string }
> = {
  'verified-complete': { icon: 'check', tone: 'complete', heading: 'Done' },
  prepared: { icon: 'arrow-right', tone: 'neutral', heading: 'Ready for you' },
  partial: { icon: 'alert', tone: 'unknown', heading: 'Partly done' },
  unknown: { icon: 'question', tone: 'unknown', heading: 'I can’t confirm this' },
  interrupted: { icon: 'stop', tone: 'unknown', heading: 'I stopped' },
  cancelled: { icon: 'cancel', tone: 'neutral', heading: 'Cancelled' },
  'safely-failed': { icon: 'alert', tone: 'failed', heading: 'That didn’t work' },
};

/**
 * CMP-006 outcome and recovery.
 *
 * The outcome enum controls the icon, the heading and the language together,
 * so a prepared handoff never reads as a completed send and an unknown effect
 * never reads as a success. Dismissing or repeating this panel cannot
 * re-execute anything.
 *
 * There is no success toast in this system — a result is a persistent panel
 * the person can read at their own pace.
 */
export function OutcomePanel({
  outcome,
  message,
  evidence,
  onRetry,
  onReviewStatus,
  onUndo,
  onDone,
  manualLabel,
  onManual,
}: OutcomePanelProps) {
  const p = PRESENTATION[outcome];
  const headingId = React.useId();

  return (
    <section className={`ds-outcome ds-outcome--${outcome.replace('verified-', '').replace('safely-', '')}`} aria-labelledby={headingId}>
      <div className="ds-outcome-head">
        <span className={`ds-outcome-icon ds-outcome-icon--${p.tone}`}>
          <Icon name={p.icon} size="1.4em" />
        </span>
        <div>
          <h3 className="ds-outcome-heading" id={headingId}>
            {p.heading}
          </h3>
          <p className="ds-type-body ds-measure" style={{ marginTop: 'var(--ds-space-2)' }}>
            {message}
          </p>
        </div>
      </div>

      <p className="ds-outcome-evidence">
        <span className="ds-status-proposed">Evidence</span>
        <span>{evidence}</span>
      </p>

      <div className="ds-actions">
        {onRetry ? (
          <button type="button" className="ds-button ds-button--primary" onClick={onRetry}>
            <span>Try again</span>
          </button>
        ) : null}
        {onReviewStatus ? (
          <button type="button" className="ds-button ds-button--primary" onClick={onReviewStatus}>
            <span>Review status</span>
          </button>
        ) : null}
        {onUndo ? (
          <button type="button" className="ds-button ds-button--secondary" onClick={onUndo}>
            <span>Undo</span>
          </button>
        ) : null}
        {manualLabel ? (
          <button type="button" className="ds-button ds-button--secondary" onClick={onManual}>
            <span>{manualLabel}</span>
          </button>
        ) : null}
        {onDone ? (
          <button type="button" className="ds-button ds-button--secondary" onClick={onDone}>
            <span>Done</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}
