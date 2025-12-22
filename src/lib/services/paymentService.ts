// src/lib/services/paymentService.ts


import axiosInstance from "../instance/axios-instance";
import { Payment } from "../types/payments";

interface PaymentsResponse {
    success: boolean;
    data: Payment[];
}

class PaymentService {
    private baseUrl = "/payment";

    /**
     * get all payments
     */
    async getAllPayments(): Promise<PaymentsResponse> {
        const response = await axiosInstance.get<PaymentsResponse>(
            `${this.baseUrl}/all-payments`
        );
        return response.data;
    }

    /**
     * Get single payment by ID
     */
    async getPaymentById(
        id: string
    ): Promise<{ success: boolean; data: Payment }> {
        const response = await axiosInstance.get<{
            success: boolean;
            data: Payment;
        }>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    
}

export const paymentService = new PaymentService();
