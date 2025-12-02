"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useProducts } from "@/lib/hooks/useProduct";
import { Product } from "@/lib/types/product";

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: products, isLoading, error } = useProducts();

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-600">
          Error loading products: {error.message}
        </p>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product List</h1>

        <Link
          href="/products/add-product"
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Add Product
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Product Name</th>
              <th className="py-3 px-4 text-left">Family</th>
              <th className="py-3 px-4 text-left">Features</th>
              <th className="py-3 px-4 text-left">Range</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-4">
                    {product.productImage && product.productImage.length > 0 ? (
                      <Image
                        width={50}
                        height={50}
                        src={product.productImage[0].url}
                        alt={product.productName}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{product.productName}</div>
                    {product.unitSizeCustomizationNote && (
                      <div className="text-xs text-gray-500">
                        {product.unitSizeCustomizationNote}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">{product.family}</td>
                  <td className="py-3 px-4">
                    {product.features.length} variant
                    {product.features.length !== 1 ? "s" : ""}
                  </td>
                  <td className="py-3 px-4">
                    {product.minRange}-{product.maxRange} {product.measureUnit}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        product.availabilityNote === "In stock"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {product.availabilityNote || "Unknown"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => handleViewProduct(product)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected product.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-6 py-4">
              {/* Product Images */}
              {selectedProduct.productImage &&
                selectedProduct.productImage.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedProduct.productImage.map((img) => (
                      <Image
                        key={img._id}
                        src={img.url}
                        alt={selectedProduct.productName}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Product Name
                  </p>
                  <p className="font-semibold">{selectedProduct.productName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Family</p>
                  <p className="font-semibold">{selectedProduct.family}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Product ID
                  </p>
                  <p className="text-sm">{selectedProduct._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Availability
                  </p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedProduct.availabilityNote === "In stock"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedProduct.availabilityNote || "Unknown"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Range</p>
                  <p>
                    {selectedProduct.minRange}-{selectedProduct.maxRange}{" "}
                    {selectedProduct.measureUnit}
                  </p>
                </div>
                {selectedProduct.createdAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-sm">
                      {new Date(selectedProduct.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Customization Note */}
              {selectedProduct.unitSizeCustomizationNote && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Customization
                  </p>
                  <p className="text-sm">
                    {selectedProduct.unitSizeCustomizationNote}
                  </p>
                </div>
              )}

              {/* Features */}
              {selectedProduct.features &&
                selectedProduct.features.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Features & Variants
                    </p>
                    <div className="space-y-2">
                      {selectedProduct.features.map((feature, index) => (
                        <div
                          key={feature._id || index}
                          className="border rounded-lg p-3 bg-gray-50"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            {feature.reference && (
                              <div>
                                <span className="font-medium">Reference:</span>{" "}
                                {feature.reference}
                              </div>
                            )}
                            {feature.size1 && feature.size2 && (
                              <div>
                                <span className="font-medium">Size:</span>{" "}
                                {feature.size1} x {feature.size2}
                              </div>
                            )}
                            {feature.thickness && (
                              <div>
                                <span className="font-medium">Thickness:</span>{" "}
                                {feature.thickness}mm
                              </div>
                            )}
                            {feature.finishQuality && (
                              <div>
                                <span className="font-medium">Finish:</span>{" "}
                                {feature.finishQuality}
                              </div>
                            )}
                            {feature.kgsPerUnit && (
                              <div>
                                <span className="font-medium">Weight:</span>{" "}
                                {feature.kgsPerUnit} kg/unit
                              </div>
                            )}
                            {feature.miterPerUnitPrice && (
                              <div>
                                <span className="font-medium">Price:</span> $
                                {feature.miterPerUnitPrice}/unit
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
