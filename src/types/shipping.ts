export interface ShippingData {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  orderId: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  deliveryInstructions?: string;
  invoiceDetails?: {
    name: string;
    email: string;
    phone: string;
    company: string;
    vat: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShippingResponse {
  success: boolean;
  data: ShippingData[];
}
