import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const types = { "/": ["index.html","text/html"], "/index.html": ["index.html","text/html"],
  "/styles.css": ["styles.css","text/css"], "/model.js": ["model.js","text/javascript"], "/app.js": ["app.js","text/javascript"] };
export function serve(port = 4173) {
  const server = http.createServer(async (req,res) => {
    const path = new URL(req.url, "http://127.0.0.1").pathname, item = types[path];
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
