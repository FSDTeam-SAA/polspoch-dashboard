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
import { Eye, ChevronLeft, Package, Settings, Ship } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ServiceOrderDetailsModalProps {
  order: Order;
}

export default function ServiceOrderDetailsModal({
  order,
}: ServiceOrderDetailsModalProps) {
  // Filter to show only services
  const cartItems = (order.cartItems || []).filter(
    (item) => item.type === "service",
  );
  const cartItemCount = cartItems.length;

  // Gather all images from service items
  const itemImages: string[] = [];
  cartItems.forEach((item) => {
    if (item.service?.image) {
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
              <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Ship className="h-6 w-6 text-orange-600" />
                </div>
                Service Request Details
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
                      alt="Service Preview"
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
                              ? "border-orange-500 ring-2 ring-orange-50 ring-offset-2"
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
                      Request Date
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
                    <Settings className="h-4 w-4 text-orange-500" /> Customer
                    Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-xs text-muted-foreground">
                        Customer Name
                      </span>
                      <span className="text-sm font-semibold">
                        {order.userId?.firstName} {order.userId?.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-xs text-muted-foreground">
                        Email Address
                      </span>
                      <span className="text-sm font-semibold">
                        {order.userId?.email}
                      </span>
                    </div>
                    {order.userId?.companyName && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Organization
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
                  <Package className="h-4 w-4 text-orange-500" /> Service Items
                  ({cartItemCount})
                </h3>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                  {cartItems.map((item: CartItem) => {
                    const actualItem = item.cartId || item;
                    const itemName = actualItem.service?.templateName;

                    const itemData = {
                      "Service Name": itemName || "N/A",
                      "Service Type": actualItem.service?.serviceType || "N/A",
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
                      Quantity: actualItem.quantity || "N/A",
                      "Total Amount": actualItem.totalAmount
                        ? `€${actualItem.totalAmount.toLocaleString()}`
                        : "N/A",
                    };

                    return (
                      <div
                        key={actualItem._id}
                        className="rounded-xl border bg-white shadow-sm overflow-hidden border-l-4 border-l-orange-500"
                      >
                        <div className="p-4 bg-gray-50/50 border-b">
                          <div className="font-bold text-gray-900 flex justify-between items-center">
                            <span>{itemName || "Service"}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold uppercase">
                              Service
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
                Service Cost:
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
