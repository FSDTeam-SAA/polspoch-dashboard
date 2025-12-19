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
import Link from "next/link";
import { useProducts } from "@/lib/hooks/useProduct";
import { Product } from "@/lib/types/product";
import {
  Plus,
  Search,
  MoreHorizontal,
  Package,
  Eye,
  Edit,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products, isLoading, error } = useProducts();

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = products?.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button className="shadow-sm cursor-pointer">
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Family</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="t">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product._id} className="group">
                      <TableCell>
                        <div className="relative h-12 w-12 rounded-md overflow-hidden border bg-muted">
                          {product.productImage &&
                          product.productImage.length > 0 ? (
                            <Image
                              src={product.productImage[0].url}
                              alt={product.productName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                              <Package className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{product.productName}</span>
                          {product.unitSizeCustomizationNote && (
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {product.unitSizeCustomizationNote}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{product.family}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {product.features.length} variant
                          {product.features.length !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {product.features.length > 0 ? (
                            <>
                              {Math.min(
                                ...product.features.map((f) => f.minRange)
                              )}
                              -
                              {Math.max(
                                ...product.features.map((f) => f.maxRange)
                              )}
                            </>
                          ) : (
                            "N/A"
                          )}{" "}
                          <span className="text-muted-foreground">
                            {product.measureUnit}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.availabilityNote === "In stock"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            product.availabilityNote === "In stock"
                              ? "bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-200"
                              : "bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25 border-yellow-200"
                          }
                        >
                          {product.availabilityNote || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 group-hover:opacity-100 bg-red-600/15 cursor-pointer hover:bg-red-600/50 hover:text-white transition-opacity"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleViewProduct(product)}
                              className="cursor-pointer hover:bg-red-600/50 hover:text-white"
                            >
                              <Eye className="mr-2 h-4 w-4 " />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Link href={`/products/edit/${product._id}`}>
                              <DropdownMenuItem className="cursor-pointer hover:bg-red-600/50 hover:text-white">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Product
                              </DropdownMenuItem>
                            </Link>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedProduct?.productName}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="flex flex-col">
              {/* Product Images Carousel/Grid */}
              <div className="px-6 pb-6">
                {selectedProduct.productImage &&
                selectedProduct.productImage.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedProduct.productImage.map((img) => (
                      <div
                        key={img._id}
                        className="relative h-48 w-48 shrink-0 rounded-lg overflow-hidden border bg-muted"
                      >
                        <Image
                          src={img.url}
                          alt={selectedProduct.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-48 w-full rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
                    <Package className="h-12 w-12 opacity-50" />
                  </div>
                )}
              </div>

              <div className="p-6 pt-0 space-y-6">
                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Family
                    </p>
                    <p className="font-semibold">{selectedProduct.family}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Range
                    </p>
                    <p className="font-semibold">
                      {selectedProduct.features &&
                      selectedProduct.features.length > 0 ? (
                        <>
                          {Math.min(
                            ...selectedProduct.features.map((f) => f.minRange)
                          )}
                          -
                          {Math.max(
                            ...selectedProduct.features.map((f) => f.maxRange)
                          )}
                        </>
                      ) : (
                        "N/A"
                      )}{" "}
                      {selectedProduct.measureUnit}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Weight
                    </p>
                    <p className="font-semibold">
                      {selectedProduct.features &&
                      selectedProduct.features.length > 0
                        ? `${selectedProduct.features[0].kgsPerUnit} kg/unit` // Showing first variant's weight or maybe range if needed
                        : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <Badge
                      variant={
                        selectedProduct.availabilityNote === "In stock"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedProduct.availabilityNote || "Unknown"}
                    </Badge>
                  </div>
                </div>

                {/* Customization Note */}
                {selectedProduct.unitSizeCustomizationNote && (
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm font-medium mb-1">
                      Customization Note
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.unitSizeCustomizationNote}
                    </p>
                  </div>
                )}

                {/* Features List */}
                {selectedProduct.features &&
                  selectedProduct.features.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">
                        Features & Variants
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedProduct.features.map((feature, index) => (
                          <Card
                            key={feature._id || index}
                            className="shadow-none border bg-card"
                          >
                            <CardContent className="p-3 text-sm space-y-2">
                              <div className="flex justify-between items-center border-b pb-2">
                                <span className="font-medium">
                                  {feature.reference}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {feature.finishQuality}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                                <div>
                                  Size: {feature.size1} x {feature.size2}
                                </div>
                                <div>Thickness: {feature.thickness}mm</div>
                                {feature.miterPerUnitPrice && (
                                  <div className="col-span-2 text-foreground font-medium">
                                    ${feature.miterPerUnitPrice}/unit
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
