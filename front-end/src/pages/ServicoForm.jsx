import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import Layout from '../components/ui/Layout'

export default function ServicoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [form, setForm] = useState({ nome: '', preco_base: '', duracao_estimada: '' })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { if (editando) carregarServico() }, [id])

  async function carregarServico() {
    const { data } = await supabase.from('servicos').select('*').eq('id', id).single()
    if (data) setForm({
      nome: data.nome,
      preco_base: data.preco_base,
      duracao_estimada: data.duracao_estimada
    })
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      const payload = {
        nome: form.nome,
        preco_base: parseFloat(form.preco_base),
        duracao_estimada: parseInt(form.duracao_estimada)
      }
      if (editando) {
        await supabase.from('servicos').update(payload).eq('id', id)
      } else {
        await supabase.from('servicos').insert(payload)
      }
      navigate('/servicos')
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
          {editando ? 'Editar Serviço' : 'Novo Serviço'}
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          {editando ? 'Atualize os dados do serviço.' : 'Preencha os dados para cadastrar.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome do serviço</label>
            <input name="nome" required value={form.nome} onChange={handleChange}
              placeholder="Ex: Lavagem Completa"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Preço base (R$)</label>
            <input name="preco_base" type="number" step="0.01" required value={form.preco_base} onChange={handleChange}
              placeholder="Ex: 60.00"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Duração estimada (minutos)</label>
            <input name="duracao_estimada" type="number" required value={form.duracao_estimada} onChange={handleChange}
              placeholder="Ex: 60"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition" />
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={salvando}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition">
              {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar serviço'}
            </button>
            <button type="button" onClick={() => navigate('/servicos')}
              className="text-gray-400 hover:text-white px-4 py-2.5 rounded-lg transition">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}