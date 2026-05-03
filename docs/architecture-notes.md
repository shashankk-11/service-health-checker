# 🚀 Service Health Checker – High Level Design (HLD)

---

# 1. 🎯 Objective

Design a system that:
- Registers services
- Monitors health continuously
- Provides observability (logs + metrics)
- Supports controlled failure simulation (SRE use-case)

---

# 2. 🏗️ System Overview
    +----------------------+
    |   Client / Service   |
    +----------+-----------+
               |
               v
    +----------------------+
    |  API Layer (Express) |
    +----------+-----------+
               |
               v
    +----------------------+
    |    MongoDB (State)   |
    +----------+-----------+
               |
               v
    +----------------------+
    |  Health Checker Job  |
    +----------+-----------+
               |
    +-------------+-------------+
    |                           |
    v                           v
 +------------+     +----------------+
 | DB Updates |     | Logs + Metrics |
 +------------+     +----------------+

---

# 3. 🧩 Core Components

## 3.1 API Layer

Handles:
- Service registration (`/services`)
- Fetch services (`/services`)
- Deployment updates (`/deploy`)
- Control plane (`/start`, `/stop`)


---

## 3.2 Database (MongoDB)

Stores system state:

👉 Acts as **source of truth**
```
Service Document
├── name
├── url
├── status
├── version
├── last_deployed
├── manual_override
└── override_until
```

👉 Acts as **source of truth**

---

## 3.3 Health Checker (Background Worker)

Runs periodically (10s):







