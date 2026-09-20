import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {create} = require('./rooms-store.js');
const fixtures = require('./room-fixtures.js');
let assertions = 0;
const equal = (actual, expected, message) => { assertions += 1; assert.equal(actual, expected, message); };
const deepEqual = (actual, expected, message) => { assertions += 1; assert.deepEqual(actual, expected, message); };

function throws(fn, text) {
  assertions += 1;
  assert.throws(fn, error => error instanceof Error && error.message.includes(text));
}

{
  const store = create(fixtures);
  equal(store.rooms.length, 6);
  equal(store.activeRooms.length, 6);
  equal(store.item('vegetable-soup').title, 'Vegetable soup');
  equal(store.item('vegetable-soup').type, 'Recipe');
  equal(store.item('vegetable-soup').provenance, 'local fictional fixture');
  equal(store.item('vegetable-soup').sensitivity, 'normal');
  equal(store.item('vegetable-soup').revision, 1);
  deepEqual(store.roomNames('vegetable-soup'), ['Kitchen']);
  equal(store.collectionItems('kitchen', 'recipes').length, 3);
  equal(store.memberships('vegetable-soup')[0].collectionId, 'recipes');
  const projected = store.room('kitchen');
  projected.collections[0].items.length = 0;
  equal(store.collectionItems('kitchen', 'recipes').length, 3, 'getters are isolated');
}

{
  const store = create(fixtures);
  throws(() => store.createRoom({name: '   ', purpose: 'x'}), 'name is required');
  throws(() => store.createRoom({name: 'Music', purpose: ' '}), 'purpose is required');
  throws(() => store.createRoom({name: ' KITCHEN ', purpose: 'Duplicate'}), 'already exists');
  const music = store.createRoom({name: '  Music  ', purpose: ' Albums and notes  '});
  equal(music.name, '  Music  ');
  equal(music.purpose, ' Albums and notes  ');
  equal(music.custom, true);
  const updated = store.updateRoom(music.id, {name: 'Music room', purpose: 'Exact purpose'});
  equal(updated.name, 'Music room');
  throws(() => store.updateRoom(music.id, {name: 'Trips', purpose: 'Exact purpose'}), 'already exists');
}

{
  const store = create(fixtures);
  const music = store.createRoom({name: 'Music', purpose: 'Albums and notes'});
  const added = store.organize({itemId: 'vegetable-soup', operation: 'add', destinationRoomId: music.id});
  deepEqual(added.before, [{roomId: 'kitchen', collectionId: 'recipes'}]);
  deepEqual(added.after, [
    {roomId: 'kitchen', collectionId: 'recipes'}, {roomId: music.id, collectionId: 'items'}
  ]);
  equal(store.collectionItems(music.id, 'items')[0].id, 'vegetable-soup');
  equal(store.undo(added.id), true);
  deepEqual(store.roomNames('vegetable-soup'), ['Kitchen']);
  equal(store.undo(added.id), false, 'a used receipt cannot replay');

  const moved = store.organize({itemId: 'vegetable-soup', operation: 'move', sourceRoomId: 'kitchen', destinationRoomId: 'trips'});
  deepEqual(store.roomNames('vegetable-soup'), ['Trips']);
  store.archive('trips');
  equal(store.undo(moved.id), false, 'a later revision retires Undo');
  store.restore('trips');
  const removed = store.organize({itemId: 'vegetable-soup', operation: 'remove', sourceRoomId: 'trips'});
  deepEqual(store.memberships('vegetable-soup'), []);
  equal(store.items().some(item => item.id === 'vegetable-soup'), true, 'remove keeps canonical item');
  equal(store.undo(removed.id), true);
  throws(() => store.organize({itemId: 'vegetable-soup', operation: 'move', sourceRoomId: 'garden', destinationRoomId: 'trips'}), 'not in the selected source');
}

{
  const store = create(fixtures);
  throws(() => store.organize({itemId: 'vegetable-soup', operation: 'add', destinationRoomId: 'kitchen'}), 'already in the destination');
  throws(() => store.organize({itemId: 'vegetable-soup', operation: 'move', sourceRoomId: 'kitchen', destinationRoomId: 'kitchen'}), 'different destination');
  const old = store.organize({itemId: 'vegetable-soup', operation: 'move', sourceRoomId: 'kitchen', destinationRoomId: 'trips'});
  store.reset();
  const fresh = store.organize({itemId: 'vegetable-soup', operation: 'move', sourceRoomId: 'kitchen', destinationRoomId: 'trips'});
  assertions += 1; assert.notEqual(old.id, fresh.id, 'reset cannot make an old receipt ID valid again');
  equal(store.undo(old.id), false);
}

