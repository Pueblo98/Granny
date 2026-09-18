import * as React from 'react';

export interface TranscriptProps {
  /**
   * Provisional recognition. Labelled "Heard so far" and visibly distinct from
   * the committed text — it is not read aloud over the person still speaking.
   */
  partial?: string;
  /** The final text, which the person can edit before using it. */
  final?: string;
  /** Show the editable final text with its commit control. */
  editable?: boolean;
  onEdit?: (value: string) => void;
  onUse?: () => void;
}

/**
 * CMP-002 transcript.
 *
 * "Use this request" commits the interpretation only. It never commits an
 * external consequence — that always belongs to a dedicated preview and its
 * own approval control.
 */
export function Transcript({ partial, final, editable = false, onEdit, onUse }: TranscriptProps) {
  const id = React.useId();
  return (
    <div className="ds-stack">
      {partial ? (
        <div className="ds-transcript">
          <span className="ds-transcript-label">Heard so far</span>
          <p className="ds-type-body ds-transcript-partial" aria-live="polite">
            {partial}
          </p>
        </div>
      ) : null}

      {final !== undefined ? (
        <div className="ds-field">
          <label className="ds-field-label" htmlFor={id}>
            Your request
          </label>
          {editable ? (
            <textarea
              id={id}
              className="ds-field-input"
              defaultValue={final}
              rows={3}
              onChange={(e) => onEdit?.(e.target.value)}
            />
          ) : (
            <p className="ds-type-body-large" id={id}>
              {final}
            </p>
          )}
        </div>
      ) : null}

      {final !== undefined ? (
        <div className="ds-actions">
          <button type="button" className="ds-button ds-button--primary" onClick={onUse}>
            <span>Use this request</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
