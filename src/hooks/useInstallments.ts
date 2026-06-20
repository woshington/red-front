import { useState } from "react";
import { installmentsService } from "../services/installments";
import { useFetch } from "./useFetch";
import type { ListParams } from "../types";


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
            let qs = `?skip=${skip}&limit=${limit}`;
            if (status) qs += `&status=${status}`;
            if (student_id) qs += `&student_id=${student_id}`;
            if (contract_id) qs += `&contract_id=${contract_id}`;
            if (start_date) qs += `&start_date=${start_date}`;
            if (end_date) qs += `&end_date=${end_date}`;
            if (date_type) qs += `&date_type=${date_type}`;
            return installmentsService.list(qs);
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
