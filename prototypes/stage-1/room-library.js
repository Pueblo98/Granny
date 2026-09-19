/* Direct, local Rooms library. It only renders supplied fictional fixtures;
 * routing and any room state remain owned by the caller. */
(function(root) {
"use strict";

const text = value => String(value == null ? "" : value);
const slug = value => text(value).replace(/[^A-Za-z0-9_-]+/g, "-");
function el(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}
function action(id, label, handler, className) {
  const node = el("button", className || "", label);
  node.type = "button";
  if (id) node.id = id;
  node.addEventListener("click", handler);
  return node;
}
function artSlot(src, className) {
  const slot = el("span", "art-slot " + className);
  if (!src) return slot;
  const image = el("img", className + "-image");
  image.src = src;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  image.addEventListener("error", () => image.remove(), {once: true});
  slot.append(image);
  return slot;
}
function itemsFor(rooms, onlyUnfiled) {
  const result = [];
  rooms.forEach(room => (room.collections || []).forEach(collection => {
    if (onlyUnfiled && collection.id !== "unfiled") return;
    (collection.items || []).forEach(item => result.push({room, collection, item}));
  }));
  return result;
}
function matches(value, query) {
  return !query || text(value).toLowerCase().includes(query.toLowerCase());
}

function render(host, options) {
  if (!host) throw new Error("A Rooms library host is required.");
  options = options || {};
  const rooms = Array.isArray(options.rooms) ? options.rooms : [];
  let mode = "rooms", query = "", destroyed = false;

  const invoke = (callback, ...args) => {
    if (typeof callback === "function") callback(...args);
  };
  function resultRow(record) {
    const {room, collection, item} = record;
    const row = action("library-item-" + slug(room.id) + "-" + slug(collection.id) + "-" + slug(item.id), "", () =>
      invoke(options.onOpenItem, room.id, collection.id, item.id), "library-item-result");
    row.dataset.roomId = room.id;
    row.dataset.collectionId = collection.id;
    row.dataset.itemId = item.id;
    row.append(el("strong", "", text(item.title)),
      el("span", "", text(item.summary)),
      el("small", "", text(room.name) + " · " + text(collection.label)));
    return row;
  }
  function roomEntry(room) {
    const entry = action("library-room-" + room.id, "", () => invoke(options.onOpenRoom, room.id), "library-entry");
    entry.dataset.roomId = room.id;
    entry.append(artSlot(room.portrait, "library-portrait"));
    const copy = el("span", "library-copy");
    copy.append(artSlot(room.mark, "room-mark"));
    copy.append(el("strong", "", text(room.name)),
      el("span", "", text(room.purpose) || "An optional space for related material."));
    entry.append(copy);
    return entry;
  }
  function renderResults(container) {
    const source = mode === "unfiled" ? itemsFor(rooms, true) : itemsFor(rooms, false);
    const matchingRooms = mode === "search" ? rooms.filter(room =>
      matches(text(room.name) + " " + text(room.purpose), query)) : [];
    const filtered = source.filter(record => {
      const haystack = [record.room.name, record.room.purpose, record.collection.label,
        record.item.title, record.item.summary].join(" ");
      return matches(haystack, query);
    });
    const heading = mode === "unfiled"
      ? "Unfiled items" : query ? "Search results" : "All fictional items";
    container.append(el("h2", "", heading));
    if (matchingRooms.length) {
      const roomHeading = el("h3", "", "Matching rooms");
      const roomList = el("div", "room-library-list");
      matchingRooms.forEach(room => roomList.append(roomEntry(room)));
      container.append(roomHeading, roomList);
    }
    const status = el("p", "notice");
    status.setAttribute("role", "status");
    status.textContent = filtered.length
      ? filtered.length + (filtered.length === 1 ? " fictional item" : " fictional items")
      : "No fictional items match this view.";
    container.append(status);
    if (filtered.length) {
      const rows = el("div", "library-item-results");
      filtered.forEach(record => rows.append(resultRow(record)));
      container.append(rows);
    } else {
      const empty = el("p", "library-empty", mode === "unfiled"
        ? "Nothing is unfiled in these fictional rooms. Items without a certain place can stay here until you choose where they belong."
        : query ? "Try another word, or return to the room list."
        : "These fictional rooms have no browseable items yet.");
      container.append(empty);
    }
  }
  function draw(focusAfter, preserveSearch = false) {
    if (destroyed) return;
    const active = document.activeElement;
    const selection = preserveSearch && active?.id === "library-search"
      ? [active.selectionStart, active.selectionEnd] : null;
    const scrollPosition = preserveSearch ? window.scrollY : null;
    host.replaceChildren();
    const section = el("section", "room-library");
    const heading = el("h1", "", "Rooms");
    heading.tabIndex = -1;
    section.append(heading,
      el("p", "room-intro", "Rooms bring related things closer. The same Granny assistant is available everywhere."));

    const searchLabel = el("label", "room-library-search-label", "Search all");
    searchLabel.htmlFor = "library-search";
    const search = document.createElement("input");
    search.id = "library-search";
    search.type = "search";
    search.value = query;
    search.placeholder = "Find a fictional room or item";
    search.setAttribute("aria-describedby", "library-search-help");
    search.addEventListener("input", () => {
      query = search.value;
      // A search always shows matching items and source cues, without asking
      // the assistant or using any cross-room retrieval.
      mode = query ? "search" : "rooms";
      draw("library-search", true);
    });
    searchLabel.append(search);
    const searchHelp = el("p", "notice", "Searches these local fictional examples only.");
    searchHelp.id = "library-search-help";
    section.append(searchLabel, searchHelp);

    const create = action("create-room", "Create a room", () => invoke(options.onCreate), "text-button");
    const direct = el("nav", "room-actions");
    direct.setAttribute("aria-label", "Room library navigation");
    const all = action("library-all-items", "All items", () => {
      mode = "all"; query = ""; draw("library-all-items");
      invoke(options.announce, "Showing all fictional room items.");
    }, "text-button");
    all.setAttribute("aria-pressed", String(mode === "all"));
    const unfiled = action("library-unfiled", "Unfiled", () => {
      mode = "unfiled"; query = ""; draw("library-unfiled");
      invoke(options.announce, "Showing unfiled fictional room items.");
    }, "text-button");
    unfiled.setAttribute("aria-pressed", String(mode === "unfiled"));
    direct.append(all, unfiled);
    if (mode !== "rooms") direct.append(action("library-back-to-rooms", "Back to room list", () => {
      mode = "rooms"; query = ""; draw("library-search");
    }, "text-button"));
    direct.append(action("library-home", "Back to Home", () => invoke(options.onHome), "text-button"));
    section.append(create, direct);
    if (mode === "rooms") {
      const list = el("div", "room-library-list");
      if (rooms.length) rooms.forEach(room => list.append(roomEntry(room)));
      else list.append(el("p", "library-empty", "No rooms are available in this fictional fixture. Home can still handle ordinary questions."));
      section.append(list);
    } else {
      const results = el("section", "library-results");
      results.id = "library-search-results";
      results.setAttribute("aria-label", mode === "unfiled" ? "Unfiled fictional items" : "Search results");
      renderResults(results);
      section.append(results);
    }

    host.append(section);
    if (focusAfter) requestAnimationFrame(() => {
      const target = document.getElementById(focusAfter);
      target?.focus({preventScroll: true});
      if (selection && target && typeof target.setSelectionRange === "function")
        target.setSelectionRange(...selection);
      if (scrollPosition != null) window.scrollTo(0, scrollPosition);
    });
    else requestAnimationFrame(() => heading.focus({preventScroll: true}));
  }
  draw();
  return {destroy: () => { destroyed = true; host.replaceChildren(); }};
}

root.GrannyRoomLibrary = {render};
if (typeof module !== "undefined") module.exports = root.GrannyRoomLibrary;
})(globalThis);
