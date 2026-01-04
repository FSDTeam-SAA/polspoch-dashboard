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

  // Create new bending template
  async createBendingTemplate(
    input: {
      templateId: string;
      shapeName: string;
      cuts: number;
      thickness: number[];
      materials: string[];
      dimensions: BendingDimensionInput[];
      image: FileList;
    },
    signal?: AbortSignal,
  ): Promise<SingleBendingServiceResponse> {
    const formData = new FormData();
    formData.append("templateId", input.templateId);
    formData.append("shapeName", input.shapeName);
    formData.append("cuts", String(input.cuts));

    // Append array fields as stringified JSON
    formData.append("thickness", JSON.stringify(input.thickness.map(Number)));
    formData.append("materials", JSON.stringify(input.materials));
    formData.append("dimensions", JSON.stringify(input.dimensions));

    if (input.image && input.image.length > 0) {
      formData.append("image", input.image[0]);
    }

    const res = await axiosInstance.post<SingleBendingServiceResponse>(
      `${this.baseUrl}/admin/create-template`,
      formData,
      {
        signal,
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return res.data;
  }
}

export const bendingServices = new BendingServices();
