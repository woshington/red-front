import { useState, useEffect } from "react";
import type { Aluno } from "../../types";

interface AlunoFormModalProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
    loading: boolean;
    initialData?: Aluno | null;
}

export function AlunoFormModal({ onClose, onSubmit, loading, initialData }: AlunoFormModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        document_number: "",
        phone: "",
        is_active: true,
    });
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                document_number: initialData.document_number,
                phone: initialData.phone,
                is_active: initialData.is_active,
            });
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors: any = {};
        if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
        if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório";
        if (!formData.document_number.trim()) newErrors.document_number = "CPF é obrigatório";
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev: any) => ({ ...prev, [name]: "" }));
        }
    };

    return (
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
                        {initialData ? "Editar Aluno" : "Novo Aluno"}
                    </h3>
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={onClose}
                        disabled={loading}
                        style={{ padding: "var(--space-2)" }}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "var(--space-4)" }}>
                        <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>
                            Nome *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nome completo do aluno"
                            className="input"
                            disabled={loading}
                            style={errors.name ? { borderColor: "var(--color-error)" } : {}}
                        />
                        {errors.nome && (
                            <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>
                                {errors.nome}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: "var(--space-4)" }}>
                        <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>
                            E-mail *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email de contato"
                            className="input"
                            disabled={loading}
                            style={errors.email ? { borderColor: "var(--color-error)" } : {}}
                        />
                        {errors.email && (
                            <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: "var(--space-4)" }}>
                        <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>
                            CPF *
                        </label>
                        <input
                            type="text"
                            name="document_number"
                            value={formData.document_number}
                            onChange={handleChange}
                            placeholder="000.000.000-00"
                            className="input"
                            disabled={loading}
                            style={errors.document_number ? { borderColor: "var(--color-error)" } : {}}
                        />
                        {errors.document_number && (
                            <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>
                                {errors.document_number}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: "var(--space-4)" }}>
                        <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>
                            Telefone
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(00) 00000-0000"
                            className="input"
                            disabled={loading}
                        />
                    </div>

                    <div style={{ marginBottom: "var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                        <input
                            type="checkbox"
                            id="ativo"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            disabled={loading}
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                        />
                        <label htmlFor="ativo" style={{ cursor: "pointer", fontWeight: "var(--weight-medium)" }}>
                            Aluno Ativo
                        </label>
                    </div>

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
                            {loading ? "Salvando..." : initialData ? "Salvar Alterações" : "Cadastrar Aluno"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
