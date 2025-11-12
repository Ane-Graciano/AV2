import { Component } from "react";
import InputLinha from "../components/input";
import SelectLinha from "../components/selectLinha";
import DropBox from "../components/dropBox";



const url = "http://localhost:3000"

type op = {
    value: string
    label: string
    id?: number
}

type op_func = {
    nome: string
    telefone: string
    endereco: string
    usuario: string
    senha: string
    nivel: string
    id?: number
}

type EtapaPayload = {
    nome: string;
    prazo: string;
    statusEtapa: string;
    funcSelecionado: string[];
    aeronaveId?: number | null; // Torna a propriedade conhecida, mas opcional
}

interface PropsEtapa {
    etapaId?: number
    aeronaveId?: number | null
    onCadastroSucesso?: () => void;
}

interface StateEtapa {
    nome: string
    prazo: string
    statusEtapa: string
    funcSelecionado: string[]
    opEtapa: op[]
    opFunc: op[]
    resp: any
}

export default class CadEtapa extends Component<PropsEtapa, StateEtapa> {
    constructor(props: PropsEtapa) {
        super(props),
            this.state = {
                nome: "",
                prazo: "",
                statusEtapa: "",
                funcSelecionado: [],
                opEtapa: [],
                opFunc: [],
                resp: null
            }
        this.Enviar = this.Enviar.bind(this)
        this.handleFuncionarioChange = this.handleFuncionarioChange.bind(this)
        this.PegaStatus = this.PegaStatus.bind(this)
        this.PegaFunc = this.PegaFunc.bind(this)
    }

    componentDidMount(): void {
        this.PegaStatus()
        this.PegaFunc()
        if (this.props.etapaId) {
            this.pegaEtapa();
        } else {
            this.setState({ statusEtapa: "pendente" });
        }
    }

    pegaEtapa = async () => {
        const { etapaId } = this.props;
        try {
            const response = await fetch(`${url}/etapa/${etapaId}`);

            if (!response.ok) {
                throw new Error(`Erro: ${response.status}`);
            }

            const et = await response.json()

            this.setState({
                nome: et.nome,
                prazo: et.prazo,
                statusEtapa: et.statusEtapa,
                funcSelecionado: et.funcSelecionado,
                resp: null
            });
            console.log('etapa:', et)

        } catch (error) {
            this.setState({ resp: "Falha ao carregar dados das etapas, tente novamente mais tarde." });
            console.error("Erro ao carregar as etapas:", error);
        }
    }

    componentDidUpdate(prevProps: PropsEtapa) {
        if (this.props.etapaId !== prevProps.etapaId && this.props.etapaId) {
            this.pegaEtapa();
        }
    }

    async PegaStatus() {
        try {
            const res = await fetch(`${url}/statusEtapa`)
            const { etapaId } = this.props
            const edicao = !!etapaId;

            if (!res.ok) {
                throw new Error(`Erro ao buscar os status das etapas: ${res.status}`)
            }

            const dado_tipo: op[] = await res.json()

            if (!edicao) {
                this.setState({
                    opEtapa: dado_tipo,
                    statusEtapa: "pendente"
                })
            } else {
                this.setState({
                    opEtapa: dado_tipo,
                    statusEtapa: dado_tipo.length > 0 ? dado_tipo[0].value : ""
                })
            }

        } catch (err) {
            this.setState({
                resp: {
                    message: "Erro ao buscar: " + (err as Error).message,
                    type: 'error'
                }
            });
        }
    }

    async PegaFunc() {
        try {
            const res = await fetch(`${url}/funcionarios`)

            if (!res.ok) {
                throw new Error(`Erro ao buscar os funcionários cadastrados: ${res.status}`)
            }

            const dado_bruto: op_func[] = await res.json()

            const opcoesFormatadas: op[] = dado_bruto.map(func => ({
                value: func.nome,
                label: func.nome,
                id: func.id
            }))
            this.setState({
                opFunc: opcoesFormatadas,
                funcSelecionado: this.props.etapaId ? this.state.funcSelecionado : []
            })
        } catch (err) {
            this.setState({
                resp: {
                    message: "Erro ao buscar: " + (err as Error).message,
                    type: 'error'
                }
            });
        }
    }

    handleFuncionarioChange(values: string[]) {
        this.setState({ funcSelecionado: values });
        console.log("Funcionários Selecionados:", values);
    }

    Inputs = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        this.setState((prevState) => ({
            ...prevState,
            [name as keyof StateEtapa]: value
        }) as Pick<StateEtapa, keyof StateEtapa>)

