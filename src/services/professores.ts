import type { ListParams, Paginated, Professor } from "../types";
import { api, toQueryString } from "./api";

export const professoresService = {
    list: (params?: ListParams) =>
        api.get<Paginated<Professor>>("/teachers" + toQueryString(params)),

    create: (data: Omit<Professor, "id" | "created_at" | "updated_at">) =>
        api.post<Professor>("/teachers", data),

    update: (id: number, data: Omit<Professor, "id" | "created_at" | "updated_at">) =>
        api.put<Professor>(`/teachers/${id}`, data),

    remove: (id: number) =>
        api.delete<Professor>(`/teachers/${id}`),
};