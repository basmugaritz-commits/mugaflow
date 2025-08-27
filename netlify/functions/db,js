import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });

export async function query(text, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}
