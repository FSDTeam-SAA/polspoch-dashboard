"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

// Fake Data
const FAKE_CUSTOMERS = Array.from({ length: 25 }).map((_, i) => ({
  id: `USR-${1000 + i}`,
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
  image: `https://i.pravatar.cc/150?u=${i}`,
  location: [
    "New York, USA",
    "London, UK",
    "Berlin, DE",
    "Tokyo, JP",
    "Paris, FR",
  ][i % 5],
  totalOrder: Math.floor(Math.random() * 50) + 1,
  totalSpend: (Math.random() * 5000 + 100).toFixed(2),
  phone: "+1 (555) 000-0000",
  joinDate: "2023-01-15",
  status: i % 3 === 0 ? "Active" : "Inactive",
}));

const ITEMS_PER_PAGE = 8;

export default function Customer() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(FAKE_CUSTOMERS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCustomers = FAKE_CUSTOMERS.slice(
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
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <div className="text-sm text-muted-foreground">
          Manage your customer base
        </div>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  User Id
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Location
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                  Total Order
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                  Total Spend
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {currentCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle font-medium">
                    #{customer.id}
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={customer.image} alt={customer.name} />
                        <AvatarFallback>
                          {customer.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{customer.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {customer.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{customer.location}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right">
                    {customer.totalOrder}
                  </td>
                  <td className="p-4 align-middle text-right">
                    ${customer.totalSpend}
                  </td>
                  <td className="p-4 align-middle text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Customer Details</DialogTitle>
                          <DialogDescription>
                            Detailed information about {customer.name}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24">
                              <AvatarImage
                                src={customer.image}
                                alt={customer.name}
                              />
                              <AvatarFallback className="text-2xl">
                                {customer.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                              <h3 className="text-xl font-semibold">
                                {customer.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {customer.email}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4 border-t pt-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground">
                                User ID
                              </span>
                              <span className="font-medium text-sm">
                                # {customer.id}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground">
                                Phone
                              </span>
                              <span className="font-medium text-sm">
                                {customer.phone}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground">
                                Location
                              </span>
                              <span className="font-medium text-sm">
                                {customer.location}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground">
                                Join Date
                              </span>
                              <span className="font-medium text-sm">
                                {customer.joinDate}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground">
                                Total Orders
                              </span>
                              <span className="font-medium text-sm">
                                {customer.totalOrder}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground">
                                Total Spend
                              </span>
                              <span className="font-medium text-sm">
                                ${customer.totalSpend}
                              </span>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
