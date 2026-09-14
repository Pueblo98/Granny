import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createOpenRouter, SafeError } from './openrouter.mjs';
const types = { "/": ["index.html","text/html"], "/index.html": ["index.html","text/html"],
  "/styles.css": ["styles.css","text/css"], "/model.js": ["model.js","text/javascript"], "/app.js": ["app.js","text/javascript"],
  "/fixtures.js": ["fixtures.js","text/javascript"], "/intent.js": ["intent.js","text/javascript"],
  "/scheduler.js": ["scheduler.js","text/javascript"],
  "/cloud.js": ["cloud.js","text/javascript"],
  "/assets/garden.svg": ["assets/garden.svg","image/svg+xml"],
  "/assets/seaside.svg": ["assets/seaside.svg","image/svg+xml"],
  "/assets/meal.svg": ["assets/meal.svg","image/svg+xml"] };
export function serve(port = 4173, { cloud = createOpenRouter() } = {}) {
  const server = http.createServer(async (req,res) => {
    const origin = 'http://127.0.0.1:' + server.address().port;
    if (req.headers.host !== new URL(origin).host) { res.writeHead(403); res.end('Forbidden'); return; }
    let path;
    try { path = new URL(req.url, origin).pathname; } catch { res.writeHead(400); res.end('Bad request'); return; }
    if (path === '/api/config' || path === '/api/chat') {
      res.setHeader('Cache-Control', 'no-store'); res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      const json = (status, body) => { if (!res.destroyed) { res.writeHead(status); res.end(JSON.stringify(body)); } };
      if (path === '/api/config' && req.method === 'GET') { json(200, cloud.config()); return; }
      if (path !== '/api/chat' || req.method !== 'POST') { json(405, { error:'method_not_allowed' }); return; }
      if (req.headers.origin !== origin || req.headers['content-type'] !== 'application/json') { json(403, { error:'forbidden' }); return; }
      const controller = new AbortController();
      res.on('close', () => controller.abort());
      try {
        let bytes = 0, chunks = [];
        for await (const chunk of req) {
          bytes += chunk.length;
          if (bytes > 60000) throw new SafeError('request_too_large', 413);
          chunks.push(chunk);
        }
        let body;
        try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new SafeError('invalid_request'); }
        if (!body || Object.keys(body).length !== 2 || body.consent !== true || !Object.hasOwn(body, 'messages')) throw new SafeError('consent_required');
        json(200, await cloud.chat(body.messages, controller.signal));
      } catch (error) { json(error instanceof SafeError ? error.status : 500, { error: error instanceof SafeError ? error.code : 'request_failed' }); }
      return;
    }
    const item = Object.hasOwn(types, path) ? types[path] : null;
    if (!item || !["GET","HEAD"].includes(req.method)) { res.writeHead(404); res.end("Not found"); return; }
    try {
      const bytes = await readFile(new URL(item[0], import.meta.url));
      res.writeHead(200, {"Content-Type":item[1]+"; charset=utf-8", "Cache-Control":"no-store",
        "Permissions-Policy":"microphone=(), camera=(), geolocation=()", "X-Content-Type-Options":"nosniff",
        "Referrer-Policy":"no-referrer"});
      res.end(req.method === "HEAD" ? undefined : bytes);
    } catch { res.writeHead(500); res.end("Unable to load prototype"); }
  });
  server.requestTimeout = 30000;
  server.headersTimeout = 10000;
  return new Promise((resolve,reject) => { server.once("error",reject); server.listen(port,"127.0.0.1",()=>resolve(server)); });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cloud = createOpenRouter({ key: process.env.OPENROUTER_API_KEY, enabled: process.argv.includes('--cloud') });
  const server = await serve(Number(process.argv[2] || 4173), { cloud });
  console.log("Local design prototype: http://127.0.0.1:"+server.address().port);
  console.log("Fictional data only. Ctrl+C stops this server. No production backend.");
  console.log(cloud.config().available ? 'Qwen available through Menu → AI mode; explicit consent required. Synthetic text only.' : 'Cloud mode off or OPENROUTER_API_KEY missing. Scripted mode remains available.');
}
