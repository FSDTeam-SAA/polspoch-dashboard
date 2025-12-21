"use client";

import React, { useState } from "react";
import { useOrders } from "@/lib/hooks/useOrders";
import { Order } from "@/types/order";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Package, User, Mail, Building, Calendar } from "lucide-react";

export default function Orders() {
  const { data: orders, isLoading, error } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-slate-200"></div>
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg m-6">
        <p className="font-semibold">Error loading orders</p>
        <p className="text-sm">{(error as Error).message}</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return "default"; // Usually black/primary in shadcn, or could use custom green class
      case "pending":
      case "processing":
        return "secondary";
      case "cancelled":
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    return status === "paid" ? "default" : "destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage and view customer orders.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            A list of all orders including customer details and payment status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders?.map((order) => (
                    <TableRow
                      key={order._id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-mono font-medium">
                        #{order._id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {order.userId?.firstName} {order.userId?.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {order.userId?.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(order.purchaseDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getPaymentBadgeVariant(order.paymentStatus)}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${order.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between mr-8">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                Order
                <span className="font-mono text-primary">
                  #{selectedOrder?._id.slice(-6).toUpperCase()}
                </span>
              </DialogTitle>
              <div className="flex gap-2">
                <Badge
                  variant={getStatusColor(selectedOrder?.status || "")}
                  className="text-sm px-3 py-1"
                >
                  {selectedOrder?.status?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Customer & Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" /> Customer Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg">
                        {selectedOrder.userId?.firstName}{" "}
                        {selectedOrder.userId?.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />{" "}
                        {selectedOrder.userId?.email}
                      </span>
                      {selectedOrder.userId?.companyName && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" />{" "}
                          {selectedOrder.userId?.companyName}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Package className="h-4 w-4" /> Order Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Order Date
                        </span>
                        <span className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(
                            selectedOrder.purchaseDate
                          ).toLocaleDateString(undefined, {
                            dateStyle: "long",
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Payment Status
                        </span>
                        <Badge
                          variant={getPaymentBadgeVariant(
                            selectedOrder.paymentStatus
                          )}
                          className="mt-1"
                        >
                          {selectedOrder.paymentStatus.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Service / Product</TableHead>
                        <TableHead>Configuration</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.cartItems?.map((item, idx) => {
                        // Safely access nested properties
                        const service = item?.cartId?.service;

                        // Fallback if data is malformed or missing
                        if (!service) return null;

                        const qty = item?.cartId?.quantity || 0;
                        const price = service.price || 0;

                        return (
                          <TableRow key={item._id || idx}>
                            <TableCell>
                              <div className="font-medium">
                                {service.templateName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {service.serviceType}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs space-y-1">
                                <div className="font-mono">
                                  Dia: {service.diameter}mm
                                </div>
                                <div className="flex gap-1 flex-wrap">
                                  {Object.entries(service.sizes || {}).map(
                                    ([sched, size]) =>
                                      size ? (
                                        <Badge
                                          key={sched}
                                          variant="outline"
                                          className="text-[10px] h-5 px-1"
                                        >
                                          {sched}: {size}
                                        </Badge>
                                      ) : null
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-mono">
                              {qty}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              ${price.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-semibold font-mono">
                              ${(qty * price).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Footer Totals */}
              <div className="flex justify-end pt-4">
                <div className="w-full md:w-1/3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$0.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Grand Total</span>
                    <span>${selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-start">
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
