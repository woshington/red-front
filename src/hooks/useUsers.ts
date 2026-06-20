import { useState } from "react";
import { usersService } from "../services/users";
import { useFetch } from "./useFetch";
import type { User } from "../services/users";

interface UseUsersProps {
    skip?: number;
    limit?: number;
    name?: string;
}

export function useUsers({ skip = 0, limit = 20, name }: UseUsersProps = {}) {
    return useFetch(
        () => {
            let qs = `?skip=${skip}&limit=${limit}`;
            if (name) qs += `&name=${name}`;
            return usersService.list(qs);
        },
        [skip, limit, name]
    );
}

export function useUpdateUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = async (id: string, data: Partial<User>) => {
        setLoading(true);
        setError(null);
        try {
            const result = await usersService.update(id, data);
            return result;
        } catch (err: any) {
            setError(err.message || "Erro ao atualizar usuário");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
}

export function useCreateUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const result = await usersService.create(data);
            return result;
        } catch (err: any) {
            setError(err.message || "Erro ao criar usuário");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
}
