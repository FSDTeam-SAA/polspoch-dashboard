// src/lib/services/productService.ts

import axiosInstance from "../instance/axios-instance";
import { Product } from "../types/product";

interface ProductsResponse {
  success: boolean;
  data: Product[];
}

class ProductService {
  private baseUrl = "/product";

  /**
   * get all products
   */
  async getAllProducts(): Promise<ProductsResponse> {
    const response = await axiosInstance.get<ProductsResponse>(
      `${this.baseUrl}`
    );
    return response.data;
  }

  /**
   * Add new product
   */
  //   async addProduct(product: any) {
  //     const response = await axiosInstance.post(`${this.baseUrl}/add`, product);
  //     return response.data;
  //   }
}

export const productService = new ProductService();
