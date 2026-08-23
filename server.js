const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const rootDir = __dirname;
const port = Number(process.env.PORT || 5177);

function loadLocalEnv() {
  const envPath = path.join(rootDir, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separator = trimmed.indexOf("=");
    if (separator === -1) return;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  });
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(message);
}

function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const decodedPath = decodeURIComponent(url.pathname);
  const requestedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const filePath = path.normalize(path.join(rootDir, requestedPath));

  if (!filePath.startsWith(rootDir)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendText(response, 404, "Not found");
      return;
    }
    const ext = path.extname(filePath);
    const type = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
    }[ext] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    response.end(data);
  });
}

async function removeBackground(request, response) {
  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    sendText(response, 500, "Missing REMOVE_BG_API_KEY. Add it to .env.local or the shell environment.");
    return;
  }

  try {
    const upstream = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        Accept: "image/png",
        "Content-Type": request.headers["content-type"] || "multipart/form-data",
      },
      body: request,
      duplex: "half",
    });

    if (!upstream.ok) {
      const message = await upstream.text();
      sendText(response, upstream.status, message || "remove.bg request failed");
      return;
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    response.writeHead(200, {
      "Content-Type": upstream.headers.get("content-type") || "image/png",
      "Cache-Control": "no-store",
    });
    response.end(buffer);
  } catch (error) {
    sendText(response, 502, error.message || "remove.bg request failed");
  }
}

loadLocalEnv();

http.createServer((request, response) => {
  if (request.method === "POST" && request.url.startsWith("/api/remove-bg")) {
    removeBackground(request, response);
    return;
  }
  serveStatic(request, response);
}).listen(port, () => {
  console.log(`Journal Archive app: http://localhost:${port}`);
});
