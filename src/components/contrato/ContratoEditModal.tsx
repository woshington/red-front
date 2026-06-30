import { useState } from "react";
import { useUpdateContrato } from "../../hooks/useContratos";
import type { PaymentMethod } from "../../types";

interface ContratoEditModalProps {
    contrato: any;
    onClose: () => void;
    onSaved: () => void;
}

export function ContratoEditModal({ contrato, onClose, onSaved }: ContratoEditModalProps) {
    const { update, loading } = useUpdateContrato();

    const [formData, setFormData] = useState({
        total_value: String(contrato.total_value ?? ""),
        payment_day: contrato.payment_day ?? 10,
        lessons_per_week: String(contrato.lessons_per_week ?? ""),
        payment_method: (contrato.payment_method ?? "CASH") as PaymentMethod,
        notes: contrato.notes ?? "",
        start_date: contrato.start_date ? contrato.start_date.split("T")[0] : "",
        end_date: contrato.end_date ? contrato.end_date.split("T")[0] : "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const e: Record<string, string> = {};
        if (!formData.total_value || Number(formData.total_value) <= 0)
            e.total_value = "Informe o valor total";
        if (!formData.payment_day || formData.payment_day < 1 || formData.payment_day > 31)
            e.payment_day = "Dia deve ser entre 1 e 31";
        if (!formData.start_date)
            e.start_date = "Data de início é obrigatória";
        return e;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === "payment_day" ? Number(value) : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        try {
            await update(contrato.id, {
                total_value: Number(formData.total_value),
                payment_day: formData.payment_day,
                lessons_per_week: formData.lessons_per_week ? Number(formData.lessons_per_week) : undefined,
                payment_method: formData.payment_method,
                notes: formData.notes || null,
                start_date: formData.start_date,
                end_date: formData.end_date || undefined,
            });
            onSaved();
        } catch {
            setErrors({ submit: "Erro ao atualizar contrato. Tente novamente." });
        }
    };

    return (
        <div
            style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.5)", zIndex: 999,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={onClose}
        >
            <div
                className="card"
                style={{ width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", zIndex: 1000 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-5)", paddingBottom: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>
                    <div>
                        <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "var(--weight-semibold)" }}>
                            Editar Contrato
                        </h3>
                        <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-muted)" }}>
                            {contrato.student?.name}
                        </p>
                    </div>
                    <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading} style={{ padding: "var(--space-2)" }}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Valor Total (R$) *</label>
                            <input
                                type="number" step="0.01" name="total_value"
                                className="input" value={formData.total_value}
                                onChange={handleChange} disabled={loading}
                                style={errors.total_value ? { borderColor: "var(--color-error)" } : {}}
                            />
                            {errors.total_value && <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{errors.total_value}</p>}
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Dia de Vencimento *</label>
                            <input
                                type="number" min="1" max="31" name="payment_day"
                                className="input" value={formData.payment_day}
                                onChange={handleChange} disabled={loading}
                                style={errors.payment_day ? { borderColor: "var(--color-error)" } : {}}
                            />
                            {errors.payment_day && <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{errors.payment_day}</p>}
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Aulas por Semana</label>
                            <input
                                type="number" min="1" max="7" name="lessons_per_week"
                                className="input" value={formData.lessons_per_week}
                                onChange={handleChange} disabled={loading}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Método de Pagamento</label>
                            <select name="payment_method" className="input" value={formData.payment_method} onChange={handleChange} disabled={loading}>
                                <option value="CASH">Dinheiro</option>
                                <option value="CREDIT_CARD">Cartão de Crédito</option>
                                <option value="PIX">Pix</option>
                                <option value="BOLETO">Boleto</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Data de Início *</label>
                            <input
                                type="date" name="start_date"
                                className="input" value={formData.start_date}
                                onChange={handleChange} disabled={loading}
                                style={errors.start_date ? { borderColor: "var(--color-error)" } : {}}
                            />
                            {errors.start_date && <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{errors.start_date}</p>}
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Data de Fim</label>
                            <input
                                type="date" name="end_date"
                                className="input" value={formData.end_date}
                                onChange={handleChange} disabled={loading}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "var(--space-5)" }}>
                        <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Observações</label>
                        <textarea
                            name="notes" className="input"
                            value={formData.notes} onChange={handleChange}
                            disabled={loading} rows={3}
                        />
                    </div>

                    {errors.submit && (
                        <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginBottom: "var(--space-3)" }}>{errors.submit}</p>
                    )}

                    <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
                        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
