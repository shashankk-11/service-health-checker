// src/api/routes.ts

import { Router } from "express"
import client from "prom-client"

import {
  addService,
  getServices,
  updateServiceByName
} from "../Services/serviceRegistry"

import { startHealthChecker, stopHealthChecker } from "../scheduler/healthScheduler"
import { runHealthCheckOnce } from "../checker/healthChecker"

const router = Router()

// 🔹 Root
router.get("/", (req, res) => {
  res.json({
    service: "service-health-checker",
    status: "running"
  })
})

// 🔹 Liveness probe
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime()
  })
})

// 🔹 Readiness probe (🔥 SRE important)
router.get("/ready", (req, res) => {
  res.json({
    ready: true,
    timestamp: new Date().toISOString()
  })
})

// 🔹 Add Service
router.post("/services", async (req, res) => {
  const { name, url } = req.body

  if (!name || !url) {
    return res.status(400).json({
      error: "name and url are required"
    })
  }

  try {
    const service = await addService(name, url)
    res.status(201).json(service)
  } catch (error) {
    res.status(400).json({
      error: (error as Error).message
    })
  }
})

// 🔹 Get Services
router.get("/services", async (req, res) => {
  try {
    const services = await getServices()
    res.json(services)
  } catch {
    res.status(500).json({
      error: "failed to fetch services"
    })
  }
})

// 🔹 Manual health check (🔥 core feature)
router.get("/health-report", async (req, res) => {
  try {
    const result = await runHealthCheckOnce()
    res.json(result)
  } catch {
    res.status(500).json({
      error: "health check failed"
    })
  }
})

// 🔹 Deploy simulation
router.post("/deploy", async (req, res) => {
  const { name, version } = req.body

  if (!name || !version) {
    return res.status(400).json({
      error: "name and version are required"
    })
  }

  try {
    const updated = await updateServiceByName(name, {
      version,
      last_deployed: new Date(),
      status: "UP"
    })

    if (!updated) {
      return res.status(404).json({
        error: "service not found"
      })
    }

    res.json({
      message: "Deployment successful",
      service: updated
    })
  } catch {
    res.status(500).json({
      error: "internal server error"
    })
  }
})

// 🔹 Start checker
router.post("/start-health-checker", (req, res) => {
  startHealthChecker()
  res.json({ message: "Health checker started" })
})

// 🔹 Stop checker
router.post("/stop-health-checker", (req, res) => {
  stopHealthChecker()
  res.json({ message: "Health checker stopped" })
})

// 🔹 Metrics (Prometheus)
router.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType)
    res.end(await client.register.metrics())
  } catch {
    res.status(500).end()
  }
})

export default router