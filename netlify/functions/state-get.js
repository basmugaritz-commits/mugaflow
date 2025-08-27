// ESM Netlify Function
import { sql, ensureSchema } from './db.js';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', // en prod pon tu dominio
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    await ensureSchema();
    const client_id = (event.queryStringParameters?.client_id || '').trim();
    if (!client_id) {
      return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'client_id requerido' }) };
    }

    const rows = await sql/*sql*/`select state, updated_at from app_state where client_id = ${client_id};`;

    if (rows.length === 0) {
      return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ state: null, updated_at: null }) };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ state: rows[0].state, updated_at: rows[0].updated_at }),
    };
  } catch (err) {
    console.error('state-get error', err);
    return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ error: 'internal_error' }) };
  }
}
