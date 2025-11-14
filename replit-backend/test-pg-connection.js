// test-pg-connection.js
import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';

console.log('Testing PostgreSQL database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

if (process.env.DATABASE_URL) {
  console.log('Attempting to connect...');
  try {
    const client = new pg.Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // For development only
      }
    });
    
    client.connect()
      .then(() => {
        console.log('Connected successfully!');
        return client.query('SELECT 1');
      })
      .then(result => {
        console.log('Query result:', result.rows);
        client.end();
        process.exit(0);
      })
      .catch(error => {
        console.error('Connection failed:', error);
        client.end();
        process.exit(1);
      });
  } catch (error) {
    console.error('Connection setup failed:', error);
    process.exit(1);
  }
} else {
  console.log('No DATABASE_URL provided');
  process.exit(1);
}