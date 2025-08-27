// ESM Netlify Function
import { sql, ensureSchema } from './db.js';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // en prod pon tu dominio
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    await ensureSchema();
    const body = JSON.parse(event.body || '{}');
    const client_id = (body.client_id || '').trim();
    const state = body.state;

    if (!client_id || typeof state !== 'object') {
      return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'client_id y state son obligatorios' }) };
    }

    const rows = await sql/*sql*/`
      insert into app_state (client_id, state, updated_at)
      values (${client_id}, ${JSON.stringify(state)}::jsonb, now())
      on conflict (client_id) do update
      set state = ${JSON.stringify(state)}::jsonb,
          updated_at = now()
      returning client_id, updated_at;
    `;

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ ok: true, client_id: rows[0].client_id, updated_at: rows[0].updated_at }),
    };
  } catch (err) {
    console.error('state-save error', err);
    return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ error: 'internal_error' }) };
  }
}
