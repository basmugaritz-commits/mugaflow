import { sql } from './db.js';

export default async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

  try {
    const body = await req.json();
    const { key, data } = body;

    if (!key || !data) {
      return new Response(JSON.stringify({ error: 'Missing key or data' }), {
        status: 400,
        headers
      });
    }

    await sql`
      CREATE TABLE IF NOT EXISTS app_state (
        key TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `;

    await sql`
      INSERT INTO app_state (key, data)
      VALUES (${key}, ${data})
      ON CONFLICT (key)
      DO UPDATE SET data = ${data}, updated_at = now()
    `;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers
    });
  }
};
