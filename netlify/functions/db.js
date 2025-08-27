// netlify/functions/db.js
import postgres from "postgres";

// En Netlify, define NETLIFY_DATABASE_URL con tu cadena Neon (postgresql://...)
// sslmode=require ya viene en tu URL de Neon serverless.
const url = process.env.NETLIFY_DATABASE_URL;
if (!url) throw new Error("NETLIFY_DATABASE_URL no está configurada");

export const sql = postgres(url, {
  prepare: true,
  max: 1,           // funciones serverless: conexiones cortas
  idle_timeout: 5,  // segundos
});
