import { useState, useMemo } from 'react'
import NavBar from './components/navbar'
import { getNivelAcesso } from './utils/autenticacao';

function App() {
  const nivelAcesso = useMemo(() => getNivelAcesso(), []);

  return (
    <>
      {/* 3. Passa o nível de acesso recuperado para o NavBar */}
      <NavBar nivel={nivelAcesso}/>
      <section className='flex justify-center items-center w-screen h-screen'>
        <h1 className='text-stone-950 text-center m-auto font-bold text-5xl'>Seja bem vindo</h1>
      </section>
    </>
  )
}

export default App