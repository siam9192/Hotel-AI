

export class ChatController {
  async handleChat(req: any, res: any) {
    // try {
    //   const { message, userId } = req.body;
    //   const response = await chatWorkflow(message);
    //   res.json({ response, userId });
    // } catch (error: any) {
    //   res.status(500).json({ error: error.message });
    // }
  }
}

export const chatController = new ChatController();