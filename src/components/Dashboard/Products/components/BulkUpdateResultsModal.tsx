"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";
import { BulkUpdateResponse } from "@/lib/services/productService";

interface BulkUpdateResultsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly results: BulkUpdateResponse | null;
}

export function BulkUpdateResultsModal({
  isOpen,
  onClose,
  results,
}: BulkUpdateResultsModalProps) {
  if (!results) return null;

  const { data, message } = results;
  const hasErrors = data.errors && data.errors.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            {hasErrors ? (
              <AlertCircle className="h-6 w-6 text-amber-500" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            )}
            Bulk Update Results
          </DialogTitle>
          <DialogDescription>
            {message || "Summary of the bulk update process."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 grid grid-cols-3 gap-4 border-y bg-muted/30">
          <div className="flex flex-col items-center justify-center p-3 bg-background rounded-lg border shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">
              Total
            </span>
            <span className="text-2xl font-bold">{data.totalRows}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-background rounded-lg border shadow-sm border-green-100">
            <span className="text-sm font-medium text-green-600">Success</span>
            <span className="text-2xl font-bold text-green-600">
              {data.success}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-background rounded-lg border shadow-sm border-red-100">
            <span className="text-sm font-medium text-red-600">Failed</span>
            <span className="text-2xl font-bold text-red-600">
              {data.failed}
            </span>
          </div>
        </div>

        {hasErrors && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-6 py-3 bg-muted/10 border-b flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <h4 className="text-sm font-semibold text-red-600">
                Issues Found ({data.errors.length})
              </h4>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
              <div className="p-6 space-y-4">
                {data.errors.map((error, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-md border bg-card text-sm space-y-1 hover:border-red-200 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-semibold text-foreground">
                        {error.productName || "Unknown Product"}
                      </span>
                      {error.reference && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded font-mono uppercase">
                          Ref: {error.reference}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed flex items-start gap-1.5 pt-1">
                      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" />
                      {error.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!hasErrors && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">All products updated!</h3>
            <p className="text-muted-foreground max-w-xs">
              Every row in your file was processed successfully without any
              errors.
            </p>
          </div>
        )}

        <DialogFooter className="p-4 bg-muted/10 border-t">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
