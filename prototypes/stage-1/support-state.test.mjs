import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {create} = require('./support-state.js');
let assertions = 0;
const equal = (actual, expected, message) => { assertions += 1; assert.equal(actual, expected, message); };
const deepEqual = (actual, expected, message) => { assertions += 1; assert.deepEqual(actual, expected, message); };

{
  const state = create();
  equal(state.records.length, 3, 'the deterministic Today fixture has three minimal rows');
  deepEqual(Object.keys(state.records[0]).sort(), ['evidence', 'id', 'kind', 'outcome', 'source', 'time', 'title'],
    'history records contain only the approved minimal fields');
  equal(state.summary('today-draft-opened').title, 'Draft opened');
  equal(state.summary('missing'), null);
  state.clearHistory();
  equal(state.records.length, 0, 'clearing is isolated to minimal records');
  equal(state.search('soup', {items: [], rooms: []}).some(result => result.id === 'search-shopping-list-prepared'), false,
    'clearing history also removes its separate safe search summary');
}

{
  const state = create({scale: 1});
  equal(state.stage('scale', 1.5), true);
  equal(state.prefs.scale, 1, 'staging leaves applied preference unchanged');
  equal(state.apply().scale, 1.5);
  state.stage('scale', 1.3);
  equal(state.restore().scale, 1.5, 'restore returns to the last applied value');
  equal(state.stage('speechSpeed', 'Fast'), false, 'unapproved preference values are rejected');
  equal(state.syncScale(1.15), true);
  equal(state.prefs.scale, 1.15);
  equal(state.stage('scale', 1.2), false, 'only the four selected scale fixtures are accepted');
  state.clearHistory(); state.stage('captions', false); state.reset();
  equal(state.records.length, 3, 'reset restores deterministic history');
  equal(state.prefs.captions, true, 'reset restores deterministic preferences');
}

{
  const state = create();
  equal(state.setup.staged.scale, 1.3, 'setup begins from the selected Large fixture');
  state.setupStep1(); state.nextSetup(); state.stageSetup('explanation', 'More detail');
  equal(state.backSetup().step, 1, 'setup Back retains staged choices');
  state.skipSetup();
  equal(state.setup.status, 'skipped');
  equal(state.prefs.explanation, 'Clear and brief', 'skip grants no preference or access');
  equal(state.reviewAccess(), false, 'reviewing access grants nothing');
  state.setupStep1(); state.nextSetup(); state.nextSetup(); state.completeSetup();
  equal(state.prefs.scale, 1.3, 'complete setup applies its explicit staged defaults');
  equal(state.prefs.explanation, 'Clear and brief', 'skip did not retain an abandoned staged setup choice');
  state.setupStep1(); state.nextSetup(); state.stageSetup('explanation', 'More detail'); state.nextSetup();
  equal(state.prefs.explanation, 'More detail', 'step two Continue commits the chosen setup preferences');
}

{
  const state = create();
  const sources = {
    items: [
      {id: 'vegetable-soup', title: 'Vegetable soup', body: 'private recipe body'},
      {id: 'soup-shopping', title: 'Soup shopping list', notes: 'private notes'},
      {id: 'tomato-soup', title: 'Tomato soup', body: 'must not enter global search'}
    ],
    rooms: [{id: 'kitchen', name: 'Kitchen', purpose: 'Recipes, lists and cooking plans',
      collections: [{id: 'recipes', items: [{id: 'vegetable-soup'}]}]}]
  };
  const soup = state.search('soup', sources);
  deepEqual(soup.map(result => result.id), [
    'vegetable-soup', 'soup-shopping', 'kitchen', 'search-shopping-list-prepared'
  ], 'soup uses the exact four admitted local fixtures');
  equal(soup.some(result => JSON.stringify(result).includes('private')), false,
    'search projections never copy fixture bodies or notes');
  equal(state.search('tomato', sources).length, 0, 'unadmitted fixture text is not indexed');
  equal(state.search('accessibility', sources)[0].id, 'setting-accessibility');
  equal(state.search('accessibility', sources)[0].route, 'text');
  equal(soup.at(-1).kind, 'history');
  sources.rooms[0].name = 'Kitchen renamed';
  equal(state.search('renamed', sources).some(result => result.id === 'kitchen'), true,
    'room result projects current Room names rather than a stale Kitchen label');
}

console.log('support state assertions passed: ' + assertions);
