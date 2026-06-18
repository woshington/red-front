import { useState } from "react";
import { useGetProfessores, useCreateProfessores, useUpdateProfessores } from "../../hooks/useProfessores";
import { ProfessorFormModal } from "../../components/professor/professorFormModal";

export function ProfessoresPage() {
    const [skip, setSkip] = useState(0);
    const limit = 10;
    const { data, loading, error, reload } = useGetProfessores({ skip, limit, active_only: false });
    const { create: createProfessor, loading: creatingProfessor } = useCreateProfessores();
    const [showModal, setShowModal] = useState(false);

    const { update: updateProfessor, loading: updatingProfessor } = useUpdateProfessores();
    const [editingProfessor, setEditingProfessor] = useState<any>(null);

    const handleCreateOrUpdate = async (formData: any) => {
        try {
            if (editingProfessor) {
                await updateProfessor(editingProfessor.id, formData);
            } else {
                await createProfessor(formData);
            }
            setShowModal(false);
            setEditingProfessor(null);
            reload();
        } catch (err) {
            console.error("Erro ao salvar professor:", err);
        }
    };

    const handleToggleStatus = async (professor: any) => {
        try {
            const formData = {
                name: professor.name,
                email: professor.email,
                is_active: !professor.is_active,
            };
            await updateProfessor(professor.id, formData);
            reload();
        } catch (err) {
            console.error("Erro ao alterar status:", err);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-6)" }}>
                <h2>Professores</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingProfessor(null);
                        setShowModal(true);
                    }}
                >
                    + Novo Professor
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
                                {["Nome", "E-mail", "Status", "Ações"].map((h) => (
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
                            {data.items.map((professor: any) => (
                                <tr
                                    key={professor.id}
                                    style={{ borderBottom: "1px solid var(--color-border)" }}
                                >
                                    <td style={{ padding: "var(--space-3) var(--space-4)", fontWeight: "var(--weight-medium)" }}>
                                        {professor.name}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {professor.email}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                        <span
                                            className="badge"
                                            style={
                                                professor.is_active
                                                    ? {}
                                                    : { background: "rgba(248,113,113,0.15)", color: "var(--color-error)" }
                                            }
                                        >
                                            {professor.is_active ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                        <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                            <button
                                                className="btn btn-ghost"
                                                style={{ padding: "var(--space-1) var(--space-2)", fontSize: "var(--text-xs)" }}
                                                onClick={() => {
                                                    setEditingProfessor(professor);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-ghost"
                                                style={{ padding: "var(--space-1) var(--space-2)", fontSize: "var(--text-xs)" }}
                                                onClick={() => handleToggleStatus(professor)}
                                                disabled={updatingProfessor}
                                            >
                                                {professor.is_active ? "Desativar" : "Ativar"}
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

            {showModal && (
                <ProfessorFormModal
                    onClose={() => {
                        setShowModal(false);
                        setEditingProfessor(null);
                    }}
                    onSubmit={handleCreateOrUpdate}
                    loading={creatingProfessor || updatingProfessor}
                    initialData={editingProfessor}
                />
            )}
        </div>
    );
}