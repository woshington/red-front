import { useState } from "react";
import { useCreateTurma, useTurmas, useUpdateTurma } from "../../hooks/useTurmas";
import { TurmaFormModal } from "../../components/turma/turmaFormModal";
import type { Turma } from "../../types";


export function TurmasPage() {
    const [skip, setSkip] = useState(0);
    const limit = 20;
    const { data, loading, error, reload } = useTurmas({ skip, limit });
    const { create: createTurma, loading: creatingTurma } = useCreateTurma();
    const [showModal, setShowModal] = useState(false);

    const { update: updateTurma, loading: updatingTurma } = useUpdateTurma();
    const [editingTurma, setEditingTurma] = useState<any>(null);

    const handleCreateOrUpdate = async (formData: any) => {
        try {
            if (editingTurma) {
                await updateTurma(editingTurma.id, formData);
            } else {
                await createTurma(formData);
            }
            setShowModal(false);
            setEditingTurma(null);
            reload(); // Recarrega a lista
        } catch (err) {
            console.error("Erro ao salvar turma:", err);
        }
    };

    const handleToggleStatus = async (turma: Turma) => {
        try {
            const formData = {
                name: turma.name,
                teacher_id: String(turma.teacher?.id || ""),
                year: turma.year,
                max_students: turma.max_students,
                is_active: !turma.is_active,
            };
            await updateTurma(turma.id, formData);
            reload();
        } catch (err) {
            console.error("Erro ao alterar status:", err);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-6)" }}>
                <h2>Turmas</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingTurma(null);
                        setShowModal(true);
                    }}
                >
                    + Nova Turma
                </button>
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
                                {["Nome", "Professor", "Ano", "Total", "Máximo", "Status", "Ações"].map((h) => (
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
                            {data.items.map((turma) => (
                                <tr
                                    key={turma.id}
                                    style={{ borderBottom: "1px solid var(--color-border)" }}
                                >
                                    <td style={{ padding: "var(--space-3) var(--space-4)", fontWeight: "var(--weight-medium)" }}>
                                        {turma.name}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {turma.teacher.name}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {turma.year}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {turma.student_count}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {turma.max_students}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                        <span
                                            className="badge"
                                            style={
                                                turma.is_active
                                                    ? {}
                                                    : { background: "rgba(248,113,113,0.15)", color: "var(--color-error)" }
                                            }
                                        >
                                            {turma.is_active ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                        <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                            <button
                                                className="btn btn-ghost"
                                                style={{ padding: "var(--space-1) var(--space-2)", fontSize: "var(--text-xs)" }}
                                                onClick={() => {
                                                    setEditingTurma(turma);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-ghost"
                                                style={{ padding: "var(--space-1) var(--space-2)", fontSize: "var(--text-xs)" }}
                                                onClick={() => handleToggleStatus(turma)}
                                                disabled={updatingTurma}
                                            >
                                                {turma.is_active ? "Desativar" : "Ativar"}
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

                        <div style={{ display: "flex", gap: "var(--space-2)" }}>
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
            {/* Modal de criação */}
            {showModal && (
                <TurmaFormModal
                    onClose={() => {
                        setShowModal(false);
                        setEditingTurma(null);
                    }}
                    onSubmit={handleCreateOrUpdate}
                    loading={creatingTurma || updatingTurma}
                    initialData={editingTurma}
                />
            )}
        </div>
    );
}

