import { Component } from "react"

export type Coluna = {
    header: string
    accessor: string
}

interface PropsTabela {
    dados: any[]
    colunas: Coluna[]
    classname?: string
}

interface StateTabela { }

export default class Tabela extends Component<PropsTabela, StateTabela> {
    render() {
        return (
            <>
                <table className={`w-full overflow-hidden rounded-lg border-collapse ${this.props.classname}`}>
                    <thead className="bg-[#3a6ea5] text-white">
                        <tr>
                            {this.props.colunas.map((col, colIndex) => (
                                <th key={colIndex} className="p-3 text-center">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.dados.map((d,dIndex) => (
                            <tr key={dIndex} className={`${dIndex % 2 === 0 ? 'bg-[#f9f9f9]' : 'bg-[#e3f2fd]'}`}>
                                {this.props.colunas.map((col) => {
                                    const valor = d[col.accessor]
                                    return(
                                        <td key={col.header} className="p-3 border-b-2 border-white text-center">
                                            {valor}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        )
    }
}