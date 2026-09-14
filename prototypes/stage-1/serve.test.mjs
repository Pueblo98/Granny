import test from 'node:test';
import assert from 'node:assert/strict';
import { serve } from './serve.mjs';

test('loopback server exposes exactly the intended runtime assets and no write routes', async () => {
  const server = await serve(0), base = 'http://127.0.0.1:' + server.address().port;
  try {
    assert.equal(server.address().address, '127.0.0.1');
    const paths = ['/', '/index.html', '/styles.css', '/fixtures.js', '/intent.js', '/model.js', '/scheduler.js', '/app.js',
      '/assets/garden.svg', '/assets/seaside.svg', '/assets/meal.svg'];
    for (const path of paths) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.match(response.headers.get('permissions-policy'), /microphone=\(\), camera=\(\)/);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      assert((await response.text()).length > 0);
      const head = await fetch(base + path, { method: 'HEAD' });
      assert.equal(head.status, 200); assert.equal(await head.text(), '');
    }
    for (const path of ['/.git/config', '/README.md', '/browser-driver.mjs', '/browser-check.mjs', '/model.test.mjs',
      '/serve.mjs', '/docs/05-safety-privacy/action-policy.md', '/assets/../../AGENTS.md',
      '/assets/%2e%2e/%2e%2e/AGENTS.md', '/%2e%2e%2fAGENTS.md', '/__proto__', '/constructor', '/toString']) {
      assert.equal((await fetch(base + path)).status, 404, path);
    }
    for (const method of ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
      assert.equal((await fetch(base + '/model.js', { method })).status, 404, method);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
