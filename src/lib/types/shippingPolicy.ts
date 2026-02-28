// src/lib/types/shippingPolicy.ts

export interface ShippingPolicy {
  _id: string;
  methodName: "courier" | "truck";
  basePrice: number;
  freeWeightLimit: number;
  extraWeightPrice: number;
  extraWeightStep: number;
  sizeThreshold: number;
  sizeSurcharge: number;
  maxSizeAllowed: number;
  maxTotalCost: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingPolicyPayload {
  methodName: "courier" | "truck";
  basePrice: number;
  freeWeightLimit: number;
  extraWeightPrice: number;
  extraWeightStep: number;
  sizeThreshold: number;
  sizeSurcharge: number;
  maxSizeAllowed: number;
  maxTotalCost: number;
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
