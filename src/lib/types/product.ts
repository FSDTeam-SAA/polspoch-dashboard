// src/lib/types/product.ts

export interface ProductImage {
  url: string;
  publickey: string;
  _id: string;
}

export interface Feature {
  reference: string;
  size1: number;
  size2: number;
  thickness: number;
  finishQuality: string;
  kgsPerUnit?: number;
  miterPerUnitPrice?: number;
  unitSizes?: number[];
  _id?: string;
}

export interface Product {
  _id: string;
  family: string;
  productName: string;
  availabilityNote?: string;
  unitSizeCustomizationNote?: string;

  features: Feature[];

  productImage: ProductImage[];

  minRange: number;
  maxRange: number;
  measureUnit: string;

  createdAt?: string;
  updatedAt?: string;
}
