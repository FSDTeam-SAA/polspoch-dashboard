"use client";

// src/components/Dashboard/Overview/Overview.tsx

import CardOverview from "./CardOverview";
import { CircleDollarSign, Users, Package, TrendingUp } from "lucide-react";
import ChartOverview from "./ChartOverview";
import RecentOverview from "./RecentOverview";
import { useAnalyticsOverview } from "@/lib/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Overview() {
  const { data: analytics, isLoading } = useAnalyticsOverview();

  return (
    <div className="p-5">
      <div className="space-y-8">
        <div className="stat-cards flex gap-4">
          <CardOverview
            title="Total Users"
            numberInfo={
              isLoading ? (
                <Skeleton className="h-12 w-20" />
              ) : (
                (analytics?.totalUser ?? 0)
              )
            }
            icon={<Users />}
          />
          <CardOverview
            title="Total Products"
            numberInfo={
              isLoading ? (
                <Skeleton className="h-12 w-20" />
              ) : (
                (analytics?.productCount ?? 0)
              )
            }
            icon={<Package />}
          />
          <CardOverview
            title="Revenue"
            numberInfo={
              isLoading ? (
                <Skeleton className="h-12 w-20" />
              ) : (
                `€${analytics?.totalAmount?.toLocaleString() ?? 0}`
              )
            }
            icon={<CircleDollarSign />}
          />
          <CardOverview
            title="Product Sales"
            numberInfo={
              isLoading ? (
                <Skeleton className="h-12 w-20" />
              ) : (
                (analytics?.totalProductSell ?? 0)
              )
            }
            icon={<TrendingUp />}
          />
        </div>

        <div>
          <div className="col-span-8">
            <ChartOverview />
          </div>
        </div>

        <div>
          <RecentOverview />
        </div>
      </div>
    </div>
  );
}
