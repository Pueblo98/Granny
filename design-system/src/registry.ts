/**
 * Bounded semantic composition registry — ADR-0013.
 *
 * The model may emit only a typed composition plan referencing registered CMP
 * IDs, versioned variants, typed content slots and allowed action references.
 * Everything in this file is the validation boundary: the renderer owns focus
 * and source order, and anything not enumerated here is rejected.
 *
 * Rendering a control never grants an action. Policy enforcement lives in
 * docs/05-safety-privacy/action-policy.md and is independent of this file.
 */

/** Consequence class a registered action binds to. Mirrors the action policy. */
export type ConsequenceClass = 'POL-00' | 'POL-01' | 'POL-02' | 'POL-03' | 'POL-R';

export type SlotType = 'text' | 'longText' | 'entityList' | 'exactBody' | 'metadata' | 'media';

export interface SlotSchema {
  type: SlotType;
  required: boolean;
  /** Maximum entries for list slots. Absent means single-valued. */
  maxItems?: number;
}

export interface ActionSchema {
  /** Stable action reference. The model selects it; it cannot rename or invent one. */
  ref: string;
  consequence: ConsequenceClass;
  /**
   * Whether the label is fixed by the registry. A consequential action's label
   * is registry-owned so the model cannot disguise Send, Delete, Share,
   * Purchase or a permission change behind a novel word.
   */
  labelOwnedBy: 'registry' | 'model';
}

export interface ComponentSchema {
  /** CMP ID from docs/02-design/design-system.md. */
  cmp: string;
  /** Schema version. A component's contract change is a version bump, not an edit. */
  version: string;
  /** Registered variants. An unlisted variant is rejected. */
  variants: string[];
  slots: Record<string, SlotSchema>;
  actions: ActionSchema[];
  /**
   * Reading and focus order of this component's own regions. Renderer-owned:
   * a plan cannot reorder these, and at large text or narrow width the
   * renderer's reflow overrides any model-supplied ordering.
   */
  focusOrder: string[];
  /** Reflow behaviour the renderer guarantees regardless of the plan. */
  reflow: 'stack' | 'stack-and-wrap' | 'fixed-anchor';
  /**
   * App-owned position that a composition plan may never move or remove.
   * Stop, the Talk/Type input and the current task status are anchors.
   */
  rendererOwnedAnchor: boolean;
  /** Maximum instances allowed in one plan. Duplicate consequential controls are rejected. */
  maxInstances: number;
}

export const REGISTRY_VERSION = '0.1.0';

