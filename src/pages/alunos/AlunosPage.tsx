import { useState } from "react";
import { useAlunos, useCreateAluno, useUpdateAluno, useMarkDefaulter, useRemoveDefaulter } from "../../hooks/useAlunos";
import { AlunoFormModal } from "../../components/aluno/alunoFormModal";
import { STUDENT_LEVELS } from "../../types/aluno";
import type { Aluno } from "../../types/aluno";

export function AlunosPage() {
    const params = new URLSearchParams(window.location.search);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(20);
    const [statusFilter, setStatusFilter] = useState(params.get("status") || "");
    const [defaulterFilter, setDefaulterFilter] = useState(params.get("defaulter") || "");
    
    const { data, loading, error, reload } = useAlunos({ 
        skip, 
        limit,
        active: statusFilter === "true" ? true : statusFilter === "false" ? false : undefined,
        defaulter: defaulterFilter === "true" ? true : defaulterFilter === "false" ? false : undefined,
    });
    const { create: createAluno, loading: creatingAluno } = useCreateAluno();
    const { update: updateAluno, loading: updatingAluno } = useUpdateAluno();
    const { markDefaulter, loading: markingDefaulter } = useMarkDefaulter();
    const { removeDefaulter, loading: removingDefaulter } = useRemoveDefaulter();
    const [showModal, setShowModal] = useState(false);
    const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);

    const handleCreateOrUpdateAluno = async (formData: any) => {
        try {
            if (editingAluno) {
                await updateAluno(editingAluno.id, formData);
            } else {
                await createAluno(formData);
            }
            setShowModal(false);
            setEditingAluno(null);
            reload();
        } catch (err) {
            console.error("Erro ao salvar aluno:", err);
        }
    };

    const handleEditClick = (aluno: Aluno) => {
        setEditingAluno(aluno);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAluno(null);
    };

    const handleToggleDefaulter = async (aluno: Aluno) => {
        const isDefaulter = !!aluno.defaulter_date;
        const msg = isDefaulter 
            ? `Tem certeza que deseja remover a negativação de ${aluno.name}?`
            : `Tem certeza que deseja marcar ${aluno.name} como negativado?`;
            
        if (!window.confirm(msg)) return;

        try {
            if (isDefaulter) {
                await removeDefaulter(aluno.id);
            } else {
                await markDefaulter(aluno.id);
            }
            reload();
        } catch (err) {
            console.error("Erro ao alterar situação de negativação:", err);
            alert("Erro na operação.");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-6)" }}>
                <h2>Alunos</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    + Novo Aluno
                </button>
            </div>

            {/* Filtros */}
            <div style={{
                display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-4)", flexWrap: "wrap"
            }}>
                <div style={{ flex: 1, minWidth: "150px" }}>
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)", display: "block" }}>Status</label>
                    <select 
                        className="input" 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="true">Ativos</option>
                        <option value="false">Inativos</option>
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: "150px" }}>
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)", display: "block" }}>Inadimplência</label>
                    <select 
                        className="input" 
                        value={defaulterFilter} 
                        onChange={(e) => setDefaulterFilter(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="true">Negativados</option>
                        <option value="false">Regular</option>
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
                                {["Nome", "CPF", "Telefone", "Nível", "Status", ""].map((h, i) => (
                                    <th
                                        key={h || i}
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
                            {data.items?.map((aluno) => (
                                <tr
                                    key={aluno.id}
                                    style={{ borderBottom: "1px solid var(--color-border)" }}
                                >
                                    <td style={{ padding: "var(--space-3) var(--space-4)", fontWeight: "var(--weight-medium)" }}>
                                        {aluno.name}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {aluno.document}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {aluno.phone || "-"}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {
                                            STUDENT_LEVELS.find(level => level.value === aluno.level)?.label ?? "-"
                                        }
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                        <span
                                            className="badge"
                                            style={
                                                aluno.active
                                                    ? {}
                                                    : { background: "rgba(248,113,113,0.15)", color: "var(--color-error)" }
                                            }
                                        >
                                            {aluno.active ? "Ativo" : "Inativo"}
                                        </span>
                                        {aluno.defaulter_date && (
                                            <span
                                                className="badge"
                                                style={{ background: "rgba(248,113,113,0.15)", color: "var(--color-error)", marginLeft: "var(--space-2)" }}
                                            >
                                                Negativado
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", textAlign: "right" }}>
                                        <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
                                            <button 
                                                className="btn btn-ghost" 
                                                style={{ fontSize: "var(--text-xs)", padding: "var(--space-2) var(--space-3)" }}
                                                onClick={() => handleEditClick(aluno)}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className="btn btn-ghost" 
                                                style={{ 
                                                    fontSize: "var(--text-xs)", 
                                                    padding: "var(--space-2) var(--space-3)",
                                                    color: aluno.defaulter_date ? "var(--color-success)" : "var(--color-error)"
                                                }}
                                                onClick={() => handleToggleDefaulter(aluno)}
                                                disabled={markingDefaulter || removingDefaulter}
                                            >
                                                {aluno.defaulter_date ? "Limpar Nome" : "Negativar"}
                                            </button>
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
                <AlunoFormModal
                    onClose={handleCloseModal}
                    onSubmit={handleCreateOrUpdateAluno}
                    loading={creatingAluno || updatingAluno}
                    initialData={editingAluno}
                />
            )}
        </div>
    );
}