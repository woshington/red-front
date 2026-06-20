import type { ListParams, Paginated } from "../types";
import type { Aluno } from "../types/aluno";
import { api, toQueryString } from "./api";

export const alunosService = {
    list: (params?: ListParams) =>
        api.get<Paginated<Aluno>>("/students" + toQueryString(params)),

    create: (data: Omit<Aluno, "id" | "created_at" | "updated_at">) =>
        api.post<Aluno>("/students", data),

    update: (id: number, data: Omit<Aluno, "id" | "created_at" | "updated_at">) =>
        api.put<Aluno>(`/students/${id}`, data),

    remove: (id: number) =>
        api.delete<Aluno>(`/students/${id}`),

    markDefaulter: (id: number) =>
        api.post<Aluno>(`/students/${id}/mark-defaulter`, {}),

    removeDefaulter: (id: number) =>
        api.post<Aluno>(`/students/${id}/remove-defaulter`, {}),
};
