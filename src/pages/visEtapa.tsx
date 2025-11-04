import { Component } from "react";
import Tabela, { type Coluna } from "../components/tabela";
import BarraPesquisa from "../components/barraPesquisa";
import NavBar from "../components/navbar";
import CadEtapa from "./cadEtapa";
import Modal from "../components/modal";
import { getNivelAcesso } from "../utils/autenticacao";


const url = "http://localhost:3000"


type etapas = {
    nome: string
    prazo: string
    statusEtapa: string
    funcSelecionado: string[]
    id: number
    idAeronave: number
}

interface PropsEtapa {
    aeronaveId?: number | null; 
    etapaId?: number; 
    onCadastroSucesso?: () => void;
}

interface StateEtapa {
    etapa: etapas[]
    pesquisa: string
    erro: string | null
    modalAberto: boolean
    conteudoModal: React.ReactNode
    nivelAcesso: string
}

export default class VisEtapa extends Component<PropsEtapa, StateEtapa> {
    private readonly colunasPecas: Coluna[] = [
        { header: "Nome", accessor: "nome" },
        { header: "Prazo", accessor: "prazo" },
        { header: "Funcionários", accessor: "funcSelecionado" },
        { header: "Status Atual da Etapa", accessor: "statusEtapa" },
        { header: "Inicia", accessor: "inicia" },
        { header: "Finaliza", accessor: "finaliza" },
        { header: "Editar", accessor: "editar" }
    ];

    constructor(props: PropsEtapa) {
        super(props),
            this.state = {
                etapa: [],
                pesquisa: "",
                erro: null,
                modalAberto: false,
                conteudoModal: null,
                nivelAcesso: getNivelAcesso()
            }
        this.PegaEtapas = this.PegaEtapas.bind(this)
        this.HandlePesquisa = this.HandlePesquisa.bind(this)
        this.abreCadEtapa = this.abreCadEtapa.bind(this)
        this.abreEditaEtapa = this.abreEditaEtapa.bind(this)
        this.alteraStatusEtapa = this.alteraStatusEtapa.bind(this)
    }
    componentDidMount(): void {
        this.PegaEtapas()
        this.setState({ nivelAcesso: getNivelAcesso() })
    }

