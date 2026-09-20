/* Registered inline outcome views. No routes, services, storage or authority. */
(() => {
  'use strict';
  function create({state, node, button, dispatch, dismiss, announce}) {
    const F = window.GrannyFixtures;
    const dateLabel = value => ({'2026-09-13': 'Yesterday · 13 September 2026',
      '2026-09-14': 'Today · 14 September 2026', '2026-09-12': '12 September 2026'})[value] || value;
    const size = value => F.textSizes.find(x => x.value === value)?.label || String(value);
    const facts = rows => {
      const dl = node('dl', 'surface-facts');
      rows.forEach(([key, value]) => dl.append(node('dt', '', key), node('dd', '', value)));
      return dl;
    };
    function image(item, cls = '') {
      const wrap = node('div', 'outcome-image ' + cls), img = node('img');
      img.src = item.asset; img.alt = item.description;
      const fallback = node('p', 'art-fallback', 'Illustration unavailable. ' + item.description);
      fallback.hidden = true;
      img.addEventListener('error', () => { img.hidden = true; fallback.hidden = false; });
      wrap.append(img, fallback); return wrap;
    }
    function viewer(item, origin) {
      if (document.querySelector('dialog[open]')) return;
      const dialog = node('dialog', 'outcome-viewer'), heading = node('h2', '', 'Full-size fictional photo');
      heading.id = 'photo-viewer-heading'; heading.tabIndex = -1;
      dialog.setAttribute('aria-labelledby', heading.id);
      dialog.append(heading, node('p', '', `${item.sender} · ${item.detail} · ${item.source} · ${dateLabel(item.date)}`), image(item), node('p', '', item.description));
      const back = button('Back', () => dialog.close()); dialog.append(back);
      const scroll = scrollY;
      dialog.addEventListener('close', () => {
        dialog.remove();
        (origin.isConnected ? origin : document.getElementById('outcome-full-size'))?.focus({preventScroll: true});
        window.scrollTo(0, scroll);
      });
      dialog.addEventListener('keydown', event => {
        if (event.key === 'Tab') { event.preventDefault(); back.focus(); }
      });
      document.body.append(dialog); dialog.showModal(); heading.focus();
    }
    function supports(t) {
      return t && ((t.kind === 'photos' && ['completed', 'no-matches'].includes(t.stage) && t.result?.photos)
        || (t.kind === 'explain' && t.stage === 'completed' && t.result?.screen?.fields)
        || (t.kind === 'media' && t.result?.track && (t.stage === 'completed' || t.outcome === 'unavailable'))
        || (t.kind === 'readability' && (t.stage === 'size-preview' || (t.result?.scope === 'granny' && t.stage === 'completed'))));
    }
    function response(t) {
      if (t.kind === 'explain' && t.result?.next !== 'returned') return t.result?.view === 'guidance'
        ? 'Text size is the second option. I’ve highlighted it below.'
        : t.result?.option != null
        ? 'This is the tablet’s Display settings. Highlighted option: ' + t.result.screen.fields[t.result.option].label + '.'
        : 'This is the tablet’s Display settings. The highlighted section changes text size.';
      if (t.kind === 'media') return t.outcome === 'unavailable'
        ? 'Example Music isn’t available on this tablet.'
        : `${t.result.track.title} by ${t.result.track.performer} is ${state.playing ? 'playing' : 'paused'} in ${t.result.track.source}.`;
      if (t.kind === 'readability') return t.stage === 'size-preview'
        ? 'Here is a preview. Nothing has changed yet.' : t.result.restored
        ? 'The previous Granny text size is restored.' : 'Granny’s text size is now ' + size(state.scale) + '.';
      return t.text;
    }
    function render(t) {
      const version = t.version;
      const current = () => state.task === t && t.version === version;
      const r = t.result || {}, c = node('section', 'shared-task-surface outcome-module');
      c.dataset.outcomeModule = t.kind;
      const mode = t.kind === 'photos' ? (r.photos.length ? 'found' : 'no-result')
        : t.kind === 'explain' ? (r.next === 'returned' ? 'reading' : r.view || 'explanation')
        : t.kind === 'media' ? (t.outcome === 'unavailable' ? r.view || 'unavailable' : state.playing ? 'playing' : 'paused')
        : t.stage === 'size-preview' ? 'preview' : 'applied';
      c.dataset.outcomeState = mode;
      const title = t.kind === 'photos' ? (mode === 'found' ? 'Photos from ' + t.slots.person.name : 'No photos found')
        : t.kind === 'explain' ? (mode === 'guidance' ? 'Find Text size' : mode === 'reading' ? r.screen.previousTarget : 'Display settings explained')
        : t.kind === 'media' ? (['unavailable', 'source-choice', 'manual'].includes(mode) ? 'Music not started' : 'Now playing')
        : mode === 'preview' ? (state.previewScale > state.scale ? 'Preview larger text' : 'Preview text size') : r.restored ? 'Previous text size restored'
        : state.scale > r.previousScale ? 'Larger text applied' : 'Text size applied';
      const heading = node('h2', '', title); heading.id = 'surface-heading'; heading.tabIndex = -1;
      c.setAttribute('aria-labelledby', heading.id); c.append(heading);
      const actions = node('div', 'surface-actions');
      const action = (label, fn, id, primary = false) => {
        const b = button(label, () => { if (current()) fn(); }, primary ? 'primary' : '', id || label);
        if (id) b.id = id;
        actions.append(b); return b;
      };
      const change = (action, extra = {}) => dispatch('outcome', {taskId: t.id, version, action, ...extra});
      const done = () => action('Done', dismiss, 'surface-done');
      if (t.kind === 'photos') {
        const p = t.slots.person, source = r.photos[0]?.source || (p.detail === 'Book club' ? 'Example Messages' : 'Example Photos');
        c.append(node('p', 'outcome-provenance', `${p.name} · ${p.detail}`), node('p', 'outcome-provenance', dateLabel(t.slots.date)), node('p', 'outcome-provenance', source));
        if (mode === 'found') {
          const index = r.index || 0, item = r.photos[index];
          const layout = node('div', 'photo-layout'), provenance = node('div'), content = node('div');
          provenance.append(...c.children); content.append(image(item, 'photo-dominant'), node('p', '', item.description));
          layout.append(provenance, content); c.append(layout);
          const position = node('p', 'photo-position', `Photo ${index + 1} of ${r.photos.length}`);
          position.id = 'photo-position'; content.append(position);
          const move = next => {
            change('photo', {index: next});
            announce(`Photo ${next + 1} of ${r.photos.length}. ${r.photos[next].description}`);
          };
          for (const [label, delta, id] of [['Previous photo', -1, 'photo-previous'], ['Next photo', 1, 'photo-next']]) {
            const b = action(label, () => {
              if (index + delta >= 0 && index + delta < r.photos.length) move(index + delta);
            }, id, delta === 1);
            const disabled = index + delta < 0 || index + delta >= r.photos.length;
            b.setAttribute('aria-disabled', String(disabled));
            b.setAttribute('aria-describedby', 'photo-position');
            b.title = disabled ? (delta < 0 ? 'This is the first photo.' : 'This is the last photo.') : label;
          }
          const full = action('Open full size', () => viewer(item, full), 'outcome-full-size');
          if (r.uncertainDate) c.append(node('p', 'notice', 'The date is unverified in this fictional example.'));
          c.append(node('p', 'notice', 'Local fictional illustrations, not personal photographs.'));
        } else {
          c.append(node('p', '', 'The conversation was available, but it did not contain photos for the selected date.'));
          action('Change date', () => change('date'), 'photo-change-date', true);
          action('Choose another Sophie', () => change('person'), 'photo-change-person');
        }
        done();
      } else if (t.kind === 'explain') {
        c.append(node('p', 'outcome-provenance', 'Supplied fictional screen · captured for this request'), node('p', 'surface-outcome', 'Read only'));
        if (mode === 'reading') {
          c.append(node('p', '', 'Returned to this supplied fictional article. No other app was opened.'), node('p', '', F.readingArticle));
          done();
        } else {
          const layout = node('div', 'outcome-columns'), screen = node('figure', 'supplied-screen');
          screen.append(node('figcaption', '', 'Supplied example · Display settings'));
          r.screen.fields.forEach((field, index) => {
            const target = mode === 'guidance' ? field.label === 'Text size' : index === (r.option ?? 1);
            const row = node('div', 'supplied-row' + (target ? ' guidance-target' : ''));
            if (target && mode === 'guidance') row.append(node('span', 'guidance-number', '1'));
            row.append(node('strong', '', field.label), node('span', '', field.value));
            if (target) row.append(node('span', 'notice', mode === 'guidance' ? 'Guidance target — not selected' : 'Explained option'));
            screen.append(row);
          });
          const explanation = node('div', 'screen-explanation');
          if (mode === 'guidance') {
            const steps = node('ol');
            steps.append(node('li', '', 'Choose Text size.'), node('li', '', 'Use the larger example that feels comfortable.'));
            explanation.append(steps, node('p', '', 'Granny is only showing where it is. Nothing has changed.'));
            action('Back to explanation', () => change('explanation'), 'screen-explanation');
          } else {
            r.screen.fields.forEach(field => explanation.append(node('h3', '', field.label), node('p', '', field.description)));
            action('Explain text size', () => change('guidance'), 'screen-guidance', true);
            action('Explain another option', () => { change('option'); announce(r.screen.fields[r.option].label + '. ' + r.screen.fields[r.option].description); }, 'screen-option');
          }
          layout.append(screen, explanation); c.append(layout);
          action('Back to reading', () => { dispatch('submit', 'return'); }, 'screen-reading');
          action('Take over', dismiss, 'screen-takeover');
          c.append(node('p', 'notice', 'No screen was captured and no setting has changed. These are supplied fictional rows, not tablet controls.'));
        }
      } else if (t.kind === 'media') {
        c.append(facts([['Title', r.track.title], ['Artist', r.track.performer],
          [t.outcome === 'unavailable' ? 'Requested source' : 'Source', r.track.source],
          ['Status', t.outcome === 'unavailable' ? 'Service unavailable' : state.playing ? 'Playing' : 'Paused']]));
        if (t.outcome === 'unavailable') {
          c.append(node('p', '', 'No music was started. You can choose another available source or open your music apps yourself.'));
          if (mode === 'source-choice') {
            c.append(node('h3', '', 'Choose another source'), node('p', '', 'No other source is available in this local fixture. Nothing was selected or retried.'));
            action('Back', () => change('source-back'), 'media-source-back');
          } else if (mode === 'manual') c.append(node('p', '', 'Fictional manual handoff only. No app was opened. Choose and open your own music app outside this prototype.'));
          else action('Choose another source', () => change('sources'), 'media-sources', true);
          action('Open apps', () => change('manual'), 'media-manual');
        } else {
          const progress = node('progress'); progress.value = F.playbackSample.elapsed; progress.max = F.playbackSample.duration;
          progress.setAttribute('aria-label', 'Simulated playback position: 42 seconds of 10 minutes 22 seconds');
          c.append(progress, node('p', 'media-time', F.playbackSample.label), node('p', '', 'Sound on · silent simulation; no audio is produced.'));
          action(state.playing ? 'Pause' : 'Resume', () => dispatch('playback'), 'media-playback', true);
        }
        done();
      } else {
        const sample = value => {
          const p = node('p', 'preview-sample', F.readingSample);
          p.style.fontSize = (value / state.scale) + 'em'; return p;
        };
        if (mode === 'preview') {
          const comparison = node('div', 'outcome-columns text-comparison');
          for (const [label, value] of [['Current', state.scale], ['Preview', state.previewScale]]) {
            const section = node('section'); section.append(node('h3', '', `${label} — ${size(value)}`), sample(value)); comparison.append(section);
          }
          c.append(comparison);
          const sizes = F.textSizes, index = sizes.findIndex(x => x.value === state.previewScale);
          const chooser = node('div', 'size-chooser');
          for (const [label, delta] of [['Smaller', -1], ['Larger', 1]]) {
            const b = button(label, () => { if (current() && sizes[index + delta]) dispatch('setScale', sizes[index + delta].value); });
            b.disabled = !sizes[index + delta]; b.title = b.disabled ? 'This is the ' + (delta < 0 ? 'smallest' : 'largest') + ' Granny text size.' : label;
            chooser.append(b);
            if (delta < 0) chooser.append(node('output', '', `${size(state.previewScale)} · ${Math.round(state.previewScale * 100)}%`));
          }
          c.append(chooser, node('p', '', 'This changes Granny’s text only.'));
          const apply = action('Apply', () => dispatch('applyScale'), 'reading-apply', true); apply.dataset.action = 'apply';
          action('Cancel', dismiss, 'reading-cancel');
          action('Restore default', () => dispatch('setScale', 1), 'reading-default');
        } else {
          c.append(facts([['Changed', 'Granny’s text'], ['Previous size', size(r.previousScale)], ['Current size', size(state.scale)]]), sample(state.scale),
            node('p', '', 'Other apps and tablet settings were not changed.'), node('p', '', 'You can restore this from Menu later.'));
          if (!r.restored) action('Restore previous size', () => dispatch('restoreScale', {taskId: t.id, version}), 'reading-restore', true);
          done();
        }
      }
      c.append(actions); return c;
    }
    return {supports, render, response};
  }
  window.GrannyOutcomeUI = {create};
})();
