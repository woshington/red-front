import { useState } from "react";
import { useInstallments, useMarkInstallmentPaid } from "../../hooks/useInstallments";

export function PagamentosPage() {
    const params = new URLSearchParams(window.location.search);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(20);
    const [dateType, setDateType] = useState(params.get("date_type") || "due_date");
    
    // Filtros
    const [startDate, setStartDate] = useState(params.get("start_date") || "");
    const [endDate, setEndDate] = useState(params.get("end_date") || "");
    const [statusFilter, setStatusFilter] = useState(params.get("status") || "");

    const { data, loading, error, reload } = useInstallments({ 
        skip, 
        limit,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        status: statusFilter || undefined,
        date_type: dateType || "due_date"
    });

    const { markPaid, loading: markingPaid } = useMarkInstallmentPaid();

    const handleMarkPaid = async (inst: any) => {
        if (!window.confirm("Confirmar recebimento desta parcela?")) return;
        try {
            await markPaid(inst.id, {
                paid_value: inst.value,
                paid_at: new Date().toISOString(),
                payment_method: "CASH"
            });
            reload();
        } catch (err) {
            console.error("Erro ao baixar parcela:", err);
            alert("Erro ao baixar parcela.");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-6)" }}>
                <div>
                    <h1 style={{ margin: "0 0 var(--space-2) 0", fontSize: "24px", fontWeight: "var(--weight-semibold)" }}>
                        Gestão Financeira
                    </h1>
                    <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
                        Acompanhe todos os recebimentos e parcelas da escola
                    </p>
                </div>
            </div>

            {/* Filtros */}
            <div style={{
                display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-4)", flexWrap: "wrap"
            }}>
                <div style={{ flex: 1, minWidth: "150px" }}>
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)", display: "block" }}>Tipo de Data</label>
                    <select 
                        className="input" 
                        value={dateType} 
                        onChange={(e) => setDateType(e.target.value)}
                    >
                        <option value="due_date">Vencimento</option>
                        <option value="payment_date">Pagamento</option>
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: "150px" }}>
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)", display: "block" }}>Data Inicial</label>
                    <input 
                        type="date"
                        className="input" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                    />
                </div>
                <div style={{ flex: 1, minWidth: "150px" }}>
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)", display: "block" }}>Data Final</label>
                    <input 
                        type="date"
                        className="input" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                    />
                </div>
                <div style={{ flex: 1, minWidth: "150px" }}>
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)", display: "block" }}>Status</label>
                    <select 
                        className="input" 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="PENDING">Pendente</option>
                        <option value="PAID">Pago</option>
                        <option value="OVERDUE">Atrasado</option>
                        <option value="CANCELED">Cancelado</option>
                    </select>
                </div>
            </div>

            {loading && <p className="text-muted">Carregando...</p>}
            {error && (
                <div className="card" style={{ borderColor: "var(--color-error)" }}>
                    <p style={{ color: "var(--color-error)", margin: 0 }}>{error}</p>
                </div>
            )}

            {!loading && !error && data && (
                <>
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                        {["Aluno", "Parcela", "Vencimento", "Valor", "Status", "Ações"].map((h) => (
                                            <th
                                                key={h}
                                                style={{
                                                    textAlign: h === "Ações" ? "right" : "left",
                                                    padding: "var(--space-3) var(--space-4)",
                                                    fontSize: "var(--text-xs)",
                                                    fontWeight: "var(--weight-semibold)",
                                                    color: "var(--color-text-muted)",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.05em",
                                                }}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((inst: any) => (
                                        <tr
                                            key={inst.id}
                                            style={{
                                                borderBottom: "1px solid var(--color-border)",
                                                transition: "background-color 0.2s ease",
                                            }}
                                        >
                                            <td style={{ padding: "var(--space-3) var(--space-4)", fontWeight: "var(--weight-medium)" }}>
                                                {inst.student_name || "Desconhecido"}
                                            </td>
                                            <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                                <p style={{ margin: 0, fontWeight: "var(--weight-medium)" }}>Parcela {inst.installment_number}</p>
                                                <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "monospace" }}>
                                                    {inst.contract_id.substring(0, 8)}
                                                </p>
                                            </td>
                                            <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                                {new Date(inst.due_date).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                                R$ {Number(inst.value).toFixed(2).replace('.', ',')}
                                            </td>
                                            <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                                <span
                                                    className="badge"
                                                    style={{
                                                        background: inst.status === "PAID" ? "rgba(52,211,153,0.15)" : inst.status === "OVERDUE" ? "rgba(248,113,113,0.15)" : "var(--color-surface-2)",
                                                        color: inst.status === "PAID" ? "var(--color-success)" : inst.status === "OVERDUE" ? "var(--color-error)" : "var(--color-text-muted)"
                                                    }}
                                                >
                                                    {inst.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: "var(--space-3) var(--space-4)", textAlign: "right" }}>
                                                {inst.status !== "PAID" && inst.status !== "CANCELED" && (
                                                    <button 
                                                        className="btn btn-primary" 
                                                        style={{ fontSize: "var(--text-xs)", padding: "4px 8px" }}
                                                        onClick={() => handleMarkPaid(inst)}
                                                        disabled={markingPaid}
                                                    >
                                                        Baixar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {data.items.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ padding: "var(--space-6) var(--space-4)", textAlign: "center" }}>
                                                <div style={{ color: "var(--color-text-muted)" }}>Nenhum pagamento encontrado com os filtros atuais.</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "var(--space-4) 0", marginTop: "var(--space-4)", borderTop: "1px solid var(--color-border)"
                    }}>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                            Mostrando {skip + 1} até {Math.min(skip + limit, data.total)} de {data.total} pagamentos
                        </div>
                        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                            <select 
                                className="input" 
                                style={{ padding: "var(--space-1) var(--space-2)", fontSize: "var(--text-xs)", height: "auto" }}
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setSkip(0);
                                }}
                            >
                                <option value={20}>20 por página</option>
                                <option value={50}>50 por página</option>
                                <option value={100}>100 por página</option>
                            </select>
                            <button
                                className="btn btn-ghost"
                                disabled={skip === 0}
                                onClick={() => setSkip(s => Math.max(0, s - limit))}
                            >
                                Anterior
                            </button>
                            <button
                                className="btn btn-ghost"
                                disabled={skip + limit >= data.total}
                                onClick={() => setSkip(s => s + limit)}
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}