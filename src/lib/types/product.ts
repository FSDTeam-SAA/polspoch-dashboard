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
  kgsPerUnit: number;

  createdAt?: string;
  updatedAt?: string;
}

// Form data type (for creating/updating products)
export interface ProductFormData {
  family: string;
  productName: string;
  availabilityNote?: string;
  unitSizeCustomizationNote?: string;
  features: Omit<Feature, "_id">[];
  minRange: number;
  maxRange: number;
  measureUnit: string;
  kgsPerUnit: number;
}

// Image file type for uploads
export interface ImageFile {
  file: File;
  preview: string;
  id: string;
}
