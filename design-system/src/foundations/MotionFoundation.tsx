import * as React from 'react';
import { TOKENS } from '../generated/tokens';

export interface MotionFoundationProps {
  /** @default "open-day" */
  theme?: 'open-day' | 'bright-signal';
}

/**
 * Foundation sheet: motion durations and the reduced-motion contract.
 *
 * Reduced motion is not "less animation" here — it is an immediate static
 * state change. Nothing pulses forever, nothing flashes, and no state is
 * carried only by movement.
 */
export function MotionFoundation({ theme = 'open-day' }: MotionFoundationProps) {
  const sem = TOKENS[theme].semantic;
  const rows: [string, string, string][] = [
    ['Press feedback', `${sem['motion.press'].value}ms`, 'Fill or border changes; position never moves'],
    ['State change', `${sem['motion.state'].value}ms`, 'A switch, a selection, a status replacing another'],
    ['Panel', `${sem['motion.panel'].value}ms`, 'A surface entering or leaving'],
    ['Reduced motion', `${sem['motion.reduced'].value}ms`, 'Immediate static equivalent, with the icon and word already correct'],
    ['Easing', String(sem['motion.easing.standard'].value), 'Settles directly — no overshoot, no bounce'],
  ];

  return (
    <div className="ds-sheet">
      <div>
        <div className="ds-sheet-title">Motion</div>
        <p className="ds-sheet-note">
          <span className="ds-status-proposed">Proposed</span> No flashing, no infinite decorative pulse and no
          simulated progress. A spinner appears only beside text that names a bounded wait.
        </p>
      </div>

      <div className="ds-scroll-x">
        <table className="ds-spec-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Value</th>
              <th>Applies to</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([k, v, n]) => (
              <tr key={k}>
                <td>{k}</td>
                <td>{v}</td>
                <td>{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="ds-sheet-note">
        This sheet is static by design: a specimen that animates on load would itself violate the reduced-motion
        rule it documents. Turn on the OS reduced-motion setting and re-open the gallery to see every duration
        collapse to 0ms.
      </p>
    </div>
  );
}
