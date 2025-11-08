import { Component } from "react";
import InputLinha from "../components/input";
import imgLogin from "../assets/imgLogin.png"

interface PropsLogin{}

interface StateLogin {
    usuario: string;
    senha: string;
    erro: string;
}

const url = 'http://localhost:3000';
const nivel = 'userNivelAcesso'

export default class Login extends Component<PropsLogin, StateLogin> {
    constructor(props: PropsLogin) {
        super(props);
        this.state = {
            usuario: '',
            senha: '',
            erro: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.Enviar = this.Enviar.bind(this);
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        this.setState({ [name]: value } as Pick<StateLogin, 'usuario' | 'senha'>)
    }

    async Enviar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const { usuario, senha } = this.state
        const rotaHome = '/home';

        try {
            const resp = await fetch(`${url}/funcionarios?usuario=${usuario}`);
            
            if (!resp.ok) {
                throw new Error('Erro na comunicação com a API.');
            }

            const funcionarios = await resp.json();
            
            if (funcionarios.length > 0 && funcionarios[0].senha === senha) {
                this.setState({ erro: '' }); 
                const nivelUsuario = funcionarios[0].nivel;
                localStorage.setItem(nivel, nivelUsuario); 
                
                window.location.href = rotaHome;
            } else {
                this.setState({ erro: 'Usuário ou senha inválidos. Tente novamente.' });
            }
        } catch (error) {
            console.error("Erro no login:", error);
            this.setState({ erro: 'Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.' });
        }
    }

    render() {
        const { erro, usuario, senha } = this.state;
        return (
            <>
                <section style={{backgroundImage: `url("${imgLogin}")`, backgroundSize: 'cover',backgroundPosition: 'center',backgroundRepeat: 'no-repeat'}} className="w-screen h-screen sm:h-[80vh] md:h-screen" >
                    {/* <section className="w-screen h-screen">
                        <img src={imgLogin} alt="imagem avião" className="w-full h-full" />
                    </section> */}
                    <section className="flex flex-col justify-center items-center h-full">
                        <form onSubmit={this.Enviar} className="sm:w-[60%] sm:h-[90%] sm:p-5 md:w-[50%] md:h-[80%] md:p-4 lg:w-[40%] lg:h-[70%] lg:p-3 flex flex-col justify-center items-center m-auto bg-transparent backdrop-blur rounded-4xl shadow-2xl">
                            <h1 className="text-[#135b78] sm:font-medium sm:text-xl md:font-semibold md:text-2xl lg:font-bold lg:text-3xl mb-8">Seja Bem Vindo ao Aerocode</h1>
                            <section className="rounded-4xl p-5 w-[70%] h-[60%] flex flex-col justify-center items-center space-y-4">
                                {erro && (
                                    <p className="text-red-600 text-sm font-semibold p-2 border border-red-300 bg-red-50 rounded w-full text-center">
                                        {erro}
                                    </p>
                                )}
                                <InputLinha 
                                    type="text" 
                                    name="usuario" 
                                    placeholder="" 
                                    onChange={this.handleChange} 
                                    value={usuario}
                                >
                                    Usuário
                                </InputLinha>
                                <InputLinha 
                                    type="password" 
                                    name="senha" 
                                    placeholder="" 
                                    onChange={this.handleChange} 
                                    value={senha} 
                                >
                                    Senha
                                </InputLinha>
                                <button type="submit" className="w-[50%] mt-[10%] p-3 bg-[#3a6ea5] rounded-[20px] text-white font-semibold text-lg cursor-pointer border-2 border-transparent transition duration-250 hover:border-[#184e77]">Entrar</button>
                            </section>
                        </form>
                    </section>
                </section>
            </>
        )
    }
}