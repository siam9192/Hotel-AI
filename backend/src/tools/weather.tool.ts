// filepath: ai-agent/src/tools/weather.tool.ts
export async function weatherTool(location: string): Promise<any> {
  // Weather tool implementation
  return {
    location,
    temperature: 72,
    condition: 'Sunny',
    humidity: 45,
  };
}