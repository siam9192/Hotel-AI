

export interface ProcessMessagePayload {
  newMessage: string;
  history?: ChatHistory[];
}


export interface ChatHistory extends Record<
  "HumanMessage" | "AIMessage" | "ToolMessage",
  any
> {}
