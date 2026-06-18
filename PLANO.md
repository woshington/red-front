# Plano de Implementação — Frontend de Gestão Educacional

> Stack: **React 19 + TypeScript + Vite** (já configurado). Sem bibliotecas de UI externas — aproveitamos o design system em `src/index.css`.

---

## Visão Geral da Estrutura Final

```
src/
├── types/
│   └── index.ts                  # Tipos TypeScript de todas as entidades
├── services/
│   ├── api.ts                    # Cliente HTTP base (fetch wrapper)
│   ├── cursos.ts
│   ├── alunos.ts
│   ├── turmas.ts
│   ├── professores.ts
│   └── pagamentos.ts
├── hooks/
│   ├── useFetch.ts               # Hook genérico de dados assíncronos
│   ├── useCursos.ts
│   ├── useAlunos.ts
│   ├── useTurmas.ts
│   ├── useProfessores.ts
│   └── usePagamentos.ts
├── layouts/
│   ├── AppLayout.tsx             # Shell: sidebar + header + <Outlet>
│   └── AppLayout.css
├── components/
│   ├── navigation/
│   │   ├── Sidebar.tsx
│   │   └── Sidebar.css
│   └── layout/
│       ├── Header.tsx
│       └── Header.css
├── pages/
│   ├── Dashboard.tsx
│   ├── cursos/CursosPage.tsx
│   ├── alunos/AlunosPage.tsx
│   ├── turmas/TurmasPage.tsx
│   ├── professores/ProfessoresPage.tsx
│   └── pagamentos/PagamentosPage.tsx
├── App.tsx                       # Router raiz
├── index.css                     # Design system (já existe)
└── main.tsx
```

---

## Etapa 0 — Pré-requisito: instalar dependências

```bash
npm install react-router-dom
npm install -D @types/react-router-dom
```

Também crie um arquivo `.env` na raiz do projeto:

```
# .env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Etapa 1 — Layout Moderno (Shell da Aplicação)

### `src/layouts/AppLayout.css`

```css
/* ─── AppLayout ─────────────────────────────── */
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
}

.app-shell__sidebar {
  width: 240px;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  transition: width var(--transition-normal);
}

.app-shell__sidebar--collapsed {
  width: 64px;
}

.app-shell__body {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left var(--transition-normal);
}

.app-shell__body--sidebar-collapsed {
  margin-left: 64px;
}

