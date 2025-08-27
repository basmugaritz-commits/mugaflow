// netlify/functions/db.js
import { neon } from '@neondatabase/serverless';

const DATABASE_URL =
  process.env.NETLIFY_DATABASE_URL ||
  process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('Falta NETLIFY_DATABASE_URL (o DATABASE_URL) en las variables de entorno de Netlify');
}

// "sql" es un tagged template listo para usar en state-get/save
export const sql = neon(DATABASE_URL);
