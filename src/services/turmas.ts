import type { ListParams, Paginated, Turma } from "../types";
import { api, toQueryString } from "./api";

export const turmasService = {
    create: (data: Omit<Turma, "id" | "created_at" | "updated_at">) =>
        api.post<Turma>("/classes", data),

    list: (params?: ListParams) =>
        api.get<Paginated<Turma>>("/classes" + toQueryString(params)),

    update: (id: number, data: Omit<Turma, "id" | "created_at" | "updated_at">) =>
        api.put<Turma>(`/classes/${id}`, data),

    remove: (id: number) =>
        api.delete<Turma>(`/classes/${id}`),
}