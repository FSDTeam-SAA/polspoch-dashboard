"use client";

import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly policy: ShippingPolicy | null;
  readonly onSubmit: (
    methodName: string,
    payload: Partial<ShippingPolicyPayload>,
  ) => void;
  readonly isPending: boolean;
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
    methodName: p?.methodName ?? "courier",
    basePrice: p?.basePrice ?? 0,
    freeWeightLimit: p?.freeWeightLimit ?? 0,
    extraWeightPrice: p?.extraWeightPrice ?? 0,
    extraWeightStep: p?.extraWeightStep ?? 0,
    sizeThreshold: p?.sizeThreshold ?? 0,
    sizeSurcharge: p?.sizeSurcharge ?? 0,
    maxSizeAllowed: p?.maxSizeAllowed ?? 0,
    maxTotalCost: p?.maxTotalCost ?? 0,
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

    if (formData.basePrice < 0) newErrors.basePrice = "Cannot be negative";

    // Only validate other fields if not truck
    if (formData.methodName !== "truck") {
      if (formData.freeWeightLimit < 0)
        newErrors.freeWeightLimit = "Cannot be negative";
      if (formData.extraWeightPrice < 0)
        newErrors.extraWeightPrice = "Cannot be negative";
      if (formData.extraWeightStep <= 0)
        newErrors.extraWeightStep = "Must be greater than 0";
      if (formData.sizeThreshold < 0)
        newErrors.sizeThreshold = "Cannot be negative";
      if (formData.sizeSurcharge < 0)
        newErrors.sizeSurcharge = "Cannot be negative";
      if (formData.maxSizeAllowed < 0)
        newErrors.maxSizeAllowed = "Cannot be negative";
      if (formData.maxTotalCost < 0)
        newErrors.maxTotalCost = "Cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!policy || !validate()) return;
    onSubmit(policy.methodName, formData);
  }

  const isTruck = formData.methodName === "truck";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Shipping Policy</DialogTitle>
          <DialogDescription>
            Update the pricing rules for{" "}
            <span className="font-bold text-foreground uppercase">
              {policy?.methodName || "this policy"}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Base Price & Free Weight (Free weight hidden for truck) */}
          <div className={isTruck ? "space-y-2" : "grid grid-cols-2 gap-4"}>
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (€)</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    basePrice: Number.parseFloat(e.target.value) || 0,
                  }))
                }
              />
              {errors.basePrice && (
                <p className="text-xs text-destructive">{errors.basePrice}</p>
              )}
            </div>
            {!isTruck && (
              <div className="space-y-2">
                <Label htmlFor="freeWeightLimit">Free Weight Limit (kg)</Label>
                <Input
                  id="freeWeightLimit"
                  type="number"
                  value={formData.freeWeightLimit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      freeWeightLimit: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                />
                {errors.freeWeightLimit && (
                  <p className="text-xs text-destructive">
                    {errors.freeWeightLimit}
                  </p>
                )}
              </div>
            )}
          </div>

          {!isTruck && (
            <>
              {/* Extra Weight Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="extraWeightPrice">
                    Extra Weight Price (€)
                  </Label>
                  <Input
                    id="extraWeightPrice"
                    type="number"
                    step="0.01"
                    value={formData.extraWeightPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        extraWeightPrice:
                          Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                  {errors.extraWeightPrice && (
                    <p className="text-xs text-destructive">
                      {errors.extraWeightPrice}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extraWeightStep">
                    Extra Weight Step (kg)
                  </Label>
                  <Input
                    id="extraWeightStep"
                    type="number"
                    value={formData.extraWeightStep}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        extraWeightStep: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                  {errors.extraWeightStep && (
                    <p className="text-xs text-destructive">
                      {errors.extraWeightStep}
                    </p>
                  )}
                </div>
              </div>

              {/* Size Limits & Surcharge */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sizeThreshold">Size Threshold (mm)</Label>
                  <Input
                    id="sizeThreshold"
                    type="number"
                    value={formData.sizeThreshold}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sizeThreshold: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                  {errors.sizeThreshold && (
                    <p className="text-xs text-destructive">
                      {errors.sizeThreshold}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sizeSurcharge">Size Surcharge (€)</Label>
                  <Input
                    id="sizeSurcharge"
                    type="number"
                    step="0.01"
                    value={formData.sizeSurcharge}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sizeSurcharge: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                  {errors.sizeSurcharge && (
                    <p className="text-xs text-destructive">
                      {errors.sizeSurcharge}
                    </p>
                  )}
                </div>
              </div>

              {/* Max Size & Max Cost */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxSizeAllowed">Max Size Allowed (mm)</Label>
                  <Input
                    id="maxSizeAllowed"
                    type="number"
                    value={formData.maxSizeAllowed}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxSizeAllowed: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                  {errors.maxSizeAllowed && (
                    <p className="text-xs text-destructive">
                      {errors.maxSizeAllowed}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTotalCost">Max Total Cost (€)</Label>
                  <Input
                    id="maxTotalCost"
                    type="number"
                    step="0.01"
                    value={formData.maxTotalCost}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxTotalCost: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                  {errors.maxTotalCost && (
                    <p className="text-xs text-destructive">
                      {errors.maxTotalCost}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#7E1800] hover:bg-[#8B2000]"
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
