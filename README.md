
# Service Health Checker

A simple service registry and health monitoring tool built with **TypeScript, Express, MongoDB Atlas, and Bun**.

It allows services to register themselves and automatically checks if they are healthy.

---


## What This Project Does

- Register services with a name and URL
- Store services in **MongoDB Atlas**
- Periodically check each service's health
- Update service status as **UP** or **DOWN**

---


## How It Works

1. A service registers itself using the API.
2. The service is stored in the MongoDB Atlas database.
3. A health checker runs every few seconds.
4. It calls the service's `/health` endpoint.
5. The service status is updated in the database.

Example service record:

| id (ObjectId) | name | url | status |
|----|------|-----|--------|
| 64f... | user-service | http://localhost:4000 | UP |

Database

Services are stored in MongoDB Atlas with the following fields:

- id (ObjectId as string)
- name
- url
- status

---


## Architecture
Client / Service
  │
Service Registry API
(Express + Bun)
  │
MongoDB Atlas (Cloud)
  │
Health Checker
  │
Updates Service Status

docker compose -f docker/docker-compose.yml up -d
bun src/server.ts

## Running the Project

1. Set up your `.env` file with your MongoDB Atlas connection string:

```
MONGODB_URI=your-mongodb-atlas-connection-string
DB_NAME=service_registry
```

2. Start the Server

```
bun src/server.ts
```

Server runs at:
http://localhost:3000

3. Register a Service

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
    "id": "64f...",
    "name": "user-service",
    "url": "http://localhost:4000",
    "status": "UP"
  }
]
