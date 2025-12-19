"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/Dashboard/Products/ProductForm/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  return (
    <div className="p-6">
      <ProductForm mode="edit" productId={productId} />
    </div>
  );
}
