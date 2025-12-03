"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/Dashboard/Products/ProductForm/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
        <p className="text-sm text-gray-600 mt-1">
          Update product information, images, and features
        </p>
      </div>
      <ProductForm mode="edit" productId={productId} />
    </div>
  );
}
