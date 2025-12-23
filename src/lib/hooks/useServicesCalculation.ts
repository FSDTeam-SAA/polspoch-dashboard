// get services calculation

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { servicesCalculation } from "../services/servicesCalculation";
import { updateServicesCalculation } from "../services/servicesCalculation";
import { ServiceUpdatePayload } from "@/types/servicesCalculation";

// get services calculation

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

// update services calculation

export function useUpdateServicesCalculation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ServiceUpdatePayload) => {
      const response =
        await updateServicesCalculation.updateServicesCalculation(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["servicesCalculation"],
      });
    },
  });
}
