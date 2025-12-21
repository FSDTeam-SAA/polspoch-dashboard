// use orders

// get orders
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "../services/ordersService";

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
