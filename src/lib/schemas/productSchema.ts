// src/lib/schemas/productSchema.ts

import { z } from "zod";

const optionalNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().min(0).optional(),
);

// Feature schema
export const featureSchema = z
  .object({
    reference: z.string().min(1, "Reference is required"),
    size1: optionalNumber,
    size2: optionalNumber,
    thickness: optionalNumber,
    finishQuality: z.string().min(1, "Finish quality is required"),

    // Range fields made optional and 0-allowed
    minRange: optionalNumber,
    maxRange: optionalNumber,
    kgsPerUnit: optionalNumber,

    miterPerUnitPrice: z.coerce
      .number()
      .min(0, "Price cannot be negative")
      .optional(),
    unitSizes: z.array(z.number()).default([]),
  })
  .refine(
    (data) => {
      if (data.minRange !== undefined && data.maxRange !== undefined) {
        return data.maxRange >= data.minRange;
      }
      return true;
    },
    {
      message: "Max range must be greater than or equal to min range",
      path: ["maxRange"],
    },
  );

// Product form schema
export const productFormSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  family: z.string().min(1, "Family is required"),
  availabilityNote: z.string().optional(),
  unitSizeCustomizationNote: z.string().optional(),
  measureUnit: z.string().min(1, "Measure unit is required"),
  features: z.array(featureSchema).min(1, "At least one feature is required"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type FeatureFormValues = z.infer<typeof featureSchema>;
