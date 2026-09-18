import * as React from 'react';
import { Icon } from '../Icon';

export interface TextFieldProps {
  /** Persistent visible label. A placeholder never stands in for this. */
  label: string;
  value?: string;
  defaultValue?: string;
  /** Supporting hint shown under the field at full supporting contrast. */
  help?: string;
  /** Error text. Rendered with an icon — the border colour never carries it alone. */
  error?: string;
  /** Render as a multi-line editable area, for request text and drafts. */
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  /** Why the field is unavailable. Required whenever `disabled` is set. */
  disabledReason?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

/**
 * CMP-007 text field.
 *
 * The label is persistent, correction is always available, and nothing submits
 * from incidental focus: there is no Enter-to-send behaviour on this control.
 * A consequential action is committed only by its own dedicated button.
 */
export function TextField({
  label,
  value,
  defaultValue,
  help,
  error,
  multiline = false,
  rows = 4,
  disabled = false,
  disabledReason,
  placeholder,
  onChange,
}: TextFieldProps) {
  const id = React.useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const describedBy = [help ? helpId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  const shared = {
    id,
    className: 'ds-field-input',
    value,
    defaultValue,
    placeholder,
    disabled,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': describedBy,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(e.target.value),
    // Enter inserts a newline in the multiline case and does nothing in the
    // single-line case; it never dispatches an action.
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !multiline) e.preventDefault();
    },
  };

  return (
    <div className={`ds-field${error ? ' ds-field--error' : ''}`}>
      <label className="ds-field-label" htmlFor={id}>
        {label}
      </label>
      {multiline ? <textarea {...shared} rows={rows} /> : <input type="text" {...shared} />}
      {help ? (
        <p className="ds-field-help" id={helpId}>
          {help}
        </p>
      ) : null}
      {error ? (
        <p className="ds-field-error" id={errorId}>
          <Icon name="alert" />
          <span>{error}</span>
        </p>
      ) : null}
      {disabled && disabledReason ? <p className="ds-field-help">{disabledReason}</p> : null}
    </div>
  );
}
