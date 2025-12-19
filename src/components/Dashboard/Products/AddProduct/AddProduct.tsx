"use client";

import React from "react";
import ProductForm from "../ProductForm/ProductForm";

export default function AddProduct() {
  return (
    <div className="p-6">
      <ProductForm mode="add" />
    </div>
  );
}
