/* Shared create/edit form. Validation and stable identity belong to the store. */
(() => {
  'use strict';
  function mount(host, {room, save, cancel, manage}) {
    const form = document.createElement('form'); form.className = 'room-details-form'; form.noValidate = true;
    const add = (tag, text, cls) => { const n = document.createElement(tag); n.textContent = text; if (cls) n.className = cls; form.append(n); return n; };
    add('p', room ? 'Change how this room is named and described.' : 'An optional space for organizing related material around the same Granny assistant.');
    function field(id, label, value, multiline) {
      const l = add('label', label + ' (required)'); l.htmlFor = id;
      const input = document.createElement(multiline ? 'textarea' : 'input');
      input.id = id; input.value = value || ''; input.required = true;
      input.autocomplete = 'off'; input.maxLength = multiline ? 160 : 60;
      if (multiline) input.rows = 3;
      input.setAttribute('aria-describedby', 'room-form-error'); form.append(input); return input;
    }
    const name = field('room-create-name', 'Room name', room?.name);
    const purpose = field('room-create-purpose', 'Purpose', room?.purpose, true);
    add('h3', 'Preview');
    const preview = add('div', '', 'room-form-preview');
    const previewName = document.createElement('strong'), previewPurpose = document.createElement('p');
    preview.append(previewName, previewPurpose);
    const update = () => { previewName.textContent = name.value || 'Your room'; previewPurpose.textContent = purpose.value || 'What belongs here?'; };
    name.addEventListener('input', update); purpose.addEventListener('input', update); update();
    add('p', room ? 'Changing these details does not move or delete anything.' : 'Plain room · placeholder appearance. No new artwork or separate assistant is created.', 'notice');
    const error = add('p', '', 'form-error'); error.id = 'room-form-error'; error.setAttribute('role', 'alert');
    const actions = add('div', '', 'room-actions');
    const button = (text, fn, cls = '') => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = text; b.className = cls;
      b.addEventListener('click', fn); actions.append(b); return b;
    };
    const submit = () => {
      name.removeAttribute('aria-invalid'); purpose.removeAttribute('aria-invalid');
      try {
        if (!name.value.trim()) throw Error('Enter a room name.');
        if (!purpose.value.trim()) { purpose.setAttribute('aria-invalid', 'true'); throw Error('Enter a purpose.'); }
        save({name: name.value, purpose: purpose.value});
      } catch (e) {
        error.textContent = e.message;
        const invalid = purpose.getAttribute('aria-invalid') ? purpose : name;
        invalid.setAttribute('aria-invalid', 'true'); invalid.focus();
      }
    };
    button(room ? 'Save changes' : 'Create room', submit, 'primary').id = 'room-form-save';
    button('Cancel', cancel).id = 'room-form-cancel';
    form.addEventListener('submit', event => event.preventDefault());
    if (room && manage) {
      const section = add('div', '', 'room-management-route');
      const b = document.createElement('button'); b.type = 'button'; b.id = 'room-manage';
      b.textContent = 'Archive or delete room…'; b.addEventListener('click', manage); section.append(b);
    }
    host.append(form);
  }
  window.GrannyRoomCreate = {mount};
})();
