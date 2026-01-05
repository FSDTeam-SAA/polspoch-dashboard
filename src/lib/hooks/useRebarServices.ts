// users/lib/hooks/useRebarServices.ts
import { useQuery } from "@tanstack/react-query";
import { rebarServices } from "../services/rebarServices";
import { RebarTemplateDetailsResponse } from "@/types/rebar";
import { AxiosError } from "axios";

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

export function useUpdateRebarTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      templateId: string;
      shapeName: string;
      dimensions: {
        key: string;
        label: string;
        minRange: number;
        maxRange: number;
        unit: string;
      }[];
      availableDiameters: number[];
      image?: File;
    }) => rebarServices.updateRebarTemplate(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rebarTemplates"] });
      queryClient.invalidateQueries({
        queryKey: ["rebarTemplateDetails", variables.templateId],
      });
    },
  });
}

// create rebar template
export function useCreateRebarTemplate() {
  const queryClient = useQueryClient();
  return useMutation<
    RebarTemplateDetailsResponse,
    AxiosError<{ message: string }>,
    FormData
  >({
    mutationFn: (formData: FormData) =>
      rebarServices.createRebarTemplate(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rebarTemplates"] });
    },
  });
}

// delete rebar template
export function useDeleteRebarTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) =>
      rebarServices.deleteRebarTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rebarTemplates"] });
    },
  });
}
