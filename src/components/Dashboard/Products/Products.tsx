"use client";

import { Plus, Search, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Hooks
import { useProductDashboard } from "./hooks/useProductDashboard";

// Components
import { ProductTable } from "./components/ProductTable";
import { ProductPagination } from "./components/ProductPagination";
import { ProductDialogs } from "./components/ProductDialogs";

export default function Products() {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    products,
    totalPages,
    isLoading,
    isFetching,
    error,
    selectedProduct,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    productToDelete,
    handleViewProduct,
    handleDeleteClick,
    confirmDelete,
    deletePending,
  } = useProductDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-destructive gap-2">
        <AlertCircle className="h-8 w-8" />
        <p className="text-lg font-medium">Error loading products</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog and inventory.
          </p>
        </div>
        <Link href="/products/add-product">
          <Button className="shadow-sm cursor-pointer bg-[#7E1800] hover:bg-[#8B2000]">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Products</CardTitle>
              <CardDescription>
                A list of all products in your store including their name,
                family, and status.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProductTable
            products={products}
            onView={handleViewProduct}
            onDelete={handleDeleteClick}
          />

          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
            isFetching={isFetching}
          />
        </CardContent>
      </Card>

      <ProductDialogs
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedProduct={selectedProduct}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        productToDelete={productToDelete}
        confirmDelete={confirmDelete}
        deletePending={deletePending}
      />
    </div>
  );
}
