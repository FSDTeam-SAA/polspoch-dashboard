// src/lib/types/product.ts

export interface ProductImage {
  url: string;
  publickey: string;
  _id: string;
}

export interface Feature {
  reference: string;
  size1?: number;
  size2?: number;
  thickness?: number;
  finishQuality: string;

  minRange?: number;
  maxRange?: number;
  kgsPerUnit?: number;

  miterPerUnitPrice?: number;
  unitSizes?: number[];
  _id?: string;
}

export interface Family {
  _id: string;
  familyName: string;
  img?: {
    url: string;
    publickey: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  family: Family | string;
  productName: string;
  availabilityNote?: string;
  unitSizeCustomizationNote?: string;

  features: Feature[];

  productImage: ProductImage[];

  measureUnit: string;

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
  measureUnit: string;
}

// Image file type for uploads
export interface ImageFile {
  file: File;
  preview: string;
  id: string;
}
