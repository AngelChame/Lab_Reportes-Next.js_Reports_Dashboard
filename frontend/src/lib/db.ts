import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = async (text: string, params?: any[]) => {
  // Verificación de seguridad: Solo permitir SELECT 
  if (!text.trim().toUpperCase().startsWith('SELECT')) {
    throw new Error('Operación no permitida. Solo consultas de lectura.');
  }
  return pool.query(text, params);
};