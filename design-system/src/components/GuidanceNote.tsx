import * as React from 'react';
import { Icon } from '../Icon';

export interface GuidanceNoteProps {
  /** What is in the way, described as a state rather than a user error. */
  message: string;
  /** Tone: an ordinary obstacle, or one with a consequence to weigh. */
  tone?: 'informational' | 'warning';
  /** The recovery action's label. */
  actionLabel?: string;
  onAction?: () => void;
  /** A second, equally reachable way forward. */
  secondaryLabel?: string;
  onSecondary?: () => void;
}

/**
 * CMP-008 inline guidance.
 *
 * Used for recoverable obstacles that do not need a full-screen decision. The
 * wording describes the current state and the way forward; it never tells the
 * person they did something wrong, and it never asks them to remember a step
 * they cannot see.
 */
export function GuidanceNote({
  message,
  tone = 'informational',
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: GuidanceNoteProps) {
  return (
    <div className={`ds-guidance${tone === 'warning' ? ' ds-guidance--warning' : ''}`}>
      <p className="ds-preview-effect">
        <Icon name={tone === 'warning' ? 'alert' : 'info'} />
        <span>{message}</span>
      </p>
      {actionLabel || secondaryLabel ? (
        <div className="ds-actions">
          {actionLabel ? (
            <button type="button" className="ds-button ds-button--primary" onClick={onAction}>
              <span>{actionLabel}</span>
            </button>
          ) : null}
          {secondaryLabel ? (
            <button type="button" className="ds-button ds-button--secondary" onClick={onSecondary}>
              <span>{secondaryLabel}</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
