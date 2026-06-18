import type { Curso, ListParams, Paginated } from "../types";
import { api, toQueryString } from "./api";

export const cursosService = {
    create: (data: Omit<Curso, "id" | "created_at" | "updated_at">) =>
        api.post<Curso>("/classes", data),

    list: (params?: ListParams) =>
        api.get<Paginated<Curso>>("/classes" + toQueryString(params)),
}