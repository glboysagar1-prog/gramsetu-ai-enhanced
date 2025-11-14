// test-db-connection.js
import dotenv from 'dotenv';
dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('Full URL:', process.env.DATABASE_URL);