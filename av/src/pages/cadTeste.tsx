import { Component } from "react";
import InputLinha from "../components/input";
import SelectLinha from "../components/selectLinha";


const url = "http://localhost:3000"

type op_aeronave = {
    modelo: string
    tipo: string
    capacidade: number
    alcance: number
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

type op = {
    value: string
    label: string
    id?: number
}

interface PropsTeste { }

interface StateTeste {
    aeronave: string
    tipoTeste: string
    resultado: string
    data: string
    obs: string
    funcResp: string
    opAeronave: op[]
    opTeste: op[]
    opResult: op[]
    opFunc: op[]
    resp: any
}



export default class CadTeste extends Component<PropsTeste, StateTeste> {
    constructor(props: PropsTeste) {
        super(props),
            this.state = {
                aeronave: "",
                tipoTeste: "",
                resultado: "",
                data: "",
                obs: "",
                funcResp: "",
                opAeronave: [],
                opTeste: [],
                opResult: [],
                opFunc: [],
                resp: null
            }
        this.Enviar = this.Enviar.bind(this)
        this.PegaTipoTeste = this.PegaTipoTeste.bind(this)
        this.PegaAeronave = this.PegaAeronave.bind(this)
        this.PegaResultado = this.PegaResultado.bind(this)
        this.PegaFunc = this.PegaFunc.bind(this)
    }

    componentDidMount(): void {
        this.PegaTipoTeste()
        this.PegaAeronave()
        this.PegaResultado()
        this.PegaFunc()
    }

    async PegaTipoTeste() {
        try {
            const res = await fetch(`${url}/tipoTeste`)

            if (!res.ok) {
                throw new Error(`Erro ao buscar os tipos de teste: ${res.status}`)
            }

            const dado_tipo: op[] = await res.json()
            this.setState({
                opTeste: dado_tipo,
                tipoTeste: dado_tipo.length > 0 ? dado_tipo[0].value : ""
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

    async PegaAeronave() {
        try {
            const res = await fetch(`${url}/aeronave`)

            if (!res.ok) {
                throw new Error(`Erro ao buscar os aeronaves cadastrads: ${res.status}`)
            }
            const dado_bruto: op_aeronave[] = await res.json()

            const opcoesFormatadas: op[] = dado_bruto.map(aeronave => ({
                value: aeronave.modelo,
                label: `${aeronave.modelo} (${aeronave.tipo})`,
                id: aeronave.id
            }));

            this.setState({
                opAeronave: opcoesFormatadas,
                aeronave: opcoesFormatadas.length > 0 ? opcoesFormatadas[0].value : ""
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

    async PegaResultado() {
        try {
            const res = await fetch(`${url}/resultadoTeste`)

            if (!res.ok) {
                throw new Error(`Erro ao buscar os tipos de resultado dos teste: ${res.status}`)
            }

            const dado_tipo: op[] = await res.json()
            this.setState({
                opResult: dado_tipo,
                resultado: dado_tipo.length > 0 ? dado_tipo[0].value : ""
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
                label: `${func.nome} (${func.nivel})`,
                id: func.id
            }));

            this.setState({
                opFunc: opcoesFormatadas,
                funcResp: opcoesFormatadas.length > 0 ? opcoesFormatadas[0].value : ""
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
            [name as keyof StateTeste]: value
        }) as Pick<StateTeste, keyof StateTeste>)

        this.setState({ resp: null });
    }

    async Enviar(e: React.FormEvent) {
        e.preventDefault();

        const { aeronave, tipoTeste, resultado, data, obs, funcResp } = this.state

        const novoTeste = {
            aeronave,
            tipoTeste,
            resultado,
            data,
            obs,
            funcResp
        };

        try {
            const response = await fetch(`${url}/testes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoTeste)
            });

            if (!response.ok) {
                throw new Error(`Erro no cadastro! Status: ${response.status}`);
            }

            this.setState({
                aeronave: this.state.opAeronave.length > 0 ? this.state.opAeronave[0].value : "",
                tipoTeste: this.state.opTeste.length > 0 ? this.state.opTeste[0].value : "",
                resultado: this.state.opResult.length > 0 ? this.state.opResult[0].value : "",
                data: "",
                obs: "",
                funcResp: this.state.opFunc.length > 0 ? this.state.opFunc[0].value : "",
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
        const { aeronave, tipoTeste, resultado, data, obs, funcResp, opAeronave, opFunc, opResult, opTeste, resp } = this.state
        return (
            <>
                <section className="w-full h-full flex justify-center items-center">
                    <section className=" flex flex-col justify-center items-center p-5">
                        <h1 className="text-[#3a6ea5] font-bold text-4xl text-center mb-[9%]">Cadastro de Teste</h1>
                        {resp && (
                            <div className={`p-2 my-3 font-semibold ${resp.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {resp.message}
                            </div>
                        )}
                        <form onSubmit={this.Enviar} className="grid grid-cols-2 gap-x-15 gap-y-7 ">
                            <SelectLinha
                                name="aeronave"
                                value={aeronave}
                                label="Aeronave do Teste"
                                opcoes={opAeronave}
                                onChange={this.Inputs}
                                required
                            />
                            <SelectLinha
                                name="tipoTeste"
                                value={tipoTeste}
                                label="Tipo de Teste"
                                opcoes={opTeste}
                                onChange={this.Inputs}
                                required
                            />
                            <SelectLinha
                                name="resultado"
                                value={resultado}
                                label="Ressultado do Teste"
                                opcoes={opResult}
                                onChange={this.Inputs}
                                required
                            />
                            <InputLinha
                                type="date"
                                value={data}
                                name="data"
                                htmlfor="dataTeste"
                                placeholder=""
                                onChange={this.Inputs}
                                required
                            >
                                data do Teste
                            </InputLinha>
                            <InputLinha
                                type="text"
                                name="obs"
                                value={obs}
                                htmlfor="obs"
                                placeholder=""
                                onChange={this.Inputs}
                                required
                            >
                                Observação
                            </InputLinha>
                            <SelectLinha
                                name="funcResp"
                                value={funcResp}
                                label="Funcionario Responsável"
                                opcoes={opFunc}
                                onChange={this.Inputs}
                                required
                            />
                            <section className="col-span-2 flex justify-center p-2 mt-5">
                                <button id="botao-cad" className="w-[40%] p-3 bg-[#3a6ea5] rounded-[20px] text-white font-semibold text-lg cursor-pointer border-2 border-transparent transition duration-250 hover:border-[#184e77]">
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