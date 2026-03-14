"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { TUser } from "@/types/user";

interface UserViewModalProps {
  user: TUser | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserViewModal = ({ user, isOpen, onClose }: UserViewModalProps) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <User className="h-6 w-6 text-primary" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Full Name
                </h3>
                <p className="text-lg font-semibold">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <Badge
                className={`h-fit ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-blue-100 text-blue-700 border-blue-200"
                }`}
              >
                {user.role}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email Address
                  </h3>
                  <p className="text-sm font-medium break-all">{user.email}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Role
                  </h3>
                  <p className="text-sm font-medium">{user.role}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Status
                  </h3>
                  <div className="flex items-center gap-1">
                    {user.isVerified ? (
                      <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <CheckCircle className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm font-medium text-destructive">
                        <XCircle className="h-3 w-3" /> Unverified
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Joined Date
                  </h3>
                  <p className="text-sm font-medium">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserViewModal;
