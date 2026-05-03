import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { roomTools } from "../tools/room.tool";
import { weatherTools } from "../tools/weather.tool";
import { bookingTools } from "../tools/booking.tool";
import { policyTools } from "../tools/policy.tool";
import { Runnable } from "@langchain/core/runnables";
import { config } from "../config";
import { utilTools } from "../tools/utils.tool";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite-preview",
  apiKey: config.geminiApiKey,
});

 export const llmWithTools:Runnable = llm.bindTools([...roomTools, ...bookingTools, ...policyTools, ...weatherTools,...utilTools]);
