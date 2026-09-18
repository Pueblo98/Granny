// Writes the review verdicts recorded after reading every per-cell sheet in
// ds-bundle/_screenshots/review/. Kept as a file so the grading pass is
// reproducible and the notes are reviewable, rather than 28 opaque writes.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(repoRoot, '.design-sync', '.cache', 'review');
mkdirSync(out, { recursive: true });

const G = (note) => ({ verdict: 'good', note });

const GRADES = {
  ActivityStatus: {
    Running: G('Goal, two verified steps and the current step; Stop and Take over present.'),
    Waiting: G('Names the awaited dependency rather than showing a percentage.'),
    ManualPathOffered: G('Manual path exposed alongside Stop; no step is narrated as progress.'),
  },
  Button: {
    Variants: G('Primary, secondary and danger read as three distinct weights.'),
    Pressed: G('Primary darkens, secondary inverts to a filled fill with white label.'),
    DisabledWithReason: G('Muted fill with a visible outline; the reason sits below at full supporting contrast.'),
    Loading: G('Label retained beside the indicator; the wait is named.'),
    LongLabel: G('Label wraps to two lines and the control grows; nothing truncates.'),
  },
  ChoiceList: {
    Unselected: G('Three options, each with a real differentiator.'),
    Selected: G('Check mark, thicker primary boundary and tinted fill together; fill is not load-bearing.'),
    WithMoreResults: G('More results is an explicit control beside None of these and Cancel.'),
    ContentChoices: G('Content options carry sender and date.'),
    LongNames: G('Long clinic names wrap; the whole row stays one target.'),
  },
  ColorFoundation: {
    OpenDay: G('Swatches plus the measured-pair table; generated roles labelled as such.'),
    BrightSignal: G('Identical role names, challenger values.'),
    SwatchesOnly: G('Palette without the evidence table, for scanning.'),
  },
  ConsequencePreview: {
    AdmittedSend: G('Effect first, stacked facts, exact body quoted, three equally reachable controls.'),
    Expired: G('Preview stays readable; approval replaced by Renew preview.'),
    EditedSincePrepared: G('Edit invalidates the prepared approval and says so.'),
    PreparedHandoff: G('Reads as a handoff, not a send; wording and label both say so.'),
    LongContent: G('Long recipient and multi-paragraph body render in full, unellipsised.'),
  },
  ContentRow: {
    Actionable: G('Chevron marks the row as a target.'),
    ReadOnly: G('No chevron and no press affordance; visibly not a target.'),
    HistoryRows: G('Labels and dates only; no message body, as the contract requires.'),
  },
  DeletionPreview: {
    LocalData: G('Categories named, external limits stated, destructive fill with icon and word.'),
    SingleCategory: G('Same anatomy at one category; label names the exact count.'),
  },
  DisclosurePanel: {
    MicrophonePermission: G('All four facts present; the handoff control claims no grant.'),
    LocalDataOnly: G('"Stays on this tablet" stated as plainly as a remote destination.'),
    HelperProposal: G('Helper scope is explicit and the decline effect is non-punitive.'),
  },
  GuidanceNote: {
    Informational: G('States the situation, offers a way forward, blames nobody.'),
    Warning: G('Warning rule and icon; the consequence is named before the choice.'),
    StatementOnly: G('No action offered where none applies.'),
    Restricted: G('Limit explained in one sentence with a manual route; no lecture.'),
  },
  Icon: {
    StateIcons: G('Six state marks; mic-off is clearly distinct from the mic.'),
    AlwaysWithItsWord: G('Each icon sits beside its word on a real control.'),
    StrokeRange: G('2, 2.25 and 2.5dp render distinguishably at 48px.'),
  },
  IconFoundation: {
    Set: G('Full set with names and the stroke rule under each.'),
    ShapesOnly: G('Shapes read without their captions.'),
  },
  MediaRow: {
    Playing: G('Pause offered while playing; the app is named.'),
    Paused: G('Play offered; transport controls are labelled words.'),
    LongTitle: G('Long title wraps to two lines; controls wrap below rather than compressing.'),
  },
  MotionFoundation: {
    Durations: G('Static by design; durations, easing and the reduced-motion contract in one table.'),
  },
  OutcomePanel: {
    VerifiedComplete: G('Check, success rule, and an evidence line naming the read-back.'),
    Prepared: G('Reads as ready-for-you, never as sent.'),
    Partial: G('Partly done with the specific shortfall stated.'),
    Unknown: G('The honest unknown, with Review status rather than a retry.'),
    Interrupted: G('States precisely what had happened when Stop was pressed.'),
    SafelyFailed: G('Danger rule; retry offered because nothing was dispatched.'),
  },
  RegistrySheet: {
    FailClosedChecks: G('Five malformed plans with the real validator rejection text beneath each.'),
    Schema: G('Schema table scrolls inside its own container; the page does not.'),
  },
  SettingsRow: {
    CurrentValues: G('Every current value readable on the row itself.'),
    PreviewedChange: G('Says a preview comes before the change is applied.'),
  },
  SettingSwitch: {
    OnAndOff: G('On and Off are words; the two states are distinguishable in greyscale.'),
    DisabledWithReason: G('Muted track, border and word, with the reason at full contrast beside it.'),
    LongLabel: G('Long label wraps and the control drops below it rather than compressing.'),
  },
  ShapeFoundation: {
    OpenDay: G('12dp control and 16dp container radii, drawn at size.'),
    BrightSignal: G('8dp throughout; identical role names to Open Day.'),
  },
  SpacingFoundation: {
    Scale: G('Step bars plus the layout rules that consume them.'),
    AppliedToAComposition: G('The rules in use: inset, 12dp target separation, a rule instead of a card.'),
  },
  StepperControl: {
    TextScale: G('Minus, value and plus on one line, with a live preview and Restore.'),
    SpeechRate: G('Same anatomy; preview says to play a sample before saving.'),
    AtMaximum: G('Plus takes the disabled treatment at the end of the range; both controls stay visible.'),
  },
  StopControl: {
    Stop: G('Full-width Stop with a note saying what stopping will do.'),
    WithTakeOver: G('Take over beside Stop; Stop keeps the leading position.'),
    Stopping: G('Reconciliation state — and the control is still live, as required.'),
    Cancel: G('Cancel exits a preview without ending a task.'),
  },
  TalkControl: {
    Idle: G('Talk and Type offered together; speech is never the only path.'),
    Listening: G('The word Listening carries the state, not just the icon.'),
    NoSpeechYet: G('Patient prompt after silence, with the typed alternative still present.'),
    Unavailable: G('Microphone-off mark distinct from a muted speaker; typing still offered.'),
  },
  TargetFoundation: {
    Geometry: G('56dp, 64dp with 12dp separation, and the 3dp focus ring, all drawn at real size.'),
  },
  TextField: {
    Enabled: G('Persistent label above the field; help text below.'),
    Multiline: G('Says Enter adds a newline and that nothing sends from the field.'),
    WithError: G('Error is icon plus sentence; the border is a second signal, not the only one.'),
    DisabledWithReason: G('Field visibly disabled while the reason keeps full supporting contrast.'),
  },
  ThemeComparison: {
    SideBySide: G('Identical content and structure in both columns.'),
    Stacked: G('Same comparison at a narrow review width.'),
  },
  ThemeProvider: {
    OpenDay: G('Working baseline renders the full preview.'),
    BrightSignal: G('Challenger territory, identical markup.'),
    LargestTextScale: G('At 1.5x the recipient stays on one readable line; no column collapse.'),
    ReducedMotion: G('Static equivalents with every icon and word already correct.'),
  },
  Transcript: {
    HeardSoFar: G('Provisional text italic and labelled, visibly distinct from committed text.'),
    EditableFinal: G('Final text editable before use.'),
    ReadyToUse: G('Committed text with the interpretation control only.'),
    PartialAndFinal: G('Both states during hand-over, clearly separated.'),
  },
  TypeFoundation: {
    Scale: G('Every role with its sp values and weight.'),
    RunningText: G('A longer sentence shows wrapping and measure rather than a single line.'),
  },
};

let cells = 0;
for (const [name, gradeCells] of Object.entries(GRADES)) {
  writeFileSync(join(out, `${name}.grade.json`), JSON.stringify({ cells: gradeCells }, null, 2) + '\n');
  cells += Object.keys(gradeCells).length;
}
console.log(`wrote ${Object.keys(GRADES).length} grade files covering ${cells} cells`);
