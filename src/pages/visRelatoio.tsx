import { Component } from "react";
import NavBar from "../components/navbar";
import { getNivelAcesso } from "../utils/autenticacao";
import VisRelatorio from "./visRelatorio";
import Modal from "../components/modal";
import BarraPesquisa from "../components/barraPesquisa";

interface PropsRelatorio { }
interface StateRelatorio {
  nivelAcesso: string
  relatorios: any[]
  pesquisa: string
  carregando: boolean
  aberto: boolean
  relatorioSelecionado: any | null
}

export default class VisRelatorio2 extends Component<PropsRelatorio, StateRelatorio> {
  private readonly url = "http://localhost:3000"

  constructor(props: PropsRelatorio) {
    super(props);
    this.state = {
      nivelAcesso: getNivelAcesso(),
      relatorios: [],
      pesquisa: "",
      carregando: true,
      aberto: false,
      relatorioSelecionado: null,
    };
    this.HandlePesquisa = this.HandlePesquisa.bind(this)
  }

  async componentDidMount() {
    try {
      const resposta = await fetch(`${this.url}/relatorios`);
      const dados = await resposta.json();
      this.setState({
        relatorios: dados,
        carregando: false
      });
    } catch (erro) {
      console.error("Erro ao carregar relatórios:", erro);
      this.setState({ carregando: false });
    }
  }

  HandlePesquisa(texto: string) {
    this.setState({ pesquisa: texto })
  }

  abrirModal = (relatorio: any) => {
    this.setState({ aberto: true, relatorioSelecionado: relatorio });
  };


  render() {
    const { relatorios, pesquisa, carregando, nivelAcesso, aberto, relatorioSelecionado } = this.state;

    const filtrados = relatorios.filter((r) =>
      r.aeronave?.modelo?.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
      <section className="grid grid-cols-1 md:grid-cols-[5%_95%] overflow-x-hidden overflow-y-auto">
        <section>
          {window.location.pathname !== "/login" && <NavBar nivel={nivelAcesso} />}
        </section>

        <section className="w-screen h-screen p-7 m-auto">
          <h1 className="text-2xl font-bold mt-12 md:mt-0 md:mb-6 text-[#1b2b4b]">
            Listagem dos Relatórios Finais
          </h1>

          <BarraPesquisa
            onPesquisa={this.HandlePesquisa}
            placeholder="🔍 Buscar por modelo, tipo"
          />

          {carregando ? (
            <p>Carregando relatórios...</p>
          ) : filtrados.length === 0 ? (
            <p className="text-gray-500">Nenhum relatório encontrado.</p>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-7 p-3 md:mr-6 lg:mr-16">
              {filtrados.map((r) => (
                <section
                  key={r.id}
                  className="bg-[#fffcfc] shadow-lg rounded-2xl p-4 flex flex-col justify-center hover:shadow-xl transition"
                >
                  <h2 className="text-lg font-semibold text-[#135b78] mb-2">
                    {r.aeronave?.modelo}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">Status:</span> {r.statusFinal} <br />
                    <span className="font-medium">Data:</span>{" "}
                    {new Date(r.dataGeracao).toLocaleDateString("pt-BR")}
                  </p>
                  <section className="flex justify-evenly">
                    <button
                      onClick={() => this.abrirModal(r)}
                      className="bg-[#3a6ea5] text-white p-2 w-20 rounded-lg hover:bg-blue-600 transition text-sm"
                    >
                      Visualizar
                    </button>
                    <button
                      onClick={() => alert("Baixando relatório...")}
                      className="bg-[#3a6ea5] text-white p-2 w-20 rounded-lg hover:bg-blue-600 transition text-sm"
                    >
                      Baixar
                    </button>
                  </section>
                </section>
              ))}
            </section>
          )}
        </section>

        <Modal aberto={aberto} onFechar={() => this.setState({ aberto: false})}>
          {relatorioSelecionado && (
            <VisRelatorio
              aeronave={relatorioSelecionado.aeronave}
              pecas={relatorioSelecionado.pecas || []}
              etapas={relatorioSelecionado.etapas || []}
              testes={relatorioSelecionado.testes || []}
            />
          )}
        </Modal>
      </section>
    );
  }
}