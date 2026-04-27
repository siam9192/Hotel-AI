// filepath: ai-agent/src/tools/product.tool.ts
import products from '../../data/products.json';

export async function productTool(action: string, params: any): Promise<any> {
  switch (action) {
    case 'search':
      return products.filter(p => 
        p.name.toLowerCase().includes(params.query.toLowerCase())
      );
    case 'get':
      return products.find(p => p.id === params.id);
    case 'list':
      return products;
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}