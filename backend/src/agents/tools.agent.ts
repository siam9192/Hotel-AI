import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

 class ToolsAgent {
  async executeTool(toolName: string, params: any): Promise<any> {
    // Tools agent logic
    return { tool: toolName, result: params };
  }

  async getPolicy() {
    const path = "docs/policy.pdf";
    const loader = new PDFLoader(path);
    const docs = await loader.load();
    return docs[0].pageContent
  }

  async getRooms ({}:{numberOfRooms?:[number], roomType?:string, priceRange?:[number],amenities?:string[]}): Promise<any> {
  
  }
}

export default new ToolsAgent();