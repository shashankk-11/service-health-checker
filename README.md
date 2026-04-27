# Service Health Checker (SRE-Ready)

## Overview

A production-inspired service registry and health monitoring system
built with: - TypeScript - Express - MongoDB Atlas - Bun - Prometheus

------------------------------------------------------------------------

## Architecture

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

------------------------------------------------------------------------

## Features

-   Service registration
-   Health monitoring
-   Deployment simulation
-   Failure simulation
-   Metrics collection

------------------------------------------------------------------------

## API Endpoints

### Register Service

POST /services

### Get Services

GET /services

### Deploy Service

POST /deploy

### Simulate Failure

POST /simulate-failure

### Metrics

GET /metrics

------------------------------------------------------------------------

## Example Service Object

    {
      "name": "test-service",
      "status": "UP",
      "version": "v2.0.0"
    }

------------------------------------------------------------------------

## SRE Concepts

-   Observability
-   Failure Injection
-   Monitoring
-   Reliability Engineering

------------------------------------------------------------------------

## Run Instructions

1.  Install dependencies
2.  Setup .env
3.  Run: bun run dev

------------------------------------------------------------------------

## Author

Shashank Kulkarni
