export type StudentLevel =
    | "BEGINNER"
    | "BASIC"
    | "INTERMEDIATE"
    | "ADVANCED";


export interface Aluno {
    id: number;
    name: string;
    email: string;
    phone: string;
    document: string;
    level: StudentLevel;
    active: boolean;
    defaulter_date: string | null;
    created_at: string;
    updated_at: string;
}


export const STUDENT_LEVELS = [
    { value: "BEGINNER", label: "Iniciante" },
    { value: "BASIC", label: "Básico" },
    { value: "INTERMEDIATE", label: "Intermediário" },
    { value: "ADVANCED", label: "Avançado" },
] as const;