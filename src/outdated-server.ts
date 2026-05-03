import express from "express"
import client from "prom-client"

import {
  addService,
  getServices,
  updateServiceByName
} from "./Services/serviceRegistry"

import {
  startHealthChecker,
  stopHealthChecker
} from "./Services/healthChecker"

const app = express()

app.use(express.json())

// 🔥 Root
app.get("/", (req, res) => {
  res.json({
    service: "service-health-checker",
    status: "running"
  })
})

// 🔥 Health
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime()
  })
})

// 🔥 Register Service
app.post("/services", async (req, res) => {
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

// 🔥 Get Services
app.get("/services", async (req, res) => {
  try {
    const services = await getServices()
    res.json(services)
  } catch {
    res.status(500).json({
      error: "failed to fetch services"
    })
  }
})

// 🚀 Deploy
app.post("/deploy", async (req, res) => {
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

// 🚀 Start Health Checker
app.post("/start-health-checker", (req, res) => {
  startHealthChecker()
  res.json({ message: "Health checker started" })
})

// 🛑 Stop Health Checker
app.post("/stop-health-checker", (req, res) => {
  stopHealthChecker()
  res.json({ message: "Health checker stopped" })
})

// 🚀 Metrics
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType)
    res.end(await client.register.metrics())
  } catch {
    res.status(500).end()
  }
})

// 🚀 START SERVER
const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})