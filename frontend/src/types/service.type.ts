export interface SignupServicePayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginServicePayload {
  email: string;
  password: string;
}

export interface ChatHistoryItem {
  role: "user" | "assistant";
  text: string;
}

export interface ChatMessagePayload {
  message: string;
  conversationId?: string;
  history?: ChatHistoryItem[];
}

export interface ChatResponse {
  response: string;
  conversationId?: string;
}

export interface ChatHistory extends Record<
  "HumanMessage" | "AIMessage" | "ToolMessage",
  any
> {}
