import os
import asyncio
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncpg

# 1. IMPORT THE INSTRUMENTATOR
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI(
    title="ARES Control API",
    description="Autonomous Reliability Engineering System - Central Control Hub",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. INITIALIZE INSTRUMENTATION (Exposes /metrics endpoint)
Instrumentator().instrument(app).expose(app)

ARES_DB_URL = os.getenv("ARES_DB_URL", "postgresql://ares_user:ares_password@ares-db:5432/ares_db")

db_pool = None

async def get_db():
    global db_pool
    if db_pool is None:
        for attempt in range(10):
            try:
                db_pool = await asyncpg.create_pool(ARES_DB_URL, min_size=2, max_size=10)
                break
            except Exception as e:
                print(f"DB connect attempt {attempt+1}/10 failed: {e}")
                await asyncio.sleep(3)
    return db_pool

@app.on_event("startup")
async def startup():
    pool = await get_db()
    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS metric_events (
                id SERIAL PRIMARY KEY,
                service VARCHAR(100) NOT NULL,
                metric_type VARCHAR(50),
                metric_value FLOAT,
                anomaly_score INTEGER DEFAULT 0,
                recorded_at TIMESTAMP DEFAULT NOW()
            );
            CREATE TABLE IF NOT EXISTS health_events (
                id SERIAL PRIMARY KEY,
                service VARCHAR(100) NOT NULL,
                status VARCHAR(50),
                action VARCHAR(100),
                recorded_at TIMESTAMP DEFAULT NOW()
            );
        """)
    print("ARES API ready - DB tables initialized")

class MetricPayload(BaseModel):
    service: str
    metric_type: str
    metric_value: float
    anomaly_score: Optional[int] = 0

class HealthPayload(BaseModel):
    service: str
    status: str
    action: Optional[str] = None

@app.get("/")
def root():
    return {"message": "ARES Control API", "version": "1.0.0", "status": "running"}

@app.get("/health")
def health():
    return {"status": "ok", "service": "ares-api", "timestamp": datetime.utcnow().isoformat()}

@app.post("/api/metric")
async def ingest_metric(payload: MetricPayload):
    pool = await get_db()
    async with pool.acquire() as conn:
        await conn.execute(
            """INSERT INTO metric_events (service, metric_type, metric_value, anomaly_score)
               VALUES ($1, $2, $3, $4)""",
            payload.service, payload.metric_type, payload.metric_value, payload.anomaly_score
        )
    return {"status": "recorded", "service": payload.service, "anomaly": payload.anomaly_score}

@app.post("/api/health")
async def ingest_health(payload: HealthPayload):
    pool = await get_db()
    async with pool.acquire() as conn:
        await conn.execute(
            """INSERT INTO health_events (service, status, action)
               VALUES ($1, $2, $3)""",
            payload.service, payload.status, payload.action
        )
    return {"status": "recorded", "service": payload.service, "health": payload.status}

@app.get("/api/status")
async def get_status():
    pool = await get_db()
    async with pool.acquire() as conn:
        metrics = await conn.fetch(
            """SELECT service, metric_type, metric_value, anomaly_score, recorded_at
               FROM metric_events ORDER BY recorded_at DESC LIMIT 50"""
        )
        health = await conn.fetch(
            """SELECT service, status, action, recorded_at
               FROM health_events ORDER BY recorded_at DESC LIMIT 20"""
        )
        anomaly_count = await conn.fetchval(
            "SELECT COUNT(*) FROM metric_events WHERE anomaly_score = 1"
        )
    return {
        "recent_metrics": [dict(r) for r in metrics],
        "recent_health_events": [dict(r) for r in health],
        "total_anomalies_detected": anomaly_count,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/anomalies")
async def get_anomalies():
    pool = await get_db()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """SELECT service, metric_type, metric_value, recorded_at
               FROM metric_events WHERE anomaly_score = 1
               ORDER BY recorded_at DESC LIMIT 100"""
        )
    return {"anomalies": [dict(r) for r in rows], "count": len(rows)}