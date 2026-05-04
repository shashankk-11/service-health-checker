import "dotenv/config";
import { startServer } from "./api/server";

console.log("ENV CHECK:", {
  uri: process.env.MONGODB_URI,
  db: process.env.DB_NAME,
});

startServer();
