import * as React from 'react';

export interface DisclosurePanelProps {
  /** What is being asked for, as a plain statement. */
  title: string;
  /** Exactly which data is involved. */
  data: string;
  /** What it will be used for — the purpose, not a benefit slogan. */
  purpose: string;
  /** Where it goes. "Stays on this tablet" is a destination too. */
  destination: string;
  /** What still works if the person declines. Never a threat or a dead end. */
  declineEffect: string;
  /** Label of the control that hands off to the OS, e.g. "Open Android settings". */
  handoffLabel?: string;
  onHandoff?: () => void;
  onDecline?: () => void;
}

/**
 * CMP-008 permission and data disclosure.
 *
 * Names the data, the purpose, the destination and the effect of declining —
 * all four, every time.
 *
 * Two prohibitions this component encodes: the handoff control never claims a
 * grant has happened (it only says it opens the OS screen, and the actual
 * permission is re-read on return), and the panel deliberately looks like
 * Granny rather than imitating an Android system dialog's visuals to borrow
 * its authority.
 */
export function DisclosurePanel({
  title,
  data,
  purpose,
  destination,
  declineEffect,
  handoffLabel,
  onHandoff,
  onDecline,
}: DisclosurePanelProps) {
  const id = React.useId();
  return (
    <section className="ds-disclosure" aria-labelledby={id}>
      <h3 className="ds-type-heading" id={id}>
        {title}
      </h3>

      <dl className="ds-disclosure-facts">
        <div className="ds-disclosure-fact">
          <dt>What this uses</dt>
          <dd className="ds-type-body ds-measure">{data}</dd>
        </div>
        <div className="ds-disclosure-fact">
          <dt>What for</dt>
          <dd className="ds-type-body ds-measure">{purpose}</dd>
        </div>
        <div className="ds-disclosure-fact">
          <dt>Where it goes</dt>
          <dd className="ds-type-body ds-measure">{destination}</dd>
        </div>
        <div className="ds-disclosure-fact">
          <dt>If you say no</dt>
          <dd className="ds-type-body ds-measure">{declineEffect}</dd>
        </div>
      </dl>

      <div className="ds-actions">
        {handoffLabel ? (
          <button type="button" className="ds-button ds-button--primary" onClick={onHandoff}>
            <span>{handoffLabel}</span>
          </button>
        ) : null}
        <button type="button" className="ds-button ds-button--secondary" onClick={onDecline}>
          <span>Not now</span>
        </button>
      </div>
    </section>
  );
}
