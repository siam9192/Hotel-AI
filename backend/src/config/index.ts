// filepath: ai-agent/src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
};