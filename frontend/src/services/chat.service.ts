import { ChatMessagePayload, ChatResponse } from "@/types/service.type";

export async function sendChatMessage(
  payload: ChatMessagePayload,
): Promise<ChatResponse> {
  const requestBody = {
    message: payload.message,
    conversationId: payload.conversationId,
    history: payload.history ?? [],
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return {
      response:
        data.response || data.message || generateMockResponse(payload.message),
      conversationId:
        data.conversationId ||
        payload.conversationId ||
        generateConversationId(),
    };
  } catch (error) {
    return {
      response: generateMockResponse(payload.message),
      conversationId: payload.conversationId || generateConversationId(),
    };
  }
}

function generateMockResponse(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("check-in") || normalized.includes("check in")) {
    return "I can help with check-in details, room availability, and guest preferences. Which property would you like to manage first?";
  }
  if (normalized.includes("room service") || normalized.includes("service")) {
    return "Room service is ready. I can generate a service order, estimate arrival time, or recommend in-room dining options.";
  }
  if (normalized.includes("recommend")) {
    return "I recommend our rooftop lounge, spa package, and next-door dining experiences based on guest mood and season.";
  }
  if (normalized.includes("pricing") || normalized.includes("rate")) {
    return "I can compare room rates, package upgrades, and yield management suggestions for better guest satisfaction.";
  }
  return "Thanks for your message — I have noted it and can assist with reservations, concierge tasks, or property insights. What would you like to do next?";
}

function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
