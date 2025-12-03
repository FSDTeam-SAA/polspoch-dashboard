// src/lib/hooks/useProduct.ts

import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { Product } from "../types/product";

// use products
export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await productService.getAllProducts();
      // Extract the data array from the API response
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
