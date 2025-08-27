// ESM: cliente HTTP de Neon (ideal para Functions)
import { neon, neonConfig } from '@neondatabase/serverless';

if (!process.env.NETLIFY_DATABASE_URL) {
  throw new Error('Falta la variable de entorno NETLIFY_DATABASE_URL');
}

// Reutiliza la conexión entre invocaciones
neonConfig.fetchConnectionCache = true;

// Crea cliente SQL usando la URL de Neon (postgresql://...&sslmode=require)
export const sql = neon(process.env.NETLIFY_DATABASE_URL);

// (Opcional) asegurar esquema. Puedes quitarlo en producción si ya existe.
export async function ensureSchema() {
  await sql/*sql*/`
    create table if not exists app_state (
      client_id  text primary key,
      state      jsonb not null default '{}'::jsonb,
      updated_at timestamptz not null default now()
    );
  `;
  await sql/*sql*/`create index if not exists idx_app_state_updated_at on app_state(updated_at desc);`;
}
