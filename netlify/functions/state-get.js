// netlify/functions/state-get.js
import { sql } from './db.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler = async (event) => {
  try {
    // Preflight
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders, body: '' };
    }

    let key = '';

    if (event.httpMethod === 'GET') {
      const params = new URLSearchParams(event.rawQuery || '');
      key = params.get('key') || '';
    } else if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      key = body.key || '';
    } else {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    if (!key) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing key' }),
      };
    }

    const rows = await sql/* sql */`
      SELECT data FROM app_state WHERE state_key = ${key}
    `;
    if (!rows || rows.length === 0) {
      return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: 'Not found' }) };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ data: rows[0].data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: String(err?.message || err) }),
    };
  }
};
