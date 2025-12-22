"use client";
import { Payment } from "@/lib/types/payments";
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
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PaymentDetailsModal({ payment }: { payment: Payment }) {
  const order = payment.orderId;
  const isProductOrder = order.type === "product" && !!order.product;
  const product = order.product?.productId;
  const selectedFeature = order.selectedFeature;

  const cartItems = order.cartItems || [];
  const cartItemCount = cartItems.length;

  const productName = isProductOrder
    ? product?.productName || "Unknown Product"
    : cartItemCount > 0
      ? `Cart Order (${cartItemCount} item${cartItemCount > 1 ? "s" : ""})`
      : "Cart Order";

  const description = isProductOrder
    ? product?.unitSizeCustomizationNote || "Standard product order"
    : "Multiple items from cart browser";

  const productImages =
    isProductOrder && product?.productImage?.length
      ? product.productImage.map((img) => img.url)
      : payment.orderId.type === "cart"
        ? (cartItems
            .map(
              (item) => item.cartId?.product?.productId?.productImage?.[0]?.url
            )
            .filter(Boolean) as string[])
        : ["/placeholder.svg"];

  // Ensure at least one image exists
  if (productImages.length === 0) productImages.push("/placeholder.svg");

  const [activeImage, setActiveImage] = useState(productImages[0]);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Eye className="h-4 w-4" />
            <span className="sr-only">View Details</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ChevronLeft className="h-5 w-5 cursor-pointer" />
              Payment Details
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left Column: Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-lg border bg-muted">
                <Image
                  height={600}
                  width={600}
                  src={activeImage}
                  alt={productName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                      activeImage === img
                        ? "border-primary opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
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
            </div>

            {/* Right Column: Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {productName}
                </h2>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Specifications Grid or Cart Items */}
              {isProductOrder && selectedFeature ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Size 1 (mm)
                    </label>
                    <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium border">
                      {selectedFeature.size1}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Size 2 (mm)
                    </label>
                    <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium border">
                      {selectedFeature.size2}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Thickness
                    </label>
                    <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium border">
                      {selectedFeature.thickness}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Finish/Quality
                    </label>
                    <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium border">
                      {selectedFeature.finishQuality}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Reference
                    </label>
                    <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium border">
                      {selectedFeature.reference}
                    </div>
                  </div>
                </div>
              ) : cartItems.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Order Items
                  </h3>
                  <div className="grid gap-3 max-h-[280px] overflow-y-auto pr-2">
                    {cartItems.map((item, idx) => {
                      const detail = item.cartId;
                      if (!detail) return null;

                      const itemName =
                        detail.type === "product"
                          ? detail.product?.productId?.productName
                          : detail.service?.templateName;

                      return (
                        <div
                          key={detail._id || idx}
                          className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-sm leading-none">
                              {itemName || "Unknown Item"}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {detail.type} • Qty: {detail.quantity}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-foreground">
                            €{detail.totalAmount?.toLocaleString() ?? "0"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <p className="text-sm text-muted-foreground">
                    This payment is for a cart order containing multiple items.
                    Individual details are available in the Orders section.
                  </p>
                </div>
              )}

              {/* Footer Price & Status */}
              <div className="flex items-center justify-between pt-4 border-t mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">Total Paid:</span>
                  <span className="text-3xl font-bold text-primary">
                    €{payment.amount}
                  </span>
                </div>
                <Badge
                  variant={
                    payment.status === "success" ? "default" : "destructive"
                  }
                  className={cn(
                    "px-4 py-1 text-base capitalize",
                    payment.status === "success" &&
                      "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border-green-200",
                    payment.status !== "success" &&
                      "bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 border-red-200"
                  )}
                >
                  {payment.status}
                </Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
