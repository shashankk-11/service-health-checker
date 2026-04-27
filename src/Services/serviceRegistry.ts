import { connectToDatabase, getDb } from "../db/database"
import type { Service } from "../types/Service"
import { ObjectId } from "mongodb"

// 🔹 Add Service
export async function addService(name: string, url: string): Promise<Service> {
  await connectToDatabase()
  const db = getDb()

  // 🔥 CHECK FOR DUPLICATE
  const existing = await db.collection("services").findOne({ name })

  if (existing) {
    throw new Error("Service with this name already exists")
  }

  const now = new Date()

  const result = await db.collection("services").insertOne({
    name,
    url,
    status: "UNKNOWN",
    version: "v1.0.0",
    last_deployed: now,
    manual_override: false,
    override_until: null
  })

  return {
    id: result.insertedId.toString(),
    name,
    url,
    status: "UNKNOWN",
    version: "v1.0.0",
    last_deployed: now,
    manual_override: false,
    override_until: null
  }
}

// 🔹 Get All Services
export async function getServices(): Promise<Service[]> {
  await connectToDatabase()
  const db = getDb()

  const services = await db.collection("services").find().toArray()

  return services.map((s: any) => ({
    id: s._id.toString(),
    name: s.name,
    url: s.url,
    status: s.status,
    version: s.version,
    last_deployed: s.last_deployed,
    manual_override: s.manual_override,
    override_until: s.override_until
  }))
}

// 🔹 Update Service Status
export async function updateServiceStatus(
  id: string,
  status: string
): Promise<void> {
  await connectToDatabase()
  const db = getDb()

  await db.collection("services").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  )
}

// 🔥 Update Service by Name (deploy + failure simulation)
export async function updateServiceByName(
  name: string,
  updates: Partial<Service>
): Promise<Service | null> {
  await connectToDatabase()
  const db = getDb()

  const result = await db.collection("services").findOneAndUpdate(
    { name },
    { $set: updates },
    { returnDocument: "after" }
  )

  if (!result || !result.value) return null

  const s = result.value as any

  return {
    id: s._id.toString(),
    name: s.name,
    url: s.url,
    status: s.status,
    version: s.version,
    last_deployed: s.last_deployed,
    manual_override: s.manual_override,
    override_until: s.override_until
  }
}