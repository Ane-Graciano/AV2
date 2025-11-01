import { Component, useState } from "react";
import { NavLink } from "react-router-dom";
import { TiHomeOutline } from "react-icons/ti";
import { FaPlaneDeparture } from "react-icons/fa6";
import { IoAirplaneOutline } from "react-icons/io5";
import { BsPersonAdd } from "react-icons/bs";
import { BsListCheck } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


interface NavBarState {
    navAberta: boolean;
}

interface NavBarProps {
}

export default class NavBar extends Component<NavBarProps, NavBarState> {
    constructor(props:NavBarState){
            super(props)
            this.state = {
                navAberta: false
            }
            this.attNav = this.attNav.bind(this)
        }

    attNav(){
        this.setState(navAnterior => ({
            navAberta: !navAnterior.navAberta
        }))
    }
    render() {
        const {navAberta} = this.state

        const IconeNav = navAberta ? FaChevronLeft : FaChevronRight
        return (
            <>
                <nav className={`bg-[#e2eafc] flex flex-col items-center min-h-screen text-white py-6 gap-6 fixed top-0 z-10
                    ${navAberta ? 'w-[100px]' : 'w-[60px]'}`}>
                   <button onClick={this.attNav}
                   className="right-[-15px] top-6 p-1 bg-white rounded-full shadow">
                        <IconeNav size={10} className="text-[#135b78]"/>
                   </button>
                    <section className="flex flex-col space-y-4">
                        <NavLink to="/home">
                            <TiHomeOutline size={30} className="text-[#135b78]"/>
                        </NavLink>

                        <NavLink to="/home">
                            <FaPlaneDeparture size={30}  className="text-[#135b78]"/>
                        </NavLink>

                        <NavLink to="/home">
                            <IoAirplaneOutline size={30}  className="text-[#135b78]"/>
                        </NavLink>

                        <NavLink to="/home">
                            <BsPersonAdd size={30}  className="text-[#135b78]"/>
                        </NavLink>

                        <NavLink to="/home">
                            <BsListCheck size={30}  className="text-[#135b78]"/>
                        </NavLink>

                        <NavLink to="/home">
                            <FaClipboardList size={30}  className="text-[#135b78]"/>
                        </NavLink>
                    </section>
                </nav>
            </>
        )
    }
}