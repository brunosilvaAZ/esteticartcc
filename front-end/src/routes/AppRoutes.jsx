import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RotaProtegida from '../components/ui/RotaProtegida'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Clientes from '../pages/Clientes'
import ClienteForm from '../pages/ClienteForm'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
        <Route path="/clientes" element={<RotaProtegida><Clientes /></RotaProtegida>} />
        <Route path="/clientes/novo" element={<RotaProtegida><ClienteForm /></RotaProtegida>} />
        <Route path="/clientes/editar/:id" element={<RotaProtegida><ClienteForm /></RotaProtegida>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}