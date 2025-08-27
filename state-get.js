import { sql } from './db.js';
export default async (req) => {
  const headers = { 'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,OPTIONS','Access-Control-Allow-Headers':'Content-Type' };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  const key = new URL(req.url).searchParams.get('key');
  if (!key) return new Response(JSON.stringify({ error:'missing key' }), { status:400, headers });
  const db = sql();
  await db`CREATE TABLE IF NOT EXISTS app_state (key text PRIMARY KEY, data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`;
  const rows = await db`SELECT data FROM app_state WHERE key=${key}`;
  return new Response(JSON.stringify({ ok:true, key, data: rows[0]?.data ?? null }), { status:200, headers:{...headers,'Content-Type':'application/json'} });
};