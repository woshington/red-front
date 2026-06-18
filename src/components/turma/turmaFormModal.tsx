import { useState, useEffect } from "react";
import { useGetProfessores } from "../../hooks/useProfessores";
import type { Turma } from "../../types";

interface TurmaFormModalProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
    loading: boolean;
    initialData?: Turma | null;
}

export function TurmaFormModal({ onClose, onSubmit, loading, initialData }: TurmaFormModalProps) {
    const { data: professores, loading: professoresLoading, error: professoresError } = useGetProfessores();
    const [formData, setFormData] = useState({
        name: "",
        teacher_id: "",
        year: new Date().getFullYear(),
        max_students: 30,
        is_active: true,
    });
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                teacher_id: String(initialData.teacher?.id || ""),
                year: initialData.year,
                max_students: initialData.max_students,
                is_active: initialData.is_active,
            });
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors: any = {};
        if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
        if (!formData.teacher_id) newErrors.teacher_id = "Professor é obrigatório";
        if (formData.max_students < 1) newErrors.max_students = "Máximo de alunos deve ser maior que 0";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
        }));
        // Limpar erro quando user começa a digitar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onClick={onClose}
            >
                {/* Modal */}
                <div
                    className="card"
                    style={{
                        width: "100%",
                        maxWidth: "500px",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        zIndex: 1000,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "var(--space-5)",
                            paddingBottom: "var(--space-4)",
                            borderBottom: "1px solid var(--color-border)",
                        }}
                    >
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "var(--weight-semibold)" }}>
                            {initialData ? "Editar Turma" : "Nova Turma"}
                        </h3>
                        <button
                            className="btn btn-ghost"
                            onClick={onClose}
                            disabled={loading}
                            style={{ padding: "var(--space-2)" }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Nome */}
                        <div style={{ marginBottom: "var(--space-4)" }}>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>
                                Nome da Turma *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: 8º Ano A"
                                className="input"
                                disabled={loading}
                                style={errors.name ? { borderColor: "var(--color-error)" } : {}}
                            />
                            {errors.name && (
                                <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Professor */}
                        <div style={{ marginBottom: "var(--space-4)" }}>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>
                                Professor *
                            </label>
                            <select
                                name="teacher_id"
                                value={formData.teacher_id}
                                onChange={handleChange}
                                className="input"
                                disabled={loading || !professores}
                                style={errors.teacher_id ? { borderColor: "var(--color-error)" } : {}}
                            >
                                <option value="">Selecione um professor</option>
                                {professores?.items?.map((prof) => (
                                    <option key={prof.id} value={prof.id}>
                                        {prof.name}
                                    </option>
                                ))}
                            </select>
                            {errors.teacher_id && (
                                <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>
                                    {errors.teacher_id}
                                </p>
                            )}
                        </div>

                        {/* Ano */}
                        <div style={{ marginBottom: "var(--space-4)" }}>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>
                                Ano
                            </label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="input"
                                disabled={loading}
                                min="2020"
                                max="2100"
                            />
                        </div>

                        {/* Máximo de Alunos */}
                        <div style={{ marginBottom: "var(--space-4)" }}>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>
                                Máximo de Alunos *
                            </label>
                            <input
                                type="number"
                                name="max_students"
                                value={formData.max_students}
                                onChange={handleChange}
                                className="input"
                                disabled={loading}
                                min="1"
                                max="100"
                                style={errors.max_students ? { borderColor: "var(--color-error)" } : {}}
                            />
                            {errors.max_students && (
                                <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>
                                    {errors.max_students}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div style={{ marginBottom: "var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                disabled={loading}
                                style={{ width: "18px", height: "18px", cursor: "pointer" }}
                            />
                            <label htmlFor="is_active" style={{ cursor: "pointer", fontWeight: "var(--weight-medium)" }}>
                                Turma Ativa
                            </label>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Salvando..." : initialData ? "Salvar Alterações" : "Criar Turma"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}