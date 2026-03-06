# Service Health Checker

A simple service registry and health monitoring tool built with **TypeScript, Express, PostgreSQL, Docker, and Bun**.

It allows services to register themselves and automatically checks if they are healthy.

---

## What This Project Does

- Register services with a name and URL
- Store services in **PostgreSQL**
- Periodically check each service's health
- Update service status as **UP** or **DOWN**
- Persist service data using **Docker + PostgreSQL**

---

## How It Works

1. A service registers itself using the API.
2. The service is stored in the PostgreSQL database.
3. A health checker runs every few seconds.
4. It calls the service's `/health` endpoint.
5. The service status is updated in the database.

Example service record:

| id | name | url | status |
|----|------|-----|--------|
| 1  | user-service | http://localhost:4000 | UP |

Database

Services are stored in PostgreSQL with the following fields:

id
name
url
status

---

## Architecture
Client / Service
    │
Service Registry API
(Express + Bun)
    │
PostgreSQL (Docker)
    │
Health Checker
    │
Updates Service Status

## Running the Project

### 1. Start PostgreSQL with Docker

docker compose -f docker/docker-compose.yml up -d

### 2. Start the Server

bun src/server.ts

Server runs at:
http://localhost:3000

### 3. Register a Service

Example: 
Invoke-RestMethod -Uri http://localhost:3000/services `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"user-service","url":"http://localhost:4000"}'

View Registered Services

Example:
GET http://localhost:3000/services

Example response:
[
  {
    "id": 1,
    "name": "user-service",
    "url": "http://localhost:4000",
    "status": "UP"
  }
]
