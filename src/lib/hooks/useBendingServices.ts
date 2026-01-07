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

// export function useUpdateBendingImage() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ templateId, file }: { templateId: string; file: File }) =>
//       bendingServices.updateBendingImage(templateId, file),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["bendingTemplates"] });
//     },
//   });
// }

export function useUpdateBendingTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      templateId: string;
      shapeName: string;
      cuts: number;
      materials: {
        material: string;
        thickness: number[];
      }[];
      dimensions: BendingDimensionInput[];
      image?: File;
    }) => bendingServices.updateBendingTemplate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bendingTemplates"] });
    },
  });
}

// Create new bending template
export function useCreateBendingTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      templateId: string;
      shapeName: string;
      cuts: number;
      materials: {
        material: string;
        thickness: number[];
      }[];
      dimensions: BendingDimensionInput[];
      image: FileList;
    }) => bendingServices.createBendingTemplate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bendingTemplates"] });
    },
  });
}

// delete bending template
export function useDeleteBendingTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) =>
      bendingServices.deleteBendingTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bendingTemplates"] });
    },
  });
}
