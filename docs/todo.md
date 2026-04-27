# 🚀 DevOps SRE Project – TODO (Iteration 1)

## 🎯 Goal
Build a **production-like Service Health Checker** with monitoring, control, and failure simulation.

---

# ✅ COMPLETED

- [x] Basic Express server
- [x] MongoDB Atlas integration
- [x] Service registry API (`/services`)
- [x] Health checker (interval-based)
- [x] Concurrent health checks (Promise.all)
- [x] Structured logging (JSON logs)
- [x] Prometheus metrics (counters)
- [x] `/metrics` endpoint
- [x] Start/Stop health checker APIs
- [x] Duplicate service prevention (application-level)

---

# 🚧 IN PROGRESS / NEXT (HIGH PRIORITY)

## 🔥 1. Failure Simulation (SRE Core Feature)

- [ ] Add fields to Service model:
  - [ ] `manual_override`
  - [ ] `override_until`

- [ ] Update DB insert logic

- [ ] Update `getServices()` to return new fields

- [ ] Modify health checker:
  - [ ] Skip health checks if override is active

- [ ] Implement API:
  - [ ] `POST /simulate-failure`

- [ ] Test:
  - [ ] Service goes DOWN
  - [ ] Health checker skips updates
  - [ ] Service recovers after duration

---

## 🔥 2. Database Consistency (Critical)

- [ ] Clean existing duplicate data
- [ ] Add MongoDB unique index:
  - `db.services.createIndex({ name: 1 }, { unique: true })`
- [ ] Verify no duplicate services allowed

---

## 🔥 3. Metrics Validation

- [ ] Verify `/metrics` endpoint works
- [ ] Confirm:
  - [ ] `health_checks_total`
  - [ ] `health_check_failures_total`

---

## 🔥 4. Logging Consistency

- [ ] Ensure all logs are JSON:
  - [ ] health logs
  - [ ] error logs
  - [ ] deploy logs
  - [ ] failure simulation logs

---

## 🔥 5. API Hardening

- [ ] Proper status codes:
  - [ ] 400 → bad request
  - [ ] 404 → not found
  - [ ] 500 → server error

---

# ⚡ NICE TO HAVE (OPTIONAL)

- [ ] Add `/start-health-checker` status check
- [ ] Add `/health-checker-status` endpoint
- [ ] Add service deletion API
- [ ] Add pagination for services

---

# 🚀 NEXT ITERATION (DO NOT START YET)

## 🐳 Dockerization
- Containerize app
- Add Dockerfile
- Run via docker-compose

## ⚙️ CI/CD
- GitHub Actions pipeline
- Build + run tests

## ☸️ Kubernetes
- Deploy on cluster
- Use Helm charts

## 📊 Observability
- Prometheus setup
- Grafana dashboards

---

# 🧠 NOTES

- Focus on **functionality first**
- Then move to **production practices**
- Avoid over-engineering early