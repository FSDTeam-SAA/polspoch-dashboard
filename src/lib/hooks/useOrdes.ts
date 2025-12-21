// use orders

// get orders
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "../services/ordersService";
import { Order } from "@/types/order";

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await ordersService.getOrders();
      return response || [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
