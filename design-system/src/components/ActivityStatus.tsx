import * as React from 'react';
import { Icon } from '../Icon';
import { StopControl } from './StopControl';

export interface ActivityStep {
  /** What the step did or is doing, in the person's terms. */
  label: string;
  /** `verified` has an independently confirmed postcondition. */
  state: 'verified' | 'current' | 'upcoming';
}

export interface ActivityStatusProps {
  /** The person's goal, restated — not the model's internal plan. */
  goal: string;
  /** Last verified step, then the current safe step. Never a guessed percentage. */
  steps: ActivityStep[];
  /** After ~5s, name what is being waited on. */
  waitingOn?: string;
  /** After ~15s, offer the manual path. */
  manualPath?: string;
  onStop?: () => void;
  onTakeOver?: () => void;
  onManual?: () => void;
}

/**
 * CMP-004 activity and wait status.
 *
 * Shows the goal, the last verified step and the current step. It never shows
 * a chain of thought, a guessed percentage or a simulated progress bar, and it
 * never narrates individual taps.
 *
 * Stop is part of this component, not an optional addition — an active task
 * always carries its escape.
 */
export function ActivityStatus({
  goal,
  steps,
  waitingOn,
  manualPath,
  onStop,
  onTakeOver,
  onManual,
}: ActivityStatusProps) {
  return (
    <div className="ds-activity">
      <p className="ds-activity-goal">{goal}</p>

      <ul className="ds-activity-steps">
        {steps.map((s, i) => (
          <li
            key={i}
            className={`ds-activity-step${s.state === 'verified' ? ' ds-activity-step--verified' : ''}${
              s.state === 'current' ? ' ds-activity-step--current' : ''
            }`}
          >
            {s.state === 'verified' ? (
              <Icon name="check" />
            ) : s.state === 'current' ? (
              <span className="ds-spinner" aria-hidden="true" />
            ) : (
              <Icon name="arrow-right" />
            )}
            <span>{s.label}</span>
            {/* State is carried by the word too, not only by the icon and colour. */}
            <span className="ds-visually-hidden">
              {s.state === 'verified' ? ' (done)' : s.state === 'current' ? ' (in progress)' : ' (not started)'}
            </span>
          </li>
        ))}
      </ul>

      {waitingOn ? (
        <p className="ds-type-supporting" role="status" aria-live="polite">
          {waitingOn}
        </p>
      ) : null}

      {manualPath ? (
        <div className="ds-actions">
          <button type="button" className="ds-button ds-button--secondary" onClick={onManual}>
            <span>{manualPath}</span>
          </button>
        </div>
      ) : null}

      <StopControl showTakeOver onStop={onStop} onTakeOver={onTakeOver} />
    </div>
  );
}
