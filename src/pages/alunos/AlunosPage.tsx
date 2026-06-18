import { useState } from "react";
import { useAlunos, useCreateAluno } from "../../hooks/useAlunos";
import { AlunoFormModal } from "../../components/aluno/alunoFormModal";

export function AlunosPage() {
    const [skip, setSkip] = useState(0);
    const limit = 10;
    const { data, loading, error, reload } = useAlunos({ skip, limit });
    const { create: createAluno, loading: creatingAluno } = useCreateAluno();
    const [showModal, setShowModal] = useState(false);

    const handleCreateAluno = async (formData: any) => {
        try {
            await createAluno(formData);
            setShowModal(false);
            reload();
        } catch (err) {
            console.error("Erro ao criar aluno:", err);
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
                                {["Nome", "E-mail", "CPF", "Telefone", "Status"].map((h) => (
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
                            {data.items.map((aluno) => (
                                <tr
                                    key={aluno.id}
                                    style={{ borderBottom: "1px solid var(--color-border)" }}
                                >
                                    <td style={{ padding: "var(--space-3) var(--space-4)", fontWeight: "var(--weight-medium)" }}>
                                        {aluno.name}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {aluno.email}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {aluno.document_number}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {aluno.phone || "-"}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                        <span
                                            className="badge"
                                            style={
                                                aluno.is_active
                                                    ? {}
                                                    : { background: "rgba(248,113,113,0.15)", color: "var(--color-error)" }
                                            }
                                        >
                                            {aluno.is_active ? "Ativo" : "Inativo"}
                                        </span>
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
                <AlunoFormModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateAluno}
                    loading={creatingAluno}
                />
            )}
        </div>
    );
}