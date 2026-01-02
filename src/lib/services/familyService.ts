import axiosInstance from "../instance/axios-instance";
import {
  CreateFamilyResponse,
  DeleteFamilyResponse,
  FamilyServiceResponse,
  UpdateFamilyResponse,
} from "../types/family";

class FamilyService {
  private baseUrl = "/product";

  //   get families
  async getFamilies(signal?: AbortSignal): Promise<FamilyServiceResponse> {
    const res = await axiosInstance.get<FamilyServiceResponse>(
      `${this.baseUrl}/family/all`,
      { signal },
    );
    return res.data;
  }

  //   create family
  async createFamily(formData: FormData): Promise<CreateFamilyResponse> {
    const res = await axiosInstance.post<CreateFamilyResponse>(
      `${this.baseUrl}/family/create`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data;
  }

  //   update family
  async updateFamily(
    id: string,
    formData: FormData,
  ): Promise<UpdateFamilyResponse> {
    const res = await axiosInstance.put<UpdateFamilyResponse>(
      `${this.baseUrl}/family/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data;
  }

  //   delete family
  async deleteFamily(id: string): Promise<DeleteFamilyResponse> {
    const res = await axiosInstance.delete<DeleteFamilyResponse>(
      `${this.baseUrl}/family/${id}`,
    );
    return res.data;
  }
}

export const familyServices = new FamilyService();
