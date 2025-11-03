import { Component } from "react";
import InputLinha from "../components/input";
import SelectLinha from "../components/selectLinha";

const url = "http://localhost:3000"

type op_tipo = {
    value: string
    label: string
    id?: number
}

type op_status = {
    value: string
    label: string
    id?: number
}

interface PropsPeca { }

interface StatePeca {
    nome: string
    tipo: string
    fornecedor: string
    status: string
    opTipo: op_tipo[]
    opStatus: op_status[]
    resp: any
}

export default class CadPeca extends Component<PropsPeca, StatePeca> {
    constructor(props: PropsPeca) {
        super(props),
            this.state = {
                nome: "",
                tipo: "",
                fornecedor: "",
                status: "",
                opTipo: [],
                opStatus: [],
                resp: null
            }
        this.Enviar = this.Enviar.bind(this)
        this.PegaStatus = this.PegaStatus.bind(this)
        this.PegaTipo = this.PegaTipo.bind(this)
    }

    componentDidMount(): void {
        this.PegaStatus()
        this.PegaTipo()
    }

    async PegaTipo() {
        try {
            const res = await fetch(`${url}/tipoPeca`)

            if (!res.ok) {
                throw new Error(`Erro ao buscar os tipos de peça: ${res.status}`)
            }

            const dado_tipo: op_tipo[] = await res.json()
            this.setState({
                opTipo: dado_tipo,
                tipo: dado_tipo.length > 0 ? dado_tipo[0].value : ""
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

    async PegaStatus() {
        try {
            const res = await fetch(`${url}/statusPeca`)

            if (!res.ok) {
                throw new Error(`Erro ao buscar os status das peça: ${res.status}`)
            }

            const dado_status: op_status[] = await res.json()
            this.setState({
                opStatus: dado_status,
                status: "emProducao"
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
    Inputs = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        this.setState((prevState) => ({
            ...prevState,
            [name as keyof StatePeca]: value
        }) as Pick<StatePeca, keyof StatePeca>)

        this.setState({ resp: null });
    }

    async Enviar(e: React.FormEvent) {
        e.preventDefault();

        const { nome, tipo, fornecedor, status } = this.state

        const novaPeca = {
            nome,
            tipo,
            fornecedor,
            status
        };

        try {
            const response = await fetch(`${url}/pecas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novaPeca)
            });

            if (!response.ok) {
                throw new Error(`Erro no cadastro! Status: ${response.status}`);
            }

            this.setState({
                nome: "",
                tipo: this.state.opTipo.length > 0 ? this.state.opTipo[0].value : "",
                fornecedor: "",
                status: "emProducao",
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
        const { nome, tipo, fornecedor, status, opTipo, opStatus, resp } = this.state
        return (
            <>
                <section className="w-full h-full flex justify-center items-center">
                    <section className="w-[80%] flex flex-col justify-center items-center p-5">
                        <h1 className="text-[#3a6ea5] font-bold text-4xl text-center mb-[7%]">Cadastro das Peças</h1>
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
                            <SelectLinha
                                name="tipo"
                                value={tipo}
                                label="Tipo da Peça"
                                opcoes={opTipo}
                                onChange={this.Inputs}
                                required
                                classNameSelect="w-[500px]"
                            />
                            <InputLinha
                                type="text"
                                value={fornecedor}
                                name="fornecedor"
                                htmlfor="fornecedor"
                                placeholder=""
                                onChange={this.Inputs}
                                required
                                classNameInput="w-[500px]"
                            >
                                Fornecedor
                            </InputLinha>
                            <SelectLinha
                                name="status"
                                value={status}
                                label="Status da Peça"
                                onChange={this.Inputs}
                                opcoes={opStatus}
                                required
                                classNameSelect="w-[500px]"
                                disabled={true}
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