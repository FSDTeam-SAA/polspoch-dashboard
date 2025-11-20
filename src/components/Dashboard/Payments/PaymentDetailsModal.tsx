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
  const [activeImage, setActiveImage] = useState(payment.productImages[0]);
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
                  alt={payment.productName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {payment.productImages.map((img: string, index: number) => (
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
                  {payment.productName}
                </h2>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {payment.description}
                </p>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Longest Side (mm)
                  </label>
                  <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium border">
                    {payment.specifications.longestSide}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Shortest Side (mm)
                  </label>
                  <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium border">
                    {payment.specifications.shortestSide}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Thickness
                  </label>
                  <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium border">
                    {payment.specifications.thickness}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Long
                  </label>
                  <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium border">
                    {payment.specifications.long}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Finish
                  </label>
                  <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium border">
                    {payment.specifications.finish}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Quality
                  </label>
                  <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium border">
                    {payment.specifications.quality}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Manufacturing process
                </label>
                <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium border">
                  {payment.specifications.manufacturingProcess}
                </div>
              </div>

              {/* Footer Price & Status */}
              <div className="flex items-center justify-between pt-4 border-t mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">Total Price:</span>
                  <span className="text-3xl font-bold text-primary">
                    €{payment.amount}
                  </span>
                </div>
                <Badge
                  variant={
                    payment.status === "Paid"
                      ? "default"
                      : payment.status === "Pending"
                        ? "secondary"
                        : "destructive"
                  }
                  className={cn(
                    "px-4 py-1 text-base",
                    payment.status === "Paid" &&
                      "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border-green-200",
                    payment.status === "Pending" &&
                      "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800 border-yellow-200",
                    payment.status === "Unpaid" &&
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
