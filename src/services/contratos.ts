import type { ListParams, Paginated, Contrato } from "../types";
import { api, toQueryString } from "./api";

export const contratosService = {
    list: (params?: ListParams) =>
        api.get<Paginated<Contrato>>("/contracts" + toQueryString(params)),

    create: (data: any) =>
        api.post<Contrato>("/contracts", data),

    update: (id: string, data: Partial<Contrato>) =>
        api.put<Contrato>(`/contracts/${id}`, data),

    remove: (id: string) =>
        api.delete<Contrato>(`/contracts/${id}`),

    pause: (id: string, data?: { expected_return_date?: string }) =>
        api.put<Contrato>(`/contracts/${id}/pause`, data || {}),

    reactivate: (id: string) =>
        api.put<Contrato>(`/contracts/${id}/reactivate`, {}),

    cancel: (id: string, reason: string) =>
        api.put<Contrato>(`/contracts/${id}/cancel`, { reason }),
};
