// src/lib/types/shippingPolicy.ts

export interface ShippingPolicy {
  _id: string;
  shippingMethod: string;
  limits: string;
  minPrice: number;
  Extras: string;
  maxPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingPolicyPayload {
  shippingMethod: string;
  limits: string;
  minPrice: number;
  Extras: string;
  maxPrice: number;
}

export interface ShippingPolicyResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: ShippingPolicy[];
}

export interface SingleShippingPolicyResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: ShippingPolicy;
}
