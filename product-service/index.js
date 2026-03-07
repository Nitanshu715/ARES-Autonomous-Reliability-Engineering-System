const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      price NUMERIC(10, 2) NOT NULL,
      stock INTEGER DEFAULT 0,
      category VARCHAR(100),
      image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const count = await pool.query('SELECT COUNT(*) FROM products');
  if (parseInt(count.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO products (name, description, price, stock, category, image_url) VALUES
      ('Wireless Headphones', 'High quality noise-cancelling wireless headphones', 2999.00, 50, 'Electronics', 'https://via.placeholder.com/300x300?text=Headphones'),
      ('Running Shoes', 'Lightweight and comfortable running shoes', 1499.00, 100, 'Footwear', 'https://via.placeholder.com/300x300?text=Shoes'),
      ('Coffee Maker', 'Automatic drip coffee maker with 12-cup capacity', 899.00, 30, 'Kitchen', 'https://via.placeholder.com/300x300?text=Coffee+Maker'),
      ('Yoga Mat', 'Non-slip premium yoga mat with carrying strap', 499.00, 75, 'Sports', 'https://via.placeholder.com/300x300?text=Yoga+Mat'),
      ('Backpack', 'Water-resistant 30L travel backpack', 1299.00, 60, 'Bags', 'https://via.placeholder.com/300x300?text=Backpack');
    `);
    console.log('✅ Sample products seeded');
  }

  console.log('✅ Products table ready');
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'product-service', timestamp: new Date().toISOString() });
});

app.get('/products', async (req, res) => {
  const { category, search } = req.query;
  try {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ products: result.rows, total: result.rows.length });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product: result.rows[0] });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/products', async (req, res) => {
  const { name, description, price, stock, category, image_url } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'name and price are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, category, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description || null, price, stock || 0, category || null, image_url || null]
    );
    res.status(201).json({ message: 'Product created', product: result.rows[0] });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Product Service running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to init DB:', err);
  process.exit(1);
});