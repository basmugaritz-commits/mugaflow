import { query } from './db.js';

export default async (req, res) => {
  try {
    const result = await query('SELECT data FROM states ORDER BY id DESC LIMIT 1');
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0] || {}),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
