// filepath: ai-agent/src/index.ts
import express from 'express';
import { config } from './config';
import chatRoutes from './routes/chat.routes';
import { logger } from './utils/logger';

const app = express();

app.use(express.json());
// app.use('/api', chatRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;