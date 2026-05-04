import { type Db, MongoClient } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

const isTestEnv = process.env.NODE_ENV === "test";

export async function connectToDatabase(): Promise<Db | null> {
  // 🔥 Skip DB connection in test environment
  if (isTestEnv) {
    return null;
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "service_registry";

  // 🔥 Fail fast in non-test environments
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      console.log("Connected to MongoDB Atlas");
    }

    if (!db) {
      db = client.db(dbName);
    }

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