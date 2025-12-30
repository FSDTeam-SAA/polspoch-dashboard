// src/lib/services/rebarServices.ts
import {
  RebarServiceResponse,
  RebarTemplateDetailsResponse,
} from "@/types/rebar";
import axiosInstance from "../instance/axios-instance";

class RebarServices {
  private baseUrl = "/rebar/templates";

  async getRebarTemplates(signal?: AbortSignal): Promise<RebarServiceResponse> {
    const response = await axiosInstance.get<RebarServiceResponse>(
      this.baseUrl,
      {
        signal,
      },
    );
    return response.data;
  }

  async getRebarTemplateDetails(
    templateId: string,
    signal?: AbortSignal,
  ): Promise<RebarTemplateDetailsResponse> {
    const response = await axiosInstance.get<RebarTemplateDetailsResponse>(
      `${this.baseUrl}/${templateId}`,
      {
        signal,
      },
    );
    return response.data;
  }

  async updateRebarImage(
    templateId: string,
    file: File,
    signal?: AbortSignal,
  ): Promise<RebarTemplateDetailsResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.patch<RebarTemplateDetailsResponse>(
      `/rebar/admin/update-image/${templateId}`,
      formData,
      {
        signal,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  async updateRebarLabel(
    input: {
      templateId: string;
      key: string;
      newLabel: string;
      min: number;
      max: number;
    },
    signal?: AbortSignal,
  ): Promise<RebarTemplateDetailsResponse> {
    const response = await axiosInstance.patch<RebarTemplateDetailsResponse>(
      "/rebar/admin/update-label",
      input,
      {
        signal,
      },
    );
    return response.data;
  }
}

export const rebarServices = new RebarServices();
