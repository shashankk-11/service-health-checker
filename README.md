# Service Health Checker

A production-grade service registry and health monitoring platform built with TypeScript and Bun. Tracks availability and response times of registered services, exposes Prometheus-compatible metrics, and visualises them via Grafana — deployed on AWS EC2 behind Nginx.

> This project is the application layer for [eks-gitops-platform](https://github.com/shashankk-11/eks-gitops-platform) — a companion repo that deploys this service onto Kubernetes via Terraform and ArgoCD.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Bun + TypeScript |
| Framework | Express |
| Database | MongoDB Atlas |
| Metrics | Prometheus client |
| Visualisation | Grafana |
| Container | Docker (multi-stage, non-root) |
| Reverse proxy | Nginx |
| CI/CD | GitHub Actions → GHCR |
| Cloud | AWS EC2 |

---

## Architecture

```
Client
  │
  ▼ HTTP :80
Nginx (reverse proxy)
  │
  ▼ :3000
Express API (Docker)
  ├── MongoDB Atlas      ← service registry storage
  ├── Health Checker Job ← background polling loop
  └── /metrics           ← Prometheus scrape target
                              │
                         Prometheus :9090
                              │
                           Grafana :3001
```

---

## Live Demo

| Endpoint | URL |
|---|---|
| App | http://65.0.129.205 |
| Health | http://65.0.129.205/health |
| Services | http://65.0.129.205/services |
| Metrics | http://65.0.129.205/metrics |
| Prometheus | http://65.0.129.205:9090 |
| Grafana | http://65.0.129.205:3001 |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Service info |
| GET | `/health` | Liveness check |
| GET | `/ready` | Readiness check |
| POST | `/services` | Register a service |
| GET | `/services` | List all services |
| POST | `/start-health-checker` | Start background polling |
| POST | `/stop-health-checker` | Stop background polling |
| GET | `/health-report` | Latest health check results |
| POST | `/deploy` | Simulate a deployment |
| GET | `/metrics` | Prometheus metrics |

---

## Quickstart (local)

**Prerequisites:** Bun, Docker, MongoDB Atlas URI

```bash
git clone https://github.com/shashankk-11/service-health-checker.git
cd service-health-checker
cp .env.example .env          # add your MONGODB_URI
bun install
bun run dev
```

### Run with Docker

```bash
docker pull ghcr.io/shashankk-11/service-health-checker:latest
docker run -p 3000:3000 \
  -e MONGODB_URI=your_uri \
  -e DB_NAME=service_registry \
  ghcr.io/shashankk-11/service-health-checker:latest
```

### Environment variables

```bash
MONGODB_URI=mongodb+srv://...   # required in production
DB_NAME=service_registry        # optional, defaults to service_registry
```

> In test environments (`NODE_ENV=test`) the DB connection is skipped automatically — no dummy credentials needed.

---

## Usage

### Register a service

```bash
curl -X POST http://localhost:3000/services \
  -H "Content-Type: application/json" \
  -d '{"name": "my-api", "url": "https://example.com"}'
```

### Start health monitoring

```bash
curl -X POST http://localhost:3000/start-health-checker
```

### Check results

```bash
curl http://localhost:3000/health-report
```

### View Prometheus metrics

```bash
curl http://localhost:3000/metrics
```

---

## Observability

Prometheus scrapes `/metrics` every 15 seconds. Grafana is connected as a data source and provides dashboards for:

- Health check pass/fail counters per service
- Response time tracking
- Application memory and CPU usage
- Event loop lag

Metrics are exposed using the official `prom-client` library and are fully compatible with any Prometheus-based stack.

---

## CI/CD Pipeline

### CI (on every PR and push to main)

```
Checkout → Install deps → Lint (Biome) → Test (Bun) → Docker build
```

- Tests run with `NODE_ENV=test` — DB layer is skipped, all dependencies mocked
- Docker image is built on every run to catch `Dockerfile` regressions early

### CD (on merge to main)

```
Build multi-stage Docker image → Push to GHCR with :latest and :sha tags
```

Image published at: `ghcr.io/shashankk-11/service-health-checker`

The SHA tag (e.g. `:sha-a1b2c3d`) is what gets referenced in the GitOps platform repo for immutable, traceable deployments.

---

## Docker image

The Dockerfile uses a two-stage build:

- `deps` stage: installs only production dependencies with `--frozen-lockfile`
- `runner` stage: copies only `node_modules` and `src/` — no source maps, no dev tools, no test files

Final image runs as the non-root `bun` user.

---

## SRE concepts demonstrated

- **Liveness vs readiness** — separate `/health` and `/ready` endpoints
- **Observability** — Prometheus metrics + Grafana dashboards
- **Failure detection** — background health checker with status tracking
- **Immutable deployments** — Docker image tagged by git SHA
- **Test isolation** — DB layer fully mocked, no real credentials in CI
- **Containerisation** — multi-stage build, non-root user, minimal image

---

## What's next

This project is intentionally the *application layer only*. The infrastructure layer lives in [eks-gitops-platform](https://github.com/shashankk-11/eks-gitops-platform), which:

- Provisions EKS + VPC with Terraform
- Packages this app as a Helm chart
- Delivers it via ArgoCD GitOps
- Runs `kube-prometheus-stack` for cluster-wide observability

---

## Author

[Shashank Kulkarni](https://linkedin.com/in/shashankulkarni) · [GitHub](https://github.com/shashankk-11)