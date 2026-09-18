import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, type GrannyTheme, type TextScale, TOKEN_META } from '@granny/design-system';

// Every specimen in the gallery is the same authored file the sync uploads,
// so the local review and the imported cards cannot drift apart.
import * as ActivityStatusP from '../../.design-sync/previews/ActivityStatus';
import * as ButtonP from '../../.design-sync/previews/Button';
import * as ChoiceListP from '../../.design-sync/previews/ChoiceList';
import * as ColorFoundationP from '../../.design-sync/previews/ColorFoundation';
import * as ConsequencePreviewP from '../../.design-sync/previews/ConsequencePreview';
import * as ContentRowP from '../../.design-sync/previews/ContentRow';
import * as DeletionPreviewP from '../../.design-sync/previews/DeletionPreview';
import * as DisclosurePanelP from '../../.design-sync/previews/DisclosurePanel';
import * as GuidanceNoteP from '../../.design-sync/previews/GuidanceNote';
import * as IconP from '../../.design-sync/previews/Icon';
import * as IconFoundationP from '../../.design-sync/previews/IconFoundation';
import * as MediaRowP from '../../.design-sync/previews/MediaRow';
import * as MotionFoundationP from '../../.design-sync/previews/MotionFoundation';
import * as OutcomePanelP from '../../.design-sync/previews/OutcomePanel';
import * as RegistrySheetP from '../../.design-sync/previews/RegistrySheet';
import * as SettingSwitchP from '../../.design-sync/previews/SettingSwitch';
import * as SettingsRowP from '../../.design-sync/previews/SettingsRow';
import * as ShapeFoundationP from '../../.design-sync/previews/ShapeFoundation';
import * as SpacingFoundationP from '../../.design-sync/previews/SpacingFoundation';
import * as StepperControlP from '../../.design-sync/previews/StepperControl';
import * as StopControlP from '../../.design-sync/previews/StopControl';
import * as TalkControlP from '../../.design-sync/previews/TalkControl';
import * as TargetFoundationP from '../../.design-sync/previews/TargetFoundation';
import * as TextFieldP from '../../.design-sync/previews/TextField';
import * as ThemeComparisonP from '../../.design-sync/previews/ThemeComparison';
import * as ThemeProviderP from '../../.design-sync/previews/ThemeProvider';
import * as TranscriptP from '../../.design-sync/previews/Transcript';
import * as TypeFoundationP from '../../.design-sync/previews/TypeFoundation';

type Mod = Record<string, unknown>;

const GROUPS: { group: string; cmp: string; entries: [string, Mod][] }[] = [
  {
    group: 'Foundations',
    cmp: '—',
    entries: [
      ['ColorFoundation', ColorFoundationP],
      ['TypeFoundation', TypeFoundationP],
      ['SpacingFoundation', SpacingFoundationP],
      ['ShapeFoundation', ShapeFoundationP],
      ['TargetFoundation', TargetFoundationP],
      ['IconFoundation', IconFoundationP],
      ['MotionFoundation', MotionFoundationP],
      ['ThemeComparison', ThemeComparisonP],
      ['ThemeProvider', ThemeProviderP],
      ['Icon', IconP],
    ],
  },
  {
    group: 'Composition',
    cmp: 'ADR-0013',
    entries: [['RegistrySheet', RegistrySheetP]],
  },
  {
    group: 'Control and escape',
    cmp: 'CMP-001, CMP-002',
    entries: [
      ['StopControl', StopControlP],
      ['TalkControl', TalkControlP],
      ['Transcript', TranscriptP],
    ],
  },
  {
    group: 'Consequence',
    cmp: 'CMP-003',
    entries: [
      ['ConsequencePreview', ConsequencePreviewP],
      ['DeletionPreview', DeletionPreviewP],
    ],
  },
  {
    group: 'Activity and outcome',
    cmp: 'CMP-004, CMP-006',
    entries: [
      ['ActivityStatus', ActivityStatusP],
      ['OutcomePanel', OutcomePanelP],
    ],
  },
  {
    group: 'Choice',
    cmp: 'CMP-005',
    entries: [['ChoiceList', ChoiceListP]],
  },
  {
    group: 'Buttons and form controls',
    cmp: 'CMP-007',
    entries: [
      ['Button', ButtonP],
      ['TextField', TextFieldP],
      ['SettingSwitch', SettingSwitchP],
      ['StepperControl', StepperControlP],
    ],
  },
  {
    group: 'Guidance and disclosure',
    cmp: 'CMP-008',
    entries: [
      ['GuidanceNote', GuidanceNoteP],
      ['DisclosurePanel', DisclosurePanelP],
    ],
  },
  {
    group: 'Lists, media and settings',
    cmp: 'CMP-009',
    entries: [
      ['ContentRow', ContentRowP],
      ['SettingsRow', SettingsRowP],
      ['MediaRow', MediaRowP],
    ],
  },
];

