import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { TurmasPage } from "./pages/turmas/TurmasPage";
import { ProfessoresPage } from "./pages/professores/ProfessoresPage";
import { PagamentosPage } from "./pages/pagamentos/PagamentosPage";
import { AlunosPage } from "./pages/alunos/AlunosPage";
import { ContratosPage } from "./pages/contratos/ContratosPage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterAdminPage } from "./pages/auth/RegisterAdminPage";
import { UsuariosPage } from "./pages/usuarios/UsuariosPage";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterAdminPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="turmas" element={<TurmasPage />} />
              <Route path="professores" element={<ProfessoresPage />} />
              <Route path="alunos" element={<AlunosPage />} />
              <Route path="contratos" element={<ContratosPage />} />
              <Route path="pagamentos" element={<PagamentosPage />} />
              <Route path="usuarios" element={<UsuariosPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}