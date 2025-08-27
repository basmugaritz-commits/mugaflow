// netlify/functions/state-save.js
import { sql } from "./db.js";

export default async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }

  try {
    const { key, data } = await req.json();
    if (!key || typeof data === "undefined") {
      return new Response(JSON.stringify({ error: "Missing key or data" }), { status: 400, headers });
    }

    await sql`
      CREATE TABLE IF NOT EXISTS app_state (
        key TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    await sql`
      INSERT INTO app_state (key, data) VALUES (${key}, ${sql.json(data)})
      ON CONFLICT (key) DO UPDATE SET data = ${sql.json(data)}, updated_at = now()
    `;

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err?.message || err) }), { status: 500, headers });
  }
};
