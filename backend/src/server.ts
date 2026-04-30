
import app from "./app";
import { config } from "./config";
import { chatServices } from "./services/chat.service";

import { logger } from "./utils/logger";

app.listen(config.port, async() => {
  logger.info(`Server running on port ${config.port}`);


  console.log(await chatServices.processMessage("Give contact info",undefined))


});
