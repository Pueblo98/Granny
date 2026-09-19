import test from 'node:test';
import assert from 'node:assert/strict';
import { serve } from './serve.mjs';

test('loopback server exposes exactly the intended runtime assets and no write routes', async () => {
  const server = await serve(0), base = 'http://127.0.0.1:' + server.address().port;
  try {
    assert.equal(server.address().address, '127.0.0.1');
    const paths = ['/', '/index.html', '/styles.css', '/fixtures.js', '/intent.js', '/model.js', '/scheduler.js', '/cloud.js', '/app.js',
      '/assets/garden.svg', '/assets/seaside.svg', '/assets/meal.svg',
      '/assets/room-fitness-placeholder.svg',
      '/assets/room-trips-placeholder.svg',
      '/assets/room-reading-placeholder.svg'];
    for (const path of paths) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.match(response.headers.get('permissions-policy'), /microphone=\(\), camera=\(\)/);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      const body = await response.text();
      assert(body.length > 0);
      if (path === '/') {
        assert.match(body, /default-src 'none'/);
        assert.match(body, /connect-src 'self'/);
        assert.match(body, /img-src 'self' data:/);
        assert.match(body, /media-src 'none'/);
        assert.match(body, /form-action 'none'/);
      }
      const head = await fetch(base + path, { method: 'HEAD' });
      assert.equal(head.status, 200); assert.equal(await head.text(), '');
    }
    for (const path of ['/.git/config', '/README.md', '/browser-driver.mjs', '/browser-check.mjs', '/model.test.mjs',
      '/cloud.test.mjs', '/runtime-browser-check.mjs', '/api/runtime/config', '/api/runtime/session',
      '/serve.mjs', '/docs/05-safety-privacy/action-policy.md', '/assets/../../AGENTS.md',
      '/assets/%2e%2e/%2e%2e/AGENTS.md', '/%2e%2e%2fAGENTS.md', '/__proto__', '/constructor', '/toString']) {
      assert.equal((await fetch(base + path)).status, 404, path);
    }
    for (const method of ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
      assert.equal((await fetch(base + '/model.js', { method })).status, 404, method);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
