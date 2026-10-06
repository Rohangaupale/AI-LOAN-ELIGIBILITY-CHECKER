const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  let filePath = req.url.split("?")[0];

  if (filePath === "/") {
    filePath = "/index.html";
  }

  const fullPath = path.join(process.cwd(), filePath);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(fullPath);

    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream"
    });

    res.end(data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Loan Eligibility Checker running on port ${PORT}`);
});
