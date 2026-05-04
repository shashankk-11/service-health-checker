import { describe, it, expect, mock } from "bun:test"
import request from "supertest"
import express from "express"

// 🔥 Mock DB layer
mock.module("../src/Services/serviceRegistry", () => ({
  getServices: async () => [
    { id: "1", name: "test", url: "https://test.com" }
  ],
  addService: async (name: string, url: string) => ({
    id: "1",
    name,
    url,
    status: "UNKNOWN"
  }),
  updateServiceByName: async () => ({
    name: "test",
    status: "UP"
  })
}))

// 🔥 Mock checker
mock.module("../src/checker/healthChecker", () => ({
  runHealthCheckOnce: async () => [
    {
      service: "test",
      status: "UP",
      responseTime: 120
    }
  ]
}))

import routes from "../src/api/routes"

const app = express()
app.use(express.json())
app.use("/", routes)

describe("API Routes", () => {

  // 🔹 Health
  it("GET /health should return ok", async () => {
    const res = await request(app).get("/health")

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.uptime).toBeDefined()
  })

  // 🔹 Readiness
  it("GET /ready should return readiness", async () => {
    const res = await request(app).get("/ready")

    expect(res.status).toBe(200)
    expect(res.body.ready).toBe(true)
    expect(res.body.timestamp).toBeDefined()
  })

  // 🔹 Validation
  it("POST /services should fail with missing fields", async () => {
    const res = await request(app)
      .post("/services")
      .send({})

    expect(res.status).toBe(400)
  })

  // 🔹 Create service
  it("POST /services should create service", async () => {
    const res = await request(app)
      .post("/services")
      .send({
        name: "service1",
        url: "https://example.com"
      })

    expect(res.status).toBe(201)
    expect(res.body.name).toBe("service1")
  })

  // 🔹 Get services
  it("GET /services should return list", async () => {
    const res = await request(app).get("/services")

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  // 🔹 Health report
  it("GET /health-report should return monitoring data", async () => {
    const res = await request(app).get("/health-report")

    expect(res.status).toBe(200)
    expect(res.body[0].status).toBe("UP")
    expect(res.body[0].responseTime).toBeGreaterThan(0)
  })

})