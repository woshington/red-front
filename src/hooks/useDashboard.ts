import { dashboardService } from "../services/dashboard";
import { useFetch } from "./useFetch";

export function useDashboard(startDate?: string, endDate?: string) {
    return useFetch(() => dashboardService.summary(startDate, endDate), [startDate, endDate]);
}