import * as React from 'react';

export interface SettingSwitchProps {
  /** What the setting controls, in adult plain language. */
  label: string;
  /** What turning it on or off actually affects — its scope, not a slogan. */
  scope?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  /** Why the setting cannot be changed right now. */
  disabledReason?: string;
  onChange?: (checked: boolean) => void;
}

/**
 * CMP-007 switch.
 *
 * The state is rendered as the word On or Off next to the track, so the
 * setting is readable without interpreting a colour or a knob position. The
 * scope line says what the switch actually governs.
 */
export function SettingSwitch({
  label,
  scope,
  checked,
  defaultChecked = false,
  disabled = false,
  disabledReason,
  onChange,
}: SettingSwitchProps) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const id = React.useId();

  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange?.(!on);
  };

  return (
    <div className="ds-switch-row">
      <div className="ds-switch-text">
        <div className="ds-type-body" id={id} style={{ fontWeight: 600 }}>
          {label}
        </div>
        {scope ? <div className="ds-type-supporting">{scope}</div> : null}
        {disabled && disabledReason ? <div className="ds-type-supporting">{disabledReason}</div> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={id}
        aria-disabled={disabled || undefined}
        className="ds-switch-control"
        onClick={toggle}
      >
        {/* The word is the state. The track is the decoration. */}
        <span className="ds-switch-state">{on ? 'On' : 'Off'}</span>
        <span className="ds-switch-track" aria-hidden="true">
          <span className="ds-switch-knob" />
        </span>
      </button>
    </div>
  );
}
