// Test-only Chromium driver, reusing the prototype's built-in CDP approach.
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { serve } from './serve.mjs';

export async function browser() {
  const output = await mkdtemp(join(tmpdir(), 'granny-conversation-review-'));
  const server = await serve(0), base = 'http://127.0.0.1:' + server.address().port;
  const chrome = spawn(process.env.GRANNY_CHROMIUM || '/usr/bin/chromium', [
    '--headless', '--disable-gpu', '--no-first-run', '--disable-background-networking',
    '--remote-debugging-port=0', '--user-data-dir=' + join(output, 'profile'), 'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  let socket, session, seq = 0;
  const pending = new Map(), errors = [], network = [];
  const close = async () => {
    for (const p of pending.values()) { clearTimeout(p.timer); p.reject(new Error('Browser closed')); }
    pending.clear();
    if (socket) socket.close();
    chrome.kill('SIGTERM');
    await new Promise(resolve => server.close(resolve));
  };
  try {
    const wsURL = await new Promise((resolve, reject) => {
      let log = '';
      const timeout = setTimeout(() => reject(new Error('Chromium startup timed out: ' + log.slice(-600))), 20000);
      chrome.once('error', error => { clearTimeout(timeout); reject(error); });
      chrome.stderr.on('data', bytes => {
        log += bytes;
        const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (match) { clearTimeout(timeout); resolve(match[1]); }
      });
      chrome.once('exit', code => { clearTimeout(timeout); reject(new Error('Chromium exited ' + code + ': ' + log.slice(-600))); });
    });
    socket = new WebSocket(wsURL);
    await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        const p = pending.get(message.id); pending.delete(message.id); clearTimeout(p.timer);
        message.error ? p.reject(new Error(JSON.stringify(message.error))) : p.resolve(message.result);
      }
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
      if (message.method === 'Network.requestWillBeSent') network.push(message.params.request.url);
    };
    const cdp = (method, params = {}, sessionId = session) => new Promise((resolve, reject) => {
      const id = ++seq, timer = setTimeout(() => { pending.delete(id); reject(new Error(method + ' timed out')); }, 12000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
    const target = await cdp('Target.createTarget', { url: 'about:blank' });
    session = (await cdp('Target.attachToTarget', { targetId: target.targetId, flatten: true })).sessionId;
    await cdp('Runtime.enable'); await cdp('Page.enable'); await cdp('Network.enable');
    const evaluate = async expression => {
      const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const waitFor = async (expression, timeout = 7000) => {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        if (await evaluate(expression)) return;
        await new Promise(resolve => setTimeout(resolve, 40));
      }
      throw new Error('Timed out: ' + expression + '\n' + await evaluate('document.body.innerText'));
    };
    const navigate = async (path = '/') => {
      await cdp('Page.navigate', { url: base + path });
      await waitFor("!!document.querySelector('#composer')");
    };
    const click = selector => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el || el.disabled) throw Error('Missing or disabled: ' + ${JSON.stringify(selector)}); el.click(); })()`);
    const fill = (selector, value) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) throw Error('Missing input'); el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('input', {bubbles:true})); })()`);
    const viewport = (width, height = 1000) => cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    const screenshot = async name => {
      const result = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      const path = join(output, name + '.png');
      await writeFile(path, Buffer.from(result.data, 'base64'));
      return path;
    };
    return { output, base, cdp, evaluate, waitFor, navigate, click, fill, viewport, screenshot, errors, network, close };
  } catch (error) { await close(); throw error; }
}
