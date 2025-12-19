// src/lib/schemas/productSchema.ts

import { z } from "zod";

// Feature schema
export const featureSchema = z
  .object({
    reference: z.string().min(1, "Reference is required"),
    size1: z.coerce.number().positive("Size 1 must be positive"),
    size2: z.coerce.number().positive("Size 2 must be positive"),
    thickness: z.coerce.number().positive("Thickness must be positive"),
    finishQuality: z.string().min(1, "Finish quality is required"),

    // Moved from ProductFormSchema
    minRange: z.coerce.number().positive("Min range must be positive"),
    maxRange: z.coerce.number().positive("Max range must be positive"),
    kgsPerUnit: z.coerce.number().positive("Weight must be positive"),

    miterPerUnitPrice: z.coerce
      .number()
      .positive("Price must be positive")
      .optional(),
    unitSizes: z.array(z.number()).default([]),
  })
  .refine((data) => data.maxRange > data.minRange, {
    message: "Max range must be greater than min range",
    path: ["maxRange"],
  });

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
