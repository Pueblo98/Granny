import * as React from 'react';
import { Icon, type IconName } from '../Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps {
  /** The action label. Always a specific verb phrase — never "OK" or "Yes". */
  children: React.ReactNode;
  /**
   * `primary` is the one next action in a decision region. `secondary` is an
   * equally reachable alternative. `danger` is deletion and removal only —
   * sending a message is NOT danger, it is `primary` with exact wording.
   * @default "primary"
   */
  variant?: ButtonVariant;
  /** Optional leading icon. The visible label is never replaced by it. */
  icon?: IconName;
  /**
   * Disable the control. Whenever this is true, `disabledReason` must say why
   * in the same region — a control that is off without a reason is off-spec.
   */
  disabled?: boolean;
  /**
   * Why the control is unavailable, rendered beside it at full supporting
   * contrast (never in the dimmed label colour).
   */
  disabledReason?: string;
  /**
   * Freeze against duplicate submission while an action is in flight. The
   * label stays; `loadingNote` explains the wait.
   */
  loading?: boolean;
  /** What is being waited on. Shown while `loading`. */
  loadingNote?: string;
  /** Render the pressed fill statically, for reviewing the state. */
  pressed?: boolean;
  /** Grow to the full width of the decision region. */
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

/**
 * CMP-007 action control.
 *
 * One primary next action per decision region. The label wraps and the control
 * grows; it never truncates or shrinks below the 56dp floor (64dp for primary
 * and destructive actions).
 */
export function Button({
  children,
  variant = 'primary',
  icon,
  disabled = false,
  disabledReason,
  loading = false,
  loadingNote,
  pressed = false,
  fullWidth = false,
  onClick,
  type = 'button',
}: ButtonProps) {
  const reasonId = React.useId();
  const isOff = disabled || loading;
  return (
    <div className="ds-button-group" style={fullWidth ? { width: '100%' } : undefined}>
      <button
        type={type}
        className={`ds-button ds-button--${variant}`}
        disabled={disabled}
        aria-disabled={isOff || undefined}
        data-state={pressed ? 'pressed' : undefined}
        data-loading={loading || undefined}
        aria-describedby={disabled && disabledReason ? reasonId : undefined}
        onClick={loading ? undefined : onClick}
        style={fullWidth ? { width: '100%' } : undefined}
      >
        {loading ? <span className="ds-spinner" aria-hidden="true" /> : icon ? <Icon name={icon} /> : null}
        <span>{children}</span>
      </button>
      {disabled && disabledReason ? (
        <p className="ds-button-reason" id={reasonId}>
          {disabledReason}
        </p>
      ) : null}
      {loading && loadingNote ? (
        <p className="ds-button-reason" role="status">
          {loadingNote}
        </p>
      ) : null}
    </div>
  );
}
