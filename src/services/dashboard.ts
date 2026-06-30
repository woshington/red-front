import type { DashboardSummary } from "../types";
import { api } from "./api";

export const dashboardService = {
    summary: async (startDate?: string, endDate?: string) => {
        let qs = "";
        if (startDate && endDate) {
            qs = `?start_date=${startDate}&end_date=${endDate}`;
        }
        const response = await api.get<DashboardSummary>(`/dashboard/summary${qs}`);
        return response;
    },
}