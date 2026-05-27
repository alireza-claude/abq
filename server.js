'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'out');
const PORT = parseInt(process.env.PORT || '3000', 10);

const MIME_TYPES = {
  '.html':  'text/html; charset=utf-8',
  '.css':   'text/css',
  '.js':    'application/javascript',
  '.json':  'application/json',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.gif':   'image/gif',
  '.svg':   'image/svg+xml',
  '.ico':   'image/x-icon',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':   'font/ttf',
  '.webp':  'image/webp',
  '.txt':   'text/plain',
  '.xml':   'application/xml',
  '.map':   'application/json',
};

const CACHE_CONTROL = (filePath) => {
  if (filePath.includes('/_next/static/')) {
    return 'public, max-age=31536000, immutable';
  }
  return 'public, max-age=3600';
};

const serveFile = (res, filePath) => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': CACHE_CONTROL(filePath),
    });
    res.end(content);
  });
};

const tryFile = (filePath, cb) => {
  fs.stat(filePath, (err, stat) => {
    cb(!err && stat.isFile() ? filePath : null);
  });
};

const server = http.createServer((req, res) => {
  let pathname = req.url.split('?')[0];
  try { pathname = decodeURIComponent(pathname); } catch (_) {}

  const filePath = path.normalize(path.join(OUT_DIR, pathname));

  // Prevent directory traversal
  if (!filePath.startsWith(OUT_DIR + path.sep) && filePath !== OUT_DIR) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // 1. Exact file match
  tryFile(filePath, (f) => {
    if (f) { serveFile(res, f); return; }

    // 2. Try adding .html (clean URLs: /about -> about.html)
    tryFile(filePath + '.html', (f2) => {
      if (f2) { serveFile(res, f2); return; }

      // 3. SPA fallback
      serveFile(res, path.join(OUT_DIR, 'index.html'));
    });
  });
});

server.listen(PORT, () => {
  console.log('ABQ static server running on port ' + PORT + ', serving: ' + OUT_DIR);
});
