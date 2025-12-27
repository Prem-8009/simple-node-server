import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function serveStaticFile(res, filePath, contentType, statusCode = 200) {
  try {
    const data = await fs.readFile(filePath);
    res.writeHead(statusCode, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    if (contentType === "text/html") {
      const errorPage = await fs.readFile(path.join(__dirname, "pages", "404.html"));
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(errorPage);
    } else {
      res.writeHead(404);
      res.end();
    }
  }
}

const server = http.createServer(async (req, res) => {
  const url = req.url;

  
  if (url.endsWith(".css")) {
    const fileName = path.basename(url); 
    const cssPath = path.join(__dirname, fileName); 
    await serveStaticFile(res, cssPath, "text/css");
}
  else if (url === "/" || url === "/home") {
    await serveStaticFile(res, path.join(__dirname, "pages", "home.html"), "text/html");
  } 
  else if (url === "/about") {
    await serveStaticFile(res, path.join(__dirname, "pages", "about.html"), "text/html");
  } 
  else if (url === "/contact") {
    await serveStaticFile(res, path.join(__dirname, "pages", "contact.html"), "text/html");
  } 
  else if (url === "/time") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Current Time: ${new Date().toLocaleTimeString()}`);
  }
  else {
    await serveStaticFile(res, path.join(__dirname, "pages", "404.html"), "text/html", 404);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});