import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import Layout from '../components/ui/Layout'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { buscarClientes() }, [])

  async function buscarClientes() {
    setCarregando(true)
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .order('nome', { ascending: true })
    setClientes(data || [])
    setCarregando(false)
  }

  async function excluirCliente(id) {
    if (!window.confirm('Deseja excluir este cliente?')) return
    await supabase.from('clientes').delete().eq('id', id)
    buscarClientes()
  }

  const filtrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone?.includes(busca)
  )

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Clientes</h2>
          <p className="text-gray-400 text-sm">Gerencie os clientes cadastrados</p>
        </div>
        <Link
          to="/clientes/novo"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          + Novo cliente
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por nome ou telefone..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 mb-6 focus:outline-none focus:border-orange-500"
      />

      {carregando ? (
        <p className="text-gray-400">Carregando...</p>
      ) : filtrados.length === 0 ? (
        <p className="text-gray-500">Nenhum cliente encontrado.</p>
      ) : (
        <div className="space-y-3">
          {filtrados.map((cliente) => (
            <div key={cliente.id} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{cliente.nome}</p>
                <p className="text-gray-400 text-sm">{cliente.telefone} • {cliente.email}</p>
              </div>
              <div className="flex gap-3">
                <Link to={`/clientes/editar/${cliente.id}`} className="text-sm text-orange-400 hover:text-orange-300 transition">
                  Editar
                </Link>
                <button onClick={() => excluirCliente(cliente.id)} className="text-sm text-red-400 hover:text-red-300 transition">
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