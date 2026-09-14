/* Local demonstration timings only. No Android or AI latency measurement. */
(function (root) {
  'use strict';
  function create({ getState, dispatch, onChange = () => {},
    setTimeout: schedule = root.setTimeout.bind(root),
    clearTimeout: clear = root.clearTimeout.bind(root),
    now = () => root.performance.now() }) {
    let timer = null, generation = 0, disposed = false, last = now();
    let due = null, scheduledKey = '';
    function elapse() {
      const current = now();
      const elapsed = Math.max(0, current - last);
      last = current;
      if (!disposed && elapsed) dispatch('tick', elapsed);
    }
    function cancel() {
      generation++;
      if (timer !== null) clear(timer);
      timer = null; due = null; scheduledKey = '';
    }
    function sync() {
      if (disposed) return;
      const state = getState(), task = state.task;
      const active = task && ['planning', 'acting', 'waiting', 'verifying'].includes(task.stage);
      const expiring = task && task.stage === 'preview' && task.permit;
      if (!active && !expiring) { cancel(); return; }
      const guard = { epoch: state.epoch, taskId: task.id, version: task.version, stage: task.stage };
      const key = JSON.stringify([guard, expiring ? task.permit.expires : null]);
      const delay = expiring ? Math.max(0, task.permit.expires - state.clock)
        : Math.min(3000, Math.max(0, Number(state.reviewer.delay) || 0));
      const target = key === scheduledKey && due !== null ? due : now() + delay;
      cancel();
      scheduledKey = key; due = target;
      const token = generation;
      timer = schedule(() => {
        if (disposed || token !== generation) return;
        timer = null; due = null; scheduledKey = '';
        elapse();
        const current = getState(), currentTask = current.task;
        if (current.epoch !== guard.epoch || !currentTask || currentTask.id !== guard.taskId ||
            currentTask.version !== guard.version || currentTask.stage !== guard.stage) {
          onChange(); sync(); return;
        }
        if (active) dispatch('advance', null, guard);
        onChange(); sync();
      }, Math.max(0, target - now()));
    }
    function dispose() { cancel(); disposed = true; }
    return { sync, cancel, dispose, elapse };
  }
  const api = { create };
  root.GrannyScheduler = api;
  if (typeof module !== 'undefined') module.exports = api;
})(globalThis);
