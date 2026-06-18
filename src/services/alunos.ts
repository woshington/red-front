import type { ListParams, Paginated, Aluno } from "../types";
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
};
