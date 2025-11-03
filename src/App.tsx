import { useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'

import NavBar from './components/navbar'
import InputLinha from './components/input'
import BarraPesquisa from './components/barraPesquisa'
import Tabela, { type Coluna } from './components/tabela'



const COLUNAS_CLIENTES: Coluna[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome Fantasia', accessor: 'NomeFantasia' },
    { header: 'Localização', accessor: 'Cidade' },
];

// Tipos usados para os dados de exemplo
type Cliente = {
    id: number;
    NomeFantasia: string;
    Cidade: string;
};

// Dados de exemplo (simulando a busca de uma API)
const DADOS_CLIENTES: Cliente[] = [
    { id: 1, NomeFantasia: 'Tech Soluções', Cidade: 'São Paulo' },
    { id: 2, NomeFantasia: 'Loja do Zé', Cidade: 'Rio de Janeiro' },
    { id: 3, NomeFantasia: 'Alpha Consultoria', Cidade: 'Belo Horizonte' },
    { id: 4, NomeFantasia: 'Fast Food Brasil', Cidade: 'São Paulo' },
    { id: 5, NomeFantasia: 'Beta Tecnologia', Cidade: 'Campinas' },
];


function App() {
  
  return (
    <>
    <NavBar/>
    {/* <InputLinha type='text' name='teste' palceholder=''>Teste</InputLinha> */}
    {/* <BarraPesquisa onPesquisa={} placeholder=''></BarraPesquisa> */}

    <div style={{ padding: '20px' }}>
            <h2>Visualização de Clientes</h2>
            
            

            <Tabela
                dados={DADOS_CLIENTES}
                colunas={COLUNAS_CLIENTES}
            />
        </div>
    </>
  )
}

export default App
