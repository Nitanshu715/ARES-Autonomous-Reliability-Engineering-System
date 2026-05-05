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

const PORT = process.env.PORT || 3004;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_me';

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      total_amount NUMERIC(10, 2) NOT NULL,
      shipping_address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL,
      product_name VARCHAR(200) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      quantity INTEGER NOT NULL
    );
  `);
  console.log('✅ Orders tables ready');
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
  res.json({ status: 'ok', service: 'order-service', timestamp: new Date().toISOString() });
});

app.post('/order', authenticate, async (req, res) => {
  const { items, shipping_address } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required and must not be empty' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, total.toFixed(2), shipping_address || null]
    );
    const order = orderResult.rows[0];
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.product_name, item.price, item.quantity]
      );
    }
    await client.query('COMMIT');
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
    res.status(201).json({
      message: 'Order placed successfully',
      order: { ...order, items: itemsResult.rows },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Place order error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.get('/orders', authenticate, async (req, res) => {
  try {
    const ordersResult = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          'SELECT * FROM order_items WHERE order_id = $1',
          [order.id]
        );
        return { ...order, items: itemsResult.rows };
      })
    );
    res.json({ orders, total: orders.length });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/orders/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const order = orderResult.rows[0];
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    res.json({ order: { ...order, items: itemsResult.rows } });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Order Service running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to init DB:', err);
  process.exit(1);
});