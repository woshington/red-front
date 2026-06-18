import { useFetch } from "./useFetch";
import type { ListParams } from "../types";
import { turmasService } from "../services/turmas";
import { useState } from "react";

export function useTurmas(params: ListParams = {}) {
    return useFetch(
        () => turmasService.list(params),
        [JSON.stringify(params)]
    );
}

export function useCreateTurma() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const create = async (data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await turmasService.create(data);
            return response;
        } catch (err) {
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

    const update = async (id, data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await turmasService.update(id, data);
            return response;
        } catch (err) {
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

    const remove = async (id) => {
        setLoading(true);
        setError(null);

        try {
            await turmasService.remove(id);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
}