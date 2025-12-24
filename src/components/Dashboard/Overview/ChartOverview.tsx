"use client";
import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useChartData } from "@/lib/hooks/useDashboard";
import { ChartData } from "@/lib/types/chartdata";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomTooltipPayload {
  value: number;
  name: string;
  dataKey: string;
  payload: ChartData;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length > 0) {
    const p = payload[0];
    return (
      <div className="bg-white shadow-md rounded-lg p-3 border text-sm">
        <p className="text-gray-500">Revenue</p>
        <p className="text-xl font-bold text-gray-800">
          €{p.value.toLocaleString()}
        </p>
        <p className="text-gray-500">{label}</p>
      </div>
    );
  }
  return null;
};

const SKELETON_HEIGHTS = [40, 25, 35, 45, 60, 55, 70, 65, 80, 75, 90, 85];

const ChartOverview: React.FC = () => {
  const { data: chartData = [], isLoading } = useChartData();

  // Show loading state using ShadCN Skeleton
  if (isLoading) {
    return (
      <Card className="p-6 rounded-2xl h-[450px] shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="flex-1 flex items-end gap-2 px-2 pb-10">
          {SKELETON_HEIGHTS.map((height, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-t-md"
              style={{
                height: `${height}%`,
                opacity: (i + 1) / 12, // Suggests a trend
              }}
            />
          ))}
        </div>

        <div className="flex justify-between px-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-10" />
          ))}
        </div>
      </Card>
    );
  }

  // Abbreviate months if they are too long (e.g., "January" -> "Jan")
  const formattedData = chartData.map((item) => ({
    ...item,
    month: item.month.substring(0, 3),
  }));

  return (
    <Card className="p-6 rounded-2xl h-[450px] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="90%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="totalAmount"
              stroke="#14b8a6"
              fill="url(#colorRevenue)"
              fillOpacity={1}
              strokeWidth={3}
              dot={{ r: 4, fill: "#14b8a6" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ChartOverview;
