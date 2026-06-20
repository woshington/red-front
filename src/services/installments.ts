import type { ListParams, Paginated } from "../types";
import { api, toQueryString } from "./api";

export interface Installment {
    id: string;
    contract_id: string;
    installment_number: number;
    value: number;
    due_date: string;
    status: string;
    paid_at?: string;
    paid_value?: number;
}

export const installmentsService = {
    list: (params?: ListParams & { contract_id?: string; student_id?: string; status?: string }) =>
        api.get<Paginated<Installment>>("/installments" + toQueryString(params)),

    markPaid: (id: string, data: { paid_value: number; paid_at: string; payment_method: string }) =>
        api.put<Installment>(`/installments/${id}/mark-paid`, data),

    cancel: (id: string) =>
        api.post<Installment>(`/installments/${id}/cancel`, {}),
};
