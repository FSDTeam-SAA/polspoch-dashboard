export interface ShippingData {
  _id: string;
  userId: string;
  orderId: string;
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  deliveryInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingResponse {
  success: boolean;
  data: ShippingData[];
}
