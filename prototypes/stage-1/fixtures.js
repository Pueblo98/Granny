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
    previousTarget : "A garden for every season"
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
