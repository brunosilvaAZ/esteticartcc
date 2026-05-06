import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RotaProtegida from '../components/ui/RotaProtegida'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Clientes from '../pages/Clientes'
import ClienteForm from '../pages/ClienteForm'
import Veiculos from '../pages/Veiculos'
import VeiculoForm from '../pages/VeiculoForm'
import Servicos from '../pages/Servicos'
import ServicoForm from '../pages/ServicoForm'
import Agendamentos from '../pages/Agendamentos'
import AgendamentoForm from '../pages/AgendamentoForm'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />

        <Route path="/clientes" element={<RotaProtegida><Clientes /></RotaProtegida>} />
        <Route path="/clientes/novo" element={<RotaProtegida><ClienteForm /></RotaProtegida>} />
        <Route path="/clientes/editar/:id" element={<RotaProtegida><ClienteForm /></RotaProtegida>} />

        <Route path="/clientes/:clienteId/veiculos" element={<RotaProtegida><Veiculos /></RotaProtegida>} />
        <Route path="/clientes/:clienteId/veiculos/novo" element={<RotaProtegida><VeiculoForm /></RotaProtegida>} />
        <Route path="/clientes/:clienteId/veiculos/editar/:id" element={<RotaProtegida><VeiculoForm /></RotaProtegida>} />

        <Route path="/servicos" element={<RotaProtegida><Servicos /></RotaProtegida>} />
        <Route path="/servicos/novo" element={<RotaProtegida><ServicoForm /></RotaProtegida>} />
        <Route path="/servicos/editar/:id" element={<RotaProtegida><ServicoForm /></RotaProtegida>} />

        <Route path="/agendamentos" element={<RotaProtegida><Agendamentos /></RotaProtegida>} />
        <Route path="/agendamentos/novo" element={<RotaProtegida><AgendamentoForm /></RotaProtegida>} />
        <Route path="/agendamentos/editar/:id" element={<RotaProtegida><AgendamentoForm /></RotaProtegida>} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}