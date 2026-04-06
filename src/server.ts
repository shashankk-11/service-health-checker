import express from "express"
import { addService, getServices } from "./Services/serviceRegistry"
import { startHealthChecker } from "./Services/healthChecker"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    service: "service-health-checker",
    status: "running"
  })
})

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime()
  })
})

app.post("/services", async (req, res) => {

  const { name, url } = req.body

  if (!name || !url) {
    return res.status(400).json({
      error: "name and url are required"
    })
  }

  try {

    const service = addService(name, url)

    res.status(201).json(service)

  } catch (error) {

    res.status(400).json({
      error: (error as Error).message
    })

  }

})

app.get("/services", (req, res) => {
  res.json(getServices())
})

const PORT = 3000

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`)

  // start health monitoring loop
  startHealthChecker()

})