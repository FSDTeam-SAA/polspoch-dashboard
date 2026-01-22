"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/lib/types/product";

interface ProductTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  onView,
  onDelete,
}: ProductTableProps) {
  return (
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product?._id} className="group">
                <TableCell>
                  <div className="relative h-12 w-12 rounded-md overflow-hidden border bg-muted">
                    {product?.productImage &&
                    product.productImage.length > 0 ? (
                      <Image
                        src={product.productImage[0]?.url || "/placeholder.jpg"}
                        alt={product.productName || "Product"}
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
                    <span>{product?.productName || "Unnamed Product"}</span>
                    {product?.unitSizeCustomizationNote && (
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {product.unitSizeCustomizationNote}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {product?.family
                    ? typeof product.family === "object"
                      ? product.family?.familyName || "Unknown Family"
                      : product.family
                    : "Unknown Family"}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {product?.features?.length || 0} variant
                    {(product?.features?.length || 0) !== 1 ? "s" : ""}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {product?.features && product.features.length > 0 ? (
                      <>
                        {Math.min(
                          ...(product.features.map(
                            (f) => f?.minRange || 0,
                          ) as number[]),
                        )}
                        -
                        {Math.max(
                          ...(product.features.map(
                            (f) => f?.maxRange || 0,
                          ) as number[]),
                        )}
                      </>
                    ) : (
                      "N/A"
                    )}{" "}
                    <span className="text-muted-foreground">
                      {product?.measureUnit || ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product?.availabilityNote?.toLowerCase() === "in stock"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      product?.availabilityNote?.toLowerCase() === "in stock"
                        ? "bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-200"
                        : "bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25 border-yellow-200"
                    }
                  >
                    {product?.availabilityNote || "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                      onClick={() => onView(product)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link href={`/products/edit/${product._id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      onClick={() => onDelete(product)}
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
  );
}
