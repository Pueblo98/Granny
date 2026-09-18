import * as React from 'react';
import { Icon } from '../Icon';

export interface MediaRowProps {
  /** Track or item title. */
  title: string;
  /** Artist, source or other metadata. Always present. */
  meta: string;
  /** Which app is playing it — named, never implied. */
  app: string;
  /** @default false */
  playing?: boolean;
  onPlayPause?: () => void;
  onNext?: () => void;
  onDone?: () => void;
}

/**
 * CMP-009 media row.
 *
 * Playback controls are labelled words, not bare glyphs, and there is no
 * autoplay preview — nothing here starts making sound because the row
 * appeared.
 */
export function MediaRow({ title, meta, app, playing = false, onPlayPause, onNext, onDone }: MediaRowProps) {
  return (
    <div className="ds-stack-tight">
      <div className="ds-media-row">
        <span className="ds-media-art" aria-hidden="true">
          <Icon name="play" size="32px" />
        </span>
        <span className="ds-row-main">
          <span className="ds-row-name">{title}</span>
          <span className="ds-row-detail">{meta}</span>
          <span className="ds-row-detail">Playing in {app}</span>
        </span>
      </div>
      <div className="ds-actions">
        <button type="button" className="ds-button ds-button--primary" onClick={onPlayPause}>
          <Icon name={playing ? 'pause' : 'play'} />
          <span>{playing ? 'Pause' : 'Play'}</span>
        </button>
        <button type="button" className="ds-button ds-button--secondary" onClick={onNext}>
          <Icon name="next" />
          <span>Next track</span>
        </button>
        <button type="button" className="ds-button ds-button--secondary" onClick={onDone}>
          <span>Done</span>
        </button>
      </div>
    </div>
  );
}
