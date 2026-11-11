/**
 * Serviços de telediagnóstico do Núcleo (mapa da página inicial).
 *
 * `atendidos`: municípios atendidos (nomes iguais aos do IBGE, com acentos).
 * Enquanto a lista estiver vazia, o mapa mostra um aviso de "em breve".
 * TODO: preencher `atendidos` do TeleCardio e do TeleOftalmo (os painéis de origem
 * mostram só as contagens, não a lista de municípios).
 */
export type ServicoTele = {
  id: string
  label: string
  /** Ativos e fazendo exames (ou atendidos). */
  atendidos: string[]
  /** Números de destaque exibidos no painel. */
  resumo: { valor: string; rotulo: string }[]
}

export const servicosTele: ServicoTele[] = [
  {
    id: 'telecardio',
    label: 'TeleCardio',
    atendidos: [
      // Lidos do mapa do painel (15 fazendo exames + 5 parados = 20; Nhamundá, Barreirinha e Alvarães foram deduzidos pela posição no mapa).
      'São Gabriel da Cachoeira',
      'Maraã',
      'Manaus',
      'Presidente Figueiredo',
      'Urucará',
      'Coari',
      'Carauari',
      'Eirunepé',
      'Maués',
      'Benjamin Constant',
      'Anori',
      'Iranduba',
      'Nhamundá',
      'Barreirinha',
      'Alvarães',
      // Ativos sem exames nos últimos 30 dias.
      'Fonte Boa',
      'Uarini',
      'Atalaia do Norte',
      'Novo Aripuanã',
      'Parintins',
    ],
    resumo: [
      { valor: '51.833', rotulo: 'exames' },
      { valor: '22', rotulo: 'municípios' },
      { valor: '52', rotulo: 'unidades' },
    ],
  },
  {
    id: 'teleoftalmo',
    label: 'TeleOftalmo',
    atendidos: ['Manaus'],
    resumo: [
      { valor: '1.718', rotulo: 'exames' },
      { valor: '17', rotulo: 'campanhas' },
      { valor: '27,5%', rotulo: 'com achado clínico' },
    ],
  },
  {
    id: 'teledermato',
    label: 'TeleDermato',
    atendidos: ['Manaus'],
    resumo: [{ valor: '1', rotulo: 'município (Manaus)' }],
  },
]
