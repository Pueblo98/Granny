import * as React from 'react';

export type GrannyTheme = 'open-day' | 'bright-signal';

/** In-app TextScale, applied on top of whatever the OS already scaled. */
export type TextScale = 1 | 1.15 | 1.3 | 1.5;

export interface ThemeProviderProps {
  /**
   * Which proposed identity territory to render. `open-day` is the working
   * review baseline; `bright-signal` is the challenger. Neither is accepted.
   * @default "open-day"
   */
  theme?: GrannyTheme;
  /**
   * In-app text scale. Multiplies every type role on top of the system font
   * scale, which is never overridden downward.
   * @default 1
   */
  textScale?: TextScale;
  /**
   * Force the reduced-motion presentation regardless of the OS setting, for
   * reviewing the static equivalents. Leave undefined to follow the OS.
   */
  forceReducedMotion?: boolean;
  children?: React.ReactNode;
}

interface ThemeContextValue {
  theme: GrannyTheme;
  textScale: number;
}

const ThemeContext = React.createContext<ThemeContextValue>({ theme: 'open-day', textScale: 1 });

/** Read the active proposed theme. */
export function useGrannyTheme(): ThemeContextValue {
  return React.useContext(ThemeContext);
}

/**
 * Root wrapper for every Granny specimen. Sets the theme attribute the token
 * layer switches on, and the text-scale multiplier every type role reads.
 *
 * Components must be rendered inside this provider — outside it the CSS
 * custom properties are undefined and the component renders unstyled.
 */
export function ThemeProvider({
  theme = 'open-day',
  textScale = 1,
  forceReducedMotion,
  children,
}: ThemeProviderProps) {
  const style: React.CSSProperties & Record<string, string | number> = {
    ['--ds-text-scale']: textScale,
  };
  if (forceReducedMotion) {
    style['--ds-motion-press'] = '0ms';
    style['--ds-motion-state'] = '0ms';
    style['--ds-motion-panel'] = '0ms';
  }
  const value = React.useMemo(() => ({ theme, textScale }), [theme, textScale]);
  return (
    <ThemeContext.Provider value={value}>
      <div
        className="ds-root"
        data-ds-theme={theme}
        // Mirrors what the OS reduced-motion setting does, so the in-app
        // toggle and the system setting produce the identical presentation
        // rather than the toggle only zeroing durations.
        data-ds-reduced-motion={forceReducedMotion ? 'true' : undefined}
        style={style}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
