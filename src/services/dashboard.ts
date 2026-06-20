import type { DashboardSummary } from "../types";
import { api } from "./api";

export const dashboardService = {
    summary: async (month?: number, year?: number) => {
        let qs = "";
        if (month && year) {
            qs = `?month=${month}&year=${year}`;
        }
        const response = await api.get<DashboardSummary>(`/dashboard/summary${qs}`);
        return response;
    },
}