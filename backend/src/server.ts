import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";
import { chatServices } from "./services/chat.service";

import { logger } from "./utils/logger";

app.listen(config.port, async () => {
  logger.info(`Server running on port ${config.port}`);
  await mongoose.connect(config.db_url as string);

  console.log(
    await chatServices.processMessage(
      {
        newMessage: "What the weather today in the hotel area?",
      },
      undefined,
    ),
  );
});
