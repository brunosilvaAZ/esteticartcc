import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import Layout from '../components/ui/Layout'

export default function Veiculos() {
  const { clienteId } = useParams()
  const [veiculos, setVeiculos] = useState([])
  const [cliente, setCliente] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    buscarCliente()
    buscarVeiculos()
  }, [clienteId])

  async function buscarCliente() {
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', clienteId)
      .single()
    setCliente(data)
  }

  async function buscarVeiculos() {
    setCarregando(true)
    const { data } = await supabase
      .from('veiculos')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('criado_em', { ascending: false })
    setVeiculos(data || [])
    setCarregando(false)
  }

  async function excluirVeiculo(id) {
    if (!window.confirm('Deseja excluir este veículo?')) return
    await supabase.from('veiculos').delete().eq('id', id)
    buscarVeiculos()
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Veículos</h2>
          <p className="text-gray-400 text-sm">
            Cliente: <span className="text-orange-400">{cliente?.nome}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/clientes"
            className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg transition"
          >
            ← Voltar
          </Link>
          <Link
            to={`/clientes/${clienteId}/veiculos/novo`}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            + Novo veículo
          </Link>
        </div>
      </div>

      {carregando ? (
        <p className="text-gray-400">Carregando...</p>
      ) : veiculos.length === 0 ? (
        <p className="text-gray-500">Nenhum veículo cadastrado para este cliente.</p>
      ) : (
        <div className="space-y-3">
          {veiculos.map((veiculo) => (
            <div key={veiculo.id} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">
                  {veiculo.marca} {veiculo.modelo} — {veiculo.ano}
                </p>
                <p className="text-gray-400 text-sm">
                  Placa: {veiculo.placa} • Cor: {veiculo.cor}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/clientes/${clienteId}/veiculos/editar/${veiculo.id}`}
                  className="text-sm text-orange-400 hover:text-orange-300 transition"
                >
                  Editar
                </Link>
                <button
                  onClick={() => excluirVeiculo(veiculo.id)}
                  className="text-sm text-red-400 hover:text-red-300 transition"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}