# Service Health Checker (SRE-Ready)

## Overview

A production-inspired service registry and health monitoring system
built with:

* TypeScript
* Express
* MongoDB Atlas
* Bun
* Prometheus

---

## Architecture

```
        +----------------------+
        |   Client / Service   |
        +----------+-----------+
                   |
                   v
        +----------------------+
        | Service Registry API |
        |     (Express)        |
        +----------+-----------+
                   |
                   v
        +----------------------+
        |   MongoDB Atlas      |
        +----------+-----------+
                   |
                   v
        +----------------------+
        |  Health Checker Job  |
        +----------+-----------+
                   |
        +----------+-----------+
        |                      |
        v                      v
+---------------+     +------------------+
| Update Status |     | Prometheus Logs  |
+---------------+     +------------------+
```

---

## 🌐 Live Demo

The application is deployed on AWS EC2 and accessible via:

```
http://65.0.129.205
```

### Available Endpoints

* Health Check → `http://65.0.129.205/health`
* Services → `http://65.0.129.205/services`
* Metrics → `http://65.0.129.205/metrics`

> Note: The application is exposed via Nginx (port 80) acting as a reverse proxy to the containerized service running on port 3000.

---

## 🧪 How to Use

Follow these steps to try the system live:

---

### 1️⃣ Check Application Health

```bash
curl http://65.0.129.205/health
```

---

### 2️⃣ Register a Service

```bash
curl -X POST http://65.0.129.205/services \
-H "Content-Type: application/json" \
-d '{"name":"google","url":"https://google.com"}'
```

---

### 3️⃣ View Registered Services

```bash
curl http://65.0.129.205/services
```

---

### 4️⃣ Start Health Monitoring

```bash
curl -X POST http://65.0.129.205/start-health-checker
```

---

### 5️⃣ Check Metrics

```bash
curl http://65.0.129.205/metrics
```

---

### 6️⃣ Simulate Deployment

```bash
curl -X POST http://65.0.129.205/deploy \
-H "Content-Type: application/json" \
-d '{"name":"google"}'
```

---

### 7️⃣ Stop Health Monitoring

```bash
curl -X POST http://65.0.129.205/stop-health-checker
```
---

## 💡 Expected Flow

```text
Register Service → Start Health Checker → Monitor Status → View Metrics
```


## Features

* Service registration & discovery
* Automated health checks with response time tracking
* Deployment simulation (version updates)
* Prometheus-compatible metrics endpoint
* Containerized using Docker
* Reverse proxy using Nginx
* CI/CD pipeline with GitHub Actions
* Cloud deployment on AWS EC2

---

## API Endpoints

| Method | Endpoint                | Description                                 |
| ------ | ----------------------- | ------------------------------------------- |
| GET    | `/`                     | Service info                                |
| GET    | `/health`               | Application health                          |
| POST   | `/services`             | Register a new service                      |
| GET    | `/services`             | List all services                           |
| POST   | `/deploy`               | Simulate deployment (requires request body) |
| POST   | `/start-health-checker` | Start background health checks              |
| POST   | `/stop-health-checker`  | Stop health checks                          |
| GET    | `/metrics`              | Prometheus metrics                          |

---

## Example Service Object

```
{
  "name": "test-service",
  "status": "UP",
  "version": "v2.0.0"
}
```

---

## Example Requests

### Register Service

```
curl -X POST http://localhost/services \
-H "Content-Type: application/json" \
-d '{"name":"test","url":"https://google.com"}'
```

### Deploy Service

```
curl -X POST http://localhost/deploy \
-H "Content-Type: application/json" \
-d '{"name":"google"}'
```

### Start Health Checker

```
curl -X POST http://localhost/start-health-checker
```

### Stop Health Checker

```
curl -X POST http://localhost/stop-health-checker
```

---

## Local Setup

1. Install dependencies
2. Create `.env` file
3. Run:

```
bun install
bun run dev
```

---

## Docker Usage

```
docker build -t service-health-checker .
docker run -p 3000:3000 service-health-checker
```

---

## Deployment (AWS EC2)

* Provision EC2 instance
* Install Docker & Nginx
* Run containerized application
* Configure Nginx as reverse proxy
* Expose service via port 80

---

## CI/CD Pipeline

### Continuous Integration (CI)

* Runs on pull requests & push to main
* Linting (Biome)
* Unit testing (Bun)
* Docker build validation

### Continuous Deployment (CD)

* Manual trigger using `workflow_dispatch`
* SSH into EC2
* Pull latest code
* Rebuild Docker image
* Restart container

---

## Environment Variables

```
MONGODB_URI=your_mongodb_uri
DB_NAME=service_registry
```

---

## Metrics

Metrics exposed at:

```
/metrics
```

Includes:

* Health check counters
* Failure counters
* CPU & memory metrics
* Event loop metrics

Compatible with Prometheus and Grafana.

---

## SRE Concepts Applied

* Observability (metrics exposure)
* Health monitoring & reliability tracking
* Failure detection via health checks
* Background job processing
* Infrastructure automation (CI/CD)
* Containerization (Docker)
* Reverse proxy architecture (Nginx)

---

## Known Improvements

* Add input validation for `/deploy` endpoint
* Add HTTPS with Nginx + Let's Encrypt
* Integrate Grafana dashboards
* Implement zero-downtime deployments
* Push Docker images to ECR / Docker Hub

---

## Author

Shashank Kulkarni