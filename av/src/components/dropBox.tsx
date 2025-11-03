// src/components/SelectLinhaMulti.tsx

import Select, { type MultiValue, type StylesConfig } from 'react-select';
import { Component } from 'react';


type op = {
    value: string;
    label: string;
}

interface PropsDropBox {
    name: string;
    label: string;
    opcoes: op[];
    required?: boolean;
    onChange: (values: string[]) => void;
    value: string[];
}

interface StateDropBox { }

export default class DropBox extends Component<PropsDropBox, StateDropBox> {
    constructor(props: PropsDropBox) {
        super(props)
    }

    handleChange = (opSelecionada: MultiValue<op>) => {
        const values = opSelecionada.map(option => option.value);
        this.props.onChange(values);
    }
    render() {
        const { opcoes } = this.props;
        const valorSelecionado = opcoes.filter(opcao =>
            this.props.value?.includes(opcao.value) // Use this.props.value
        );

        const customStyles: StylesConfig<op, true> = {

            // Container: Define o layout do input flutuante
            container: (base) => ({
                ...base,
                width: '500px',
                position: 'relative',
                paddingTop: '1rem',
                paddingBottom: '0.25rem',
                borderBottom: '2px solid #c0c0c0',
                transition: 'border-color 0.3s',
                '&:focus-within': {
                    borderColor: '#3a6ea5',
                },
            }),

            // Control: Remove a borda interna
            control: (base, state) => ({
                ...base,
                border: 'none',
                boxShadow: 'none',
                minHeight: '20px',
                padding: '0',
                cursor: 'text',
            }),

            indicatorSeparator: () => ({ display: 'none' }),
            dropdownIndicator: (base) => ({
                ...base,
                padding: '0 8px',
            }),

            multiValue: (base) => ({
                ...base,
                backgroundColor: '#e3f2fd',
                color: '#3a6ea5',
                borderRadius: '4px',
            }),
        };
        return (
            <>
                <section className="flex flex-col items-start w-full">
                    <label htmlFor={this.props.name} className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 start-2 peer-focus:text-[#3a6ea5] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                        style={{
                            position: 'absolute',
                            left: '8px',
                            top: '20px',
                            transition: 'all 0.3s',
                            transform: 'translateY(0)',
                            pointerEvents: 'none',
                            color: '#3a6ea5',
                        }}
                    >
                        {this.props.label} {this.props.required}
                    </label>

                    <Select
                        name={this.props.name}
                        options={this.props.opcoes}
                        value={valorSelecionado}
                        isMulti
                        placeholder={`Selecione um ou mais ${this.props.label.toLowerCase()}`}
                        onChange={this.handleChange}
                        className="basic-multi-select w-[300px] block px-2 pb-1 pt-5 text-sm text-gray-950 border-b-2 border-[#c0c0c0]  focus:outline-none focus:border-[#3a6ea5] peer"
                        classNamePrefix="select"
                        styles={customStyles}
                    />
                </section>
            </>
        )
    }
}