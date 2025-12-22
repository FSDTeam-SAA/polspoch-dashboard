// src/lib/services/servicesCalculation.ts

import {
  ServicesCalculationData,
  ServicesCalculationResponse,
} from "@/types/servicesCalculation";
import axiosInstance from "../instance/axios-instance";

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
