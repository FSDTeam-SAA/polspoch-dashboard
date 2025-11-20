"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  customers: {
    Name: string;
    image: string;
    email: string;
  };
  productName: string;
  Date: string;
  Amount: number;
}

const products = [
  {
    id: "INV001",
    customers: {
      Name: "John Doe",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      email: "john.doe@example.com",
    },
    productName: "Laptop Pro",
    Date: "2023-10-26",
    Amount: 1200.0,
  },
  {
    id: "INV002",
    customers: {
      Name: "Jane Smith",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      email: "jane.smith@example.com",
    },
    productName: "Wireless Mouse",
    Date: "2023-10-25",
    Amount: 25.5,
  },
  {
    id: "INV003",
    customers: {
      Name: "Robert Johnson",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      email: "robert.j@example.com",
    },
    productName: "Mechanical Keyboard",
    Date: "2023-10-24",
    Amount: 150.0,
  },
  {
    id: "INV004",
    customers: {
      Name: "Emily White",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      email: "emily.w@example.com",
    },
    productName: "USB-C Hub",
    Date: "2023-10-23",
    Amount: 45.99,
  },
  {
    id: "INV005",
    customers: {
      Name: "Michael Brown",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      email: "michael.b@example.com",
    },
    productName: "External SSD 1TB",
    Date: "2023-10-22",
    Amount: 99.99,
  },
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-4">#{product.id}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <Image
                      width={100}
                      height={100}
                      src={product.customers.image}
                      alt={product.customers.Name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <div className="font-medium">
                        {product.customers.Name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.customers.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{product.productName}</td>
                <td className="py-3 px-4">{product.Date}</td>
                <td className="py-3 px-4">${product.Amount.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Delivered
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => handleViewProduct(product)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected product.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Image
                  src={selectedProduct.customers.image}
                  alt={selectedProduct.customers.Name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedProduct.customers.Name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedProduct.customers.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Product Name
                  </p>
                  <p>{selectedProduct.productName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Product ID
                  </p>
                  <p># {selectedProduct.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{selectedProduct.Date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p>${selectedProduct.Amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Delivered
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
