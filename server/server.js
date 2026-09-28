import http from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const stateFile = path.join(here, 'storage', 'club-state.json');
const distDir = path.join(root, 'dist');
const port = Number(process.env.PORT || 4174);
const starter = {
  members: [
    { id: 'maya', name: 'Maya Chen', role: 'Design lead', color: 'violet', lastCheckIn: new Date().toISOString() },
    { id: 'jordan', name: 'Jordan Lee', role: 'Events coordinator', color: 'blue', lastCheckIn: new Date(Date.now() - 38 * 60000).toISOString() },
    { id: 'priya', name: 'Priya Shah', role: 'Content team', color: 'orange', lastCheckIn: null },
    { id: 'omar', name: 'Omar Williams', role: 'Tech team', color: 'green', lastCheckIn: null },
    { id: 'nina', name: 'Nina Patel', role: 'Outreach team', color: 'blue', lastCheckIn: null },
    { id: 'eli', name: 'Eli Brooks', role: 'Member', color: 'violet', lastCheckIn: null }
  ],
  tasks: [
    { id: 'task-1', title: 'Finalize poster designs', assigneeId: 'maya', dueDate: '2026-09-10', priority: 'high', status: 'in-progress' },
    { id: 'task-2', title: 'Confirm guest speakers', assigneeId: 'jordan', dueDate: '2026-09-12', priority: 'medium', status: 'in-progress' },
    { id: 'task-3', title: 'Draft social media copy', assigneeId: 'priya', dueDate: '2026-09-14', priority: 'low', status: 'done' }
  ]
};
async function getState() { await mkdir(path.dirname(stateFile), { recursive: true }); try { return JSON.parse(await readFile(stateFile, 'utf8')); } catch { await saveState(starter); return structuredClone(starter); } }
async function saveState(state) { await mkdir(path.dirname(stateFile), { recursive: true }); await writeFile(stateFile, JSON.stringify(state, null, 2)); }
function json(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); }
function body(req) { return new Promise((resolve, reject) => { let raw = ''; req.on('data', c => { raw += c; if (raw.length > 1e6) reject(new Error('Request too large')); }); req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('Invalid JSON')); } }); req.on('error', reject); }); }
async function api(req, res, pathname) {
  const state = await getState();
  if (req.method === 'GET' && pathname === '/api/club') return json(res, 200, state);
  const checkIn = pathname.match(/^\/api\/members\/([^/]+)\/check-in$/);
  if (req.method === 'POST' && checkIn) { const member = state.members.find(item => item.id === checkIn[1]); if (!member) return json(res, 404, { error: 'Member not found.' }); member.lastCheckIn = new Date().toISOString(); await saveState(state); return json(res, 200, member); }
  if (req.method === 'POST' && pathname === '/api/tasks') { const input = await body(req); if (!String(input.title || '').trim() || !state.members.some(item => item.id === input.assigneeId)) return json(res, 400, { error: 'A task title and assignee are required.' }); const task = { id: crypto.randomUUID(), title: input.title.trim(), assigneeId: input.assigneeId, dueDate: input.dueDate || new Date().toISOString().slice(0, 10), priority: ['low', 'medium', 'high'].includes(input.priority) ? input.priority : 'medium', status: 'in-progress' }; state.tasks.unshift(task); await saveState(state); return json(res, 201, task); }
  const update = pathname.match(/^\/api\/tasks\/([^/]+)$/);
  if (req.method === 'PATCH' && update) { const task = state.tasks.find(item => item.id === update[1]); if (!task) return json(res, 404, { error: 'Task not found.' }); const input = await body(req); if (['done', 'in-progress'].includes(input.status)) task.status = input.status; await saveState(state); return json(res, 200, task); }
  return json(res, 404, { error: 'Not found.' });
}
async function staticFile(req, res, pathname) { const requested = pathname === '/' ? '/index.html' : pathname; const filePath = path.normalize(path.join(distDir, requested)); if (!filePath.startsWith(distDir)) { res.writeHead(403); return res.end('Forbidden'); } try { const info = await stat(filePath); if (!info.isFile()) throw new Error(); const ext = path.extname(filePath).toLowerCase(); res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' }[ext] || 'application/octet-stream' }); createReadStream(filePath).pipe(res); } catch { createReadStream(path.join(distDir, 'index.html')).pipe(res); } }
http.createServer(async (req, res) => { try { const pathname = new URL(req.url, `http://${req.headers.host}`).pathname; if (pathname.startsWith('/api/')) await api(req, res, pathname); else await staticFile(req, res, pathname); } catch (error) { json(res, 500, { error: error.message || 'Server error.' }); } }).listen(port, () => console.log(`Clubhouse running on http://localhost:${port}`));
