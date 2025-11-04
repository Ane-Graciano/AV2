import { Component } from "react";
// Assumindo que InputLinha e imgLogin estão no caminho correto
import InputLinha from "../components/input";
import imgLogin from "../assets/imgLogin.png"

interface StateLogin {
    usuario: string;
    senha: string;
    erro: string;
}

const url = 'http://localhost:3000';
const nivel = 'userNivelAcesso'

export default class Login extends Component<{}, StateLogin> {
    constructor(props: {}) {
        super(props);
        this.state = {
            usuario: '',
            senha: '',
            erro: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        this.setState({ [name]: value } as Pick<StateLogin, 'usuario' | 'senha'>);
    }

    async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const { usuario, senha } = this.state;
        const rotaHome = '/home';

        try {
            const response = await fetch(`${url}/funcionarios?usuario=${usuario}`);
            
            if (!response.ok) {
                throw new Error('Erro na comunicação com a API.');
            }

            const funcionarios = await response.json();
            
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
                <section className="w-screen h-screen grid grid-cols-[40%_60%]">
                    <section>
                        <img src={imgLogin} alt="imagem avião" className="w-full h-full" />
                    </section>
                    <section>
                        <form onSubmit={this.handleSubmit} className="bg-gray-100 w-full h-full flex flex-col justify-center items-center">
                            <h1 className="text-[#135b78] font-bold text-3xl mb-8">Seja Bem Vindo ao Aerocode</h1>
                            <section className="bg-white rounded-4xl p-5 w-[70%] h-[60%] flex flex-col justify-center items-center space-y-4">
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