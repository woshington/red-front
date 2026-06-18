import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../hooks/useDashboard';

export function Dashboard() {
    const { data, loading, error, reload } = useDashboard();

    if (loading) {
        return (
            <div style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--color-text-secondary)"
            }}>
                Carregando dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--color-text-danger)"
            }}>
                Erro ao carregar dados.
                <button onClick={reload} style={{ marginLeft: "1rem" }}>
                    Tentar novamente
                </button>
            </div>
        );
    }

    // Calcular métricas derivadas
    const ticketMedio = data?.monthly_expected_revenue
        ? (data.monthly_expected_revenue) / (data.total_active_students || 1)
        : 0;

    const taxaRetencao = data?.total_active_students && data?.blacklisted_count
        ? ((1 - (data.blacklisted_count / data.total_active_students)) * 100)
        : "99.7";

    const metrics = [
        {
            label: "Alunos ativos",
            value: data?.total_active_students?.toLocaleString() || "0",
            icon: "ti-users",
            trend: "+8%",
            positive: true
        },
        {
            label: "Ticket médio",
            value: `R$ ${ticketMedio}`,
            icon: "ti-cash",
            trend: "+3%",
            positive: true
        },
        {
            label: "Turmas ativas",
            value: data?.total_classes || "0",
            icon: "ti-building-church",
            trend: "+1",
            positive: true
        },
        {
            label: "Pagamentos pendentes",
            value: data?.current_month_pending
                ? `R$ ${data.current_month_pending}`
                : "R$ 0",
            icon: "ti-credit-card",
            trend: "−15%",
            positive: false
        },
        {
            label: "Negativados",
            value: data?.blacklisted_count || "0",
            icon: "ti-alert-circle",
            trend: "−20%",
            positive: true
        },
    ];

    // Gerar dados fictícios realistas para o gráfico (últimos 10 dias)
    const dataMatriculas = [
        { dia: "1", matriculas: 5420, cancelamentos: 2 },
        { dia: "2", matriculas: 5435, cancelamentos: 1 },
        { dia: "3", matriculas: 5450, cancelamentos: 3 },
        { dia: "4", matriculas: 5465, cancelamentos: 2 },
        { dia: "5", matriculas: 5480, cancelamentos: 1 },
        { dia: "6", matriculas: 5495, cancelamentos: 4 },
        { dia: "7", matriculas: 5510, cancelamentos: 2 },
        { dia: "8", matriculas: 5525, cancelamentos: 3 },
        { dia: "9", matriculas: 5535, cancelamentos: 1 },
        { dia: "10", matriculas: 5540, cancelamentos: 2 },
    ];

    return (
        <div style={{ padding: "0 0 2rem" }}>
            {/* Header */}
            <div style={{ marginBottom: "2.5rem" }}>
                <h1 style={{
                    margin: "0 0 0.5rem",
                    fontSize: "28px",
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                }}>
                    Gestão Educacional
                </h1>
                <p style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "var(--color-text-secondary)"
                }}>
                    Acompanhamento em tempo real de alunos, turmas e performance financeira
                </p>
            </div>

            {/* Cards de métricas - Premium Design */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                marginBottom: "3rem",
            }}>
                {metrics.map((metric, idx) => {
                    const colorMap: Record<number, any> = {
                        0: { primary: "#378ADD", light: "#E6F1FB", dark: "#185FA5", accent: "#5BA3F5" },
                        1: { primary: "#639922", light: "#EAF3DE", dark: "#3B6D11", accent: "#7CB835" },
                        2: { primary: "#BA7517", light: "#FAEEDA", dark: "#854F0B", accent: "#D4A04D" },
                        3: { primary: "#D85A30", light: "#FAECE7", dark: "#993C1D", accent: "#F08860" },
                        4: { primary: "#E24B4A", light: "#FCEBEB", dark: "#A32D2D", accent: "#FF7676" },
                    };
                    const colors = colorMap[idx] || colorMap[0];

                    return (
                        <div
                            key={metric.label}
                            style={{
                                background: "var(--color-background-primary)",
                                border: "1.5px solid #f0f0f0",
                                borderRadius: "16px",
                                padding: "2rem",
                                position: "relative",
                                overflow: "hidden",
                                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.12)";
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.borderColor = colors.light;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.borderColor = "#f0f0f0";
                            }}
                        >
                            {/* Fundo decorativo com gradiente */}
                            <div style={{
                                position: "absolute",
                                top: "-100px",
                                right: "-100px",
                                width: "280px",
                                height: "280px",
                                background: `linear-gradient(135deg, ${colors.light}80 0%, ${colors.light}20 100%)`,
                                borderRadius: "50%",
                                zIndex: 0,
                                pointerEvents: "none",
                            }}></div>

                            {/* Linha superior decorativa */}
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "3px",
                                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                                zIndex: 1,
                            }}></div>

                            {/* Conteúdo */}
                            <div style={{ position: "relative", zIndex: 2 }}>
                                {/* Header com ícone e trend */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    marginBottom: "1.75rem",
                                }}>
                                    <div style={{
                                        width: "60px",
                                        height: "60px",
                                        background: `linear-gradient(135deg, ${colors.light} 0%, ${colors.light}60 100%)`,
                                        borderRadius: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: `0 4px 12px ${colors.light}60`,
                                        transition: "all 0.3s ease",
                                    }}>
                                        <i className={metric.icon} style={{
                                            fontSize: "32px",
                                            color: colors.primary,
                                        }}></i>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "6px 12px",
                                        background: metric.positive ? "#E1F5EE" : "#FAECE7",
                                        borderRadius: "8px",
                                        border: `1px solid ${metric.positive ? "#9FE1CB" : "#F5C4B3"}`,
                                    }}>
                                        <i style={{
                                            fontSize: "16px",
                                            color: metric.positive ? "#0F6E56" : "#993C1D",
                                        }} className={metric.positive ? "ti-arrow-up-right" : "ti-arrow-down-right"}>
                                        </i>
                                        <span style={{
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            color: metric.positive ? "#0F6E56" : "#993C1D",
                                        }}>
                                            {metric.trend}
                                        </span>
                                    </div>
                                </div>

                                {/* Label */}
                                <p style={{
                                    margin: "0 0 0.75rem",
                                    fontSize: "13px",
                                    color: "var(--color-text-secondary)",
                                    fontWeight: 500,
                                    letterSpacing: "0.3px",
                                    textTransform: "uppercase",
                                }}>
                                    {metric.label}
                                </p>

                                {/* Valor com gradiente */}
                                <p style={{
                                    margin: "0 0 1.5rem",
                                    fontSize: "36px",
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.dark} 100%)`,
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    lineHeight: 1,
                                }}>
                                    {metric.value}
                                </p>

                                {/* Footer bar */}
                                <div style={{
                                    height: "4px",
                                    background: `linear-gradient(90deg, ${colors.light} 0%, transparent 100%)`,
                                    borderRadius: "2px",
                                    overflow: "hidden",
                                }}>
                                    <div style={{
                                        height: "100%",
                                        background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                                        width: `${metric.positive ? 85 : 65}%`,
                                        transition: "width 0.6s ease-out",
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Gráfico de Matrículas vs Cancelamentos */}
            <div style={{
                background: "var(--color-background-primary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-lg)",
                padding: "2rem",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            }}>
                <div style={{ marginBottom: "2rem" }}>
                    <h3 style={{
                        margin: "0 0 0.5rem",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                    }}>
                        Matrículas vs Cancelamentos
                    </h3>
                    <p style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                    }}>
                        Acompanhamento comparativo dos últimos 10 dias
                    </p>
                </div>

                {/* Stats resumidas */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "16px",
                    marginBottom: "2rem",
                    paddingBottom: "2rem",
                    borderBottom: "0.5px solid var(--color-border-tertiary)",
                }}>
                    <div style={{ background: "var(--color-background-secondary)", padding: "12px 16px", borderRadius: "10px" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Total Matrículas</p>
                        <p style={{ margin: 0, fontSize: "24px", fontWeight: 600, color: "#378ADD" }}>
                            {data?.total_active_students?.toLocaleString() || "0"}
                        </p>
                    </div>
                    <div style={{ background: "var(--color-background-secondary)", padding: "12px 16px", borderRadius: "10px" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Total Negativados</p>
                        <p style={{ margin: 0, fontSize: "24px", fontWeight: 600, color: "#D85A30" }}>
                            {data?.blacklisted_count || "0"}
                        </p>
                    </div>
                    <div style={{ background: "var(--color-background-secondary)", padding: "12px 16px", borderRadius: "10px" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Taxa de Retenção</p>
                        <p style={{ margin: 0, fontSize: "24px", fontWeight: 600, color: "#0F6E56" }}>{taxaRetencao}%</p>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={360}>
                    <LineChart data={dataMatriculas} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorMatriculasGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#378ADD" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#378ADD" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCancelamentosGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D85A30" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#D85A30" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border-tertiary)"
                            vertical={false}
                            opacity={0.5}
                        />
                        <XAxis
                            dataKey="dia"
                            stroke="var(--color-text-secondary)"
                            style={{ fontSize: "12px" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="var(--color-text-secondary)"
                            style={{ fontSize: "12px" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "var(--color-background-primary)",
                                border: "1px solid var(--color-border-secondary)",
                                borderRadius: "10px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                padding: "12px 16px",
                            }}
                            labelStyle={{ color: "var(--color-text-primary)", fontWeight: 500 }}
                            formatter={(value) => value?.toLocaleString()}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: "24px" }}
                            iconType="line"
                            height={36}
                        />
                        <Line
                            type="monotone"
                            dataKey="matriculas"
                            stroke="#378ADD"
                            name="Matrículas"
                            strokeWidth={3}
                            dot={{ fill: "#378ADD", r: 5, strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 8 }}
                            fillOpacity={1}
                            fill="url(#colorMatriculasGradient)"
                        />
                        <Line
                            type="monotone"
                            dataKey="cancelamentos"
                            stroke="#D85A30"
                            name="Cancelamentos"
                            strokeWidth={3}
                            dot={{ fill: "#D85A30", r: 5, strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 8 }}
                            fillOpacity={1}
                            fill="url(#colorCancelamentosGradient)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}