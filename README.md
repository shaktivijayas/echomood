<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=echomood&fontSize=56&fontColor=fff&animation=twinkling&fontAlignY=38&desc=Cloud%20Sync%20%2B%20AI%20Mood%20Companion%20%7C%20Microservices%20on%20K8s&descSize=16&descColor=fff&descAlignY=60" />

<br/>

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Gemini](https://img.shields.io/badge/Gemini%20AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io)

![License](https://img.shields.io/badge/License-MIT-00d4ff?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![PRs](https://img.shields.io/badge/PRs-Welcome-7c3aed?style=flat-square)

</div>

---

## 🌥️ What is echomood?

**echomood** is a full-stack cloud synchronization platform with an integrated AI mood companion. Sync files seamlessly across all your devices — then talk to an empathetic Gemini-powered AI when you need a moment to breathe. Built as a production-grade microservices system, containerized with Docker, and orchestrated with Kubernetes.

> Cloud sync for your files. AI support for your mind. One platform for both.

---

## ✨ Features

- 📁 **Cross-Device File Sync** — Upload, download, and sync files across unlimited registered devices
- 🧠 **Gemini AI Mood Companion** — Express how you're feeling and receive empathetic, context-aware responses
- 💬 **Persistent Chat History** — Continue conversations with full context across sessions
- 📊 **Storage Analytics** — Real-time dashboards for storage usage, file breakdown, and device activity
- 🔐 **JWT Authentication** — Secure login with bcrypt password hashing and 7-day token expiry
- ☸️ **Kubernetes Native** — Full K8s manifests for production-grade horizontal scaling
- 🐳 **Docker Compose** — One command to spin up the entire stack locally
- 🔍 **Activity Monitoring** — Track every sync event, device connection, and file operation

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | React 18, Tailwind CSS, shadcn/ui |
| **Backend API** | Node.js, Express |
| **AI Service** | Python, Flask, Google Gemini API |
| **Database** | MySQL 8.0 |
| **File Storage** | Nextcloud |
| **Auth** | JWT, bcrypt |
| **Containers** | Docker, Docker Compose |
| **Orchestration** | Kubernetes |

---

## 🏗️ Architecture

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│    React UI      │    │  Node.js API     │    │  Flask AI        │
│  (Tailwind +     │◄──►│  (Express)       │◄──►│  (Gemini)        │
│   shadcn/ui)     │    │  Port: 5000      │    │  Port: 5001      │
│  Port: 3000      │    └────────┬─────────┘    └──────────────────┘
└──────┬───────────┘             │
       │                         ▼
       │               ┌──────────────────┐
       │               │  MySQL 8.0       │
       │               │  (Auth + Files   │
       │               │   + Devices)     │
       │               │  Port: 3306      │
       │               └──────────────────┘
       ▼
┌──────────────────┐
│   Nextcloud      │
│  (File Storage)  │
│  Port: 8080      │
└──────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- MySQL 8.0+ (or use Docker)

### Installation

```bash
git clone https://github.com/shaktivijayas/echomood.git
cd echomood
cp env.example .env
```

### Environment Variables

```env
# Google AI Studio → https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key

# Change in production
JWT_SECRET=your_super_secret_jwt_key

# Database
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=echomood
MYSQL_USER=echomood
MYSQL_PASSWORD=echomood_password

# Nextcloud
NEXTCLOUD_URL=http://localhost:8080
NEXTCLOUD_USER=admin
NEXTCLOUD_PASSWORD=admin
```

### Run with Docker Compose

```bash
# Start all 5 services
docker-compose up -d

# View logs
docker-compose logs -f

# Tear down
docker-compose down
```

### Run Locally (Development)

```bash
# Install all dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd flask-gemini && pip install -r requirements.txt && cd ..

# Start all services
npm run dev
```

**Service URLs:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Flask AI: `http://localhost:5001`
- Nextcloud: `http://localhost:8080`

---

## ☸️ Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check rollout
kubectl get pods -n echomood
kubectl get services -n echomood

# Port-forward for local access
kubectl port-forward -n echomood service/frontend-service 3000:3000
kubectl port-forward -n echomood service/backend-service 5000:5000
```

---

## 📁 Project Structure

```
echomood/
├── frontend/             # React + Tailwind + shadcn/ui
│   ├── src/
│   │   ├── components/   # UI components (FileCard, MoodChat, DeviceList)
│   │   ├── pages/        # Dashboard, Files, Devices, Mood
│   │   └── hooks/        # useAuth, useFiles, useDevices
│   └── Dockerfile
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── routes/       # auth, files, devices, dashboard
│   │   ├── middleware/   # JWT validation, file upload
│   │   └── models/       # MySQL query helpers
│   └── Dockerfile
├── flask-gemini/         # Python Flask + Gemini AI service
│   ├── app.py            # /gemini endpoint
│   ├── requirements.txt
│   └── Dockerfile
├── k8s/                  # Kubernetes manifests
│   ├── namespace.yaml
│   ├── frontend.yaml
│   ├── backend.yaml
│   ├── flask-gemini.yaml
│   ├── mysql.yaml
│   └── nextcloud.yaml
├── docker-compose.yml
├── env.example
└── package.json
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Get JWT token |
| `GET` | `/api/files` | List user files |
| `POST` | `/api/files/upload` | Upload and sync file |
| `GET` | `/api/files/download/:id` | Download file |
| `GET` | `/api/devices` | List registered devices |
| `POST` | `/api/devices/register` | Register new device |
| `GET` | `/api/dashboard/stats` | Storage + activity stats |
| `POST` | `/gemini` | Send mood to AI companion |

---

## 👨‍💻 Author

**Shakti Vijay A S** — [GitHub](https://github.com/shaktivijayas) · [LinkedIn](https://www.linkedin.com/in/shaktidev/)

<div align="center">
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer&animation=twinkling" />
</div>
