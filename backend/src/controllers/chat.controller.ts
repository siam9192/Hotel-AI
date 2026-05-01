import { Request, Response } from "express";
import { chatServices } from "../services/chat.service";
import { catchAsync } from "../utils/error.utils";
import { ChatHistory } from "../interfaces/chat.interface";

export class ChatController {
  handleChat = catchAsync(async (req: Request, res: Response) => {
    

    const user = req.user
      ? {
          userId: req.user.id,
          userRole: req.user.role,
        }
      : undefined;

    const response = await chatServices.processMessage(
      req.body,
      user
    );

    res.json({ response });
  });
}

export const chatController = new ChatController();
