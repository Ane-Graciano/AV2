export type aeronaves = {
    modelo: string
    tipo: string
    capacidade: string
    alcance: string
    id: number    
    statusRelatorio?: 'Pendente' | 'Concluído' | string
}

export type etapa = {
    id: number
    nome: string
    prazo: string
    status: string
    funcSelecionado: string[]
    idAeronave: number
}

export type peca = {
    id: number
    nome: string
    tipo: string
    fornecedor: string
    status: string
    idAeronave: number
}

export type teste = {
    id: number
    aeronave: string
    tipo: string
    resultado: string
    data: string
    obs: string
    func: string
    idAeronave: number
}

export interface RelatorioResumo {
  id: string
  titulo: string
  descricao?: string
  aeronave: aeronaves
}