import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    // { path: '/cursos', label: 'Cursos', icon: '📖' },
    { path: '/turmas', label: 'Turmas', icon: '🎓' },
    { path: '/alunos', label: 'Alunos', icon: '🧑‍🎓' },
    { path: '/professores', label: 'Professores', icon: '👨‍🏫' },
    { path: '/contratos', label: 'Contratos', icon: '📝' },
    { path: '/pagamentos', label: 'Pagamentos', icon: '💳' },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    return (
        <div className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
            <div className="sidebar__brand">
                <div className="sidebar__brand-logo">R</div>
                <span className="sidebar__brand-name">RED</span>
            </div>
            <nav className="sidebar__nav">
                {NAV_ITEMS.map((item) => (
                    <NavLink key={item.path} to={item.path} className="sidebar__link" end>
                        <span className="sidebar__icon">{item.icon}</span>
                        <span className="sidebar__link-label">{item.label}</span>
                    </NavLink>
                ))}
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
