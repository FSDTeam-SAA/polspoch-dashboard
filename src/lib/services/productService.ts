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
   * Get single product by ID
   */
  async getProductById(
    id: string
  ): Promise<{ success: boolean; data: Product }> {
    const response = await axiosInstance.get<{
      success: boolean;
      data: Product;
    }>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Create new product
   */
  async createProduct(
    formData: FormData
  ): Promise<{ success: boolean; data: Product }> {
    const response = await axiosInstance.post<{
      success: boolean;
      data: Product;
    }>(`${this.baseUrl}/add-product`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  /**
   * Update existing product
   */
  async updateProduct(
    id: string,
    formData: FormData
  ): Promise<{ success: boolean; data: Product }> {
    const response = await axiosInstance.put<{
      success: boolean;
      data: Product;
    }>(`${this.baseUrl}/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  /**
   * Upload product images
   */
  // async uploadImages(
  //   files: File[]
  // ): Promise<{ success: boolean; data: { url: string; publickey: string }[] }> {
  //   const formData = new FormData();
  //   files.forEach((file) => {
  //     formData.append("images", file);
  //   });

  //   const response = await axiosInstance.post<{
  //     success: boolean;
  //     data: { url: string; publickey: string }[];
  //   }>(`${this.baseUrl}/upload-images`, formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  //   return response.data;
  // }

  /**
   * Delete product image
   */
  // async deleteImage(publicKey: string): Promise<{ success: boolean }> {
  //   const response = await axiosInstance.delete<{ success: boolean }>(
  //     `${this.baseUrl}/image/${publicKey}`
  //   );
  //   return response.data;
  // }
}

export const productService = new ProductService();
