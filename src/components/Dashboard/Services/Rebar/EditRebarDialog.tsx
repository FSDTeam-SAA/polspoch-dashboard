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
import {
  useRebarTemplateDetails,
  useUpdateRebarTemplate,
} from "@/lib/hooks/useRebarServices";

interface DimensionField {
  key: string;
  label: string;
  minRange: number;
  maxRange: number;
  unit: string;
}

interface EditRebarFormValues {
  templateId: string;
  shapeName: string;
  availableDiameters: { value: number }[];
  dimensions: DimensionField[];
  image?: FileList;
}

interface EditRebarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceItem;
}

export function EditRebarDialog({
  open,
  onOpenChange,
  service,
}: EditRebarDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: detailedData, isLoading: isLoadingDetails } =
    useRebarTemplateDetails(
      open && service.templateId ? service.templateId : null,
    );

  const { register, control, handleSubmit, reset } =
    useForm<EditRebarFormValues>({
      defaultValues: {
        templateId: "",
        shapeName: "",
        availableDiameters: [{ value: 0 }],
        dimensions: [
          { key: "A", label: "Size A", minRange: 0, maxRange: 0, unit: "MM" },
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
    fields: diameterFields,
    append: appendDiameter,
    remove: removeDiameter,
  } = useFieldArray({
    control,
    name: "availableDiameters",
  });

  // Mutations
  const updateTemplateMutation = useUpdateRebarTemplate();

  // Populate form when data is loaded
  useEffect(() => {
    if (detailedData) {
      reset({
        templateId: detailedData.templateId,
        shapeName: detailedData.shapeName,
        availableDiameters: detailedData.availableDiameters.map((d) => ({
          value: d,
        })),
        dimensions: detailedData.dimensions.map((d) => ({
          key: d.key,
          label: d.label,
          minRange: d.minRange,
          maxRange: d.maxRange,
          unit: d.unit,
        })),
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImagePreview(detailedData.imageUrl);
    }
  }, [detailedData, reset]);

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

  const onSubmit = async (data: EditRebarFormValues) => {
    try {
      if (!data.templateId) return;

      await updateTemplateMutation.mutateAsync({
        templateId: data.templateId,
        shapeName: data.shapeName,
        availableDiameters: data.availableDiameters.map((d) => Number(d.value)),
        dimensions: data.dimensions.map((d) => ({
          key: d.key,
          label: d.label,
          minRange: Number(d.minRange),
          maxRange: Number(d.maxRange),
          unit: d.unit,
        })),
        image: data.image?.[0],
      });

      toast.success("Rebar template updated successfully");
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
          <DialogTitle>Edit Rebar Template</DialogTitle>
          <DialogDescription>
            Update the rebar shape template details.
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetails ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="templateId">Template ID</Label>
                <Input
                  id="templateId"
                  disabled // ID usually shouldn't be changed
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
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Available Diameters</Label>
                {/* Visual only for now as there is no API to update this */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendDiameter({ value: 0 })}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Diameter
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 p-4 border rounded-md">
                {diameterFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Input
                      type="number"
                      className="w-24"
                      {...register(
                        `availableDiameters.${index}.value` as const,
                        {
                          required: true,
                          valueAsNumber: true,
                        },
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                      onClick={() => removeDiameter(index)}
                      disabled={diameterFields.length === 1}
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
                      <Label className="text-xs">Unit</Label>{" "}
                      {/* Removed empty label content that was implicit */}
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
                          // reset({ ...watch(), image: undefined }); // Optional: clear file input
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
        )}
      </DialogContent>
    </Dialog>
  );
}
