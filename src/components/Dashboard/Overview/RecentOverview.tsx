// src/components/Dashboard/Overview/RecentOverview.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useOrders } from "@/lib/hooks/useOrders";
import { useProducts } from "@/lib/hooks/useProduct";
import { Loader2 } from "lucide-react";

export default function RecentOverview() {
  const { data: orders, isLoading: isLoadingOrders } = useOrders();
  const { data: productsData, isLoading: isLoadingProducts } = useProducts();

  const statusBadge = (status: string) => {
    // Normalize status for comparison logic, but display original text
    const lowerStatus = status?.toLowerCase() || "";
    const isSuccess =
      lowerStatus === "paid" ||
      lowerStatus === "in stock" ||
      lowerStatus === "completed";

    const color = isSuccess
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

    return (
      <Badge className={`${color} px-3 py-1 rounded-lg capitalize`}>
        {status || "Unknown"}
      </Badge>
    );
  };

  if (isLoadingOrders || isLoadingProducts) {
    return (
      <div className="flex justify-center items-center w-full h-40">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  // Slice to show only recent items (e.g., top 5)
  const recentOrders = orders?.slice(0, 5) || [];
  const recentProducts = productsData?.slice(0, 5) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-semibold">Recent Order</CardTitle>
          <Link
            href={"/orders"}
            className="text-sm text-green-600 cursor-pointer"
          >
            {" "}
            View all{" "}
          </Link>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 text-left">INVOICE</th>
                  <th className="py-2 text-left">Item</th>
                  <th className="py-2 text-left">Product Amount</th>
                  <th className="py-2 text-left">Total Price</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((row) => {
                    // Determine the main item name to display
                    const mainItem = row.cartItems?.[0];
                    const actualItem = mainItem?.cartId || mainItem;
                    const itemName =
                      actualItem?.product?.productId?.productName ||
                      actualItem?.product?.productName ||
                      actualItem?.serviceData?.serviceType ||
                      actualItem?.service?.templateName ||
                      "Mixed Items";

                    return (
                      <tr key={row._id} className="border-b last:border-none">
                        <td className="py-3 font-medium">
                          #{row._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="truncate max-w-[150px]" title={itemName}>
                          {itemName}
                        </td>
                        <td>{row.cartItems.length} Items</td>
                        <td>${row.totalAmount?.toFixed(2)}</td>
                        <td>{statusBadge(row.paymentStatus)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* All Products */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-semibold">All Products</CardTitle>
          <Link
            href={"/products"}
            className="text-sm text-green-600 cursor-pointer"
          >
            {" "}
            View all{" "}
          </Link>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 text-left">Item</th>
                  <th className="py-2 text-left">Unit</th>
                  <th className="py-2 text-left">Price</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.length > 0 ? (
                  recentProducts.map((row) => {
                    // Try to find a price from features, else N/A
                    const price = row.features?.[0]?.miterPerUnitPrice
                      ? `$${row.features[0].miterPerUnitPrice}`
                      : "N/A";

                    return (
                      <tr key={row._id} className="border-b last:border-none">
                        <td className="py-3 font-medium">{row.productName}</td>
                        <td>{row.measureUnit}</td>
                        <td>{price}</td>
                        <td>
                          {statusBadge(row.availabilityNote || "Unknown")}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
