import {
  CuttingServiceResponse,
  SingleCuttingServiceResponse,
} from "@/types/cutting";
import axiosInstance from "../instance/axios-instance";

class CuttingServices {
  private baseUrl = "/cutting";

  async getCuttingTemplates(
    signal?: AbortSignal,
  ): Promise<CuttingServiceResponse> {
    const res = await axiosInstance.get<CuttingServiceResponse>(
      `${this.baseUrl}/`,
      { signal },
    );
    return res.data;
  }

  async updateCuttingTemplate(
    input: {
      templateId: string;
      shapeName: string;
      cuts: number;
      materials: { material: string; thickness: number[] }[];
      dimensions: {
        label: string;
        minRange: number;
        maxRange: number;
        unit: string;
        key: string;
      }[];
      image?: File;
    },
    signal?: AbortSignal,
  ): Promise<SingleCuttingServiceResponse> {
    const formData = new FormData();
    formData.append("templateId", input.templateId);
    formData.append("shapeName", input.shapeName);
    formData.append("cuts", String(input.cuts));

    // Append array fields as stringified JSON
    formData.append("materials", JSON.stringify(input.materials));
    formData.append("dimensions", JSON.stringify(input.dimensions));

    if (input.image) {
      formData.append("image", input.image);
    }

    const res = await axiosInstance.patch<SingleCuttingServiceResponse>(
      `${this.baseUrl}/update-data/${input.templateId}`,
      formData,
      {
        signal,
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return res.data;
  }

  // Create new cutting template
  async createCuttingTemplate(
    input: {
      templateId: string;
      shapeName: string;
      cuts: number;
      materials: { material: string; thickness: number[] }[];
      dimensions: {
        label: string;
        minRange: number;
        maxRange: number;
        unit: string;
        key: string;
      }[];
      image: FileList;
    },
    signal?: AbortSignal,
  ): Promise<SingleCuttingServiceResponse> {
    const formData = new FormData();
    formData.append("templateId", input.templateId);
    formData.append("shapeName", input.shapeName);
    formData.append("cuts", String(input.cuts));

    // Append array fields as stringified JSON
    formData.append("materials", JSON.stringify(input.materials));
    formData.append("dimensions", JSON.stringify(input.dimensions));

    if (input.image && input.image.length > 0) {
      formData.append("image", input.image[0]);
    }

    const res = await axiosInstance.post<SingleCuttingServiceResponse>(
      `${this.baseUrl}/create`,
      formData,
      {
        signal,
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return res.data;
  }

  async deleteCuttingTemplate(
    templateId: string,
    signal?: AbortSignal,
  ): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/cutting/delete/${templateId}`, {
      signal,
    });
  }
}

export const cuttingServices = new CuttingServices();
