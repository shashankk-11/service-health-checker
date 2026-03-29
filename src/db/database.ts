import { MongoClient, Db } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const uri = process.env.MONGODB_URI || ""
const dbName = process.env.DB_NAME || "service_registry"

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(dbName)
    console.log("Connected to MongoDB Atlas")
  }
  return db
}

export function getDb(): Db {
  if (!db) {
    throw new Error("Database not connected. Call connectToDatabase() first.")
  }
  return db
}