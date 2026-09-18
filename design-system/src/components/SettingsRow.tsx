import * as React from 'react';

export interface SettingsRowProps {
  /** What the setting is. */
  label: string;
  /** The current value, always shown — never only revealed on opening. */
  value: string;
  /** What the setting affects. */
  scope?: string;
  /**
   * Whether the change applies immediately. Local reversible switches may;
   * anything that changes layout requires an explicit apply and a restore
   * path, which is what `appliesImmediately: false` documents.
   * @default true
   */
  appliesImmediately?: boolean;
  onChange?: () => void;
  changeLabel?: string;
}

/**
 * CMP-009 settings row.
 *
 * The current value is visible on the row itself, so the person never has to
 * open a screen to find out what a setting is currently set to.
 */
export function SettingsRow({
  label,
  value,
  scope,
  appliesImmediately = true,
  onChange,
  changeLabel,
}: SettingsRowProps) {
  return (
    <div className="ds-settings-row">
      <div className="ds-switch-text">
        <div className="ds-type-body" style={{ fontWeight: 600 }}>
          {label}
        </div>
        <div className="ds-type-supporting">{value}</div>
        {scope ? <div className="ds-type-supporting">{scope}</div> : null}
        {!appliesImmediately ? (
          <div className="ds-type-supporting">You’ll see a preview before this is applied.</div>
        ) : null}
      </div>
      <button type="button" className="ds-button ds-button--secondary" onClick={onChange}>
        <span>{changeLabel ?? `Change ${label.toLowerCase()}`}</span>
      </button>
    </div>
  );
}
