import { Component } from "react";
import InputLinha from "../components/input";
import SelectLinha from "../components/selectLinha";



const url = "http://localhost:3000"

type op_tipo = {
    value: string
    label: string
    id?: number
}


interface PropsAero { }

interface StateAero {
    modelo: string
    tipo: string
    capacidade: number
    alcance: number
    opTipo: op_tipo[]
    resp: any
}


export default class CadAeronave extends Component<PropsAero, StateAero> {
    constructor(props: PropsAero) {
        super(props),
            this.state = {
                modelo: "",
                tipo: "",
                capacidade: 0,
                alcance: 0,
                opTipo: [],
                resp: null
            }
        this.Enviar = this.Enviar.bind(this)
        this.PegaTipo = this.PegaTipo.bind(this)
    }

    componentDidMount(): void {
        this.PegaTipo()
    }

    async PegaTipo() {
        try {
            const res = await fetch(`${url}/tipoAeronave`)

            if (!res.ok) {
                throw new Error(`Erro ao buscar os tipos de aeronave: ${res.status}`)
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

    Inputs = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        this.setState((prevState) => ({
            ...prevState,
            [name as keyof StateAero]: value
        }) as Pick<StateAero, keyof StateAero>)

        this.setState({ resp: null });
    }

    async Enviar(e: React.FormEvent) {
        e.preventDefault();

        const { modelo, tipo, capacidade, alcance } = this.state

        const novaPeca = {
            modelo,
            tipo,
            capacidade,
            alcance
        };

        try {
            const response = await fetch(`${url}/aeronave`, {
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
                modelo: "",
                tipo: this.state.opTipo.length > 0 ? this.state.opTipo[0].value : "",
                capacidade: 0,
                alcance: 0,
                resp: {
                    message: "Aeronave cadastrado com sucesso!",
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
        const { modelo, tipo, opTipo, resp } = this.state
        return (
            <>
                <section className="w-full h-full flex justify-center items-center">
                    <section className="w-[80%] flex flex-col justify-center items-center p-5">
                        <h1 className="text-[#3a6ea5] font-bold text-4xl text-center mb-[7%]">Cadastro de Aeronave</h1>
                        {resp && (
                            <div className={`p-2 my-3 font-semibold ${resp.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {resp.message}
                            </div>
                        )}
                        <form onSubmit={this.Enviar} className="flex flex-col space-y-5">
                            <InputLinha
                                type="text"
                                name="modelo"
                                value={modelo}
                                htmlfor="modelo"
                                placeholder=""
                                onChange={this.Inputs}
                                required
                                classNameInput="w-[500px]"
                            >
                                Modelo
                            </InputLinha>
                            <SelectLinha
                                name="Tipo"
                                value={tipo}
                                label="Tipo de Aeronave"
                                opcoes={opTipo}
                                onChange={this.Inputs}
                                required
                                classNameSelect="w-[500px]"
                            />
                            <InputLinha
                                type="number"
                                name="alcance"
                                htmlfor="alcance"
                                placeholder=""
                                onChange={this.Inputs}
                                required
                                classNameInput="w-[500px]"
                            >
                                Alcance
                            </InputLinha>
                            <InputLinha
                                type="number"
                                name="capacidade"
                                htmlfor="capacidade"
                                placeholder=""
                                onChange={this.Inputs}
                                required
                                classNameInput="w-[500px]"
                            >
                                Capacidade
                            </InputLinha>
                            <section className="col-span-2 flex justify-center p-2 mt-5">
                                <button className="w-[50%] p-3 bg-[#3a6ea5] rounded-[20px] text-white font-semibold text-lg cursor-pointer border-2 border-transparent transition duration-250 hover:border-[#184e77]">
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