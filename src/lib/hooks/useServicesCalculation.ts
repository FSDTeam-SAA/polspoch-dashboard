// use services calculation

// get services calculation
import { useQuery } from "@tanstack/react-query";
import { servicesCalculation } from "../services/servicesCalculation";

export function useServicesCalculation() {
  return useQuery({
    queryKey: ["servicesCalculation"],
    queryFn: async () => {
      const data = await servicesCalculation.getServicesCalculation();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
