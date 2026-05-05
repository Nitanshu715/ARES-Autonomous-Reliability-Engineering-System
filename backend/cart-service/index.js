const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// ── ARES Monitoring: metrics + health ─────────────────────
const client = require('prom-client');
const register = new client.Registry();
client.collectDefaultMetrics({ register });
const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});
app.use((req, res, next) => {
  if (req.path === '/metrics' || req.path === '/health') return next();
  const end = httpDuration.startTimer();
  res.on('finish', () => end({ method: req.method, route: req.path, status: res.statusCode }));
  next();
});
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
// ──────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3003;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_me';

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name VARCHAR(200) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      image_url TEXT,
      added_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    );
  `);
  console.log('✅ Cart table ready');
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cart-service', timestamp: new Date().toISOString() });
});

app.get('/cart', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 ORDER BY added_at DESC',
      [req.user.id]
    );
    const items = result.rows;
    const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    res.json({ items, total: total.toFixed(2), count: items.length });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/cart/add', authenticate, async (req, res) => {
  const { product_id, product_name, price, quantity = 1, image_url } = req.body;
  if (!product_id || !product_name || !price) {
    return res.status(400).json({ error: 'product_id, product_name, and price are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, product_name, price, quantity, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + $5
       RETURNING *`,
      [req.user.id, product_id, product_name, price, quantity, image_url || null]
    );
    res.status(201).json({ message: 'Item added to cart', item: result.rows[0] });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/cart/remove', authenticate, async (req, res) => {
  const { product_id } = req.body;
  if (!product_id) {
    return res.status(400).json({ error: 'product_id is required' });
  }
  try {
    const result = await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [req.user.id, product_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    res.json({ message: 'Item removed from cart', item: result.rows[0] });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Cart Service running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to init DB:', err);
  process.exit(1);
});