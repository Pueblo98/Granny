import * as React from 'react';
import { Icon, type IconName } from '../Icon';

export interface ContentRowProps {
  /** Descriptive label — what this is, not just its filename. */
  label: string;
  /** State or metadata: a date, a source, a status word. */
  detail?: string;
  /** Optional leading icon. */
  icon?: IconName;
  /** Present the row as an actionable target. Omit for a read-only row. */
  onOpen?: () => void;
  /** Label of the row's action, used as its accessible name when actionable. */
  actionLabel?: string;
}

/**
 * CMP-009 content row.
 *
 * A row is either a target or it is not — this component never renders an
 * ambiguously tappable surface. History rows carry a label and a date and
 * never a message body.
 */
export function ContentRow({ label, detail, icon, onOpen, actionLabel }: ContentRowProps) {
  const body = (
    <>
      {icon ? (
        <span className="ds-row-mark">
          <Icon name={icon} />
        </span>
      ) : null}
      <span className="ds-row-main">
        <span className="ds-row-name">{label}</span>
        {detail ? <span className="ds-row-detail">{detail}</span> : null}
      </span>
      {onOpen ? (
        <span className="ds-row-mark">
          <Icon name="arrow-right" />
        </span>
      ) : null}
    </>
  );

  if (!onOpen) {
    return (
      <div className="ds-row" style={{ cursor: 'default' }}>
        {body}
      </div>
    );
  }

  return (
    <button type="button" className="ds-row" onClick={onOpen} aria-label={actionLabel}>
      {body}
    </button>
  );
}
