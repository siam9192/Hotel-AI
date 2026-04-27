// filepath: ai-agent/src/routes/chat.routes.ts
import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';

const router = Router();

router.post('/chat', (req, res) => chatController.handleChat(req, res));

export default router;