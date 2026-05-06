import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import Layout from '../components/ui/Layout'

export default function VeiculoForm() {
  const { clienteId, id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [form, setForm] = useState({
    marca: '', modelo: '', ano: '', placa: '', cor: ''
  })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (editando) carregarVeiculo()
  }, [id])

  async function carregarVeiculo() {
    const { data } = await supabase.from('veiculos').select('*').eq('id', id).single()
    if (data) setForm({
      marca: data.marca,
      modelo: data.modelo,
      ano: data.ano,
      placa: data.placa,
      cor: data.cor
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
      if (!editando) {
        const { data: existe } = await supabase
          .from('veiculos').select('id').eq('placa', form.placa).single()
        if (existe) {
          setErro('Já existe um veículo com essa placa.')
          setSalvando(false)
          return
        }
      }

      const payload = { ...form, cliente_id: clienteId, ano: parseInt(form.ano) }

      if (editando) {
        await supabase.from('veiculos').update(payload).eq('id', id)
      } else {
        await supabase.from('veiculos').insert(payload)
      }

      navigate(`/clientes/${clienteId}/veiculos`)
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
          {editando ? 'Editar Veículo' : 'Novo Veículo'}
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          {editando ? 'Atualize os dados do veículo.' : 'Preencha os dados para cadastrar.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Marca</label>
            <input name="marca" required value={form.marca} onChange={handleChange}
              placeholder="Ex: Toyota"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Modelo</label>
            <input name="modelo" required value={form.modelo} onChange={handleChange}
              placeholder="Ex: Corolla"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Ano</label>
            <input name="ano" type="number" required value={form.ano} onChange={handleChange}
              placeholder="Ex: 2021"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Placa</label>
            <input name="placa" required value={form.placa} onChange={handleChange}
              placeholder="Ex: ABC-1234"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Cor</label>
            <input name="cor" value={form.cor} onChange={handleChange}
              placeholder="Ex: Prata"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 transition" />
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={salvando}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition">
              {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar veículo'}
            </button>
            <button type="button" onClick={() => navigate(`/clientes/${clienteId}/veiculos`)}
              className="text-gray-400 hover:text-white px-4 py-2.5 rounded-lg transition">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}