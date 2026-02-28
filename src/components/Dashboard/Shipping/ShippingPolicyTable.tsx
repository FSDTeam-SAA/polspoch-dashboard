"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShippingPolicy } from "@/lib/types/shippingPolicy";

interface ShippingPolicyTableProps {
  readonly policies: ShippingPolicy[];
  readonly onEdit: (policy: ShippingPolicy) => void;
}

export function ShippingPolicyTable({
  policies,
  onEdit,
}: ShippingPolicyTableProps) {
  if (policies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No shipping policies found</p>
        <p className="text-sm mt-1">
          Shipping policies will appear here once created.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Method</TableHead>
            <TableHead className="text-center">Base Price (€)</TableHead>
            <TableHead className="text-center">Free Weight (kg)</TableHead>
            <TableHead className="text-center">Extra P/K (€)</TableHead>
            <TableHead className="text-center">Extra Step</TableHead>
            <TableHead className="text-center">Max Size (mm)</TableHead>
            <TableHead className="text-center">Max Cost (€)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy._id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <Badge
                  variant="outline"
                  className="text-sm px-3 py-1 font-semibold uppercase"
                >
                  {policy.methodName}
                </Badge>
              </TableCell>
              <TableCell className="text-center font-semibold">
                {policy.basePrice} €
              </TableCell>
              <TableCell className="text-center">
                {policy.methodName === "truck" ? "—" : policy.freeWeightLimit}
              </TableCell>
              <TableCell className="text-center">
                {policy.methodName === "truck"
                  ? "—"
                  : `${policy.extraWeightPrice} €`}
              </TableCell>
              <TableCell className="text-center">
                {policy.methodName === "truck" ? "—" : policy.extraWeightStep}
              </TableCell>
              <TableCell className="text-center">
                {policy.methodName === "truck" ? "—" : policy.maxSizeAllowed}
              </TableCell>
              <TableCell className="text-center font-bold text-primary">
                {policy.methodName === "truck"
                  ? "—"
                  : `${policy.maxTotalCost} €`}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(policy)}
                    className="cursor-pointer h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
