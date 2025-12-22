// src/lib/hooks/usePayment.ts

import { useQuery } from "@tanstack/react-query";
import { paymentService } from "../services/paymentService";
import { Payment } from "../types/payments";


    export function usePayments() {
        return useQuery<Payment[]>({
            queryKey: ["payments"],
            queryFn: async () => {
                const response = await paymentService.getAllPayments();
                // Extract the data array from the API response
                return response.data || [];
            },
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
        });
    }


    export function usePaymentById(id: string) {
        return useQuery<Payment>({
            queryKey: ["payment", id],
            queryFn: async () => {
                const response = await paymentService.getPaymentById(id);
                return response.data || null;
            },
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
        });
    }
