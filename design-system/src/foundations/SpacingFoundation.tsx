import * as React from 'react';
import { TOKENS } from '../generated/tokens';

export interface SpacingFoundationProps {
  /** @default "open-day" */
  theme?: 'open-day' | 'bright-signal';
}

const STEPS = [4, 8, 12, 16, 24, 32, 48];

/**
 * Foundation sheet: the spacing scale and the layout rules that use it.
 *
 * Grouping in this system comes from spacing and rules, not from a stack of
 * raised cards. Elevation is reserved for a defined semantic need.
 */
export function SpacingFoundation({ theme = 'open-day' }: SpacingFoundationProps) {
  const sem = TOKENS[theme].semantic;
  const rules: [string, string, string][] = [
    ['Screen inset, nominal', `${sem['space.inset.nominal'].value}dp`, 'Standard width'],
    ['Screen inset, narrow', `${sem['space.inset.narrow'].value}dp`, 'Below the 600dp breakpoint'],
    ['Between distinct primary targets', `${sem['space.gap.primary-targets'].value}dp`, 'Minimum, so a mis-tap does not fire the neighbour'],
    ['Label to icon inside a control', `${sem['space.gap.label-icon'].value}dp`, ''],
    ['Reading measure', '45–65 characters', 'Where practical; never a fixed line count'],
  ];

  return (
    <div className="ds-sheet">
      <div>
        <div className="ds-sheet-title">Spacing</div>
        <p className="ds-sheet-note">
          <span className="ds-status-proposed">Proposed</span> A 4dp base step. Values are dp; the browser specimen
          maps 1dp to 1px for review only.
        </p>
      </div>

      <div className="ds-stack-tight">
        {STEPS.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-4)' }}>
            <span className="ds-swatch-meta" style={{ minWidth: '6ch' }}>
              {s}dp
            </span>
            <span className="ds-space-bar" style={{ width: `${s}px` }} />
          </div>
        ))}
      </div>

      <div className="ds-scroll-x">
        <table className="ds-spec-table">
          <thead>
            <tr>
              <th>Rule</th>
              <th>Value</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(([k, v, n]) => (
              <tr key={k}>
                <td>{k}</td>
                <td>{v}</td>
                <td>{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
