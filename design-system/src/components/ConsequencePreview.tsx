import * as React from 'react';
import { Icon } from '../Icon';

export interface ConsequencePreviewProps {
  /** Who or what receives the effect. Rendered in full — never abbreviated. */
  target: string;
  /** Which app or channel carries it. */
  channel: string;
  /** The exact body being approved, character for character. */
  body: string;
  /** What will happen, in plain words. Read before any control. */
  effect: string;
  /** Whether it can be undone, and by what. State "cannot be undone" plainly. */
  reversibility: string;
  /**
   * The approval label. Must name the specific effect — "Send to David", not
   * "OK", "Yes" or "Confirm".
   */
  approveLabel: string;
  /**
   * The approval has expired. The preview stays readable; approval is replaced
   * by "Renew preview" rather than silently re-minted.
   */
  expired?: boolean;
  /** Draft was edited since approval was prepared; the digest is invalidated. */
  edited?: boolean;
  onApprove?: () => void;
  onChange?: () => void;
  onCancel?: () => void;
  onRenew?: () => void;
}

/**
 * CMP-003 consequence preview — the component a POL-03 action is approved
 * through.
 *
 * Deliberate omissions, each of which is a requirement rather than an
 * oversight:
 *
 *   - no `autoFocus` on approval, and no preselection of any control;
 *   - no countdown, timer or auto-approval path;
 *   - no swipe, double-tap or Enter-to-send shortcut;
 *   - no truncation of the recipient or the body at any text size.
 *
 * Reading order is effect, then target and content, then controls — so the
 * consequence is read before the buttons are reachable. Change and Cancel sit
 * beside approval at equal size and reachability.
 *
 * Rendering this component grants nothing. Approval is enforced by local
 * policy against a single-use permit; the UI only collects the touch.
 */
export function ConsequencePreview({
  target,
  channel,
  body,
  effect,
  reversibility,
  approveLabel,
  expired = false,
  edited = false,
  onApprove,
  onChange,
  onCancel,
  onRenew,
}: ConsequencePreviewProps) {
  const headingId = React.useId();
  const stale = expired || edited;

  return (
    <section className="ds-preview" aria-labelledby={headingId}>
      {/* Effect first: the consequence is read before anything else. */}
      <p className="ds-preview-effect" id={headingId}>
        <Icon name="info" />
        <span>{effect}</span>
      </p>

      <dl className="ds-preview-facts">
        <dt>To</dt>
        <dd>{target}</dd>
        <dt>Using</dt>
        <dd>{channel}</dd>
        <dt>If you approve</dt>
        <dd>{reversibility}</dd>
      </dl>

      <div>
        <div className="ds-transcript-label" style={{ marginBottom: 'var(--ds-space-2)' }}>
          Exactly this text
        </div>
        <div className="ds-preview-body">{body}</div>
      </div>

      {expired ? (
        <p className="ds-preview-expiry">
          <Icon name="clock" />
          <span>Please review this again before I continue.</span>
        </p>
      ) : null}
      {edited && !expired ? (
        <p className="ds-preview-expiry">
          <Icon name="edit" />
          <span>You changed this since I prepared it. Please review it again.</span>
        </p>
      ) : null}

      <div className="ds-actions">
        {stale ? (
          <button type="button" className="ds-button ds-button--primary" onClick={onRenew}>
            <span>Renew preview</span>
          </button>
        ) : (
          <button type="button" className="ds-button ds-button--primary" onClick={onApprove}>
            <span>{approveLabel}</span>
          </button>
        )}
        <button type="button" className="ds-button ds-button--secondary" onClick={onChange}>
          <span>Change it</span>
        </button>
        <button type="button" className="ds-button ds-button--secondary" onClick={onCancel}>
          <span>Cancel</span>
        </button>
      </div>
    </section>
  );
}