    async alteraStatusEtapa(etapaId: number, novoStatus: 'em andamento' | 'finalizada') {

        const acao = novoStatus === 'em andamento' ? 'iniciar' : 'finalizar';
        if (!window.confirm(`Tem certeza que deseja ${acao} a etapa ${etapaId}?`)) {
            return;
        }

        this.setState({ erro: null });
        try {
            const res = await fetch(`${url}/etapa/${etapaId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ statusEtapa: novoStatus }),
            });

            if (!res.ok) {
                throw new Error(`Erro ao ${acao} a etapa: ${res.status}`);
            }

            alert(`Etapa ${etapaId} ${acao}da com sucesso!`);
            this.PegaEtapas();

        } catch (err) {
            this.setState({
                erro: `Falha ao ${acao} a etapa. ` + (err as Error).message,
            });
        }
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
        conteudoModal: (
            <CadEtapa 
                aeronaveId={this.props.aeronaveId} 
                onCadastroSucesso={() => {
                    this.setState({ modalAberto: false, conteudoModal: null });
                    this.PegaEtapas();
                }}
            />
        ),
        modalAberto: true
    })
}

    abreEditaEtapa(etapaParaEditar: etapas) {
        this.setState({
            conteudoModal: (
                <CadEtapa
                    etapaId={etapaParaEditar.id}
                    aeronaveId={etapaParaEditar.idAeronave}
                />
            ),
            modalAberto: true
        })
    }

    FormataDadosEtapas() {
        const dados = this.PegaEtapasFiltradas();
        const etapasCompletas = this.state.etapa
        const { nivelAcesso } = this.state
        const podeModificar = nivelAcesso === 'administrativo' || nivelAcesso === 'engenheiro'

        etapasCompletas.sort((a, b) => a.id - b.id);

        return dados.map((etapaAtual, index) => {

            const statusAtual = etapaAtual.statusEtapa.toLowerCase()
            const etapaAnterior = index > 0 ? etapasCompletas[index - 1] : null

            const podeIniciar =
                index === 0 ||
                (etapaAnterior && etapaAnterior.statusEtapa.toLowerCase() === 'finalizada')

            const estaPendente = statusAtual === 'pendente'
            const estaEmAndamento = statusAtual === 'em andamento'
            const podeFinalizar = estaEmAndamento

            let botaoInicia = <span className="text-gray-500 text-xs">N/A</span>
            let botaoFinaliza = <span className="text-green-700 font-semibold text-xs">Finalizada ✅</span>
            let botaoEditar = <span className="text-gray-500 text-xs">N/A</span>

            if (podeModificar) {
                if (estaPendente && podeIniciar) {
                    botaoInicia = (
                        <button
                            onClick={() => this.alteraStatusEtapa(etapaAtual.id, 'em andamento')}
                            className="p-2 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition font-semibold"
                        >
                            Inicia Etapa
                        </button>
                    );
                } else if (estaPendente && !podeIniciar) {
                    botaoInicia = (
                        <button
                            disabled
                            className="p-2 bg-gray-400 text-white rounded text-xs cursor-not-allowed"
                            title="A etapa anterior precisa ser finalizada antes de iniciar esta."
                        >
                            Inicia Etapa
                        </button>
                    );
                }

                if (podeFinalizar) {
                    botaoFinaliza = (
                        <button
                            onClick={() => this.alteraStatusEtapa(etapaAtual.id, 'finalizada')}
                            className="p-2 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition font-semibold"
                        >
                            Finaliza Etapa
                        </button>
                    );
                } else if (!estaEmAndamento && statusAtual !== 'finalizada') {
                    botaoFinaliza = (
                        <button
                            disabled
                            className="p-2 bg-gray-400 text-white rounded text-xs cursor-not-allowed"
                            title="Etapa precisa estar 'Em Andamento' para ser finalizada."
                        >
                            Finaliza Etapa
                        </button>
                    );
                } else if (statusAtual === 'finalizada') {
                    botaoFinaliza = (
                        <span className="text-green-700 font-semibold text-xs">Finalizada ✅</span>
                    );
                } else {
                    botaoFinaliza = (
                        <span className="text-gray-500 text-xs">N/A</span>
                    );
                }

                botaoEditar = (
                    <button
                        onClick={() => this.abreEditaEtapa(etapaAtual)}
                        className="p-2 bg-[#3a6ea5] text-white rounded text-xs hover:bg-blue-600 transition"
                    >
                        Editar ✏️
                    </button>
                );

            } else {
                if (statusAtual === 'finalizada') {
                    botaoFinaliza = (
                        <span className="text-green-700 font-semibold text-xs">Finalizada ✅</span>
                    );
                } else {
                    botaoFinaliza = (
                        <span className="text-gray-500 text-xs">Sem Permissão</span>
                    );
                }
            }

            return {
                ...etapaAtual,
                funcSelecionado: etapaAtual.funcSelecionado.join(', '),
                inicia: botaoInicia,
                finaliza: botaoFinaliza,
                editar: botaoEditar
            };
        });
    }

    render() {
        const { etapa, erro, modalAberto, conteudoModal, nivelAcesso } = this.state
        const dadosFiltrados = this.FormataDadosEtapas();
        const podeModifica = nivelAcesso === 'administrativo' || nivelAcesso === 'engenheiro'
        return (
            <>
                <section className="w-screen h-screen grid grid-cols-[5%_95%]  overflow-x-hidden">
                    <section>
                        {window.location.pathname !== '/login' && (
                            <NavBar nivel={nivelAcesso} />
                        )}
                    </section>
                    <section className="">
                        <section className="mt-[3%] ml-[5%]">
                            <BarraPesquisa
                                onPesquisa={this.HandlePesquisa}
                                placeholder="Buscar por nome, usuáario ou nível..."
                            />
                        </section>
                        <section className="flex justify-between w-[90%] m-auto mt-[3%]">
                            <h1 className="text-black font-bold text-4xl font-nunito">Etapas</h1>
                            {podeModifica && (
                                <button className="bg-[#3a6ea5] text-white font-nunito font-semibold text-sm p-3 rounded-3xl pl-10 pr-10 border-2 border-[#24679a] cursor-pointer hover:border-[#184e77]" onClick={this.abreCadEtapa}>+ Etapa</button>
                            )}
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