// Following blueprint:javascript_database integration
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Database is optional when using Supabase for auth and storage
let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

if (process.env.DATABASE_URL) {
  console.log('Attempting to create database connection...');
  try {
    // Use standard PostgreSQL connection for Supabase
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // For development - use proper certificates in production
      }
    });
    db = drizzle({ client: pool, schema });
    console.log('✅ Database connection created successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
}

console.log('Database connection available:', db ? 'YES' : 'NO');

export { pool, db };
