"use client";

import React, { useState, useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Control,
  UseFormRegister,
} from "react-hook-form";
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
import { useUpdateBendingTemplate } from "@/lib/hooks/useBendingServices";
import { BendingMaterial } from "@/types/bending";

interface BendingDimensionInput {
  key: string;
  label: string;
  minRange: number;
  maxRange: number;
  unit: string;
}

interface EditBendingFormValues {
  templateId: string;
  shapeName: string;
  bend: number;
  materials: {
    material: string;
    thickness: { value: number }[];
  }[];
  dimensions: BendingDimensionInput[];
  image?: FileList;
}

interface EditBendingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceItem;
}

export function EditBendingDialog({
  open,
  onOpenChange,
  service,
}: EditBendingDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, control, handleSubmit, reset, getValues } =
    useForm<EditBendingFormValues>({
      defaultValues: {
        templateId: "",
        shapeName: "",
        bend: 0,
        materials: [{ material: "", thickness: [{ value: 0 }] }],
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
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({
    control,
    name: "materials",
  });

  // Mutations
  const updateTemplateMutation = useUpdateBendingTemplate();

  // Note: No API for updating other fields like cuts, thickness, materials currently available.

  useEffect(() => {
    if (service && open) {
      const materialsToReset = service.rawMaterials || service.specs.material;

      reset({
        templateId: service.templateId || "",
        shapeName: service.shepName,
        bend: service.bend || 0,
        materials: Array.isArray(materialsToReset)
          ? (materialsToReset as (string | BendingMaterial)[]).map((m) => ({
              material: typeof m === "string" ? m : m.material || "",
              thickness:
                typeof m !== "string" && Array.isArray(m.thickness)
                  ? m.thickness.map((t) => ({ value: Number(t) }))
                  : [],
            }))
          : [],
        dimensions: service.dimensions.map((d) => ({
          key: d.key || "",
          label: d.label,
          // Map 'min'/'max' from ServiceItem to 'minRange'/'maxRange'
          minRange: d.min || 0,
          maxRange: d.max || 0,
          unit: d.value.split(" ").slice(-1)[0] || "MM", // Extract unit from value string if needed, or default
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

  const onSubmit = async (data: EditBendingFormValues) => {
    try {
      if (!data.templateId) return;

      await updateTemplateMutation.mutateAsync({
        templateId: data.templateId,
        shapeName: data.shapeName,
        bend: data.bend,
        materials: data.materials.map((m) => ({
          material: m.material,
          thickness: m.thickness.map((t) => Number(t.value)),
        })),
        dimensions: data.dimensions.map((d) => ({
          key: d.key,
          label: d.label,
          minRange: Number(d.minRange),
          maxRange: Number(d.maxRange),
          unit: d.unit,
        })),
        image: data.image?.[0],
      });

      toast.success("Bending template updated successfully");
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
          <DialogTitle>Edit Bending Template</DialogTitle>
          <DialogDescription>
            Update the bending shape template details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="templateId">Template ID</Label>
              <Input
                id="templateId"
                disabled
                placeholder="e.g. B-001"
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
              <Label htmlFor="bend">Bends</Label>
              <Input
                id="bend"
                type="number"
                {...register("bend", {
                  required: "Bends is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Must be positive" },
                })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Materials & Thicknesses</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendMaterial({ material: "", thickness: [{ value: 0 }] })
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add Material
              </Button>
            </div>
            <div className="space-y-4">
              {materialFields.map((field, index) => (
                <MaterialField
                  key={field.id}
                  index={index}
                  control={control}
                  register={register}
                  remove={removeMaterial}
                />
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
function MaterialField({
  index,
  control,
  register,
  remove,
}: {
  index: number;
  control: Control<EditBendingFormValues>;
  register: UseFormRegister<EditBendingFormValues>;
  remove: (index: number) => void;
}) {
  const {
    fields,
    append,
    remove: removeThickness,
  } = useFieldArray({
    control,
    name: `materials.${index}.thickness`,
  });

  return (
    <div className="p-4 border rounded-md bg-muted/20 space-y-4">
      <div className="flex gap-2 items-center">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Material Name</Label>
          <Input
            {...register(`materials.${index}.material` as const, {
              required: true,
            })}
            placeholder="e.g. RAWSTEEL"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive/90 mt-5"
          onClick={() => remove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Thicknesses (mm)</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => append({ value: 0 })}
          >
            <Plus className="h-3 w-3 mr-1" /> Add Thickness
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {fields.map((field, tIndex) => (
            <div key={field.id} className="flex gap-1">
              <Input
                type="number"
                step="0.1"
                className="h-8 text-xs"
                {...register(
                  `materials.${index}.thickness.${tIndex}.value` as const,
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
                className="h-8 w-8 text-destructive hover:text-destructive/90 shrink-0"
                onClick={() => removeThickness(tIndex)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
