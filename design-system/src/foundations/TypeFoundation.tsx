import * as React from 'react';
import { TYPOGRAPHY, SCALES } from '../generated/tokens';

export interface TypeFoundationProps {
  /** Sample sentence rendered in every role. */
  sample?: string;
  /** Also show the TextScale options table. @default true */
  showScales?: boolean;
}

const ROLE_ORDER = ['display', 'heading', 'body-large', 'body', 'button', 'status', 'supporting'] as const;

/**
 * Foundation sheet: the type scale.
 *
 * Sizes are proposed Android sp, mapped 1sp to 1px for the browser specimen at
 * TextScale 1.0. CSS px is not proof of Android sp conformance — that needs a
 * device.
 *
 * Font families are bundled variable fonts whose default instance is not 400,
 * so every role sets an explicit weight.
 */
export function TypeFoundation({
  sample = 'Send David this message before dinner',
  showScales = true,
}: TypeFoundationProps) {
  return (
    <div className="ds-sheet">
      <div>
        <div className="ds-sheet-title">Type scale</div>
        <p className="ds-sheet-note">
          <span className="ds-status-proposed">Proposed</span> Body is 20sp — the reading size, not a caption size.
          Nothing in this system caps the font size, and every role wraps rather than truncating.
        </p>
      </div>

      <div className="ds-stack">
        {ROLE_ORDER.map((role) => {
          const t = TYPOGRAPHY[role];
          return (
            <div key={role} className="ds-stack-tight">
              <div className="ds-swatch-meta">
                {role} — {t.size}/{t.lineHeight} sp, weight {t.weight}, {t.family} family
              </div>
              <div className={`ds-type-${role}`}>{sample}</div>
            </div>
          );
        })}
      </div>

      {showScales ? (
        <div className="ds-stack-tight">
          <div className="ds-sheet-title">In-app text scale</div>
          <p className="ds-sheet-note">
            Applied on top of the system font scale, which is never overridden downward. Review requires the combined
            case: 200% system plus 1.5 app scaling.
          </p>
          <div className="ds-scroll-x">
            <table className="ds-spec-table">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Multiplier</th>
                  <th>Body renders at</th>
                </tr>
              </thead>
              <tbody>
                {SCALES.textScale.options.map((o) => (
                  <tr key={o.value}>
                    <td>{o.label}</td>
                    <td>{o.value}x</td>
                    <td>{Math.round(TYPOGRAPHY.body.size * o.value)}sp</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
