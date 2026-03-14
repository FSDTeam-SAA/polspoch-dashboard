"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TUser } from "@/types/user";
import { useUpdateUser } from "@/lib/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { AxiosError } from "axios";

interface UserEditModalProps {
  user: TUser | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserEditModal = ({ user, isOpen, onClose }: UserEditModalProps) => {
  const [role, setRole] = useState<string>(user?.role || "");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  const queryClient = useQueryClient();
  const { mutate: updateUser } = useUpdateUser();

  // The component will be remounted with a new key when the user changes,
  // so we don't need the useEffect here anymore.

  const handleSave = () => {
    if (!user) return;

    setStatus("loading");
    updateUser(
      { id: user._id, data: { role } },
      {
        onSuccess: (res: { success: boolean; message?: string }) => {
          if (res.success) {
            setStatus("success");
            setMessage("User role updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["all-users"] });
            setTimeout(() => {
              onClose();
            }, 1500);
          } else {
            setStatus("error");
            setMessage(res.message || "Failed to update role");
          }
        },
        onError: (error: AxiosError<{ message?: string }>) => {
          setStatus("error");
          setMessage(
            error.response?.data?.message || "An error occurred while updating",
          );
        },
      },
    );
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit User Role
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              User
            </Label>
            <p className="font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="role"
              className="text-sm font-medium text-muted-foreground uppercase tracking-wider"
            >
              Select Role
            </Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={status === "loading" || status === "success"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {status === "success" && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-600 border border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <span>{message}</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <span>{message}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={status === "loading" || status === "success"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              status === "loading" || status === "success" || role === user.role
            }
            className="min-w-[100px]"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
