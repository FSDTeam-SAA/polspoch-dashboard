// src/lib/services/productService.ts

import axiosInstance from "../instance/axios-instance";
import { Product } from "../types/product";

export interface BulkUpdateError {
  productName: string;
  reference: string;
  reason: string;
}

export interface BulkUpdateData {
  totalRows: number;
  success: number;
  failed: number;
  errors: BulkUpdateError[];
}

export interface BulkUpdateResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: BulkUpdateData;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  meta?: {
    totalPages: number;
    totalItems: number;
    currentPage: number;
  };
  // Fallback fields for compatibility
  totalPages?: number;
  totalItems?: number;
  total?: number;
  currentPage?: number;
}

class ProductService {
  private baseUrl = "/product";

  async getAllProducts(
    page: number,
    limit: number,
    search?: string,
  ): Promise<ProductsResponse> {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) query.append("search", search);

    const response = await axiosInstance.get<ProductsResponse>(
      `${this.baseUrl}?${query.toString()}`,
    );
    return response.data;
  }

  /**
   * Get single product by ID
   */
  async getProductById(
    id: string,
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
    formData: FormData,
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
    formData: FormData,
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
   * Delete existing product
   */
  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const response = await axiosInstance.delete<{ success: boolean }>(
      `${this.baseUrl}/${id}`,
    );
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
  /**
   * Bulk update products via file upload
   */
  async bulkUpdateProducts(formData: FormData): Promise<BulkUpdateResponse> {
    const response = await axiosInstance.put<BulkUpdateResponse>(
      `${this.baseUrl}/multiple-update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }
}

export const productService = new ProductService();
