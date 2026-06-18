import { useState } from "react";
import { contratosService } from "../services/contratos";
import { useFetch } from "./useFetch";
import type { ListParams } from "../types";

export function useContratos(params: ListParams = {}) {
    return useFetch(() => contratosService.list(params), [JSON.stringify(params)]);
}

export function useCreateContrato() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await contratosService.create(data);
            return response;
        } catch (err: any) {
            setError(err.message || "Erro ao criar contrato");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
}

export function useUpdateContrato() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = async (id: string, data: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await contratosService.update(id, data);
            return response;
        } catch (err: any) {
            setError(err.message || "Erro ao atualizar contrato");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
}

export function useDeleteContrato() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remove = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            await contratosService.remove(id);
        } catch (err: any) {
            setError(err.message || "Erro ao remover contrato");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
}
