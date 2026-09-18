import * as React from 'react';
import { Icon } from '../Icon';

export interface DeletionPreviewProps {
  /** What is being removed, as named categories rather than a count alone. */
  categories: { name: string; detail: string }[];
  /** What this deletion cannot reach — copies held by other services. */
  externalLimits: string;
  /** Whether anything can be recovered afterwards, stated plainly. */
  reversibility: string;
  /** The specific approval label, e.g. "Delete these 4 saved aliases". */
  approveLabel: string;
  onApprove?: () => void;
  onCancel?: () => void;
}

/**
 * CMP-003 deletion preview.
 *
 * Deletion is the one place the danger role is used as a fill — sending is
 * not danger, removal is. The destructive colour is always accompanied by the
 * word and the icon, so the consequence survives a greyscale or colour-blind
 * reading.
 *
 * Categories are named. A bare count ("delete 12 items") is not an exact
 * preview and does not satisfy CMP-003.
 */
export function DeletionPreview({
  categories,
  externalLimits,
  reversibility,
  approveLabel,
  onApprove,
  onCancel,
}: DeletionPreviewProps) {
  const headingId = React.useId();
  return (
    <section className="ds-preview ds-preview--destructive" aria-labelledby={headingId}>
      <p className="ds-preview-effect" id={headingId} style={{ color: 'var(--ds-status-danger)' }}>
        <Icon name="trash" />
        <span>{reversibility}</span>
      </p>

      <div>
        <div className="ds-transcript-label" style={{ marginBottom: 'var(--ds-space-2)' }}>
          What will be removed
        </div>
        <ul className="ds-list">
          {categories.map((c) => (
            <li key={c.name} className="ds-row" style={{ cursor: 'default' }}>
              <span className="ds-row-main">
                <span className="ds-row-name">{c.name}</span>
                <span className="ds-row-detail">{c.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="ds-type-supporting ds-measure">{externalLimits}</p>

      <div className="ds-actions">
        <button type="button" className="ds-button ds-button--danger" onClick={onApprove}>
          <Icon name="trash" />
          <span>{approveLabel}</span>
        </button>
        <button type="button" className="ds-button ds-button--secondary" onClick={onCancel}>
          <span>Cancel</span>
        </button>
      </div>
    </section>
  );
}
