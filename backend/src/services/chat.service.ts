import { get } from "mongoose";
import { UserRole } from "../interfaces/user.interface";
import { llmWithTools } from "../llm";
import { getRoomDetailsTool, getRoomsTool } from "../tools/room.tool";
import { GET_PROMPT } from "../utils/constant";
import { forecastTool, weatherTool } from "../tools/weather.tool";
import {
  bookRoomTool,
  cancelBookingTool,
  getBookingDetailsTool,
} from "../tools/booking.tool";
import { getContactInfoTool, getPolicyTool } from "../tools/policy.tool";
import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";

const toolsByName: Record<string, any> = {
  getRooms: getRoomsTool,
  getRoomDetails: getRoomDetailsTool,
  bookRoom: bookRoomTool,
  cancelBooking: cancelBookingTool,
  getBookingDetails: getBookingDetailsTool,
  getPolicy: getPolicyTool,
  getContactInfo: getContactInfoTool,
  getWeather: weatherTool,
  forecastWeather: forecastTool,
};

class chatService {
  async processMessage(
    message: string,
    user?: { userId: string; userRole: UserRole },
    history: any[] = [],
  ) {
    try {
      const prompt = GET_PROMPT(message, user, history);

      let messages: (HumanMessage | ToolMessage | AIMessage)[] = [
        new HumanMessage(prompt),
      ];

      console.log(11)
      let response = await llmWithTools.invoke(messages);

      console.log(response)
      while (response.tool_calls && response.tool_calls.length > 0) {
        messages.push(response);
        for (const toolCall of response.tool_calls) {
          let result: string;

          try {
            const selectedTool = toolsByName[toolCall.name];

            if (!selectedTool) {
              result = `Error: Tool "${toolCall.name}" not found.`;
            } else {
              result = await selectedTool.call(toolCall.args);
            }

            console.log("Tool Result:", result);
          } catch (error) {
            result = `Error executing tool "${
              toolCall.name
            }": ${error instanceof Error ? error.message : String(error)}`;
          }

          messages.push(
            new ToolMessage({
              tool_call_id: toolCall.id,
              content: result,
            }),
          );
        }

        response = await llmWithTools.invoke(messages);
      }

      // ✅ final normal response (no tools)
      return response.content as string;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      return `I apologize, but I encountered an error processing your request. ${errorMessage}`;
    }
  }
}

export const chatServices = new chatService();
