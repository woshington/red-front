import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { TurmasPage } from "./pages/turmas/TurmasPage";
import { ProfessoresPage } from "./pages/professores/ProfessoresPage";
import { PagamentosPage } from "./pages/pagamentos/PagamentosPage";
import { AlunosPage } from "./pages/alunos/AlunosPage";
import { ContratosPage } from "./pages/contratos/ContratosPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          {/* <Route path="cursos" element={<CursosPage />} /> */}
          <Route path="turmas" element={<TurmasPage />} />
          <Route path="professores" element={<ProfessoresPage />} />
          <Route path="alunos" element={<AlunosPage />} />
          <Route path="contratos" element={<ContratosPage />} />
          <Route path="pagamentos" element={<PagamentosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}