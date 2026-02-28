// src/lib/services/shippingPolicyService.ts

import axiosInstance from "../instance/axios-instance";
import { ShippingPolicy, ShippingPolicyPayload } from "../types/shippingPolicy";

class ShippingPolicyService {
  private baseUrl = "/shippingPolicy";

  /** Fetch all shipping policies */
  async getAll(): Promise<ShippingPolicy[]> {
    const response = await axiosInstance.get<ShippingPolicy[]>(
      `${this.baseUrl}/all`,
    );
    return response.data;
  }

  /** Update a shipping policy by method name */
  async update(
    methodName: string,
    payload: Partial<ShippingPolicyPayload>,
  ): Promise<ShippingPolicy> {
    const response = await axiosInstance.patch<{
      message: string;
      data: ShippingPolicy;
    }>(`${this.baseUrl}/${methodName}`, payload);
    return response.data.data;
  }
}

export const shippingPolicyService = new ShippingPolicyService();
