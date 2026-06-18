import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/navigation/Sidebar";
import "./AppLayout.css";
import { Header } from "./Header";

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