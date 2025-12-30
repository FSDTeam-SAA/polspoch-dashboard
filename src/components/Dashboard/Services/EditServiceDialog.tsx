// EditServiceDialog.tsx
"use client";

import { useState, useEffect, useRef } from "react";
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
import { ServiceItem } from "./Services";
import {
  useRebarTemplateDetails,
  useUpdateRebarImage,
  useUpdateRebarLabel,
} from "@/lib/hooks/useRebarServices";
import {
  useUpdateBendingImage,
  useUpdateBendingDimension,
} from "@/lib/hooks/useBendingServices";
import { toast } from "sonner";

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceItem | null;
}

export function EditServiceDialog({
  open,
  onOpenChange,
  service,
}: EditServiceDialogProps) {
  const updateRebarImage = useUpdateRebarImage();
  const updateRebarLabel = useUpdateRebarLabel();
  const updateBendingImage = useUpdateBendingImage();
  const updateBendingDimension = useUpdateBendingDimension();

  // Fetch details if it's a rebar template
  const { data: detailedData, isLoading } = useRebarTemplateDetails(
    open && service?.templateId && service.type === "rebar"
      ? service.templateId
      : null,
  );

  // File state for uploads
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize form data when service or open state changes
  const [formData, setFormData] = useState<ServiceItem | null>(() => {
    if (!service) return null;

    // Attempt to merge immediately if data is available (e.g. from cache)
    if (service.templateId && detailedData) {
      return {
        ...service,
        shepName: detailedData.shapeName,
        title: detailedData.shapeName,
        image: detailedData.imageUrl,
        specs: {
          material: service.specs.material,
          thickness: detailedData.availableDiameters.map(String),
        },
        dimensions: detailedData.dimensions.map((d) => ({
          label: d.label,
          value:
            d.minRange === d.maxRange
              ? `${d.minRange} ${d.unit}`
              : `${d.minRange} – ${d.maxRange} ${d.unit}`,
          key: d.key,
          min: d.minRange,
          max: d.maxRange,
        })),
      };
    }

    return JSON.parse(JSON.stringify(service));
  });

  // Track the ID of the last detailed data we merged to avoid redundant updates
  const lastMergedIdRef = useRef<string | null>(
    service?.templateId && detailedData ? detailedData._id : null,
  );

  // Update form data when detailedData arrives (async) or changes
  useEffect(() => {
    if (
      service?.templateId &&
      detailedData &&
      detailedData._id !== lastMergedIdRef.current
    ) {
      lastMergedIdRef.current = detailedData._id;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          shepName: detailedData.shapeName,
          title: detailedData.shapeName,
          image: detailedData.imageUrl,
          specs: {
            material: service.specs.material, // Depend on service.specs
            thickness: detailedData.availableDiameters.map(String),
          },
          dimensions: detailedData.dimensions.map((d) => ({
            label: d.label,
            value:
              d.minRange === d.maxRange
                ? `${d.minRange} ${d.unit}`
                : `${d.minRange} – ${d.maxRange} ${d.unit}`,
          })),
        };
      });
    }
  }, [detailedData, service]);

  if (!service || !formData) return null;

  const handleChange = (field: keyof ServiceItem, value: string | number) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleDimensionChange = (
    index: number,
    field: "label" | "value",
    value: string,
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newDimensions = [...prev.dimensions];
      newDimensions[index] = { ...newDimensions[index], [field]: value };
      return { ...prev, dimensions: newDimensions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !service) return;

    try {
      // 1. Handle Image Upload
      if (selectedFile && formData.templateId) {
        toast.info("Uploading image...");

        if (service.type === "rebar") {
          await updateRebarImage.mutateAsync({
            templateId: formData.templateId,
            file: selectedFile,
          });
        }

        if (service.type === "bending") {
          await updateBendingImage.mutateAsync({
            templateId: formData.templateId,
            file: selectedFile,
          });
        }

        toast.success("Image updated successfully");
      }

      // 2. Handle Dimension Updates
      if (formData.templateId) {
        for (const dim of formData.dimensions) {
          if (dim.key && dim.min !== undefined && dim.max !== undefined) {
            if (service.type === "rebar") {
              await updateRebarLabel.mutateAsync({
                templateId: formData.templateId,
                key: dim.key,
                newLabel: dim.label,
                min: Number(dim.min),
                max: Number(dim.max),
              });
            }

            if (service.type === "bending") {
              await updateBendingDimension.mutateAsync({
                templateId: formData.templateId,
                key: dim.key,
                newLabel: dim.label,
                min: Number(dim.min),
                max: Number(dim.max),
              });
            }
          }
        }

        toast.success("Dimensions updated successfully");
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update service", error);
      toast.error("Failed to update service");
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
            {isLoading
              ? "Loading details..."
              : "Make changes to the service details below. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        {isLoading && service.templateId ? (
          <div className="flex justify-center py-8">
            <span className="text-muted-foreground animate-pulse">
              Loading detailed specifications...
            </span>
          </div>
        ) : (
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
                    title="Upload a new service image"
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file); // Store file for upload
                        const url = URL.createObjectURL(file);
                        handleChange("image", url);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

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
                      Label ({dim.key ?? "N/A"})
                    </Label>
                    <Input
                      id={`dim-label-${index}`}
                      value={dim.label}
                      onChange={(e) =>
                        handleDimensionChange(index, "label", e.target.value)
                      }
                      className="h-8 text-sm border-[#7E1800]/20 focus-visible:ring-[#7E1800]"
                    />

                    {/* Show Min/Max for Rebar (if keys exist), else generic Value string */}
                    {dim.key !== undefined ? (
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label
                            htmlFor={`dim-min-${index}`}
                            className="text-xs text-muted-foreground"
                          >
                            Min
                          </Label>
                          <Input
                            id={`dim-min-${index}`}
                            type="number"
                            value={dim.min}
                            onChange={(e) =>
                              // Reuse handleDimensionChange but we need to handle numbers loosely or strictly
                              // Let's create a generic handler or cast
                              setFormData((prev) => {
                                if (!prev) return null;
                                const newDims = [...prev.dimensions];
                                newDims[index] = {
                                  ...newDims[index],
                                  min: Number(e.target.value),
                                };
                                // Also update the display value string just in case
                                return { ...prev, dimensions: newDims };
                              })
                            }
                            className="h-8 text-sm border-[#7E1800]/20 focus-visible:ring-[#7E1800]"
                          />
                        </div>
                        <div className="flex-1">
                          <Label
                            htmlFor={`dim-max-${index}`}
                            className="text-xs text-muted-foreground"
                          >
                            Max
                          </Label>
                          <Input
                            id={`dim-max-${index}`}
                            type="number"
                            value={dim.max}
                            onChange={(e) =>
                              setFormData((prev) => {
                                if (!prev) return null;
                                const newDims = [...prev.dimensions];
                                newDims[index] = {
                                  ...newDims[index],
                                  max: Number(e.target.value),
                                };
                                return { ...prev, dimensions: newDims };
                              })
                            }
                            className="h-8 text-sm border-[#7E1800]/20 focus-visible:ring-[#7E1800]"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
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
                            handleDimensionChange(
                              index,
                              "value",
                              e.target.value,
                            )
                          }
                          className="h-8 text-sm border-[#7E1800]/20 focus-visible:ring-[#7E1800]"
                        />
                      </>
                    )}
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
        )}
      </DialogContent>
    </Dialog>
  );
}
