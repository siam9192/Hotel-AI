// filepath: ai-agent/src/workflows/recommendation.workflow.ts
import { productTool } from '../tools/product.tool';
import { createEmbedding } from '../llm/embeddings';
import { vectorMemory } from '../memory/vector.memory';

export async function recommendationWorkflow(userId: string, preferences: string): Promise<any[]> {
  const queryVector = await createEmbedding(preferences);
  const similar = await vectorMemory.search(queryVector, 10);
  
  if (similar.length > 0) {
    return similar.map(s => s.metadata);
  }
  
  return productTool('list', {});
}