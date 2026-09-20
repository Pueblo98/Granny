/* Fictional, in-memory Context Rooms state. No DOM, storage, or network use. */
(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.GrannyRoomsStore = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';

  const AVAILABILITY = new Set(['normal', 'empty', 'loading', 'offline', 'missing-art']);
  const copy = value => value == null ? value : JSON.parse(JSON.stringify(value));
  const normalized = value => String(value == null ? '' : value)
    .normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
  const membershipKey = membership => membership.roomId + '\u0000' + membership.collectionId;

  function create(suppliedFixture) {
    const fixture = suppliedFixture || globalThis.GrannyRoomFixtures;
    if (!fixture || !Array.isArray(fixture.rooms))
      throw new Error('A Rooms fixture with a rooms array is required.');

    const initialAvailability = fixture.availability || fixture.availabilityFixture || 'normal';
    if (!AVAILABILITY.has(initialAvailability))
      throw new Error('Unknown availability fixture: ' + initialAvailability);

    const originalRooms = new Map();
    const originalItems = new Map();
    const originalMemberships = new Map();
    function addItem(raw, membership) {
      if (!raw || !raw.id) throw new Error('Every fictional item needs a stable ID.');
      if (!originalItems.has(raw.id)) {
        const item = copy(raw);
        if (!item.type) item.type = 'fictional item';
        if (!item.provenance) item.provenance = 'local fictional fixture';
        if (!item.sensitivity) item.sensitivity = 'normal';
        if (!Number.isInteger(item.revision)) item.revision = 1;
        originalItems.set(raw.id, item);
      }
      if (membership) {
        const list = originalMemberships.get(raw.id) || [];
        if (!list.some(entry => membershipKey(entry) === membershipKey(membership)))
          list.push(copy(membership));
        originalMemberships.set(raw.id, list);
      }
    }
    const fixtureRoomNames = new Set();
    fixture.rooms.forEach(rawRoom => {
      if (!rawRoom || !rawRoom.id) throw new Error('Every fictional room needs a stable ID.');
      if (originalRooms.has(rawRoom.id)) throw new Error('Duplicate room ID: ' + rawRoom.id);
      if (!normalized(rawRoom.name)) throw new Error('Every fictional room needs a name.');
      if (fixtureRoomNames.has(normalized(rawRoom.name)))
        throw new Error('Duplicate room name: ' + rawRoom.name);
      fixtureRoomNames.add(normalized(rawRoom.name));
      const room = copy(rawRoom);
      room.archived = Boolean(room.archived);
      room.collections = (room.collections || []).map(rawCollection => {
        const collection = copy(rawCollection);
        (rawCollection.items || []).forEach(rawItem =>
          addItem(rawItem, {roomId: room.id, collectionId: collection.id}));
        delete collection.items;
        return collection;
      });
      originalRooms.set(room.id, room);
    });
    (fixture.systemItems || []).forEach(entry => {
      if (!entry || !entry.item) throw new Error('systemItems entries require an item.');
      if (entry.roomId && !originalRooms.has(entry.roomId))
        throw new Error('Unknown system item room: ' + entry.roomId);
      if (entry.roomId && !entry.collectionId)
        throw new Error('A system item room requires a collection ID.');
      if (entry.roomId && !originalRooms.get(entry.roomId).collections
        .some(collection => collection.id === entry.collectionId))
        throw new Error('Unknown system item collection: ' + entry.collectionId);
      addItem(entry.item, entry.roomId ? {roomId: entry.roomId, collectionId: entry.collectionId} : null);
    });

    let rooms, items, memberships, availability, revision, receipt, receiptSerial, roomSerial,
        generation = 0;
    function restoreInitial() {
      rooms = new Map([...originalRooms].map(([id, value]) => [id, copy(value)]));
      items = new Map([...originalItems].map(([id, value]) => [id, copy(value)]));
      memberships = new Map([...originalMemberships]
        .map(([id, value]) => [id, copy(value)]));
      availability = initialAvailability;
      if (availability === 'empty') {
        rooms.clear();
        memberships.clear();
      }
      revision = 0;
      receipt = null;
      receiptSerial = 0;
      roomSerial = 0;
    }
    restoreInitial();

    const assertRoom = id => {
      const room = rooms.get(id);
      if (!room) throw new Error('Unknown room: ' + id);
      return room;
    };
    const assertItem = id => {
      const item = items.get(id);
      if (!item) throw new Error('Unknown item: ' + id);
      return item;
    };
    const cloneMemberships = itemId => copy(memberships.get(itemId) || []);
    function retireReceipt() { receipt = null; }
    function changed() { revision += 1; retireReceipt(); }
    function collectionFor(room, collectionId) {
      return (room.collections || []).find(collection => collection.id === collectionId);
    }
    function ensureDestination(room) {
      if (room.archived) throw new Error('Archived rooms cannot receive items.');
      if (room.collections?.length) return room.collections[0].id;
      if (!room.custom) throw new Error('This room has no destination collection.');
      room.collections = [{id: 'items', label: 'Items'}];
      return 'items';
    }
    function projectedRoom(rawRoom) {
      const room = copy(rawRoom);
      room.collections = (room.collections || []).map(rawCollection => {
        const collection = copy(rawCollection);
        collection.items = [...items.values()]
          .filter(item => (memberships.get(item.id) || []).some(entry =>
            entry.roomId === room.id && entry.collectionId === collection.id))
          .map(copy);
        return collection;
      });
      return room;
    }
    function validateNameAndPurpose(value, currentId) {
      const name = value && value.name;
      const purpose = value && value.purpose;
      if (!normalized(name)) throw new Error('Room name is required.');
      if (!String(purpose == null ? '' : purpose).trim()) throw new Error('Room purpose is required.');
      const duplicate = [...rooms.values()].find(room =>
        room.id !== currentId && normalized(room.name) === normalized(name));
      if (duplicate) throw new Error('A room with that name already exists.');
    }
    function writeMemberships(itemId, next) {
      const unique = [];
      next.forEach(entry => {
        if (!entry || !entry.roomId || !entry.collectionId)
          throw new Error('A membership needs room and collection IDs.');
        if (!rooms.has(entry.roomId)) throw new Error('Unknown membership room: ' + entry.roomId);
        if (!collectionFor(rooms.get(entry.roomId), entry.collectionId))
          throw new Error('Unknown membership collection: ' + entry.collectionId);
        if (!unique.some(existing => membershipKey(existing) === membershipKey(entry)))
          unique.push({roomId: entry.roomId, collectionId: entry.collectionId});
      });
      if (unique.length) memberships.set(itemId, unique);
      else memberships.delete(itemId);
    }

    const api = {
      get rooms() { return [...rooms.values()].map(projectedRoom); },
      get activeRooms() { return [...rooms.values()].filter(room => !room.archived).map(projectedRoom); },
      get availability() { return availability; },
      get receipt() {
        return receipt && {id: receipt.id, itemId: receipt.itemId, itemTitle: receipt.itemTitle,
          before: copy(receipt.before), after: copy(receipt.after)};
      },
      item(id) { return copy(assertItem(id)); },
      room(id) { return projectedRoom(assertRoom(id)); },
      items() { return [...items.values()].map(copy); },
      memberships(id) { assertItem(id); return cloneMemberships(id); },
      roomNames(id) {
        assertItem(id);
        return [...new Set(cloneMemberships(id).map(entry => rooms.get(entry.roomId)?.name).filter(Boolean))];
      },
      collectionItems(roomId, collectionId) {
        assertRoom(roomId);
        if (!collectionFor(rooms.get(roomId), collectionId))
          throw new Error('Unknown collection: ' + collectionId);
        return [...items.values()].filter(item => (memberships.get(item.id) || []).some(entry =>
          entry.roomId === roomId && entry.collectionId === collectionId)).map(copy);
      },
      createRoom(value) {
        validateNameAndPurpose(value);
        let id;
        do { id = 'custom-' + generation + '-' + (++roomSerial); } while (rooms.has(id));
        const room = {id, name: value.name, purpose: value.purpose, custom: true, archived: false,
          collections: []};
        changed(); rooms.set(id, room);
        return projectedRoom(room);
      },
      updateRoom(id, value) {
        const room = assertRoom(id);
        const next = {name: Object.prototype.hasOwnProperty.call(value || {}, 'name') ? value.name : room.name,
          purpose: Object.prototype.hasOwnProperty.call(value || {}, 'purpose') ? value.purpose : room.purpose};
        validateNameAndPurpose(next, id);
        changed(); room.name = next.name; room.purpose = next.purpose;
        return projectedRoom(room);
      },
      organize(value) {
        const {itemId, operation, sourceRoomId, destinationRoomId} = value || {};
        assertItem(itemId);
        if (!['add', 'move', 'remove'].includes(operation)) throw new Error('Unknown organization operation.');
        const before = cloneMemberships(itemId);
        let after = cloneMemberships(itemId);
        const hasSource = sourceRoomId != null && after.some(entry => entry.roomId === sourceRoomId);
        if (['move', 'remove'].includes(operation) && !hasSource)
          throw new Error('The item is not in the selected source room.');
        if (operation === 'move' && sourceRoomId === destinationRoomId)
          throw new Error('Choose a different destination room.');
        if (operation !== 'remove') {
          const destination = assertRoom(destinationRoomId);
          if (after.some(entry => entry.roomId === destination.id))
            throw new Error('The item is already in the destination room.');
          const collectionId = ensureDestination(destination);
          const destinationEntry = {roomId: destination.id, collectionId};
          after.push(destinationEntry);
        }
        if (operation === 'move' || operation === 'remove')
          after = after.filter(entry => entry.roomId !== sourceRoomId);
        changed();
        writeMemberships(itemId, after);
        receipt = {id: 'organization-' + generation + '-' + (++receiptSerial), itemId, itemTitle: items.get(itemId).title,
          before, after: cloneMemberships(itemId), revision};
        return api.receipt;
      },
      undo(id) {
        if (!receipt || receipt.id !== id || receipt.revision !== revision) return false;
        writeMemberships(receipt.itemId, receipt.before);
        revision += 1; receipt = null;
        return true;
      },
      dismissReceipt() { receipt = null; },
      archive(id) { const room = assertRoom(id); changed(); room.archived = true; return projectedRoom(room); },
      restore(id) { const room = assertRoom(id); changed(); room.archived = false; return projectedRoom(room); },
      deleteRoom(id) {
        assertRoom(id); changed(); rooms.delete(id);
        [...memberships].forEach(([itemId, list]) => writeMemberships(itemId, list.filter(entry => entry.roomId !== id)));
      },
      deleteItems(ids) {
        if (!Array.isArray(ids) || !ids.length) throw new Error('Choose at least one item to delete.');
        [...new Set(ids)].forEach(assertItem);
        changed();
        [...new Set(ids)].forEach(id => { items.delete(id); memberships.delete(id); });
      },
      reset() { generation += 1; restoreInitial(); },
      setAvailability(next) {
        if (!AVAILABILITY.has(next)) throw new Error('Unknown availability fixture: ' + next);
        changed(); availability = next;
        if (next === 'empty') {
          rooms.clear();
          memberships.clear();
        }
      },
      resolveSource(currentRoomId, itemId, excludedIds) {
        const item = items.get(itemId);
        if (!item) return null;
        const excluded = new Set(excludedIds || []);
        if (excluded.has(itemId)) return {allowed: false, reason: 'excluded'};
        const membership = (memberships.get(itemId) || []).find(entry => entry.roomId === currentRoomId) ||
          (memberships.get(itemId) || [])[0];
        const sensitive = item.sensitive || item.sensitivity === 'private' || item.private === true;
        if (sensitive) return {allowed: false, roomId: membership?.roomId || 'trips',
          label: item.safeLabel || 'Passport details', reason: 'private'};
        if (!membership) return {allowed: true, itemId, roomId: null, collectionId: null,
          label: item.title, type: item.type || 'fictional item', provenance: item.provenance || 'local fictional fixture'};
        return {allowed: true, itemId, roomId: membership.roomId, collectionId: membership.collectionId,
          label: item.title, type: item.type || 'fictional item', provenance: item.provenance || 'local fictional fixture'};
      }
    };
    return api;
  }
  return {create};
}));
