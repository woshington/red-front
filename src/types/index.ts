import type { Aluno } from "./aluno";

export interface Curso {
    id: number;
    nome: string;
    descricao: string;
    duracao_horas: number;
    ativo: boolean;
    created_at: string;
}

export interface Professor {
    id: number;
    name: string;
    email: string;
    especialidade: string;
    ativo: boolean;
}

export interface Turma {
    id: string;
    name: string;
    teacher: Professor;
    year: number;
    student_count: number;
    max_students: number;
    is_active: boolean;
}


export type StatusPagamento = "pendente" | "pago" | "cancelado" | "atrasado";

export interface Pagamento {
    id: number;
    aluno_id: number;
    aluno?: Aluno;
    turma_id: number;
    turma?: Turma;
    valor: number;
    vencimento: string;
    pago_em: string | null;
    status: StatusPagamento;
}

/* ── Respostas paginadas ──────────────────────── */

export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
}

/* ── Parâmetros de listagem ───────────────────── */

export interface ListParams {
    page?: number;
    size?: number;
    search?: string;
    [key: string]: unknown;
}

export interface DashboardSummary {
    total_active_students: number;
    total_active_contracts: number;
    total_active_courses: number;
    total_classes: number;
    monthly_expected_revenue: number;
    current_month_received: number;
    current_month_pending: number;
    overdue_payments_count: number;
    overdue_total: number;
    delinquency_rate: number;
    blacklisted_count: number;
    good_payers_count: number;
    recent_payments: Pagamento[];
}

export type PlanType = "MONTHLY" | "SEMESTERLY" | "YEARLY" | "CUSTOM";
export type PaymentMethod = "CASH" | "CREDIT_CARD" | "PIX" | "BOLETO";

export interface Contrato {
    id: string;
    student_id: number;
    student?: Aluno;
    monthly_fee: number;
    payment_day: number;
    start_date: string;
    plan_type: PlanType;
    total_months: number | null;
    signed_at: string | null;
    payment_method: PaymentMethod;
    generate_payments: boolean;
    notes: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}