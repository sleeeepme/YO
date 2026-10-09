import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const rows = new Map();
const deletes = new Map();
let audioFailures = 0;
const provider = http.createServer(async (req, res) => {
  let text = ''; for await (const chunk of req) text += chunk;
  const input = text ? JSON.parse(text) : {};
  const url = new URL(req.url, 'http://localhost');
  const send = (code, value) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(value)); };
  if (url.pathname.startsWith('/twirp/')) {
    if (url.pathname.endsWith('/DeleteRoom')) {
      deletes.set(input.room, (deletes.get(input.room) || 0) + 1);
      if (audioFailures-- > 0) return send(503, { code: 'unavailable', msg: 'simulated outage' });
    }
    if (url.pathname.endsWith('/ListRooms')) return send(200, { rooms: Object.keys(Object.fromEntries(rows)).map(name => ({ name })) });
    if (url.pathname.endsWith('/ListParticipants')) return send(200, { participants: [{ identity: 'connected-fixture' }] });
    if (url.pathname.endsWith('/RemoveParticipant')) assert.ok(input.revokeTokenTs, 'explicit token cutoff is required');
    return send(200, {});
  }
  if (url.pathname.includes('/rpc/')) return send(200, true);
  if (url.pathname.endsWith('/yo_voice_rooms')) {
    if (req.method === 'POST') { rows.set(input.id, { ...input, closed: false }); return send(201, {}); }
    const id = url.searchParams.get('id')?.replace(/^eq\./, '');
    const row = rows.get(id);
    if (req.method === 'PATCH') { if (row) Object.assign(row, input); return send(200, {}); }
    return send(200, row || null);
  }
  if (url.pathname.endsWith('/yo_voice_slots')) return send(200, req.method === 'GET' ? [{ guest_id: 'reserved-fixture' }] : {});
  return send(404, {});
});
await new Promise(resolve => provider.listen(0, '127.0.0.1', resolve));
const providerUrl = 'http://127.0.0.1:' + provider.address().port;
const probe = http.createServer();
await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const base = 'http://127.0.0.1:' + port;
const dataDir = await mkdtemp(path.join(os.tmpdir(), 'yo-lifecycle-test-'));
process.env.WORKFLOW_LOCAL_DATA_DIR = dataDir;
process.env.WORKFLOW_LOCAL_BASE_URL = base;
const env = { ...process.env, NODE_ENV: 'production', YO_VOICE_ENABLED: 'true',
  NEXT_PUBLIC_SUPABASE_URL: providerUrl, SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
  LIVEKIT_URL: providerUrl, LIVEKIT_API_KEY: 'test-key', LIVEKIT_API_SECRET: 'test-secret',
  YO_SESSION_SECRET: 'test-session-secret-0123456789-0123456789',
  WORKFLOW_TARGET_WORLD: '@workflow/world-local',
};
delete env.VERCEL_DEPLOYMENT_ID;
delete env.VERCEL;
let logs = '';
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(port)], { env, stdio: ['ignore', 'pipe', 'pipe'] });
for (const output of [child.stdout, child.stderr]) output.on('data', value => { logs = (logs + value.toString()).slice(-20000); });
const waitFor = async (check, label, timeout = 30000) => {
  const until = Date.now() + timeout;
  while (Date.now() < until) { if (await check()) return; await new Promise(resolve => setTimeout(resolve, 100)); }
  throw new Error('Timed out: ' + label);
};
const post = async (action, body, cookie = '') => {
  const res = await fetch(base + '/api/voice/' + action, { method: 'POST',
    headers: { origin: base, 'content-type': 'application/json', ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body) });
  return { status: res.status, cookie: res.headers.get('set-cookie')?.split(';')[0], body: await res.json() };
};
try {
  await waitFor(async () => { try { return (await fetch(base)).ok; } catch { return false; } }, 'server start');
  const { getWorld } = await import('workflow/runtime');
  const { getRun } = await import('workflow/api');
  const world = await getWorld();
  const created = await post('create', { title: 'Lifecycle fixture', capacity: 2, durationMinutes: 30 });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const id = created.body.id;
  const cookie = created.cookie;
  let runId;
  await waitFor(async () => {
    const result = await world.runs.list({ resolveData: 'none' });
    runId = result.data[0]?.runId; return !!runId;
  }, 'durable expiry run');
  await waitFor(async () => {
    const { data } = await world.events.list({ runId });
    return data.some(event => event.eventType === 'wait_created');
  }, 'expiry sleep registered');
  assert.equal(rows.get(id).closed, false);
  assert.equal(deletes.get(id) || 0, 0, 'room must stay open until deadline');
  await getRun(runId).wakeUp(); // Accelerate the 30-minute deadline in this isolated fixture.
  await waitFor(() => rows.get(id).closed && deletes.get(id) >= 1, 'deadline termination');
  await waitFor(async () => {
    const { data } = await world.events.list({ runId });
    return data.filter(event => event.eventType === 'wait_created').length >= 2;
  }, 'late-token sweep sleep');
  await getRun(runId).wakeUp();
  await waitFor(() => deletes.get(id) >= 2, 'late-token sweep');

  const host = await post('create', { title: 'Host close fixture', capacity: 2 });
  assert.equal(host.status, 201);
  const denied = await post('close', { id: host.body.id }, cookie);
  assert.equal(denied.status, 403);
  audioFailures = 2;
  const pending = await post('close', { id: host.body.id }, host.cookie);
  assert.ok([200, 202].includes(pending.status), JSON.stringify(pending.body));
  assert.equal(rows.get(host.body.id).closed, true);
  audioFailures = 0;
  const retried = await post('close', { id: host.body.id }, host.cookie);
  assert.equal(retried.status, 200, JSON.stringify(retried.body));
  assert.equal(retried.body.pending, false);
  console.log(JSON.stringify({ expiryWait: true, serverTermination: true, lateTokenSweep: true,
    nonHostDenied: true, repeatedHostClose: true, simulatedProviderFailure: true }));
} catch (error) {
  console.error(logs); throw error;
} finally {
  child.kill('SIGTERM');
  await new Promise(resolve => { if (child.exitCode !== null) resolve(); else child.once('exit', resolve); });
  await new Promise(resolve => provider.close(resolve));
}
