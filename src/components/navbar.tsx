import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { TiHomeOutline } from "react-icons/ti";
import { FaPlaneDeparture } from "react-icons/fa6";
import { IoAirplaneOutline } from "react-icons/io5";
import { BsPersonAdd } from "react-icons/bs";
import { BsListCheck } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Modal from "./modal";
import CadFunc from "../pages/cadFunc";
import CadEtapa from "../pages/cadEtapa";
import CadPeca from "../pages/cadPeca";
import CadAeronave from "../pages/cadAeronave";
import CadTeste from "../pages/cadTeste";
import VisAeronave from "../pages/visAeronave";
import VisEtapa from "../pages/visEtapa";
import VisPeca from "../pages/visPeca";
import VisFunc from "../pages/visFunc";


interface NavBarProps {
    nivel: string
}

interface NavBarState {
    navAberta: boolean
    modalAberto: boolean
    conteudoModal: React.ReactNode
}


export default class NavBar extends Component<NavBarProps, NavBarState> {
    constructor(props: NavBarProps) {
        super(props)
        this.state = {
            navAberta: false,
            modalAberto: false,
            conteudoModal: null
        }
        this.attNav = this.attNav.bind(this)
        this.abreCadFunc = this.abreCadFunc.bind(this)
        this.abreCadEtapa = this.abreCadEtapa.bind(this)
        this.abreCadPeca = this.abreCadPeca.bind(this)
        this.abreCadAeronave = this.abreCadAeronave.bind(this)
        this.abreCadTeste = this.abreCadTeste.bind(this)
        this.abreVisAeronave = this.abreVisAeronave.bind(this)
        this.abreVisEtapa = this.abreVisEtapa.bind(this)
        this.abreVisPeca = this.abreVisPeca.bind(this)
        this.abreVisFunc = this.abreVisFunc.bind(this)
    }

    attNav() {
        this.setState(navAnterior => ({
            navAberta: !navAnterior.navAberta
        }))
    }

    abreCadFunc(e: React.MouseEvent) {
        e.preventDefault()
        this.setState({
            conteudoModal: <CadFunc />,
            modalAberto: true
        })
    }
    abreVisFunc(e: React.MouseEvent) {
        e.preventDefault()
        this.setState({
            conteudoModal: <VisFunc />,
            modalAberto: true
        })
    }

    abreCadEtapa(e: React.MouseEvent) {
        e.preventDefault()
        this.setState({
            conteudoModal: <CadEtapa />,
            modalAberto: true
        })
    }
    abreVisEtapa(e: React.MouseEvent) {
        e.preventDefault()
        this.setState({
            conteudoModal: <VisEtapa />,
            modalAberto: true
        })
    }

    abreCadPeca(e: React.MouseEvent) {
        e.preventDefault()
        this.setState({
            conteudoModal: <CadPeca />,
            modalAberto: true
        })
    }
    abreVisPeca(e: React.MouseEvent) {
        e.preventDefault()
        this.setState({
            conteudoModal: <VisPeca />,
            modalAberto: true
        })
    }

    abreCadAeronave(e: React.MouseEvent) {
        e.preventDefault()
        this.setState({
            conteudoModal: <CadAeronave />,
            modalAberto: true
        })
    }
    abreVisAeronave(e: React.MouseEvent) {
        e.preventDefault()
        this.setState({
            conteudoModal: <VisAeronave />,
            modalAberto: true
        })
    }

    abreCadTeste(e: React.MouseEvent) {
        e.preventDefault()
        this.setState({
            conteudoModal: <CadTeste />,
            modalAberto: true
        })
    }

    render() {
        const { navAberta, modalAberto, conteudoModal } = this.state
        const { nivel } = this.props

        const soAdmin = nivel === 'administrativo'
        const todos = nivel === 'administrativo' || nivel === 'engenheiro' || nivel === 'operador'
        const podeCad = nivel === 'administrativo' || nivel === 'engenheiro'

        const IconeNav = navAberta ? FaChevronLeft : FaChevronRight
        return (
            <>
                <nav className={`bg-[#e2eafc] flex flex-col items-center min-h-screen text-white py-6 gap-6 fixed top-0 z-10
                    ${navAberta ? 'w-[15%]' : 'w-[5%]'}`}>
                    <button onClick={this.attNav}
                        className="absolute right-[-15px] top-6 p-2 bg-white rounded-full shadow">
                        <IconeNav size={10} className="text-[#135b78]" />
                    </button>
                    <section className="flex flex-col space-y-4">
                        {podeCad && (
                            <>
                                <NavLink to="/home" className={`flex`}>
                                    <TiHomeOutline size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Home</p> : null}
                                </NavLink>
                                <NavLink to="#" className={`flex`} onClick={this.abreCadAeronave}>
                                    <FaPlaneDeparture size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Cadastra Aeronave</p> : null}
                                </NavLink>
                                <NavLink to="/#" className={`flex`} onClick={this.abreCadPeca}>
                                    <IoAirplaneOutline size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Cadastra Peça</p> : null}
                                </NavLink>
                                <NavLink to="/#" className={`flex`} onClick={this.abreCadEtapa}>
                                    <FaClipboardList size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Cadastra Etapa</p> : null}
                                </NavLink>
                            </>
                        )}
                        {todos && (
                            <>
                                <NavLink to="/home" className={`flex`}>
                                    <TiHomeOutline size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Home</p> : null}
                                </NavLink>
                                <NavLink to="/home" className={`flex`} onClick={this.abreCadTeste}>
                                    <BsListCheck size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Registra Teste</p> : null}
                                </NavLink>
                                <NavLink to="/aeronaves" className={`flex`}>
                                    <FaPlaneDeparture size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Lista Aeronave</p> : null}
                                </NavLink>
                                <NavLink to="/pecas" className={`flex`}>
                                    <IoAirplaneOutline size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Lista Peça</p> : null}
                                </NavLink>
                                <NavLink to="/funcs" className={`flex`}>
                                    <BsPersonAdd size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Lista Funcionário</p> : null}
                                </NavLink>
                                <NavLink to="/etapas" className={`flex`}>
                                    <FaClipboardList size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Lista Etapa</p> : null}
                                </NavLink>
                                <NavLink to="/testes" className={`flex`}>
                                    <FaClipboardList size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Lista Testes</p> : null}
                                </NavLink>
                            </>
                        )}

                        {soAdmin && (
                            <>
                                <NavLink to="/home" className={`flex`}>
                                    <TiHomeOutline size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Home</p> : null}
                                </NavLink>
                                <NavLink to="/#" className={`flex`} onClick={this.abreCadFunc}>
                                    <BsPersonAdd size={30} className="text-[#135b78]" />
                                    {navAberta ? <p>Cadastrar Funcionário</p> : null}
                                </NavLink>
                            </>
                        )}
                    </section>
                </nav>
                <Modal aberto={modalAberto} onFechar={() => this.setState({ modalAberto: false, conteudoModal: null })}>
                    {conteudoModal}
                </Modal>
            </>
        )
    }
}