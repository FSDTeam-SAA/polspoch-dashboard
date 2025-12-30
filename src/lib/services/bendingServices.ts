import {
  BendingServiceResponse,
  SingleBendingServiceResponse,
} from "@/types/bending";
import axiosInstance from "../instance/axios-instance";

class BendingServices {
  private baseUrl = "/bending";

  async getBendingTemplates(
    signal?: AbortSignal,
  ): Promise<BendingServiceResponse> {
    const res = await axiosInstance.get<BendingServiceResponse>(
      `${this.baseUrl}/bending-templates`,
      { signal },
    );
    return res.data;
  }

  async updateBendingImage(
    templateId: string,
    file: File,
    signal?: AbortSignal,
  ): Promise<SingleBendingServiceResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axiosInstance.patch<SingleBendingServiceResponse>(
      `${this.baseUrl}/admin/update-image/${templateId}`,
      formData,
      {
        signal,
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return res.data;
  }

  async updateBendingDimension(
    input: {
      templateId: string;
      key: string;
      newLabel: string;
      min: number;
      max: number;
    },
    signal?: AbortSignal,
  ): Promise<SingleBendingServiceResponse> {
    const res = await axiosInstance.patch<SingleBendingServiceResponse>(
      `${this.baseUrl}/update-template`,
      input,
      { signal },
    );

    return res.data;
  }
}

export const bendingServices = new BendingServices();
