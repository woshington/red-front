import { useState } from "react";
import { useContratos, useCreateContrato } from "../../hooks/useContratos";
import { ContratoFormModal } from "../../components/contrato/contratoFormModal";

export function ContratosPage() {
    const [skip, setSkip] = useState(0);
    const limit = 10;
    const { data, loading, error, reload } = useContratos({ skip, limit });
    const { create: createContrato, loading: creatingContrato } = useCreateContrato();
    const [showModal, setShowModal] = useState(false);

    const handleCreateContrato = async (formData: any) => {
        try {
            await createContrato(formData);
            setShowModal(false);
            reload();
        } catch (err) {
            console.error("Erro ao criar contrato:", err);
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
                                {["Aluno", "Valor", "Plano", "Início", "Dia Pag.", "Status"].map((h) => (
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
                            {data.items.map((contrato: any) => (
                                <tr
                                    key={contrato.id}
                                    style={{ borderBottom: "1px solid var(--color-border)" }}
                                >
                                    <td style={{ padding: "var(--space-3) var(--space-4)", fontWeight: "var(--weight-medium)" }}>
                                        {contrato.student?.name || "Desconhecido"}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        R$ {Number(contrato.monthly_fee).toFixed(2).replace('.', ',')}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {contrato.plan_type}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        {new Date(contrato.start_date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                        Dia {contrato.payment_day}
                                    </td>
                                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                        <span
                                            className="badge"
                                            style={
                                                contrato.is_active
                                                    ? {}
                                                    : { background: "rgba(248,113,113,0.15)", color: "var(--color-error)" }
                                            }
                                        >
                                            {contrato.is_active ? "Ativo" : "Inativo"}
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
                <ContratoFormModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateContrato}
                    loading={creatingContrato}
                />
            )}
        </div>
    );
}
