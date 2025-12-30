// users/lib/hooks/useRebarServices.ts
import { useQuery } from "@tanstack/react-query";
import { rebarServices } from "../services/rebarServices";

// Hook to get all rebar templates
export function useRebarTemplates() {
  return useQuery({
    queryKey: ["rebarTemplates"],
    queryFn: async ({ signal }) => {
      const response = await rebarServices.getRebarTemplates(signal);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to get specific rebar template details
export function useRebarTemplateDetails(templateId: string | null) {
  return useQuery({
    queryKey: ["rebarTemplateDetails", templateId],
    queryFn: async ({ signal }) => {
      if (!templateId) throw new Error("Template ID is required");
      const response = await rebarServices.getRebarTemplateDetails(
        templateId,
        signal,
      );
      return response.data;
    },
    enabled: !!templateId, // Only run if templateId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateRebarImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, file }: { templateId: string; file: File }) =>
      rebarServices.updateRebarImage(templateId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rebarTemplates"] });
      queryClient.invalidateQueries({
        queryKey: ["rebarTemplateDetails", variables.templateId],
      });
    },
  });
}

export function useUpdateRebarLabel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      templateId: string;
      key: string;
      newLabel: string;
      min: number;
      max: number;
    }) => rebarServices.updateRebarLabel(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rebarTemplates"] });
      queryClient.invalidateQueries({
        queryKey: ["rebarTemplateDetails", variables.templateId],
      });
    },
  });
}
