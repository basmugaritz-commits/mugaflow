import { neon } from '@neondatabase/serverless';

// Crea una instancia global de la función sql (tagged template)
const url = process.env.NETLIFY_DATABASE_URL;
if (!url) throw new Error('Missing NETLIFY_DATABASE_URL');

// Exporta 'sql' como requiere state-get/state-save
export const sql = neon(url);
