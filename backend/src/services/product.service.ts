// filepath: ai-agent/src/services/product.service.ts
import products from '../../data/products.json';

export class ProductService {
  getAll() {
    return products;
  }

  getById(id: string) {
    return products.find(p => p.id === id);
  }

  search(query: string) {
    return products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const productService = new ProductService();