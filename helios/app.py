import os
import pickle
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

def load_model(name):
    path = os.path.join(MODEL_DIR, name)
    if os.path.exists(path):
        with open(path, 'rb') as f:
            return pickle.load(f)
    return None

cpu_model      = load_model('cpu_isoforest.pkl')
storage_model  = load_model('storage_model.pkl')
network_model  = load_model('network_model.pkl')
login_model    = load_model('login_model.pkl')
content_model  = load_model('content_model.pkl')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'helios-ml-engine'})

@app.route('/predict/cpu', methods=['POST'])
def predict_cpu():
    data = request.get_json()
    cpu_val = float(data.get('cpu_value', 0))
    if cpu_model:
        features = np.array([[cpu_val, cpu_val * 0.9, cpu_val * 1.1]])
        score = cpu_model.predict(features)[0]
        anomaly = 1 if score == -1 else 0
    else:
        anomaly = 1 if cpu_val > 80 else 0
    return jsonify({'anomaly': anomaly, 'cpu_value': cpu_val})

@app.route('/predict/storage', methods=['POST'])
def predict_storage():
    data = request.get_json()
    storage_val = float(data.get('storage_value', 0))
    if storage_model:
        features = np.array([[storage_val, storage_val * 0.95]])
        score = storage_model.predict(features)[0]
        anomaly = 1 if score == -1 else 0
    else:
        anomaly = 1 if storage_val > 85 else 0
    return jsonify({'anomaly': anomaly, 'storage_value': storage_val})

@app.route('/predict/network', methods=['POST'])
def predict_network():
    data = request.get_json()
    latency = float(data.get('latency_ms', 0))
    error_rate = float(data.get('error_rate', 0))
    if network_model:
        features = np.array([[latency, error_rate]])
        cluster = int(network_model.predict(features)[0])
        anomaly = 1 if cluster == 2 else 0
    else:
        anomaly = 1 if latency > 2000 or error_rate > 0.5 else 0
        cluster = 2 if anomaly else 0
    return jsonify({'anomaly': anomaly, 'cluster': cluster})

@app.route('/predict/login', methods=['POST'])
def predict_login():
    data = request.get_json()
    req_rate = float(data.get('request_rate', 0))
    fail_ratio = float(data.get('fail_ratio', 0))
    if login_model:
        features = np.array([[req_rate, fail_ratio]])
        pred = int(login_model.predict(features)[0])
        anomaly = pred
    else:
        anomaly = 1 if fail_ratio > 0.7 and req_rate > 50 else 0
    return jsonify({'anomaly': anomaly, 'risk_score': fail_ratio})

@app.route('/predict/content', methods=['POST'])
def predict_content():
    data = request.get_json()
    content = str(data.get('content', ''))
    suspicious_keywords = ['DROP TABLE', 'SELECT *', '<script', 'UNION SELECT',
                           'OR 1=1', '../', 'exec(', 'eval(']
    anomaly = 1 if any(k.lower() in content.lower() for k in suspicious_keywords) else 0
    return jsonify({'anomaly': anomaly, 'confidence': 0.95 if anomaly else 0.05})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
