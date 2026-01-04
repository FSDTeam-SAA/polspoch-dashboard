import { BendingDimensionInput } from "@/types/bending";
import { useQuery } from "@tanstack/react-query";
import { bendingServices } from "../services/bendingServices";

export function useBendingTemplates() {
  return useQuery({
    queryKey: ["bendingTemplates"],
    queryFn: async ({ signal }) => {
      const res = await bendingServices.getBendingTemplates(signal);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateBendingImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, file }: { templateId: string; file: File }) =>
      bendingServices.updateBendingImage(templateId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bendingTemplates"] });
    },
  });
}

export function useUpdateBendingDimension() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      templateId: string;
      key: string;
      newLabel: string;
      min: number;
      max: number;
    }) => bendingServices.updateBendingDimension(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bendingTemplates"] });
    },
  });
}

// Create new bending template
// Create new bending template
export function useCreateBendingTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      templateId: string;
      shapeName: string;
      cuts: number;
      thickness: number[];
      materials: string[];
      dimensions: BendingDimensionInput[];
      image: FileList;
    }) => bendingServices.createBendingTemplate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bendingTemplates"] });
    },
  });
}
