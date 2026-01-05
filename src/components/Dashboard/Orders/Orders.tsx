"use client";

import React, { useState, useMemo } from "react";
import { useOrders } from "@/lib/hooks/useOrders";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OrderDetailsModal from "./OrderDetailsModal";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@/types/order";

const ITEMS_PER_PAGE = 8;

export default function Orders() {
  const { data: orders = [], isLoading, error } = useOrders();
  const [activeTab, setActiveTab] = useState("services");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter orders based on item types in their cart
  const filteredOrders = useMemo(() => {
    if (activeTab === "services") {
      return orders.filter((order: Order) =>
        order.cartItems?.some((item) => {
          const actualItem = item.cartId || item;
          return actualItem.type === "service";
        }),
      );
    } else {
      return orders.filter((order: Order) =>
        order.cartItems?.some((item) => {
          const actualItem = item.cartId || item;
          return actualItem.type === "product";
        }),
      );
    }
  }, [orders, activeTab]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset page on tab switch
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="border border-gray-300 p-6 rounded-md shadow-sm">
          <Skeleton className="w-48 h-8 mb-4" />
          <Skeleton className="w-64 h-4 mb-8" />
          <Skeleton className="w-full h-12 mb-4" />
          <Skeleton className="w-full h-10 mb-4" />
          <Skeleton className="w-full h-10 mb-4" />
          <Skeleton className="w-full h-10 mb-4" />
          <Skeleton className="w-full h-10 mb-4" />
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

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 border-none p-0">
          <div className="rounded-md border bg-card shadow-sm overflow-hidden">
            <div className="relative w-full overflow-auto">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No {activeTab} orders found.
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-muted-foreground whitespace-nowrap">
                        Order ID
                      </th>
                      <th className="h-12 px-4 text-muted-foreground whitespace-nowrap">
                        Customer
                      </th>
                      <th className="h-12 px-4 text-muted-foreground whitespace-nowrap">
                        {activeTab === "services"
                          ? "Service Details"
                          : "Product Details"}
                      </th>
                      <th className="h-12 px-4 text-muted-foreground whitespace-nowrap">
                        Date
                      </th>
                      <th className="h-12 px-4 text-right text-muted-foreground whitespace-nowrap">
                        Total
                      </th>
                      <th className="h-12 px-4 text-center text-muted-foreground whitespace-nowrap">
                        Payment Status
                      </th>
                      <th className="h-12 px-4 text-center text-muted-foreground whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentOrders.map((order) => {
                      const { paymentStatus } = order;
                      let displayTitle = "Unknown Item";
                      const cartItems = order.cartItems || [];

                      // Filter items of the current tab type to show in title
                      const relevantItems = cartItems.filter((item) => {
                        const actualItem = item.cartId || item;
                        return (
                          (activeTab === "services" &&
                            actualItem.type === "service") ||
                          (activeTab === "products" &&
                            actualItem.type === "product")
                        );
                      });

                      if (relevantItems.length > 0) {
                        const firstItemRaw = relevantItems[0];
                        const firstItem = firstItemRaw.cartId || firstItemRaw;

                        const itemName =
                          firstItem?.type === "product"
                            ? // Handle potential nested productId structure
                              firstItem.product?.productId?.productName ||
                              firstItem.product?.productName
                            : firstItem?.service?.templateName;

                        if (relevantItems.length === 1) {
                          displayTitle = itemName || "Order Item";
                        } else {
                          displayTitle = `${itemName || "Item"} + ${relevantItems.length - 1} more`;
                        }
                      }

                      return (
                        <tr
                          key={order._id}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-4 font-mono font-medium whitespace-nowrap">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-[10px]">
                                  {(order.userId?.firstName?.slice(0, 1) ||
                                    "") +
                                    (
                                      order.userId?.lastName?.slice(0, 1) || ""
                                    ).toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="font-medium truncate max-w-[150px]">
                                  {order.userId?.firstName}{" "}
                                  {order.userId?.lastName}
                                </div>
                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {order.userId?.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 max-w-[200px]">
                            <div className="truncate font-medium">
                              {displayTitle}
                            </div>
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            {format(
                              new Date(order.purchaseDate),
                              "dd MMM yyyy",
                            )}
                          </td>

                          <td className="p-4 text-right font-medium whitespace-nowrap">
                            €{order.totalAmount.toLocaleString()}
                          </td>

                          <td className="p-4 text-center">
                            <Badge
                              variant="secondary"
                              className={cn(
                                "capitalize shadow-none border-none text-[10px] h-5",
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

                          <td className="p-4 text-center">
                            <OrderDetailsModal
                              order={order}
                              filterType={activeTab as "services" | "products"}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {totalPages > 1 && (
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
