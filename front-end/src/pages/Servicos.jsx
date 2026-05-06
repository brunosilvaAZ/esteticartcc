import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import Layout from '../components/ui/Layout'

export default function Servicos() {
  const [servicos, setServicos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { buscarServicos() }, [])

  async function buscarServicos() {
    setCarregando(true)
    const { data } = await supabase
      .from('servicos')
      .select('*')
      .order('nome', { ascending: true })
    setServicos(data || [])
    setCarregando(false)
  }

  async function toggleAtivo(servico) {
    await supabase
      .from('servicos')
      .update({ ativo: !servico.ativo })
      .eq('id', servico.id)
    buscarServicos()
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Serviços</h2>
          <p className="text-gray-400 text-sm">Gerencie os serviços oferecidos</p>
        </div>
        <Link
          to="/servicos/novo"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          + Novo serviço
        </Link>
      </div>

      {carregando ? (
        <p className="text-gray-400">Carregando...</p>
      ) : servicos.length === 0 ? (
        <p className="text-gray-500">Nenhum serviço cadastrado.</p>
      ) : (
        <div className="space-y-3">
          {servicos.map((servico) => (
            <div key={servico.id} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-white font-semibold">{servico.nome}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    servico.ativo
                      ? 'bg-green-900 text-green-400'
                      : 'bg-gray-800 text-gray-500'
                  }`}>
                    {servico.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  R$ {Number(servico.preco_base).toFixed(2)} • {servico.duracao_estimada} min
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => toggleAtivo(servico)}
                  className={`text-sm transition ${
                    servico.ativo
                      ? 'text-yellow-400 hover:text-yellow-300'
                      : 'text-green-400 hover:text-green-300'
                  }`}
                >
                  {servico.ativo ? 'Desativar' : 'Ativar'}
                </button>
                <Link
                  to={`/servicos/editar/${servico.id}`}
                  className="text-sm text-orange-400 hover:text-orange-300 transition"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}