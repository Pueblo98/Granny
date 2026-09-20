/* One native modal at a time. Temporary organization is not a place route. */
(() => {
  'use strict';
  function create() {
    const dialog = document.createElement('dialog');
    dialog.id = 'rooms-dialog'; dialog.className = 'rooms-dialog';
    dialog.setAttribute('aria-labelledby', 'rooms-dialog-heading');
    document.body.append(dialog);
    let origin, originId, position = 0;
    const close = (restore = true) => {
      if (!dialog.open) return;
      dialog.close(); dialog.replaceChildren();
      if (restore) {
        const target = origin?.isConnected ? origin : document.getElementById(originId);
        (target || document.getElementById('request'))?.focus({preventScroll: true});
        window.scrollTo(0, position);
      }
    };
    const show = (title, build, sheet = false, invoker) => {
      if (!dialog.open) {
        if (document.querySelector('dialog[open]')) return;
        origin = invoker || document.activeElement; originId = origin?.id; position = scrollY;
      }
      dialog.classList.toggle('room-sheet', sheet); dialog.replaceChildren();
      const heading = document.createElement('h2');
      heading.id = 'rooms-dialog-heading'; heading.textContent = title; heading.tabIndex = -1;
      dialog.append(heading); build(dialog);
      if (!dialog.open) dialog.showModal();
      dialog.scrollTop = 0; heading.focus({preventScroll: true});
    };
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('button, input, textarea, select, [tabindex="0"]')]
        .filter(n => !n.disabled && n.getClientRects().length);
      const first = controls[0], last = controls.at(-1), active = document.activeElement;
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (active === first || !controls.includes(active))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
    });
    return {show, close, get open() { return dialog.open; }};
  }
  window.GrannyRoomDialog = {create};
})();
