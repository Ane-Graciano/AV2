import { Component } from "react";
import Tabela, { type Coluna } from "../components/tabela";
import BarraPesquisa from "../components/barraPesquisa";
import NavBar from "../components/navbar";
import CadFunc from "./cadFunc";
import Modal from "../components/modal";


const url = "http://localhost:3000"

type funcionarios = {
    nome: string
    telefone: string
    endereco: string
    usuario: string
    senha: string
    nivel: string
    id?: number
}


interface PropsTeste { }

interface StateTeste {
    func: funcionarios[]
    pesquisa: string
    erro: string | null
    modalAberto: boolean
    conteudoModal: React.ReactNode
}

export default class VisFunc extends Component<PropsTeste, StateTeste> {
    private readonly colunasFuncionarios: Coluna[] = [
        { header: "Nome Completo", accessor: "nome" },
        { header: "Telefone", accessor: "telefone" },
        { header: "Endereco", accessor: "endereco" },
        { header: "Usuario", accessor: "usuario" },
        { header: "Senha", accessor: "senha" },
        { header: "Nível", accessor: "nivel" },
        { header: "Editar", accessor: "editar" }
    ];

    constructor(props: PropsTeste) {
        super(props),
            this.state = {
                func: [],
                pesquisa: "",
                erro: null,
                modalAberto: false,
                conteudoModal: null
            }
        this.PegaFunc = this.PegaFunc.bind(this)
        this.HandlePesquisa = this.HandlePesquisa.bind(this)
        this.abreEditaFunc = this.abreEditaFunc.bind(this)
    }
    componentDidMount(): void {
        this.PegaFunc()
    }

    abreEditaFunc(funcParaEditar: funcionarios) {
        this.setState({
            conteudoModal: (
                <CadFunc />
            ),
            modalAberto: true
        })
    }

    async PegaFunc() {
        this.setState({ erro: null })
        try {
            const res = await fetch(`${url}/funcionarios`)

            if (!res.ok) {
                throw new Error(`Erro ao buscar os funcionários cadastrados: ${res.status}`)
            }

            const dados_func: funcionarios[] = await res.json()
            this.setState({
                func: dados_func
            })
        } catch (err) {
            this.setState({
                erro: "Falha ao carregar os dados dos funcionários. " + (err as Error).message,
            });
        }
    }

    HandlePesquisa(texto: string) {
        this.setState({ pesquisa: texto })
    }

    pegaFuncFiltrado(): funcionarios[] {
        const { func, pesquisa } = this.state;

        if (!pesquisa) {
            return func;
        }

        const pesqMinusculo = pesquisa.toLowerCase();

        return func.filter(f => {
            return (
                f.nome.toLowerCase().includes(pesqMinusculo) ||
                f.usuario.toLowerCase().includes(pesqMinusculo) ||
                f.nivel.toLowerCase().includes(pesqMinusculo)
            );
        });
    }

    FormataDadosEtapas() {
        const dados = this.pegaFuncFiltrado();

        return dados.map(func => ({
            ...func,

            // Coluna (editar)
            editar: (
                <button
                    onClick={() => this.abreEditaFunc(func)}
                    className="p-2 bg-[#3a6ea5] text-white rounded text-xs hover:bg-blue-600 transition"
                >
                    Editar ✏️
                </button>
            )
        }));
    }

    render() {
        const { func, erro, modalAberto, conteudoModal } = this.state
        const dadosFiltrados = this.pegaFuncFiltrado();
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
                            <h1 className="text-black font-bold text-4xl font-nunito">Funcionários</h1>
                            <button className="bg-[#3a6ea5] text-white font-nunito font-semibold text-sm p-3 rounded-3xl pl-7 pr-7 border-2 border-[#24679a] cursor-pointer hover:border-[#184e77]">+ Funcionário</button>
                        </section>
                        {erro && (
                            <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                                Erro: {erro}
                            </div>
                        )}
                        {!erro && func.length > 0 && (
                            <section className="w-[90%] m-auto mt-[3%] mb-[5%]">
                                <Tabela
                                    dados={dadosFiltrados}
                                    colunas={this.colunasFuncionarios}>

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