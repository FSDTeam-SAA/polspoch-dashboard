// src/lib/hooks/useImageUpload.ts

import { useState, useCallback } from "react";
import { ImageFile, ProductImage } from "../types/product";
import { productService } from "../services/productService";
import { toast } from "sonner";

interface UseImageUploadReturn {
  imageFiles: ImageFile[];
  existingImages: ProductImage[];
  isUploading: boolean;
  addImages: (files: File[]) => void;
  removeImageFile: (id: string) => void;
  removeExistingImage: (publicKey: string) => Promise<void>;
  clearAll: () => void;
  getAllImageData: () => { files: File[]; existingUrls: string[] };
}

export function useImageUpload(
  initialImages: ProductImage[] = []
): UseImageUploadReturn {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [existingImages, setExistingImages] =
    useState<ProductImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);

  const addImages = useCallback((files: File[]) => {
    const validFiles = files.filter((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    const newImageFiles: ImageFile[] = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7),
    }));

    setImageFiles((prev) => [...prev, ...newImageFiles]);
  }, []);

  const removeImageFile = useCallback((id: string) => {
    setImageFiles((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const removeExistingImage = useCallback(async (publicKey: string) => {
    try {
      setIsUploading(true);
      await productService.deleteImage(publicKey);
      setExistingImages((prev) =>
        prev.filter((img) => img.publickey !== publicKey)
      );
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const clearAll = useCallback(() => {
    imageFiles.forEach((img) => URL.revokeObjectURL(img.preview));
    setImageFiles([]);
  }, [imageFiles]);

  const getAllImageData = useCallback(() => {
    return {
      files: imageFiles.map((img) => img.file),
      existingUrls: existingImages.map((img) => img.url),
    };
  }, [imageFiles, existingImages]);

  return {
    imageFiles,
    existingImages,
    isUploading,
    addImages,
    removeImageFile,
    removeExistingImage,
    clearAll,
    getAllImageData,
  };
}
