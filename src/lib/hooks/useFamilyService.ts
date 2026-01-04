import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { familyServices } from "../services/familyService";

// Get families
export function useFamilies() {
  return useQuery({
    queryKey: ["families"],
    queryFn: async () => {
      const response = await familyServices.getFamilies();
      return response.data;
    },
  });
}

// Create family
export function useCreateFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => familyServices.createFamily(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      toast.success("Family created successfully");
    },
    onError: () => {
      toast.error("Failed to create family");
    },
  });
}

// Update family
export function useUpdateFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      familyServices.updateFamily(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      toast.success("Family updated successfully");
    },
    onError: () => {
      toast.error("Failed to update family");
    },
  });
}

// Delete family
export function useDeleteFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => familyServices.deleteFamily(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      //   toast.success("Family deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete family");
    },
  });
}
