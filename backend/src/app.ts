// filepath: ai-agent/src/index.ts
import express from "express";
import { config } from "./config";
import chatRoutes from "./routes/chat.routes";
import { logger } from "./utils/logger";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (basic)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use("/api", chatRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "AI Hotel Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      chat: "/api/chat",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    logger.error(`Server error: ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
  },
);

export default app;
