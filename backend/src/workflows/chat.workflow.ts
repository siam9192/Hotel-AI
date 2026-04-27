// filepath: ai-agent/src/workflows/chat.workflow.ts
import { chatMemory } from '../memory/chat.memory';
import { chatCompletion } from '../llm/openai';

export async function chatWorkflow(userInput: string): Promise<string> {
  chatMemory.addMessage('user', userInput);
  
  const messages = chatMemory.getMessages().map(m => ({
    role: m.role,
    content: m.content,
  }));

  const response = await chatCompletion(messages);
  const assistantMessage = response.choices[0]?.message?.content || '';
  
  chatMemory.addMessage('assistant', assistantMessage);
  return assistantMessage;
}