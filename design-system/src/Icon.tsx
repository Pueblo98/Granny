import * as React from 'react';

export type IconName =
  | 'stop'
  | 'check'
  | 'alert'
  | 'question'
  | 'mic'
  | 'mic-off'
  | 'cancel'
  | 'arrow-right'
  | 'play'
  | 'pause'
  | 'next'
  | 'plus'
  | 'minus'
  | 'info'
  | 'trash'
  | 'edit'
  | 'clock';

/**
 * Icon geometry. Every path is authored here rather than pulled from an icon
 * library, so the system carries no third-party icon licence: these shapes are
 * original to this repository and ship under the repository's own terms.
 *
 * Strokes are 2-2.5dp at a 24dp box (design-system.md "Shape"). An icon never
 * appears without a visible text label on an essential action.
 */
const PATHS: Record<IconName, React.ReactNode> = {
  stop: <rect x="6" y="6" width="12" height="12" rx="1.5" />,
  check: <polyline points="4,12.5 9.5,18 20,6.5" />,
  alert: (
    <>
      <path d="M12 4.5 L21.5 20.5 H2.5 Z" />
      <line x1="12" y1="10" x2="12" y2="14.5" />
      <line x1="12" y1="17.5" x2="12" y2="17.6" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.2 9.2a2.9 2.9 0 1 1 3.6 3.1c-.6.2-.9.8-.9 1.4v.6" />
      <line x1="12" y1="17.6" x2="12" y2="17.7" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
      <line x1="12" y1="18" x2="12" y2="21.5" />
    </>
  ),
  'mic-off': (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
      <line x1="12" y1="18" x2="12" y2="21.5" />
      <line x1="3.5" y1="3.5" x2="20.5" y2="20.5" />
    </>
  ),
  cancel: (
    <>
      <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" />
      <line x1="18.5" y1="5.5" x2="5.5" y2="18.5" />
    </>
  ),
  'arrow-right': (
    <>
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13,6 19,12 13,18" />
    </>
  ),
  play: <path d="M7 4.5 L19 12 L7 19.5 Z" />,
  pause: (
    <>
      <line x1="9" y1="5" x2="9" y2="19" />
      <line x1="15" y1="5" x2="15" y2="19" />
    </>
  ),
  next: (
    <>
      <path d="M6 5 L15 12 L6 19 Z" />
      <line x1="18" y1="5" x2="18" y2="19" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  minus: <line x1="5" y1="12" x2="19" y2="12" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="12" y1="7.4" x2="12" y2="7.5" />
    </>
  ),
  trash: (
    <>
      <polyline points="4,6.5 20,6.5" />
      <path d="M9 6.5V4.5h6v2" />
      <path d="M6.5 6.5 L7.5 20.5h9l1-14" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4L19.5 8.5a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5Z" />
      <line x1="15" y1="6" x2="18.5" y2="9.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12,6.5 12,12 16,14.5" />
    </>
  ),
};

export interface IconProps {
  /** Which shape to draw. */
  name: IconName;
  /**
   * Box size in dp. Defaults to `1em` so the icon scales with the text role it
   * sits beside, including at 200% text.
   */
  size?: number | string;
  /**
   * Stroke weight in dp. The system's range is 2-2.5; values outside it are
   * off-specification.
   * @default 2.25
   */
  strokeWidth?: number;
  /**
   * Accessible name. Omit for a decorative icon that sits beside its own text
   * label — which is the normal case here, since every essential action in
   * this system carries a visible word.
   */
  label?: string;
  className?: string;
}

/** A labelled-by-default stroke icon at 2-2.5dp. */
export function Icon({ name, size = '1em', strokeWidth = 2.25, label, className }: IconProps) {
  const filled = name === 'stop' || name === 'play' || name === 'next';
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
