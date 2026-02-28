"use client";

import { Pencil, Trash2 } from "lucide-react";
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
  policies: ShippingPolicy[];
  onEdit: (policy: ShippingPolicy) => void;
  onDelete: (policy: ShippingPolicy) => void;
}

export function ShippingPolicyTable({
  policies,
  onEdit,
  onDelete,
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
            <TableHead className="w-[200px]">Shipping Method</TableHead>
            <TableHead>Limits</TableHead>
            <TableHead className="text-center">Min Price (€)</TableHead>
            <TableHead className="text-center">Max Price (€)</TableHead>
            <TableHead>Extras</TableHead>
            <TableHead className="text-center">Updated At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy._id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <Badge
                  variant="outline"
                  className="text-sm px-3 py-1 font-semibold"
                >
                  {policy.shippingMethod}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {policy.limits}
              </TableCell>
              <TableCell className="text-center font-semibold">
                {policy.minPrice} €
              </TableCell>
              <TableCell className="text-center font-semibold">
                {policy.maxPrice} €
              </TableCell>
              <TableCell className="text-muted-foreground max-w-[250px] truncate">
                {policy.Extras}
              </TableCell>
              <TableCell className="text-center text-sm text-muted-foreground">
                {policy.updatedAt
                  ? new Date(policy.updatedAt).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(policy)}
                    className="cursor-pointer h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
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
