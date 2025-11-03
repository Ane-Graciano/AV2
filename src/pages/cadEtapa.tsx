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


interface PropsEtapa { }

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
    }

    async PegaStatus(){
        try {
            const res = await fetch(`${url}/statusEtapa`)

            if (!res.ok) {
                throw new Error(`Erro ao buscar os status das etapas: ${res.status}`)
            }

            const dado_tipo: op[] = await res.json()
            this.setState({
                opEtapa: dado_tipo,
                statusEtapa: "pendente"
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
            }));

            this.setState({
                opFunc: opcoesFormatadas,
                funcSelecionado: []
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

     async Enviar(e: React.FormEvent) {
        e.preventDefault();

        const {nome, prazo, statusEtapa, funcSelecionado } = this.state

        const novaEtapa = {
            nome,
            prazo,
            statusEtapa,
            funcSelecionado
        };

        try {
            const response = await fetch(`${url}/etapa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novaEtapa)
            });

            if (!response.ok) {
                throw new Error(`Erro no cadastro! Status: ${response.status}`);
            }

            this.setState({
                nome: "",
                prazo: "",
                statusEtapa: "pendente",
                funcSelecionado: [],
                resp: {
                    message: "Funcionário cadastrado com sucesso!",
                    type: 'success'
                }
            });
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
        const {nome, prazo, statusEtapa, opEtapa, funcSelecionado, opFunc, resp} = this.state
        return (
            <>
                <section className="w-full h-full flex justify-center items-center">
                    <section className="w-[80%] flex flex-col justify-center items-center p-5">
                        <h1 className="text-[#3a6ea5] font-bold text-4xl text-center mb-[7%]">Cadastro de Etapas</h1>
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
                                classNameInput="w-[500px]"
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
                                classNameInput="w-[500px]"
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
                                classNameSelect="w-[500px]"
                                disabled={true}
                            />
                            <DropBox
                                name="Funcionarios"
                                value={funcSelecionado}
                                label="Funcionários Responsáveis"
                                opcoes={opFunc}
                                required
                                onChange={this.handleFuncionarioChange} 
                            />
                            <section className="col-span-2 flex justify-center p-2 mt-5">
                                <button id="botao-cad" className="w-[50%] p-3 bg-[#3a6ea5] rounded-[20px] text-white font-semibold text-lg cursor-pointer border-2 border-transparent transition duration-250 hover:border-[#184e77]">
                                    Enviar
                                </button>
                            </section>
                        </form>
                    </section>
                </section>
            </>
        )
    }
}