export const COMPONENT_REGISTRY: Record<string, ComponentSchema> = {
  StopControl: {
    cmp: 'CMP-001',
    version: '1.0.0',
    variants: ['stop', 'stopping', 'take-over', 'cancel'],
    slots: { note: { type: 'text', required: false } },
    actions: [
      { ref: 'task.stop', consequence: 'POL-01', labelOwnedBy: 'registry' },
      { ref: 'task.takeOver', consequence: 'POL-01', labelOwnedBy: 'registry' },
    ],
    focusOrder: ['stop', 'takeOver', 'note'],
    reflow: 'fixed-anchor',
    rendererOwnedAnchor: true,
    maxInstances: 1,
  },
  TalkControl: {
    cmp: 'CMP-002',
    version: '1.0.0',
    variants: ['idle', 'listening', 'no-speech', 'unavailable'],
    slots: { unavailableReason: { type: 'text', required: false } },
    actions: [
      { ref: 'input.talk', consequence: 'POL-00', labelOwnedBy: 'registry' },
      { ref: 'input.done', consequence: 'POL-00', labelOwnedBy: 'registry' },
      { ref: 'input.type', consequence: 'POL-00', labelOwnedBy: 'registry' },
    ],
    focusOrder: ['state', 'talk', 'type'],
    reflow: 'fixed-anchor',
    rendererOwnedAnchor: true,
    maxInstances: 1,
  },
  Transcript: {
    cmp: 'CMP-002',
    version: '1.0.0',
    variants: ['partial', 'final', 'editable'],
    slots: { partial: { type: 'text', required: false }, final: { type: 'longText', required: false } },
    actions: [{ ref: 'input.useRequest', consequence: 'POL-02', labelOwnedBy: 'registry' }],
    focusOrder: ['partial', 'final', 'use'],
    reflow: 'stack',
    rendererOwnedAnchor: false,
    maxInstances: 1,
  },
  ConsequencePreview: {
    cmp: 'CMP-003',
    version: '1.0.0',
    variants: ['active', 'expired', 'edited'],
    slots: {
      target: { type: 'text', required: true },
      channel: { type: 'text', required: true },
      body: { type: 'exactBody', required: true },
      effect: { type: 'text', required: true },
      reversibility: { type: 'text', required: true },
    },
    actions: [
      // Registry-owned label: the plan selects the action, not its wording.
      { ref: 'action.approveExact', consequence: 'POL-03', labelOwnedBy: 'registry' },
      { ref: 'action.change', consequence: 'POL-02', labelOwnedBy: 'registry' },
      { ref: 'action.cancel', consequence: 'POL-01', labelOwnedBy: 'registry' },
      { ref: 'action.renewPreview', consequence: 'POL-02', labelOwnedBy: 'registry' },
    ],
    // Effect is read before any control reaches focus.
    focusOrder: ['effect', 'facts', 'body', 'approve', 'change', 'cancel'],
    reflow: 'stack',
    rendererOwnedAnchor: false,
    maxInstances: 1,
  },
  DeletionPreview: {
    cmp: 'CMP-003',
    version: '1.0.0',
    variants: ['local', 'scoped'],
    slots: {
      categories: { type: 'entityList', required: true, maxItems: 12 },
      externalLimits: { type: 'text', required: true },
      reversibility: { type: 'text', required: true },
    },
    actions: [
      { ref: 'action.deleteExact', consequence: 'POL-03', labelOwnedBy: 'registry' },
      { ref: 'action.cancel', consequence: 'POL-01', labelOwnedBy: 'registry' },
    ],
    focusOrder: ['reversibility', 'categories', 'limits', 'delete', 'cancel'],
    reflow: 'stack',
    rendererOwnedAnchor: false,
    maxInstances: 1,
  },
  ActivityStatus: {
    cmp: 'CMP-004',
    version: '1.0.0',
    variants: ['running', 'waiting', 'manual-offered'],
    slots: {
      goal: { type: 'text', required: true },
      steps: { type: 'entityList', required: true, maxItems: 6 },
      waitingOn: { type: 'text', required: false },
    },
    actions: [{ ref: 'task.manual', consequence: 'POL-01', labelOwnedBy: 'model' }],
    focusOrder: ['goal', 'steps', 'waitingOn', 'manual', 'stop'],
    reflow: 'stack',
    rendererOwnedAnchor: true,
    maxInstances: 1,
  },
  ChoiceList: {
    cmp: 'CMP-005',
    version: '1.0.0',
    variants: ['entity', 'content'],
    slots: {
      question: { type: 'text', required: true },
      choices: { type: 'entityList', required: true, maxItems: 5 },
    },
    actions: [
      { ref: 'choice.select', consequence: 'POL-02', labelOwnedBy: 'registry' },
      { ref: 'choice.more', consequence: 'POL-00', labelOwnedBy: 'registry' },
      { ref: 'choice.noMatch', consequence: 'POL-01', labelOwnedBy: 'registry' },
    ],
    focusOrder: ['question', 'choices', 'more', 'noMatch', 'cancel'],
    reflow: 'stack',
    rendererOwnedAnchor: false,
    maxInstances: 2,
  },
  OutcomePanel: {
    cmp: 'CMP-006',
    version: '1.0.0',
    variants: ['verified-complete', 'prepared', 'partial', 'unknown', 'interrupted', 'cancelled', 'safely-failed'],
    slots: { message: { type: 'text', required: true }, evidence: { type: 'text', required: true } },
    actions: [
      { ref: 'outcome.retry', consequence: 'POL-01', labelOwnedBy: 'registry' },
      { ref: 'outcome.reviewStatus', consequence: 'POL-00', labelOwnedBy: 'registry' },
      { ref: 'outcome.undo', consequence: 'POL-03', labelOwnedBy: 'registry' },
      { ref: 'outcome.done', consequence: 'POL-01', labelOwnedBy: 'registry' },
    ],
    focusOrder: ['heading', 'message', 'evidence', 'actions'],
    reflow: 'stack',
    rendererOwnedAnchor: false,
    maxInstances: 1,
  },
  Button: {
    cmp: 'CMP-007',
    version: '1.0.0',
    variants: ['primary', 'secondary', 'danger'],
    slots: { label: { type: 'text', required: true }, disabledReason: { type: 'text', required: false } },
    actions: [{ ref: 'generic.nonConsequential', consequence: 'POL-01', labelOwnedBy: 'model' }],
    focusOrder: ['button', 'reason'],
    reflow: 'stack-and-wrap',
    rendererOwnedAnchor: false,
    maxInstances: 6,
  },
  TextField: {
    cmp: 'CMP-007',
    version: '1.0.0',
    variants: ['single', 'multiline'],
    slots: { label: { type: 'text', required: true }, help: { type: 'text', required: false } },
    actions: [],
    focusOrder: ['label', 'input', 'help', 'error'],
    reflow: 'stack',
    rendererOwnedAnchor: false,
    maxInstances: 4,
  },
  SettingSwitch: {
    cmp: 'CMP-007',
    version: '1.0.0',
    variants: ['default'],
    slots: { label: { type: 'text', required: true }, scope: { type: 'text', required: false } },
    actions: [{ ref: 'setting.toggleLocal', consequence: 'POL-02', labelOwnedBy: 'registry' }],
    focusOrder: ['label', 'scope', 'switch'],
    reflow: 'stack-and-wrap',
    rendererOwnedAnchor: false,
    maxInstances: 8,
  },
  StepperControl: {
    cmp: 'CMP-007',
    version: '1.0.0',
    variants: ['text-scale', 'speech-rate'],
    slots: { label: { type: 'text', required: true } },
    actions: [
      { ref: 'setting.step', consequence: 'POL-02', labelOwnedBy: 'registry' },
      { ref: 'setting.restore', consequence: 'POL-02', labelOwnedBy: 'registry' },
    ],
    focusOrder: ['label', 'decrease', 'value', 'increase', 'preview', 'restore'],
    reflow: 'stack-and-wrap',
    rendererOwnedAnchor: false,
    maxInstances: 2,
  },
  GuidanceNote: {
    cmp: 'CMP-008',
    version: '1.0.0',
    variants: ['informational', 'warning'],
    slots: { message: { type: 'text', required: true } },
    actions: [{ ref: 'guidance.act', consequence: 'POL-01', labelOwnedBy: 'model' }],
    focusOrder: ['message', 'action', 'secondary'],
    reflow: 'stack',
    rendererOwnedAnchor: false,
    maxInstances: 2,
  },
  DisclosurePanel: {
    cmp: 'CMP-008',
    version: '1.0.0',
    variants: ['permission', 'data'],
    slots: {
      title: { type: 'text', required: true },
      data: { type: 'text', required: true },
      purpose: { type: 'text', required: true },
      destination: { type: 'text', required: true },
      declineEffect: { type: 'text', required: true },
    },
    actions: [
      { ref: 'permission.osHandoff', consequence: 'POL-01', labelOwnedBy: 'registry' },
      { ref: 'permission.decline', consequence: 'POL-01', labelOwnedBy: 'registry' },
    ],
    focusOrder: ['title', 'data', 'purpose', 'destination', 'declineEffect', 'handoff', 'decline'],
    reflow: 'stack',
    rendererOwnedAnchor: false,
    maxInstances: 1,
  },
  ContentRow: {
    cmp: 'CMP-009',
    version: '1.0.0',
    variants: ['static', 'actionable'],
    slots: { label: { type: 'text', required: true }, detail: { type: 'metadata', required: false } },
    actions: [{ ref: 'content.open', consequence: 'POL-01', labelOwnedBy: 'model' }],
    focusOrder: ['row'],
    reflow: 'stack',
    rendererOwnedAnchor: false,
    maxInstances: 20,
  },
  SettingsRow: {
    cmp: 'CMP-009',
    version: '1.0.0',
    variants: ['immediate', 'previewed'],
    slots: { label: { type: 'text', required: true }, value: { type: 'text', required: true } },
    actions: [{ ref: 'setting.open', consequence: 'POL-01', labelOwnedBy: 'registry' }],
    focusOrder: ['label', 'value', 'change'],
    reflow: 'stack-and-wrap',
    rendererOwnedAnchor: false,
    maxInstances: 12,
  },
  MediaRow: {
    cmp: 'CMP-009',
    version: '1.0.0',
    variants: ['playing', 'paused'],
    slots: { title: { type: 'text', required: true }, meta: { type: 'metadata', required: true } },
    actions: [
      { ref: 'media.playPause', consequence: 'POL-01', labelOwnedBy: 'registry' },
      { ref: 'media.next', consequence: 'POL-01', labelOwnedBy: 'registry' },
    ],
    focusOrder: ['title', 'meta', 'playPause', 'next'],
    reflow: 'stack-and-wrap',
    rendererOwnedAnchor: false,
    maxInstances: 1,
  },
};

