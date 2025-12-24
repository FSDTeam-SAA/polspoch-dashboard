// src/lib/hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export function useChartData() {
  return useQuery({
    queryKey: ["chart-data"],
    queryFn: async () => {
      const response = await dashboardService.getAllChartData();
      return response.data;
    },
  });
}

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => {
      const response = await dashboardService.getAnalytics();
      return response.data;
    },
  });
}

// call that ChartOverview service here

//call analytics service here
