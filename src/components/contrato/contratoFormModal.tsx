import { useState } from "react";
import { useAlunos } from "../../hooks/useAlunos";
import type { PlanType, PaymentMethod } from "../../types";

interface ContratoFormModalProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
    loading: boolean;
}

export function ContratoFormModal({ onClose, onSubmit, loading }: ContratoFormModalProps) {
    const { data: alunosData, loading: alunosLoading } = useAlunos({ size: 1000, active_only: true });
    
    const [studentMode, setStudentMode] = useState<"existing" | "new">("existing");
    
    // Contrato fields
    const [formData, setFormData] = useState({
        monthly_fee: "",
        payment_day: 10,
        start_date: new Date().toISOString().split("T")[0],
        plan_type: "MONTHLY" as PlanType,
        total_months: "",
        signed_at: new Date().toISOString().split("T")[0],
        payment_method: "CASH" as PaymentMethod,
        generate_payments: false,
        notes: "",
    });

    // Student fields
    const [studentId, setStudentId] = useState("");
    const [newStudent, setNewStudent] = useState({
        name: "",
        email: "",
        document_number: "",
        phone: "",
        is_active: true,
    });

    const [errors, setErrors] = useState<any>({});

    const validateForm = () => {
        const newErrors: any = {};
        
        if (studentMode === "existing" && !studentId) {
            newErrors.student_id = "Selecione um aluno";
        }
        
        if (studentMode === "new") {
            if (!newStudent.name.trim()) newErrors.student_name = "Nome do aluno é obrigatório";
            if (!newStudent.email.trim()) newErrors.student_email = "E-mail do aluno é obrigatório";
            if (!newStudent.document_number.trim()) newErrors.student_document = "CPF é obrigatório";
        }

        if (!formData.monthly_fee) newErrors.monthly_fee = "Mensalidade é obrigatória";
        if (!formData.payment_day || formData.payment_day < 1 || formData.payment_day > 31) {
            newErrors.payment_day = "Dia de vencimento deve ser entre 1 e 31";
        }
        if (!formData.start_date) newErrors.start_date = "Data de início é obrigatória";
        
        if (formData.plan_type === "CUSTOM" && !formData.total_months) {
            newErrors.total_months = "Total de meses é obrigatório para plano customizado";
        }

        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload: any = {
            monthly_fee: Number(formData.monthly_fee),
            payment_day: Number(formData.payment_day),
            start_date: formData.start_date,
            plan_type: formData.plan_type,
            payment_method: formData.payment_method,
            generate_payments: formData.generate_payments,
        };

        if (formData.plan_type === "CUSTOM" && formData.total_months) {
            payload.total_months = Number(formData.total_months);
        } else if (formData.plan_type === "SEMESTERLY") {
            payload.total_months = 6;
        } else if (formData.plan_type === "YEARLY") {
            payload.total_months = 12;
        }

        if (formData.signed_at) payload.signed_at = formData.signed_at;
        if (formData.notes) payload.notes = formData.notes;

        if (studentMode === "existing") {
            payload.student_id = studentId;
        } else {
            payload.student_data = newStudent;
        }

        onSubmit(payload);
    };

    const handleContractChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        
        if (errors[name]) {
            setErrors((prev: any) => ({ ...prev, [name]: "" }));
        }
    };

    const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewStudent(prev => ({
            ...prev,
            [name]: value,
        }));
        
        // Limpa erro correspondente
        if (name === "name" && errors.student_name) setErrors((prev: any) => ({ ...prev, student_name: "" }));
        if (name === "email" && errors.student_email) setErrors((prev: any) => ({ ...prev, student_email: "" }));
        if (name === "document_number" && errors.student_document) setErrors((prev: any) => ({ ...prev, student_document: "" }));
    };

    return (
        <div
            style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0, 0, 0, 0.5)", zIndex: 999,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={onClose}
        >
            <div
                className="card"
                style={{
                    width: "100%", maxWidth: "600px", maxHeight: "90vh",
                    overflowY: "auto", zIndex: 1000,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-5)", paddingBottom: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "var(--weight-semibold)" }}>
                        Novo Contrato
                    </h3>
                    <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading} style={{ padding: "var(--space-2)" }}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* SELEÇÃO DO ALUNO */}
                    <div style={{ marginBottom: "var(--space-5)" }}>
                        <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-3)" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer" }}>
                                <input 
                                    type="radio" 
                                    checked={studentMode === "existing"} 
                                    onChange={() => setStudentMode("existing")} 
                                    disabled={loading}
                                />
                                <span style={{ fontWeight: "var(--weight-medium)" }}>Aluno Existente</span>
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer" }}>
                                <input 
                                    type="radio" 
                                    checked={studentMode === "new"} 
                                    onChange={() => setStudentMode("new")} 
                                    disabled={loading}
                                />
                                <span style={{ fontWeight: "var(--weight-medium)" }}>Novo Aluno</span>
                            </label>
                        </div>

                        {studentMode === "existing" ? (
                            <div>
                                <select
                                    className="input"
                                    value={studentId}
                                    onChange={(e) => {
                                        setStudentId(e.target.value);
                                        if (errors.student_id) setErrors((prev: any) => ({ ...prev, student_id: "" }));
                                    }}
                                    disabled={loading || alunosLoading}
                                    style={errors.student_id ? { borderColor: "var(--color-error)" } : {}}
                                >
                                    <option value="">Selecione o aluno...</option>
                                    {alunosData?.items.map(a => (
                                        <option key={a.id} value={a.id}>{a.name} ({a.document_number})</option>
                                    ))}
                                </select>
                                {errors.student_id && <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{errors.student_id}</p>}
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", padding: "var(--space-3)", background: "var(--color-bg-subtle)", borderRadius: "var(--radius-md)" }}>
                                <div style={{ gridColumn: "span 2" }}>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)" }}>Nome *</label>
                                    <input type="text" name="name" className="input" value={newStudent.name} onChange={handleStudentChange} disabled={loading} style={errors.student_name ? { borderColor: "var(--color-error)" } : {}} />
                                    {errors.student_name && <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{errors.student_name}</p>}
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)" }}>E-mail *</label>
                                    <input type="email" name="email" className="input" value={newStudent.email} onChange={handleStudentChange} disabled={loading} style={errors.student_email ? { borderColor: "var(--color-error)" } : {}} />
                                    {errors.student_email && <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{errors.student_email}</p>}
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)" }}>CPF *</label>
                                    <input type="text" name="document_number" className="input" value={newStudent.document_number} onChange={handleStudentChange} disabled={loading} style={errors.student_document ? { borderColor: "var(--color-error)" } : {}} />
                                    {errors.student_document && <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{errors.student_document}</p>}
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)" }}>Telefone</label>
                                    <input type="text" name="phone" className="input" value={newStudent.phone} onChange={handleStudentChange} disabled={loading} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* DADOS DO CONTRATO */}
                    <h4 style={{ marginBottom: "var(--space-3)", fontSize: "16px", fontWeight: "var(--weight-semibold)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>Detalhes do Contrato</h4>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Mensalidade (R$) *</label>
                            <input type="number" step="0.01" name="monthly_fee" className="input" value={formData.monthly_fee} onChange={handleContractChange} disabled={loading} style={errors.monthly_fee ? { borderColor: "var(--color-error)" } : {}} />
                            {errors.monthly_fee && <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{errors.monthly_fee}</p>}
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Dia de Vencimento *</label>
                            <input type="number" min="1" max="31" name="payment_day" className="input" value={formData.payment_day} onChange={handleContractChange} disabled={loading} style={errors.payment_day ? { borderColor: "var(--color-error)" } : {}} />
                            {errors.payment_day && <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{errors.payment_day}</p>}
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Tipo de Plano *</label>
                            <select name="plan_type" className="input" value={formData.plan_type} onChange={handleContractChange} disabled={loading}>
                                <option value="MONTHLY">Mensal</option>
                                <option value="SEMESTERLY">Semestral</option>
                                <option value="YEARLY">Anual</option>
                                <option value="CUSTOM">Personalizado (Custom)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Meses (se Customizado)</label>
                            <input type="number" min="1" name="total_months" className="input" value={formData.total_months} onChange={handleContractChange} disabled={loading || formData.plan_type !== "CUSTOM"} style={errors.total_months ? { borderColor: "var(--color-error)" } : {}} />
                            {errors.total_months && <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{errors.total_months}</p>}
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Data de Início *</label>
                            <input type="date" name="start_date" className="input" value={formData.start_date} onChange={handleContractChange} disabled={loading} style={errors.start_date ? { borderColor: "var(--color-error)" } : {}} />
                            {errors.start_date && <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{errors.start_date}</p>}
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Método de Pagamento</label>
                            <select name="payment_method" className="input" value={formData.payment_method} onChange={handleContractChange} disabled={loading}>
                                <option value="CASH">Dinheiro</option>
                                <option value="CREDIT_CARD">Cartão de Crédito</option>
                                <option value="PIX">Pix</option>
                                <option value="BOLETO">Boleto</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: "var(--space-4)" }}>
                        <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>Observações (opcional)</label>
                        <textarea name="notes" className="input" value={formData.notes} onChange={handleContractChange} disabled={loading} rows={2} />
                    </div>

                    <div style={{ marginBottom: "var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                        <input type="checkbox" id="generate_payments" name="generate_payments" checked={formData.generate_payments} onChange={handleContractChange} disabled={loading} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
                        <label htmlFor="generate_payments" style={{ cursor: "pointer", fontWeight: "var(--weight-medium)" }}>
                            Gerar cobranças automaticamente agora
                        </label>
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
                        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Criando..." : "Criar Contrato"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
