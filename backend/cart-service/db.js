const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // Ensure you use the correct variable for each service (USER_DB_URL, PRODUCT_DB_URL, etc.)
  connectionString: process.env.CART_DB_URL, 
  ssl: false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 5,
});

pool.on('connect', () => {
  console.log('✅ Service connected to Local PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err.message);
});

module.exports = pool;