{
  const store = create(fixtures);
  store.archive('kitchen');
  equal(store.activeRooms.some(room => room.id === 'kitchen'), false);
  equal(store.items().some(item => item.id === 'vegetable-soup'), true);
  store.restore('kitchen');
  equal(store.activeRooms.some(room => room.id === 'kitchen'), true);
  store.deleteRoom('kitchen');
  equal(store.roomNames('vegetable-soup').length, 0);
  equal(store.items().some(item => item.id === 'vegetable-soup'), true);
  store.deleteItems(['vegetable-soup', 'tomato-pasta']);
  equal(store.items().some(item => item.id === 'vegetable-soup'), false);
  throws(() => store.deleteItems([]), 'at least one');
}

{
  const empty = create({...fixtures, availability: 'empty'});
  equal(empty.availability, 'empty');
  equal(empty.rooms.length, 0);
  equal(empty.items().length > 0, true, 'empty retains canonical fixture items');
  empty.setAvailability('offline');
  equal(empty.availability, 'offline');
  throws(() => empty.setAvailability('online'), 'Unknown availability');
  empty.reset();
  equal(empty.availability, 'empty');
  equal(empty.rooms.length, 0);
  const normal = create(fixtures);
  normal.setAvailability('empty');
  equal(normal.rooms.length, 0, 'switching to empty clears room organization');
  equal(normal.items().length > 0, true, 'switching to empty keeps canonical items');
}

{
  const fixture = {
    rooms: [{id: 'kitchen', name: 'Kitchen', purpose: 'Recipes', collections: [{id: 'recipes', label: 'Recipes', items: []}, {id: 'notes', label: 'Notes', items: []}]},
      {id: 'trips', name: 'Trips', purpose: 'Plans', collections: [{id: 'lists', label: 'Lists', items: []}]}],
    systemItems: [
      {item: {id: 'packing', title: 'Weekend packing list', type: 'list', provenance: 'fictional'}, roomId: 'trips', collectionId: 'lists'},
      {item: {id: 'packing', title: 'Weekend packing list', type: 'list', provenance: 'fictional'}, roomId: 'kitchen', collectionId: 'recipes'},
      {item: {id: 'multi', title: 'Multi-room note'}, roomId: 'kitchen', collectionId: 'recipes'},
      {item: {id: 'multi', title: 'Multi-room note'}, roomId: 'kitchen', collectionId: 'notes'},
      {item: {id: 'passport', title: 'Not safe to reveal', sensitive: true, safeLabel: 'Passport details', body: 'must not leak'}, roomId: 'trips', collectionId: 'lists'}
    ]
  };
  const store = create(fixture);
  deepEqual(store.resolveSource('kitchen', 'packing'), {
    allowed: true, itemId: 'packing', roomId: 'kitchen', collectionId: 'recipes',
    label: 'Weekend packing list', type: 'list', provenance: 'fictional'
  });
  deepEqual(store.resolveSource('kitchen', 'passport'), {
    allowed: false, roomId: 'trips', label: 'Passport details', reason: 'private'
  });
  deepEqual(store.resolveSource('kitchen', 'packing', ['packing']), {allowed: false, reason: 'excluded'});
  store.organize({itemId: 'multi', operation: 'move', sourceRoomId: 'kitchen', destinationRoomId: 'trips'});
  deepEqual(store.memberships('multi'), [{roomId: 'trips', collectionId: 'lists'}],
    'moving a source Room removes all of its collection memberships');
}

{
  globalThis.GrannyRoomFixtures = fixtures;
  equal(create().rooms.length, 6, 'browser default fixture resolves from globalThis');
  delete globalThis.GrannyRoomFixtures;
  throws(() => create(), 'fixture');
  throws(() => create({rooms: [
    {id: 'one', name: 'Same', purpose: 'One', collections: []},
    {id: 'two', name: '  same ', purpose: 'Two', collections: []}
  ]}), 'Duplicate room name');
}

console.log('rooms store assertions passed: ' + assertions);
