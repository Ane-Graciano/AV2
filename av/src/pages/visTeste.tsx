import { Component } from "react";
import Tabela, { type Coluna } from "../components/tabela";
import BarraPesquisa from "../components/barraPesquisa";
import NavBar from "../components/navbar";


const url = "http://localhost:3000"

type teste = {
    aeronave: string
    tipoTeste: string
    resultado: string
    data: string
    obs: string
    funcResp: string
    id?: number
}

interface PropsTeste { }

interface StateTeste {
    testes: teste[]
    pesquisa: string
    erro: string | null
}

export default class VisTeste extends Component<PropsTeste, StateTeste> {
    private readonly colunasTestes: Coluna[] = [
        { header: "Aeronave", accessor: "aeronave" },
        { header: "Tipo de Teste", accessor: "tipoTeste" },
        { header: "Resultado", accessor: "resultado" },
        { header: "Data", accessor: "data" },
        { header: "Observação", accessor: "obs" },
        { header: "Funcionário Responsável", accessor: "funcResp" }
    ];

    constructor(props: PropsTeste) {
        super(props),
            this.state = {
                testes: [],
                pesquisa: "",
                erro: null
            }
        this.PegaTeste = this.PegaTeste.bind(this)
        this.HandlePesquisa = this.HandlePesquisa.bind(this)
    }
    componentDidMount(): void {
        this.PegaTeste()
    }

    async PegaTeste() {
        this.setState({ erro: null })
        try {
            const res = await fetch(`${url}/testes`)

            if (!res.ok) {
                throw new Error(`Erro ao buscar os testes cadastrados: ${res.status}`)
            }

            const dados_teste: teste[] = await res.json()
            this.setState({
                testes: dados_teste
            })
        } catch (err) {
            this.setState({
                erro: "Falha ao carregar os dados dos testes. " + (err as Error).message,
            });
        }
    }

    HandlePesquisa(texto: string) {
        this.setState({ pesquisa: texto })
    }

    PegaTesteFiltradas(): teste[] {
        const { testes, pesquisa } = this.state;

        if (!pesquisa) {
            return testes;
        }

        const pesqMinusculo = pesquisa.toLowerCase();

        return testes.filter(t => {
            return (
                t.aeronave.toLowerCase().includes(pesqMinusculo) ||
                t.tipoTeste.toLowerCase().includes(pesqMinusculo) ||
                t.resultado.toLowerCase().includes(pesqMinusculo) ||
                t.funcResp.toLowerCase().includes(pesqMinusculo) ||
                t.data.toLowerCase().includes(pesqMinusculo)
            );
        });
    }

    render() {
        const { testes, erro } = this.state
        const dadosFiltrados = this.PegaTesteFiltradas();
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
                            <h1 className="text-black font-bold text-4xl font-nunito">Testes</h1>
                            <button className="bg-[#3a6ea5] text-white font-nunito font-semibold text-sm p-3 rounded-3xl pl-10 pr-10 border-2 border-[#24679a] cursor-pointer hover:border-[#184e77]">+ Testes</button>
                        </section>
                        {erro && (
                            <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                                Erro: {erro}
                            </div>
                        )}
                        {!erro && testes.length > 0 && (
                            <section className="w-[90%] m-auto mt-[3%] mb-[5%]">
                                <Tabela
                                    dados={dadosFiltrados}
                                    colunas={this.colunasTestes}>
                                </Tabela>
                            </section>
                        )}
                    </section>
                </section>
            </>
        )
    }
}