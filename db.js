import { neon } from '@netlify/neon';
export function sql() { return neon(); } // uses NETLIFY_DATABASE_URL