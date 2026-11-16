import http from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, stat, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateReply, validateMessages } from './server/chat.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
// Native env loader keeps credentials out of client files; existing env takes precedence.
try { process.loadEnvFile(path.join(root, '.env.local')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
const port = Number(process.env.PORT || 8000);
const host = process.env.HOST || '127.0.0.1';
const limits = new Map();
let active = 0;
function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}
const types = { '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif', '.pdf': 'application/pdf', '.ico': 'image/x-icon', '.pbix': 'application/octet-stream', '.twbx': 'application/octet-stream' };
const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/chat') {
      if (req.method !== 'POST') return json(res, 405, {error: '请使用 POST 请求。'});
      const expected = new Set([`http://127.0.0.1:${port}`, `http://localhost:${port}`, ...(process.env.CHAT_ALLOWED_ORIGINS || '').split(',').filter(Boolean)]);
      if (req.headers.origin && !expected.has(req.headers.origin)) return json(res, 403, {error: '请求来源不受支持。'});
      if (!(req.headers['content-type'] || '').startsWith('application/json')) return json(res, 415, {error: '请发送 JSON。'});
      const now = Date.now();
      for (const [key, item] of limits) if (now - item.start > 60000) limits.delete(key);
      const key = req.socket.remoteAddress;
      const bucket = limits.get(key) || {start: now, count: 0};
      limits.set(key, bucket);
      if (++bucket.count > 12 || active >= 4) { res.setHeader('Retry-After', '60'); return json(res, 429, {error: '消息发送较频繁，请稍后再试。'}); }
      const chunks = []; let bytes = 0;
      for await (const chunk of req) {
        bytes += chunk.length;
        if (bytes > 65536) return json(res, 413, {error: '消息太长，请缩短后重试。'});
        chunks.push(chunk);
      }
      let data;
      try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return json(res, 400, {error: '消息格式有误。'}); }
      const messages = validateMessages(data.messages);
      if (!messages) return json(res, 400, {error: '消息格式有误或内容过长，请开启新对话。'});
      active++;
      try { const reply = await generateReply(messages); json(res, reply.status, reply.body); } finally { active--; }
      return;
    }
    if (!['GET', 'HEAD'].includes(req.method)) return json(res, 405, {error: '不支持此方法。'});
    const name = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const parts = name.split(/[\\/]/).filter(Boolean);
    const ext = path.extname(name).toLowerCase();
    // Only public media / frontend files are served. No env, Git, source, or server files.
    if (parts.some(p => p.startsWith('.') || p === '..') || !types[ext] || (parts.length > 1 && !['assets', 'public'].includes(parts[0]))) return json(res, 404, {error: '页面不存在。'});
    const file = await realpath(path.resolve(root, '.' + name));
    if (!file.startsWith(root + path.sep)) return json(res, 404, {error: '页面不存在。'});
    const info = await stat(file);
    if (!info.isFile()) return json(res, 404, {error: '页面不存在。'});
    if (ext === '.mp4' && req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      let start = match?.[1] ? Number(match[1]) : 0;
      let end = match?.[2] ? Number(match[2]) : info.size - 1;
      if (match && !match[1] && match[2]) { start = Math.max(0, info.size - Number(match[2])); end = info.size - 1; }
      if (!match || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= info.size) {
        res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }); return res.end();
      }
      end = Math.min(end, info.size - 1);
      res.writeHead(206, { 'Content-Type': 'video/mp4', 'Content-Length': end-start+1, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${info.size}` });
      if (req.method === 'HEAD') return res.end();
      const stream = createReadStream(file, {start, end});
      stream.on('error', () => res.destroy()); res.on('close', () => stream.destroy());
      return stream.pipe(res);
    }
    res.writeHead(200, { 'Content-Type': types[ext], 'Content-Length': info.size, 'Cache-Control': 'no-cache', ...(ext === '.mp4' ? {'Accept-Ranges': 'bytes'} : {}) });
    res.end(req.method === 'HEAD' ? undefined : await readFile(file));
  } catch (error) {
    if (!res.headersSent) json(res, error.code === 'ENOENT' ? 404 : 400, {error: '无法处理请求。'});
    else res.end();
  }
});
server.requestTimeout = 60000;
server.listen(port, host, () => console.log(`Local preview: http://${host}:${port}/\nAI: ${process.env.DEEPSEEK_API_KEY ? 'configured' : 'not configured; add DEEPSEEK_API_KEY to .env.local'}`));
