// filepath: ai-agent/src/config/index.ts
import dotenv from "dotenv";

dotenv.config();

export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  googleApiKey: process.env.GOOGLE_API_KEY,
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
  jwtSecret: process.env.JWT_SECRET || "default-secret-change-in-production",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/hotel",
};
