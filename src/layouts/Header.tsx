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