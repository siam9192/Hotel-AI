// filepath: ai-agent/src/memory/vector.memory.ts
interface VectorEntry {
  id: string;
  vector: number[];
  text: string;
  metadata: any;
}

class VectorMemory {
  private entries: VectorEntry[] = [];

  async add(id: string, vector: number[], text: string, metadata = {}) {
    this.entries.push({ id, vector, text, metadata });
  }

  async search(queryVector: number[], topK = 5): Promise<VectorEntry[]> {
    // Simple similarity search (cosine similarity)
    const scored = this.entries.map(entry => ({
      entry,
      score: this.cosineSimilarity(queryVector, entry.vector),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map(s => s.entry);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
    const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
    return dotProduct / (magA * magB);
  }
}

export const vectorMemory = new VectorMemory();