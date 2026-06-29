import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';

export function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());

    const { data, loading, error, reload } = useDashboard(month, year);

    if (user?.role === 'ACADEMIC') {
        return <Navigate to="/turmas" replace />;
    }

    if (loading) {
        return (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
                Carregando dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-danger)" }}>
                Erro ao carregar dados.
                <button onClick={reload} className="btn btn-primary" style={{ marginLeft: "1rem" }}>
                    Tentar novamente
                </button>
            </div>
        );
    }

    const formatCurrency = (val: any) => {
        return `R$ ${Number(val || 0).toFixed(2).replace('.', ',')}`;
    };

    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    const endOfMonth = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

    const metrics = [
        {
            label: "Matrículas Ativas",
            value: data?.effective_enrollments?.toLocaleString() || "0",
            icon: "ti-users",
            positive: true,
            path: "/alunos?status=true"
        },
        {
            label: "Cancelamentos no Mês",
            value: data?.cancellations?.toLocaleString() || "0",
            icon: "ti-alert-triangle",
            positive: false,
            path: `/contratos?status=CANCELED&start_date=${startOfMonth}&end_date=${endOfMonth}`
        },
        {
            label: "Receita do Mês",
            value: formatCurrency(data?.current_month_received),
            icon: "ti-cash",
            positive: true,
            path: `/pagamentos?status=PAID&date_type=payment_date&start_date=${startOfMonth}&end_date=${endOfMonth}`
        },
        {
            label: "Previsão (Mês)",
            value: formatCurrency(data?.monthly_expected_revenue),
            icon: "ti-chart-bar",
            positive: true,
            path: `/pagamentos?status=PENDING&date_type=due_date&start_date=${startOfMonth}&end_date=${endOfMonth}`
        },
        {
            label: "Valor Inadimplente",
            value: formatCurrency(data?.overdue_total),
            icon: "ti-credit-card",
            positive: false,
            path: `/pagamentos?status=OVERDUE&date_type=due_date&end_date=${endOfMonth}`
        },
        {
            label: "Alunos Negativados",
            value: data?.blacklisted_count?.toLocaleString() || "0",
            icon: "ti-alert-circle",
            positive: false,
            path: "/alunos?defaulter=true"
        },
    ];

    const COLORS = ['#378ADD', '#639922', '#BA7517', '#E24B4A'];

    const revenueByLevel = data?.revenue_by_level?.map((item: any) => ({
        name: item.level,
        value: Number(item.revenue)
    })) || [];

    const contractStatus = data?.contract_status_chart?.map((item: any) => ({
        name: item.status,
        Quantidade: item.count
    })) || [];

    return (
        <div style={{ padding: "0 0 2rem" }}>
            {/* Header & Filtro */}
            <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ margin: "0 0 0.5rem", fontSize: "28px", fontWeight: 500, color: "var(--color-text-primary)" }}>
                        Gestão Educacional
                    </h1>
                    <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-secondary)" }}>
                        Acompanhamento em tempo real de matrículas, cancelamentos e performance financeira
                    </p>
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    <select className="input" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                        {["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"].map((name, i) => (
                            <option key={i + 1} value={i + 1}>{name}</option>
                        ))}
                    </select>
                    <select className="input" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                        {Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i).map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Cards de métricas */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                marginBottom: "3rem",
            }}>
                {metrics.map((metric, idx) => {
                    const colorMap: Record<number, any> = {
                        0: { primary: "#378ADD", light: "#E6F1FB", dark: "#185FA5", accent: "#5BA3F5" },
                        1: { primary: "#D85A30", light: "#FAECE7", dark: "#993C1D", accent: "#F08860" },
                        2: { primary: "#639922", light: "#EAF3DE", dark: "#3B6D11", accent: "#7CB835" },
                        3: { primary: "#BA7517", light: "#FAEEDA", dark: "#854F0B", accent: "#D4A04D" },
                        4: { primary: "#E24B4A", light: "#FCEBEB", dark: "#A32D2D", accent: "#FF7676" },
                        5: { primary: "#993C1D", light: "#FAECE7", dark: "#702A14", accent: "#D85A30" },
                    };
                    const colors = colorMap[idx % 6];

                    return (
                        <div
                            key={metric.label}
                            onClick={() => metric.path && navigate(metric.path)}
                            style={{
                                background: "var(--color-background-primary)",
                                border: "1.5px solid #f0f0f0",
                                borderRadius: "16px",
                                padding: "2rem",
                                position: "relative",
                                overflow: "hidden",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                                cursor: "pointer",
                                transition: "transform 0.2s, box-shadow 0.2s"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                            }}
                        >
                            <div style={{ position: "relative", zIndex: 2 }}>
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.75rem" }}>
                                    <div style={{
                                        width: "60px", height: "60px",
                                        background: `linear-gradient(135deg, ${colors.light} 0%, ${colors.light}60 100%)`,
                                        borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <i className={metric.icon} style={{ fontSize: "32px", color: colors.primary }}></i>
                                    </div>
                                </div>
                                <p style={{ margin: "0 0 0.75rem", fontSize: "13px", color: "var(--color-text-secondary)", fontWeight: 500, textTransform: "uppercase" }}>
                                    {metric.label}
                                </p>
                                <p style={{ margin: "0 0 1.5rem", fontSize: "28px", fontWeight: 700, color: colors.dark, lineHeight: 1 }}>
                                    {metric.value}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Gráficos Estratégicos */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>

                {/* Status dos Contratos */}
                <div style={{
                    background: "var(--color-background-primary)",
                    border: "0.5px solid var(--color-border-tertiary)",
                    borderRadius: "var(--border-radius-lg)",
                    padding: "2rem",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                }}>
                    <h3 style={{ margin: "0 0 1.5rem", fontSize: "18px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                        Status de Contratos
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={contractStatus} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px' }} />
                            <Bar dataKey="Quantidade" fill="#378ADD" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Receita por Nível */}
                <div style={{
                    background: "var(--color-background-primary)",
                    border: "0.5px solid var(--color-border-tertiary)",
                    borderRadius: "var(--border-radius-lg)",
                    padding: "2rem",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                }}>
                    <h3 style={{ margin: "0 0 1.5rem", fontSize: "18px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                        Receita por Nível (Mês)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={revenueByLevel}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                            >
                                {revenueByLevel.map((_entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '8px' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
}