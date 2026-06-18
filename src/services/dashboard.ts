import type { DashboardSummary } from "../types";
import { api } from "./api";

export const dashboardService = {
    summary: async () => {
        const response = await api.get<DashboardSummary>("/dashboard");
        return response;
    },
}