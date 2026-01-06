"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ServiceItem } from "../Services";
import { useUpdateCuttingTemplate } from "@/lib/hooks/useCuttingServices";

interface CuttingDimensionInput {
  key: string;
  label: string;
  minRange: number;
  maxRange: number;
  unit: string;
}

interface EditCuttingFormValues {
  templateId: string;
  shapeName: string;
  cuts: number;
  thickness: { value: number }[];
  materials: { value: string }[];
  dimensions: CuttingDimensionInput[];
  image?: FileList;
}

interface EditCuttingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceItem;
}

export function EditCuttingDialog({
  open,
  onOpenChange,
  service,
}: EditCuttingDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, control, handleSubmit, reset, getValues } =
    useForm<EditCuttingFormValues>({
      defaultValues: {
        templateId: "",
        shapeName: "",
        cuts: 0,
        thickness: [{ value: 0 }],
        materials: [{ value: "" }],
        dimensions: [
          { key: "A", label: "Length A", minRange: 0, maxRange: 0, unit: "MM" },
        ],
      },
    });

  const {
    fields: dimensionFields,
    append: appendDimension,
    remove: removeDimension,
  } = useFieldArray({
    control,
    name: "dimensions",
  });

  const {
    fields: thicknessFields,
    append: appendThickness,
    remove: removeThickness,
  } = useFieldArray({
    control,
    name: "thickness",
  });

  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({
    control,
    name: "materials",
  });

  // Mutations
  const updateTemplateMutation = useUpdateCuttingTemplate();
  // Note: No API for updating thickness/materials/cuts fully.

  useEffect(() => {
    if (service && open) {
      reset({
        templateId: service.templateId || "",
        shapeName: service.shepName,
        cuts: service.cuts || 0,
        thickness: service.specs.thickness.map((t) => ({ value: Number(t) })),
        materials: service.specs.material.map((m) => ({ value: m })),
        dimensions: service.dimensions.map((d) => ({
          key: d.key || "",
          label: d.label,
          minRange: d.min || 0,
          maxRange: d.max || 0,
          unit: d.value.split(" ").slice(-1)[0] || "MM",
        })),
      });

      if (service.image) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setImagePreview(service.image);
      }
    }
  }, [service, open, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EditCuttingFormValues) => {
    try {
      if (!data.templateId) return;

      await updateTemplateMutation.mutateAsync({
        templateId: data.templateId,
        shapeName: data.shapeName,
        cuts: data.cuts,
        thickness: data.thickness.map((t) => Number(t.value)),
        materials: data.materials.map((m) => m.value),
        dimensions: data.dimensions.map((d) => ({
          key: d.key,
          label: d.label,
          minRange: Number(d.minRange),
          maxRange: Number(d.maxRange),
          unit: d.unit,
        })),
        image: data.image?.[0],
      });

      toast.success("Cutting template updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update template");
    }
  };

  const isPending = updateTemplateMutation.isPending;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Cutting Template</DialogTitle>
          <DialogDescription>
            Update the cutting shape template details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="templateId">Template ID</Label>
              <Input
                id="templateId"
                disabled
                placeholder="e.g. C-001"
                {...register("templateId", {
                  required: "Template ID is required",
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shapeName">Shape Name</Label>
              <Input
                id="shapeName"
                {...register("shapeName", {
                  required: "Shape Name is required",
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuts">Cuts</Label>
              <Input
                id="cuts"
                type="number"
                {...register("cuts", {
                  required: "Cuts is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Must be positive" },
                })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Thickness (mm)</Label>
              {/* No API to update thickness, visual only */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendThickness({ value: 0 })}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Thickness
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {thicknessFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    {...register(`thickness.${index}.value` as const, {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90 shrink-0"
                    onClick={() => removeThickness(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Materials</Label>
              {/* No API to update materials, visual only */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendMaterial({ value: "" })}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Material
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {materialFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`materials.${index}.value` as const, {
                      required: true,
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90 shrink-0"
                    onClick={() => removeMaterial(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Dimensions</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendDimension({
                    key: "",
                    label: "",
                    minRange: 0,
                    maxRange: 0,
                    unit: "MM",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add Dimension
              </Button>
            </div>

            <div className="space-y-4">
              {dimensionFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 items-end p-4 border rounded-md bg-muted/20"
                >
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Key</Label>
                    <Input
                      {...register(`dimensions.${index}.key` as const, {
                        required: true,
                      })}
                      placeholder="e.g A"
                    />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs">Label</Label>
                    <Input
                      {...register(`dimensions.${index}.label` as const, {
                        required: true,
                      })}
                      placeholder="e.g Length A"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Min</Label>
                    <Input
                      type="number"
                      {...register(`dimensions.${index}.minRange` as const, {
                        required: true,
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Max</Label>
                    <Input
                      type="number"
                      {...register(`dimensions.${index}.maxRange` as const, {
                        required: true,
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Unit</Label>
                    <Input
                      {...register(`dimensions.${index}.unit` as const, {
                        required: true,
                      })}
                      placeholder="MM"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end pb-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90"
                      onClick={() => removeDimension(index)}
                      disabled={dimensionFields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Template Image</Label>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors relative">
                {imagePreview ? (
                  <div className="relative w-full h-full p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        const currentValues = getValues();
                        reset({ ...currentValues, image: undefined });
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload image
                    </p>
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  {...register("image")}
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#7E1800] hover:bg-[#7E1800]/90"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
