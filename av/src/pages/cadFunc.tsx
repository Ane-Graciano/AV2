import { Component } from "react";
import InputLinha from "../components/input";
import SelectLinha from "../components/selectLinha";
import InputMask from "../components/inputMask";



// api fake rota
const url = "http://localhost:3000"

type op_nivelAcesso = {
    value: string
    label: string
    id?: number
}

interface PropsFunc { }

interface StateFunc {
    nome: string
    telefone: string
    endereco: string
    usuario: string
    senha: string
    nivel: string
    resp: any
    opNivel: op_nivelAcesso[]
}


export default class CadFunc extends Component<PropsFunc, StateFunc> {
    constructor(props: PropsFunc) {
        super(props)
        this.state = {
            nome: "",
            telefone: "",
            endereco: "",
            usuario: "",
            senha: "",
            nivel: "",
            resp: null,
            opNivel: []
        }
        this.Enviar = this.Enviar.bind(this)
        this.PegaNivel = this.PegaNivel.bind(this)
    }

    componentDidMount(): void {
        this.PegaNivel();
    }

    async PegaNivel() {
        try {
            const respost = await fetch(`${url}/nivelAcesso`)

            if (!respost.ok) {
                console.log('erro')
                throw new Error(`Erro ao buscar níveis de acsso! Status: ${respost.status}`);

            }

            const dado: op_nivelAcesso[] = await respost.json()

            this.setState({
                opNivel: dado,
                nivel: dado.length > 0 ? dado[0].value : ""
            })
        } catch (error) {
            this.setState({
                resp: {
                    message: "Erro ao cadastrar: " + (error as Error).message,
                    type: 'error'
                }
            });
        }
    }


    Inputs = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        this.setState((prevState) => ({
            ...prevState,
            [name as keyof StateFunc]: value
        }) as Pick<StateFunc, keyof StateFunc>)

        this.setState({ resp: null });
    }


    async Enviar(e: React.FormEvent) {
        e.preventDefault();

        const { nome, telefone, endereco, usuario, senha, nivel } = this.state;

        const novoFuncionario = {
            nome,
            telefone,
            endereco,
            usuario,
            senha,
            nivel,
        };

        try {
            const response = await fetch(`${url}/funcionarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoFuncionario)
            });

            if (!response.ok) {
                throw new Error(`Erro no cadastro! Status: ${response.status}`);
            }

            // const data = await response.json();

            this.setState({
                nome: "",
                telefone: "",
                endereco: "",
                usuario: "",
                senha: "",
                nivel: this.state.opNivel.length > 0 ? this.state.opNivel[0].value : "",
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
        const { nome, telefone, endereco, usuario, senha, nivel, resp, opNivel } = this.state;
        return (
            <>
                <section className="w-full h-full flex justify-center items-center">
                    <section className=" flex flex-col justify-center items-center p-5">
                        <h1 className="text-[#3a6ea5] font-bold text-4xl text-center mb-[9%]">Cadastro de Funcionários</h1>

                        {resp && (
                            <div className={`p-2 my-3 font-semibold ${resp.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {resp.message}
                            </div>
                        )}
                        <form onSubmit={this.Enviar} className="grid grid-cols-2 gap-x-15 gap-y-7 ">
                            <InputLinha
                                type="text"
                                name="nome"
                                value={nome}
                                htmlfor="nome"
                                placeholder=""
                                required
                                onChange={this.Inputs}
                            >
                                Nome
                            </InputLinha>
                            <InputMask
                                label="Telefone"
                                name="telefone"
                                value={telefone}
                                htmlor="telefone"
                                id="telefone"
                                mask="(00) 00000-0000"
                                placeholder=""
                                required
                                maxLength={15}
                                onChange={this.Inputs}
                            />
                            <InputLinha
                                type="text"
                                name="endereco"
                                value={endereco}
                                htmlfor="endereco"
                                placeholder=""
                                required
                                onChange={this.Inputs}
                            >
                                Endereço
                            </InputLinha>
                            <InputLinha
                                type="text"
                                name="usuario"
                                value={usuario}
                                htmlfor="usuario"
                                placeholder=""
                                onChange={this.Inputs}
                                required
                            >
                                Usuário
                            </InputLinha>
                            <InputLinha
                                type="password"
                                name="senha"
                                value={senha}
                                htmlfor="senha"
                                placeholder=""
                                required
                                onChange={this.Inputs}
                            >
                                Senha
                            </InputLinha>
                            <SelectLinha
                                name="nivel"
                                value={nivel}
                                label="Nível de Acesso"
                                opcoes={opNivel}
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