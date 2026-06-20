import { useState } from "react";
import { professoresService } from "../services/professores";
import { useFetch } from "./useFetch";
import type { ListParams } from "../types";


export function useGetProfessores(params: ListParams = {}) {
    return useFetch(() => professoresService.list(params), [JSON.stringify(params)]);
}

export function useCreateProfessores() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const create = async (data: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await professoresService.create(data);
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
}

export function useUpdateProfessores() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const update = async (id: number, data: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await professoresService.update(id, data);
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
}

export function useProfessorClasses() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getClasses = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await professoresService.getClasses(id);
            return data;
        } catch (err: any) {
            setError(err.message || "Erro ao carregar turmas");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { getClasses, loading, error };
}

export function useDeleteProfessores() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const remove = async (id: number) => {
        setLoading(true);
        setError(null);

        try {
            await professoresService.remove(id);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
}