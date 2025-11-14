// test-supabase-connection.js
import dotenv from 'dotenv';
dotenv.config();

import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

// Set the WebSocket constructor
process.env.WS = 'ws';
global.WebSocket = ws;

console.log('Testing Supabase database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

if (process.env.DATABASE_URL) {
  console.log('Attempting to connect...');
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    console.log('Pool created successfully');
    
    // Try a simple query
    pool.query('SELECT 1').then(result => {
      console.log('Query successful:', result);
      process.exit(0);
    }).catch(error => {
      console.error('Query failed:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
} else {
  console.log('No DATABASE_URL provided');
  process.exit(1);
}