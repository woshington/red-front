import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const { user } = useAuth();

    return (
        <div className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
            <div className="sidebar__brand">
                <div className="sidebar__brand-logo">R</div>
                <span className="sidebar__brand-name">RED</span>
            </div>
            <nav className="sidebar__nav">
                {['ADMIN', 'FINANCIAL'].includes(user?.role || '') && (
                    <NavLink to="/" className="sidebar__link" end>
                        <span className="sidebar__icon">📊</span>
                        <span className="sidebar__link-label">Dashboard</span>
                    </NavLink>
                )}
                <NavLink to="/turmas" className="sidebar__link" end>
                    <span className="sidebar__icon">🎓</span>
                    <span className="sidebar__link-label">Turmas</span>
                </NavLink>
                <NavLink to="/alunos" className="sidebar__link" end>
                    <span className="sidebar__icon">🧑‍🎓</span>
                    <span className="sidebar__link-label">Alunos</span>
                </NavLink>
                <NavLink to="/professores" className="sidebar__link" end>
                    <span className="sidebar__icon">👨‍🏫</span>
                    <span className="sidebar__link-label">Professores</span>
                </NavLink>

                {['ADMIN', 'FINANCIAL'].includes(user?.role || '') && (
                    <>
                        <NavLink to="/contratos" className="sidebar__link" end>
                            <span className="sidebar__icon">📝</span>
                            <span className="sidebar__link-label">Contratos</span>
                        </NavLink>
                        <NavLink to="/pagamentos" className="sidebar__link" end>
                            <span className="sidebar__icon">💳</span>
                            <span className="sidebar__link-label">Pagamentos</span>
                        </NavLink>
                    </>
                )}

                {user?.role === 'ADMIN' && (
                    <NavLink to="/usuarios" className="sidebar__link" end>
                        <span className="sidebar__icon">👥</span>
                        <span className="sidebar__link-label">Usuários</span>
                    </NavLink>
                )}
            </nav>
            <div className="sidebar__footer">
                <button className="sidebar__toggle" onClick={onToggle}>
                    <span className="sidebar__icon">{collapsed ? '▶' : '◀'}</span>
                    {!collapsed && <span className="sidebar__link-label">Recolher</span>}
                </button>
            </div>
        </div>
    );
}
