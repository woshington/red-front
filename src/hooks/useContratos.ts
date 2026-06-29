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

export function usePauseContrato() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pause = async (id: string, data?: { expected_return_date?: string }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contratosService.pause(id, data);
            return response;
        } catch (err: any) {
            setError(err.message || "Erro ao pausar contrato");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { pause, loading, error };
}

export function useReactivateContrato() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reactivate = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contratosService.reactivate(id);
            return response;
        } catch (err: any) {
            setError(err.message || "Erro ao reativar contrato");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { reactivate, loading, error };
}

export function useCancelContrato() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cancel = async (id: string, reason: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contratosService.cancel(id, reason);
            return response;
        } catch (err: any) {
            setError(err.message || "Erro ao cancelar contrato");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { cancel, loading, error };
}
