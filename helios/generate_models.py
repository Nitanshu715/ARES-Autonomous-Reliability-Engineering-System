"""
Run this once inside the container to generate all 5 model pkl files.
Called automatically by the Dockerfile entrypoint.
"""
import os
import pickle
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.cluster import KMeans
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

np.random.seed(42)
N = 5000
N_ANOM = 500

# ── 1. CPU Isolation Forest ──────────────────────────────────────────────────
print("Training cpu_isoforest...")
cpu_normal = np.random.normal(loc=25, scale=8, size=(N, 3))
cpu_anom   = np.random.normal(loc=90, scale=5, size=(N_ANOM, 3))
cpu_data   = np.vstack([cpu_normal, cpu_anom])
cpu_model  = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
cpu_model.fit(cpu_data)
with open(os.path.join(MODEL_DIR, 'cpu_isoforest.pkl'), 'wb') as f:
    pickle.dump(cpu_model, f)
print("  -> cpu_isoforest.pkl saved")

# ── 2. Storage Isolation Forest ──────────────────────────────────────────────
print("Training storage_model...")
storage_normal = np.random.normal(loc=40, scale=10, size=(N, 2))
storage_anom   = np.random.normal(loc=92, scale=3, size=(N_ANOM, 2))
storage_data   = np.vstack([storage_normal, storage_anom])
storage_model  = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
storage_model.fit(storage_data)
with open(os.path.join(MODEL_DIR, 'storage_model.pkl'), 'wb') as f:
    pickle.dump(storage_model, f)
print("  -> storage_model.pkl saved")

# ── 3. Network KMeans ────────────────────────────────────────────────────────
print("Training network_model...")
cluster0 = np.random.normal(loc=[50, 0.01],  scale=[15, 0.005], size=(N, 2))
cluster1 = np.random.normal(loc=[300, 0.1],  scale=[50, 0.05],  size=(N//2, 2))
cluster2 = np.random.normal(loc=[2500, 0.8], scale=[200, 0.1],  size=(N_ANOM, 2))
net_data  = np.vstack([cluster0, cluster1, cluster2])
net_model = KMeans(n_clusters=3, random_state=42, n_init=10)
net_model.fit(net_data)
with open(os.path.join(MODEL_DIR, 'network_model.pkl'), 'wb') as f:
    pickle.dump(net_model, f)
print("  -> network_model.pkl saved")

# ── 4. Login Logistic Regression ─────────────────────────────────────────────
print("Training login_model...")
login_normal = np.column_stack([
    np.random.uniform(1, 10, N),
    np.random.uniform(0, 0.2, N)
])
login_anom = np.column_stack([
    np.random.uniform(80, 200, N_ANOM),
    np.random.uniform(0.6, 1.0, N_ANOM)
])
login_data   = np.vstack([login_normal, login_anom])
login_labels = np.array([0] * N + [1] * N_ANOM)
login_model  = LogisticRegression(random_state=42, max_iter=1000)
login_model.fit(login_data, login_labels)
with open(os.path.join(MODEL_DIR, 'login_model.pkl'), 'wb') as f:
    pickle.dump(login_model, f)
print("  -> login_model.pkl saved")

# ── 5. Content Model (simple rule-based, no TF-IDF needed for inference) ─────
print("Training content_model... (rule-based, no pkl needed)")
# Content model is rule-based in app.py — no pkl required
# Write a dummy pkl so load_model doesn't fail
with open(os.path.join(MODEL_DIR, 'content_model.pkl'), 'wb') as f:
    pickle.dump({'type': 'rule_based', 'version': '1.0'}, f)
print("  -> content_model.pkl saved")

print("\nAll 5 Helios models generated successfully.")
print(f"Saved to: {MODEL_DIR}")
