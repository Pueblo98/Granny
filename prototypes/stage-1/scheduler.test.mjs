import test from 'node:test';
import assert from 'node:assert/strict';
import P from './model.js';
import S from './scheduler.js';

function harness() {
  let clock = 0, next = 0;
  const queue = new Map(), captured = [];
  const state = P.create();
  const scheduler = S.create({
    getState: () => state, dispatch: (...args) => P.dispatch(state, ...args),
    now: () => clock,
    setTimeout: (fn, ms) => { const id = ++next; queue.set(id, { fn, due: clock + ms }); captured.push(fn); return id; },
    clearTimeout: id => queue.delete(id)
  });
  const act = (event, value) => { scheduler.elapse(); const changed = P.dispatch(state, event, value); scheduler.sync(); return changed; };
  const advance = ms => {
    const end = clock + ms;
    for (let i = 0; i < 100; i++) {
      const entry = [...queue].sort((a, b) => a[1].due - b[1].due)[0];
      if (!entry || entry[1].due > end) { clock = end; return; }
      clock = entry[1].due; queue.delete(entry[0]); entry[1].fn();
    }
    throw new Error('Unbounded simulated scheduling');
  };
  const preview = () => {
    act('submit', 'Tell David I’ll call after dinner.');
    act('choose', 'david-family'); act('choose', 'Example Messages');
  };
  const approve = () => act('approve', { taskId: state.task.id, version: state.task.version, signature: P.signature(state.task) });
  return { state, scheduler, act, advance, preview, approve, captured, queue, jump: ms => { clock += ms; } };
}
test('valid request automatically reaches truthful unsent outcome with bounded delays', () => {
  const h = harness(); h.preview(); h.approve();
  h.advance(4 * 650);
  assert.equal(h.state.task.stage, 'completed'); assert.equal(h.state.task.result.sent, false);
  assert.equal(h.queue.size, 0);
});
test('Stop prevents an already queued callback from completing work', () => {
  const h = harness(); h.preview(); h.approve(); const stale = h.captured.at(-1);
  h.act('stop'); stale(); h.advance(10000);
  assert.equal(h.state.task.stage, 'stopped'); assert.equal(h.state.task.result, null);
});
test('reset and replacement reject callbacks even if cancelled callback is delivered', () => {
  const h = harness(); h.preview(); h.approve(); const stale = h.captured.at(-1);
  h.act('reset'); h.preview(); stale(); h.advance(10000);
  assert.equal(h.state.task.stage, 'preview'); assert.equal(h.state.history.length, 0);
});
test('editing invalidates old expiry callback without erasing changed content', () => {
  const h = harness(); h.preview(); const stale = h.captured.at(-1);
  h.advance(1000); h.act('edit', { body: 'New exact words.' }); stale();
  assert.equal(h.state.task.stage, 'preview'); assert.equal(h.state.task.slots.body, 'New exact words.');
});
test('expiry is automatic and unrelated renders cannot extend it', () => {
  const h = harness(); h.preview(); h.advance(30000); h.scheduler.sync();
  h.advance(30000); assert.equal(h.state.task.stage, 'expired');
  assert.equal(h.state.task.slots.body, 'I’ll call after dinner.');
});
test('elapsed time invalidates approval even before a delayed expiry callback arrives', () => {
  const h = harness(); h.preview(); h.jump(60001);
  assert.equal(h.approve(), false); assert.equal(h.state.task.stage, 'expired');
});
test('review clock expiry, delay bounds and disposal stop scheduling', () => {
  const h = harness(); h.preview(); h.act('tick', 60000); assert.equal(h.state.task.stage, 'expired');
  h.act('renew'); h.act('reviewer', { delay: 999999 }); h.approve();
  assert.equal([...h.queue.values()][0].due, 3000);
  const stale = h.captured.at(-1); h.scheduler.dispose(); stale(); h.advance(20000);
  assert.equal(h.state.task.stage, 'planning'); assert.equal(h.queue.size, 0);
});
