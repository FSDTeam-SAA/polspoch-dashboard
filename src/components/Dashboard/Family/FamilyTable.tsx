"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteFamily } from "@/lib/hooks/useFamilyService";
import { Family } from "@/lib/types/family";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface FamilyTableProps {
  families: Family[];
  onEdit: (family: Family) => void;
}

export function FamilyTable({ families, onEdit }: FamilyTableProps) {
  const { mutate: deleteFamily, isPending: isDeleting } = useDeleteFamily();

  const handleDelete = async (id: string) => {
    try {
      await deleteFamily(id);

      toast.success("Family deleted successfully");
    } catch {
      toast.error("Failed to delete family");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Family Name</TableHead>
            {/* <TableHead>Created At</TableHead> */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {families?.length > 0 ? (
            families.map((family) => (
              <TableRow key={family._id}>
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                    {family.img?.url ? (
                      <Image
                        src={family.img.url}
                        alt={family.familyName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        No Img
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {family.familyName}
                </TableCell>
                {/* <TableCell>
                  {family.createdAt
                    ? new Date(family.createdAt).toLocaleDateString()
                    : "N/A"}
                </TableCell> */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(family)}
                      className="cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive cursor-pointer"
                      onClick={() => handleDelete(family._id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                No families found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