.app-shell__header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-height);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.app-shell__main {
  flex: 1;
  padding: var(--space-8);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .app-shell__sidebar {
    transform: translateX(-100%);
    width: 240px;
  }

  .app-shell__sidebar--mobile-open {
    transform: translateX(0);
  }

  .app-shell__body {
    margin-left: 0;
  }

  .app-shell__main {
    padding: var(--space-4);
  }
}
```

### `src/layouts/AppLayout.tsx`

```tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/navigation/Sidebar";
import { Header } from "../components/layout/Header";
import "./AppLayout.css";

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside
        className={[
          "app-shell__sidebar",
          collapsed ? "app-shell__sidebar--collapsed" : "",
          mobileOpen ? "app-shell__sidebar--mobile-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />
      </aside>

      <div
        className={[
          "app-shell__body",
          collapsed ? "app-shell__body--sidebar-collapsed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <header className="app-shell__header">
          <Header onMenuClick={() => setMobileOpen((p) => !p)} />
        </header>

        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

---

## Etapa 2 — Menu Compartilhado (Sidebar)

### `src/components/navigation/Sidebar.css`

```css
/* ─── Sidebar ─────────────────────────────── */
.sidebar {
  height: 100%;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar__brand {
  height: var(--header-height);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-4);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.sidebar__brand-logo {
  width: 32px;
  height: 32px;
  background: var(--color-accent);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: #fff;
  flex-shrink: 0;
}

.sidebar__brand-name {
  font-weight: var(--weight-bold);
  font-size: var(--text-base);
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  opacity: 1;
  transition: opacity var(--transition-fast);
}

.sidebar--collapsed .sidebar__brand-name {
  opacity: 0;
  width: 0;
}

.sidebar__nav {
  flex: 1;
  padding: var(--space-4) var(--space-2);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar__nav-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: var(--space-3) var(--space-3) var(--space-1);
  white-space: nowrap;
  overflow: hidden;
  transition: opacity var(--transition-fast);
}

.sidebar--collapsed .sidebar__nav-label {
  opacity: 0;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  white-space: nowrap;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.sidebar__link:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
}

.sidebar__link--active {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.sidebar__link--active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 25%;
  height: 50%;
  width: 3px;
  background: var(--color-accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.sidebar__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar__link-label {
  opacity: 1;
  transition: opacity var(--transition-fast);
}

.sidebar--collapsed .sidebar__link-label {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar__footer {
  padding: var(--space-3) var(--space-2);
  border-top: 1px solid var(--color-border);
}

.sidebar__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

.sidebar__toggle:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
}
```

### `src/components/navigation/Sidebar.tsx`

```tsx
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "⬛" },
  { section: "Gestão" },
  { to: "/cursos", label: "Cursos", icon: "📚" },
  { to: "/turmas", label: "Turmas", icon: "🏫" },
  { to: "/professores", label: "Professores", icon: "👨‍🏫" },
  { to: "/alunos", label: "Alunos", icon: "🎓" },
  { section: "Financeiro" },
  { to: "/pagamentos", label: "Pagamentos", icon: "💳" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <nav className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__brand">
        <div className="sidebar__brand-logo">R</div>
        <span className="sidebar__brand-name">RedEdu</span>
      </div>

      <div className="sidebar__nav">
        {NAV_ITEMS.map((item, i) => {
          if ("section" in item) {
            return (
              <span key={i} className="sidebar__nav-label">
                {item.section}
              </span>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
              }
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__link-label">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="sidebar__footer">
        <button className="sidebar__toggle" onClick={onToggle}>
          <span className="sidebar__icon">{collapsed ? "→" : "←"}</span>
          <span className="sidebar__link-label">Recolher</span>
        </button>
      </div>
    </nav>
  );
}
```

---

## Etapa 3 — Header da Aplicação

### `src/components/layout/Header.css`

```css
/* ─── Header ─────────────────────────────── */
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  gap: var(--space-4);
}

.header__left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header__menu-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-lg);
  line-height: 1;
}

.header__menu-btn:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
}

.header__breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.header__breadcrumb-current {
  color: var(--color-text);
  font-weight: var(--weight-medium);
}

.header__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.header__search {
  position: relative;
}

.header__search-input {
  width: 220px;
  padding-left: var(--space-8);
  background: var(--color-surface-2);
  border-color: transparent;
  font-size: var(--text-sm);
}

.header__search-input:focus {
  width: 280px;
  border-color: var(--color-accent);
}

.header__search-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
  font-size: var(--text-sm);
}

.header__avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: #fff;
  cursor: pointer;
  transition: box-shadow var(--transition-fast);
  flex-shrink: 0;
}

.header__avatar:hover {
  box-shadow: var(--shadow-glow);
}

@media (max-width: 768px) {
  .header__menu-btn {
    display: flex;
  }

  .header__search {
    display: none;
  }
}
```

### `src/components/layout/Header.tsx`

```tsx
import { useLocation } from "react-router-dom";
import "./Header.css";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/cursos": "Cursos",
  "/turmas": "Turmas",
  "/professores": "Professores",
  "/alunos": "Alunos",
  "/pagamentos": "Pagamentos",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation();
  const pageLabel = ROUTE_LABELS[pathname] ?? "Página";

  return (
    <div className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuClick} aria-label="Abrir menu">
          ☰
        </button>
        <nav className="header__breadcrumb">
          <span>RedEdu</span>
          <span>/</span>
          <span className="header__breadcrumb-current">{pageLabel}</span>
        </nav>
      </div>

      <div className="header__right">
        <div className="header__search">
          <span className="header__search-icon">🔍</span>
          <input
            className="header__search-input"
            type="search"
            placeholder="Buscar..."
            aria-label="Busca global"
          />
        </div>
        <div className="header__avatar" title="Perfil">U</div>
      </div>
    </div>
  );
}
```

---

## Etapa 4 — Camada de Acesso às APIs

### `src/types/index.ts`

```ts
/* ── Entidades ─────────────────────────────────── */

export interface Curso {
  id: number;
  nome: string;
  descricao: string;
  duracao_horas: number;
  ativo: boolean;
  created_at: string;
}

export interface Professor {
  id: number;
  nome: string;
  email: string;
  especialidade: string;
  ativo: boolean;
}

export interface Turma {
  id: number;
  nome: string;
  curso_id: number;
  curso?: Curso;
  professor_id: number;
  professor?: Professor;
  data_inicio: string;
  data_fim: string;
  vagas: number;
  vagas_ocupadas: number;
}

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  ativo: boolean;
  created_at: string;
}

export type StatusPagamento = "pendente" | "pago" | "cancelado" | "atrasado";

export interface Pagamento {
  id: number;
  aluno_id: number;
  aluno?: Aluno;
  turma_id: number;
  turma?: Turma;
  valor: number;
  vencimento: string;
  pago_em: string | null;
  status: StatusPagamento;
}

/* ── Respostas paginadas ──────────────────────── */

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}

/* ── Parâmetros de listagem ───────────────────── */

export interface ListParams {
  page?: number;
  per_page?: number;
  search?: string;
  [key: string]: unknown;
}
```

### `src/services/api.ts`

```ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  method: HttpMethod,
  path: string,
  payload?: unknown
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body, `HTTP ${res.status} — ${path}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};

export { ApiError };

/* Utilitário: monta query string a partir de um objeto */
export function toQueryString(params: Record<string, unknown>): string {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (!filtered.length) return "";
  return "?" + new URLSearchParams(filtered.map(([k, v]) => [k, String(v)])).toString();
}
```

### `src/services/cursos.ts`

```ts
import { api, toQueryString } from "./api";
import type { Curso, Paginated, ListParams } from "../types";

export const cursosService = {
  list: (params: ListParams = {}) =>
    api.get<Paginated<Curso>>(`/cursos${toQueryString(params)}`),

  get: (id: number) =>
    api.get<Curso>(`/cursos/${id}`),

  create: (data: Omit<Curso, "id" | "created_at">) =>
    api.post<Curso>("/cursos", data),

  update: (id: number, data: Partial<Omit<Curso, "id" | "created_at">>) =>
    api.put<Curso>(`/cursos/${id}`, data),

  remove: (id: number) =>
    api.delete<void>(`/cursos/${id}`),
};
```

### `src/services/alunos.ts`

```ts
import { api, toQueryString } from "./api";
import type { Aluno, Paginated, ListParams } from "../types";

export const alunosService = {
  list: (params: ListParams = {}) =>
    api.get<Paginated<Aluno>>(`/alunos${toQueryString(params)}`),

  get: (id: number) =>
    api.get<Aluno>(`/alunos/${id}`),

  create: (data: Omit<Aluno, "id" | "created_at">) =>
    api.post<Aluno>("/alunos", data),

  update: (id: number, data: Partial<Omit<Aluno, "id" | "created_at">>) =>
    api.put<Aluno>(`/alunos/${id}`, data),

  remove: (id: number) =>
    api.delete<void>(`/alunos/${id}`),
};
```

### `src/services/turmas.ts`

```ts
import { api, toQueryString } from "./api";
import type { Turma, Paginated, ListParams } from "../types";

export const turmasService = {
  list: (params: ListParams = {}) =>
    api.get<Paginated<Turma>>(`/turmas${toQueryString(params)}`),

  get: (id: number) =>
    api.get<Turma>(`/turmas/${id}`),

  create: (data: Omit<Turma, "id" | "curso" | "professor">) =>
    api.post<Turma>("/turmas", data),

  update: (id: number, data: Partial<Omit<Turma, "id" | "curso" | "professor">>) =>
    api.put<Turma>(`/turmas/${id}`, data),

  remove: (id: number) =>
    api.delete<void>(`/turmas/${id}`),
};
```

### `src/services/professores.ts`

```ts
import { api, toQueryString } from "./api";
import type { Professor, Paginated, ListParams } from "../types";

export const professoresService = {
  list: (params: ListParams = {}) =>
    api.get<Paginated<Professor>>(`/professores${toQueryString(params)}`),

  get: (id: number) =>
    api.get<Professor>(`/professores/${id}`),

  create: (data: Omit<Professor, "id">) =>
    api.post<Professor>("/professores", data),

  update: (id: number, data: Partial<Omit<Professor, "id">>) =>
    api.put<Professor>(`/professores/${id}`, data),

  remove: (id: number) =>
    api.delete<void>(`/professores/${id}`),
};
```

### `src/services/pagamentos.ts`

```ts
import { api, toQueryString } from "./api";
import type { Pagamento, Paginated, ListParams } from "../types";

export const pagamentosService = {
  list: (params: ListParams = {}) =>
    api.get<Paginated<Pagamento>>(`/pagamentos${toQueryString(params)}`),

  get: (id: number) =>
    api.get<Pagamento>(`/pagamentos/${id}`),

  create: (data: Omit<Pagamento, "id" | "aluno" | "turma">) =>
    api.post<Pagamento>("/pagamentos", data),

  confirmar: (id: number) =>
    api.patch<Pagamento>(`/pagamentos/${id}/confirmar`, {}),

  cancelar: (id: number) =>
    api.patch<Pagamento>(`/pagamentos/${id}/cancelar`, {}),
};
```

### `src/hooks/useFetch.ts`

```ts
import { useState, useEffect, useCallback } from "react";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setState({ data: null, loading: false, error: message });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);

  return { ...state, reload: load };
}
```

### `src/hooks/useCursos.ts`

```ts
import { useFetch } from "./useFetch";
import { cursosService } from "../services/cursos";
import type { ListParams } from "../types";

export function useCursos(params: ListParams = {}) {
  return useFetch(
    () => cursosService.list(params),
    [JSON.stringify(params)]
  );
}
```

> Repita o mesmo padrão para `useAlunos.ts`, `useTurmas.ts`, `useProfessores.ts` e `usePagamentos.ts` — apenas troque o service importado.

---

## Etapa 5 — Router Principal

### `src/App.tsx` (substituir o conteúdo atual)

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { CursosPage } from "./pages/cursos/CursosPage";
import { TurmasPage } from "./pages/turmas/TurmasPage";
import { ProfessoresPage } from "./pages/professores/ProfessoresPage";
import { AlunosPage } from "./pages/alunos/AlunosPage";
import { PagamentosPage } from "./pages/pagamentos/PagamentosPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="cursos" element={<CursosPage />} />
          <Route path="turmas" element={<TurmasPage />} />
          <Route path="professores" element={<ProfessoresPage />} />
          <Route path="alunos" element={<AlunosPage />} />
          <Route path="pagamentos" element={<PagamentosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Etapa 6 — Páginas

Cada página segue o mesmo padrão. Abaixo o exemplo completo de `CursosPage`; as demais seguem a mesma estrutura.

### `src/pages/Dashboard.tsx`

```tsx
export function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p className="text-muted" style={{ marginTop: "var(--space-2)" }}>
        Bem-vindo ao sistema de gestão educacional.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-4)",
          marginTop: "var(--space-8)",
        }}
      >
        {[
          { label: "Cursos ativos", value: "—", icon: "📚" },
          { label: "Turmas abertas", value: "—", icon: "🏫" },
          { label: "Alunos", value: "—", icon: "🎓" },
          { label: "Pagamentos pendentes", value: "—", icon: "💳" },
        ].map((card) => (
          <div key={card.label} className="card" style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
            <span style={{ fontSize: "2rem" }}>{card.icon}</span>
            <div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{card.label}</p>
              <strong style={{ fontSize: "var(--text-2xl)" }}>{card.value}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### `src/pages/cursos/CursosPage.tsx`

```tsx
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
```

> **Padrão para as demais páginas:** crie `AlunosPage.tsx`, `TurmasPage.tsx`, `ProfessoresPage.tsx` e `PagamentosPage.tsx` no mesmo formato — importe o hook correspondente, renderize a tabela com as colunas específicas de cada entidade.

---

## Ordem de execução recomendada

| # | O que fazer | Resultado esperado |
|---|---|---|
| 0 | `npm install react-router-dom` + criar `.env` | Dependência disponível |
| 1 | Criar `AppLayout.css` e `AppLayout.tsx` | Shell do app sem erros |
| 2 | Criar `Sidebar.css` e `Sidebar.tsx` | Menu lateral funcional |
| 3 | Criar `Header.css` e `Header.tsx` | Cabeçalho com breadcrumb |
| 4 | Criar `src/types/index.ts` | Tipos TypeScript definidos |
| 5 | Criar `src/services/api.ts` | Cliente HTTP base |
| 6 | Criar os cinco services | Acesso às rotas da API |
| 7 | Criar `useFetch.ts` + hooks de entidade | Dados reativos nas páginas |
| 8 | Substituir `App.tsx` com o router | Rotas funcionando |
| 9 | Criar as páginas | UI completa |

---

## Variáveis de ambiente necessárias

```bash
# .env (raiz do projeto)
VITE_API_BASE_URL=http://localhost:3000/api
```

Troque a URL pela base real da sua API antes de rodar.
