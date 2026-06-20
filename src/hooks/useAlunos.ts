import { useState } from "react";
import { alunosService } from "../services/alunos";
import { useFetch } from "./useFetch";
import type { ListParams } from "../types";

export function useAlunos(params: ListParams = {}) {
    return useFetch(() => alunosService.list(params), [JSON.stringify(params)]);
}

export function useCreateAluno() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await alunosService.create(data);
            return response;
        } catch (err: any) {
            setError(err.message || "Erro ao criar aluno");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
}

export function useUpdateAluno() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = async (id: number, data: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await alunosService.update(id, data);
            return response;
        } catch (err: any) {
            setError(err.message || "Erro ao atualizar aluno");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
}

export function useDeleteAluno() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remove = async (id: number) => {
        setLoading(true);
        setError(null);

        try {
            await alunosService.remove(id);
        } catch (err: any) {
            setError(err.message || "Erro ao remover aluno");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
}

export function useMarkDefaulter() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const markDefaulter = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await alunosService.markDefaulter(id);
        } catch (err: any) {
            setError(err.message || "Erro ao negativar aluno");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { markDefaulter, loading, error };
}

export function useRemoveDefaulter() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const removeDefaulter = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await alunosService.removeDefaulter(id);
        } catch (err: any) {
            setError(err.message || "Erro ao remover negativação do aluno");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { removeDefaulter, loading, error };
}
