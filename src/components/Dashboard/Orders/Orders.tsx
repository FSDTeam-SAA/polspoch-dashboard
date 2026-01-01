"use client";

import React, { useState } from "react";
import { useOrders } from "@/lib/hooks/useOrders";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OrderDetailsModal from "./OrderDetailsModal";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 8;

export default function Orders() {
  const { data: orders = [], isLoading, error } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);

  console.log(orders);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        {/* Box Container */}
        <div className="border border-gray-300 p-6 rounded-md shadow-sm">
          {/* Display Skeleton Loader during loading */}
          <Skeleton className="w-48 h-8 mb-4" />
          <Skeleton className="w-64 h-4 mb-8" />

          <Skeleton className="w-full h-12 mb-4" />
          {/* Orders Table Skeleton */}
          <Skeleton className="w-full h-10 mb-4" />
          <Skeleton className="w-full h-10 mb-4" />
          <Skeleton className="w-full h-10 mb-4" />
          <Skeleton className="w-full h-10 mb-4" />
          {/* Pagination Skeleton */}
          <Skeleton className="w-20 h-8" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">Failed to load orders.</div>
    );
  }

  if (!orders.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No orders found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage and view customer orders
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b">
                <th className="h-12 px-4 text-muted-foreground">Order ID</th>
                <th className="h-12 px-4 text-muted-foreground">Customer</th>
                <th className="h-12 px-4 text-muted-foreground">
                  Product/Service
                </th>
                <th className="h-12 px-4 text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-right text-muted-foreground">
                  Total
                </th>
                <th className="h-12 px-4 text-center text-muted-foreground">
                  Payment Status
                </th>
                <th className="h-12 px-4 text-center text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.map((order) => {
                const { status, paymentStatus } = order;
                let displayTitle = "Unknown Item";
                const cartItems = order.cartItems || [];

                if (cartItems.length > 0) {
                  const firstItem = cartItems[0];
                  const itemName =
                    firstItem?.type === "product"
                      ? firstItem.product?.productName
                      : firstItem?.service?.templateName;

                  if (cartItems.length === 1) {
                    displayTitle = itemName || "Order Item";
                  } else {
                    displayTitle = `${itemName || "Item"} + ${cartItems.length - 1} more`;
                  }
                }

                return (
                  <tr key={order._id} className="border-b hover:bg-muted/50">
                    {/* Order ID */}
                    <td className="p-4 font-mono font-medium">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {(order.userId?.firstName?.slice(0, 1) || "") +
                              (
                                order.userId?.lastName?.slice(0, 1) || ""
                              ).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {order.userId?.firstName} {order.userId?.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.userId?.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Product/Service */}
                    <td className="p-4">{displayTitle}</td>

                    {/* Date */}
                    <td className="p-4">
                      {format(new Date(order.purchaseDate), "dd MMM yyyy")}
                    </td>

                    {/* Total */}
                    <td className="p-4 text-right font-medium">
                      €{order.totalAmount.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "capitalize shadow-none border-none",
                          paymentStatus === "paid" &&
                            "bg-green-100 text-green-700 hover:bg-green-100",
                          paymentStatus === "unpaid" &&
                            "bg-red-100 text-red-700 hover:bg-red-100",
                          paymentStatus === "failed" &&
                            "bg-red-100 text-red-700 hover:bg-red-100",
                        )}
                      >
                        {paymentStatus}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td className="p-4 text-center">
                      <OrderDetailsModal order={order} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
