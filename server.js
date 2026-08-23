/**
 * server.js — Local development server for Atlas Edu
 *
 * Serves static HTML/CSS/JS files AND routes /api/* to the serverless functions.
 * No Vercel account required.
 *
 * Usage:
 *   node server.js
 *   Then open: http://localhost:3000
 */

const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const url     = require('url');

const PORT    = process.env.PORT || 3000;
const ROOT    = __dirname;

// ── MIME types ────────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
};

// ── Page rewrites (clean URLs) ────────────────────────────────────────────────
const REWRITES = {
  '/':            '/index.html',
  '/dashboard':   '/dashboard.html',
  '/halaqah':     '/halaqah.html',
  '/ppdb':        '/ppdb.html',
  '/tuition':     '/tuition.html',
  '/facilities':  '/facilities.html',
  '/clubs':       '/clubs.html',
  '/curriculum':  '/curriculum.html',
  '/governance':  '/governance.html',
  '/tahun-ajaran':'/tahun-ajaran.html',
  '/tahfizh':     '/tahfizh.html',
  '/graduation':  '/graduation.html',
  '/mbg':         '/mbg.html',
};

// ── Request handler ───────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname    = parsedUrl.pathname;

  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // ── API routes ──────────────────────────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const handlerName = pathname.slice(5);  // strip /api/
    const handlerPath = path.join(ROOT, 'api', `${handlerName}.js`);

    if (!fs.existsSync(handlerPath)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `API handler not found: ${handlerName}` }));
      return;
    }

    try {
      // Clear require cache so edits are picked up on each request
      delete require.cache[require.resolve(handlerPath)];
      const handler = require(handlerPath);

      // Build a simple req/res shim compatible with the Vercel handler signature
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try { req.body = body ? JSON.parse(body) : {}; } catch { req.body = {}; }
        req.query = parsedUrl.query;

        // Simple res shim
        let statusCode = 200;
        const headers  = { 'Content-Type': 'application/json' };

        const shimRes = {
          statusCode,
          setHeader:  (k, v) => { headers[k] = v; },
          status:     (code) => { statusCode = code; return shimRes; },
          json:       (data) => {
            res.writeHead(statusCode, headers);
            res.end(JSON.stringify(data));
          },
          end:        (data) => {
            res.writeHead(statusCode, headers);
            res.end(data || '');
          },
          send:       (data) => {
            res.writeHead(statusCode, headers);
            res.end(typeof data === 'object' ? JSON.stringify(data) : String(data));
          },
        };

        try {
          await handler(req, shimRes);
        } catch (err) {
          console.error(`[api/${handlerName}] Error:`, err.message);
          if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        }
      });
    } catch (err) {
      console.error(`[api/${handlerName}] Load error:`, err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ── Static file serving ─────────────────────────────────────────────────────

  // Apply clean URL rewrites
  if (REWRITES[pathname]) pathname = REWRITES[pathname];

  // Default to index.html for bare /
  if (pathname === '/') pathname = '/index.html';

  const filePath = path.join(ROOT, pathname);

  // Security: don't serve files outside ROOT or node_modules
  if (!filePath.startsWith(ROOT) || filePath.includes('node_modules')) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  if (!fs.existsSync(filePath)) {
    // 404 — try adding .html
    const withHtml = filePath + '.html';
    if (fs.existsSync(withHtml)) {
      serveFile(withHtml, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`<h2>404 — Not Found</h2><p>${pathname}</p>`);
    }
    return;
  }

  serveFile(filePath, res);
});

function serveFile(filePath, res) {
  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type':   mime,
    'Content-Length': stat.size,
    'Cache-Control':  ext === '.html' ? 'no-cache' : 'public, max-age=3600',
  });
  fs.createReadStream(filePath).pipe(res);
}

// ── Start ─────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log('\n🏫  Atlas Edu — Local Dev Server');
  console.log('─'.repeat(45));
  console.log(`✅  Running at:   http://localhost:${PORT}`);
  console.log(`📄  Dashboard:    http://localhost:${PORT}/dashboard`);
  console.log(`🔌  API example:  http://localhost:${PORT}/api/get-students`);
  console.log('─'.repeat(45));
  console.log('    Press Ctrl+C to stop\n');
});
