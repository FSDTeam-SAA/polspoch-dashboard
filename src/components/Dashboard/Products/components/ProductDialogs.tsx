"use client";

import Image from "next/image";
import { Package, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/types/product";

interface ProductDialogsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  productToDelete: Product | null;
  confirmDelete: () => void;
  deletePending: boolean;
}

export function ProductDialogs({
  isModalOpen,
  setIsModalOpen,
  selectedProduct,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  productToDelete,
  confirmDelete,
  deletePending,
}: ProductDialogsProps) {
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Detailed information about{" "}
              {selectedProduct?.productName || "this product"}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="flex flex-col">
              <div className="px-6 pb-6">
                {selectedProduct.productImage &&
                selectedProduct.productImage.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedProduct.productImage.map((img) => (
                      <div
                        key={img?._id}
                        className="relative h-48 w-48 shrink-0 rounded-lg overflow-hidden border bg-muted"
                      >
                        <Image
                          src={img?.url || "/placeholder.jpg"}
                          alt={selectedProduct.productName || "Product image"}
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Family
                    </p>
                    <p className="font-semibold">
                      {selectedProduct?.family
                        ? typeof selectedProduct.family === "object"
                          ? selectedProduct.family?.familyName || "Unknown"
                          : selectedProduct.family
                        : "Unknown"}
                    </p>
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
                            ...(selectedProduct.features.map(
                              (f) => f?.minRange || 0,
                            ) as number[]),
                          )}
                          -
                          {Math.max(
                            ...(selectedProduct.features.map(
                              (f) => f?.maxRange || 0,
                            ) as number[]),
                          )}
                        </>
                      ) : (
                        "N/A"
                      )}{" "}
                      {selectedProduct.measureUnit || ""}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Weight
                    </p>
                    <p className="font-semibold">
                      {selectedProduct.features &&
                      selectedProduct.features.length > 0
                        ? `${selectedProduct.features[0]?.kgsPerUnit || "-"} kg/unit`
                        : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <Badge
                      variant={
                        selectedProduct.availabilityNote?.toLowerCase() ===
                        "in stock"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedProduct.availabilityNote || "Unknown"}
                    </Badge>
                  </div>
                </div>

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

                {selectedProduct.features &&
                  selectedProduct.features.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">
                        Features & Variants
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedProduct.features.map((feature, index) => (
                          <Card
                            key={feature?._id || index}
                            className="shadow-none border bg-card"
                          >
                            <CardContent className="p-3 text-sm space-y-2">
                              <div className="flex justify-between items-center border-b pb-2">
                                <span className="font-medium">
                                  {feature?.reference || "N/A"}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {feature?.finishQuality || "N/A"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                                <div>
                                  Size: {feature?.size1 || 0} x{" "}
                                  {feature?.size2 || 0}
                                </div>
                                <div>
                                  Thickness: {feature?.thickness || 0}mm
                                </div>
                                {feature?.miterPerUnitPrice && (
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

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="py-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {productToDelete?.productName || "this product"}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deletePending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletePending}
              className="cursor-pointer"
            >
              {deletePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
