import * as React from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { ConsequencePreview } from '../components/ConsequencePreview';
import { OutcomePanel } from '../components/OutcomePanel';

export interface ThemeComparisonProps {
  /** Render the identical specimen in both candidate territories. @default true */
  sideBySide?: boolean;
}

/**
 * Foundation sheet: Open Day against Bright Signal on the identical specimen.
 *
 * The comparison uses the same component, the same content and the same
 * structure in both columns, so a preference between them is a preference
 * about the territory rather than about a layout difference.
 *
 * Neither is accepted. Open Day is the working baseline because the brand
 * document recommends it; Bright Signal is the challenger. Living Pages and
 * Everyday Spark remain documented alternatives and are deliberately not
 * blended in here.
 */
export function ThemeComparison({ sideBySide = true }: ThemeComparisonProps) {
  const specimen = (
    <>
      <ConsequencePreview
        target="David Okonjo (mobile, 07700 900461)"
        channel="Messages"
        body="I'll call after dinner."
        effect="This sends a message straight away."
        reversibility="It cannot be unsent once it has gone."
        approveLabel="Send to David"
      />
      <OutcomePanel
        outcome="unknown"
        message="I can’t confirm whether it sent. Check the conversation before trying again."
        evidence="Messages did not report a result."
        onReviewStatus={() => {}}
      />
    </>
  );

  return (
    <div className="ds-sheet">
      <div>
        <div className="ds-sheet-title">Open Day and Bright Signal, same specimen</div>
        <p className="ds-sheet-note">
          <span className="ds-status-proposed">Neither accepted</span> Identical content and structure in both
          columns. Open Day is the reversible working baseline, following the brand document's recommendation;
          Bright Signal is the challenger.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          // min() lets the column shrink below its preferred width on a narrow
          // screen instead of forcing the page to scroll sideways.
          gridTemplateColumns: sideBySide ? 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))' : '1fr',
          gap: 'var(--ds-space-5)',
        }}
      >
        {/* min-width:0 so a grid column can shrink below its content at large
            text instead of widening the sheet. */}
        <div style={{ minWidth: 0 }}>
          <div className="ds-swatch-meta" style={{ marginBottom: 'var(--ds-space-3)' }}>
            Open Day — working baseline
          </div>
          <ThemeProvider theme="open-day">
            <div className="ds-stack">{specimen}</div>
          </ThemeProvider>
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="ds-swatch-meta" style={{ marginBottom: 'var(--ds-space-3)' }}>
            Bright Signal — challenger
          </div>
          <ThemeProvider theme="bright-signal">
            <div className="ds-stack">{specimen}</div>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
}
