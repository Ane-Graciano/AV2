import { Component } from "react";
import Tabela, { type Coluna } from "../components/tabela";
import BarraPesquisa from "../components/barraPesquisa";
import NavBar from "../components/navbar";
import CadEtapa from "./cadEtapa";
import Modal from "../components/modal";
import SelectLinha from "../components/selectLinha";


const url = "http://localhost:3000"


type etapas = {
    nome: string
    prazo: string
    statusEtapa: string
    funcSelecionado: string[]
    id?: number
}

interface PropsEtapa { }

interface StateEtapa {
    etapa: etapas[]
    pesquisa: string
    erro: string | null
    modalAberto: boolean
    conteudoModal: React.ReactNode
}

export default class VisEtapa extends Component<PropsEtapa, StateEtapa> {
    private readonly colunasPecas: Coluna[] = [
        { header: "Nome", accessor: "nome" },
        { header: "Prazo", accessor: "prazo" },
        { header: "Funcionários", accessor: "funcSelecionado" },
        { header: "Status Atual da Etapa", accessor: "statusEtapa" },
        { header: "Atualizar Status", accessor: "novoStatus" },
        { header: "Editar", accessor: "editar" }
    ];

    constructor(props: PropsEtapa) {
        super(props),
            this.state = {
                etapa: [],
                pesquisa: "",
                erro: null,
                modalAberto: false,
                conteudoModal: null
            }
        this.PegaEtapas = this.PegaEtapas.bind(this)
        this.HandlePesquisa = this.HandlePesquisa.bind(this)
        this.abreCadEtapa = this.abreCadEtapa.bind(this)
        this.abreEditaEtapa = this.abreEditaEtapa.bind(this)
    }
    componentDidMount(): void {
        this.PegaEtapas()
    }

    async PegaEtapas() {
        this.setState({ erro: null })
        try {
            const res = await fetch(`${url}/etapa`)

            if (!res.ok) {
                throw new Error(`Erro ao buscar as etapas cadastrados: ${res.status}`)
            }

            const dados_etapa: etapas[] = await res.json()
            this.setState({
                etapa: dados_etapa
            })
        } catch (err) {
            this.setState({
                erro: "Falha ao carregar os dados das etapas. " + (err as Error).message,
            });
        }
    }

    HandlePesquisa(texto: string) {
        this.setState({ pesquisa: texto })
    }

    PegaEtapasFiltradas(): etapas[] {
        const { etapa, pesquisa } = this.state;

        if (!pesquisa) {
            return etapa;
        }

        const pesqMinusculo = pesquisa.toLowerCase();

        return etapa.filter(e => {
            return (
                e.nome.toLowerCase().includes(pesqMinusculo) ||
                e.statusEtapa.toLowerCase().includes(pesqMinusculo) ||
                e.prazo.toLowerCase().includes(pesqMinusculo)
            );
        });
    }

    abreCadEtapa(e: React.MouseEvent) {
        e.preventDefault()
        this.setState({
            conteudoModal: <CadEtapa />,
            modalAberto: true
        })
    }

    abreEditaEtapa(etapaParaEditar: etapas) {
        this.setState({
            conteudoModal: (
                <CadEtapa />
            ),
            modalAberto: true
        })
    }

    FormataDadosEtapas() {
        const dados = this.PegaEtapasFiltradas();

        return dados.map(etapa => ({
            ...etapa,

            funcSelecionado: etapa.funcSelecionado.join(', '),

            // Coluna  (novoStatus)
            novoStatus: (
                <div className="flex items-center space-x-2">
                    {/* Você pode manter o SELECT nativo por simplicidade na tabela */}
                    <select
                        defaultValue={etapa.statusEtapa}
                        className="p-1 border rounded text-sm min-w-[100px]"
                    // TODO: Adicionar um estado local para controlar o valor selecionado antes de Salvar
                    >
                        <option value="pendente">Pendente</option>
                        <option value="em_progresso">Em Progresso</option>
                        <option value="concluido">Concluído</option>
                    </select>
                    <button
                        // TODO: Chamar o método this.AtualizarStatus(etapa.id, novoValor)
                        onClick={() => console.log(`TODO: Salvar novo status para Etapa ID: ${etapa.id}`)}
                        className="p-2 bg-[#3a6ea5] text-white rounded text-xs hover:bg-blue-600 transition"
                    >
                        Salvar
                    </button>
                </div>
            ),

            // Coluna (editar)
            editar: (
                <button
                    onClick={() => this.abreEditaEtapa(etapa)}
                    className="p-2 bg-[#3a6ea5] text-white rounded text-xs hover:bg-blue-600 transition"
                >
                    Editar ✏️
                </button>
            )
        }));
    }



    render() {
        const { etapa, erro, modalAberto, conteudoModal } = this.state
        const dadosFiltrados = this.FormataDadosEtapas();
        return (
            <>
                <section className="w-screen h-screen grid grid-cols-[5%_95%]  overflow-x-hidden">
                    <section>
                        <NavBar />
                    </section>
                    <section className="">
                        <section className="mt-[3%] ml-[5%]">
                            <BarraPesquisa
                                onPesquisa={this.HandlePesquisa}
                                placeholder="Buscar por nome, usuáario ou nível..."
                            />
                        </section>
                        <section className="flex justify-between w-[90%] m-auto mt-[3%] overflow-y-auto">
                            <h1 className="text-black font-bold text-4xl font-nunito">Etapas</h1>
                            <button className="bg-[#3a6ea5] text-white font-nunito font-semibold text-sm p-3 rounded-3xl pl-10 pr-10 border-2 border-[#24679a] cursor-pointer hover:border-[#184e77]" onClick={this.abreCadEtapa}>+ Etapa</button>
                        </section>
                        {erro && (
                            <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                                Erro: {erro}
                            </div>
                        )}
                        {!erro && etapa.length > 0 && (
                            <section className="w-[90%] m-auto mt-[3%] mb-[5%]">
                                <Tabela
                                    dados={dadosFiltrados}
                                    colunas={this.colunasPecas}>
                                </Tabela>
                            </section>
                        )}
                    </section>
                </section>
                <Modal aberto={modalAberto} onFechar={() => this.setState({ modalAberto: false, conteudoModal: null })}>
                    {conteudoModal}
                </Modal>
            </>
        )
    }
}