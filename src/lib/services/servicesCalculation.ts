// src/lib/services/servicesCalculation.ts

import {
  ServicesCalculationData,
  ServicesCalculationResponse,
  ServiceUpdatePayload,
} from "@/types/servicesCalculation";
import axiosInstance from "../instance/axios-instance";

// get all calculation data
class ServicesCalculation {
  private baseUrl = "/modify-service";

  async getServicesCalculation(
    signal?: AbortSignal
  ): Promise<ServicesCalculationData | null> {
    const response = await axiosInstance.get<ServicesCalculationResponse>(
      `${this.baseUrl}/config`,
      {
        signal,
      }
    );
    return response.data.data || null;
  }
}

export const servicesCalculation = new ServicesCalculation();

// update calculation data
class UpdateServicesCalculation {
  private baseUrl = "/modify-service";

  async updateServicesCalculation(
    data: ServiceUpdatePayload
  ): Promise<ServicesCalculationData | null> {
    const response = await axiosInstance.put<ServicesCalculationResponse>(
      `${this.baseUrl}/config/update`,
      data
    );
    return response.data.data || null;
  }
}
export const updateServicesCalculation = new UpdateServicesCalculation();
