import express from "express"
import { addService, getServices } from "./services/serviceRegistry"

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

app.post("/services", (req, res) => {
  const { name, url } = req.body

  const service = addService(name, url)

  res.json(service)
})

app.get("/services", (req, res) => {
  res.json(getServices())
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})