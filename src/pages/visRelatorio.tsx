import { Component } from "react";
import { type aeronaves, type etapa, type peca, type teste } from "../types";
import Tabela, { type Coluna } from "../components/tabela";

interface PropsVisRelatorio {
  aeronave: aeronaves
  pecas: peca[]
  etapas: etapa[]
  testes: teste[]
  onFechar?: () => void
}

export default class VisRelatorio extends Component<PropsVisRelatorio> {
  private readonly colunasPecas: Coluna[] = [
    { header: "Nome", accessor: "nome" },
    { header: "Tipo", accessor: "tipo" },
    { header: "Status", accessor: "status" },
  ]

  private readonly colunasEtapas: Coluna[] = [
    { header: "Nome", accessor: "nome" },
    { header: "Prazo", accessor: "prazo" },
    { header: "Funcionários", accessor: "funcSelecionado" },
    { header: "Status", accessor: "status" },
  ]

  private readonly colunasTestes: Coluna[] = [
    { header: "Aeronave", accessor: "aeronave" },
    { header: "Tipo de Teste", accessor: "tipoTeste" },
    { header: "Resultado", accessor: "resultado" },
    { header: "Data", accessor: "data" },
    { header: "Observação", accessor: "obs" },
    { header: "Funcionário", accessor: "funcResp" },
  ]

  render() {
    const { aeronave, pecas, etapas, testes } = this.props;

    return (
      <section className="p-6 w-full h-full overflow-y-auto border-b border-black shadow-2xl bg-white">
        <h1 className="text-black font-bold text-2xl mb-4 text-center">Relatório Final da Aeronave</h1>

        <section className="grid grid-cols-2 mb-6">
          <div>
            <p className="text-black text-lg font-semibold">{aeronave.modelo}</p>
            <p className="text-black text-sm">{aeronave.tipo}</p>
          </div>
          <div>
            <p className="text-black text-sm">Alcance: {aeronave.alcance}</p>
            <p className="text-black text-sm">Capacidade: {aeronave.capacidade}</p>
          </div>
        </section>

        <section className="mt-4">
          <h2 className="text-black font-bold text-xl mb-2">Etapas</h2>
          {etapas.length > 0 ? (
            <Tabela colunas={this.colunasEtapas} dados={etapas} classname="w-full max-w-6xl mx-auto" />
          ) : (
            <p className="text-gray-500">Nenhuma etapa encontrada.</p>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-black font-bold text-xl mb-2">Peças</h2>
          {pecas.length > 0 ? (
            <Tabela colunas={this.colunasPecas} dados={pecas} classname="w-full max-w-6xl mx-auto" />
          ) : (
            <p className="text-gray-500">Nenhuma peça encontrada.</p>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-black font-bold text-xl mb-2">Testes</h2>
          {testes.length > 0 ? (
            <Tabela colunas={this.colunasTestes} dados={testes} classname="w-full max-w-6xl mx-auto" />
          ) : (
            <p className="text-gray-500">Nenhum teste encontrado.</p>
          )}
        </section>

        <section className="flex justify-center mt-8 space-x-4">
          <button
            className="btn-pdf"
            onClick={() => alert("Baixando relatório...")}
          >
            📄 Baixar PDF
          </button>
        </section>
      </section>
    );
  }
}
