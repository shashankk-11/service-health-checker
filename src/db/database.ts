import dotenv from "dotenv";
import { type Db, MongoClient } from "mongodb";

dotenv.config();

const rawUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "service_registry";

if (!rawUri) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const uri: string = rawUri;

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      console.log("Connected to MongoDB Atlas");
    }

    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
}

export function getDb(): Db {
  if (!db) {
    throw new Error("Database not connected. Call connectToDatabase() first.");
  }
  return db;
}
