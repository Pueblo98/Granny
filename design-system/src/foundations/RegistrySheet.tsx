import * as React from 'react';
import { COMPONENT_REGISTRY, REGISTRY_VERSION, validateCompositionPlan } from '../registry';

export interface RegistrySheetProps {
  /** Show the fail-closed rejection examples, with live validator output. @default true */
  showRejections?: boolean;
  /** Show the full component schema table. @default true */
  showSchema?: boolean;
}

/** Plans that MUST be rejected. Rendered with their real validator output. */
const REJECTIONS: { title: string; plan: Parameters<typeof validateCompositionPlan>[0] }[] = [
  {
    title: 'Unknown component type',
    plan: { nodes: [{ component: 'QuickActionGrid', slots: { label: 'Call Sophie' } }] },
  },
  {
    title: 'Consequential action behind a novel label',
    plan: {
      nodes: [
        {
          component: 'Button',
          variant: 'primary',
          slots: { label: 'Just do it' },
          actions: ['action.approveExact'],
        },
      ],
    },
  },
  {
    title: 'Duplicate consequential control in one plan',
    plan: {
      nodes: [
        {
          component: 'ConsequencePreview',
          slots: { target: 'David', channel: 'Messages', body: 'Hi', effect: 'Sends now', reversibility: 'Cannot unsend' },
          actions: ['action.approveExact'],
        },
        {
          component: 'ConsequencePreview',
          slots: { target: 'David', channel: 'Messages', body: 'Hi', effect: 'Sends now', reversibility: 'Cannot unsend' },
          actions: ['action.approveExact'],
        },
      ],
    },
  },
  {
    title: 'Missing the exact body on a preview',
    plan: {
      nodes: [
        {
          component: 'ConsequencePreview',
          slots: { target: 'David', channel: 'Messages', effect: 'Sends now', reversibility: 'Cannot unsend' },
        },
      ],
    },
  },
  {
    title: 'Six choices where the contract allows five',
    plan: {
      nodes: [
        {
          component: 'ChoiceList',
          slots: { question: 'Which Sophie?', choices: [1, 2, 3, 4, 5, 6] },
        },
      ],
    },
  },
];

/**
 * Foundation sheet: the ADR-0013 composition registry.
 *
 * Shows what a composition plan may reference and, below it, the validator
 * actually rejecting five malformed plans. The rejection messages are produced
 * by `validateCompositionPlan` at render time — they are real output, not a
 * table of what the validator is supposed to do.
 */
export function RegistrySheet({ showRejections = true, showSchema = true }: RegistrySheetProps) {
  return (
    <div className="ds-sheet">
      <div>
        <div className="ds-sheet-title">Composition registry v{REGISTRY_VERSION}</div>
        <p className="ds-sheet-note">
          <span className="ds-status-proposed">ADR-0013 accepted</span> The model selects registered components,
          variants, typed slots and allowed action references. It cannot create controls, define behaviour, rename a
          consequence, or move the renderer-owned anchors. An unknown type fails the whole plan closed.
        </p>
      </div>

      {showSchema ? (
      <div className="ds-scroll-x">
        <table className="ds-spec-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>CMP</th>
              <th>Schema</th>
              <th>Variants</th>
              <th>Actions (consequence)</th>
              <th>Focus order</th>
              <th>Reflow</th>
              <th>Anchor</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(COMPONENT_REGISTRY).map(([name, s]) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{s.cmp}</td>
                <td>{s.version}</td>
                <td>{s.variants.join(', ')}</td>
                <td>
                  {s.actions.length === 0
                    ? '—'
                    : s.actions.map((a) => `${a.ref} (${a.consequence}${a.labelOwnedBy === 'registry' ? ', fixed label' : ''})`).join('; ')}
                </td>
                <td>{s.focusOrder.join(' → ')}</td>
                <td>{s.reflow}</td>
                <td>{s.rendererOwnedAnchor ? 'app-owned' : '—'}</td>
                <td>{s.maxInstances}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : null}

      {showRejections ? (
        <div className="ds-stack-tight">
          <div className="ds-sheet-title">Fail-closed checks</div>
          <p className="ds-sheet-note">Live validator output for five plans that must never render.</p>
          {REJECTIONS.map((r) => {
            const result = validateCompositionPlan(r.plan);
            return (
              <div key={r.title} className="ds-guidance ds-guidance--warning">
                <div className="ds-type-body" style={{ fontWeight: 600 }}>
                  {r.title}
                </div>
                <div className="ds-type-supporting">
                  {result.valid ? 'ACCEPTED — this is a defect' : `Rejected: ${result.errors.join('; ')}`}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
