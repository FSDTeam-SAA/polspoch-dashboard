// src/lib/hooks/useShippingPolicy.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shippingPolicyService } from "../services/shippingPolicyService";
import { ShippingPolicyPayload } from "../types/shippingPolicy";
import { toast } from "sonner";

const QUERY_KEY = ["shipping-policies"];

/** Fetch all shipping policies */
export function useShippingPolicies() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => shippingPolicyService.getAll(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

/** Update a shipping policy */
export function useUpdateShippingPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ShippingPolicyPayload>;
    }) => shippingPolicyService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Shipping policy updated successfully");
    },
    onError: (error: Error) => {
      console.error("Error updating shipping policy:", error);
      toast.error(error.message || "Failed to update shipping policy");
    },
  });
}

/** Delete a shipping policy */
export function useDeleteShippingPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shippingPolicyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Shipping policy deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Error deleting shipping policy:", error);
      toast.error(error.message || "Failed to delete shipping policy");
    },
  });
}
