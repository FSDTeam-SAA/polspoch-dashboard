export interface ServiceSizes {
  A?: number;
  B?: number;
  C?: number;
  D?: number;
}

export interface Service {
  _id: string;
  templateName: string;
  serviceType: string;
  diameter: number;
  sizes: ServiceSizes;
  price: number;
  image?: string;
}

export interface CartItemDetails {
  service: Service;
  quantity: number;
}

export interface CartItem {
  cartId: CartItemDetails;
  _id: string; // Sometimes items have their own ID in the array
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
}

export interface Order {
  _id: string;
  userId: User;
  cartItems: CartItem[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled" | "failed"; // Adjust based on actual values
  paymentStatus: "paid" | "unpaid" | "failed";
  purchaseDate: string;
  createdAt?: string;
  updatedAt?: string;
}