        this.setState({ resp: null });
    }

    Cancelar = () => {
        this.setState({
            resp: null
        });
        this.pegaEtapa();
    }

    async Enviar(e: React.FormEvent) {
        e.preventDefault();

        const { nome, prazo, statusEtapa, funcSelecionado } = this.state
        const { etapaId, aeronaveId } = this.props

        const edicao = !!etapaId;
        const edit_cad = edicao ? `${url}/etapa/${etapaId}` : `${url}/etapa`;
        const metodo = edicao ? 'PUT' : 'POST';

        const novaEtapa: EtapaPayload = {
            nome,
            prazo,
            statusEtapa,
            funcSelecionado
        }
        if (!edicao && aeronaveId !== null && aeronaveId !== undefined) {
            novaEtapa.aeronaveId = aeronaveId;
        }

        try {
            const response = await fetch(edit_cad, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novaEtapa)
            });

            if (!response.ok) {
                throw new Error(`Erro no ${edicao ? 'edição' : 'cadastro'} Status: ${response.status}`)
            }

            if (!edicao) {
                this.setState({
                    nome: "",
                    prazo: "",
                    statusEtapa: "pendente",
                    funcSelecionado: [],
                    resp: {
                        message: "Etapa cadastrado com sucesso!",
                        type: 'success'
                    }
                })
            } else {
                this.setState({
                    resp: {
                        message: "Etapa atualizado com sucesso!",
                        type: 'success'
                    }
                })
            }
        } catch (error) {
            console.error('Falha no POST:', error);
            this.setState({
                resp: {
                    message: "Erro ao cadastrar: " + (error as Error).message,
                    type: 'error'
                }
            });
        }
    }
    render() {
        const { nome, prazo, statusEtapa, opEtapa, funcSelecionado, opFunc, resp } = this.state
        const edicao = !!this.props.etapaId

        return (
            <>
                <section className="w-full h-full flex justify-center items-center">
                    <section className="w-full flex flex-col justify-center items-center p-3">
                        <h1 className="text-[#3a6ea5] font-medium text-2xl md:font-bold md:text-3xl lg:font-bold lg:text-4xl text-center mb-[7%]">{`${!edicao ? 'Cadastrar Etapa' : 'Editar Etapa'} `}</h1>
                        {resp && (
                            <div className={`p-2 my-3 font-semibold ${resp.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {resp.message}
                            </div>
                        )}
                        <form onSubmit={this.Enviar} className="flex flex-col space-y-5">
                            <InputLinha
                                type="text"
                                name="nome"
                                value={nome}
                                htmlfor="nome"
                                placeholder=""
                                onChange={this.Inputs}
                                required
                                classNameInput="w-full sm:w-[300px] md:w-[400px] lg:w-[500px]"
                            >
                                Nome
                            </InputLinha>
                            <InputLinha
                                type="text"
                                name="prazo"
                                value={prazo}
                                htmlfor="prazo"
                                placeholder=""
                                onChange={this.Inputs}
                                required
                                classNameInput="w-full sm:w-[300px] md:w-[400px] lg:w-[500px]"
                            >
                                Prazo
                            </InputLinha>
                            <SelectLinha
                                name="statusEtapa"
                                value={statusEtapa}
                                label="Status da etapa"
                                opcoes={opEtapa}
                                onChange={this.Inputs}
                                required
                                classNameSelect="w-full sm:w-[300px] md:w-[400px] lg:w-[500px]"
                                disabled={!edicao ? true : false}
                            />
                            <DropBox
                                name="Funcionarios"
                                value={funcSelecionado}
                                label="Funcionários Responsáveis"
                                opcoes={opFunc}
                                required
                                onChange={this.handleFuncionarioChange}
                            />
                            <section className="col-span-2 flex flex-row-reverse justify-center gap-x-8 p-2 mt-5">
                                <button id="botao-cad" className="w-[40%] p-1 md:p-2 lg:p-3 bg-[#3a6ea5] rounded-[20px] text-white font-medium text-sm md:font-semibold md:text-lg cursor-pointer border-2 border-transparent transition duration-250 hover:border-[#184e77]">
                                    Enviar
                                </button>
                                {edicao && (
                                    <button
                                        type="button"
                                        onClick={this.Cancelar}
                                        className="w-[40%] p-1 md:p-2 lg:p-3 bg-[#3a6ea59b] rounded-[20px] text-white font-medium text-sm md:font-semibold md:text-lg cursor-pointer border-2 border-transparent transition duration-250 hover:bg-[#184e77] hover:border-[#3a6ea59b] focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-offset-2"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </section>
                        </form>
                    </section>
                </section>
            </>
        )
    }
}