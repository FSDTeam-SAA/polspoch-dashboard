// src/lib/services/dashboardService.ts

import axiosInstance from "../instance/axios-instance";

//chartdata type import
import { ChartData } from "../types/chartdata";

//analytics type import
import { Analytics } from "../types/analytics";

interface ChartDataResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: ChartData[];
}

interface AnalyticsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Analytics;
}

class DashboardService {
  /**
   * Get all chart data for analytics
   */
  async getAllChartData(): Promise<ChartDataResponse> {
    const response = await axiosInstance.get<ChartDataResponse>(
      "/analytics/chart-data"
    );
    return response.data;
  }

  /**
   * Get general analytics overview
   */
  async getAnalytics(): Promise<AnalyticsResponse> {
    const response = await axiosInstance.get<AnalyticsResponse>(
      "/analytics/data"
    );
    return response.data;
  }
}

export const dashboardService = new DashboardService();

// ChartOverview api here

//overview api here