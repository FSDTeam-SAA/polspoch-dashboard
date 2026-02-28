"use client";

import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShippingPolicy,
  ShippingPolicyPayload,
} from "@/lib/types/shippingPolicy";

interface EditShippingPolicyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  policy: ShippingPolicy | null;
  onSubmit: (id: string, payload: Partial<ShippingPolicyPayload>) => void;
  isPending: boolean;
}

export function EditShippingPolicyDialog({
  isOpen,
  onOpenChange,
  policy,
  onSubmit,
  isPending,
}: EditShippingPolicyDialogProps) {
  const getInitialFormData = (
    p: ShippingPolicy | null,
  ): ShippingPolicyPayload => ({
    shippingMethod: p?.shippingMethod ?? "",
    limits: p?.limits ?? "",
    minPrice: p?.minPrice ?? 0,
    Extras: p?.Extras ?? "",
    maxPrice: p?.maxPrice ?? 0,
  });

  const [formData, setFormData] = useState<ShippingPolicyPayload>(
    getInitialFormData(policy),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Track policy ID to reset form when a different policy is selected
  const lastPolicyId = useRef(policy?._id);
  if (policy?._id !== lastPolicyId.current) {
    lastPolicyId.current = policy?._id;
    setFormData(getInitialFormData(policy));
    setErrors({});
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.shippingMethod.trim()) {
      newErrors.shippingMethod = "Shipping method is required";
    }
    if (!formData.limits.trim()) {
      newErrors.limits = "Limits field is required";
    }
    if (formData.minPrice < 0) {
      newErrors.minPrice = "Min price cannot be negative";
    }
    if (formData.maxPrice < 0) {
      newErrors.maxPrice = "Max price cannot be negative";
    }
    if (formData.maxPrice < formData.minPrice) {
      newErrors.maxPrice = "Max price must be ≥ Min price";
    }
    if (!formData.Extras.trim()) {
      newErrors.Extras = "Extras field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!policy || !validate()) return;
    onSubmit(policy._id, formData);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Shipping Policy</DialogTitle>
          <DialogDescription>
            Update the details for{" "}
            <span className="font-semibold text-foreground">
              {policy?.shippingMethod || "this policy"}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Shipping Method */}
          <div className="space-y-2">
            <Label htmlFor="shippingMethod">Shipping Method</Label>
            <Input
              id="shippingMethod"
              value={formData.shippingMethod}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shippingMethod: e.target.value,
                }))
              }
              placeholder="e.g. Standard Delivery"
            />
            {errors.shippingMethod && (
              <p className="text-xs text-destructive">
                {errors.shippingMethod}
              </p>
            )}
          </div>

          {/* Limits */}
          <div className="space-y-2">
            <Label htmlFor="limits">Limits</Label>
            <Input
              id="limits"
              value={formData.limits}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, limits: e.target.value }))
              }
              placeholder="e.g. Within 5kg"
            />
            {errors.limits && (
              <p className="text-xs text-destructive">{errors.limits}</p>
            )}
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPrice">Min Price (€)</Label>
              <Input
                id="minPrice"
                type="number"
                min={0}
                step="0.01"
                value={formData.minPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minPrice: parseFloat(e.target.value) || 0,
                  }))
                }
              />
              {errors.minPrice && (
                <p className="text-xs text-destructive">{errors.minPrice}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPrice">Max Price (€)</Label>
              <Input
                id="maxPrice"
                type="number"
                min={0}
                step="0.01"
                value={formData.maxPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxPrice: parseFloat(e.target.value) || 0,
                  }))
                }
              />
              {errors.maxPrice && (
                <p className="text-xs text-destructive">{errors.maxPrice}</p>
              )}
            </div>
          </div>

          {/* Extras */}
          <div className="space-y-2">
            <Label htmlFor="Extras">Extras / Notes</Label>
            <Textarea
              id="Extras"
              value={formData.Extras}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, Extras: e.target.value }))
              }
              placeholder="e.g. Delivery within 5-7 business days"
              rows={3}
            />
            {errors.Extras && (
              <p className="text-xs text-destructive">{errors.Extras}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer bg-[#7E1800] hover:bg-[#8B2000]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
