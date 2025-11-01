import React from "react";
import { createPortal } from "react-dom";
import { Component } from "react";

type PropsModal = {
    aberto: boolean
    onFechar: () => void
    children: React.ReactNode
    modalClassName: string
}

export default class Modal extends Component<PropsModal, {}>{
    constructor(props:PropsModal){
        super(props)
    }

    private clicouFora = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            this.props.onFechar
        }
    }
    
    render(){
        const {aberto, children, modalClassName} = this.props

        if(!aberto) return null

        const modalRoot = document.getElementById('modal-root')
        if(!modalRoot) return null

        return(
            <>
            <section
                className={`bg-blue-500 ${modalClassName}`}
                onClick={this.clicouFora}
                role="dialog"
                aria-modal="true">
                    {children}
            </section>,
            modalRoot
            </>
        )
    }
}