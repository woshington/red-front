import { useState } from "react";
import { installmentsService } from "../services/installments";
import { useFetch } from "./useFetch";


interface UseInstallmentsProps {
    skip?: number;
    limit?: number;
    status?: string;
    student_id?: string;
    contract_id?: string;
    start_date?: string;
    end_date?: string;
    date_type?: string;
}

export function useInstallments({ skip = 0, limit = 50, status, student_id, contract_id, start_date, end_date, date_type }: UseInstallmentsProps = {}) {
    return useFetch(
        () => {
            const params: any = { skip, limit };
            if (status) params.status = status;
            if (student_id) params.student_id = student_id;
            if (contract_id) params.contract_id = contract_id;
            if (start_date) params.start_date = start_date;
            if (end_date) params.end_date = end_date;
            if (date_type) params.date_type = date_type;
            return installmentsService.list(params);
        },
        [skip, limit, status, student_id, contract_id, start_date, end_date, date_type]
    );
};

export function useMarkInstallmentPaid() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const markPaid = async (id: string, data: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await installmentsService.markPaid(id, data);
            return response;
        } catch (err: any) {
            setError(err.message || "Erro ao baixar pagamento");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { markPaid, loading, error };
}

export function useCreateInstallment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: { contract_id: string; value: number; due_date: string }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await installmentsService.create(data);
            return response;
        } catch (err: any) {
            setError(err.message || "Erro ao criar parcela");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
}

export function useCancelInstallment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cancel = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await installmentsService.cancel(id);
            return response;
        } catch (err: any) {
            setError(err.message || "Erro ao cancelar parcela");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { cancel, loading, error };
}
