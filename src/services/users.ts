import { api } from "./api";
import type { Paginated } from "../types";

export interface User {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "FINANCIAL" | "ACADEMIC";
    active: boolean;
    created_at: string;
    updated_at: string;
}

export const usersService = {
    list: async (qs: string) => {
        const data = await api.get<Paginated<User>>(`/users${qs}`);
        return data;
    },
    update: async (id: string, payload: Partial<User>) => {
        const data = await api.put<User>(`/users/${id}`, payload);
        return data;
    },
    create: async (payload: any) => {
        const data = await api.post<User>('/users', payload);
        return data;
    }
};
