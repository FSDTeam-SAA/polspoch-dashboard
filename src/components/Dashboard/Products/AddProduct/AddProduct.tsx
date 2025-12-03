"use client";

import React from "react";
import ProductForm from "../ProductForm/ProductForm";

export default function AddProduct() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-sm text-gray-600 mt-1">
          Create a new product with images and features
        </p>
      </div>
      <ProductForm mode="add" />
    </div>
  );
}
