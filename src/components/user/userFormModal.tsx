import { useState, useEffect } from "react";
import type { User } from "../../services/users";

interface UserFormModalProps {
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    loading: boolean;
    initialData?: User | null;
}

export function UserFormModal({ onClose, onSubmit, loading, initialData }: UserFormModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("FINANCIAL");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setEmail(initialData.email);
            setRole(initialData.role);
            // We don't set password for editing
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload: any = { name, email, role };
        if (!initialData) {
            if (!password) {
                alert("A senha é obrigatória para criar um novo usuário");
                return;
            }
            payload.password = password;
        }

        await onSubmit(payload);
    };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
            <div className="card" style={{ width: "100%", maxWidth: "500px", padding: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
                    <h2 style={{ margin: 0, fontSize: "20px" }}>
                        {initialData ? "Editar Usuário" : "Novo Usuário"}
                    </h2>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: "var(--space-2)" }}>✕</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" }}>Nome Completo</label>
                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="Ex: João Silva"
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" }}>Email</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="joao@escola.com.br"
                        />
                    </div>
                    {!initialData && (
                        <div>
                            <label style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" }}>Senha</label>
                            <input
                                type="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={!initialData}
                                disabled={loading}
                                placeholder="******"
                            />
                        </div>
                    )}
                    <div>
                        <label style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" }}>Perfil de Acesso (Role)</label>
                        <select
                            className="input"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            disabled={loading}
                        >
                            <option value="ADMIN">Administrador</option>
                            <option value="FINANCIAL">Financeiro</option>
                            <option value="ACADEMIC">Acadêmico</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                        <button type="button" onClick={onClose} className="btn btn-ghost" disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
