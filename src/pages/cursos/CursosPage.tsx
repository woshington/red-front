import { useCursos } from "../../hooks/useCursos";


export function CursosPage() {
    const { data, loading, error, reload } = useCursos({ per_page: 20 });

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-6)" }}>
                <h2>Cursos</h2>
                <button className="btn btn-primary">+ Novo Curso</button>
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
                                {["Nome", "Duração (h)", "Ativo"].map((h) => (
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
                            {data.data.map((curso) => (
                                <tr
                                    key={curso.id}
                                    style={{ borderBottom: "1px solid var(--color-border)" }}
                                >
                                    <td style={{ padding: "var(--space-3) var(--space-4)", fontWeight: "var(--weight-medium)" }}>
                                        {curso.nome}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {curso.duracao_horas}h
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                        <span
                                            className="badge"
                                            style={
                                                curso.ativo
                                                    ? {}
                                                    : { background: "rgba(248,113,113,0.15)", color: "var(--color-error)" }
                                            }
                                        >
                                            {curso.ativo ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p className="text-muted text-sm" style={{ marginTop: "var(--space-4)" }}>
                        {data.total} registro(s) encontrado(s)
                    </p>
                </div>
            )}
        </div>
    );
}

