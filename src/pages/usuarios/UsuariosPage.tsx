import { useState } from "react";
import { useUsers, useUpdateUser, useCreateUser } from "../../hooks/useUsers";
import { useAuth } from "../../context/AuthContext";
import { UserFormModal } from "../../components/user/userFormModal";
import type { User } from "../../services/users";

export function UsuariosPage() {
    const { user: currentUser } = useAuth();
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(20);
    const [searchName, setSearchName] = useState("");

    const { data, loading, error, reload } = useUsers({ 
        skip, 
        limit,
        name: searchName || undefined,
    });
    
    const { update: updateUser, loading: updatingUser } = useUpdateUser();
    const { create: createUser, loading: creatingUser } = useCreateUser();
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleCreateOrUpdate = async (formData: any) => {
        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
            } else {
                await createUser(formData);
            }
            setShowModal(false);
            setEditingUser(null);
            reload();
        } catch (err) {
            console.error("Erro ao salvar usuário:", err);
            alert("Erro ao salvar usuário.");
        }
    };

    const handleToggleStatus = async (user: User) => {
        if (user.id === currentUser?.id) {
            alert("Você não pode bloquear a si mesmo.");
            return;
        }

        const action = user.active ? "bloquear" : "desbloquear";
        if (!window.confirm(`Tem certeza que deseja ${action} o acesso de ${user.name}?`)) return;

        try {
            await updateUser(user.id, { active: !user.active });
            reload();
        } catch (err) {
            console.error("Erro ao alterar status:", err);
            alert("Erro na operação.");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-6)" }}>
                <div>
                    <h1 style={{ margin: "0 0 var(--space-2) 0", fontSize: "24px", fontWeight: "var(--weight-semibold)" }}>
                        Gestão de Equipe
                    </h1>
                    <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
                        Gerencie os usuários do sistema e seus níveis de acesso
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingUser(null);
                        setShowModal(true);
                    }}
                >
                    + Novo Usuário
                </button>
            </div>

            {/* Filtros */}
            <div style={{
                display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-4)", flexWrap: "wrap"
            }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)", display: "block" }}>Nome do Usuário</label>
                    <input 
                        className="input" 
                        placeholder="Buscar por nome..." 
                        value={searchName} 
                        onChange={(e) => setSearchName(e.target.value)} 
                    />
                </div>
            </div>

            {loading && <p className="text-muted">Carregando...</p>}
            {error && (
                <div className="card" style={{ borderColor: "var(--color-error)" }}>
                    <p style={{ color: "var(--color-error)", margin: 0 }}>{error}</p>
                    <button className="btn btn-ghost" style={{ marginTop: "var(--space-3)" }} onClick={reload}>
                        Tentar novamente
                    </button>
                </div>
            )}

            {!loading && !error && data && (
                <>
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                        {["Nome", "Email", "Perfil", "Status", "Ações"].map((h) => (
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
                                    {data.items.map((user: User) => (
                                        <tr
                                            key={user.id}
                                            style={{
                                                borderBottom: "1px solid var(--color-border)",
                                                transition: "background-color 0.2s ease",
                                            }}
                                        >
                                            <td style={{ padding: "var(--space-3) var(--space-4)", fontWeight: "var(--weight-medium)" }}>
                                                {user.name}
                                            </td>
                                            <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--color-text-muted)" }}>
                                                {user.email}
                                            </td>
                                            <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                                {user.role}
                                            </td>
                                            <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                                                <span
                                                    className="badge"
                                                    style={{
                                                        background: user.active ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
                                                        color: user.active ? "var(--color-success)" : "var(--color-error)"
                                                    }}
                                                >
                                                    {user.active ? "Ativo" : "Bloqueado"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "var(--space-3) var(--space-4)", textAlign: "right" }}>
                                                <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
                                                    <button 
                                                        className="btn btn-ghost" 
                                                        style={{ fontSize: "var(--text-xs)", padding: "4px 8px" }}
                                                        onClick={() => {
                                                            setEditingUser(user);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button 
                                                        className="btn btn-ghost" 
                                                        style={{ 
                                                            fontSize: "var(--text-xs)", 
                                                            padding: "4px 8px",
                                                            color: user.active ? "var(--color-error)" : "var(--color-success)"
                                                        }}
                                                        onClick={() => handleToggleStatus(user)}
                                                        disabled={updatingUser}
                                                    >
                                                        {user.active ? "Bloquear" : "Desbloquear"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {data.items.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ padding: "var(--space-6) var(--space-4)", textAlign: "center" }}>
                                                <div style={{ color: "var(--color-text-muted)" }}>Nenhum usuário encontrado.</div>
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
                            Mostrando {skip + 1} até {Math.min(skip + limit, data.total)} de {data.total} usuários
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

            {showModal && (
                <UserFormModal
                    onClose={() => {
                        setShowModal(false);
                        setEditingUser(null);
                    }}
                    onSubmit={handleCreateOrUpdate}
                    loading={creatingUser || updatingUser}
                    initialData={editingUser}
                />
            )}
        </div>
    );
}
