"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShippingPolicy as ShippingPolicyType,
  ShippingPolicyPayload,
} from "@/lib/types/shippingPolicy";
import {
  useShippingPolicies,
  useUpdateShippingPolicy,
} from "@/lib/hooks/useShippingPolicy";

import { ShippingPolicyTable } from "./ShippingPolicyTable";
import { EditShippingPolicyDialog } from "./EditShippingPolicyDialog";

export default function ShippingPolicy() {
  // Data
  const { data: policies, isLoading, error } = useShippingPolicies();
  const updateMutation = useUpdateShippingPolicy();

  // Edit dialog state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<ShippingPolicyType | null>(
    null,
  );

  // Handlers
  function handleEdit(policy: ShippingPolicyType) {
    setEditingPolicy(policy);
    setIsEditOpen(true);
  }

  function handleEditSubmit(
    methodName: string,
    payload: Partial<ShippingPolicyPayload>,
  ) {
    updateMutation.mutate(
      { methodName, payload },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setEditingPolicy(null);
        },
      },
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-destructive gap-2">
        <AlertCircle className="h-8 w-8" />
        <p className="text-lg font-medium">Error loading shipping policies</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shipping Policy</h1>
        <p className="text-muted-foreground mt-1">
          Manage your shipping methods, pricing, and delivery rules.
        </p>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-4">
          <CardTitle>All Shipping Methods</CardTitle>
          <CardDescription>
            A list of all shipping policies including their limits, pricing, and
            extras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ShippingPolicyTable policies={policies || []} onEdit={handleEdit} />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditShippingPolicyDialog
        isOpen={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setEditingPolicy(null);
        }}
        policy={editingPolicy}
        onSubmit={handleEditSubmit}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
