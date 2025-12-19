// src/lib/hooks/useProductForm.ts

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { productFormSchema, ProductFormValues } from "../schemas/productSchema";
import { productService } from "../services/productService";

interface UseProductFormProps {
  mode: "add" | "edit";
  productId?: string;
}

export function useProductForm({ mode, productId }: UseProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch existing product data for edit mode
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");
      const response = await productService.getProductById(productId);
      return response.data;
    },
    enabled: mode === "edit" && !!productId,
  });

  // Initialize form with react-hook-form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      productName: "",
      family: "",
      availabilityNote: "",
      unitSizeCustomizationNote: "",
      measureUnit: "",
      features: [
        {
          reference: "",
          size1: 0,
          size2: 0,
          thickness: 0,
          finishQuality: "",
          minRange: 0,
          maxRange: 0,
          kgsPerUnit: 0,
          miterPerUnitPrice: undefined,
        },
      ],
    },
  });

  // Update form when product data is loaded

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await productService.createProduct(formData);
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/products");
    },
    onError: (error: unknown) => {
      console.error("Error creating product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";
      toast.error(errorMessage);
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      return await productService.updateProduct(id, formData);
    },
    onSuccess: () => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      router.push("/products");
    },
    onError: (error: unknown) => {
      console.error("Error updating product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (data: ProductFormValues, imageFiles: File[]) => {
    const formData = new FormData();

    // Append product data
    formData.append("productName", data.productName);
    formData.append("family", data.family);
    formData.append("measureUnit", data.measureUnit);

    if (data.availabilityNote) {
      formData.append("availabilityNote", data.availabilityNote);
    }
    if (data.unitSizeCustomizationNote) {
      formData.append(
        "unitSizeCustomizationNote",
        data.unitSizeCustomizationNote
      );
    }

    // Append features as JSON string
    formData.append("features", JSON.stringify(data.features));

    // Append images
    imageFiles.forEach((file) => {
      formData.append("productImage", file);
    });

    if (mode === "add") {
      createMutation.mutate(formData);
    } else if (mode === "edit" && productId) {
      updateMutation.mutate({ id: productId, formData });
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: createMutation.isPending || updateMutation.isPending,
    isLoadingProduct,
    productData,
  };
}
