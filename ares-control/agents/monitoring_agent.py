"""
ARES Monitoring Agent
Polls /metrics from all 4 LUMIERE services every 15s,
sends readings to Helios ML Engine for anomaly scoring,
then posts results to ARES API.
"""
import os
import time
import re
import requests
import random

HELIOS_URL  = os.getenv("HELIOS_URL",  "http://helios-ml-engine:5000")
ARES_URL    = os.getenv("ARES_API_URL", "http://ares-api:8000")
SERVICES_ENV = os.getenv("SERVICES", "user-service:3001,product-service:3002,cart-service:3003,order-service:3004")
INTERVAL    = int(os.getenv("POLL_INTERVAL", "15"))

SERVICES = []
for svc in SERVICES_ENV.split(","):
    name, port = svc.strip().split(":")
    SERVICES.append({"name": name, "port": int(port)})


def parse_prometheus(text, metric_name):
    """Extract a single metric value from Prometheus text format."""
    for line in text.splitlines():
        if line.startswith(metric_name) and not line.startswith("#"):
            parts = line.split()
            if len(parts) >= 2:
                try:
                    return float(parts[-1])
                except ValueError:
                    pass
    return None


def poll_metrics(service):
    name = service["name"]
    port = service["port"]
    url  = f"http://{name}:{port}/metrics"
    try:
        r = requests.get(url, timeout=5)
        if r.status_code != 200:
            return None
        text = r.text

        # Extract CPU seconds (convert to % approximation)
        cpu_seconds = parse_prometheus(text, "process_cpu_seconds_total")
        cpu_pct = round((cpu_seconds or 0) * 100 % 100, 2)

        # Extract memory bytes -> MB
        mem_bytes = parse_prometheus(text, "process_resident_memory_bytes")
        mem_mb = round((mem_bytes or 0) / (1024 * 1024), 2)

        return {"cpu_pct": cpu_pct, "mem_mb": mem_mb}
    except Exception as e:
        print(f"[MONITOR] ERROR polling {name}: {e}")
        return None


def score_anomaly(metric_type, value):
    """Send metric to Helios for scoring."""
    try:
        if metric_type == "cpu":
            r = requests.post(f"{HELIOS_URL}/predict/cpu",
                              json={"cpu_value": value}, timeout=5)
        elif metric_type == "storage":
            r = requests.post(f"{HELIOS_URL}/predict/storage",
                              json={"storage_value": value}, timeout=5)
        else:
            return 0
        data = r.json()
        return data.get("anomaly", 0)
    except Exception as e:
        print(f"[MONITOR] Helios score error: {e}")
        return 0


def post_metric(service_name, metric_type, value, anomaly):
    """Post metric reading to ARES API."""
    try:
        requests.post(f"{ARES_URL}/api/metric", json={
            "service": service_name,
            "metric_type": metric_type,
            "metric_value": value,
            "anomaly_score": anomaly
        }, timeout=5)
    except Exception as e:
        print(f"[MONITOR] ARES API post error: {e}")


def main():
    print("[MONITOR] Starting ARES Monitoring Agent...")
    print(f"[MONITOR] Polling {len(SERVICES)} services every {INTERVAL}s")
    time.sleep(15)  # Wait for services to be ready

    while True:
        for svc in SERVICES:
            name = svc["name"]
            metrics = poll_metrics(svc)
            if metrics:
                cpu_anom = score_anomaly("cpu", metrics["cpu_pct"])
                mem_anom = score_anomaly("storage", metrics["mem_mb"])

                post_metric(name, "cpu_pct", metrics["cpu_pct"], cpu_anom)
                post_metric(name, "mem_mb",  metrics["mem_mb"],  mem_anom)

                status = "ANOMALY" if (cpu_anom or mem_anom) else "OK"
                print(f"[MONITOR] {name} | CPU={metrics['cpu_pct']}% "
                      f"MEM={metrics['mem_mb']}MB | {status}")
            else:
                print(f"[MONITOR] {name} | UNREACHABLE")

        time.sleep(INTERVAL)


if __name__ == "__main__":
    main()
