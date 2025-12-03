"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProductForm } from "@/lib/hooks/useProductForm";
import { ProductFormValues } from "@/lib/schemas/productSchema";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import ImageUploader from "./ImageUploader";
import FeatureForm from "./FeatureForm";
import { Separator } from "@/components/ui/separator";

interface ProductFormProps {
  mode: "add" | "edit";
  productId?: string;
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const { form, handleSubmit, isLoading, isLoadingProduct, productData } =
    useProductForm({ mode, productId });

  const {
    imageFiles,
    existingImages,
    isUploading,
    addImages,
    removeImageFile,
    removeExistingImage,
    getAllImageData,
  } = useImageUpload(productData?.productImage || []);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    control,
    reset,
  } = form;

  // Reset form when product data is loaded
  useEffect(() => {
    if (productData && mode === "edit") {
      reset({
        productName: productData.productName,
        family: productData.family,
        availabilityNote: productData.availabilityNote || "",
        unitSizeCustomizationNote: productData.unitSizeCustomizationNote || "",
        minRange: productData.minRange,
        maxRange: productData.maxRange,
        measureUnit: productData.measureUnit,
        kgsPerUnit: productData.kgsPerUnit,
        features: productData.features.map((f) => ({
          reference: f.reference,
          size1: f.size1,
          size2: f.size2,
          thickness: f.thickness,
          finishQuality: f.finishQuality,
          miterPerUnitPrice: f.miterPerUnitPrice,
          unitSizes: f.unitSizes,
        })),
      });
    }
  }, [productData, mode, reset]);

  const onSubmit = handleFormSubmit((data: ProductFormValues) => {
    const { files } = getAllImageData();
    handleSubmit(data, files);
  });

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "add" ? "Add New Product" : "Edit Product"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "add"
                ? "Create a new product in your catalog"
                : `Update details for ${productData?.productName || "product"}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/products")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4 cursor-pointer" />
                {mode === "add" ? "Create Product" : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
              <CardDescription>
                Essential information about the product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="productName">
                    Product Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="productName"
                    {...register("productName")}
                    placeholder="e.g., White Marble Tile"
                  />
                  {errors.productName && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.productName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="family">
                    Family <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="family"
                    {...register("family")}
                    placeholder="e.g., Tiles, Stone"
                  />
                  {errors.family && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.family.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availabilityNote">Availability Status</Label>
                <Input
                  id="availabilityNote"
                  {...register("availabilityNote")}
                  placeholder="e.g., In stock, Pre-order only"
                />
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card>
            <CardContent className="pt-6">
              <FeatureForm control={control} errors={errors} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Side Info */}
        <div className="space-y-8">
          {/* Specifications Card */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
              <CardDescription>Dimensions and measurements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minRange">
                    Min Range <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="minRange"
                    type="number"
                    step="0.01"
                    {...register("minRange")}
                    placeholder="0"
                  />
                  {errors.minRange && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.minRange.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxRange">
                    Max Range <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="maxRange"
                    type="number"
                    step="0.01"
                    {...register("maxRange")}
                    placeholder="0"
                  />
                  {errors.maxRange && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.maxRange.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="measureUnit">
                  Measure Unit <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="measureUnit"
                  {...register("measureUnit")}
                  placeholder="e.g., sqft, m2"
                />
                {errors.measureUnit && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.measureUnit.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="kgsPerUnit">
                  Weight (kg/unit) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="kgsPerUnit"
                  type="number"
                  step="0.01"
                  {...register("kgsPerUnit")}
                  placeholder="0.00"
                />
                {errors.kgsPerUnit && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.kgsPerUnit.message}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="unitSizeCustomizationNote">
                  Customization Note
                </Label>
                <Input
                  id="unitSizeCustomizationNote"
                  {...register("unitSizeCustomizationNote")}
                  placeholder="Details about custom sizes"
                />
              </div>
            </CardContent>
          </Card>

          {/* Media Card */}
          <Card>
            <CardContent className="pt-6">
              <ImageUploader
                imageFiles={imageFiles}
                existingImages={existingImages}
                isUploading={isUploading}
                onAddImages={addImages}
                onRemoveImageFile={removeImageFile}
                onRemoveExistingImage={removeExistingImage}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
