import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import Layout from '../components/ui/Layout'

export default function AgendamentoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [clientes, setClientes] = useState([])
  const [veiculos, setVeiculos] = useState([])
  const [servicos, setServicos] = useState([])
  const [form, setForm] = useState({
    cliente_id: '', veiculo_id: '', servico_id: '', data_hora: '', observacoes: ''
  })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    buscarClientes()
    buscarServicos()
    if (editando) carregarAgendamento()
  }, [id])

  useEffect(() => {
    if (form.cliente_id) buscarVeiculos(form.cliente_id)
  }, [form.cliente_id])

  async function buscarClientes() {
    const { data } = await supabase.from('clientes').select('id, nome').order('nome')
    setClientes(data || [])
  }

  async function buscarVeiculos(clienteId) {
    const { data } = await supabase
      .from('veiculos').select('id, marca, modelo, placa').eq('cliente_id', clienteId)
    setVeiculos(data || [])
  }

  async function buscarServicos() {
    const { data } = await supabase
      .from('servicos').select('id, nome').eq('ativo', true).order('nome')
    setServicos(data || [])
  }

  async function carregarAgendamento() {
    const { data } = await supabase.from('agendamentos').select('*').eq('id', id).single()
    if (data) {
      setForm({
        cliente_id: data.cliente_id,
        veiculo_id: data.veiculo_id,
        servico_id: data.servico_id,
        data_hora: data.data_hora.slice(0, 16),
        observacoes: data.observacoes || ''
      })
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      const dataHora = new Date(form.data_hora)

      // Verificar conflito de horário
      const { data: conflito } = await supabase
        .from('agendamentos')
        .select('id')
        .eq('data_hora', dataHora.toISOString())
        .neq('status', 'Cancelado')
        .neq('id', id || '')
        .single()

      if (conflito) {
        setErro('Já existe um agendamento nesse horário.')
        setSalvando(false)
        return
      }

      // Verificar mesmo cliente no mesmo horário
      const { data: mesmoCliente } = await supabase
        .from('agendamentos')
        .select('id')
        .eq('cliente_id', form.cliente_id)
        .eq('data_hora', dataHora.toISOString())
        .neq('status', 'Cancelado')
        .neq('id', id || '')
        .single()

      if (mesmoCliente) {
        setErro('Este cliente já tem um agendamento nesse horário.')
        setSalvando(false)
        return
      }

      const payload = { ...form, data_hora: dataHora.toISOString() }

      if (editando) {
        await supabase.from('agendamentos').update(payload).eq('id', id)
      } else {
        await supabase.from('agendamentos').insert(payload)
      }

      navigate('/agendamentos')
    } catch {
      setErro('Erro ao salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold text-white mb-1">
          {editando ? 'Editar Agendamento' : 'Novo Agendamento'}
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          {editando ? 'Atualize os dados do agendamento.' : 'Preencha os dados para agendar.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Cliente</label>
            <select name="cliente_id" required value={form.cliente_id} onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition">
              <option value="">Selecione um cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Veículo</label>
            <select name="veiculo_id" required value={form.veiculo_id} onChange={handleChange}
              disabled={!form.cliente_id}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition disabled:opacity-50">
              <option value="">Selecione um veículo</option>
              {veiculos.map((v) => (
                <option key={v.id} value={v.id}>{v.marca} {v.modelo} — {v.placa}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Serviço</label>
            <select name="servico_id" required value={form.servico_id} onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition">
              <option value="">Selecione um serviço</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Data e Hora</label>
            <input name="data_hora" type="datetime-local" required value={form.data_hora} onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition" />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Observações</label>
            <textarea name="observacoes" value={form.observacoes} onChange={handleChange}
              placeholder="Ex: Cliente prefere horário da manhã"
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition resize-none" />
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={salvando}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition">
              {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar agendamento'}
            </button>
            <button type="button" onClick={() => navigate('/agendamentos')}
              className="text-gray-400 hover:text-white px-4 py-2.5 rounded-lg transition">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}