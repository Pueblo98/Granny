/* Fictional, local-only fixtures for the Stage 1 browser design simulation. */
(function(root) {
"use strict";
const people = [
  {id : "david-family", name : "David", detail : "Brother"},
  {id : "david-garden", name : "David", detail : "Gardening group"},
  {id : "sophie-family", name : "Sophie", detail : "Daughter"},
  {id : "sophie-book", name : "Sophie", detail : "Book club"}
];
const channels = [ "Example Messages", "Example Mail" ];
// Explicit destination labels on the shared-state person rows, not inferred
// account preferences. Clicking a row chooses both of its written values.
const surfaceChannels = {'david-family': 'Example Messages', 'david-garden': 'Example Mail'};
const speechRequest = 'Tell David I’ll call after dinner.';
const photos = [
  // New result examples reuse honest local illustrations, not raster mockups.
  ...[
    ['book-seaside', 'Seaside path and blue water', '/assets/seaside.svg'],
    ['book-garden', 'Flowers beside a garden table', '/assets/garden.svg'],
    ['book-meal', 'A table prepared for dinner', '/assets/meal.svg']
  ].map(([id, description, asset]) => ({id, title: description, description,
    asset, sender: 'Sophie', detail: 'Book club', source: 'Example Messages', date: '2026-09-13'})),
  {
    id : "garden",
    title : "An afternoon in the garden",
    description : "A sunny garden table surrounded by flowers.",
    asset : "/assets/garden.svg",
    sender : "Sophie",
    detail : "Daughter",
    source : "Example Photos",
    date : "2026-09-13"
  },
  {
    id : "seaside",
    title : "A walk by the sea",
    description : "A bay, sailboat, and coastal path.",
    asset : "/assets/seaside.svg",
    sender : "Sophie",
    detail : "Daughter",
    source : "Example Photos",
    date : "2026-09-13"
  },
  {
    id : "meal",
    title : "Book club meal",
    description : "A table prepared for dinner.",
    asset : "/assets/meal.svg",
    sender : "Sophie",
    detail : "Book club",
    source : "Example Messages",
    date : "2026-09-12"
  }
];
const screens = [
  {
    id : "display-settings",
    title : "Confusing display settings",
    description :
        "A fictional display settings page with several similar text controls.",
    previousTarget : "A garden for every season",
    fields : [
      {label: 'Screen zoom', value: 'Standard', description: 'Changes the size of controls and content.'},
      {
        label : "Text size",
        value : "Standard",
        description : "Changes how large words appear."
      },
      {
        label : "Dark theme",
        value : "Off",
        description : "Uses darker screen colours."
      }
    ]
  },
  {
    id : "signin",
    title : "Sign-in screen",
    description : "A fictional account sign-in screen.",
    protected : true
  },
  {
    id : "unknown",
    title : "Unrecognized screen",
    description : "No trusted screen details are available.",
    unknown : true
  }
];
const tracks = [
  {
    id : "sinnerman",
    title : "Sinnerman",
    performer : "Nina Simone",
    source : "Example Music"
  },
  {
    id : "feeling-good",
    title : "Feeling Good",
    performer : "Nina Simone",
    source : "Example Music"
  },
  {
    id : "quiet-harbour",
    title : "Quiet Harbour",
    performer : "The Lantern Trio",
    source : "Example Music"
  }
];
const api = {
  readingArticle: 'A garden changes with the seasons. This short example is here only to demonstrate returning to reading.',
  playbackSample: {elapsed: 42, duration: 622, label: '0:42 / 10:22'},
  readingSample: 'Your next appointment is on Tuesday at 10:30.',
  textSizes: [{value: 1, label: 'Standard'}, {value: 1.15, label: 'Larger'},
    {value: 1.3, label: 'Larger still'}, {value: 1.5, label: 'Largest'}],
  people,
  channels,
  surfaceChannels,
  speechRequest,
  photos,
  screens,
  tracks
};
root.GrannyFixtures = api;
if (typeof module !== "undefined")
  module.exports = api;
})(globalThis);
