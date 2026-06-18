import { useState, useEffect } from "react";
import type { Professor } from "../../types";

interface ProfessorFormModalProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
    loading: boolean;
    initialData?: Professor | null;
}

export function ProfessorFormModal({ onClose, onSubmit, loading, initialData }: ProfessorFormModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        ativo: true,
    });
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                ativo: initialData.ativo,
            });
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors: any = {};
        if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
        if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório";
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
                        {initialData ? "Editar Professor" : "Novo Professor"}
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
                            placeholder="Nome completo do professor"
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

                    <div style={{ marginBottom: "var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                        <input
                            type="checkbox"
                            id="ativo"
                            name="ativo"
                            checked={formData.ativo}
                            onChange={handleChange}
                            disabled={loading}
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                        />
                        <label htmlFor="ativo" style={{ cursor: "pointer", fontWeight: "var(--weight-medium)" }}>
                            Professor Ativo
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
                            {loading ? "Salvando..." : initialData ? "Salvar Alterações" : "Cadastrar Professor"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
