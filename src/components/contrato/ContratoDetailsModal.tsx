import { useInstallments, useMarkInstallmentPaid } from "../../hooks/useInstallments";

interface ContratoDetailsModalProps {
    contrato: any;
    onClose: () => void;
}

export function ContratoDetailsModal({ contrato, onClose }: ContratoDetailsModalProps) {
    const { data, loading, error, reload } = useInstallments({ contract_id: contrato.id, limit: 100 });
    const { markPaid, loading: markingPaid } = useMarkInstallmentPaid();

    const handleMarkPaid = async (installmentId: string, value: number) => {
        if (!window.confirm("Confirmar recebimento desta parcela?")) return;

        try {
            await markPaid(installmentId, {
                paid_value: value,
                paid_at: new Date().toISOString(),
                payment_method: "CASH" // Defaulting for simplicity in this view
            });
            reload();
        } catch (err) {
            console.error("Erro ao baixar parcela:", err);
            alert("Erro ao baixar parcela.");
        }
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
                                        <span className="badge" style={{ 
                                            background: inst.status === "PAID" ? "rgba(52,211,153,0.15)" : inst.status === "OVERDUE" ? "rgba(248,113,113,0.15)" : "var(--color-surface-2)",
                                            color: inst.status === "PAID" ? "var(--color-success)" : inst.status === "OVERDUE" ? "var(--color-error)" : "var(--color-text-muted)"
                                        }}>
                                            {inst.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "var(--space-2)", textAlign: "right" }}>
                                        {inst.status !== "PAID" && inst.status !== "CANCELED" && (
                                            <button 
                                                className="btn btn-primary" 
                                                style={{ fontSize: "var(--text-xs)", padding: "4px 8px" }}
                                                onClick={() => handleMarkPaid(inst.id, inst.value)}
                                                disabled={markingPaid || contrato.status === "CANCELED"}
                                            >
                                                Baixar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {data?.items?.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ padding: "var(--space-4)", textAlign: "center", color: "var(--color-text-muted)" }}>
                                        Nenhuma parcela encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
