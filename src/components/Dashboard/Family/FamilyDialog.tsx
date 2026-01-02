"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateFamily, useUpdateFamily } from "@/lib/hooks/useFamilyService";
import { Family } from "@/lib/types/family";
import { useState } from "react";
import { toast } from "sonner";

interface FamilyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  familyToEdit?: Family | null;
}

export function FamilyDialog({
  open,
  onOpenChange,
  familyToEdit,
}: FamilyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {familyToEdit ? "Edit Family" : "Add New Family"}
          </DialogTitle>
        </DialogHeader>
        <FamilyForm
          familyToEdit={familyToEdit}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface FamilyFormProps {
  familyToEdit?: Family | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function FamilyForm({ familyToEdit, onSuccess, onCancel }: FamilyFormProps) {
  const [name, setName] = useState(familyToEdit?.familyName || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    familyToEdit?.img?.url || null,
  );

  const { mutate: createFamily, isPending: isCreating } = useCreateFamily();
  const { mutate: updateFamily, isPending: isUpdating } = useUpdateFamily();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("familyName", name);
    if (file) {
      formData.append("img", file);
    }

    if (familyToEdit) {
      updateFamily(
        { id: familyToEdit._id, formData },
        {
          onSuccess: () => {
            onSuccess();
          },
        },
      );
    } else {
      if (!file) {
        toast.error("Image is required for new family");
        return;
      }
      createFamily(formData, {
        onSuccess: () => {
          onSuccess();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Family Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter family name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {preview && (
          <div className="relative mt-2 h-40 w-full overflow-hidden rounded-md border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {familyToEdit && !file && (
          <p className="text-xs text-muted-foreground">
            Leave empty to keep existing image
          </p>
        )}
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="bg-[#7E1800] hover:bg-[#7E1800] cursor-pointer text-white hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isCreating || isUpdating}
          className="bg-[#7E1800] hover:bg-[#7E1800] cursor-pointer text-white hover:text-white"
        >
          {isCreating || isUpdating ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}
