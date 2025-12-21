// ordersService.ts

import axiosInstance from "../instance/axios-instance";

class OrdersService {
  private baseUrl = "/order";

  /**
   * Fetch current user's profile
   */
  async getOrders(
    signal?: AbortSignal
  ): Promise<import("@/types/order").Order[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/all-orders`, {
      signal,
    });

    // Handle different possible API response structures
    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    // If wrapped in { data: [...] } or { orders: [...] }
    if (data && typeof data === "object") {
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.orders)) return data.orders;
      if (Array.isArray(data.result)) return data.result;
    }

    return [];
  }
}

export const ordersService = new OrdersService();
