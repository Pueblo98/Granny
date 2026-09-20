/* Fictional support-surface state. No DOM, storage, network, or task bodies. */
(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.GrannySupportState = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';

  const copy = value => JSON.parse(JSON.stringify(value));
  const HISTORY = Object.freeze([
    {id: 'today-draft-opened', kind: 'message-draft', title: 'Draft opened',
      outcome: 'Prepared — not sent', time: '10:42', source: 'Example Messages',
      evidence: 'prepared'},
    {id: 'today-photos-sophie', kind: 'photos', title: 'Photos from Sophie',
      outcome: 'No photos found', time: '09:15', source: 'Example Messages',
      evidence: 'no-result'},
    {id: 'today-text-size', kind: 'readability', title: 'Text size changed',
      outcome: 'Large · restored available', time: '08:30', source: 'Granny',
      evidence: 'changed'}
  ]);
  const TASK_SUMMARY = Object.freeze({
    id: 'search-shopping-list-prepared', kind: 'history',
    title: 'Shopping list prepared', detail: 'Vegetable soup · Today 09:15',
    route: 'today'
  });
  const SETTINGS = Object.freeze([
    {id: 'setting-accessibility', kind: 'setting', title: 'Accessibility',
      detail: 'Text size, speech and captions', route: 'text'},
    {id: 'setting-privacy', kind: 'setting', title: 'Privacy and data',
      detail: 'Minimal task history and local data', route: 'privacy'}
  ]);
  const scales = new Set([1, 1.15, 1.3, 1.5]);
  const speeds = new Set(['Slower', 'Normal', 'Faster']);
  const explanations = new Set(['Clear and brief', 'More detail']);

  function preferences(scale) {
    return {scale, speechSpeed: 'Normal', reducedMotion: true, captions: true,
      explanation: 'Clear and brief'};
  }
  function setupPreferences() {
    return {scale: 1.3, speechSpeed: 'Normal', reducedMotion: true, captions: true,
      explanation: 'Clear and brief'};
  }
  function valid(key, value) {
    if (key === 'scale') return scales.has(value);
    if (key === 'speechSpeed') return speeds.has(value);
    if (key === 'reducedMotion' || key === 'captions') return typeof value === 'boolean';
    if (key === 'explanation') return explanations.has(value);
    return false;
  }
  function text(value) { return String(value == null ? '' : value).trim().toLocaleLowerCase(); }
  function matches(query, values) { return values.some(value => text(value).includes(query)); }

  function create({scale = 1, historyFixture = 'default'} = {}) {
    if (!Number.isFinite(scale) || scale <= 0) throw new Error('scale must be positive');
    if (!['default', 'empty', 'failed-read'].includes(historyFixture))
      throw new Error('Unknown history fixture: ' + historyFixture);

    const initial = {scale, historyFixture};
    let applied = preferences(scale), staged = copy(applied), previous = copy(applied);
    let setup = {step: 0, status: 'not-needed', staged: setupPreferences()};
    let records = historyFixture === 'default' ? copy(HISTORY) : [];
    let searchSummaryAvailable = historyFixture === 'default';

    const api = {
      get prefs() { return copy(applied); },
      get applied() { return copy(applied); },
      get staged() { return copy(staged); },
      get setup() { return copy(setup); },
      get records() { return copy(records); },
      get historyFixture() { return historyFixture; },

      stage(key, value) {
        if (!valid(key, value)) return false;
        staged[key] = value;
        return true;
      },
      syncScale(nextScale) {
        if (!valid('scale', nextScale)) return false;
        applied.scale = nextScale;
        staged.scale = nextScale;
        previous.scale = nextScale;
        return true;
      },
      apply() {
        previous = copy(applied);
        applied = copy(staged);
        return copy(applied);
      },
      restore() {
        staged = copy(applied);
        return copy(staged);
      },

      setupStep1() {
        setup.status = 'in-progress'; setup.step = 1;
        return copy(setup);
      },
      nextSetup() {
        if (setup.status === 'not-needed') api.setupStep1();
        if (setup.step === 2) {
          applied = copy(setup.staged);
          staged = copy(applied);
          previous = copy(applied);
        }
        if (setup.step < 3) setup.step += 1;
        return copy(setup);
      },
      backSetup() {
        if (setup.status === 'in-progress' && setup.step > 1) setup.step -= 1;
        return copy(setup);
      },
      skipSetup() {
        applied = preferences(initial.scale); staged = copy(applied);
        setup.status = 'skipped'; setup.step = 0; setup.staged = setupPreferences();
        return copy(setup);
      },
      completeSetup() {
        if (setup.status === 'not-needed') api.setupStep1();
        applied = copy(setup.staged); staged = copy(applied); previous = copy(applied);
        setup.status = 'complete'; setup.step = 0;
        return copy(applied);
      },
      stageSetup(key, value) {
        if (!valid(key, value)) return false;
        setup.staged[key] = value;
        return true;
      },
      reviewAccess() { return false; }, // A review never grants a simulated permission.

      clearHistory() { records = []; searchSummaryAvailable = false; },
      summary(id) {
        if (id === TASK_SUMMARY.id && searchSummaryAvailable) return copy(TASK_SUMMARY);
        const record = records.find(entry => entry.id === id);
        return record ? copy(record) : null;
      },
      search(query, {items = [], rooms = []} = {}) {
        const needle = text(query);
        if (!needle) return [];
        const results = [];
        // Only these fixture IDs are admitted. Never inspect body, notes, or private fields.
        const admittedItems = new Set(['vegetable-soup', 'soup-shopping']);
        for (const raw of items) {
          if (!raw || !admittedItems.has(raw.id) || raw.private || raw.sensitive ||
              raw.sensitivity === 'private') continue;
          const membership = rooms.find(room => room && (room.collections || []).some(collection =>
            (collection.items || []).some(item => item && item.id === raw.id)));
          const room = membership && !membership.archived ? membership : null;
          const title = String(raw.title || '');
          const type = String(raw.type || 'Item');
          const detail = type + ' · ' + (room ? String(room.name || 'Room') : 'Unfiled');
          if (matches(needle, [title, type, room?.name, room?.purpose]))
            results.push({id: raw.id, kind: 'saved-item', title, detail,
              route: room ? 'room:' + room.id : 'all-items'});
        }
        // Kitchen is intentionally associated with the admitted soup fixture.
        for(const room of rooms) if(room && !room.archived && matches(needle,[room.name,room.purpose,room.id==='kitchen'?'soup':'']))
          results.push({id:room.id,kind:'room',title:String(room.name),detail:String(room.purpose),route:'room:'+room.id});
        if (searchSummaryAvailable && matches(needle, [TASK_SUMMARY.title, TASK_SUMMARY.detail, 'soup']))
          results.push(copy(TASK_SUMMARY));
        for (const setting of SETTINGS)
          if (matches(needle, [setting.title, setting.detail])) results.push(copy(setting));
        return results;
      },
      reset() {
        applied = preferences(initial.scale);
        staged = copy(applied);
        previous = copy(applied);
        setup = {step: 0, status: 'not-needed', staged: setupPreferences()};
        records = initial.historyFixture === 'default' ? copy(HISTORY) : [];
        searchSummaryAvailable = initial.historyFixture === 'default';
        return copy(applied);
      }
    };
    return api;
  }
  return {create};
}));
