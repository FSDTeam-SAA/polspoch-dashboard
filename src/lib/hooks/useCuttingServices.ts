import { CuttingDimensionInput } from "@/types/cutting";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cuttingServices } from "../services/cuttingServices";

export function useCuttingTemplates() {
  return useQuery({
    queryKey: ["cuttingTemplates"],
    queryFn: async ({ signal }) => {
      const response = await cuttingServices.getCuttingTemplates(signal);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateCuttingImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, file }: { templateId: string; file: File }) =>
      cuttingServices.updateCuttingImage(templateId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cuttingTemplates"] });
    },
  });
}

export function useUpdateCuttingData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      templateId: string;
      key: string;
      newLabel: string;
      min: number;
      max: number;
    }) => cuttingServices.updateCuttingData(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cuttingTemplates"] });
    },
  });
}

// Create new cutting template
export function useCreateCuttingTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      templateId: string;
      shapeName: string;
      cuts: number;
      thickness: number[];
      materials: string[];
      dimensions: CuttingDimensionInput[];
      image: FileList;
    }) => cuttingServices.createCuttingTemplate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cuttingTemplates"] });
    },
  });
}
