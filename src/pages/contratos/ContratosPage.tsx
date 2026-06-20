import { useState } from "react";
import { useContratos, useCreateContrato, usePauseContrato, useReactivateContrato, useCancelContrato } from "../../hooks/useContratos";
import { ContratoFormModal } from "../../components/contrato/contratoFormModal";
import { ContratoDetailsModal } from "../../components/contrato/ContratoDetailsModal";

export function ContratosPage() {
    const params = new URLSearchParams(window.location.search);
    const [skip, setSkip] = useState(0);
    const [studentName, setStudentName] = useState("");
    const [studentDocument, setStudentDocument] = useState("");
    const [statusFilter, setStatusFilter] = useState(params.get("status") || "");
    const [startDate, setStartDate] = useState(params.get("start_date") || "");
    const [endDate, setEndDate] = useState(params.get("end_date") || "");
    const [limit, setLimit] = useState(20);
    const { data, loading, error, reload } = useContratos({ 
        skip, 
        limit, 
        student_name: studentName, 
        student_document: studentDocument,
        status: statusFilter || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined
    });
    const { create: createContrato, loading: creatingContrato } = useCreateContrato();
    const { pause: pauseContrato, loading: pausingContrato } = usePauseContrato();
    const { reactivate: reactivateContrato, loading: reactivatingContrato } = useReactivateContrato();
    const { cancel: cancelContrato, loading: cancelingContrato } = useCancelContrato();

    const [showModal, setShowModal] = useState(false);
    const [selectedContrato, setSelectedContrato] = useState<any | null>(null);

    const handleCreateContrato = async (formData: any) => {
        try {
            await createContrato(formData);
            setShowModal(false);
            reload();
        } catch (err) {
            console.error("Erro ao criar contrato:", err);
            alert("Erro ao criar contrato.");
        }
    };

    const handleTogglePause = async (contrato: any) => {
        const isPaused = contrato.status === "PAUSED";
        const msg = isPaused ? "Tem certeza que deseja retomar este contrato?" : "Tem certeza que deseja pausar este contrato?";
        if (!window.confirm(msg)) return;

        try {
            if (contrato.status === "ACTIVE") {
                await pauseContrato(contrato.id);
            } else if (contrato.status === "PAUSED") {
                await reactivateContrato(contrato.id);
            }
            reload();
        } catch (err) {
            console.error("Erro ao pausar/reativar contrato:", err);
            alert("Erro na operação.");
        }
    };

    const handleCancel = async (contrato: any) => {
        const reason = prompt("Motivo do cancelamento:");
        if (!reason) return;
        
        try {
            await cancelContrato(contrato.id, reason);
            reload();
        } catch (err) {
            console.error("Erro ao cancelar contrato:", err);
            alert("Erro ao cancelar contrato.");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-6)" }}>
                <h2>Contratos</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    + Novo Contrato
                </button>
            </div>

            {/* Filtros */}
            <div style={{
                display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-4)", flexWrap: "wrap"
            }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)", display: "block" }}>Nome do Aluno</label>
                    <input 
                        className="input" 
                        placeholder="Buscar por nome..." 
                        value={studentName} 
                        onChange={(e) => setStudentName(e.target.value)} 
                    />
                </div>
                <div style={{ flex: 1, minWidth: "200px" }}>
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)", display: "block" }}>Documento</label>
                    <input 
                        className="input" 
                        placeholder="CPF ou RG" 
                        value={studentDocument} 
                        onChange={(e) => setStudentDocument(e.target.value)} 
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
                        <option value="ACTIVE">Ativo</option>
                        <option value="PAUSED">Pausado</option>
                        <option value="CANCELED">Cancelado</option>
                    </select>
                </div>
            </div>

            {loading && <p className="text-muted">Carregando...</p>}
            {error && (
                <div className="card" style={{ borderColor: "var(--color-error)" }}>
                    <p style={{ color: "var(--color-error)" }}>{error}</p>
                    <button className="btn btn-ghost" style={{ marginTop: "var(--space-3)" }} onClick={reload}>
                        Tentar novamente
                    </button>
                </div>
            )}

            {data && (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                {["Aluno", "Valor Total", "Tipo Pagto", "Início", "Status", "Ações"].map((h) => (
                                    <th
                                        key={h}
                                        style={{
                                            textAlign: "left",
                                            padding: "var(--space-3) var(--space-4)",
                                            fontSize: "var(--text-xs)",
                                            fontWeight: "var(--weight-semibold)",
                                            color: "var(--color-text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.items?.map((contrato: any) => (
                                <tr
                                    key={contrato.id}
                                    style={{ borderBottom: "1px solid var(--color-border)" }}
                                >
                                    <td style={{ padding: "var(--space-3) var(--space-4)", fontWeight: "var(--weight-medium)" }}>
                                        {contrato.student?.name || "Desconhecido"}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        R$ {Number(contrato.total_value).toFixed(2).replace('.', ',')}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {contrato.payment_type}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {new Date(contrato.start_date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                        <span
                                            className="badge"
                                            style={{
                                                background: contrato.status === "ACTIVE" ? "rgba(52,211,153,0.15)" : contrato.status === "PAUSED" ? "rgba(251,191,36,0.15)" : "rgba(248,113,113,0.15)",
                                                color: contrato.status === "ACTIVE" ? "var(--color-success)" : contrato.status === "PAUSED" ? "var(--color-warning)" : "var(--color-error)"
                                            }}
                                        >
                                            {contrato.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", textAlign: "right" }}>
                                        <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
                                            <button 
                                                className="btn btn-ghost" 
                                                style={{ fontSize: "var(--text-xs)", padding: "var(--space-1) var(--space-2)" }}
                                                onClick={() => setSelectedContrato(contrato)}
                                            >
                                                Detalhes
                                            </button>
                                            {contrato.status !== "CANCELED" && (
                                                <>
                                                    <button 
                                                        className="btn btn-ghost" 
                                                        style={{ fontSize: "var(--text-xs)", padding: "var(--space-1) var(--space-2)" }}
                                                        onClick={() => handleTogglePause(contrato)}
                                                        disabled={pausingContrato || reactivatingContrato}
                                                    >
                                                        {contrato.status === "ACTIVE" ? "Pausar" : "Retomar"}
                                                    </button>
                                                    <button 
                                                        className="btn btn-ghost" 
                                                        style={{ fontSize: "var(--text-xs)", padding: "var(--space-1) var(--space-2)", color: "var(--color-error)", borderColor: "rgba(248,113,113,0.3)" }}
                                                        onClick={() => handleCancel(contrato)}
                                                        disabled={cancelingContrato}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-4)" }}>
                        <p className="text-muted text-sm" style={{ margin: 0 }}>
                            {data.total} registro(s) encontrado(s) - Página {data.page} de {Math.ceil(data.total / data.size) || 1}
                        </p>

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
                                disabled={data.page <= 1 || loading}
                                onClick={() => setSkip(s => Math.max(0, s - limit))}
                            >
                                Anterior
                            </button>
                            <button
                                className="btn btn-ghost"
                                disabled={data.page >= (Math.ceil(data.total / data.size) || 1) || loading}
                                onClick={() => setSkip(s => s + limit)}
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <ContratoFormModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateContrato}
                    loading={creatingContrato}
                />
            )}

            {selectedContrato && (
                <ContratoDetailsModal
                    contrato={selectedContrato}
                    onClose={() => setSelectedContrato(null)}
                />
            )}
        </div>
    );
}
