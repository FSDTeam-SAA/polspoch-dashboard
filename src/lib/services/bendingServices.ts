import {
  BendingServiceResponse,
  SingleBendingServiceResponse,
  BendingDimensionInput,
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

  async updateBendingTemplate(
    input: {
      templateId: string;
      shapeName: string;
      bend: number;
      materials: {
        material: string;
        thickness: number[];
      }[];
      dimensions: BendingDimensionInput[];
      image?: File;
    },
    signal?: AbortSignal,
  ): Promise<SingleBendingServiceResponse> {
    const formData = new FormData();
    formData.append("templateId", input.templateId);
    formData.append("shapeName", input.shapeName);
    formData.append("bend", String(input.bend));

    // Append array fields as stringified JSON
    formData.append("materials", JSON.stringify(input.materials));
    formData.append("dimensions", JSON.stringify(input.dimensions));

    if (input.image) {
      formData.append("image", input.image);
    }

    const res = await axiosInstance.patch<SingleBendingServiceResponse>(
      `${this.baseUrl}/admin/update/${input.templateId}`,
      formData,
      {
        signal,
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return res.data;
  }

  // Create new bending template
  async createBendingTemplate(
    input: {
      templateId: string;
      shapeName: string;
      bend: number;
      materials: {
        material: string;
        thickness: number[];
      }[];
      dimensions: BendingDimensionInput[];
      image: FileList;
    },
    signal?: AbortSignal,
  ): Promise<SingleBendingServiceResponse> {
    const formData = new FormData();
    formData.append("templateId", input.templateId);
    formData.append("shapeName", input.shapeName);
    formData.append("bend", String(input.bend));

    // Append array fields as stringified JSON
    formData.append("materials", JSON.stringify(input.materials));
    formData.append("dimensions", JSON.stringify(input.dimensions));

    if (input.image && input.image.length > 0) {
      formData.append("image", input.image[0]);
    }

    const res = await axiosInstance.post<SingleBendingServiceResponse>(
      `${this.baseUrl}/admin/create`,
      formData,
      {
        signal,
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return res.data;
  }

  // delete bending template
  async deleteBendingTemplate(
    templateId: string,
    signal?: AbortSignal,
  ): Promise<void> {
    await axiosInstance.delete(`/bending/admin/delete/${templateId}`, {
      signal,
    });
  }
}

export const bendingServices = new BendingServices();
