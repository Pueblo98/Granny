import * as React from 'react';
import { TOKENS } from '../generated/tokens';

export interface ShapeFoundationProps {
  /** @default "open-day" */
  theme?: 'open-day' | 'bright-signal';
}

const ROLES = ['radius.small', 'radius.control', 'radius.container', 'radius.dialog'] as const;

/**
 * Foundation sheet: corner radii and the elevation rule.
 *
 * Radii are the one dimension that differs between the two candidate
 * territories — Open Day is softer (12/16dp), Bright Signal is crisper (8dp).
 * The role names stay identical, so swapping territory never edits a
 * component.
 */
export function ShapeFoundation({ theme = 'open-day' }: ShapeFoundationProps) {
  const sem = TOKENS[theme].semantic;
  return (
    <div className="ds-sheet">
      <div>
        <div className="ds-sheet-title">Shape — {theme}</div>
        <p className="ds-sheet-note">
          <span className="ds-status-proposed">Proposed</span> Flat by default: a border and spacing carry grouping.
          A shadow is added only where a surface genuinely floats above another, and depth alone never signals that
          something is actionable.
        </p>
      </div>

      <div className="ds-swatches">
        {ROLES.map((r) => (
          <div className="ds-swatch" key={r}>
            <div
              style={{
                height: 96,
                background: 'var(--ds-surface-panel)',
                border: '2px solid var(--ds-border-control)',
                borderRadius: `${sem[r].value}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="ds-swatch-meta">{sem[r].value}dp</span>
            </div>
            <div className="ds-swatch-name">{r}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
