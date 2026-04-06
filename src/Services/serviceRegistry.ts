import { connectToDatabase, getDb } from "../db/database"
import type { Service } from "../types/Service"
import { ObjectId } from "mongodb"


export async function addService(name: string, url: string): Promise<Service> {
  await connectToDatabase()
  const db = getDb()
  const result = await db.collection("services").insertOne({ name, url })
  return {
    id: result.insertedId.toString(),
    name,
    url
  } as Service
}


export async function getServices(): Promise<Service[]> {
  await connectToDatabase()
  const db = getDb()
  const services = await db.collection("services").find().toArray()
  // Map _id to id for compatibility
  return services.map((s: any) => ({
    id: s._id.toString(),
    name: s.name,
    url: s.url,
    status: s.status
  }))
}


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