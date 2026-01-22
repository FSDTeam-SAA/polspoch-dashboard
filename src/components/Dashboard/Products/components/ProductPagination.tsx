"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setItemsPerPage: (val: number) => void;
  setCurrentPage: (val: number | ((p: number) => number)) => void;
  isFetching: boolean;
}

export function ProductPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  isFetching,
}: ProductPaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border mt-4">
      {/* Left Side: Indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Rows:</span>
          <select
            className="h-8 w-[60px] rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[8, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-muted/30 px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground border">
          Showing page <span className="text-foreground">{currentPage}</span> of{" "}
          <span className="text-foreground">{totalPages}</span>
        </div>
      </div>

      {/* Right Side: Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-9 px-4 rounded-lg gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1 || isFetching}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, idx) => {
            if (page === "...")
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="text-muted-foreground px-2"
                >
                  ...
                </span>
              );

            const pageNum = page as number;
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "ghost"}
                className={`h-9 w-9 p-0 rounded-lg font-medium cursor-pointer transition-colors ${
                  currentPage === pageNum
                    ? "bg-[#7E1800] hover:bg-[#8B2000] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setCurrentPage(pageNum)}
                disabled={isFetching}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="h-9 px-4 rounded-lg gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages || isFetching}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
