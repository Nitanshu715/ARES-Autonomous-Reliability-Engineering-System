"""
ARES Health Agent
Polls /health from all 4 LUMIERE services every 10s.
If DOWN: triggers Docker container restart (self-healing).
Posts all events to ARES API.
"""
import os
import time
import subprocess
import requests

ARES_URL     = os.getenv("ARES_API_URL", "http://ares-api:8000")
SERVICES_ENV = os.getenv("SERVICES", "user-service:3001,product-service:3002,cart-service:3003,order-service:3004")
INTERVAL     = int(os.getenv("HEALTH_INTERVAL", "10"))

SERVICES = []
for svc in SERVICES_ENV.split(","):
    name, port = svc.strip().split(":")
    SERVICES.append({"name": name, "port": int(port)})

service_state = {svc["name"]: "UP" for svc in SERVICES}


def check_health(service):
    name = service["name"]
    port = service["port"]
    url  = f"http://{name}:{port}/health"
    try:
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            data = r.json()
            if data.get("status") == "ok":
                return "UP"
        return "DOWN"
    except Exception:
        return "DOWN"


def restart_container(name):
    """Restart a Docker container by name using docker CLI."""
    print(f"[HEALTH] HEALING -> Restarting container: {name}")
    try:
        result = subprocess.run(
            ["docker", "restart", name],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            print(f"[HEALTH] RESTART SUCCESS -> {name}")
            return True
        else:
            print(f"[HEALTH] RESTART FAILED -> {name}: {result.stderr}")
            return False
    except Exception as e:
        print(f"[HEALTH] RESTART ERROR -> {name}: {e}")
        return False


def post_health_event(service_name, status, action=None):
    try:
        requests.post(f"{ARES_URL}/api/health", json={
            "service": service_name,
            "status": status,
            "action": action
        }, timeout=5)
    except Exception as e:
        print(f"[HEALTH] ARES API post error: {e}")


def main():
    print("[HEALTH] Starting ARES Health Agent...")
    print(f"[HEALTH] Monitoring {len(SERVICES)} services every {INTERVAL}s")
    time.sleep(20)  # Wait for all services to start

    while True:
        for svc in SERVICES:
            name   = svc["name"]
            status = check_health(svc)
            prev   = service_state.get(name, "UP")

            if status == "UP":
                indicator = "\u2713"
                if prev == "DOWN":
                    print(f"[HEALTH] {indicator} RECOVERED -> {name}")
                    post_health_event(name, "RECOVERED", "service_restored")
                else:
                    print(f"[HEALTH] {indicator} {name}: healthy")
                    post_health_event(name, "UP")
                service_state[name] = "UP"

            else:  # DOWN
                print(f"[HEALTH] \u2717 DOWN -> {name}")
                post_health_event(name, "DOWN", "detected_failure")
                service_state[name] = "DOWN"

                # Trigger self-healing
                print(f"[HEALTH] \u2699 HEALING -> {name}...")
                post_health_event(name, "HEALING", "restart_container")
                success = restart_container(name)

                if success:
                    # Wait for recovery
                    recovered = False
                    for attempt in range(12):  # 60s max wait
                        time.sleep(5)
                        new_status = check_health(svc)
                        if new_status == "UP":
                            print(f"[HEALTH] \u2713 RECOVERED -> {name} (took ~{(attempt+1)*5}s)")
                            post_health_event(name, "RECOVERED", "restart_successful")
                            service_state[name] = "UP"
                            recovered = True
                            break
                    if not recovered:
                        print(f"[HEALTH] \u26a0 HEALING_TIMEOUT -> {name}")
                        post_health_event(name, "HEALING_TIMEOUT", "manual_intervention_needed")

        time.sleep(INTERVAL)


if __name__ == "__main__":
    main()
