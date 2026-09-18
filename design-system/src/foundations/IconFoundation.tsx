import * as React from 'react';
import { Icon, type IconName } from '../Icon';

const NAMES: IconName[] = [
  'stop', 'check', 'alert', 'question', 'mic', 'mic-off', 'cancel',
  'arrow-right', 'play', 'pause', 'next', 'plus', 'minus', 'info', 'trash', 'edit', 'clock',
];

export interface IconFoundationProps {
  /** Show each icon with the visible label it must carry in use. @default true */
  withLabels?: boolean;
}

/**
 * Foundation sheet: the icon set.
 *
 * Provenance: these shapes are authored in this repository (`src/Icon.tsx`).
 * The system carries no third-party icon licence, which is why there is no
 * attribution line here — there is nothing to attribute.
 *
 * Strokes are 2–2.5dp. Every essential action shows its word as well as its
 * icon; an icon alone is never the control.
 */
export function IconFoundation({ withLabels = true }: IconFoundationProps) {
  return (
    <div className="ds-sheet">
      <div>
        <div className="ds-sheet-title">Icons</div>
        <p className="ds-sheet-note">
          <span className="ds-status-proposed">Proposed</span> Recognisable forms over clever ones. The
          microphone-off mark is deliberately distinct from a muted speaker, and the stop square is filled so it
          reads at a glance.
        </p>
      </div>

      <div className="ds-swatches">
        {NAMES.map((n) => (
          <div className="ds-swatch" key={n}>
            <div
              style={{
                height: 88,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--ds-space-2)',
                border: '1px solid var(--ds-border-subtle)',
                borderRadius: 'var(--ds-radius-control)',
                background: 'var(--ds-surface-panel)',
              }}
            >
              <Icon name={n} size="32px" />
              {withLabels ? <span className="ds-type-supporting">{n}</span> : null}
            </div>
            <div className="ds-swatch-meta">2.25dp stroke at a 24dp box</div>
          </div>
        ))}
      </div>
    </div>
  );
}
