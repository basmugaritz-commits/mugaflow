import { query } from './db.js';

export default async (req, res) => {
  try {
    const body = JSON.parse(req.body);
    await query('INSERT INTO states (data) VALUES ($1)', [body]);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
