const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const root = process.cwd();

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
};

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function readManifest() {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /^NOC-/i.test(name) && /\.(png|jpe?g|webp)$/i.test(name))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }));
}

http
  .createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const requestPath = decodeURIComponent(requestUrl.pathname);

    if (requestPath === "/manifest.json") {
      send(
        res,
        200,
        JSON.stringify({ files: readManifest() }, null, 2),
        {
          "Cache-Control": "no-store",
          "Content-Type": "application/json; charset=utf-8",
        }
      );
      return;
    }

    const target = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
    const filePath = path.join(root, target);
    const normalizedPath = path.normalize(filePath);

    const insideRoot = normalizedPath === root || normalizedPath.startsWith(`${root}${path.sep}`);

    if (!insideRoot) {
      send(res, 403, "Forbidden");
      return;
    }

    fs.stat(normalizedPath, (error, stats) => {
      if (error) {
        send(res, 404, "Not found");
        return;
      }

      const resolvedPath = stats.isDirectory() ? path.join(normalizedPath, "index.html") : normalizedPath;

      fs.readFile(resolvedPath, (readError, fileBuffer) => {
        if (readError) {
          send(res, 404, "Not found");
          return;
        }

        const extension = path.extname(resolvedPath).toLowerCase();
        send(res, 200, fileBuffer, {
          "Cache-Control": "no-store",
          "Content-Type": contentTypes[extension] || "application/octet-stream",
        });
      });
    });
  })
  .listen(port, host, () => {
    console.log(`NOC Time Machine running at http://${host}:${port}`);
  });
