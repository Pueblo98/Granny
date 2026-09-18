import * as React from 'react';
import { Icon } from '../Icon';

export interface StepperControlProps {
  /** What is being adjusted. */
  label: string;
  /** Ordered option list. The current value is always shown as a word, not a position. */
  options: { value: number; label: string }[];
  /** Index into `options`. */
  index?: number;
  defaultIndex?: number;
  /** Live preview rendered under the control, e.g. sample text at the new size. */
  preview?: React.ReactNode;
  /** Offer "Restore previous" — required wherever the change alters layout. */
  onRestore?: () => void;
  onChange?: (index: number) => void;
}

/**
 * CMP-007 stepped value control (TextScale, SpeechRate).
 *
 * Dragging is never the only way to change the value: minus and plus are
 * ordinary 56dp buttons, and the current value is stated in words. Settings
 * that change layout show a live preview and a way back to the previous value.
 */
export function StepperControl({
  label,
  options,
  index,
  defaultIndex = 0,
  preview,
  onRestore,
  onChange,
}: StepperControlProps) {
  const [internal, setInternal] = React.useState(defaultIndex);
  const isControlled = index !== undefined;
  const i = isControlled ? index : internal;
  const id = React.useId();

  const move = (delta: number) => {
    const next = Math.min(options.length - 1, Math.max(0, i + delta));
    if (next === i) return;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const current = options[i];

  return (
    <div className="ds-stepper">
      <div className="ds-field-label" id={id}>
        {label}
      </div>
      <div className="ds-stepper-controls">
        <button
          type="button"
          className="ds-button ds-button--secondary ds-stepper-step"
          onClick={() => move(-1)}
          aria-label={`Smaller: ${label}`}
          aria-disabled={i === 0 || undefined}
        >
          <Icon name="minus" />
        </button>
        <span
          className="ds-stepper-value"
          role="status"
          aria-live="polite"
          aria-labelledby={id}
        >
          {current?.label}
        </span>
        <button
          type="button"
          className="ds-button ds-button--secondary ds-stepper-step"
          onClick={() => move(1)}
          aria-label={`Larger: ${label}`}
          aria-disabled={i === options.length - 1 || undefined}
        >
          <Icon name="plus" />
        </button>
      </div>
      {preview ? <div className="ds-transcript">{preview}</div> : null}
      {onRestore ? (
        <div>
          <button type="button" className="ds-button ds-button--secondary" onClick={onRestore}>
            <span>Restore previous size</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
