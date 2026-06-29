import { useState } from "react";
import { useInstallments, useMarkInstallmentPaid, useCreateInstallment } from "../../hooks/useInstallments";

interface ContratoDetailsModalProps {
    contrato: any;
    onClose: () => void;
}

interface PaymentModalState {
    installment: any;
    paidValue: string;
    paidAt: string;
    paymentMethod: string;
    remainingDueDate: string;
    error: string;
}

export function ContratoDetailsModal({ contrato, onClose }: ContratoDetailsModalProps) {
    const { data, loading, error, reload } = useInstallments({ contract_id: contrato.id, limit: 100 });
    const { markPaid, loading: markingPaid } = useMarkInstallmentPaid();
    const { create: createInstallment, loading: creatingInstallment } = useCreateInstallment();

    const [paymentModal, setPaymentModal] = useState<PaymentModalState | null>(null);

    const openPaymentModal = (installment: any) => {
        setPaymentModal({
            installment,
            paidValue: String(installment.value),
            paidAt: new Date().toISOString().split("T")[0],
            paymentMethod: "CASH",
            remainingDueDate: "",
            error: "",
        });
    };

    const handlePaymentSubmit = async () => {
        if (!paymentModal) return;

        const { installment, paidValue, paidAt, paymentMethod, remainingDueDate } = paymentModal;
        const paid = Number(paidValue);
        const total = Number(installment.value);

        if (!paid || paid <= 0) {
            setPaymentModal(p => p ? { ...p, error: "Informe o valor recebido." } : null);
            return;
        }
        if (paid > total) {
            setPaymentModal(p => p ? { ...p, error: "Valor recebido não pode ser maior que o valor da parcela." } : null);
            return;
        }
        if (paid < total && !remainingDueDate) {
            setPaymentModal(p => p ? { ...p, error: "Informe o vencimento para o valor restante." } : null);
            return;
        }

        try {
            await markPaid(installment.id, {
                paid_value: paid,
                paid_at: new Date(paidAt + "T12:00:00").toISOString(),
                payment_method: paymentMethod,
            });

            if (paid < total) {
                const remaining = Number((total - paid).toFixed(2));
                await createInstallment({
                    contract_id: contrato.id,
                    value: remaining,
                    due_date: remainingDueDate,
                });
            }

            setPaymentModal(null);
            reload();
        } catch (err: any) {
            setPaymentModal(p => p ? { ...p, error: err?.message || "Erro ao registrar pagamento." } : null);
        }
    };

    const isPartial = paymentModal
        ? Number(paymentModal.paidValue) > 0 && Number(paymentModal.paidValue) < Number(paymentModal.installment.value)
        : false;

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
                    width: "100%", maxWidth: "800px", maxHeight: "90vh",
                    overflowY: "auto", zIndex: 1000,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-5)", paddingBottom: "var(--space-4)", borderBottom: "1px solid var(--color-border)" }}>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "var(--weight-semibold)" }}>
                        Detalhes do Contrato
                    </h3>
                    <button type="button" className="btn btn-ghost" onClick={onClose} style={{ padding: "var(--space-2)" }}>✕</button>
                </div>

                <div style={{ marginBottom: "var(--space-6)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                        <div>
                            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Aluno</p>
                            <p style={{ fontWeight: "var(--weight-medium)" }}>{contrato.student?.name}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Status</p>
                            <span className="badge">{contrato.status}</span>
                        </div>
                        <div>
                            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Valor Total</p>
                            <p>R$ {Number(contrato.total_value).toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Período</p>
                            <p>{contrato.start_date ? contrato.start_date.split('T')[0].split('-').reverse().join('/') : ''} até {contrato.end_date ? contrato.end_date.split('T')[0].split('-').reverse().join('/') : ''}</p>
                        </div>
                        {contrato.lessons_per_week && (
                            <div>
                                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Aulas por Semana</p>
                                <p>{contrato.lessons_per_week}x/semana</p>
                            </div>
                        )}
                    </div>
                </div>

                <h4 style={{ marginBottom: "var(--space-3)", fontSize: "16px", fontWeight: "var(--weight-semibold)" }}>
                    Lista de Pagamentos
                </h4>

                {loading ? (
                    <p className="text-muted">Carregando parcelas...</p>
                ) : error ? (
                    <p style={{ color: "var(--color-error)" }}>{error}</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "var(--space-2)" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                <th style={{ textAlign: "left", padding: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Nº</th>
                                <th style={{ textAlign: "left", padding: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Vencimento</th>
                                <th style={{ textAlign: "left", padding: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Valor</th>
                                <th style={{ textAlign: "left", padding: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Pago</th>
                                <th style={{ textAlign: "left", padding: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Status</th>
                                <th style={{ textAlign: "right", padding: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.items?.map((inst) => (
                                <tr key={inst.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                    <td style={{ padding: "var(--space-2)" }}>{inst.installment_number}</td>
                                    <td style={{ padding: "var(--space-2)" }}>{inst.due_date ? inst.due_date.split('T')[0].split('-').reverse().join('/') : ''}</td>
                                    <td style={{ padding: "var(--space-2)" }}>R$ {Number(inst.value).toFixed(2).replace('.', ',')}</td>
                                    <td style={{ padding: "var(--space-2)" }}>
                                        {inst.paid_value != null ? `R$ ${Number(inst.paid_value).toFixed(2).replace('.', ',')}` : "—"}
                                    </td>
                                    <td style={{ padding: "var(--space-2)" }}>
                                        <span className="badge" style={{
                                            background: inst.status === "PAID" ? "rgba(52,211,153,0.15)" : inst.status === "OVERDUE" ? "rgba(248,113,113,0.15)" : inst.status === "CANCELED" ? "rgba(156,163,175,0.15)" : "var(--color-surface-2)",
                                            color: inst.status === "PAID" ? "var(--color-success)" : inst.status === "OVERDUE" ? "var(--color-error)" : inst.status === "CANCELED" ? "var(--color-text-muted)" : "var(--color-text-muted)"
                                        }}>
                                            {inst.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "var(--space-2)", textAlign: "right" }}>
                                        {inst.status !== "PAID" && inst.status !== "CANCELED" && (
                                            <button
                                                className="btn btn-primary"
                                                style={{ fontSize: "var(--text-xs)", padding: "4px 8px" }}
                                                onClick={() => openPaymentModal(inst)}
                                                disabled={contrato.status === "CANCELED"}
                                            >
                                                Baixar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {data?.items?.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: "var(--space-4)", textAlign: "center", color: "var(--color-text-muted)" }}>
                                        Nenhuma parcela encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Payment Modal */}
            {paymentModal && (
                <div
                    style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(0,0,0,0.6)", zIndex: 1001,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    onClick={() => setPaymentModal(null)}
                >
                    <div
                        className="card"
                        style={{ width: "100%", maxWidth: "420px", zIndex: 1002 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: "0 0 var(--space-4)", fontSize: "18px", fontWeight: "var(--weight-semibold)" }}>
                            Registrar Recebimento
                        </h3>
                        <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
                            Parcela #{paymentModal.installment.installment_number} — Vencimento: {paymentModal.installment.due_date?.split('T')[0].split('-').reverse().join('/')}
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "var(--space-1)", fontWeight: "var(--weight-medium)", fontSize: "14px" }}>
                                    Valor recebido (R$) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={paymentModal.installment.value}
                                    className="input"
                                    value={paymentModal.paidValue}
                                    onChange={(e) => setPaymentModal(p => p ? { ...p, paidValue: e.target.value, error: "" } : null)}
                                />
                                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "2px" }}>
                                    Total: R$ {Number(paymentModal.installment.value).toFixed(2).replace('.', ',')}
                                </p>
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "var(--space-1)", fontWeight: "var(--weight-medium)", fontSize: "14px" }}>
                                    Data do pagamento *
                                </label>
                                <input
                                    type="date"
                                    className="input"
                                    value={paymentModal.paidAt}
                                    onChange={(e) => setPaymentModal(p => p ? { ...p, paidAt: e.target.value, error: "" } : null)}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: "var(--space-3)" }}>
                            <label style={{ display: "block", marginBottom: "var(--space-1)", fontWeight: "var(--weight-medium)", fontSize: "14px" }}>
                                Método de pagamento
                            </label>
                            <select
                                className="input"
                                value={paymentModal.paymentMethod}
                                onChange={(e) => setPaymentModal(p => p ? { ...p, paymentMethod: e.target.value } : null)}
                            >
                                <option value="CASH">Dinheiro</option>
                                <option value="PIX">Pix</option>
                                <option value="CREDIT_CARD">Cartão de Crédito</option>
                                <option value="BOLETO">Boleto</option>
                            </select>
                        </div>

                        {isPartial && (
                            <div style={{
                                background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.4)",
                                borderRadius: "var(--border-radius)", padding: "var(--space-3)", marginBottom: "var(--space-3)"
                            }}>
                                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
                                    Pagamento parcial detectado. Uma nova cobrança de{" "}
                                    <strong>R$ {(Number(paymentModal.installment.value) - Number(paymentModal.paidValue)).toFixed(2).replace('.', ',')}</strong>{" "}
                                    será gerada.
                                </p>
                                <div>
                                    <label style={{ display: "block", marginBottom: "var(--space-1)", fontWeight: "var(--weight-medium)", fontSize: "14px" }}>
                                        Vencimento do valor restante *
                                    </label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={paymentModal.remainingDueDate}
                                        min={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setPaymentModal(p => p ? { ...p, remainingDueDate: e.target.value, error: "" } : null)}
                                    />
                                </div>
                            </div>
                        )}

                        {paymentModal.error && (
                            <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginBottom: "var(--space-3)" }}>
                                {paymentModal.error}
                            </p>
                        )}

                        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
                            <button
                                className="btn btn-ghost"
                                onClick={() => setPaymentModal(null)}
                                disabled={markingPaid || creatingInstallment}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handlePaymentSubmit}
                                disabled={markingPaid || creatingInstallment}
                            >
                                {markingPaid || creatingInstallment ? "Registrando..." : "Confirmar Recebimento"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
