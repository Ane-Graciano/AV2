import { Component } from "react"
import { type aeronaves, type etapa, type peca, type teste } from "../types";
import Tabela, { type Coluna } from "../components/tabela";
import CadEtapa from "../pages/cadEtapa";
import Modal from "./modal";
import VisRelatorio from "../pages/visRelatorio";

interface PropsDetalhesAero {
    aeronave: aeronaves
    pecas: peca[]
    etapas: etapa[]
    testes: teste[]
    etapasSelecionadas: number[]
    onToggleEtapa: (etapaId: number, isSelecionada: boolean) => void
    onStatusLote: (novoStatus: 'em andamento' | 'finalizada') => Promise<void>
    onAbreEditaPeca: (peca: peca) => void
    onRecarregarDetalhes: (idAero: number) => Promise<void>
    nivelAcesso: string
}

interface StateDetalhesAero {
    modalAberto: boolean
    conteudoModal: React.ReactNode
    etapaParaEditar: etapa | null
    statusPecaTemp: { [key: number]: string }
}

export default class DetalhesAero extends Component<PropsDetalhesAero, StateDetalhesAero> {
    constructor(props: PropsDetalhesAero) {
        super(props)
        this.state = {
            modalAberto: false,
            conteudoModal: null,
            etapaParaEditar: null,
            statusPecaTemp: {}
        }
        this.abreCadEtapa = this.abreCadEtapa.bind(this)
        this.abreEditaEtapa = this.abreEditaEtapa.bind(this)
        this.handleStatusChange = this.handleStatusChange.bind(this)
        this.salvarNovoStatus = this.salvarNovoStatus.bind(this)
        this.gerarEVisualizarRelatorio = this.gerarEVisualizarRelatorio.bind(this);
    }

    private readonly colunasPecas: Coluna[] = [
        { header: "Nome", accessor: "nome" },
        { header: "Tipo", accessor: "tipo" },
        { header: "Fornecedor", accessor: "fornecedor" },
        { header: "Status", accessor: "status" },
        { header: "Att Status", accessor: "novoStatus" },
        { header: "Editar", accessor: "editar" }
    ];
    private readonly colunasEtapas: Coluna[] = [
        { header: "Sel", accessor: "selecionar" },
        { header: "Nome", accessor: "nome" },
        { header: "Prazo", accessor: "prazo" },
        { header: "Funcionários", accessor: "funcSelecionado" },
        { header: "Status", accessor: "status" },
        { header: "Editar", accessor: "editar" }
    ];
    private readonly colunasTestes: Coluna[] = [
        { header: "Aeronave", accessor: "aeronave" },
        { header: "Tipo de Teste", accessor: "tipoTeste" },
        { header: "Resultado", accessor: "resultado" },
        { header: "Data", accessor: "data" },
        { header: "Observação", accessor: "obs" },
        { header: "Funcionário", accessor: "funcResp" }
    ]

    abreCadEtapa(e: React.MouseEvent) {
        e.preventDefault()
        this.setState({
            conteudoModal: <CadEtapa aeronaveId={this.props.aeronave.id} />,
            modalAberto: true
        })
    }

    abreEditaEtapa(etapaParaEditar: etapa) {
        this.setState({
            conteudoModal: (
                <CadEtapa etapaId={etapaParaEditar.id} aeronaveId={this.props.aeronave.id} />
            ),
            modalAberto: true
        })
    }

    private readonly url = "http://localhost:3000"

    handleStatusChange(pecaId: number, novoStatus: string) {
        this.setState(prevState => ({
            statusPecaTemp: {
                ...prevState.statusPecaTemp,
                [pecaId]: novoStatus,
            },
        }));
    }

