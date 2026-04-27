// filepath: ai-agent/src/memory/chat.memory.ts
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

class ChatMemory {
  private messages: ChatMessage[] = [];
  private maxMessages = 100;

  addMessage(role: 'user' | 'assistant', content: string) {
    this.messages.push({ role, content, timestamp: Date.now() });
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }
  }

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  clear() {
    this.messages = [];
  }
}

export const chatMemory = new ChatMemory();