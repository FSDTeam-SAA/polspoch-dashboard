// EditServiceDialog.tsx
"use client";

import { ServiceItem } from "./Services";
import { EditRebarDialog } from "./Rebar/EditRebarDialog";
import { EditBendingDialog } from "./Bending/EditBendingDialog";
import { EditCuttingDialog } from "./Cutting/EditCuttingDialog";

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
  if (!service) return null;

  if (service.type === "rebar") {
    return (
      <EditRebarDialog
        open={open}
        onOpenChange={onOpenChange}
        service={service}
      />
    );
  }

  if (service.type === "bending") {
    return (
      <EditBendingDialog
        open={open}
        onOpenChange={onOpenChange}
        service={service}
      />
    );
  }

  if (service.type === "cutting") {
    return (
      <EditCuttingDialog
        open={open}
        onOpenChange={onOpenChange}
        service={service}
      />
    );
  }

  return null;
}
