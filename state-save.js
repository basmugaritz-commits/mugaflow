import { sql } from './db.js';
export default async (req) => {
  const headers = { 'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type' };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status:405, headers });
  const { key, data } = await req.json().catch(()=> ({}));
  if (!key || typeof data === 'undefined') return new Response(JSON.stringify({ error:'missing key or data' }), { status:400, headers });
  const db = sql();
  await db`CREATE TABLE IF NOT EXISTS app_state (key text PRIMARY KEY, data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`;
  await db`INSERT INTO app_state (key,data) VALUES (${key},${data}) ON CONFLICT (key) DO UPDATE SET data=EXCLUDED.data, updated_at=now()`;
  return new Response(JSON.stringify({ ok:true }), { status:200, headers:{...headers,'Content-Type':'application/json'} });
};