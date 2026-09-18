import * as React from 'react';
import { Icon } from '@granny/design-system';

/** The icons that carry state meaning, at the size they appear beside text. */
export const StateIcons = () => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center', fontSize: 32 }}>
    <Icon name="stop" label="Stop" />
    <Icon name="check" label="Done" />
    <Icon name="alert" label="Warning" />
    <Icon name="question" label="Unknown" />
    <Icon name="mic" label="Listening" />
    <Icon name="mic-off" label="Microphone off" />
  </div>
);

/** An icon always sits beside its word on an essential action. */
export const AlwaysWithItsWord = () => (
  <div className="ds-actions">
    <button type="button" className="ds-button ds-button--primary">
      <Icon name="mic" />
      <span>Talk</span>
    </button>
    <button type="button" className="ds-button ds-button--secondary">
      <Icon name="edit" />
      <span>Type a request</span>
    </button>
    <button type="button" className="ds-button ds-button--danger">
      <Icon name="trash" />
      <span>Delete</span>
    </button>
  </div>
);

/** Stroke weight across the permitted 2–2.5dp range. */
export const StrokeRange = () => (
  <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
    <Icon name="mic" size="48px" strokeWidth={2} />
    <Icon name="mic" size="48px" strokeWidth={2.25} />
    <Icon name="mic" size="48px" strokeWidth={2.5} />
  </div>
);
