import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "../services/ordersService";
import { toast } from "sonner";

export function useOrders() {
  return useQuery<import("@/types/order").Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const data = await ordersService.getOrders();
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

// Delete orders
export function useDeleteOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderIds: string[]) => ordersService.deleteOrders(orderIds),
    onSuccess: () => {
      toast.success("Orders deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        axiosError.response?.data?.message || "Failed to delete orders";
      toast.error(errorMessage);
    },
  });
}
