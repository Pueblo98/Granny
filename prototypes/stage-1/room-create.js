/* Bounded, local-only Context Room creation UI. The host owns room IDs,
 * persistence (if any), routing, and visual styling. */
(function(root) {
"use strict";

function text(value) { return String(value == null ? "" : value); }
function slug(value) {
  return text(value).toLowerCase().replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "collection";
}
function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}
function button(label, action, className) {
  const node = element("button", className || "", label);
  node.type = "button";
  node.addEventListener("click", action);
  return node;
}
function labelledInput(id, label, type, value) {
  const wrap = element("label", "create-option");
  const input = document.createElement("input");
  input.id = id;
  input.type = type;
  input.value = value;
  wrap.htmlFor = id;
  wrap.append(input, document.createTextNode(" " + label));
  return {wrap, input};
}

function normalizeCollections(room) {
  return Array.isArray(room && room.collections) ? room.collections.map(item => ({
    id: text(item.id || slug(item.label)), label: text(item.label || item.id),
    symbol: item.symbol || item.symbolAsset || item.asset || "", items: []
  })).filter(item => item.label) : [];
}
function normalizeMarks(rooms) {
  return rooms.slice(0, 3).map((room, index) => ({
    id: text(room.markId || room.mark?.id || room.id || "mark-" + (index + 1)),
    label: text(room.markLabel || room.mark?.label || room.name || "Room mark"),
    asset: typeof (room.markAsset || room.mark?.asset || room.mark) === "string"
      ? (room.markAsset || room.mark?.asset || room.mark) : ""
  }));
}

function mount(host, options) {
  if (!host) throw new Error("A room creation host is required.");
  options = options || {};
  const rooms = Array.isArray(options.rooms) ? options.rooms : [];
  const templates = rooms.slice(0, 3);
  const marks = normalizeMarks(templates);
  const starterSymbols = templates.flatMap(normalizeCollections);
  const symbolFor = pattern => starterSymbols.find(item => pattern.test(item.label))?.symbol || "";
  const genericCollections = [
    {id: "notes", label: "Notes", symbol: symbolFor(/notes/i), items: []},
    {id: "lists", label: "Lists", symbol: symbolFor(/lists/i), items: []},
    {id: "plans", label: "Plans", symbol: symbolFor(/plans/i), items: []}
  ];
  const draft = {
    template: templates[0]?.id || "blank", name: "", purpose: "",
    collectionIds: new Set(), markId: marks[0]?.id || "", accent: "sage"
  };
  let step = 1, error = "", destroyed = false, created = false,
      templateDefaults = {id: "", name: "", purpose: ""};

  function selectedTemplate() {
    return templates.find(room => room.id === draft.template) || null;
  }
  function availableCollections() {
    const seen = new Set();
    return [...normalizeCollections(selectedTemplate()), ...genericCollections]
      .filter(item => !seen.has(item.id) && seen.add(item.id));
  }
  function applyTemplate(room) {
    const previousDefaults = templateDefaults;
    draft.template = room ? room.id : "blank";
    if (room) {
      if (!draft.name || draft.name === previousDefaults.name) draft.name = text(room.name);
      if (!draft.purpose || draft.purpose === previousDefaults.purpose) draft.purpose = text(room.purpose);
      templateDefaults = {
        id: room.id, name: text(room.name), purpose: text(room.purpose)
      };
      draft.collectionIds = new Set(normalizeCollections(room).map(item => item.id));
      if (marks.some(mark => mark.id === (room.markId || room.mark?.id || room.id)))
        draft.markId = room.markId || room.mark?.id || room.id;
    } else {
      // Only erase text that this wizard supplied for the previous template.
      // A person’s edits remain available if they return to a template later.
      if (draft.name === previousDefaults.name) draft.name = "";
      if (draft.purpose === previousDefaults.purpose) draft.purpose = "";
      templateDefaults = {id: "", name: "", purpose: ""};
      draft.collectionIds = new Set();
    }
  }
  function focusHeading() {
    requestAnimationFrame(() => {
      const heading = host.querySelector(".create-step h1");
      if (heading) heading.focus({preventScroll: true});
    });
  }
  function actions(container, nextLabel) {
    const row = element("div", "room-actions");
    if (step > 1) row.append(button("Back", () => { error = ""; step--; render(); }));
    row.append(button("Cancel", cancel));
    if (nextLabel) {
      const nextButton = element("button", "primary", nextLabel);
      // A real submit control lets Enter advance an earlier step. The final
      // Create room control remains a plain button below, never an implicit
      // form submission.
      nextButton.type = "submit";
      row.append(nextButton);
    }
    container.append(row);
  }
  function cancel() {
    if (destroyed) return;
    destroyed = true;
    host.replaceChildren();
    if (typeof options.onCancel === "function") options.onCancel();
  }
  function next() {
    if (step === 2 && !draft.name.trim()) {
      error = "Enter a room name before continuing.";
      render();
      requestAnimationFrame(() => host.querySelector("#room-create-name")?.focus());
      return;
    }
    error = "";
    step++;
    render();
  }
  function renderTemplate(surface) {
    surface.append(element("p", "", "Choose a familiar starting point, or begin with an empty room. This only organizes material around the same Granny assistant."));
    const set = element("fieldset", "create-options");
    set.append(element("legend", "", "How would you like to begin?"));
    templates.forEach(room => {
      const choice = labelledInput("room-template-" + slug(room.id), room.name + " — " + text(room.purpose), "radio", room.id);
      choice.input.name = "room-template";
      choice.input.checked = draft.template === room.id;
      choice.input.addEventListener("change", () => { applyTemplate(room); render(false); });
      set.append(choice.wrap);
    });
    const blank = labelledInput("room-template-blank", "Start with a blank room", "radio", "blank");
    blank.input.name = "room-template";
    blank.input.checked = draft.template === "blank";
    blank.input.addEventListener("change", () => { applyTemplate(null); render(false); });
    set.append(blank.wrap);
    surface.append(set);
    actions(surface, "Next");
  }
  function renderName(surface) {
    surface.append(element("p", "", "Give this optional space a clear name. You can use Granny normally inside or outside it."));
    const nameLabel = element("label", "", "Room name");
    nameLabel.htmlFor = "room-create-name";
    const name = document.createElement("input");
    name.id = "room-create-name"; name.required = true; name.maxLength = 60;
    name.value = draft.name; name.autocomplete = "off";
    name.addEventListener("input", () => { draft.name = name.value; error = ""; });
    nameLabel.append(name);
    const purposeLabel = element("label", "", "Short purpose (optional)");
    purposeLabel.htmlFor = "room-create-purpose";
    const purpose = document.createElement("textarea");
    purpose.id = "room-create-purpose"; purpose.rows = 3; purpose.maxLength = 160;
    purpose.value = draft.purpose;
    purpose.addEventListener("input", () => { draft.purpose = purpose.value; });
    purposeLabel.append(purpose);
    surface.append(nameLabel, purposeLabel);
    actions(surface, "Next");
  }
  function renderCollections(surface) {
    surface.append(element("p", "", "Choose any collections that will help you browse directly. You may leave them all unchecked and begin with an empty room."));
    const set = element("fieldset", "create-options");
    set.append(element("legend", "", "Choose organization"));
    availableCollections().forEach(collection => {
      const choice = labelledInput("room-collection-" + slug(collection.id), collection.label, "checkbox", collection.id);
      choice.input.checked = draft.collectionIds.has(collection.id);
      choice.input.addEventListener("change", () => {
        if (choice.input.checked) draft.collectionIds.add(collection.id);
        else draft.collectionIds.delete(collection.id);
      });
      if (collection.symbol) {
        const image = document.createElement("img");
        image.src = collection.symbol; image.alt = ""; image.setAttribute("aria-hidden", "true");
        image.className = "collection-symbol";
        choice.wrap.append(image);
      }
      set.append(choice.wrap);
    });
    surface.append(set);
    actions(surface, "Next");
  }
  function renderAppearance(surface) {
    surface.append(element("p", "", "Appearance helps you recognize a room. It does not change Granny’s behavior."));
    const marksSet = element("fieldset", "create-options");
    marksSet.append(element("legend", "", "Choose a placeholder mark"));
    marks.forEach(mark => {
      const choice = labelledInput("room-mark-" + slug(mark.id), mark.label + " placeholder", "radio", mark.id);
      choice.input.name = "room-mark"; choice.input.checked = draft.markId === mark.id;
      choice.input.addEventListener("change", () => { draft.markId = mark.id; render(false); });
      if (typeof mark.asset === "string" && mark.asset) {
        const image = document.createElement("img");
        image.src = mark.asset; image.alt = ""; image.setAttribute("aria-hidden", "true");
        image.className = "room-mark-preview"; choice.wrap.append(image);
      }
      marksSet.append(choice.wrap);
    });
    const accents = element("fieldset", "create-options");
    accents.append(element("legend", "", "Choose a restrained accent"));
    [["sage", "Soft sage"], ["sand", "Warm sand"], ["blue", "Harbour blue"]].forEach(([id, label]) => {
      const choice = labelledInput("room-accent-" + id, label, "radio", id);
      choice.input.name = "room-accent"; choice.input.checked = draft.accent === id;
      choice.input.addEventListener("change", () => { draft.accent = id; render(false); });
      accents.append(choice.wrap);
    });
    const preview = element("aside", "creation-preview");
    preview.setAttribute("aria-label", "Room appearance preview");
    preview.dataset.accent = draft.accent;
    const selectedMark = marks.find(mark => mark.id === draft.markId);
    if (typeof selectedMark?.asset === "string" && selectedMark.asset) {
      const image = document.createElement("img");
      image.src = selectedMark.asset; image.alt = "";
      image.setAttribute("aria-hidden", "true"); image.className = "room-mark-preview";
      preview.append(image);
    }
    preview.append(element("strong", "", draft.name.trim() || "Your room"),
                   element("p", "", "Previewed against the Harbour Blue shell. The same Granny assistant is available here."));
    surface.append(marksSet, accents, preview);
    actions(surface, "Next");
  }
  function create() {
    if (created) return;
    const mark = marks.find(item => item.id === draft.markId) || marks[0] || {id: "", label: "Placeholder mark", asset: ""};
    const collectionById = new Map(availableCollections().map(item => [item.id, item]));
    const collections = [...draft.collectionIds].map(id => collectionById.get(id))
      .filter(Boolean).map(item => ({id: item.id, label: item.label, symbol: item.symbol, items: []}));
    const result = {name: draft.name.trim(), purpose: draft.purpose.trim(), mark: text(mark.asset), markLabel: mark.label, accent: draft.accent, collections};
    if (!result.name) { step = 2; error = "Enter a room name before creating the room."; render(); return; }
    created = true;
    if (typeof options.onCreate === "function") options.onCreate(result);
  }
  function renderReview(surface) {
    surface.append(element("p", "", "Review this fictional room before creating it. Nothing is created until you choose Create room."));
    const list = element("dl", "creation-review");
    const add = (term, value) => { list.append(element("dt", "", term), element("dd", "", value)); };
    add("Name", draft.name.trim());
    add("Purpose", draft.purpose.trim() || "No purpose added");
    add("Collections", [...draft.collectionIds].map(id => availableCollections().find(item => item.id === id)?.label).filter(Boolean).join(", ") || "No collections yet");
    add("Appearance", (marks.find(mark => mark.id === draft.markId)?.label || "Placeholder mark") + " · " + draft.accent);
    surface.append(list);
    const row = element("div", "room-actions");
    row.append(button("Back", () => { step--; render(); }), button("Cancel", cancel), button("Create room", create, "primary"));
    surface.append(row);
  }
  function render(focusStep = true) {
    if (destroyed) return;
    const priorId = !focusStep ? document.activeElement?.id : "";
    host.replaceChildren();
    const surface = element("section", "room-create create-step");
    surface.dataset.step = String(step);
    const heading = element("h1", "", ["Choose how to begin", "Name your room", "Choose organization", "Choose appearance", "Review and create"][step - 1]);
    heading.tabIndex = -1;
    surface.append(heading, element("p", "", "Step " + step + " of 5"));
    if (error) { const message = element("p", "create-error", error); message.setAttribute("role", "alert"); surface.append(message); }
    const form = document.createElement("form");
    form.noValidate = true;
    form.addEventListener("submit", event => {
      event.preventDefault();
      // Review has no submit control; Create room is explicitly type=button.
      if (step < 5) next();
    });
    if (step === 1) renderTemplate(form);
    else if (step === 2) renderName(form);
    else if (step === 3) renderCollections(form);
    else if (step === 4) renderAppearance(form);
    else renderReview(form);
    surface.append(form);
    host.append(surface);
    if (focusStep) focusHeading();
    else if (priorId) requestAnimationFrame(() => document.getElementById(priorId)?.focus({preventScroll: true}));
  }
  // The initially checked starter template must match the prefilled draft.
  applyTemplate(selectedTemplate());
  render();
  return {
    destroy: () => { destroyed = true; host.replaceChildren(); },
    getDraft: () => ({...draft, collectionIds: [...draft.collectionIds]})
  };
}

root.GrannyRoomCreate = {mount};
if (typeof module !== "undefined") module.exports = root.GrannyRoomCreate;
})(globalThis);
