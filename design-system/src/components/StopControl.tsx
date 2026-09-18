import * as React from 'react';
import { Icon } from '../Icon';

export type StopMode = 'stop' | 'stopping' | 'take-over' | 'cancel';

export interface StopControlProps {
  /**
   * `stop` ends the running task. `stopping` is shown only while the app is
   * reconciling what already happened. `take-over` hands control back to the
   * person while preserving the external screen. `cancel` exits a preview or
   * an input without ending a task.
   * @default "stop"
   */
  mode?: StopMode;
  /** Secondary line explaining what stopping will do right now. */
  note?: string;
  /** Offer "Take over" beside Stop. */
  showTakeOver?: boolean;
  onStop?: () => void;
  onTakeOver?: () => void;
}

const LABELS: Record<StopMode, string> = {
  stop: 'Stop',
  stopping: 'Stopping',
  'take-over': 'Take over',
  cancel: 'Cancel',
};

/**
 * CMP-001 Stop / Cancel / Take over.
 *
 * Stop is never disabled — not while loading, not while stopping, not while
 * waiting on a model. There is no `disabled` prop on this component and that
 * is deliberate: the escape is always reachable by touch, and its position is
 * stable within a layout.
 *
 * "Stopping" appears only during reconciliation and never implies that queued
 * work will continue.
 */
export function StopControl({
  mode = 'stop',
  note,
  showTakeOver = false,
  onStop,
  onTakeOver,
}: StopControlProps) {
  const reconciling = mode === 'stopping';
  return (
    <div className="ds-stack-tight">
      <div className="ds-stop">
        <button
          type="button"
          className="ds-button ds-button--stop"
          onClick={onStop}
          // No disabled attribute, in any mode.
          aria-live={reconciling ? 'polite' : undefined}
        >
          {reconciling ? <span className="ds-spinner" aria-hidden="true" /> : <Icon name="stop" />}
          <span>{LABELS[mode]}</span>
        </button>
        {showTakeOver ? (
          <button type="button" className="ds-button ds-button--secondary" onClick={onTakeOver}>
            <span>Take over</span>
          </button>
        ) : null}
      </div>
      {note ? <p className="ds-stop-note">{note}</p> : null}
    </div>
  );
}
