import { useState } from "react";
import { useContratos, useCreateContrato, usePauseContrato, useReactivateContrato, useCancelContrato } from "../../hooks/useContratos";
import { installmentsService } from "../../services/installments";
import { ContratoFormModal } from "../../components/contrato/contratoFormModal";
import { ContratoDetailsModal } from "../../components/contrato/ContratoDetailsModal";
import { ContratoEditModal } from "../../components/contrato/ContratoEditModal";

export function ContratosPage() {
    const params = new URLSearchParams(window.location.search);
    const [skip, setSkip] = useState(0);
    const [studentName, setStudentName] = useState("");
    const [studentDocument, setStudentDocument] = useState("");
    const [statusFilter, setStatusFilter] = useState(params.get("status") || "");
    const [lessonsPerWeekFilter, setLessonsPerWeekFilter] = useState("");
    const [startDate] = useState(params.get("start_date") || "");
    const [endDate] = useState(params.get("end_date") || "");
    const [limit, setLimit] = useState(20);
    const { data, loading, error, reload } = useContratos({
        skip,
        limit,
        student_name: studentName,
        student_document: studentDocument,
        status: statusFilter || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        lessons_per_week: lessonsPerWeekFilter ? Number(lessonsPerWeekFilter) : undefined,
    });
    const { create: createContrato, loading: creatingContrato } = useCreateContrato();
    const { pause: pauseContrato, loading: pausingContrato } = usePauseContrato();
    const { reactivate: reactivateContrato, loading: reactivatingContrato } = useReactivateContrato();
    const { cancel: cancelContrato, loading: cancelingContrato } = useCancelContrato();

    const [showModal, setShowModal] = useState(false);
    const [selectedContrato, setSelectedContrato] = useState<any | null>(null);
    const [editingContrato, setEditingContrato] = useState<any | null>(null);

    // Pause modal state
    const [pauseTarget, setPauseTarget] = useState<any | null>(null);
    const [expectedReturnDate, setExpectedReturnDate] = useState("");
    const [pauseError, setPauseError] = useState("");
    const [pauseLoading, setPauseLoading] = useState(false);

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

    const handleOpenPause = (contrato: any) => {
        setExpectedReturnDate("");
        setPauseError("");
        setPauseTarget(contrato);
    };

    const handleConfirmPause = async () => {
        if (!expectedReturnDate) {
            setPauseError("Informe a data prevista de retorno.");
            return;
        }
        setPauseLoading(true);
        try {
            await pauseContrato(pauseTarget.id, { expected_return_date: expectedReturnDate });

            // Cancel all pending/overdue installments for this contract
            const instData = await installmentsService.list({ contract_id: pauseTarget.id, limit: 200 });
            const toCancelIds = instData.items
                .filter((i: any) => i.status === "PENDING" || i.status === "OVERDUE")
                .map((i: any) => i.id);
            await Promise.allSettled(toCancelIds.map((id: string) => installmentsService.cancel(id)));

            setPauseTarget(null);
            reload();
        } catch (err) {
            console.error("Erro ao pausar contrato:", err);
            setPauseError("Erro ao pausar contrato. Tente novamente.");
        } finally {
            setPauseLoading(false);
        }
    };

    const handleReactivate = async (contrato: any) => {
        if (!window.confirm("Tem certeza que deseja retomar este contrato?")) return;
        try {
            await reactivateContrato(contrato.id);
            reload();
        } catch (err) {
            console.error("Erro ao reativar contrato:", err);
            alert("Erro ao reativar contrato.");
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
                <div style={{ flex: "0 0 140px" }}>
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)", display: "block" }}>Aulas/Semana</label>
                    <select
                        className="input"
                        value={lessonsPerWeekFilter}
                        onChange={(e) => setLessonsPerWeekFilter(e.target.value)}
                    >
                        <option value="">Todas</option>
                        {[1, 2, 3, 4, 5, 6, 7].map(n => (
                            <option key={n} value={n}>{n}x/semana</option>
                        ))}
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
                                {["Aluno", "Valor Total", "Aulas/Sem.", "Início", "Status", "Ações"].map((h) => (
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
                                        {contrato.lessons_per_week ? `${contrato.lessons_per_week}x/sem.` : "—"}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {contrato.start_date ? contrato.start_date.split('T')[0].split('-').reverse().join('/') : ''}
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
                                                        onClick={() => setEditingContrato(contrato)}
                                                    >
                                                        Editar
                                                    </button>
                                                    {contrato.status === "ACTIVE" ? (
                                                        <button
                                                            className="btn btn-ghost"
                                                            style={{ fontSize: "var(--text-xs)", padding: "var(--space-1) var(--space-2)" }}
                                                            onClick={() => handleOpenPause(contrato)}
                                                            disabled={pausingContrato}
                                                        >
                                                            Pausar
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-ghost"
                                                            style={{ fontSize: "var(--text-xs)", padding: "var(--space-1) var(--space-2)" }}
                                                            onClick={() => handleReactivate(contrato)}
                                                            disabled={reactivatingContrato}
                                                        >
                                                            Retomar
                                                        </button>
                                                    )}
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

            {editingContrato && (
                <ContratoEditModal
                    contrato={editingContrato}
                    onClose={() => setEditingContrato(null)}
                    onSaved={() => { setEditingContrato(null); reload(); }}
                />
            )}

            {/* Pause Modal */}
            {pauseTarget && (
                <div
                    style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(0,0,0,0.5)", zIndex: 999,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    onClick={() => setPauseTarget(null)}
                >
                    <div
                        className="card"
                        style={{ width: "100%", maxWidth: "440px", zIndex: 1000 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: "0 0 var(--space-4)", fontSize: "18px", fontWeight: "var(--weight-semibold)" }}>
                            Pausar Contrato
                        </h3>
                        <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-4)", fontSize: "14px" }}>
                            Aluno: <strong>{pauseTarget.student?.name}</strong>
                        </p>
                        <div style={{
                            background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.4)",
                            borderRadius: "var(--border-radius)", padding: "var(--space-3)",
                            marginBottom: "var(--space-4)", fontSize: "13px", color: "var(--color-text-secondary)"
                        }}>
                            Ao pausar, todas as cobranças futuras pendentes serão canceladas.
                        </div>
                        <div style={{ marginBottom: "var(--space-4)" }}>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontWeight: "var(--weight-medium)" }}>
                                Data prevista de retorno *
                            </label>
                            <input
                                type="date"
                                className="input"
                                value={expectedReturnDate}
                                onChange={(e) => { setExpectedReturnDate(e.target.value); setPauseError(""); }}
                                min={new Date().toISOString().split("T")[0]}
                            />
                            {pauseError && <p style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{pauseError}</p>}
                        </div>
                        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
                            <button className="btn btn-ghost" onClick={() => setPauseTarget(null)} disabled={pauseLoading}>
                                Cancelar
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleConfirmPause}
                                disabled={pauseLoading}
                                style={{ background: "var(--color-warning, #f59e0b)" }}
                            >
                                {pauseLoading ? "Pausando..." : "Confirmar Pausa"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
