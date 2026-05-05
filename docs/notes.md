# 🧠 DevOps Notes — Service Health Checker

---

## 🚀 Project Summary

Built a **service health monitoring system** with:

* Service registration
* Automated health checks
* Metrics exposure (`/metrics`)
* Dockerized deployment
* AWS EC2 hosting
* Nginx reverse proxy
* CI/CD using GitHub Actions

---

## 🐳 Docker Concepts

### 🔹 Why Docker?

* Consistent environment
* Portable deployments
* Eliminates "works on my machine" issues

---

### 🔹 Dockerfile Breakdown

```dockerfile
FROM oven/bun:1
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "src/index.ts"]
```

---

### 🔹 Build Image

```bash
docker build -t service-health-checker .
```

---

### 🔹 Run Container

```bash
docker run -d \
--name service-health-checker \
-p 3000:3000 \
-e MONGODB_URI=... \
-e DB_NAME=... \
service-health-checker
```

---

### 🔹 Debug Commands

```bash
docker ps
docker logs service-health-checker
docker exec -it service-health-checker sh
```

---

## 🔒 Docker Permission Issue

### ❌ Error

```text
permission denied while trying to connect to /var/run/docker.sock
```

---

### 🧠 Root Cause

* Docker runs as a **daemon**
* Communication happens via:

```text
/var/run/docker.sock
```

* This socket is owned by:

```text
root + docker group
```

---

### ❌ Problem

User (`ubuntu`) was **not part of docker group**

---

### ✅ Fix

```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

---

### 🧠 Explanation

* `usermod -aG docker ubuntu` → adds user to docker group
* `newgrp docker` → refreshes group permissions

---

### 💡 Key Insight

```text
Docker group access = root-level privileges
```

---

## ☁️ AWS EC2 Setup

### 🔹 Instance Setup

* Ubuntu 24.04
* t2.micro

---

### 🔹 Security Group

| Port | Purpose       |
| ---- | ------------- |
| 22   | SSH           |
| 3000 | App (initial) |
| 80   | Nginx         |

---

### 🔹 SSH Access

```bash
ssh -i key.pem ubuntu@<IP>
```

---

### 🔹 Install Dependencies

```bash
sudo apt update -y
sudo apt install docker.io git nginx -y
```

---

### 🔹 Deployment Steps

```bash
git clone <repo>
cd service-health-checker

docker build -t service-health-checker .

docker run -d -p 3000:3000 ...
```

---

## 🌐 Nginx (Reverse Proxy)

### 🔹 Why Nginx?

* Remove `:3000` from URL
* Production-style routing
* Acts as reverse proxy

---

### 🔹 Flow

```text
Browser → Nginx (80) → App (3000)
```

---

### 🔹 Config

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

---

### 🔹 Restart

```bash
sudo systemctl restart nginx
```

---

## 🔄 CI/CD (GitHub Actions)

### 🔹 CI Pipeline

Runs on:

* Pull Request
* Push

Steps:

* Install dependencies
* Lint (Biome)
* Run tests
* Docker build

---

### 🔹 CD Pipeline

Trigger:

```text
workflow_dispatch
```

---

### 🔹 Deployment Flow

```text
GitHub → SSH → EC2 → Docker rebuild → restart container
```

---

### 🔹 Steps in Workflow

* SSH into EC2
* git pull
* docker stop
* docker rm
* docker build
* docker run

---

## 🔐 Secrets Management

### 🔹 Used GitHub Secrets

| Secret      | Purpose   |
| ----------- | --------- |
| EC2_KEY     | SSH key   |
| EC2_HOST    | server IP |
| MONGODB_URI | database  |

---

### 🔹 Why Secrets?

* Encrypted storage
* Not exposed in code
* Secure access

---

## 📊 Monitoring

### 🔹 Metrics Endpoint

```text
/metrics
```

---

### 🔹 Includes

* Health checks count
* Failure count
* CPU usage
* Memory usage
* Event loop lag

---

### 🔹 Next Step

```text
Prometheus → collect metrics
Grafana → visualize
```

---

## ⚠️ Issues Faced & Fixes

---

### 🔴 Docker Permission Issue

```text
permission denied docker.sock
```

✅ Fix:

```bash
usermod -aG docker ubuntu
```

---

### 🔴 MongoDB Connection Error

```text
ENOTFOUND
```

👉 Cause:

* DNS / network issue

---

### 🔴 Port Not Accessible

👉 Cause:

* Security group not configured

---

### 🔴 Nginx Not Working

👉 Cause:

* Port 80 not open

---

### 🔴 Deploy API Error

```text
Cannot destructure property 'name'
```

👉 Cause:

* Missing request body

---

### ✅ Fix Idea

```ts
if (!req.body?.name) {
  return res.status(400).json({ error: "name is required" })
}
```

---

## 💡 Key Learnings

* Docker runs via Unix socket
* Linux permissions control Docker access
* EC2 security groups act as firewall
* Nginx is used for reverse proxy
* CI/CD automates deployment
* Secrets must not be hardcoded

---

## 🎯 Interview Summary

```text
I built a containerized service health monitoring system using Docker,
deployed it on AWS EC2, configured Nginx as a reverse proxy,
and automated deployment using GitHub Actions.

The system exposes Prometheus metrics and supports service
registration, health checking, and deployment simulation.
```

---

## 🚀 Next Steps

* Add Prometheus
* Add Grafana dashboards
* Add HTTPS (Nginx + SSL)
* Zero-downtime deployment
* Use Docker registry (ECR)