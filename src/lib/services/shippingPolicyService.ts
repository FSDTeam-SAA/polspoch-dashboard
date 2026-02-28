// src/lib/services/shippingPolicyService.ts

import axiosInstance from "../instance/axios-instance";
import {
  ShippingPolicy,
  ShippingPolicyPayload,
  ShippingPolicyResponse,
  SingleShippingPolicyResponse,
} from "../types/shippingPolicy";

class ShippingPolicyService {
  private baseUrl = "/order-shipping";

  /** Fetch all shipping policies */
  async getAll(): Promise<ShippingPolicy[]> {
    const response = await axiosInstance.get<ShippingPolicyResponse>(
      this.baseUrl,
    );
    return response.data.data;
  }

  /** Update a shipping policy by ID */
  async update(
    id: string,
    payload: Partial<ShippingPolicyPayload>,
  ): Promise<ShippingPolicy> {
    const response = await axiosInstance.put<SingleShippingPolicyResponse>(
      `${this.baseUrl}/update/${id}`,
      payload,
    );
    return response.data.data;
  }

  /** Delete a shipping policy by ID */
  async delete(id: string): Promise<{ success: boolean }> {
    const response = await axiosInstance.delete<{ success: boolean }>(
      `${this.baseUrl}/delete/${id}`,
    );
    return response.data;
  }
}

export const shippingPolicyService = new ShippingPolicyService();
