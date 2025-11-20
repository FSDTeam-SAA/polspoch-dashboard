"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import PaymentDetailsModal from "./PaymentDetailsModal";

// Mock Data
const FAKE_PAYMENTS = Array.from({ length: 25 }).map((_, i) => ({
  id: `INV-${1000 + i}`,
  customer: {
    name: [
      "Alice Johnson",
      "Bob Smith",
      "Charlie Brown",
      "Diana Prince",
      "Evan Wright",
      "Fiona Gallagher",
      "George Miller",
      "Hannah Scott",
      "Ian Malcolm",
      "Julia Roberts",
    ][i % 10],
    email: `user${i + 1}@example.com`,
    image: `https://i.pravatar.cc/150?u=${i + 100}`,
  },
  productName: [
    "Premium Wireless Headphones",
    "Ergonomic Office Chair",
    "4K Ultra HD Monitor",
    "Mechanical Gaming Keyboard",
    "Smart Home Security Camera",
  ][i % 5],
  date: new Date(2023, i % 12, (i % 28) + 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  amount: (Math.random() * 500 + 50).toFixed(2),
  status: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Pending" : "Unpaid",
  description:
    "Experience the ultimate in comfort and performance with this top-tier product. Designed for professionals and enthusiasts alike.",
  productImages: [
    `https://picsum.photos/id/${10 + i}/600/400`,
    `https://picsum.photos/id/${20 + i}/600/400`,
    `https://picsum.photos/id/${30 + i}/600/400`,
    `https://picsum.photos/id/${40 + i}/600/400`,
    `https://picsum.photos/id/${40 + i}/600/400`,
  ],
  specifications: {
    longestSide: Math.floor(Math.random() * 20) + 10,
    shortestSide: Math.floor(Math.random() * 20) + 10,
    thickness: Math.floor(Math.random() * 20) + 10,
    long: Math.floor(Math.random() * 20) + 10,
    finish: ["Sendzimir Galvanized", "Polished", "Matte", "Brushed"][i % 4],
    quality: ["E220", "S355", "A100", "Premium"][i % 4],
    manufacturingProcess: ["Soldier", "Welded", "Cast", "Forged"][i % 4],
  },
}));

const ITEMS_PER_PAGE = 8;

export default function Payments() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(FAKE_PAYMENTS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPayments = FAKE_PAYMENTS.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <div className="text-sm text-muted-foreground">
          Manage your payment records
        </div>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Invoice
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Product
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Date
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                  Amount
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">
                  Status
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {currentPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle font-medium">{payment.id}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={payment.customer.image}
                          alt={payment.customer.name}
                        />
                        <AvatarFallback>
                          {payment.customer.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {payment.customer.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {payment.customer.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">{payment.productName}</td>
                  <td className="p-4 align-middle">{payment.date}</td>
                  <td className="p-4 align-middle text-right">
                    ${payment.amount}
                  </td>
                  <td className="p-4 align-middle text-center">
                    <Badge
                      variant={
                        payment.status === "Paid"
                          ? "default"
                          : payment.status === "Pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className={cn(
                        payment.status === "Paid" &&
                          "bg-green-500 hover:bg-green-600",
                        payment.status === "Pending" &&
                          "bg-yellow-500 hover:bg-yellow-600 text-white"
                      )}
                    >
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle text-center">
                    <PaymentDetailsModal payment={payment} />
                  </td>
                </tr>
              ))}
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
