import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import roomFixtures from './room-fixtures.js';
const types = { "/": ["index.html","text/html"], "/index.html": ["index.html","text/html"],
  "/styles.css": ["styles.css","text/css"], "/model.js": ["model.js","text/javascript"], "/app.js": ["app.js","text/javascript"],
  "/fixtures.js": ["fixtures.js","text/javascript"], "/intent.js": ["intent.js","text/javascript"],
  "/scheduler.js": ["scheduler.js","text/javascript"],
  "/cloud.js": ["cloud.js","text/javascript"],
  "/room-fixtures.js": ["room-fixtures.js", "text/javascript"],
  "/rooms-store.js": ["rooms-store.js", "text/javascript"],
  "/room-dialog.js": ["room-dialog.js", "text/javascript"],
  "/room-create.js": ["room-create.js", "text/javascript"],
  "/room-ui.js": ["room-ui.js", "text/javascript"],
  "/room-library.js": ["room-library.js", "text/javascript"],
  "/assets/garden.svg": ["assets/garden.svg","image/svg+xml"],
  "/assets/seaside.svg": ["assets/seaside.svg","image/svg+xml"],
  "/assets/meal.svg": ["assets/meal.svg","image/svg+xml"],
  "/assets/room-fitness-placeholder.svg": ["assets/room-fitness-placeholder.svg","image/svg+xml"],
  "/assets/room-trips-placeholder.svg": ["assets/room-trips-placeholder.svg","image/svg+xml"],
  "/assets/room-reading-placeholder.svg": ["assets/room-reading-placeholder.svg","image/svg+xml"] };
// Exact checked-in fixture paths, never arbitrary paths supplied by a request.
for (const room of roomFixtures.rooms) {
  for (const path of [room.mark, room.portrait, room.backdrop, room.decor, room.motif,
    room.empty, ...room.collections.map(collection => collection.symbol)]) {
    types[path] = [path.slice(1), 'image/png'];
  }
}
export function serve(port = 4173) {
  const server = http.createServer(async (req,res) => {
    const path = new URL(req.url, "http://127.0.0.1").pathname, item = Object.hasOwn(types, path) ? types[path] : null;
    if (!item || !["GET","HEAD"].includes(req.method)) { res.writeHead(404); res.end("Not found"); return; }
    try {
      const bytes = await readFile(new URL(item[0], import.meta.url));
      res.writeHead(200, {"Content-Type":item[1]+"; charset=utf-8", "Cache-Control":"no-store",
        "Permissions-Policy":"microphone=(), camera=(), geolocation=()", "X-Content-Type-Options":"nosniff",
        "Referrer-Policy":"no-referrer"});
      res.end(req.method === "HEAD" ? undefined : bytes);
    } catch { res.writeHead(500); res.end("Unable to load prototype"); }
  });
  return new Promise((resolve,reject) => { server.once("error",reject); server.listen(port,"127.0.0.1",()=>resolve(server)); });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await serve(Number(process.argv[2] || 4173));
  console.log("Local design prototype: http://127.0.0.1:"+server.address().port);
  console.log("Fictional data only. Ctrl+C stops this server. No production backend.");
}
