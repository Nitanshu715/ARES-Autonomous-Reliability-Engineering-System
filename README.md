<div align="center">
  <h1 style="margin: 10px 0 0 0; font-weight:700; letter-spacing:1px;">
    ARES
  </h1>
  <h3 style="margin: 4px 0 10px 0; font-weight:400;">
    Autonomous Reliability Engineering System
  </h3>
  <p style="margin: 0; font-size: 15px;">
    <strong>
      AI-Driven Detection • Self-Healing Infrastructure • Production-Grade DevOps
    </strong>
  </p>
  <img src="ARES-Logo.PNG" alt="ARES Logo" width="400" />
</div>

---

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Cloud--Native-2F80ED?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Architecture-Microservices-27AE60?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Reliability-Autonomous-E63946?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/ML-Anomaly%20Detection-F4A261?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/CI/CD-Fully%20Automated-6A4C93?style=for-the-badge"/>
</p>
<p align="center">
  <a href="https://letslumiere.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel" />
  </a>
</p>

---

## What is ARES?

**ARES (Autonomous Reliability Engineering System)** is a production-grade, AI-powered infrastructure platform that monitors, detects anomalies in, and autonomously heals distributed microservices applications with zero human intervention.

Built on top of the **LUMIERE** luxury e-commerce SaaS platform (4 Node.js microservices), ARES wraps it with a full autonomous control plane powered by machine learning, real-time telemetry, and a MAPE-K (Monitor-Analyze-Plan-Execute-Knowledge) feedback loop.

> ARES does not just alert you when something breaks. It fixes it before you even notice.

Traditional monitoring tools stop at detection. ARES goes further:

```
Traditional Model:  Monitoring → Alert → Human → Recovery (minutes to hours)
ARES Model:         Telemetry → ML → Decision Engine → Auto-Heal (seconds)
```

---

## Key Highlights

