"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the structure of the service item (matching Services.tsx)
interface ServiceItem {
  shepName: string;
  type: "rebar" | "cutting" | "bending";
  title: string;
  description: string;
  specs: {
    material: string[];
    thickness: string[];
  };
  dimensions: { label: string; value: string }[];
  image?: string;
}

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceItem | null;
  onSave: (updatedService: ServiceItem) => void;
}

export function EditServiceDialog({
  open,
  onOpenChange,
  service,
  onSave,
}: EditServiceDialogProps) {
  const [formData, setFormData] = useState<ServiceItem | null>(null);

  // Initialize form data when service changes
  if (service && (!formData || formData.shepName !== service.shepName)) {
    setFormData(JSON.parse(JSON.stringify(service))); // Deep copy to avoid mutating prop directly
  }

  // If dialog is closed or no service passed, render nothing (or handle gracefully)
  if (!service || !formData) return null;

  const handleChange = (field: keyof ServiceItem, value: string | number) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSpecChange = (type: "material" | "thickness", value: string) => {
    // Basic comma-separated parsing for implementation simplicity
    const arrayValues = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        specs: {
          ...prev.specs,
          [type]: arrayValues,
        },
      };
    });
  };

  const handleDimensionChange = (
    index: number,
    field: "label" | "value",
    value: string
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newDimensions = [...prev.dimensions];
      newDimensions[index] = { ...newDimensions[index], [field]: value };
      return { ...prev, dimensions: newDimensions };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      console.log("Saved Service Info:", formData);
      onSave(formData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#7E1800]">
            Edit Service: {service.title}
          </DialogTitle>
          <DialogDescription>
            Make changes to the service details below. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold leading-none tracking-tight text-[#7E1800]">
              Service Image
            </h3>
            <div className="flex flex-col gap-4">
              {formData.image ? (
                <div className="relative w-full h-48 border rounded-md overflow-hidden group border-[#7E1800]/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleChange("image", "")}
                      className="cursor-pointer"
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md bg-[#7E1800]/5 border-[#7E1800]/20">
                  <span className="text-muted-foreground text-sm">
                    No image uploaded
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="image-upload">Upload New Image</Label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      handleChange("image", url);
                    }
                  }}
                />
              </div>
            </div>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#7E1800]">
                Service Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="border-[#7E1800]/20 focus-visible:ring-[#7E1800]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shepName" className="text-[#7E1800]">
                Shape Name
              </Label>
              <Input
                id="shepName"
                value={formData.shepName}
                onChange={(e) => handleChange("shepName", e.target.value)}
                className="border-[#7E1800]/20 focus-visible:ring-[#7E1800]"
              />
            </div>
          </div> */}

          {/* <div className="space-y-2">
            <Label htmlFor="description" className="text-[#7E1800]">
              Description
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="border-[#7E1800]/20 focus-visible:ring-[#7E1800]"
            />
          </div> */}

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material" className="text-[#7E1800]">
                Materials (comma separated)
              </Label>
              <Input
                id="material"
                value={formData.specs.material.join(", ")}
                onChange={(e) => handleSpecChange("material", e.target.value)}
                placeholder="e.g. Rawsteel, Galvanized, Corten"
                className="border-[#7E1800]/20 focus-visible:ring-[#7E1800]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thickness" className="text-[#7E1800]">
                Thickness (comma separated)
              </Label>
              <Input
                id="thickness"
                value={formData.specs.thickness.join(", ")}
                onChange={(e) => handleSpecChange("thickness", e.target.value)}
                placeholder="e.g. 1, 1.5, 2, 3"
                className="border-[#7E1800]/20 focus-visible:ring-[#7E1800]"
              />
            </div>
          </div> */}

          <div className="space-y-4">
            <h3 className="font-semibold leading-none tracking-tight text-[#7E1800]">
              Dimensions Specification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.dimensions.map((dim, index) => (
                <div
                  key={index}
                  className="space-y-2 p-3 border rounded-md bg-[#7E1800]/5 border-[#7E1800]/10"
                >
                  <Label
                    htmlFor={`dim-label-${index}`}
                    className="text-xs text-muted-foreground"
                  >
                    Label
                  </Label>
                  <Input
                    id={`dim-label-${index}`}
                    value={dim.label}
                    onChange={(e) =>
                      handleDimensionChange(index, "label", e.target.value)
                    }
                    className="h-8 text-sm border-[#7E1800]/20 focus-visible:ring-[#7E1800]"
                  />
                  <Label
                    htmlFor={`dim-value-${index}`}
                    className="text-xs text-muted-foreground"
                  >
                    Value
                  </Label>
                  <Input
                    id={`dim-value-${index}`}
                    value={dim.value}
                    onChange={(e) =>
                      handleDimensionChange(index, "value", e.target.value)
                    }
                    className="h-8 text-sm border-[#7E1800]/20 focus-visible:ring-[#7E1800]"
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer border-[#7E1800] text-[#7E1800] hover:bg-[#7E1800]/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#7E1800] hover:bg-[#7E1800]/90 text-white cursor-pointer"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
