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

interface ApiChartData {
  month: string;
  revenue: number;
}

interface CustomTooltipPayload {
  value: number;
  name: string;
  dataKey: string;
  payload: ApiChartData;
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
          ${p.value.toLocaleString()}
        </p>
        <p className="text-gray-500">{label}</p>
      </div>
    );
  }
  return null;
};

// Fake JSON data
const fakeData: ApiChartData[] = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 8000 },
  { month: "Apr", revenue: 17000 },
  { month: "May", revenue: 14000 },
  { month: "Jun", revenue: 20000 },
  { month: "Jul", revenue: 18000 },
  { month: "Aug", revenue: 22000 },
  { month: "Sep", revenue: 19000 },
  { month: "Oct", revenue: 24000 },
  { month: "Nov", revenue: 21000 },
  { month: "Dec", revenue: 25000 },
];

const ChartOverview: React.FC = () => {
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
            data={fakeData} // ✅ using fake JSON data
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
              dataKey="revenue"
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
