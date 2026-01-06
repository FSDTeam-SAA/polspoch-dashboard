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

  async updateRebarTemplate(
    input: {
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
    },
    signal?: AbortSignal,
  ): Promise<RebarTemplateDetailsResponse> {
    const formData = new FormData();
    formData.append("templateId", input.templateId);
    formData.append("shapeName", input.shapeName);
    formData.append("dimensions", JSON.stringify(input.dimensions));
    formData.append(
      "availableDiameters",
      JSON.stringify(input.availableDiameters),
    );

    if (input.image) {
      formData.append("image", input.image);
    }

    const response = await axiosInstance.patch<RebarTemplateDetailsResponse>(
      `/rebar/admin/update-image/${input.templateId}`,
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

  // create rebar template
  async createRebarTemplate(
    formData: FormData,
    signal?: AbortSignal,
  ): Promise<RebarTemplateDetailsResponse> {
    const response = await axiosInstance.post<RebarTemplateDetailsResponse>(
      "/rebar/create",
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

  // delete rebar template
  async deleteRebarTemplate(
    templateId: string,
    signal?: AbortSignal,
  ): Promise<void> {
    await axiosInstance.delete(`/rebar/delete/${templateId}`, {
      signal,
    });
  }
}

export const rebarServices = new RebarServices();
