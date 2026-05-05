// ─────────────────────────────────────────────────────────────────────────────
// ADD THIS TO EACH BACKEND SERVICE
// File: backend/[service-name]/src/metrics.js
//
// Then in your main index.js / server.js add:
//   const { metricsMiddleware, metricsRoute } = require('./metrics');
//   app.use(metricsMiddleware);
//   app.get('/metrics', metricsRoute);
//   app.get('/health', (req, res) => res.json({ status: 'ok', service: 'user-service', uptime: process.uptime() }));
// ─────────────────────────────────────────────────────────────────────────────

const client = require('prom-client');

// Create a Registry
const register = new client.Registry();

// Default metrics (CPU, memory, event loop lag etc.)
client.collectDefaultMetrics({ register });

// Custom: HTTP request duration histogram
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

// Custom: HTTP request counter
const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Middleware — wraps every request
const metricsMiddleware = (req, res, next) => {
  if (req.path === '/metrics' || req.path === '/health') return next();

  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const labels = {
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    };
    end(labels);
    httpRequestTotal.inc(labels);
  });
  next();
};

// Route handler for /metrics
const metricsRoute = async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};

module.exports = { metricsMiddleware, metricsRoute };
