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

  // Create new cutting template
  async createCuttingTemplate(
    input: {
      templateId: string;
      shapeName: string;
      cuts: number;
      thickness: number[];
      materials: string[];
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
    formData.append("thicknesses", JSON.stringify(input.thickness.map(Number)));
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
}

export const cuttingServices = new CuttingServices();
