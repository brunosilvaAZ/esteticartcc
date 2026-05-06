import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import Layout from '../components/ui/Layout'

export default function ClienteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [form, setForm] = useState({ nome: '', telefone: '', email: '' })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { if (editando) carregarCliente() }, [id])

  async function carregarCliente() {
    const { data } = await supabase.from('clientes').select('*').eq('id', id).single()
    if (data) setForm({ nome: data.nome, telefone: data.telefone, email: data.email })
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      if (!editando) {
        const { data: existe } = await supabase
          .from('clientes').select('id').eq('telefone', form.telefone).single()
        if (existe) {
          setErro('Já existe um cliente com esse telefone.')
          setSalvando(false)
          return
        }
      }
      if (editando) {
        await supabase.from('clientes').update(form).eq('id', id)
      } else {
        await supabase.from('clientes').insert(form)
      }
      navigate('/clientes')
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
          {editando ? 'Editar Cliente' : 'Novo Cliente'}
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          {editando ? 'Atualize os dados do cliente.' : 'Preencha os dados para cadastrar.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome completo</label>
            <input name="nome" required value={form.nome} onChange={handleChange}
              placeholder="Ex: João da Silva"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Telefone</label>
            <input name="telefone" required value={form.telefone} onChange={handleChange}
              placeholder="Ex: (18) 99999-0000"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="Ex: joao@email.com"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition" />
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={salvando}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition">
              {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar cliente'}
            </button>
            <button type="button" onClick={() => navigate('/clientes')}
              className="text-gray-400 hover:text-white px-4 py-2.5 rounded-lg transition">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}