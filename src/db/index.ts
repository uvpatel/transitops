import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || '';

export const sql = connectionString ? neon(connectionString) : null;
export const db = sql ? drizzle({ client: sql }) : null as any;

export function isDatabaseAvailable() {
  return Boolean(connectionString);
}
