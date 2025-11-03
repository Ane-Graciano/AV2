import { Component } from "react";
import Tabela, { type Coluna } from "../components/tabela";
import BarraPesquisa from "../components/barraPesquisa";
import NavBar from "../components/navbar";


const url = "http://localhost:3000"


type pecas = {
    nome: string
    tipo: string
    fornecedor: string
    status: string
    id?: number
}


interface PropsPeca { }

interface StatePeca {
    peca: pecas[]
    pesquisa: string
    erro: string | null
}

export default class VisPeca extends Component<PropsPeca, StatePeca> {
    private readonly colunasPecas: Coluna[] = [
        { header: "Nome", accessor: "nome" },
        { header: "Tipo", accessor: "tipo" },
        { header: "Fornecedor", accessor: "fornecedor" },
        { header: "Status Atual", accessor: "status" },
        { header: "Atualizar Status", accessor: "novoStatus" },
        { header: "Editar", accessor: "editar" }
    ];

    constructor(props: PropsPeca) {
        super(props),
            this.state = {
                peca: [],
                pesquisa: "",
                erro: null
            }
        this.PegaPecas = this.PegaPecas.bind(this)
        this.HandlePesquisa = this.HandlePesquisa.bind(this)
    }
    componentDidMount(): void {
        this.PegaPecas()
    }

    async PegaPecas() {
        this.setState({ erro: null })
        try {
            const res = await fetch(`${url}/pecas`)

            if (!res.ok) {
                throw new Error(`Erro ao buscar as peças cadastrados: ${res.status}`)
            }

            const dados_pecas: pecas[] = await res.json()
            this.setState({
                peca: dados_pecas
            })
        } catch (err) {
            this.setState({
                erro: "Falha ao carregar os dados das peças. " + (err as Error).message,
            });
        }
    }

    HandlePesquisa(texto: string) {
        this.setState({ pesquisa: texto })
    }

    PegaPecasFiltradas(): pecas[] {
        const { peca, pesquisa } = this.state;

        if (!pesquisa) {
            return peca;
        }

        const pesqMinusculo = pesquisa.toLowerCase();

        return peca.filter(p => {
            return (
                p.nome.toLowerCase().includes(pesqMinusculo) ||
                p.status.toLowerCase().includes(pesqMinusculo) ||
                p.tipo.toLowerCase().includes(pesqMinusculo) ||
                p.fornecedor.toLowerCase().includes(pesqMinusculo)
            );
        });
    }

    render() {
        const { peca, erro } = this.state
        const dadosFiltrados = this.PegaPecasFiltradas();
        return (
            <>
                <section className="w-screen h-screen grid grid-cols-[5%_95%]  overflow-x-hidden">
                    <section>
                        <NavBar/>
                    </section>
                    <section className="">
                        <section className="mt-[3%] ml-[5%]">
                            <BarraPesquisa
                                onPesquisa={this.HandlePesquisa}
                                placeholder="Buscar por nome, usuáario ou nível..."
                            />
                        </section>
                        <section className="flex justify-between w-[90%] m-auto mt-[3%] overflow-y-auto">
                            <h1 className="text-black font-bold text-4xl font-nunito">Peças</h1>
                            <button className="bg-[#3a6ea5] text-white font-nunito font-semibold text-sm p-3 rounded-3xl pl-10 pr-10 border-2 border-[#24679a] cursor-pointer hover:border-[#184e77]">+ Peças</button>
                        </section>
                        {erro && (
                            <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                                Erro: {erro}
                            </div>
                        )}
                        {!erro && peca.length > 0 && (
                            <section className="w-[90%] m-auto mt-[3%] mb-[5%]">
                                <Tabela
                                    dados={dadosFiltrados}
                                    colunas={this.colunasPecas}>

                                </Tabela>
                            </section>
                        )}
                    </section>
                </section>
            </>
        )
    }
}