# ARES — Complete Setup Guide
# Do these steps IN ORDER. Do not skip any.

## Prerequisites (install these if you don't have them)
- Docker Desktop: https://www.docker.com/products/docker-desktop/
- Node.js 20: https://nodejs.org
- Git: already installed

---

## STEP 1 — Folder Structure

Your final folder should look like this:

ARES/
├── frontend/           ← your existing Next.js project
├── backend/
│   ├── user-service/
│   ├── product-service/
│   ├── cart-service/
│   └── order-service/
├── helios/             ← your existing Helios repo
├── ares-control/       ← new folder (from this output)
│   ├── api/
│   │   └── main.py
│   ├── agents/
│   │   ├── monitoring_agent.py
│   │   └── health_agent.py
│   ├── Dockerfile
│   └── requirements.txt
├── prometheus/
│   └── prometheus.yml
├── dashboard/          ← contains page.tsx (copy this into frontend)
│   └── page.tsx
├── docker-compose.yml
└── .env

---

## STEP 2 — Copy files from this output folder

1. Copy docker-compose.yml → ARES/docker-compose.yml
2. Copy prometheus/prometheus.yml → ARES/prometheus/prometheus.yml
3. Copy ares-control/ folder → ARES/ares-control/
4. Copy helios/Dockerfile → ARES/helios/Dockerfile  (your helios repo)
5. Copy dashboard/page.tsx → ARES/frontend/src/app/dashboard/page.tsx
   (create the dashboard folder first: mkdir frontend/src/app/dashboard)
6. Copy .env.example → ARES/.env  then fill in your actual Neon DB URLs

---

## STEP 3 — Add Dockerfile to each backend service

Copy the Dockerfile.template content into these 4 files:
- backend/user-service/Dockerfile
- backend/product-service/Dockerfile
- backend/cart-service/Dockerfile
- backend/order-service/Dockerfile

Change the EXPOSE port in each:
- user-service:    EXPOSE 3001
- product-service: EXPOSE 3002
- cart-service:    EXPOSE 3003
- order-service:   EXPOSE 3004

---

## STEP 4 — Add metrics + health endpoint to each backend service

In each backend service folder:

1. Install prom-client:
   npm install prom-client

2. Copy metrics.js into: backend/[service-name]/src/metrics.js

3. In your main index.js or server.js, add these lines at the top after express setup:
   
   const { metricsMiddleware, metricsRoute } = require('./src/metrics');
   app.use(metricsMiddleware);
   app.get('/metrics', metricsRoute);
   app.get('/health', (req, res) => res.json({
     status: 'ok',
     service: 'user-service',   // change per service
     uptime: process.uptime()
   }));

---

## STEP 5 — Fill in your .env file

Open ARES/.env and replace the placeholder values with your actual:
- Neon PostgreSQL connection strings (same ones you use on Render)
- JWT_SECRET (same one you use currently)

---

## STEP 6 — Start the entire system

Open terminal in the ARES/ root folder:

docker compose up --build

First time takes 5-10 minutes to build all images and pull Prometheus/Grafana.
After that: under 30 seconds.

You will see logs from all containers scrolling. When you see:
  ares-api      | INFO: Application startup complete.
  monitoring-agent | [time] MONITOR | user-service: CPU=...
  health-agent     | [time] HEALTH  | ✓ user-service: healthy

Everything is running.

---

## STEP 7 — Open the dashboard

In your Next.js frontend terminal:
npm run dev

Open: http://localhost:3000/dashboard

You should see:
- 4 service health cards with live CPU/memory/latency
- Helios ML Score Feed updating every 15 seconds
- MAPE-K Loop Status showing all 5 steps ACTIVE

---

## STEP 8 — Test the self-healing demo

In the dashboard, click "Simulate Failure" on the order-service card.

Watch:
1. order-service card turns RED (DOWN)
2. Health Agent detects in 10 seconds
3. ARES API triggers healing
4. Docker restarts the container
5. order-service card turns GREEN (HEALTHY)
6. Incident appears in timeline with recovery time

Total time: under 15 seconds. No human involved.

---

## STEP 9 — Other URLs to check

- ARES API docs:   http://localhost:8000/docs   (FastAPI auto-docs)
- Prometheus:      http://localhost:9090
- Grafana:         http://localhost:3000 (user: admin, pass: ares2024)

---

## Common Issues

Problem: "Cannot connect to Docker daemon"
Fix: Make sure Docker Desktop is running before running docker compose up

Problem: "Port 3000 already in use"
Fix: Your Next.js dev server uses 3000. Either stop it before running docker compose,
     or change Grafana port in docker-compose.yml to "3001:3000"

Problem: Database connection failed
Fix: Check your .env Neon URLs. They should start with postgresql://

Problem: Helios container exits immediately
Fix: Your helios/app.py might need the Flask app to bind to 0.0.0.0:
     app.run(host='0.0.0.0', port=5000)
     Add this to the bottom of your helios/app.py if not already there.

Problem: Monitoring Agent shows score 0.000 for everything
Fix: Normal if services just started. Prometheus needs ~2 minutes to collect
     enough data for rate() queries to return values.