- **Self-healing infrastructure** — containers automatically restart, services recover without manual action
- **Helios ML Engine** — custom-trained Isolation Forest + KMeans models detect CPU, memory, network, and login anomalies
- **MAPE-K Control Loop** — production-grade autonomous control architecture used by IBM, Red Hat, and NASA
- **Full observability** — Prometheus metrics + Grafana dashboards + real-time health agent checks
- **Research-backed** — Helios anomaly detection accepted at ICATEET 2026 international conference
- **Live frontend** — LUMIERE e-commerce deployed at [letslumiere.vercel.app](https://letslumiere.vercel.app/)

---

## Architecture

ARES operates across two independent but tightly coupled planes.

### Layer 1 — LUMIERE Application Plane

The live SaaS application that ARES monitors and heals.

```
┌─────────────────────────────────────────────────────────────┐
│                      LUMIERE SaaS Platform                  │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ User Service│  │Product Svc  │  │  Cart Svc   │        │
│  │  Port 3001  │  │  Port 3002  │  │  Port 3003  │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                 │
│  ┌──────┴────────────────┴────────────────┴──────┐         │
│  │              Neon PostgreSQL (Cloud)           │         │
│  └───────────────────────────────────────────────┘         │
│                                                             │
│  ┌─────────────┐   ┌────────────────────────────┐          │
│  │ Order Svc   │   │   Next.js Frontend (Vercel) │          │
│  │  Port 3004  │   │   letslumiere.vercel.app    │          │
│  └─────────────┘   └────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Layer 2 — ARES Control Plane

The autonomous reliability brain that watches and heals Layer 1.

```
┌─────────────────────────────────────────────────────────────────┐
│                       ARES Control Plane                        │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────────────────────┐   │
│  │  Monitoring Agent │    │         Helios ML Engine         │   │
│  │  Polls /metrics   │───▶│  Isolation Forest + KMeans       │   │
│  │  every 15s        │    │  CPU / Memory / Network / Login  │   │
│  └──────────────────┘    └──────────────┬───────────────────┘   │
│                                         │                        │
│  ┌──────────────────┐    ┌──────────────▼───────────────────┐   │
│  │   Health Agent   │    │          ARES API (FastAPI)       │   │
│  │  Polls /health   │───▶│  Ingests metrics, stores alerts   │   │
│  │  every 10s       │    │  Exposes /api/metric /api/health  │   │
│  └──────────────────┘    └──────────────┬───────────────────┘   │
│                                         │                        │
│  ┌──────────────────────────────────────▼───────────────────┐   │
│  │                    MAPE-K Loop                            │   │
│  │  Monitor → Analyze → Plan → Execute → Knowledge          │   │
│  │                                                           │   │
│  │  If anomaly detected → restart container via Docker API   │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────┐    ┌────────────────┐                       │
│  │   Prometheus   │    │    Grafana      │                       │
│  │   Port 9090    │    │   Port 3000     │                       │
│  └────────────────┘    └────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## MAPE-K Control Loop

ARES implements the industry-standard autonomous computing reference model:

| Phase | Component | Action |
|-------|-----------|--------|
| **Monitor** | Monitoring Agent + Health Agent | Continuously polls `/metrics` and `/health` endpoints across all 4 services |
| **Analyze** | Helios ML Engine | Scores each metric reading with Isolation Forest; flags anomalies with Score = 1.0 |
| **Plan** | ARES Decision Engine | Correlates anomaly signals with service health status to determine action |
| **Execute** | Health Agent / Docker API | Triggers container restart or service recovery automatically |
| **Knowledge** | Neon PostgreSQL + Prometheus | Stores all decisions and metric history for future model retraining |

---

## Helios ML Engine

The intelligence core of ARES. Five independently trained scikit-learn models handle different anomaly classes:

| Model | Algorithm | Detects |
|-------|-----------|---------|
| `cpu_isoforest.pkl` | Isolation Forest | CPU spike anomalies and sustained overload |
| `storage_model.pkl` | Isolation Forest | Abnormal disk I/O and storage usage patterns |
| `network_model.pkl` | KMeans Clustering | Network traffic anomalies and unusual latency |
| `login_model.pkl` | Logistic Regression | Brute-force login attempts and credential stuffing |
| `content_model.pkl` | TF-IDF + Logistic Regression | Malicious or anomalous API payload content |

**Training methodology:** All models were trained on synthetic baseline telemetry generated by the LUMIERE services under normal operating conditions. The Isolation Forest models use a contamination factor of 0.1 (10% anomaly expectation) calibrated for containerized microservice workloads.

**API endpoints exposed by Helios:**

```
POST /predict/cpu       → { "anomaly": 0|1, "cpu_value": float }
POST /predict/storage   → { "anomaly": 0|1, "storage_value": float }
POST /predict/network   → { "anomaly": 0|1, "cluster": int }
POST /predict/login     → { "anomaly": 0|1, "risk_score": float }
POST /predict/content   → { "anomaly": 0|1, "confidence": float }
```

---

## Service Architecture

### LUMIERE Microservices

All 4 backend services are Node.js + Express, each independently containerized with:
- `/health` endpoint for the ARES Health Agent
- `/metrics` endpoint (prom-client) for Prometheus scraping
- Neon PostgreSQL (cloud-hosted, SSL) for persistent storage
- JWT-based authentication

| Service | Port | Database | Responsibilities |
|---------|------|----------|-----------------|
| `user-service` | 3001 | `users` table | Registration, login, JWT tokens, profile |
| `product-service` | 3002 | `products` table | Product catalog, seeding, search, categories |
| `cart-service` | 3003 | `cart_items` table | Cart CRUD, quantity management |
| `order-service` | 3004 | `orders` + `order_items` tables | Order placement, history, transactional writes |

### ARES Control Services

| Service | Port | Technology | Role |
|---------|------|-----------|------|
| `helios-ml-engine` | 5000 | Python + Flask + scikit-learn | ML inference endpoint |
| `ares-api` | 8000 | Python + FastAPI | Central control hub, metric ingestion |
| `monitoring-agent` | internal | Python | Polls all service /metrics every 15s |
| `health-agent` | internal | Python | Polls all service /health every 10s |
| `prometheus` | 9090 | Prometheus | Scrapes and stores time-series metrics |
| `grafana` | 3000 | Grafana | Visualization and dashboards |
| `ares-db` | 5432 | PostgreSQL 15 | Local DB for ARES state storage |

---

## Self-Healing Demo

To demonstrate autonomous healing during a presentation or evaluation:

1. Start the full stack: `docker compose up --build`
2. Wait for all services to show `healthy`
3. Open Docker Desktop and **stop** any single service container (e.g., `order-service`)
4. Watch the logs:

```
health-agent  | [2026] HEALTH | ✗ DOWN | order-service
health-agent  | [2026] HEALTH | ⚙ HEALING | Restarting order-service...
health-agent  | [2026] HEALTH | ✓ RECOVERED | order-service
```

5. The service comes back in under 30 seconds without any human action.

---

## Prerequisites

- Docker Desktop (WSL2 backend) — Windows 10/11
- Node.js 20+ (for frontend dev only)
- Git
- Mobile hotspot or unrestricted internet (port 5432 must not be blocked)

---

## Setup and Running

### 1. Clone the repository

```bash
git clone https://github.com/Nitanshu715/ARES-Autonomous-Reliability-Engineering-System.git
cd ARES-Autonomous-Reliability-Engineering-System
```

### 2. Configure environment

Create `.env` in the project root:

```env
USER_DB_URL=postgresql://neondb_owner:<password>@ep-small-butterfly-a4xmt1c4-pooler.us-east-1.aws.neon.tech/neondb?sslmode=verify-full
PRODUCT_DB_URL=postgresql://neondb_owner:<password>@ep-small-butterfly-a4xmt1c4-pooler.us-east-1.aws.neon.tech/neondb?sslmode=verify-full
CART_DB_URL=postgresql://neondb_owner:<password>@ep-small-butterfly-a4xmt1c4-pooler.us-east-1.aws.neon.tech/neondb?sslmode=verify-full
ORDER_DB_URL=postgresql://neondb_owner:<password>@ep-small-butterfly-a4xmt1c4-pooler.us-east-1.aws.neon.tech/neondb?sslmode=verify-full
JWT_SECRET=ares_lumiere_jwt_secret_2024
NEXT_PUBLIC_ARES_API_URL=http://localhost:8000
```

### 3. Launch the full stack

```bash
docker compose down --volumes --remove-orphans
docker system prune -f
docker compose up --build
```

### 4. Verify services are running

Watch for these lines in logs:

```
user-service    | ✅ Users table ready
user-service    | 🚀 User Service running on port 3001
product-service | ✅ Products table ready
product-service | 🚀 Product Service running on port 3002
cart-service    | ✅ Cart table ready
cart-service    | 🚀 Cart Service running on port 3003
order-service   | ✅ Orders tables ready
order-service   | 🚀 Order Service running on port 3004
helios-ml-engine| * Running on http://0.0.0.0:5000
ares-api        | INFO: Uvicorn running on http://0.0.0.0:8000
health-agent    | ✓ user-service: healthy
health-agent    | ✓ product-service: healthy
health-agent    | ✓ cart-service: healthy
health-agent    | ✓ order-service: healthy
```

### 5. Launch the frontend (separate terminal)

```bash
cd frontend
npm install
npm run dev
```

---

## Access URLs

Once the full stack is running, access these URLs in your browser:

| URL | Service |
|-----|---------|
| `http://localhost:3000/dashboard` | ARES Self-Healing Dashboard |
| `http://localhost:9090` | Prometheus metrics explorer |
| `http://localhost:8000/docs` | ARES API (FastAPI Swagger UI) |
| `http://localhost:5000` | Helios ML Engine |
| `http://localhost:3001/health` | User Service health check |
| `http://localhost:3002/health` | Product Service health check |
| `http://localhost:3003/health` | Cart Service health check |
| `http://localhost:3004/health` | Order Service health check |
| `http://localhost:3001/products` | Product catalog API |
| [letslumiere.vercel.app](https://letslumiere.vercel.app/) | Live LUMIERE frontend |

---

## Repository Structure

```
ARES-Autonomous-Reliability-Engineering-System/
│
├── backend/
│   ├── user-service/          # Node.js auth + user management
│   │   ├── index.js
│   │   ├── db.js              # Neon PostgreSQL pool (USER_DB_URL)
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── product-service/       # Node.js product catalog
│   │   ├── index.js
│   │   ├── db.js              # Neon PostgreSQL pool (PRODUCT_DB_URL)
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── cart-service/          # Node.js cart management
│   │   ├── index.js
│   │   ├── db.js              # Neon PostgreSQL pool (CART_DB_URL)
│   │   ├── package.json
│   │   └── Dockerfile
│   └── order-service/         # Node.js order processing (transactional)
│       ├── index.js
│       ├── db.js              # Neon PostgreSQL pool (ORDER_DB_URL)
│       ├── package.json
│       └── Dockerfile
│
├── ares-control/
│   ├── api/
│   │   └── main.py            # FastAPI central control hub
│   ├── agents/
│   │   ├── monitoring_agent.py  # Polls /metrics, calls Helios
│   │   └── health_agent.py      # Polls /health, triggers healing
│   ├── Dockerfile
│   └── requirements.txt
│
├── helios/
│   ├── app.py                 # Flask ML inference server
│   ├── generate_models.py     # Trains and saves all 5 pkl models
│   ├── models/
│   │   ├── cpu_isoforest.pkl
│   │   ├── storage_model.pkl
│   │   ├── network_model.pkl
│   │   ├── login_model.pkl
│   │   └── content_model.pkl
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                  # Next.js LUMIERE UI + ARES Dashboard
│   └── src/app/
│       ├── dashboard/
│       │   └── page.tsx       # Real-time ARES control dashboard
│       └── ...
│
├── prometheus/
│   └── prometheus.yml         # Scrape config for all 4 services
│
├── docker-compose.yml         # Full stack orchestration
├── .env                       # Environment variables (gitignored)
├── .env.example               # Safe template for contributors
└── README.md
```

---

## Environment Variables Reference

| Variable | Used By | Description |
|----------|---------|-------------|
| `USER_DB_URL` | user-service | Neon PostgreSQL connection string |
| `PRODUCT_DB_URL` | product-service | Neon PostgreSQL connection string |
| `CART_DB_URL` | cart-service | Neon PostgreSQL connection string |
| `ORDER_DB_URL` | order-service | Neon PostgreSQL connection string |
| `JWT_SECRET` | user/cart/order-service | JWT signing secret |
| `NEXT_PUBLIC_ARES_API_URL` | Next.js frontend | ARES API base URL |

---

## Technology Stack

| Domain | Technology | Version |
|--------|-----------|---------|
| Frontend | Next.js + React | 14+ |
| Backend Services | Node.js + Express | 20 LTS |
| ML Engine | Python + Flask + scikit-learn | 3.11 / 1.x |
| Control API | Python + FastAPI + Uvicorn | 3.11 |
| Containers | Docker + Docker Compose | 29+ |
| Cloud Database | Neon PostgreSQL (pooler) | 15 |
| Local Database | PostgreSQL 15 Alpine | 15 |
| Metrics | Prometheus + prom-client | 3.x |
| Visualization | Grafana | 13 |
| ML Models | Isolation Forest, KMeans, LogReg, TF-IDF | scikit-learn |
| Authentication | JWT (jsonwebtoken) | 9.x |
| Password Hashing | bcryptjs | 2.x |

---

## Research Publication

The Helios ML Engine anomaly detection subsystem has been independently accepted for publication:

**"Helios: AI-Enabled Secure Cloud Infrastructures and DevSecOps Threat Detection"**  
*Presented at ICATEET 2026 — International Conference on Advanced Technologies in Engineering and Technology*  

---

## Team

| Members |
|------|
| **Nitanshu Tak** |
| **Aarohi Jaiswal** |
| **Sristee Bhindwar** |
| **Aakriti Dhawan** |

**Institution:** BTech CSE — Cloud Computing and Virtualization Technology (CCVT)  
**University:** UPES Dehradun, India

---

## License

Academic Research and Innovation Project — UPES Dehradun 2026
