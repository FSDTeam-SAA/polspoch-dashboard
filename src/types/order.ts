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

export interface SelectedFeature {
  _id?: string;
  reference: string;
  size1: number;
  size2: number;
  thickness: number;
  finishQuality: string;
  kgsPerUnit?: number;
  miterPerUnitPrice?: number;
  unitSizes?: number[];
}

export interface ProductImage {
  _id: string;
  url: string;
  publickey: string;
}

export interface ProductDetails {
  _id: string;
  featuredId: string;
  productName: string;
  family: string;
  availabilityNote: string;
  measureUnit: string;
  minRange: number | null;
  maxRange: number | null;
  unitSizeCustomizationNote: string;
  createdAt: string;
  updatedAt: string;
  productImage: ProductImage[];
}

export interface CartItem {
  _id: string;
  type: "product" | "service";
  quantity: number;
  totalAmount: number;
  unitSize?: number;
  size?: number;
  createdAt?: string;
  updatedAt?: string;
  selectedFeature?: SelectedFeature;
  product?: ProductDetails;
  service?: Service;
  userId?: string;
  cartId?: CartItem;
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
  type?: string;
  userId: User;
  cartItems: CartItem[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled" | "failed";
  paymentStatus: "paid" | "unpaid" | "failed";
  purchaseDate: string;
  createdAt?: string;
  updatedAt?: string;
}
