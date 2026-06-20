import { dashboardService } from "../services/dashboard";
import { useFetch } from "./useFetch";

export function useDashboard(month?: number, year?: number) {
    return useFetch(() => dashboardService.summary(month, year), [month, year]);
}