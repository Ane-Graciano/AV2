import React, { useState, useMemo, useEffect } from 'react';
import NavBar from '../components/navbar';
import { getNivelAcesso } from '../utils/autenticacao';

const url = "http://localhost:3000"

interface Funcionario {
  id: string
  nivel: string
}
interface Etapa {
  id: string
  statusEtapa: string
}
interface Aeronave { id: string }
interface Teste {
  id: string
  resultado: string
}
interface DadosDashboard {
  totalFuncionarios: number
  totalAeronaves: number
  etapasConcluidas: number
  etapasEmAndamento: number
  testesReprovados: number
}

const CardBlock: React.FC<{ title: string; value: number | string; metric: string; }> = ({ title, value, metric }) => (
  <section className="p-4 w-96 h-32 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-center items-center hover:shadow-lg transition duration-300">
    <p className="text-gray-500 text-sm font-medium">{title}</p>
    <h3 className="text-4xl font-extrabold text-[#3a6ea5] mt-1">{value}</h3>
    <span className="text-xs text-gray-400 mt-1">{metric}</span>
  </section>
);


function App() {
  const nivelAcesso = useMemo(() => getNivelAcesso(), [])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [dados, setDados] = useState<DadosDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      const endpoints = ['funcionarios', 'etapa', 'testes', 'aeronave']

      const requests = endpoints.map(endpoint => fetch(`${url}/${endpoint}`))

      const responses = await Promise.all(requests)

      for (const res of responses) {
        if (!res.ok) {
          throw new Error(`Falha ao carregar o endpoint: ${res.url}`)
        }
      }

      const [funcionarios, etapa, testes, aeronave] = await Promise.all(
        responses.map(res => res.json())
      )

      const totalFuncionarios = funcionarios.length
      const totalAeronaves = aeronave.length

      const etapas = etapa as Etapa[]
      const etapasEmAndamento = etapas.filter(e =>
        (e.statusEtapa || '').toLowerCase().includes('andamento')
      ).length
      const etapasConcluidas = etapas.filter(e =>
        (e.statusEtapa || '').toLowerCase().includes('finalizada')
      ).length

      const testesArray = testes as Teste[]
      const testesReprovados = testesArray.filter(t =>
        (t.resultado || '').toLowerCase() === 'reprovado'
      ).length

      setDados({
        totalFuncionarios,
        totalAeronaves,
        etapasEmAndamento,
        etapasConcluidas,
        testesReprovados,
      });

    } catch (err) {
      setError("Erro ao processar dados: " + (err as Error).message);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <section className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-[#3a6ea5] font-semibold">Carregando dados do Dashboard...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="flex justify-center items-center h-screen bg-red-100 p-4">
        <p className="text-xl text-red-700 font-semibold">Erro: {error}</p>
      </section>
    )
  }

  return (
    <section className="flex w-screen h-screen">
      <section className=''>
        <NavBar nivel={nivelAcesso} />
      </section>

      {isMenuOpen && (
        <section
          className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <main className="p-4 md:p-8 md:ml-14 lg:ml-16 overflow-y-auto">
        <section>
          <h1 className="mt-20 mb-5 md:mt-0 text-3xl font-bold text-gray-800 lg:mb-24">Dashboard Home</h1>
        </section>
        <section>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 space-y-5 md:space-y-20">

            <CardBlock
              title="Total de Funcionários"
              value={dados?.totalFuncionarios || 0}
              metric="Cadastrados"
            />
            <CardBlock
              title="Total de Aeronaves"
              value={dados?.totalAeronaves || 0}
              metric="Modelos Únicos"
            />
            <CardBlock
              title="Etapas Concluídas"
              value={dados?.etapasConcluidas || 0}
              metric="Finalizadas no Sistema"
            />
            <CardBlock
              title="Etapas Em Andamento"
              value={dados?.etapasEmAndamento || 0}
              metric="Foco Prioritário"
            />
            <CardBlock
              title="Testes Reprovados"
              value={dados?.testesReprovados || 0}
              metric="Necessita Reavaliação"
            />
            <CardBlock
              title="Nível de Acesso"
              value={nivelAcesso.toUpperCase()}
              metric="Seu Perfil"
            />
          </section>
        </section>

      </main>
    </section>
  );
}

export default App;