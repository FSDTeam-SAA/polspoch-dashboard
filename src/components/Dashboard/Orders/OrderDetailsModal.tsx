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
import { Eye, ChevronLeft, Package, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface OrderDetailsModalProps {
  order: Order;
}

export default function OrderDetailsModal({ order }: OrderDetailsModalProps) {
  const cartItems = order.cartItems || [];
  const cartItemCount = cartItems.length;

  // console.log("this is my cartItems", cartItems);

  // Gather all images from cart items
  const itemImages: string[] = [];
  cartItems.forEach((item) => {
    if (item.product?.productImage) {
      item.product.productImage.forEach((img: { url: string }) =>
        itemImages.push(img.url),
      );
    } else if (item.service?.image) {
      itemImages.push(item.service.image);
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
              <DialogTitle className="flex items-center gap-2 text-xl">
                <ChevronLeft className="h-5 w-5 cursor-pointer" />
                Order Details
                <span className="text-sm font-mono text-muted-foreground ml-2">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Image & Dates */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="aspect-square relative overflow-hidden rounded-lg border bg-muted">
                    <Image
                      height={600}
                      width={600}
                      src={activeImage}
                      alt="Product Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {displayImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {displayImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(img)}
                          className={cn(
                            "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                            activeImage === img
                              ? "border-primary opacity-100"
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
                  <div className="p-3 rounded-lg border bg-muted/20">
                    <span className="text-xs text-muted-foreground block mb-1">
                      Purchase Date
                    </span>
                    <span className="text-sm font-medium">
                      {format(
                        new Date(order.purchaseDate),
                        "dd MMM yyyy, HH:mm",
                      )}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/20">
                    <span className="text-xs text-muted-foreground block mb-1">
                      Last Updated
                    </span>
                    <span className="text-sm font-medium">
                      {order.updatedAt
                        ? format(
                            new Date(order.updatedAt),
                            "dd MMM yyyy, HH:mm",
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                    <Settings className="h-4 w-4" /> Customer Information
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Name
                      </span>
                      <span className="text-sm font-medium">
                        {order.userId?.firstName} {order.userId?.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Email
                      </span>
                      <span className="text-sm font-medium">
                        {order.userId?.email}
                      </span>
                    </div>
                    {order.userId?.companyName && (
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Company
                        </span>
                        <span className="text-sm font-medium">
                          {order.userId.companyName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Order Items */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                  <Package className="h-4 w-4" /> Order Items ({cartItemCount})
                </h3>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                  {cartItems.map((item: CartItem) => {
                    const actualItem = item.cartId || item;
                    const isProduct = actualItem.type === "product";
                    const itemName = isProduct
                      ? actualItem.product?.productName
                      : actualItem.service?.templateName;

                    const itemData: Record<
                      string,
                      string | number | undefined
                    > = isProduct
                      ? {
                          Family: actualItem.product?.family || "N/A",
                          "Product Name": itemName || "N/A",
                          "Unit Size": actualItem.unitSize || "N/A",
                          "Customization Note":
                            actualItem.product?.unitSizeCustomizationNote ||
                            "N/A",
                          "Measure Unit":
                            actualItem.product?.measureUnit || "N/A",
                          Reference:
                            actualItem.selectedFeature?.reference || "N/A",
                          "Size 1": actualItem.selectedFeature?.size1 || "N/A",
                          "Size 2": actualItem.selectedFeature?.size2 || "N/A",
                          Thickness:
                            actualItem.selectedFeature?.thickness || "N/A",
                          "Finish Quality":
                            actualItem.selectedFeature?.finishQuality || "N/A",
                          "Unit Sizes": actualItem.selectedFeature?.unitSizes
                            ? actualItem.selectedFeature.unitSizes.join(", ")
                            : "N/A",
                          "Kgs per Unit":
                            actualItem.selectedFeature?.kgsPerUnit || "N/A",
                          "Miter Per Unit Price":
                            actualItem.selectedFeature?.miterPerUnitPrice ||
                            "N/A",
                          Type: actualItem.type || "N/A",
                          Quantity: actualItem.quantity || "N/A",
                          "Total Amount": actualItem.totalAmount
                            ? `€${actualItem.totalAmount.toLocaleString()}`
                            : "N/A",
                        }
                      : {
                          "Service Name": itemName || "N/A",
                          "Service Type":
                            actualItem.service?.serviceType || "N/A",
                          Diameter: actualItem.service?.diameter || "N/A",
                          "Price per Unit": actualItem.service?.price
                            ? `€${actualItem.service.price}`
                            : "N/A",
                          "Dimension Sizes": actualItem.service?.sizes
                            ? Object.entries(actualItem.service.sizes)
                                .filter(([_, v]) => v !== 0 && v !== null)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(", ")
                            : "N/A",
                          Type: actualItem.type || "N/A",
                          Quantity: actualItem.quantity || "N/A",
                          "Total Amount": actualItem.totalAmount
                            ? `€${actualItem.totalAmount.toLocaleString()}`
                            : "N/A",
                        };

                    return (
                      <div
                        key={actualItem._id}
                        className="rounded-lg border bg-muted/30 overflow-hidden p-3"
                      >
                        <div className="mb-2 font-bold text-sm flex justify-between items-center">
                          <span>{itemName || "Product/Service"}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                            {actualItem.type}
                          </span>
                        </div>
                        <table className="w-full text-[12px] border-collapse">
                          <tbody>
                            {Object.entries(itemData).map(([key, value]) => (
                              <tr
                                key={key}
                                className="border-b border-muted last:border-b-0"
                              >
                                <td className="py-1 px-2 font-medium text-muted-foreground w-1/2">
                                  {key}
                                </td>
                                <td className="py-1 px-2 font-semibold">
                                  {value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 p-6 border-t bg-muted/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Order Total:
              </span>
              <span className="text-3xl font-bold text-primary">
                €{order.totalAmount.toLocaleString()}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                (
                  document.querySelector(
                    'button[aria-label="Close"]',
                  ) as HTMLElement
                )?.click()
              }
            >
              Close Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