    async salvarNovoStatus(pecaId: number, novoStatus: string) {
        const pecaOriginal = this.props.pecas.find(p => p.id === pecaId);

        if (!pecaOriginal || pecaOriginal.status === novoStatus) {
            this.setState(prevState => {
                const newStatusTemp = { ...prevState.statusPecaTemp }
                delete newStatusTemp[pecaId]
                return { statusPecaTemp: newStatusTemp }
            });
            return
        }

        if (!window.confirm(`Tem certeza que deseja alterar o status da peça ID ${pecaId} para "${novoStatus}"?`)) {
            return;
        }

        try {
            const res = await fetch(`${this.url}/pecas/${pecaId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: novoStatus }),
            });

            if (!res.ok) {
                throw new Error(`Erro ao atualizar o status da peça: ${res.status} ${res.statusText}`);
            }
            this.setState(prevState => {
                const newStatusTemp = { ...prevState.statusPecaTemp };
                delete newStatusTemp[pecaId];
                return { statusPecaTemp: newStatusTemp };
            });

            alert("Status da peça atualizado com sucesso!");

            await this.props.onRecarregarDetalhes(this.props.aeronave.id)


        } catch (error) {
            alert(`Falha ao salvar o novo status: ${(error as Error).message}. Verifique se a sua API (${this.url}) está rodando.`);
        }
    }

    FormataEtapa() {
        const { etapas, onToggleEtapa, etapasSelecionadas, nivelAcesso } = this.props
        const podeModificar = nivelAcesso === 'administrativo' || nivelAcesso === 'engenheiro'

        return etapas.map(e => {
            let campoSelecao: React.ReactNode = <span className="text-gray-500 text-xs">-</span>
            let botaoEditar: React.ReactNode = <span className="text-gray-500 text-xs">N/A</span>

            if (podeModificar) {
                campoSelecao = (
                    <input
                        type="checkbox"
                        checked={etapasSelecionadas.includes(e.id)}
                        onChange={(event) => onToggleEtapa(e.id, event.target.checked)}
                        className="w-4 h-4 text-[#3a6ea5] bg-gray-100 border-gray-300 rounded focus:ring-[#3a6ea5]"
                    />
                )

                botaoEditar = (
                    <button
                        onClick={() => this.abreEditaEtapa(e)}
                        className="p-1 bg-gray-300 text-gray-800 rounded text-xs hover:bg-gray-400 transition"
                    >
                        ✏️
                    </button>
                )
            }

            return {
                ...e,
                selecionar: campoSelecao,
                funcSelecionado: Array.isArray(e.funcSelecionado) ? e.funcSelecionado.join(', ') : e.funcSelecionado,
                editar: botaoEditar
            }
        })
    }

    FormataPecas() {
        const { pecas, onAbreEditaPeca, nivelAcesso } = this.props;
        const { statusPecaTemp } = this.state;
        const podeEditarPeca = nivelAcesso === 'administrativo' || nivelAcesso === 'engenheiro';

        return pecas.map(p => {
            const statusSelecionado = statusPecaTemp[p.id] || p.status;
            const haMudancaPendente = statusSelecionado !== p.status;

            let botaoEditar: React.ReactNode = <span className="text-gray-500 text-xs">N/A</span>;

            if (podeEditarPeca) {
                botaoEditar = (
                    <button
                        onClick={() => onAbreEditaPeca(p)}
                        className="p-1 bg-gray-300 text-gray-800 rounded text-xs hover:bg-gray-400 transition"
                    >
                        ✏️
                    </button>
                );
            }

            return {
                ...p,

                novoStatus: (
                    <div className="flex items-center space-x-2">
                        <select
                            value={statusSelecionado}
                            onChange={(e) => this.handleStatusChange(p.id, e.target.value)}
                            className="p-1 border rounded text-sm min-w-[100px] border-gray-300 focus:border-[#3a6ea5] transition"
                        >
                            <option value="pendente">Pendente</option>
                            <option value="em_progresso">Em Progresso</option>
                            <option value="concluido">Concluído</option>
                        </select>

                        <button
                            onClick={() => this.salvarNovoStatus(p.id, statusSelecionado)}
                            disabled={!haMudancaPendente}
                            className={`p-2 text-white rounded text-xs transition font-semibold 
                                ${haMudancaPendente
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            Salvar
                        </button>
                    </div>
                ),

                editar: botaoEditar,
            }
        })
    }

    async gerarEVisualizarRelatorio(e: React.MouseEvent) {
        e.preventDefault();

        const { aeronave, pecas, etapas, testes, onRecarregarDetalhes } = this.props

        if (aeronave.statusRelatorio === 'Concluído') {
            alert(`O relatório final para a aeronave ${aeronave.modelo} já foi gerado e está ${aeronave.statusRelatorio}.`);
            this.setState({
                conteudoModal: <VisRelatorio
                    aeronave={aeronave}
                    pecas={pecas}
                    etapas={etapas}
                    testes={testes}
                    onFechar={() => this.setState({ modalAberto: false, conteudoModal: null })}
                />,
                modalAberto: true,
            });
            return;
        }

        const etapasIncompletas = etapas.filter(etapa => etapa.status !== 'finalizada')
        if (etapasIncompletas.length > 0) {
            alert(`Não é possível gerar o relatório. ${etapasIncompletas.length} etapas ainda não foram finalizadas.`)
            return
        }

        const pecasIncompletas = pecas.filter(peca => peca.status !== 'concluido')
        if (pecasIncompletas.length > 0) {
            alert(`Não é possível gerar o relatório. ${pecasIncompletas.length} peças ainda não estão com o status 'Concluído'.`)
            return
        }

        if (!window.confirm(`Todas as etapas e peças estão concluídas. Deseja finalizar o processo da aeronave ${aeronave.modelo} e gerar o relatório?`)) {
            return;
        }

        const novoStatusRelatorio = 'Concluído'

        try {
            const dadosRelatorio = {
                aeronave: aeronave,
                dataGeracao: new Date().toISOString(),
                statusFinal: novoStatusRelatorio,
                pecas: pecas.map(p => ({
                    id: p.id,
                    nome: p.nome,
                    tipo: p.tipo,
                    status: p.status,
                })),
                etapas: etapas.map(e => ({
                    id: e.id,
                    nome: e.nome,
                    prazo: e.prazo,
                    status: e.status,
                    funcionarios: e.funcSelecionado,
                })),
                testes: testes,
            }

            const resRelatorio = await fetch(`${this.url}/relatorios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosRelatorio),
            });

            if (!resRelatorio.ok) {
                throw new Error(`Erro ao salvar o relatório: ${resRelatorio.status} ${resRelatorio.statusText}`);
            }

            const resAeronave = await fetch(`${this.url}/aeronaves/${aeronave.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    statusRelatorio: novoStatusRelatorio // Atualiza o campo que você usa para bloquear
                }),
            });

            if (!resAeronave.ok) {
                console.warn("Aviso: Falha ao atualizar o statusRelatorio da aeronave. O bloqueio pode não funcionar após o reload.");
            }

            // 3. Recarregar os detalhes para buscar o novo statusRelatorio
            await onRecarregarDetalhes(aeronave.id);

            console.log(`Relatório final para a aeronave ${aeronave.modelo} salvo com sucesso!`);
            alert("Relatório final gerado e salvo com sucesso!");

            this.setState({
                conteudoModal: <VisRelatorio
                    aeronave={aeronave}
                    pecas={pecas}
                    etapas={etapas}
                    testes={testes}
                    onFechar={() => this.setState({ modalAberto: false, conteudoModal: null })}
                />,
                modalAberto: true,
            });

        } catch (error) {
            console.error('Erro ao gerar/salvar relatório:', error);
            alert(`Falha ao gerar e salvar o relatório final: ${(error as Error).message}.`);
        }
    }

    render() {
        const { aeronave, etapas, pecas, testes, onStatusLote, etapasSelecionadas, nivelAcesso } = this.props
        const { modalAberto, conteudoModal } = this.state
        const dadosEtapasFormatados = this.FormataEtapa()
        const dadosPecasFormatados = this.FormataPecas()
        const podeModificar = nivelAcesso === 'administrativo' || nivelAcesso === 'engenheiro'
        const tabelaMaxWidth = "w-full max-w-7xl mx-auto"
        const relatorioConcluido = aeronave.statusRelatorio === 'Concluído'
        const textoBotao = relatorioConcluido ? `Relatório Concluído (Visualizar)` : 'Gerar relatório final'
        return (
            <>
                <section className="p-5 w-full h-full overflow-y-auto border-b border-black shadow-2xl">
                    <section className="w-full mb-[2%]">
                        <h1 className="text-black font-bold text-lg md:text-2xl lg:text-3xl mb-[1%]">Dados Gerais</h1>
                        <section className="grid grid-cols-2">
                            <section>
                                <p className="text-black font-medium text-xs sm:text-sm  md:text-sm lg:text-xl">{aeronave.modelo}</p>
                                <p className="text-black font-medium text-xs sm:text-sm  md:text-sm lg:text-xl">{aeronave.tipo}</p>
                            </section>
                            <section>
                                <p className="text-black font-medium text-xs sm:text-sm  md:text-sm lg:text-xl">{aeronave.alcance}</p>
                                <p className="text-black font-medium text-xs sm:text-sm  md:text-sm lg:text-xl">{aeronave.capacidade}</p>
                            </section>
                        </section>
                    </section>
                    <section className="mt-[5%]">
                        <section className="flex justify-between items-center mb-4">
                            <h1 className="text-black font-bold text-lg md:text-2xl lg:text-3xl mb-[1%]">Etapas</h1>
                            {podeModificar && (
                                <button className="bg-[#3a6ea5] text-white font-nunito font-semibold text-sm p-2 rounded-lg hover:bg-[#24679a] transition" onClick={this.abreCadEtapa}>
                                    + vincula etapa
                                </button>
                            )}
                        </section>
                        <section>
                            {etapas.length > 0 ? (
                                <>
                                    <section className={`overflow-x-auto`}>
                                        <Tabela colunas={this.colunasEtapas} dados={dadosEtapasFormatados} classname={`${tabelaMaxWidth} overflow-auto`} />
                                    </section>

                                    {podeModificar && (
                                        <section className="mt-4 flex space-x-4">
                                            <button
                                                onClick={() => onStatusLote('em andamento')}
                                                disabled={etapasSelecionadas.length === 0}
                                                className={`p-2 rounded text-sm font-semibold transition 
                                                ${etapasSelecionadas.length === 0
                                                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                        : 'bg-green-600 text-white hover:bg-green-700'}`}
                                            >
                                                Iniciar Etapas ({etapasSelecionadas.length})
                                            </button>
                                            <button
                                                onClick={() => onStatusLote('finalizada')}
                                                disabled={etapasSelecionadas.length === 0}
                                                className={`p-2 rounded text-sm font-semibold transition 
                                                ${etapasSelecionadas.length === 0
                                                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                        : 'bg-red-600 text-white hover:bg-red-700'}`}
                                            >
                                                Finalizar Etapas ({etapasSelecionadas.length})
                                            </button>
                                        </section>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-500 p-4 border rounded">Nenhuma etapa cadastrada para esta aeronave.</p>
                            )}
                        </section>
                    </section>
                    <section className="mt-[5%]">
                        <h1 className="text-black font-bold text-lg md:text-2xl lg:text-3xl mb-[1%]">Peças</h1>
                        <section>
                            {pecas.length > 0 ? (
                                <Tabela colunas={this.colunasPecas} dados={dadosPecasFormatados} classname={`${tabelaMaxWidth} overflow-auto`} />
                            ) : (
                                <p>Nenhuma peça cadastrado</p>
                            )}
                        </section>
                    </section>
                    <section className="mt-[5%]">
                        <h1 className="text-black font-bold text-lg md:text-2xl lg:text-3xl mb-[1%]">Testes</h1>
                        <section>
                            {testes.length > 0 ? (
                                <Tabela colunas={this.colunasTestes} dados={testes} classname={`${tabelaMaxWidth} overflow-auto`} />
                            ) : (
                                <p>Nenhum teste cadastrado</p>
                            )}
                        </section>
                    </section>
                    {podeModificar && (
                        <button
                            type="button"
                            onClick={this.gerarEVisualizarRelatorio}
                            disabled={relatorioConcluido}
                            className={`mt-[5%] text-white font-nunito font-semibold text-sm p-3 rounded-3xl pl-10 pr-10 border-2 transition
                                ${relatorioConcluido ? 'bg-gray-400 border-gray-500 cursor-not-allowed' : 'bg-[#3a6ea5] border-[#24679a] cursor-pointer hover:border-[#184e77]'}`}
                        >
                            {textoBotao}
                        </button>
                    )}
                </section>
                <Modal aberto={modalAberto} onFechar={() => this.setState({ modalAberto: false, conteudoModal: null })}>
                    {conteudoModal}
                </Modal>
            </>
        )
    }
}