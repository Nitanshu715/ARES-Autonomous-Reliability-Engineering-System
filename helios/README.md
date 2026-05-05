# 🚀 Helios – AI-Powered Cloud Anomaly Detection

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

---

## 🌌 Overview
Helios is a **cloud-native anomaly detection system** that integrates **Machine Learning (ML)** with **AWS Services** to detect and alert anomalies across critical infrastructure metrics such as:
- 🖥️ **CPU Utilization**
- 🌐 **Network Traffic**
- 🔐 **Unauthorized Login Attempts**
- 🧾 **Content Injection**
- 💾 **Storage Growth**

Helios ensures **proactive monitoring**, **real-time alerts**, and **self-healing readiness**, all while running on AWS Free Tier.


**Also, Helios is a part or a prototype product for a research paper which is going to be on the topic of DevSecOps: AI/ML Threat Detection in Cloud and Self Healing.**                                    
=> Rights and credits owned by **Nitanshu Tak**.

---

## 📂 Project Structure
```bash
helios/
├─ notebooks/          # Model training notebooks (Colab)
├─ ec2_agent/          # Flask API server
├─ lambda/             # Future automation hooks
├─ demo/               # Screenshots, demo video link
├─ ppt/ paper/         # Research + Presentation files
└─ README.md
```

---

## 🏗️ Architecture

| Component     | Service / Tool         | Role |
|---------------|------------------------|------|
| ML Models     | Google Colab + Sklearn | Train anomaly detectors & export `.pkl` |
| Storage       | AWS S3                 | Store trained models |
| Agent         | AWS EC2 + Flask        | Host API to serve predictions |
| Monitoring    | AWS CloudWatch         | Track metrics & create alarms |
| Notifications | AWS SNS (Email)        | Send real-time anomaly alerts |
| Testing       | Postman / cURL         | API testing for 5 endpoints |

---

## ⚙️ Features

✅ **CPU Monitoring** – Detects spikes in CPU usage  
✅ **Network Anomalies** – Flags abnormal request traffic  
✅ **Login Security** – Identifies brute-force or off-hour logins  
✅ **Content Safety** – Blocks spam & malicious text inputs  
✅ **Storage Growth** – Alerts sudden storage jumps  
✅ **Cloud-Native Alerts** – Real-time emails via SNS  
✅ **Dashboard** – CloudWatch visualization for live monitoring  

---

## 🧑‍💻 Installation & Deployment

<details>
<summary>1. Train & Export Models</summary>

- Use Google Colab to run `helios_models.ipynb`  
- Generates 5 `.pkl` model files  
- Upload them to `S3://helios-nitanshu/models/`
</details>

<details>
<summary>2. Deploy Flask Agent</summary>

```bash
# On EC2 Instance
sudo yum update -y
sudo yum install python3-pip -y
pip3 install flask boto3 scikit-learn joblib

mkdir helios && cd helios && mkdir models
aws s3 cp s3://helios-nitanshu/models/ ./models --recursive
python3 app.py
```
</details>

<details>
<summary>3. Test Endpoints via Postman</summary>

- **CPU** → `POST /predict/cpu` → `{ "value": 95 }`  
- **Network** → `POST /predict/network` → `{ "value": 600 }`  
- **Login** → `POST /predict/login` → `{ "value": [6,2] }`  
- **Content** → `POST /predict/content` → `{ "text": "click http://spam.com" }`  
- **Storage** → `POST /predict/storage` → `{ "value": 950 }`
</details>

<details>
<summary>4. Monitoring & Alerts</summary>

- Setup **CloudWatch Dashboard** for CPU, Network, Disk.  
- Create **CloudWatch Alarms** linked to SNS Topic.  
- Confirm subscription → Email notifications.  
</details>

---

## 📊 Demo

🎥 **Demo Video:** [demo here](https://drive.google.com/drive/folders/1js-HCOqW4TSnRxqlkPPsdx5L-GeB3epN)

🖼️ **Screenshots:** In the Documentaion. 

---

## 📖 Documentation & Research

This project is aligned with the **research paper on AI-driven anomaly detection in cloud systems**.  
- Explains ML model selection & evaluation.  
- Highlights **cloud-native scalability**.  
- Focuses on **zero-cost (AWS Free Tier)** deployment.  

---

## 🤝 Contributing

Want to make Helios even better?  
- Fork the repo 🍴  
- Add new anomaly detectors (DB, API, Memory)  
- Submit PR 🚀  
- Or connect with me on my nitanshutak070105@gmail.com
---

## 📜 License

Helios is licensed under the **MIT License** – free to use & modify.

---

Made entirely by - [Nitanshu Tak](https://www.linkedin.com/in/nitanshu-tak-89a1ba289/) ⚡️

