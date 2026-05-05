const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // Using the specific variable name for the Order Service
  connectionString: process.env.ORDER_DB_URL,
  ssl: false, // <--- DISABLING SSL FOR LOCAL DOCKER CONNECTION
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 5,
});

pool.on('connect', () => {
  console.log('✅ Order Service connected to Local PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err.message);
});

module.exports = pool;