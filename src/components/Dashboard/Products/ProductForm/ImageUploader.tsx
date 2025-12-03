"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { X, Upload, Loader2, ImagePlus, Trash2 } from "lucide-react";
import { ImageFile, ProductImage } from "@/lib/types/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ImageUploaderProps {
  imageFiles: ImageFile[];
  existingImages: ProductImage[];
  isUploading: boolean;
  onAddImages: (files: File[]) => void;
  onRemoveImageFile: (id: string) => void;
  onRemoveExistingImage: (publicKey: string) => void;
}

export default function ImageUploader({
  imageFiles,
  existingImages,
  isUploading,
  onAddImages,
  onRemoveImageFile,
  onRemoveExistingImage,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAddImages(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onAddImages(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const totalImages = existingImages.length + imageFiles.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Product Images</h3>
          <p className="text-sm text-muted-foreground">
            Add or remove images for this product.
          </p>
        </div>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
          {totalImages} image{totalImages !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-4 rounded-full bg-muted group-hover:bg-background transition-colors">
            <Upload
              className={cn(
                "h-8 w-8 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              SVG, PNG, JPG or GIF (max. 5MB)
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Image previews */}
      {totalImages > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {/* Existing images */}
          {existingImages.map((img) => (
            <Card
              key={img._id}
              className="group relative overflow-hidden border-muted"
            >
              <div className="aspect-square relative bg-muted">
                <Image
                  src={img.url}
                  alt="Product"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveExistingImage(img.publickey);
                    }}
                    disabled={isUploading}
                    className="h-8 w-8 rounded-full"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  <span className="text-[10px] font-medium bg-black/75 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                    Existing
                  </span>
                </div>
              </div>
            </Card>
          ))}

          {/* New image files */}
          {imageFiles.map((img) => (
            <Card
              key={img.id}
              className="group relative overflow-hidden border-muted"
            >
              <div className="aspect-square relative bg-muted">
                <Image
                  src={img.preview}
                  alt="Preview"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImageFile(img.id);
                    }}
                    className="h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  <span className="text-[10px] font-medium bg-blue-600/90 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                    New Upload
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
