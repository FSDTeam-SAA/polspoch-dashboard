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

  async updateCuttingImage(
    templateId: string,
    file: File,
    signal?: AbortSignal,
  ): Promise<SingleCuttingServiceResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axiosInstance.post<SingleCuttingServiceResponse>(
      `${this.baseUrl}/update-image/${templateId}`,
      formData,
      {
        signal,
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return res.data;
  }

  async updateCuttingData(
    input: {
      templateId: string;
      key: string;
      newLabel: string;
      min: number;
      max: number;
    },
    signal?: AbortSignal,
  ): Promise<SingleCuttingServiceResponse> {
    const res = await axiosInstance.patch<SingleCuttingServiceResponse>(
      `${this.baseUrl}/update-data`,
      input,
      { signal },
    );

    return res.data;
  }
}

export const cuttingServices = new CuttingServices();
