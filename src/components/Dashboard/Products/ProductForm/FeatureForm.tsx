"use client";

import React from "react";
import {
  useFieldArray,
  Control,
  useWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormValues } from "@/lib/schemas/productSchema";
import { FieldErrors } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// New interface added as per instruction
// Interface for FeatureFormProps
interface FeatureFormProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
}

export default function FeatureForm({
  control,
  errors,
  setValue,
}: FeatureFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const addFeature = () => {
    append({
      reference: "",
      size1: undefined,
      size2: undefined,
      thickness: undefined,
      finishQuality: "",
      minRange: undefined,
      maxRange: undefined,
      kgsPerUnit: undefined,
      unitSizes: [],
      miterPerUnitPrice: undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Features & Variants</h3>
          <p className="text-sm text-muted-foreground">
            Add different variants or features for this product.
          </p>
        </div>
        <Button
          onClick={addFeature}
          size="sm"
          className="shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      <div className="grid gap-6">
        {fields.map((field, index) => (
          <Card
            key={field.id}
            className="relative overflow-hidden border-muted"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {index + 1}
                </div>
                <CardTitle className="text-sm font-medium">
                  Variant Details
                </CardTitle>
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Reference */}
                <div className="space-y-2">
                  <Label htmlFor={`features.${index}.reference`}>
                    Reference <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`features.${index}.reference`}
                    {...control.register(`features.${index}.reference`)}
                    placeholder="e.g., REF-001"
                    className="bg-background"
                  />
                  {errors?.features?.[index]?.reference && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.features[index].reference.message}
                    </p>
                  )}
                </div>

                {/* Finish Quality */}
                <div className="space-y-2">
                  <Label htmlFor={`features.${index}.finishQuality`}>
                    Finish Quality <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`features.${index}.finishQuality`}
                    {...control.register(`features.${index}.finishQuality`)}
                    placeholder="e.g., Polished"
                    className="bg-background"
                  />
                  {errors?.features?.[index]?.finishQuality && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.features[index].finishQuality.message}
                    </p>
                  )}
                </div>

                {/* Price per unit */}
                <div className="space-y-2">
                  <Label htmlFor={`features.${index}.miterPerUnitPrice`}>
                    Price ($/unit)
                  </Label>
                  <Input
                    id={`features.${index}.miterPerUnitPrice`}
                    type="number"
                    step="0.01"
                    {...control.register(`features.${index}.miterPerUnitPrice`)}
                    placeholder="0.00"
                    className="bg-background"
                  />
                  {errors?.features?.[index]?.miterPerUnitPrice && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.features[index].miterPerUnitPrice.message}
                    </p>
                  )}
                </div>

                {/* Dimensions Group */}
                <div className="col-span-full grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  {/* Size 1 */}
                  <div className="space-y-2">
                    <Label htmlFor={`features.${index}.size1`}>Size 1</Label>
                    <Input
                      id={`features.${index}.size1`}
                      type="number"
                      step="0.01"
                      {...control.register(`features.${index}.size1`)}
                      placeholder="0"
                      className="bg-background"
                    />
                    {errors?.features?.[index]?.size1 && (
                      <p className="text-xs text-destructive font-medium">
                        {errors.features[index].size1.message}
                      </p>
                    )}
                  </div>

                  {/* Size 2 */}
                  <div className="space-y-2">
                    <Label htmlFor={`features.${index}.size2`}>Size 2</Label>
                    <Input
                      id={`features.${index}.size2`}
                      type="number"
                      step="0.01"
                      {...control.register(`features.${index}.size2`)}
                      placeholder="0"
                      className="bg-background"
                    />
                    {errors?.features?.[index]?.size2 && (
                      <p className="text-xs text-destructive font-medium">
                        {errors.features[index].size2.message}
                      </p>
                    )}
                  </div>

                  {/* Thickness */}
                  <div className="space-y-2">
                    <Label htmlFor={`features.${index}.thickness`}>
                      Thickness (mm)
                    </Label>
                    <Input
                      id={`features.${index}.thickness`}
                      type="number"
                      step="0.01"
                      {...control.register(`features.${index}.thickness`)}
                      placeholder="0"
                      className="bg-background"
                    />
                    {errors?.features?.[index]?.thickness && (
                      <p className="text-xs text-destructive font-medium">
                        {errors.features[index].thickness.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Range & Weight Group */}
                <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="space-y-2">
                    <Label htmlFor={`features.${index}.minRange`}>
                      Min Range
                    </Label>
                    <Input
                      id={`features.${index}.minRange`}
                      type="number"
                      step="0.01"
                      {...control.register(`features.${index}.minRange`)}
                      placeholder="0"
                      className="bg-background"
                    />
                    {errors?.features?.[index]?.minRange && (
                      <p className="text-xs text-destructive font-medium">
                        {errors.features[index].minRange.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`features.${index}.maxRange`}>
                      Max Range
                    </Label>
                    <Input
                      id={`features.${index}.maxRange`}
                      type="number"
                      step="0.01"
                      {...control.register(`features.${index}.maxRange`)}
                      placeholder="0"
                      className="bg-background"
                    />
                    {errors?.features?.[index]?.maxRange && (
                      <p className="text-xs text-destructive font-medium">
                        {errors.features[index].maxRange.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`features.${index}.kgsPerUnit`}>
                      Weight (kg/unit)
                    </Label>
                    <Input
                      id={`features.${index}.kgsPerUnit`}
                      type="number"
                      step="0.01"
                      {...control.register(`features.${index}.kgsPerUnit`)}
                      placeholder="0.00"
                      className="bg-background"
                    />
                    {errors?.features?.[index]?.kgsPerUnit && (
                      <p className="text-xs text-destructive font-medium">
                        {errors.features[index].kgsPerUnit.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Unit Sizes (Dynamic) */}
                <div className="col-span-full space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between">
                    <Label>Unit Sizes</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentSizes =
                          control._formValues.features[index].unitSizes || [];
                        setValue(`features.${index}.unitSizes`, [
                          ...currentSizes,
                          0,
                        ]);
                      }}
                      className="cursor-pointer"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Size
                    </Button>
                  </div>

                  {/* Note: This is a simplified rendering since useFieldArray doesn't support nested arrays of primitives easily without wrapping object.
                      Using a custom render map here based on the watching value or just using the register with numeric indices if we knew the length.
                      However, without a nested useFieldArray, we need to inspect the current value to render inputs.
                  */}
                  <UnitSizeList
                    nestIndex={index}
                    control={control}
                    setValue={setValue}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {errors?.features?.root && (
        <p className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md">
          {errors.features.root.message}
        </p>
      )}
    </div>
  );
}

function UnitSizeList({
  nestIndex,
  control,
  setValue,
}: {
  nestIndex: number;
  control: Control<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
}) {
  // We use a custom field component for simplified array management of primitives
  return (
    <UnitSizesField
      nestIndex={nestIndex}
      control={control}
      setValue={setValue}
    />
  );
}

function UnitSizesField({
  nestIndex,
  control,
  setValue,
}: {
  nestIndex: number;
  control: Control<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
}) {
  const unitSizes = useWatch({
    control,
    name: `features.${nestIndex}.unitSizes`,
    defaultValue: [],
  });

  return (
    <div className="space-y-2">
      {unitSizes &&
        unitSizes.map((_, k) => (
          <div key={k} className="flex items-center gap-2">
            <Input
              type="number"
              step="0.01"
              {...control.register(
                `features.${nestIndex}.unitSizes.${k}` as const,
                {
                  valueAsNumber: true,
                },
              )}
              placeholder="Size"
              className="bg-background"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                const current = [...unitSizes];
                current.splice(k, 1);
                setValue(`features.${nestIndex}.unitSizes`, current);
              }}
              className="h-9 w-9 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      {(!unitSizes || unitSizes.length === 0) && (
        <p className="text-xs text-muted-foreground italic">
          No unit sizes added.
        </p>
      )}
    </div>
  );
}
