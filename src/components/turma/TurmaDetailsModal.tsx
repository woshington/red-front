import { useState, useEffect } from "react";
import { turmasService } from "../../services/turmas";
import { useTransferStudents } from "../../hooks/useTurmas";
import { useTurmas } from "../../hooks/useTurmas";
import { useAlunos } from "../../hooks/useAlunos";
import type { Turma } from "../../types";

interface Props {
    turma: Turma;
    onClose: () => void;
    onUpdate: () => void;
}

export function TurmaDetailsModal({ turma, onClose, onUpdate }: Props) {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    
    // For transfer
    const { data: turmasData } = useTurmas({ limit: 100, is_active: true });
    const { transfer, loading: transferring } = useTransferStudents();
    const [targetClassId, setTargetClassId] = useState<string>("");

    // For adding new students
    const [studentSearch, setStudentSearch] = useState("");
    const { data: searchResults, loading: searching } = useAlunos({ 
        search: studentSearch || undefined, 
        active: true,
        limit: 5 
    });

    const loadStudents = async () => {
        setLoading(true);
        try {
            const data = await turmasService.getStudents(turma.id);
            setStudents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, [turma.id]);

    const handleToggleStudent = (id: string) => {
        setSelectedStudentIds(prev => 
            prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
        );
    };

    const handleTransfer = async () => {
        if (selectedStudentIds.length === 0) {
            alert("Selecione pelo menos um aluno para transferir.");
            return;
        }

        const msg = targetClassId 
            ? `Transferir ${selectedStudentIds.length} aluno(s) para a nova turma?`
            : `Remover ${selectedStudentIds.length} aluno(s) desta turma?`;
            
        if (!window.confirm(msg)) return;

        try {
            await transfer(selectedStudentIds, targetClassId || null);
            setSelectedStudentIds([]);
            await loadStudents();
            onUpdate(); // refresh lists
            alert("Operação concluída com sucesso!");
        } catch (err) {
            console.error("Erro ao transferir:", err);
            alert("Erro ao efetuar transferência.");
        }
    };

    const handleAddStudent = async (studentId: string) => {
        try {
            await transfer([studentId], turma.id);
            setStudentSearch("");
            await loadStudents();
            onUpdate();
            alert("Aluno adicionado com sucesso!");
        } catch (err) {
            console.error("Erro ao adicionar aluno:", err);
            alert("Erro ao adicionar aluno.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: "800px" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-4)" }}>
                    <h2 style={{ margin: 0 }}>Alunos: {turma.name}</h2>
                    <button className="btn btn-ghost" onClick={onClose}>✕</button>
                </div>

                <p className="text-muted" style={{ marginBottom: "var(--space-4)" }}>
                    Professor: {turma.teacher?.name || "Sem professor"} | Vagas ocupadas: {turma.student_count} / {turma.max_students}
                </p>

                {/* Add Student Area */}
                <div className="card" style={{ marginBottom: "var(--space-4)", background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                    <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)", display: "block" }}>
                        Adicionar Aluno na Turma
                    </label>
                    <input 
                        className="input" 
                        placeholder="Buscar aluno por nome para matricular nesta turma..." 
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                    />
                    
                    {studentSearch.length > 2 && (
                        <div style={{ marginTop: "var(--space-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                            {searching ? (
                                <div style={{ padding: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>Buscando...</div>
                            ) : searchResults?.items.length === 0 ? (
                                <div style={{ padding: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>Nenhum aluno encontrado.</div>
                            ) : (
                                searchResults?.items.map((aluno: any) => {
                                    const isAlreadyInClass = students.some(s => s.id === aluno.id);
                                    return (
                                        <div 
                                            key={aluno.id} 
                                            style={{ 
                                                display: "flex", 
                                                justifyContent: "space-between", 
                                                alignItems: "center", 
                                                padding: "var(--space-2) var(--space-3)",
                                                borderBottom: "1px solid var(--color-border)",
                                                background: isAlreadyInClass ? "var(--color-surface-2)" : "transparent"
                                            }}
                                        >
                                            <span style={{ fontSize: "var(--text-sm)", opacity: isAlreadyInClass ? 0.5 : 1 }}>
                                                {aluno.name} {isAlreadyInClass && "(Já matriculado)"}
                                            </span>
                                            {!isAlreadyInClass && (
                                                <button 
                                                    className="btn btn-ghost" 
                                                    style={{ padding: "4px 8px", fontSize: "12px", color: "var(--color-primary)" }}
                                                    onClick={() => handleAddStudent(aluno.id)}
                                                    disabled={transferring}
                                                >
                                                    + Adicionar
                                                </button>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    )}
                </div>

                {/* Transfer Area */}
                {selectedStudentIds.length > 0 && (
                    <div className="card" style={{ marginBottom: "var(--space-4)", display: "flex", gap: "var(--space-4)", alignItems: "flex-end", background: "var(--color-surface-2)" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)", display: "block" }}>
                                Ação ({selectedStudentIds.length} selecionados)
                            </label>
                            <select 
                                className="input" 
                                value={targetClassId}
                                onChange={(e) => setTargetClassId(e.target.value)}
                            >
                                <option value="">Remover da Turma (Ficar sem turma)</option>
                                {turmasData?.items.filter(t => t.id !== turma.id).map(t => (
                                    <option key={t.id} value={t.id}>Transferir para: {t.name}</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleTransfer}
                            disabled={transferring}
                        >
                            Confirmar
                        </button>
                    </div>
                )}

                {loading ? (
                    <p>Carregando alunos...</p>
                ) : students.length === 0 ? (
                    <div className="card text-center text-muted">
                        Nenhum aluno matriculado nesta turma.
                    </div>
                ) : (
                    <div style={{ overflowX: "auto", maxHeight: "400px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                    <th style={{ padding: "var(--space-3)", textAlign: "left", width: "40px" }}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedStudentIds.length === students.length && students.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedStudentIds(students.map(s => s.id));
                                                } else {
                                                    setSelectedStudentIds([]);
                                                }
                                            }}
                                        />
                                    </th>
                                    <th style={{ padding: "var(--space-3)", textAlign: "left", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Nome do Aluno</th>
                                    <th style={{ padding: "var(--space-3)", textAlign: "left", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Documento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((aluno) => (
                                    <tr key={aluno.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                        <td style={{ padding: "var(--space-3)" }}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedStudentIds.includes(aluno.id)}
                                                onChange={() => handleToggleStudent(aluno.id)}
                                            />
                                        </td>
                                        <td style={{ padding: "var(--space-3)", fontWeight: "var(--weight-medium)" }}>
                                            {aluno.name}
                                        </td>
                                        <td style={{ padding: "var(--space-3)", color: "var(--color-text-muted)" }}>
                                            {aluno.document || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
