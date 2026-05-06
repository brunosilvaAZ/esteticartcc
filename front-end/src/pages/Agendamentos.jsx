import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import Layout from '../components/ui/Layout'

const statusCores = {
  'Pendente':     'bg-yellow-900 text-yellow-400',
  'Confirmado':   'bg-blue-900 text-blue-400',
  'Em andamento': 'bg-orange-900 text-orange-400',
  'Finalizado':   'bg-green-900 text-green-400',
  'Cancelado':    'bg-red-900 text-red-400',
}

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { buscarAgendamentos() }, [])

  async function buscarAgendamentos() {
    setCarregando(true)
    const { data } = await supabase
      .from('agendamentos')
      .select(`
        *,
        clientes(nome),
        veiculos(marca, modelo, placa),
        servicos(nome)
      `)
      .order('data_hora', { ascending: true })
    setAgendamentos(data || [])
    setCarregando(false)
  }

  async function cancelarAgendamento(agendamento) {
    const agora = new Date()
    const dataAgendamento = new Date(agendamento.data_hora)
    const diferencaHoras = (dataAgendamento - agora) / (1000 * 60 * 60)

    if (diferencaHoras < 2) {
      alert('Cancelamento só é permitido com no mínimo 2 horas de antecedência.')
      return
    }

    if (!window.confirm('Deseja cancelar este agendamento?')) return

    await supabase
      .from('agendamentos')
      .update({ status: 'Cancelado' })
      .eq('id', agendamento.id)
    buscarAgendamentos()
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Agendamentos</h2>
          <p className="text-gray-400 text-sm">Gerencie os agendamentos</p>
        </div>
        <Link
          to="/agendamentos/novo"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          + Novo agendamento
        </Link>
      </div>

      {carregando ? (
        <p className="text-gray-400">Carregando...</p>
      ) : agendamentos.length === 0 ? (
        <p className="text-gray-500">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="space-y-3">
          {agendamentos.map((ag) => (
            <div key={ag.id} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-white font-semibold">{ag.clientes?.nome}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCores[ag.status]}`}>
                    {ag.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {ag.veiculos?.marca} {ag.veiculos?.modelo} • {ag.servicos?.nome}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {new Date(ag.data_hora).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex gap-3">
                {ag.status !== 'Cancelado' && ag.status !== 'Finalizado' && (
                  <>
                    <Link
                      to={`/agendamentos/editar/${ag.id}`}
                      className="text-sm text-orange-400 hover:text-orange-300 transition"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => cancelarAgendamento(ag)}
                      className="text-sm text-red-400 hover:text-red-300 transition"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}