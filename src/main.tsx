import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import CadFunc from './pages/cadFunc.tsx'
import CadEtapa from './pages/cadEtapa.tsx'
import VisFunc from './pages/visFunc.tsx'
import VisPeca from './pages/visPeca.tsx'
import VisTeste from './pages/visTeste.tsx'
import VisEtapa from './pages/visEtapa.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/teste' element={<CadFunc/>}/>
        <Route path='/teste2' element={<CadEtapa/>}/>
        <Route path='/funcs' element={<VisFunc/>}/>
        <Route path='/pecas' element={<VisPeca/>}/>
        <Route path='/testes' element={<VisTeste/>}/>
        <Route path='/etapas' element={<VisEtapa/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
