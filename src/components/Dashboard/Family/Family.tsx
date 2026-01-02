"use client";

import { Button } from "@/components/ui/button";
import { useFamilies } from "@/lib/hooks/useFamilyService";
import { Family } from "@/lib/types/family";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FamilyDialog } from "./FamilyDialog";
import { FamilyTable } from "./FamilyTable";

export default function FamilyPage() {
  const { data: families, isLoading, error } = useFamilies();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  const handleCreate = () => {
    setEditingFamily(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (family: Family) => {
    setEditingFamily(family);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Loading families...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-destructive">
        Error loading families. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Families</h1>
          <p className="text-muted-foreground">
            Manage your product families here.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-[#7E1800] hover:bg-[#7E1800] cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4 text-white" /> Add Family
        </Button>
      </div>

      <FamilyTable families={families || []} onEdit={handleEdit} />

      <FamilyDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        familyToEdit={editingFamily}
      />
    </div>
  );
}
