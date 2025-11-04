const VisRelatorio = (props: { aeronaveModelo: string }) => {
    
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-[#3a6ea5]">
                Relatório Final da Aeronave: {props.aeronaveModelo}
            </h2>
            <p className="text-gray-700 mb-4">
                [Conteúdo do Relatório Final gerado: Resumo das Etapas, Peças, Testes...]
            </p>
            <p className="text-sm italic text-gray-500">
                Esta é a visualização do documento. A lógica real de geração de PDF deve ser implementada no backend.
            </p>
            <button
                className="mt-4 bg-[#3a6ea5] text-white p-2 rounded-lg hover:bg-[#24679a] transition"
                onClick={() => alert('Simulando download do Relatório...')}
            >
                Baixar PDF
            </button>
        </div>
    );
};

export default VisRelatorio