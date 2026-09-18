import * as React from 'react';
import { MediaRow } from '@granny/design-system';

/** Playing. The app is named, not implied. */
export const Playing = () => (
  <MediaRow title="Kind of Blue" meta="Miles Davis — 1959" app="the music app" playing />
);

/** Paused. Controls are labelled words, not bare glyphs. */
export const Paused = () => (
  <MediaRow title="Kind of Blue" meta="Miles Davis — 1959" app="the music app" />
);

/** A long title wraps rather than truncating mid-word. */
export const LongTitle = () => (
  <div style={{ maxWidth: 340 }}>
    <MediaRow
      title="The Complete Recordings of the 1961 Village Vanguard Sessions"
      meta="Bill Evans Trio — remastered 2005"
      app="the music app"
    />
  </div>
);
