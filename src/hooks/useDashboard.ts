import { dashboardService } from "../services/dashboard";
import { useFetch } from "./useFetch";

export function useDashboard() {
    return useFetch(() => dashboardService.summary(), []);
}