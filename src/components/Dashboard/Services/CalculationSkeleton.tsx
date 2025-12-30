"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon } from "lucide-react";

export function CalculationSkeleton({ title }: { title: string }) {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-pulse">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-200">
        {title}
      </h1>

      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 w-24 h-10">
          <ArrowLeftIcon className="w-4 h-4 text-gray-200" />
          <Skeleton className="h-4 w-12 bg-gray-100" />
        </div>
      </div>

      {/* Main Table Skeleton */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-10">
        <div className="bg-gray-100 h-12 w-full border-b border-gray-200" />
        <div className="space-y-4 p-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 flex-1 bg-gray-50" />
              <Skeleton className="h-8 flex-1 bg-gray-50" />
              <Skeleton className="h-8 flex-1 bg-gray-50" />
            </div>
          ))}
        </div>
      </div>

      {/* Labour & Margin Skeletons */}
      <div className="flex gap-16 mb-10">
        <div className="border border-gray-200 rounded-lg w-80 overflow-hidden">
          <div className="bg-gray-100 h-10 w-full border-b border-gray-200 p-2">
            <Skeleton className="h-4 w-20 bg-gray-200" />
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 bg-gray-50" />
              <Skeleton className="h-8 w-20 bg-gray-100" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 bg-gray-50" />
              <Skeleton className="h-8 w-20 bg-gray-100" />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg w-64 overflow-hidden">
          <div className="bg-gray-100 h-10 w-full border-b border-gray-200 p-2">
            <Skeleton className="h-4 w-20 bg-gray-200" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24 bg-gray-50" />
              <Skeleton className="h-8 w-20 bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Skeleton className="h-10 w-32 mx-auto rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
