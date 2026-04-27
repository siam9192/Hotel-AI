// filepath: ai-agent/src/tools/search.tool.ts
export async function searchTool(query: string): Promise<any> {
  // Search tool implementation
  return {
    query,
    results: [
      { title: 'Result 1', url: 'https://example.com/1' },
      { title: 'Result 2', url: 'https://example.com/2' },
    ],
  };
}