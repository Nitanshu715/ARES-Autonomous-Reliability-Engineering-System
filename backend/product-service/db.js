const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // Pointing to the specific Product DB variable
  connectionString: process.env.PRODUCT_DB_URL,
  ssl: false, // <--- CRITICAL: Disables SSL for the local Docker database
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 5,
});

pool.on('connect', () => {
  console.log('✅ Product Service connected to Local PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err.message);
});

module.exports = pool;