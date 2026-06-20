import { useFetch } from "./useFetch";
import type { ListParams } from "../types";
import { turmasService } from "../services/turmas";
import { useState } from "react";

export function useTurmas(params: ListParams & { name?: string; is_active?: boolean } = {}) {
    return useFetch(
        () => turmasService.list(params),
        [JSON.stringify(params)]
    );
}

export function useCreateTurma() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const create = async (data: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await turmasService.create(data);
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

export function useUpdateTurma() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const update = async (id: string, data: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await turmasService.update(id, data);
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

export function useDeleteTurma() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const remove = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            await turmasService.remove(id);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
}

export function useTransferStudents() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const transfer = async (studentIds: string[], targetClassId: string | null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await turmasService.transferStudents(studentIds, targetClassId);
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { transfer, loading, error };
}