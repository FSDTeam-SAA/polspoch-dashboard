// hooks/useGetShippingSingle.ts
import { useQuery } from "@tanstack/react-query";
import { GetShippingSingleService } from "../services/singleShipping";

const shippingService = new GetShippingSingleService();

export const useGetShippingSingle = (orderId: string) => {
  return useQuery({
    queryKey: ["single-shipping", orderId],
    queryFn: ({ signal }) => shippingService.getShippingSingle(orderId, signal),
    enabled: !!orderId,
  });
};