export interface PlanNode {
  component: string;
  variant?: string;
  slots?: Record<string, unknown>;
  actions?: string[];
}

export interface CompositionPlan {
  registryVersion?: string;
  nodes: PlanNode[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a composition plan. Fails closed: anything not explicitly allowed
 * is an error, and a single error rejects the whole plan so the renderer falls
 * back to a known composition rather than rendering a partially-trusted one.
 */
export function validateCompositionPlan(plan: CompositionPlan): ValidationResult {
  const errors: string[] = [];

  if (!plan || !Array.isArray(plan.nodes)) {
    return { valid: false, errors: ['plan has no nodes array'] };
  }
  if (plan.registryVersion && plan.registryVersion !== REGISTRY_VERSION) {
    errors.push(`plan targets registry ${plan.registryVersion}, renderer is ${REGISTRY_VERSION}`);
  }

  const counts = new Map<string, number>();
  const consequentialRefs = new Set<string>();

  for (const [i, node] of plan.nodes.entries()) {
    const at = `node ${i}`;
    const schema = COMPONENT_REGISTRY[node.component];

    // Unknown component type: rejected, never rendered as a generic box.
    if (!schema) {
      errors.push(`${at}: unknown component "${node.component}"`);
      continue;
    }

    counts.set(node.component, (counts.get(node.component) ?? 0) + 1);
    if ((counts.get(node.component) ?? 0) > schema.maxInstances) {
      errors.push(`${at}: "${node.component}" exceeds maxInstances ${schema.maxInstances}`);
    }

    if (node.variant && !schema.variants.includes(node.variant)) {
      errors.push(`${at}: "${node.component}" has no variant "${node.variant}"`);
    }

    const slots = node.slots ?? {};
    for (const key of Object.keys(slots)) {
      if (!schema.slots[key]) {
        errors.push(`${at}: "${node.component}" has no slot "${key}"`);
        continue;
      }
      const value = slots[key];
      // A slot carries content, never a handler or executable value.
      if (typeof value === 'function') {
        errors.push(`${at}: slot "${key}" carries a function — plans cannot define behaviour`);
      }
      const spec = schema.slots[key];
      if (spec.maxItems !== undefined) {
        if (!Array.isArray(value)) {
          errors.push(`${at}: slot "${key}" must be a list`);
        } else if (value.length > spec.maxItems) {
          errors.push(`${at}: slot "${key}" has ${value.length} items, max ${spec.maxItems}`);
        }
      }
    }
    for (const [key, spec] of Object.entries(schema.slots)) {
      if (spec.required && slots[key] === undefined) {
        errors.push(`${at}: "${node.component}" is missing required slot "${key}"`);
      }
    }

    for (const ref of node.actions ?? []) {
      const action = schema.actions.find((a) => a.ref === ref);
      if (!action) {
        errors.push(`${at}: "${node.component}" cannot bind action "${ref}"`);
        continue;
      }
      // Two consequential controls in one plan is a duplicate-dispatch hazard.
      if (action.consequence === 'POL-03') {
        if (consequentialRefs.has(ref)) {
          errors.push(`${at}: duplicate consequential action "${ref}" in one plan`);
        }
        consequentialRefs.add(ref);
      }
      if (action.consequence === 'POL-R') {
        errors.push(`${at}: action "${ref}" is restricted and can never be composed`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
