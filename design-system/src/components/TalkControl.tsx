import * as React from 'react';
import { Icon } from '../Icon';

export type TalkState = 'idle' | 'listening' | 'no-speech' | 'unavailable';

export interface TalkControlProps {
  /**
   * `idle` offers Talk. `listening` shows the capture state and offers "Done
   * listening". `no-speech` is the gentle prompt after roughly 10s of silence.
   * `unavailable` covers a denied or broken microphone.
   * @default "idle"
   */
  state?: TalkState;
  /** Why the microphone is unavailable, shown in the `unavailable` state. */
  unavailableReason?: string;
  onTalk?: () => void;
  onDone?: () => void;
  onType?: () => void;
}

/**
 * CMP-002 microphone control.
 *
 * Tap to talk — there is no wake word and no ambient-listening indicator in
 * MVP. The capture state is a word plus an icon, and the microphone-off mark
 * is visibly different from a muted speaker. Every state keeps a typed path
 * available, so no task depends on speech.
 */
export function TalkControl({
  state = 'idle',
  unavailableReason = 'The microphone is not available. You can type your request instead.',
  onTalk,
  onDone,
  onType,
}: TalkControlProps) {
  const listening = state === 'listening' || state === 'no-speech';

  return (
    <div className="ds-talk">
      {listening ? (
        <div className="ds-talk-state" role="status" aria-live="polite">
          <Icon name="mic" />
          <span>Listening</span>
        </div>
      ) : null}

      {state === 'unavailable' ? (
        <div className="ds-talk-state">
          <Icon name="mic-off" />
          <span>Microphone off</span>
        </div>
      ) : null}

      {state === 'no-speech' ? (
        <p className="ds-type-supporting">I haven’t heard anything yet. Take your time, or type instead.</p>
      ) : null}

      {state === 'unavailable' ? <p className="ds-type-supporting">{unavailableReason}</p> : null}

      <div className="ds-actions">
        {listening ? (
          <button type="button" className="ds-button ds-button--primary" onClick={onDone}>
            <Icon name="check" />
            <span>Done listening</span>
          </button>
        ) : state === 'unavailable' ? null : (
          <button type="button" className="ds-button ds-button--primary" onClick={onTalk}>
            <Icon name="mic" />
            <span>Talk</span>
          </button>
        )}
        <button type="button" className="ds-button ds-button--secondary" onClick={onType}>
          <Icon name="edit" />
          <span>Type a request</span>
        </button>
      </div>
    </div>
  );
}