const WIDTHS = [
  { label: 'Narrow (360)', value: 360 },
  { label: 'Medium (600)', value: 600 },
  { label: 'Tablet (840)', value: 840 },
  { label: 'Full width', value: 0 },
];

function Gallery() {
  const [theme, setTheme] = React.useState<GrannyTheme>('open-day');
  const [scale, setScale] = React.useState<TextScale>(1);
  const [width, setWidth] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);
  // Simulates the OS-level 200% text setting, on top of which the in-app
  // TextScale multiplies — the combined case the accessibility spec requires.
  const [rootPct, setRootPct] = React.useState(100);

  React.useEffect(() => {
    document.documentElement.style.fontSize = `${(16 * rootPct) / 100}px`;
  }, [rootPct]);

  return (
    <>
      <header className="g-bar">
        <div className="g-bar-title">
          Granny design system <span className="g-tag">proposed</span>
          <span className="g-meta">tokens v{TOKEN_META.version}</span>
        </div>
        <div className="g-controls">
          <label>
            Theme
            <select value={theme} onChange={(e) => setTheme(e.target.value as GrannyTheme)}>
              <option value="open-day">Open Day (working)</option>
              <option value="bright-signal">Bright Signal (challenger)</option>
            </select>
          </label>
          <label>
            App text scale
            <select value={scale} onChange={(e) => setScale(Number(e.target.value) as TextScale)}>
              <option value={1}>1.0 Standard</option>
              <option value={1.15}>1.15 Larger</option>
              <option value={1.3}>1.3 Larger still</option>
              <option value={1.5}>1.5 Largest</option>
            </select>
          </label>
          <label>
            System text
            <select value={rootPct} onChange={(e) => setRootPct(Number(e.target.value))}>
              <option value={100}>100%</option>
              <option value={200}>200%</option>
              <option value={300}>300%</option>
            </select>
          </label>
          <label>
            Width
            <select value={width} onChange={(e) => setWidth(Number(e.target.value))}>
              {WIDTHS.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </label>
          <label className="g-check">
            <input type="checkbox" checked={reduced} onChange={(e) => setReduced(e.target.checked)} />
            Reduced motion
          </label>
        </div>
      </header>

      <nav className="g-nav">
        {GROUPS.map((g) => (
          <a key={g.group} href={`#${slug(g.group)}`}>
            {g.group}
          </a>
        ))}
      </nav>

      <main>
        {GROUPS.map((g) => (
          <section key={g.group} id={slug(g.group)} className="g-group">
            <h2 className="g-group-title">
              {g.group} <span className="g-meta">{g.cmp}</span>
            </h2>
            {g.entries.map(([name, mod]) => (
              <article key={name} className="g-component">
                <h3 className="g-component-title">{name}</h3>
                <div className="g-cells">
                  {Object.entries(mod)
                    .filter(([, v]) => typeof v === 'function')
                    .map(([cell, Comp]) => (
                      <div key={cell} className="g-cell">
                        <div className="g-cell-label">{cell}</div>
                        <div className="g-cell-body" style={width ? { width, maxWidth: '100%' } : undefined}>
                          <ThemeProvider theme={theme} textScale={scale} forceReducedMotion={reduced || undefined}>
                            {React.createElement(Comp as React.ComponentType)}
                          </ThemeProvider>
                        </div>
                      </div>
                    ))}
                </div>
              </article>
            ))}
          </section>
        ))}
      </main>

      <footer className="g-footer">
        Every value in this gallery is proposed. No palette, typeface, radius, motion value or icon is accepted.
        Browser rendering is not Android conformance: CSS px is not dp or sp, and TalkBack, switch access, physical
        dexterity and participant comprehension remain unrun.
      </footer>
    </>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

createRoot(document.getElementById('root')!).render(<Gallery />);
