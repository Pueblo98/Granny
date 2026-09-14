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
const photos = [
  {
    id : "garden",
    title : "Sophie in the garden",
    description : "Sophie beside yellow flowers.",
    asset : "assets/garden.svg",
    sender : "Sophie",
    detail : "Daughter",
    source : "Example Photos",
    date : "2026-09-13"
  },
  {
    id : "seaside",
    title : "At the seaside",
    description : "Sophie near the water.",
    asset : "assets/seaside.svg",
    sender : "Sophie",
    detail : "Daughter",
    source : "Example Photos",
    date : "2026-09-13"
  },
  {
    id : "meal",
    title : "Book club meal",
    description : "A table prepared for dinner.",
    asset : "assets/meal.svg",
    sender : "Sophie",
    detail : "Book club",
    source : "Example Messages",
    date : "2026-09-12"
  }
];
const screens = [
  {
    id : "article",
    title : "Garden article",
    description : "A fictional article with a share button.",
    previousTarget : "article"
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
  people,
  channels,
  photos,
  screens,
  tracks
};
root.GrannyFixtures = api;
if (typeof module !== "undefined")
  module.exports = api;
})(globalThis);
