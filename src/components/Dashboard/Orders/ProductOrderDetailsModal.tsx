"use client";

import { Order, CartItem } from "@/types/order";
import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, ChevronLeft, Package, Settings, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ProductOrderDetailsModalProps {
  order: Order;
}

export default function ProductOrderDetailsModal({
  order,
}: ProductOrderDetailsModalProps) {
  // Filter to show only products
  const cartItems = (order.cartItems || []).filter(
    (item) => item.type === "product",
  );
  const cartItemCount = cartItems.length;

  // Gather all images from product items
  const itemImages: string[] = [];
  cartItems.forEach((item) => {
    if (item.product?.productImage) {
      item.product.productImage.forEach((img: { url: string }) =>
        itemImages.push(img.url),
      );
    }
  });

  const displayImages =
    itemImages.length > 0 ? itemImages : ["/placeholder.svg"];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const activeImage = selectedImage || displayImages[0];

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
            <span className="sr-only">View Details</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden max-h-[95vh] flex flex-col">
          <DialogHeader className="px-6 pt-6 border-b pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                Product Order Details
                <span className="text-sm font-mono text-muted-foreground ml-2">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Image & Dates */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="aspect-square relative overflow-hidden rounded-xl border bg-muted shadow-sm group">
                    <Image
                      height={600}
                      width={600}
                      src={activeImage}
                      alt="Product Preview"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {displayImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {displayImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(img)}
                          className={cn(
                            "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                            activeImage === img
                              ? "border-blue-500 ring-2 ring-blue-50 ring-offset-2"
                              : "border-transparent opacity-60 hover:opacity-100",
                          )}
                        >
                          <Image
                            height={80}
                            width={80}
                            src={img}
                            alt={`View ${index + 1}`}
                            className="h-full w-full object-cover cursor-pointer"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border bg-gray-50/50">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      Purchase Date
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {format(
                        new Date(order.purchaseDate),
                        "dd MMM yyyy, HH:mm",
                      )}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border bg-gray-50/50">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      Last Updated
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {order.updatedAt
                        ? format(
                            new Date(order.updatedAt),
                            "dd MMM yyyy, HH:mm",
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border p-5 space-y-4 bg-white shadow-sm">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-gray-800">
                    <Settings className="h-4 w-4 text-blue-500" /> Customer
                    Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-xs text-muted-foreground">
                        Name
                      </span>
                      <span className="text-sm font-semibold">
                        {order.userId?.firstName} {order.userId?.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-xs text-muted-foreground">
                        Email
                      </span>
                      <span className="text-sm font-semibold">
                        {order.userId?.email}
                      </span>
                    </div>
                    {order.userId?.companyName && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Company
                        </span>
                        <span className="text-sm font-semibold">
                          {order.userId.companyName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Order Items */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" /> Order Items (
                  {cartItemCount})
                </h3>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                  {cartItems.map((item: CartItem) => {
                    const actualItem = item.cartId || item;
                    const itemName = actualItem.product?.productName;

                    const itemData = {
                      Family: actualItem.product?.family || "N/A",
                      "Unit Size": actualItem.unitSize || "N/A",
                      "Measure Unit": actualItem.product?.measureUnit || "N/A",
                      Reference: actualItem.selectedFeature?.reference || "N/A",
                      "Size 1": actualItem.selectedFeature?.size1 || "N/A",
                      "Size 2": actualItem.selectedFeature?.size2 || "N/A",
                      Thickness: actualItem.selectedFeature?.thickness || "N/A",
                      "Finish Quality":
                        actualItem.selectedFeature?.finishQuality || "N/A",
                      Quantity: actualItem.quantity || "N/A",
                      "Total Amount": actualItem.totalAmount
                        ? `€${actualItem.totalAmount.toLocaleString()}`
                        : "N/A",
                    };

                    return (
                      <div
                        key={actualItem._id}
                        className="rounded-xl border bg-white shadow-sm overflow-hidden border-l-4 border-l-blue-500"
                      >
                        <div className="p-4 bg-gray-50/50 border-b">
                          <div className="font-bold text-gray-900 flex justify-between items-center">
                            <span>{itemName || "Product"}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold uppercase">
                              Product
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <table className="w-full text-[12px] border-collapse">
                            <tbody>
                              {Object.entries(itemData).map(([key, value]) => (
                                <tr
                                  key={key}
                                  className="border-b border-gray-50 last:border-b-0"
                                >
                                  <td className="py-2 px-1 text-gray-500 w-1/2">
                                    {key}
                                  </td>
                                  <td className="py-2 px-1 font-bold text-gray-900 text-right">
                                    {value}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 p-6 border-t bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                Total Payment:
              </span>
              <span className="text-3xl font-black text-gray-900">
                €{order.totalAmount.toLocaleString()}
              </span>
            </div>
            <Button
              className="bg-gray-900 text-white hover:bg-gray-800 px-8 rounded-lg"
              onClick={() =>
                (
                  document.querySelector(
                    'button[aria-label="Close"]',
                  ) as HTMLElement
                )?.click()
              }
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
