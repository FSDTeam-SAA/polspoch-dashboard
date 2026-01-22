import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, ProductsResponse } from "../services/productService";

import { toast } from "sonner";

// get all products
export function useProducts(page: number, limit: number, search?: string) {
  return useQuery<ProductsResponse>({
    queryKey: ["products", page, limit, search],
    queryFn: async () => {
      const response = await productService.getAllProducts(page, limit, search);
      // Return the full response to access metadata like totalPages
      return response;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: (keepPreviousData) => keepPreviousData,
  });
}

// use delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Failed to delete product");
    },
  });
}
