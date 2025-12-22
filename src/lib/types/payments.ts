import { Product } from "./product";

export interface PaymentUser {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  companyName: string;
}

export interface OrderProduct {
  productId: Product;
  featuredId: string;
  size: number;
  unitSize: number;
}

export interface OrderSelectedFeature {
  reference: string;
  size1: number;
  size2: number;
  thickness: number;
  finishQuality: string;
  unitSizes: number[];
  kgsPerUnit?: number;
  miterPerUnitPrice?: number;
  _id: string;
}

export interface PaymentCartDetail {
  _id: string;
  userId: string;
  type: "product" | "service";
  quantity: number;
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
  product?: OrderProduct;
  service?: {
    _id: string;
    serviceType: string;
    templateName: string;
    price: number;
    diameter?: number;
    sizes?: Record<string, number>;
  };
}

export interface PaymentCartItem {
  cartId: PaymentCartDetail | null;
}

export interface PaymentOrder {
  _id: string;
  userId: string;
  cartItems: PaymentCartItem[];
  type: "cart" | "product";
  status: string;
  paymentStatus: string;
  purchaseDate: string;
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
  product?: OrderProduct;
  selectedFeature?: OrderSelectedFeature;
}

export interface Payment {
  _id: string;
  userId: PaymentUser;
  orderId: PaymentOrder;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
