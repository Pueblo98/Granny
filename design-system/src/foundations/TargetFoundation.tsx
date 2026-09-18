import * as React from 'react';
import { TOKENS } from '../generated/tokens';

export interface TargetFoundationProps {
  /** @default "open-day" */
  theme?: 'open-day' | 'bright-signal';
}

/**
 * Foundation sheet: target sizes and focus geometry.
 *
 * Shows the 56dp floor, the 64dp primary/Stop/consequential minimum, the 12dp
 * separation between distinct primary targets, and the 3dp focus ring with its
 * 2dp separation — drawn at real size so the geometry can be inspected rather
 * than taken on trust.
 */
export function TargetFoundation({ theme = 'open-day' }: TargetFoundationProps) {
  const sem = TOKENS[theme].semantic;
  const min = Number(sem['size.target.min'].value);
  const primary = Number(sem['size.target.primary'].value);
  const gap = Number(sem['space.gap.primary-targets'].value);

  return (
    <div className="ds-sheet">
      <div>
        <div className="ds-sheet-title">Targets and focus</div>
        <p className="ds-sheet-note">
          <span className="ds-status-proposed">Proposed</span> These exceed Android's 48dp guidance deliberately.
          Targets grow with their label; they never shrink to fit a row. Android dp is not a CSS pixel — device
          measurement is still owed.
        </p>
      </div>

      <div className="ds-stack">
        <div className="ds-stack-tight">
          <div className="ds-swatch-meta">Minimum interactive target — {min}dp</div>
          <div
            style={{
              height: min,
              width: 220,
              border: '2px dashed var(--ds-border-control)',
              borderRadius: 'var(--ds-radius-control)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="ds-type-supporting">{min}dp tall</span>
          </div>
        </div>

        <div className="ds-stack-tight">
          <div className="ds-swatch-meta">
            Primary, Stop and consequential actions — {primary}dp, separated by {gap}dp
          </div>
          {/* Wraps at large text: two 64dp targets cannot sit side by side on a
              narrow screen, and the rule being demonstrated is the separation
              between them, which survives the wrap. */}
          <div style={{ display: 'flex', gap, flexWrap: 'wrap' }}>
            <button type="button" className="ds-button ds-button--primary" style={{ minHeight: primary }}>
              <span>Send to David</span>
            </button>
            <button type="button" className="ds-button ds-button--secondary" style={{ minHeight: primary }}>
              <span>Change it</span>
            </button>
          </div>
        </div>

        <div className="ds-stack-tight">
          <div className="ds-swatch-meta">
            Focus ring — {sem['focus.ring.width'].value}dp with {sem['focus.ring.offset'].value}dp separation, never
            clipped by a container
          </div>
          <div style={{ padding: 12 }}>
            <button
              type="button"
              className="ds-button ds-button--primary"
              style={{
                outline: `${sem['focus.ring.width'].value}px solid var(--ds-focus-ring)`,
                outlineOffset: `${sem['focus.ring.offset'].value}px`,
              }}
            >
              <span>Focused control</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
