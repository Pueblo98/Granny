import * as React from 'react';
import { Icon } from '../Icon';

export interface Choice {
  /** Stable entity key. Never the display name — two people share a name. */
  id: string;
  /** Visible name, in its original spelling. */
  name: string;
  /**
   * The minimum differentiator that tells this option apart from its
   * neighbours: a phone number, a date, a source. Required — a list of
   * identical-looking names is not a choice.
   */
  differentiator: string;
}

export interface ChoiceListProps {
  /** The question being answered, e.g. "Which Sophie do you mean?". */
  question: string;
  /** Up to five options. Beyond that, "More results" is an explicit control. */
  choices: Choice[];
  /** Currently selected entity key. */
  selectedId?: string;
  /** Offer "More results" — never an automatic carousel or infinite scroll. */
  hasMore?: boolean;
  onSelect?: (id: string) => void;
  onMore?: () => void;
  onNoMatch?: () => void;
  onCancel?: () => void;
}

/**
 * CMP-005 choice list.
 *
 * The whole row is one target. Selection is carried by a check mark, a spoken
 * selected state and the row boundary together — the tinted fill is the
 * faintest of the three and never the only signal.
 *
 * "None of these" and Cancel are always present, so the person is never
 * cornered into picking a wrong option to move on.
 */
export function ChoiceList({
  question,
  choices,
  selectedId,
  hasMore = false,
  onSelect,
  onMore,
  onNoMatch,
  onCancel,
}: ChoiceListProps) {
  const id = React.useId();
  return (
    <div className="ds-stack">
      <p className="ds-type-heading" id={id}>
        {question}
      </p>

      <ul className="ds-list" role="listbox" aria-labelledby={id}>
        {choices.map((c) => {
          const selected = c.id === selectedId;
          return (
            <li key={c.id} role="none">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                className="ds-row"
                onClick={() => onSelect?.(c.id)}
              >
                <span className="ds-row-main">
                  <span className="ds-row-name">{c.name}</span>
                  <span className="ds-row-detail">{c.differentiator}</span>
                </span>
                <span className="ds-row-mark">{selected ? <Icon name="check" /> : null}</span>
                {selected ? <span className="ds-visually-hidden">Selected</span> : null}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="ds-actions">
        {hasMore ? (
          <button type="button" className="ds-button ds-button--secondary" onClick={onMore}>
            <span>More results</span>
          </button>
        ) : null}
        <button type="button" className="ds-button ds-button--secondary" onClick={onNoMatch}>
          <span>None of these</span>
        </button>
        <button type="button" className="ds-button ds-button--secondary" onClick={onCancel}>
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
}
