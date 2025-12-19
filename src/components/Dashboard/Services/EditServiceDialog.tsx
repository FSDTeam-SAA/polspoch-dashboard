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
  id: string;
  title: string;
  description: string;
  specs: {
    material: string[];
    thickness: string[];
  };
  dimensions: { label: string; value: string }[];
  colorTheme: "blue" | "green" | "orange" | "purple";
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
  if (service && (!formData || formData.id !== service.id)) {
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
          <DialogTitle>Edit Service: {service.title}</DialogTitle>
          <DialogDescription>
            Make changes to the service details below. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
          </div> */}

          {/* <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div> */}

          {/* <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
            <h4 className="font-medium text-sm text-foreground/80">
              Specifications (Comma separated)
            </h4>
            <div className="space-y-2">
              <Label htmlFor="materials">Materials</Label>
              <Input
                id="materials"
                value={formData.specs.material.join(", ")}
                onChange={(e) => handleSpecChange("material", e.target.value)}
                placeholder="Rawseel, Galvanized, ..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thickness">Thicknesses</Label>
              <Input
                id="thickness"
                value={formData.specs.thickness.join(", ")}
                onChange={(e) => handleSpecChange("thickness", e.target.value)}
                placeholder="1, 1.5, 2..."
              />
            </div>
          </div> */}

          <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
            <h4 className="font-medium text-sm text-foreground/80">
              Dimensions
            </h4>
            <div className="space-y-3">
              {formData.dimensions.map((dim, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Label
                    </Label>
                    <Input
                      value={dim.label}
                      onChange={(e) =>
                        handleDimensionChange(index, "label", e.target.value)
                      }
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Value
                    </Label>
                    <Input
                      value={dim.value}
                      onChange={(e) =>
                        handleDimensionChange(index, "value", e.target.value)
                      }
                      className="h-8"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
