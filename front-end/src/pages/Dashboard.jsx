import Layout from '../components/ui/Layout'

export default function Dashboard() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
      <p className="text-gray-400 mb-8">Bem-vindo ao painel da AutoEstética.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Clientes cadastrados', valor: '—' },
          { label: 'Agendamentos hoje',    valor: '—' },
          { label: 'Faturamento do mês',   valor: '—' },
        ].map((card) => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-sm text-gray-400">{card.label}</p>
            <p className="text-3xl font-bold text-orange-500 mt-1">{card.valor}</p>
          </div>
        ))}
      </div>
    </Layout>
  )
}