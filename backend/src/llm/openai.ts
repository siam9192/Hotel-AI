// filepath: ai-agent/src/llm/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chatCompletion(messages: any[]) {
  return openai.chat.completions.create({
    model: 'gpt-4',
    messages,
  });
}

export { openai };