/**
 * Granny Stage 1 design system.
 *
 * Every visual value in this package is PROPOSED. No palette, typeface, radius,
 * motion value or icon is accepted by Simon, and nothing here decides the app's
 * screens, its Home composition or its navigation.
 *
 * React is a transfer format for design-system review. It is not a decision
 * about the production Android framework.
 */

export { ThemeProvider, useGrannyTheme } from './ThemeProvider';
export type { ThemeProviderProps, GrannyTheme, TextScale } from './ThemeProvider';

export { Icon } from './Icon';
export type { IconProps, IconName } from './Icon';

// CMP-007 — buttons and form controls
export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant } from './components/Button';
export { TextField } from './components/TextField';
export type { TextFieldProps } from './components/TextField';
export { SettingSwitch } from './components/SettingSwitch';
export type { SettingSwitchProps } from './components/SettingSwitch';
export { StepperControl } from './components/StepperControl';
export type { StepperControlProps } from './components/StepperControl';

// CMP-001 — Stop / Cancel / Take over
export { StopControl } from './components/StopControl';
export type { StopControlProps, StopMode } from './components/StopControl';

// CMP-002 — microphone and transcript
export { TalkControl } from './components/TalkControl';
export type { TalkControlProps, TalkState } from './components/TalkControl';
export { Transcript } from './components/Transcript';
export type { TranscriptProps } from './components/Transcript';

// CMP-003 — consequence and deletion previews
export { ConsequencePreview } from './components/ConsequencePreview';
export type { ConsequencePreviewProps } from './components/ConsequencePreview';
export { DeletionPreview } from './components/DeletionPreview';
export type { DeletionPreviewProps } from './components/DeletionPreview';

// CMP-004 — activity and wait status
export { ActivityStatus } from './components/ActivityStatus';
export type { ActivityStatusProps, ActivityStep } from './components/ActivityStatus';

// CMP-005 — choice row and entity card
export { ChoiceList } from './components/ChoiceList';
export type { ChoiceListProps, Choice } from './components/ChoiceList';

// CMP-006 — outcome and recovery
export { OutcomePanel } from './components/OutcomePanel';
export type { OutcomePanelProps, Outcome } from './components/OutcomePanel';

// CMP-008 — guidance and permission education
export { GuidanceNote } from './components/GuidanceNote';
export type { GuidanceNoteProps } from './components/GuidanceNote';
export { DisclosurePanel } from './components/DisclosurePanel';
export type { DisclosurePanelProps } from './components/DisclosurePanel';

// CMP-009 — lists, media and settings
export { ContentRow } from './components/ContentRow';
export type { ContentRowProps } from './components/ContentRow';
export { SettingsRow } from './components/SettingsRow';
export type { SettingsRowProps } from './components/SettingsRow';
export { MediaRow } from './components/MediaRow';
export type { MediaRowProps } from './components/MediaRow';

// Foundation review sheets
export { ColorFoundation } from './foundations/ColorFoundation';
export type { ColorFoundationProps } from './foundations/ColorFoundation';
export { TypeFoundation } from './foundations/TypeFoundation';
export type { TypeFoundationProps } from './foundations/TypeFoundation';
export { SpacingFoundation } from './foundations/SpacingFoundation';
export type { SpacingFoundationProps } from './foundations/SpacingFoundation';
export { ShapeFoundation } from './foundations/ShapeFoundation';
export type { ShapeFoundationProps } from './foundations/ShapeFoundation';
export { TargetFoundation } from './foundations/TargetFoundation';
export type { TargetFoundationProps } from './foundations/TargetFoundation';
export { IconFoundation } from './foundations/IconFoundation';
export type { IconFoundationProps } from './foundations/IconFoundation';
export { MotionFoundation } from './foundations/MotionFoundation';
export type { MotionFoundationProps } from './foundations/MotionFoundation';
export { ThemeComparison } from './foundations/ThemeComparison';
export type { ThemeComparisonProps } from './foundations/ThemeComparison';
export { RegistrySheet } from './foundations/RegistrySheet';
export type { RegistrySheetProps } from './foundations/RegistrySheet';

// ADR-0013 bounded composition
export { COMPONENT_REGISTRY, REGISTRY_VERSION, validateCompositionPlan } from './registry';
export type {
  ComponentSchema,
  SlotSchema,
  ActionSchema,
  SlotType,
  ConsequenceClass,
  CompositionPlan,
  PlanNode,
  ValidationResult,
} from './registry';

// Generated token record, for tooling that needs the values without parsing CSS.
export { TOKENS, TOKEN_META, TYPOGRAPHY, SCALES, CONTRAST_TARGETS } from './generated/tokens';
export { CONTRAST_REPORT } from './generated/contrast';
