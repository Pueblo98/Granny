/* Fictional, local-only fixtures for the Stage 1 browser design simulation. */
(function (root) {
  "use strict";
  const people = [
    { id: "david-family", name: "David", detail: "Brother" },
    { id: "david-garden", name: "David", detail: "Gardening group" },
    { id: "sophie-family", name: "Sophie", detail: "Daughter" },
    { id: "sophie-book", name: "Sophie", detail: "Book club" }
  ];
  const channels = ["Example Messages", "Example Mail"];
  const api = { people, channels };
  root.GrannyFixtures = api;
  if (typeof module !== "undefined") module.exports = api;
})(globalThis);
