"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Save,
  Upload,
  X,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
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
    setValue,
  } = form;

  // Reset form when product data is loaded
  useEffect(() => {
    if (productData && mode === "edit") {
      reset({
        productName: productData.productName,
        family: productData.family,
        availabilityNote: productData.availabilityNote || "",
        unitSizeCustomizationNote: productData.unitSizeCustomizationNote || "",
        measureUnit: productData.measureUnit,
        features: productData.features.map((f) => ({
          reference: f.reference,
          size1: f.size1,
          size2: f.size2,
          thickness: f.thickness,
          finishQuality: f.finishQuality,
          minRange: f.minRange,
          maxRange: f.maxRange,
          kgsPerUnit: f.kgsPerUnit,
          miterPerUnitPrice: f.miterPerUnitPrice,
          unitSizes: f.unitSizes,
        })),
      });
    }
  }, [productData, mode, reset]);

  const onSubmit = handleFormSubmit((data: ProductFormValues) => {
    const { files } = getAllImageData();
    // For logging verification as requested
    // console.log("Form Data:", data);
    // console.log("Image Files to Upload:", files);
    if (files.length > 0) {
      console.log("First file details:", {
        name: files[0].name,
        type: files[0].type,
        size: files[0].size,
      });
    }
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b">
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
            className="cursor-pointer"
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
                <div className="cursor-pointer flex items-center gap-1">
                  <Save className="h-4 w-4 cursor-pointer" />
                  {mode === "add" ? "Create Product" : "Save Changes"}
                </div>
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
                <div className="relative">
                  <select
                    id="availabilityNote"
                    {...register("availabilityNote")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select status</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Pre Order">Pre Order</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card>
            <CardContent className="pt-6">
              <FeatureForm
                control={control}
                errors={errors}
                setValue={setValue}
              />
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

          {/* Image Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Upload one or multiple images for the product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors relative">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                  </div>
                  <Input
                    id="dropzone-file"
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        addImages(Array.from(e.target.files));
                        // Reset input value to allow selecting same file again if needed
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              </div>

              {/* Image Previews */}
              <div className="space-y-4">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Existing Images
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {existingImages.map((img) => (
                        <div
                          key={img._id || img.publickey}
                          className="relative aspect-square rounded-md overflow-hidden border group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeExistingImage(img.publickey)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {imageFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      New Uploads
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {imageFiles.map((img) => (
                        <div
                          key={img.id}
                          className="relative aspect-square rounded-md overflow-hidden border group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeImageFile(img.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {existingImages.length === 0 && imageFiles.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-sm bg-muted/30 rounded-lg">
                    <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                    <p>No images added yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
