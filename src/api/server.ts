// src/api/server.ts

import express from "express";
import routes from "./routes";

const app = express();

// Middleware
app.use(express.json());

// Request logging (simple but effective)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/", routes);

const PORT = process.env.PORT || 3000;

export function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  // Graceful shutdown (very important for Docker/EC2)
  const shutdown = () => {
    console.log("Shutting down server...");

    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
