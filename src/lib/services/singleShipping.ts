// services/getShippingSingle.ts
import axiosInstance from "../instance/axios-instance";
import { ShippingData, ShippingResponse } from "@/types/shipping";

export class GetShippingSingleService {
  private baseUrl = "/shipping-address/admin/order";

  async getShippingSingle(
    orderId: string,
    signal?: AbortSignal,
  ): Promise<ShippingData | null> {
    const response = await axiosInstance.get<ShippingResponse>(
      `${this.baseUrl}/${orderId}`,
      { signal },
    );

    return response.data.data?.[0] || null;
  }
}
