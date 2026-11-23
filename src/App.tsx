import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, KeyboardEvent, ReactNode } from 'react'
import logoBranca from './assets/logo-telessaude-funati-branca.png'
import contatoFoto from './assets/contato.jpg' // Foto: Mikhail Nilov (Pexels, licença gratuita)
import teleconsultoriaFoto from './assets/teleconsultoria.jpg'
import teleatendimentoFoto from './assets/teleatendimento.jpg' // Foto: Tima Miroshnichenko (Pexels, licença gratuita)
import telediagnosticoFoto from './assets/telediagnostico.jpg'
import teleeducacaoFoto from './assets/teleeducacao.jpg'
import logoUfmg from './assets/parceiros/ufmg.png'
import logoSabia from './assets/parceiros/sabia.png'
import logoUfg from './assets/parceiros/ufg.png'
import logoGoverno from './assets/parceiros/governo-brasil.png'
import logoSusDigital from './assets/parceiros/sus-digital.png'
import logoMinisterio from './assets/parceiros/ministerio-saude.png'
import logoUfsc from './assets/parceiros/ufsc.png'
import MunicipalMap from './MunicipalMap'
import { servicosTele } from './data/servicos'
import './App.css'
import './brand.css'

type Service = {
  slug: string
  title: string
  text: string
  about: string
  audience: string
  benefits: string[]
  icon: string[]
  image?: {
    src: string
    alt: string
    caption: string
    width: number
    height: number
    /** Parte da foto que fica visível quando ela é cortada (CSS object-position). */
    position?: string
    /** Proporção da moldura (CSS aspect-ratio); o padrão do site é 4 / 3.4. */
    aspect?: string
  }
  /** Serviços oferecidos dentro deste serviço (cartões na página). */
  subservices?: { id: string; title: string; text: string; where?: string; icon: string[] }[]
  /** Botão principal da página; o padrão é "Solicitar este serviço" (contato). */
  cta?: { label: string; href: string }
  howItWorks?: string[]
  challenges?: string
  /** Subtítulo do bloco `challenges`; o padrão é "Desafios". */
  challengesTitle?: string
}

type NavChild = {
  label: string
  short: string
  id: string
  href?: string
  icon: string[]
}

type NavItem = {
  label: string
  id: string
  href?: string
  wide?: boolean
  match?: string[]
  children?: NavChild[]
}

type Route =
  | 'home'
  | 'quem-somos'
  | 'equipe'
  | 'projetos'
  | 'publicacoes'
  | 'noticias'
  | 'contato'
  | `servico:${string}`

// TODO: confirmar os textos de cada serviço com o Núcleo antes de publicar.
const services: Service[] = [
  {
    slug: 'teleconsultoria',
    title: 'Teleconsultoria',
    text: 'Apoio de especialistas para esclarecer dúvidas clínicas e de processo de trabalho, ampliando o acesso e reduzindo deslocamentos.',
    about:
      'A teleconsultoria é a consulta registrada e realizada entre trabalhadores e gestores da saúde, por meio de instrumentos de telecomunicação bidirecional, com o objetivo de esclarecer dúvidas sobre procedimentos clínicos, ações de saúde e questões relativas ao processo de trabalho.',
    audience: 'Profissionais, equipes e gestores de saúde da rede.',
    benefits: [
      'Esclarecimento de dúvidas clínicas e de processo de trabalho',
      'Redução de deslocamentos de pacientes e profissionais',
      'Apoio de especialistas às equipes da atenção primária',
      'Mais autonomia e resolutividade na atenção primária',
      'Menos encaminhamentos desnecessários e melhor uso dos recursos',
      'Decisões clínicas apoiadas por suporte técnico especializado',
    ],
    icon: ['M4 5.5h16v10.5H10l-4.5 3.5V16H4z', 'M12 8.2v4.6M9.7 10.5h4.6'],
    image: {
      src: teleconsultoriaFoto,
      alt: 'Médica sorrindo e acenando durante uma videochamada pelo celular',
      caption: 'Apoio de especialistas à distância',
      width: 1800,
      height: 1201,
    },
    // TODO: informar o prazo de resposta da modalidade assíncrona quando o Núcleo definir.
    howItWorks: [
      'O profissional registra o caso e a dúvida na plataforma do Núcleo de Telessaúde. O atendimento pode ser assíncrono, com resposta enviada depois dentro de um prazo definido, ou síncrono, em conversa em tempo real por vídeo, chat ou telefone.',
      'O especialista do Núcleo responde com fundamentação técnica, orienta a conduta e indica se há ou não necessidade de encaminhamento. Em muitos casos, essa etapa vem antes da regulação, sendo exigida para formalizar o encaminhamento à atenção especializada.',
    ],
    challenges:
      'Os principais pontos de atenção são organizar a carga de trabalho do Núcleo, definir critérios de triagem das solicitações e garantir respostas em tempo adequado.',
  },
  {
    slug: 'teleatendimento',
    title: 'Teleatendimento',
    text: 'Atendimento remoto a usuários do SUS, conectando a população a profissionais e serviços de saúde.',
    about:
      'O teleatendimento conecta usuários do SUS a profissionais de saúde por meio de tecnologias de comunicação, ampliando o acesso ao cuidado sem a necessidade de deslocamento.',
    audience: 'Usuários do SUS atendidos pelas equipes parceiras.',
    benefits: [
      'Acesso ao cuidado sem deslocamento',
      'Continuidade do acompanhamento do paciente',
      'Aproximação entre a população e os serviços de saúde',
      'Acesso a especialistas em locais remotos',
      'Apoio ao acompanhamento de pacientes crônicos, retornos e orientações',
    ],
    icon: [
      'M5 14v-2a7 7 0 0114 0v2',
      'M5 14h2.5v4H5a1 1 0 01-1-1v-2a1 1 0 011-1zM19 14h-2.5v4H19a1 1 0 001-1v-2a1 1 0 00-1-1z',
      'M17 18.5c0 1.4-1.6 2-4 2',
    ],
    image: {
      src: teleatendimentoFoto,
      alt: 'Pessoa idosa em casa fazendo uma videochamada com uma médica em um tablet, com medicamentos sobre a mesa',
      caption: 'Atendimento remoto no SUS',
      width: 1200,
      height: 800,
      position: '35% 45%',
    },
    howItWorks: [
      'O paciente agenda a teleconsulta ou é encaminhado a ela pela unidade de saúde de origem. No horário combinado, ele se conecta ao profissional por uma plataforma segura.',
      'Durante o atendimento, o profissional avalia as queixas, o histórico e os exames do paciente, pode solicitar novos exames e, quando for preciso, indicar uma consulta presencial. Tudo fica registrado em prontuário, para garantir a continuidade do cuidado.',
    ],
    challengesTitle: 'Cuidados',
    challenges:
      'O teleatendimento precisa ser bem regulado, com consentimento informado e clareza sobre os casos que exigem exame físico presencial. Ele complementa o atendimento presencial, mas não substitui todos os casos.',
  },
  {
    slug: 'telediagnostico',
    title: 'Telediagnóstico',
    text: 'Laudos e pareceres à distância, como tele-ECG e teledermatologia, para agilizar o diagnóstico.',
    about:
      'O telediagnóstico é a realização de exames e a emissão de laudos à distância, com a análise feita por especialistas a partir de imagens e dados enviados pelas unidades de saúde.',
    audience: 'Unidades de saúde e profissionais solicitantes.',
    benefits: [
      'Laudos mais rápidos',
      'Acesso a especialistas onde há poucos profissionais',
      'Apoio à decisão clínica das equipes',
      'Menos deslocamentos desnecessários de pacientes',
      'Mais resolutividade na atenção primária',
    ],
    icon: ['M3.5 5h17v11h-17zM9 20h6M12 16v4', 'M6 10.5h3l1.5-2.5 2.5 5 1.5-2.5H18'],
    image: {
      src: telediagnosticoFoto,
      alt: 'Médico de óculos analisando exames de imagem do crânio em um monitor',
      caption: 'Laudos e pareceres à distância',
      width: 1200,
      height: 628,
      position: '30% 50%',
      aspect: '4 / 3',
    },
    subservices: [
      {
        id: 'telecardio',
        where: 'Todo o Amazonas',
        title: 'Telecardiologia',
        text: 'ECG, MAPA e Holter com laudo à distância.',
        icon: ['M3.5 12h4l2-5 3.5 10 2.5-7 1.5 2h3.5', 'M12 20.5C6 16 3 13 3 9.5A4.5 4.5 0 0 1 7.5 5C9.4 5 11 6 12 7.5 13 6 14.6 5 16.5 5A4.5 4.5 0 0 1 21 9.5c0 3.5-3 6.5-9 11z'],
      },
      {
        id: 'teledermato',
        where: 'Manaus',
        title: 'Teledermatologia',
        text: 'Avaliação de lesões de pele por imagem, com parecer do especialista. Atua somente em Manaus.',
        icon: ['M12 3.5c3 3.5 5.5 6.5 5.5 9.5a5.5 5.5 0 0 1-11 0C6.5 10 9 7 12 3.5z', 'M9.5 13.5a2.5 2.5 0 0 0 2.5 2.5'],
      },
      {
        id: 'teleoftalmo',
        where: 'Manaus',
        title: 'Teleoftalmologia',
        text: 'Retinografia para triagem da retinopatia diabética e outras doenças dos olhos. Atua em Manaus.',
        icon: ['M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z', 'M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'],
      },
    ],
    howItWorks: [
      'Na unidade básica ou no local de atendimento, um profissional realiza o exame, como eletrocardiograma ou radiografia, e envia os arquivos por um sistema seguro. Um especialista do Núcleo de Telessaúde analisa os dados, elabora o laudo e o devolve à unidade que fez a solicitação.',
      'Com o laudo em mãos, a unidade ajusta o plano de cuidado do paciente e, se for necessário, o encaminha para atendimento presencial. Em muitos casos, o laudo chega dentro de prazos definidos, com garantia de qualidade e respaldo técnico.',
    ],
    challengesTitle: 'Limitações e cuidados',
    challenges:
      'O serviço exige conectividade e sistemas seguros, e depende da qualidade das imagens e dos dados enviados. Também são necessários protocolos claros, responsabilidades definidas e garantia de sigilo e de segurança da informação.',
  },
  {
    slug: 'suporte-tecnico',
    title: 'Suporte técnico',
    text: 'Atendimento técnico em informática para as unidades que usam os serviços de telessaúde.',
    about:
      'Canal dedicado ao atendimento técnico em informática para as unidades e os profissionais que usam os serviços do Núcleo de Telessaúde, como o telediagnóstico.',
    audience: 'Unidades de saúde e profissionais que usam os serviços do Núcleo.',
    benefits: [
      'Ajuda rápida com equipamentos e sistemas',
      'Menos interrupções nos exames e nos laudos',
      'Um canal único para pedir apoio técnico',
    ],
    // TODO: colocar em `cta.href` o endereço do suporte on-line, quando houver.
    cta: { label: 'Acessar serviço', href: '#/contato' },
    icon: ['M4.5 13v-1.5a7.5 7.5 0 0 1 15 0V13', 'M4.5 13h2.5v4H4.5zM17 13h2.5v4H17z', 'M19.5 17c0 2-2 3-5 3'],
  },
  {
    slug: 'tele-educacao',
    title: 'Tele-educação',
    text: 'Webconferências, cursos e capacitações gratuitas para a atualização de equipes e gestores.',
    about:
      'A tele-educação reúne webconferências, cursos e capacitações realizados à distância, para a atualização contínua de equipes e gestores de saúde.',
    audience: 'Trabalhadores do SUS e gestores.',
    benefits: [
      'Formação sem sair do local de trabalho',
      'Atualização com base em evidências',
      'Troca de experiências entre profissionais da rede',
      'Protocolos padronizados e difusão de boas práticas',
      'Mais integração entre ensino e serviço, com comunidades de prática',
    ],
    icon: [
      'M2.5 9.5L12 5l9.5 4.5L12 14z',
      'M6.5 11.5v4.2c0 1.2 2.5 2.8 5.5 2.8s5.5-1.6 5.5-2.8v-4.2M21.5 9.5v5',
    ],
    image: {
      src: teleeducacaoFoto,
      alt: 'Mulher sorrindo, de fones de ouvido, fazendo anotações enquanto assiste a uma aula no notebook',
      caption: 'Aprender em rede, onde você estiver',
      width: 1500,
      height: 1001,
    },
    howItWorks: [
      'Os Núcleos de Telessaúde organizam cursos, webpalestras e aulas, ao vivo ou gravadas, a partir das necessidades de cada território. Os temas variam conforme a demanda: situações epidemiológicas, novos protocolos, atualização de diretrizes ou treinamento no uso de sistemas.',
      'A participação pode ser síncrona, acompanhando a aula ao vivo, ou assíncrona, com aulas gravadas que cada pessoa assiste no seu próprio ritmo. O acesso é feito por uma plataforma virtual, com vídeos, fóruns de discussão, avaliações e certificado.',
    ],
    challenges:
      'Para funcionar bem, a tele-educação depende de boa infraestrutura digital, do engajamento dos participantes e de um planejamento pedagógico de qualidade.',
  },
]

const serviceShort: Record<string, string> = {
  teleconsultoria: 'Apoio de especialistas às equipes',
  teleatendimento: 'Atendimento remoto no SUS',
  telediagnostico: 'Laudos e pareceres à distância',
  'suporte-tecnico': 'Atendimento técnico em informática',
  'tele-educacao': 'Cursos e webconferências',
}

const navigation: NavItem[] = [
  { label: 'Início', id: 'inicio' },
  {
    label: 'Institucional',
    id: 'institucional',
    href: '#/quem-somos',
    children: [
      {
        label: 'Quem somos',
        short: 'Conheça nossa história',
        id: 'quem-somos',
        href: '#/quem-somos',
        icon: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M12 11v5', 'M12 8h.01'],
      },
      {
        label: 'Equipe',
        short: 'Quem faz o Núcleo',
        id: 'equipe',
        href: '#/equipe',
        icon: [
          'M16 20v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1',
          'M10 11a3 3 0 100-6 3 3 0 000 6z',
          'M20 20v-1a3 3 0 00-2-2.8',
        ],
      },
    ],
  },
  {
    label: 'Serviços',
    id: 'servicos',
    wide: true,
    children: services.map((service) => ({
      label: service.title,
      short: serviceShort[service.slug],
      id: `servico:${service.slug}`,
      href: `#/servicos/${service.slug}`,
      icon: service.icon,
    })),
  },
  {
    label: 'Pesquisa',
    id: 'pesquisa',
    children: [
      {
        label: 'Projetos',
        short: 'Pesquisa, desenvolvimento e inovação',
        id: 'projetos',
        href: '#/projetos',
        icon: ['M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3', 'M8 14h8'],
      },
      {
        label: 'Publicações',
        short: 'Materiais e produção científica',
        id: 'publicacoes',
        href: '#/publicacoes',
        icon: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M10 13h6M10 17h6'],
      },
    ],
  },
  { label: 'Notícias', id: 'noticias', href: '#/noticias' },
  { label: 'Contato', id: 'contato', href: '#/contato' },
]

const hrefOf = (item: { href?: string; id: string }) => item.href ?? `#${item.id}`

const footerLinks = [
  { label: 'Quem somos', href: '#/quem-somos' },
  { label: 'Equipe', href: '#/equipe' },
  { label: 'Parcerias', href: '#parcerias' },
  { label: 'Notícias', href: '#/noticias' },
  { label: 'Contato', href: '#/contato' },
]

// TODO: preencher com os dados reais do Núcleo quando o site for divulgado.
// Tudo é opcional e só aparece no site quando preenchido (rodapé e página de contato).
// Enquanto `email` estiver vazio, o formulário de contato fica desativado, para que nenhuma
// mensagem seja enviada a um endereço que não seja do Núcleo.
// Para o mapa, use o endereço de "Compartilhar > Incorporar um mapa" do Google Maps.
const contactInfo: {
  email?: string
  phone?: string
  address?: string
  hours?: string
  mapEmbedUrl?: string
} = {
  email: 'nucleodigital@telessaudefunati.com',
  phone: '',
  address: '',
}

// TODO: colocar os endereços reais das redes sociais do Núcleo.
const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'YouTube', href: '#' },
]

const pages: Record<
  'quem-somos' | 'equipe' | 'projetos' | 'publicacoes' | 'noticias' | 'contato',
  string
> = {
  'quem-somos': '#/quem-somos',
  equipe: '#/equipe',
  projetos: '#/projetos',
  publicacoes: '#/publicacoes',
  noticias: '#/noticias',
  contato: '#/contato',
}

const getRoute = (): Route => {
  const { hash } = window.location
  const found = (Object.keys(pages) as (keyof typeof pages)[]).find(
    (page) => pages[page] === hash,
  )
  if (found) return found

  const match = hash.match(/^#\/servicos\/(.+)$/)
  if (match && services.some((service) => service.slug === match[1])) {
    return `servico:${match[1]}`
  }

  return 'home'
}

const sectionIds = [
  'inicio',
  'painel',
  'publicacoes',
  'noticias',
  'depoimentos',
  'parcerias',
  'contato',
]

const teamGroups = [
  {
    title: 'Coordenação Geral',
    members: [
      {
        name: 'Dra. Vanusa do Nascimento',
        role: 'Coordenação Geral e da Equipe Multiprofissional',
      },
      { name: 'Dra. Ivana Beatrice Mânica da Cruz', role: 'Coordenação Geral e Científica' },
    ],
  },
  {
    title: 'Coordenações',
    members: [
      { name: 'Dra. Ednea Aguiar Maia-Ribeiro', role: 'Coordenação Clínica-Médica' },
      { name: 'Enf. Selena da Silva Soares', role: 'Coordenação de Telediagnósticos' },
      { name: 'Raimundo Xavier Martins', role: 'Coordenação da Regulação' },
      { name: 'Dra. Maria Fernanda Manica-Cattani', role: 'Coordenação da Teleeducação' },
      { name: 'MSc Cristina Maranghello', role: 'Coordenação de Teleconsultas' },
      { name: 'Pedro Carvalho Almeida', role: 'Coordenação de Tecnologia da Informação' },
    ],
  },
  {
    title: 'Assessorias',
    members: [
      { name: 'Dr. Ivo Emilio da Cruz Jung', role: 'Assessoria em Telorientação' },
      { name: 'Dr. Marco Aurélio Echart Montano', role: 'Assessoria em PD&I' },
      { name: 'Ademir Guimarães da Costa Junior', role: 'Assessoria em TI' },
    ],
  },
]

// TODO: substituir pelos números reais do Núcleo antes de publicar.
const stats = [
  { value: '—', label: 'teleconsultorias realizadas' },
  { value: '—', label: 'municípios atendidos' },
  { value: '—', label: 'profissionais cadastrados' },
  { value: '—', label: 'exames laudados à distância' },
]

type Project = { area: string; title: string; text: string }

// TODO: cadastrar aqui os projetos do Núcleo. Enquanto a lista estiver vazia, a página
// "Projetos" mostra um aviso de "em breve". Exemplo de item:
// { area: 'Telediagnóstico', title: 'Nome do projeto', text: 'Resumo em uma ou duas frases.' }
const projects: Project[] = []

// TODO: substituir pelas publicações reais do Núcleo.
const publications = [
  { type: 'Boletim', title: 'Boletim informativo do Núcleo', year: 'Em breve' },
  { type: 'Relatório', title: 'Relatório de atividades', year: 'Em breve' },
  { type: 'Artigo', title: 'Produção científica e técnica', year: 'Em breve' },
]

// TODO: substituir por notícias e agenda reais (as datas abaixo são exemplos).
const news = [
  {
    date: '2026-11-05',
    tag: 'Tele-educação',
    title: 'Webconferência: apoio clínico na atenção primária',
  },
  {
    date: '2026-11-12',
    tag: 'Tele-educação',
    title: 'Webconferência: saúde digital nos municípios do interior',
  },
  {
    date: '2026-11-19',
    tag: 'Novidade',
    title: 'Novos serviços de telediagnóstico disponíveis para a rede',
  },
]

// Da mais recente para a mais antiga: a página inicial mostra as primeiras como "últimas notícias".
const latestNews = [...news].sort((a, b) => b.date.localeCompare(a.date))

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

type HeroSlide = {
  eyebrow: string
  title: string
  /** Trecho do título sublinhado em coral (detalhe gráfico do manual). */
  highlight: string
  text: string
  image: string
  imageAlt: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
}

type WaveTone = 'lime' | 'leaf' | 'deep' | 'ivory'

/** Faixas onduladas do manual (grafismo "curvas que dão movimento"): de cima para baixo. */
function Waves({ bands }: { bands: [WaveTone, WaveTone, WaveTone] }) {
  return (
    <svg className="waves" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className={`w-${bands[0]}`} d="M0 62C260 8 640 6 940 54s380 36 500-18v84H0z" />
      <path className={`w-${bands[1]}`} d="M0 84C300 36 700 36 1000 80s320 28 440-10v50H0z" />
      <path className={`w-${bands[2]}`} d="M0 106C340 76 780 78 1080 104s250 8 360-8v24H0z" />
    </svg>
  )
}

/** Título com um trecho sublinhado em coral. */
function HighlightedTitle({ title, highlight }: { title: string; highlight: string }) {
  const at = title.indexOf(highlight)
  if (at < 0) return <>{title}</>
  return (
    <>
      {title.slice(0, at)}
      <span className="hero-mark">{highlight}</span>
      {title.slice(at + highlight.length)}
    </>
  )
}

const heroSlides: HeroSlide[] = [
  {
    eyebrow: 'Quem somos',
    title: 'Conexões que aproximam o cuidado.',
    highlight: 'o cuidado.',
    image: teleatendimentoFoto,
    imageAlt: 'Pessoa idosa segura um copo d’água diante de um tablet em que uma médica a atende por vídeo.',
    text: 'Iniciativa pioneira da FUnATI, em parceria com o Ministério da Saúde, para ampliar o acesso da população idosa da Amazônia à atenção especializada.',
    primary: { label: 'Conheça nossa história', href: '#/quem-somos' },
    secondary: { label: 'Conheça nossa equipe', href: '#/equipe' },
  },
  {
    eyebrow: 'Teleconsultoria',
    title: 'Apoio de especialistas à distância',
    highlight: 'à distância',
    image: teleconsultoriaFoto,
    imageAlt: 'Profissional de saúde sorri e acena para o celular durante uma videochamada.',
    text: 'Esclareça dúvidas clínicas e de processo de trabalho com especialistas, ampliando o acesso e reduzindo deslocamentos.',
    primary: { label: 'Conheça a teleconsultoria', href: '#/servicos/teleconsultoria' },
    secondary: { label: 'Fale conosco', href: '#/contato' },
  },
  {
    eyebrow: 'Telediagnóstico',
    title: 'Exames analisados à distância por especialistas',
    highlight: 'por especialistas',
    image: telediagnosticoFoto,
    imageAlt: 'Médico observa imagens de exame em um monitor.',
    text: 'Laudos e pareceres que agilizam o diagnóstico e aproximam o cuidado especializado das equipes de saúde.',
    primary: { label: 'Conheça o telediagnóstico', href: '#/servicos/telediagnostico' },
    secondary: { label: 'Fale conosco', href: '#/contato' },
  },
  {
    eyebrow: 'Tele-educação',
    title: 'Aprender em rede, onde você estiver',
    highlight: 'em rede',
    image: teleeducacaoFoto,
    imageAlt: 'Mulher de fones de ouvido sorri e faz anotações enquanto assiste a uma aula no notebook.',
    text: 'Webconferências, cursos e capacitações para a atualização contínua de equipes e gestores.',
    primary: { label: 'Conheça a tele-educação', href: '#/servicos/tele-educacao' },
    secondary: { label: 'Veja as notícias', href: '#/noticias' },
  },
]

const purposeItems = [
  {
    text: 'Fortalecer a transformação digital da saúde',
    icon: [
      'M3.5 5h17v11h-17z',
      'M9 20h6M12 16v4',
      'M6 10.5h3l1.5-2.5 2.5 5 1.5-2.5H18',
    ],
  },
  {
    text: 'Ampliar o acesso aos serviços para a pessoa idosa',
    icon: ['M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z'],
  },
  {
    text: 'Apoiar soluções tecnológicas inovadoras para o SUS na Região Norte',
    icon: [
      'M9 18h6M10 21h4',
      'M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z',
    ],
  },
]

type PartnerSlide = {
  tag: string
  name: string
  text: string
  icon: string[]
  /** Logo exibido no lugar do ícone. */
  logo?: string
  /** Logo branco com fundo transparente: é pintado nas cores da marca por CSS. */
  tinted?: boolean
  href?: string
}

const networkIcon = [
  'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z',
  'M12 7.7a2.3 2.3 0 100 4.6 2.3 2.3 0 000-4.6z',
]
const shieldIcon = ['M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z', 'M12 8.5v5M9.5 11h5']

// Carrossel de parcerias. TODO: confirmar os textos de cada parceiro com o Núcleo.
const partnerSlides: PartnerSlide[] = [
  {
    tag: 'Parceiro institucional',
    name: 'Ministério da Saúde',
    text: 'Parceiro na implantação do Núcleo e no fortalecimento da transformação digital da saúde, com foco no SUS na Região Norte.',
    icon: shieldIcon,
    logo: logoMinisterio,
    href: 'https://www.gov.br/saude/',
  },
  {
    tag: 'Programa federal',
    name: 'SUS Digital',
    text: 'Programa do Ministério da Saúde que impulsiona a transformação digital da saúde em todo o SUS.',
    icon: shieldIcon,
    logo: logoSusDigital,
    href: 'https://www.gov.br/saude/pt-br/composicao/seidigi/sus-digital',
  },
  {
    tag: 'Governo federal',
    name: 'Governo do Brasil',
    text: 'Apoio do Governo Federal às iniciativas de saúde digital e ao fortalecimento do SUS.',
    icon: shieldIcon,
    logo: logoGoverno,
    href: 'https://www.gov.br/',
  },
  {
    tag: 'Núcleo de telessaúde',
    name: 'Santa Catarina',
    text: 'Saúde Digital da UFSC, parceira em iniciativas de telessaúde e inovação em saúde digital.',
    icon: networkIcon,
    logo: logoUfsc,
    tinted: true,
    href: 'https://saudedigital.ufsc.br/',
  },
  {
    tag: 'Núcleo de telessaúde',
    name: 'Goiás',
    text: 'Telessaúde da Faculdade de Medicina da UFG, parceira na troca de experiências e no fortalecimento da rede.',
    icon: networkIcon,
    logo: logoUfg,
    href: 'https://tele.medicina.ufg.br/',
  },
  {
    tag: 'Núcleo de telessaúde',
    name: 'Minas Gerais',
    text: 'Centro de Telessaúde do Hospital das Clínicas da UFMG, parceiro na construção de serviços de saúde digital.',
    icon: networkIcon,
    logo: logoUfmg,
    href: 'https://telessaude.hc.ufmg.br/',
  },
  {
    tag: 'Plataforma',
    name: 'Sabiá',
    text: 'Plataforma Sabiá, da UFRN, que apoia os serviços de telessaúde do Núcleo.',
    icon: networkIcon,
    logo: logoSabia,
    href: 'https://login.sabia.ufrn.br/entrar/',
  },
]

const testimonials = [
  {
    quote:
      'A parceria com o Núcleo trouxe mais agilidade às consultas e fortaleceu a rede de atenção em todo o estado.',
    author: 'Diretoria de Atenção Primária',
  },
  {
    quote:
      'A solução digital foi essencial para ampliar o acesso, reduzir deslocamentos e melhorar a experiência do paciente.',
    author: 'Coordenação de Saúde Municipal',
  },
  {
    quote:
      'Nossa equipe recebeu apoio contínuo, com processos claros, tecnologia bem aplicada e foco em impacto real.',
    author: 'Gestão de Rede de Cuidados',
  },
]

type PageHeroProps = {
  title: string
  text: string
  /** Nome da seção no caminho de navegação; `null` omite essa parte. */
  section?: string | null
}

function PageHero({ title, text, section = 'Institucional' }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        <nav className="breadcrumb" aria-label="Você está em">
          <a href="#inicio">Início</a>
          <span aria-hidden="true">/</span>
          {section && (
            <>
              <span>{section}</span>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span aria-current="page">{title}</span>
        </nav>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  )
}

function AboutPage() {
  return (
    <div className="page">
      <div className="screen-first">
      <PageHero
        title="Quem somos"
        text="Conectando conhecimento, tecnologia e cuidado."
      />

      <section className="section">
        <div className="container intro-block">
          <div className="section-heading">
            <h2>Núcleo de Saúde Digital da Pessoa Idosa da Região Norte</h2>
          </div>

          <div className="about-copy">
            <p>
              O Núcleo de Saúde Digital da Pessoa Idosa da Região Norte, coordenado pela
              Fundação Universidade Aberta da Terceira Idade (FUnATI) em parceria com o
              Ministério da Saúde, constitui uma iniciativa pioneira voltada à ampliação do
              acesso à atenção especializada para a população idosa da Amazônia.
            </p>
            <p>
              O Núcleo Telessaúde atua como ponte entre a ciência, a gestão e a atenção
              em saúde, fortalecendo processos clínicos, educacionais e estratégicos em toda a
              rede.
            </p>
            <p>
              Com uma abordagem humanizada e orientada por dados, criamos soluções que ampliam o
              acesso, apoiam equipes profissionais e tornam a saúde mais eficiente, integrada e
              próxima da população.
            </p>
            <div className="about-actions">
              <a className="btn btn-primary" href="#/equipe">
                Conheça a equipe
              </a>
            </div>
          </div>
        </div>
      </section>
      </div>

      <section className="section about-section screen">
        <div className="container">
          <div className="purpose-panel">
            <div>
              <h2 className="about-heading">Nosso propósito</h2>
              <p className="purpose-text">
                Implantado em colaboração com o Ministério da Saúde, tem como propósito
                fortalecer a transformação digital da saúde, ampliar o acesso aos serviços para
                a pessoa idosa e apoiar a implementação de soluções tecnológicas inovadoras
                para o SUS na Região Norte.
              </p>
            </div>

            <div className="purpose-list">
              {purposeItems.map((item) => (
                <div key={item.text} className="purpose-row">
                  <div className="purpose-icon" aria-hidden="true">
                    <svg
                    viewBox="0 0 24 24"
                    width="26"
                    height="26"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                      {item.icon.map((d) => (
                        <path key={d} d={d} />
                      ))}
                    </svg>
                  </div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section about-section screen">
        <div className="container">
          <div className="center-head">
            <h2 className="about-heading">Nossos serviços</h2>
            {/* TODO: confirmar este texto com o Núcleo. */}
            <p className="purpose-text">
              Nossos serviços de telessaúde apoiam profissionais, equipes e gestores com
              orientação especializada, diagnóstico à distância e formação continuada.
            </p>
          </div>

          <div className="service-showcase">
            {services.map((service) => (
              <div key={service.slug} className="purpose-item about-service">
                <div className="purpose-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="26"
                    height="26"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {service.icon.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a className="about-service-link" href={`#/servicos/${service.slug}`}>
                  Leia mais →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function TeamGroup({ group }: { group: (typeof teamGroups)[number] }) {
  return (
    <div className="team-group">
      <h3 className="team-group-title">{group.title}</h3>

      <div className="team-grid">
        {group.members.map((member) => (
          <article key={member.name} className="team-card">
            <div className="team-avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="40" height="40">
                <circle cx="12" cy="8.5" r="4" fill="currentColor" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function TeamPage() {
  const [firstGroup, ...otherGroups] = teamGroups

  return (
    <div className="page">
      <div className="screen-first">
      <PageHero
        title="Equipe"
        text="Conheça quem faz o Núcleo acontecer todos os dias."
      />

      <section className="section team-section">
        <div className="container">
          <div className="team-intro">
            <span className="team-kicker">Equipe</span>
            <h2 className="about-heading">Conheça nossa equipe</h2>
            {/* TODO: confirmar este texto de apresentação com o Núcleo. */}
            <p>
              Reunimos especialistas de várias áreas da saúde, como medicina, enfermagem,
              nutrição e psicologia, que trabalham lado a lado para levar teleconsultorias,
              telediagnóstico e tele-educação a quem precisa.
            </p>
            <p>Conheça abaixo quem lidera cada frente de trabalho.</p>
          </div>

          <TeamGroup group={firstGroup} />
        </div>
      </section>
      </div>

      <section className="section team-section screen">
        <div className="container">
          {otherGroups.map((group) => (
            <TeamGroup key={group.title} group={group} />
          ))}

          <div className="about-actions center-actions">
            <a className="btn btn-secondary" href="#/quem-somos">
              Voltar para Quem somos
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function SubserviceExplorer({ items }: { items: NonNullable<Service['subservices']> }) {
  const [activeId, setActiveId] = useState(items[0]!.id)
  const active = items.find((item) => item.id === activeId) ?? items[0]!
  const stats = servicosTele.find((item) => item.id === active.id)?.resumo ?? []

  return (
    <div className="subservice-explorer">
      <div className="subservice-grid" role="tablist" aria-label="Serviços de telediagnóstico">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === activeId}
            className={`subservice-card${item.id === activeId ? ' is-active' : ''}`}
            onClick={() => setActiveId(item.id)}
          >
            <span className="subservice-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {item.icon.map((d) => (
                  <path key={d} d={d} />
                ))}
              </svg>
            </span>
            <h3>{item.title}</h3>
            <span className="subservice-more">{item.id === activeId ? 'Selecionado' : 'Ver detalhes'}</span>
          </button>
        ))}
      </div>

      <div className="subservice-detail" role="tabpanel" key={active.id}>
        <h3>{active.title}</h3>
        <p>{active.text}</p>
        <dl className="subservice-stats">
          {active.where && (
            <div>
              <dt>Onde atua</dt>
              <dd>{active.where}</dd>
            </div>
          )}
          {stats.map((stat) => (
            <div key={stat.rotulo}>
              <dt>{stat.rotulo}</dt>
              <dd>{stat.valor}</dd>
            </div>
          ))}
        </dl>
        <a className="btn btn-primary" href="#/contato">
          Solicitar {active.title}
        </a>
      </div>
    </div>
  )
}

function ServicePage({ slug }: { slug: string }) {
  const service = services.find((item) => item.slug === slug)
  if (!service) return null

  const others = services.filter((item) => item.slug !== slug)

  const heading = (
    <div className="section-heading">
      <h2>{service.title}</h2>
    </div>
  )

  const copy = (
    <div className="about-copy">
      <p>{service.about}</p>
      <div className="about-actions">
        <a className="btn btn-primary" href={service.cta?.href ?? '#/contato'}>
          {service.cta?.label ?? 'Solicitar este serviço'}
        </a>
        <a className="btn btn-secondary" href="#inicio">
          Voltar ao início
        </a>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="screen-first">
      <PageHero title={service.title} text={service.text} section="Serviços" />

      <section className="section">
        {service.image ? (
          <div className="container service-feature">
            <figure className="service-photo">
              <img
                src={service.image.src}
                alt={service.image.alt}
                width={service.image.width}
                height={service.image.height}
                style={{ objectPosition: service.image.position, aspectRatio: service.image.aspect }}
              />
              <figcaption className="service-badge">
                <span className="service-badge-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {service.icon.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                </span>
                <span className="service-badge-text">
                  <strong>{service.title}</strong>
                  <small>{service.image.caption}</small>
                </span>
              </figcaption>
            </figure>

            <div className="service-feature-text">
              {heading}
              {copy}
            </div>
          </div>
        ) : (
          <div className="container intro-block">
            {heading}
            {copy}
          </div>
        )}
      </section>
      </div>

      {service.subservices && (
        <section className="section screen">
          <div className="container">
            <div className="section-heading">
              <h2>O que oferecemos em {service.title}</h2>
            </div>
            <SubserviceExplorer items={service.subservices} />
          </div>
        </section>
      )}

      <section className="section screen">
        <div className="container detail-grid">
          <article className="detail-card">
            <span className="info-tag">Para quem</span>
            <p>{service.audience}</p>

            {service.howItWorks && (
              <>
                <h3 className="detail-subtitle">Como funciona</h3>
                {service.howItWorks.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </>
            )}
          </article>

          <article className="detail-card">
            <span className="info-tag">Benefícios</span>
            <ul>
              {service.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>

            {service.challenges && (
              <>
                <h3 className="detail-subtitle">{service.challengesTitle ?? 'Desafios'}</h3>
                <p>{service.challenges}</p>
              </>
            )}
          </article>
        </div>
      </section>

      <section className="section screen screen-end">
        <div className="container">
          <div className="section-heading">
            <h2>Outros serviços</h2>
          </div>

          <div className="related-list">
            {others.map((item) => (
              <a key={item.slug} className="related-link" href={`#/servicos/${item.slug}`}>
                {item.title} <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

type ResearchAction = { label: string; href: string; primary?: boolean }

type ResearchPageProps = {
  title: string
  text: string
  /** Nome da seção no caminho de navegação; o padrão é "Pesquisa". */
  section?: string | null
  heading: string
  paragraphs: string[]
  actions: ResearchAction[]
  children: ReactNode
}

// Estrutura das páginas do menu Pesquisa: faixa do título + introdução na primeira tela,
// e o conteúdo (lista ou aviso) na tela seguinte.
function ResearchPage({
  title,
  text,
  section = 'Pesquisa',
  heading,
  paragraphs,
  actions,
  children,
}: ResearchPageProps) {
  return (
    <div className="page">
      <div className="screen-first">
        <PageHero title={title} text={text} section={section} />

        <section className="section">
          <div className="container intro-block">
            <div className="section-heading">
              <h2>{heading}</h2>
            </div>

            <div className="about-copy">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="about-actions">
                {actions.map((action) => (
                  <a
                    key={action.label}
                    className={`btn ${action.primary ? 'btn-primary' : 'btn-secondary'}`}
                    href={action.href}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="section section-alt screen screen-end">
        <div className="container">{children}</div>
      </section>
    </div>
  )
}

function Icon({ paths, size = 22 }: { paths: string[]; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

const contactIcons = {
  headset: [
    'M5 14v-2a7 7 0 0114 0v2',
    'M5 14h2.5v4H5a1 1 0 01-1-1v-2a1 1 0 011-1zM19 14h-2.5v4H19a1 1 0 001-1v-2a1 1 0 00-1-1z',
    'M17 18.5c0 1.4-1.6 2-4 2',
  ],
  mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'],
  phone: ['M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z'],
  pin: ['M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z', 'M12 12a2 2 0 100-4 2 2 0 000 4z'],
  clock: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M12 7v5l3 2'],
}

function ContactPage() {
  const [sent, setSent] = useState(false)

  // O site não tem servidor para receber mensagens: o envio abre o aplicativo de e-mail do
  // visitante com a mensagem pronta, endereçada ao e-mail do Núcleo (contactInfo.email).
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!contactInfo.email) return
    const data = new FormData(event.currentTarget)
    const field = (name: string) => String(data.get(name) ?? '').trim()
    const phone = field('telefone')
    const subject = field('assunto') || 'Contato pelo site'
    const body = [
      `Nome: ${field('nome')}`,
      `E-mail: ${field('email')}`,
      ...(phone ? [`Telefone: ${phone}`] : []),
      '',
      field('mensagem'),
    ].join('\n')

    window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const formEnabled = Boolean(contactInfo.email)

  // Só mostra o que estiver preenchido em `contactInfo`.
  const details: { icon: string[]; label: string; value: string; href?: string }[] = [
    ...(contactInfo.email
      ? [{ icon: contactIcons.mail, label: 'E-mail', value: contactInfo.email, href: `mailto:${contactInfo.email}` }]
      : []),
    ...(contactInfo.phone ? [{ icon: contactIcons.phone, label: 'Telefone', value: contactInfo.phone }] : []),
    ...(contactInfo.address ? [{ icon: contactIcons.pin, label: 'Endereço', value: contactInfo.address }] : []),
    ...(contactInfo.hours
      ? [{ icon: contactIcons.clock, label: 'Horário de atendimento', value: contactInfo.hours }]
      : []),
  ]

  return (
    <div className="page">
      <div className="screen-first">
        <PageHero title="Contato" text="Fale com a equipe do Núcleo." section={null} />

        <section className="section">
          <div className="container contact-grid">
            <aside
              className="contact-panel"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(var(--deep-rgb), 0.08) 0%, rgba(var(--deep-rgb), 0.22) 38%, rgba(var(--deep-rgb), 0.95) 78%), url(${contatoFoto})`,
              }}
            >
              <div className="contact-panel-body">
                <span className="contact-panel-icon">
                  <Icon paths={contactIcons.headset} size={28} />
                </span>
                <h2>Estamos aqui para ajudar</h2>
                <p>
                  Tire dúvidas, solicite um serviço ou proponha uma parceria. Escreva para a
                  equipe do Núcleo.
                </p>

                {details.length > 0 ? (
                  <ul className="contact-list">
                    {details.map((item) => (
                      <li key={item.label}>
                        <span className="contact-list-icon">
                          <Icon paths={item.icon} size={20} />
                        </span>
                        <span>
                          <small>{item.label}</small>
                          {item.href ? <a href={item.href}>{item.value}</a> : item.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="contact-soon">Em breve divulgaremos os nossos canais de atendimento.</p>
                )}
              </div>
            </aside>

            <div className="contact-card">
              <h2>Envie uma mensagem</h2>
              <p className="contact-card-text">
                Preencha o formulário abaixo para entrar em contato com a nossa equipe.
              </p>

              <form className="contact-form" onSubmit={handleSubmit}>
                <fieldset className="contact-fieldset" disabled={!formEnabled}>
                <div className="field-row">
                  <label className="field">
                    <span>
                      Nome completo <b aria-hidden="true">*</b>
                    </span>
                    <input
                      name="nome"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Seu nome completo"
                    />
                  </label>
                  <label className="field">
                    <span>
                      E-mail <b aria-hidden="true">*</b>
                    </span>
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="seu.email@exemplo.com"
                    />
                  </label>
                </div>

                <div className="field-row">
                  <label className="field">
                    <span>Telefone</span>
                    <input name="telefone" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" />
                  </label>
                  <label className="field">
                    <span>Assunto</span>
                    <input name="assunto" type="text" placeholder="Assunto da mensagem" />
                  </label>
                </div>

                <label className="field">
                  <span>
                    Mensagem <b aria-hidden="true">*</b>
                  </span>
                  <textarea
                    name="mensagem"
                    rows={5}
                    required
                    placeholder="Escreva sua mensagem aqui..."
                  />
                </label>

                <button type="submit" className="btn btn-primary contact-submit">
                  Enviar mensagem
                </button>
                </fieldset>

                <p className="form-note" role="status">
                  {!formEnabled
                    ? 'O envio de mensagens por este formulário será ativado em breve.'
                    : sent
                      ? `Abrimos o seu aplicativo de e-mail com a mensagem pronta. Se ele não abriu, escreva para ${contactInfo.email}.`
                      : 'Ao enviar, abriremos o seu aplicativo de e-mail com a mensagem pronta para você revisar.'}
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>

      {contactInfo.mapEmbedUrl && (
        <section className="section section-alt screen screen-end">
          <div className="container">
            <iframe
              className="contact-map"
              title="Localização do Núcleo no mapa"
              src={contactInfo.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      )}
    </div>
  )
}

function NewsCard({ item }: { item: (typeof news)[number] }) {
  return (
    <article className="info-card">
      <span className="info-tag">{item.tag}</span>
      <h3>{item.title}</h3>
      <time className="info-meta" dateTime={item.date}>
        {formatDate(item.date)}
      </time>
    </article>
  )
}

function NewsPage() {
  return (
    <ResearchPage
      title="Notícias"
      text="Novidades, eventos e o cronograma de tele-educação do Núcleo."
      section={null}
      heading="Acompanhe o que acontece no Núcleo"
      paragraphs={[
        'Aqui você encontra as novidades dos serviços de telessaúde, as webconferências e as demais atividades de tele-educação, com a data de cada uma.',
        'Novas notícias são publicadas nesta página à medida que as atividades acontecem.',
      ]}
      actions={[
        { label: 'Fale conosco', href: '#/contato', primary: true },
        { label: 'Ver publicações', href: '#/publicacoes' },
      ]}
    >
      <div className="info-grid">
        {latestNews.map((item) => (
          <NewsCard key={item.title} item={item} />
        ))}
      </div>
    </ResearchPage>
  )
}

function ProjectsPage() {
  return (
    <ResearchPage
      title="Projetos"
      text="Pesquisa, desenvolvimento e inovação em saúde digital."
      heading="Pesquisa e inovação a serviço do SUS"
      paragraphs={[
        'O Núcleo desenvolve e apoia iniciativas de pesquisa, desenvolvimento e inovação em saúde digital, com o propósito de apoiar soluções tecnológicas inovadoras para o SUS na Região Norte.',
        'Nesta página você acompanha os projetos do Núcleo. Os resultados que se transformam em materiais e produção científica ficam reunidos em Publicações.',
      ]}
      actions={[
        { label: 'Ver publicações', href: '#/publicacoes', primary: true },
        { label: 'Fale conosco', href: '#/contato' },
      ]}
    >
      {projects.length > 0 ? (
        <div className="info-grid">
          {projects.map((project) => (
            <article key={project.title} className="info-card">
              <span className="info-tag">{project.area}</span>
              <h3>{project.title}</h3>
              <p className="info-meta">{project.text}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="mascot mascot-acolhedor" aria-hidden="true" />
          <span className="info-tag">Em breve</span>
          <h3>Os projetos do Núcleo serão apresentados aqui</h3>
          <p>
            Estamos organizando as informações de cada projeto. Enquanto isso, conheça nossas
            publicações ou fale com a equipe.
          </p>
        </div>
      )}
    </ResearchPage>
  )
}

function PublicationsPage() {
  return (
    <ResearchPage
      title="Publicações"
      text="Materiais, boletins e produção científica do Núcleo."
      heading="Conhecimento produzido e compartilhado com a rede"
      paragraphs={[
        'Reunimos aqui os boletins informativos, os relatórios de atividades e a produção científica e técnica do Núcleo, para que profissionais, gestores e pesquisadores acompanhem o que construímos.',
        'Os materiais estão sendo organizados e serão disponibilizados em breve.',
      ]}
      actions={[
        { label: 'Ver projetos', href: '#/projetos', primary: true },
        { label: 'Fale conosco', href: '#/contato' },
      ]}
    >
      <div className="info-grid">
        {publications.map((item) => (
          <article key={item.title} className="info-card">
            <span className="info-tag">{item.type}</span>
            <h3>{item.title}</h3>
            <span className="info-meta">{item.year}</span>
          </article>
        ))}
      </div>
    </ResearchPage>
  )
}

/** Carrossel com os serviços do Núcleo: setas, rolagem por toque e avanço automático. */
function ServicesCarousel() {
  const track = useRef<HTMLDivElement>(null)
  const paused = useRef(false)

  const move = useCallback((direction: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.svc-card')
    const step = card ? card.offsetWidth + 20 : el.clientWidth
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    if (direction === 1 && end) el.scrollTo({ left: 0, behavior: 'smooth' })
    else if (direction === -1 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
    else el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => {
      if (!paused.current) move(1)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [move])

  return (
    <section id="servicos-carrossel" className="section svc-section">
      <div className="container">
        <div className="section-heading center">
          <h2>Serviços disponíveis para a rede de saúde.</h2>
        </div>

        <div
          className="svc-carousel"
          role="region"
          aria-roledescription="carrossel"
          aria-label="Serviços do Núcleo"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
          onFocus={() => (paused.current = true)}
          onBlur={() => (paused.current = false)}
        >
          <button type="button" className="carousel-arrow carousel-prev" aria-label="Serviço anterior" onClick={() => move(-1)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          <div className="svc-track" ref={track}>
            {services.map((service) => (
              <a key={service.slug} className="svc-card" href={`#/servicos/${service.slug}`}>
                <span className="svc-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {service.icon.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                </span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <span className="svc-more">
                  Saiba mais <span aria-hidden="true">→</span>
                </span>
              </a>
            ))}
          </div>

          <button type="button" className="carousel-arrow carousel-next" aria-label="Próximo serviço" onClick={() => move(1)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  const [slide, setSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const partnersTrack = useRef<HTMLDivElement>(null)
  const partnersPaused = useRef(false)

  // Setas: avançam um cartão por vez, em loop.
  const movePartners = useCallback((direction: 1 | -1) => {
    const track = partnersTrack.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('.partner-card')
    const step = card ? card.offsetWidth + 22 : track.clientWidth
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }, [])

  // Passa sozinho e sem parar (loop infinito); pausa com o mouse ou o foco em cima.
  // Os cartões são repetidos uma vez, e ao chegar na metade a posição volta ao início
  // sem que se perceba o salto.
  useEffect(() => {
    const track = partnersTrack.current
    if (!track) return undefined

    const speed = 0.6 // pixels por quadro (~36 px/s)
    let position = track.scrollLeft
    let frame = 0

    // Largura de uma volta completa = metade dos cartões (repetidos) + o espaço entre eles.
    const period = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      return (track.scrollWidth + gap) / 2
    }

    const tick = () => {
      const loop = period()
      if (loop > 0) {
        // O conteúdo se repete a cada volta, então o salto de volta é invisível.
        if (track.scrollLeft >= loop) {
          track.scrollLeft = track.scrollLeft - loop + 1
          position = track.scrollLeft
        } else if (track.scrollLeft <= 0) {
          // Voltou além do início (seta anterior ou arraste): vai para o fim da primeira volta.
          track.scrollLeft = loop - 1
          position = track.scrollLeft
        }
        if (!partnersPaused.current) {
          // Se a pessoa rolou, arrastou ou usou as setas, continua dali.
          if (Math.abs(track.scrollLeft - position) > 2) position = track.scrollLeft
          position += speed
          track.scrollLeft = position
        } else {
          position = track.scrollLeft
        }
      }
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    if (!autoplay) return undefined

    const timer = setTimeout(() => {
      setSlide((current) => (current + 1) % heroSlides.length)
    }, 7000)

    return () => clearTimeout(timer)
  }, [slide, autoplay])

  return (
    <>
      <section
        id="inicio"
        className="hero"
        aria-roledescription="carrossel"
        aria-label="Destaques"
      >
        <div className="container hero-grid">
          <div className="hero-text">
            <div className="hero-slide" key={slide}>
              <h1>
                <HighlightedTitle title={heroSlides[slide].title} highlight={heroSlides[slide].highlight} />
              </h1>
              <p className="hero-subtitle">{heroSlides[slide].text}</p>

              <div className="hero-actions">
                <a className="btn btn-primary" href={heroSlides[slide].primary.href}>
                  {heroSlides[slide].primary.label}
                </a>
                <a className="btn btn-outline" href={heroSlides[slide].secondary.href}>
                  {heroSlides[slide].secondary.label}
                </a>
              </div>
            </div>

            <div className="hero-dots" role="tablist" aria-label="Escolher destaque">
              {heroSlides.map((item, index) => (
                <button
                  key={item.eyebrow}
                  type="button"
                  role="tab"
                  aria-selected={index === slide}
                  aria-label={`Destaque ${index + 1}: ${item.eyebrow}`}
                  className={`hero-dot${index === slide ? ' is-active' : ''}`}
                  onClick={() => {
                    setAutoplay(false)
                    setSlide(index)
                  }}
                />
              ))}
            </div>
          </div>

          <figure className="hero-photo hero-slide" key={`foto-${slide}`}>
            <img src={heroSlides[slide].image} alt={heroSlides[slide].imageAlt} />
            <figcaption className="hero-tag">Tecnologia com presença humana.</figcaption>
          </figure>
        </div>

        <div className="container">
          <ul className="hero-services" aria-label="Serviços do Núcleo">
            {services.slice(0, 4).map((service) => (
              <li key={service.slug}>
                <a href={`#/servicos/${service.slug}`}>{service.title}</a>
              </li>
            ))}
          </ul>
        </div>

        <Waves bands={['lime', 'leaf', 'deep']} />
      </section>

      <section id="painel" className="section">
        <div className="container">
          <div className="section-heading center">
            <h2>Nossos números em saúde digital.</h2>
          </div>

          <div className="stats-grid">
            {stats.map((item) => (
              <div key={item.label} className="stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mascot-note" role="note">
            <span className="mascot mascot-explicando" aria-hidden="true" />
            <p>
              <strong>Números em atualização.</strong>
              Eles aparecem aqui quando forem confirmados pela equipe do Núcleo.
            </p>
          </div>

          <div className="muni-heading">
            <h3>Telediagnóstico no Amazonas</h3>
            <p>Veja quais municípios do Amazonas já contam com o telediagnóstico do Núcleo.</p>
          </div>
          <MunicipalMap />
        </div>
        <Waves bands={['leaf', 'lime', 'ivory']} />
      </section>

      <ServicesCarousel />

      <section id="publicacoes" className="section section-alt screen">
        <div className="container">
          <div className="section-heading center">
            <h2>Materiais, boletins e produção científica do Núcleo.</h2>
          </div>

          <div className="info-grid">
            {publications.map((item) => (
              <article key={item.title} className="info-card">
                <span className="info-tag">{item.type}</span>
                <h3>{item.title}</h3>
                <span className="info-meta">{item.year}</span>
              </article>
            ))}
          </div>

          <div className="about-actions center-actions partners-cta">
            <a className="btn btn-secondary" href="#/publicacoes">
              Ver todas as publicações
            </a>
          </div>
        </div>
      </section>

      <section id="noticias" className="section screen">
        <div className="container">
          <div className="section-heading center">
            <h2>Últimas notícias</h2>
          </div>

          <div className="info-grid">
            {latestNews.slice(0, 3).map((item) => (
              <NewsCard key={item.title} item={item} />
            ))}
          </div>

          <div className="about-actions center-actions partners-cta">
            <a className="btn btn-secondary" href="#/noticias">
              Ver todas as notícias
            </a>
          </div>
        </div>
      </section>

      <section id="depoimentos" className="section section-alt screen">
        <div className="container">
          <div className="section-heading center">
            <h2>Quem vive a transformação percebe a diferença.</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.author} className="testimonial-card">
                <p>“{testimonial.quote}”</p>
                <footer>{testimonial.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="parcerias" className="section screen screen-end">
        <div className="container">
          <div className="section-heading center">
            <h2>Parcerias que fortalecem a telessaúde.</h2>
          </div>

          <div
            className="partner-carousel"
            role="region"
            aria-roledescription="carrossel"
            aria-label="Parceiros"
            onMouseEnter={() => (partnersPaused.current = true)}
            onMouseLeave={() => (partnersPaused.current = false)}
            onFocus={() => (partnersPaused.current = true)}
            onBlur={() => (partnersPaused.current = false)}
          >
            <button
              type="button"
              className="carousel-arrow carousel-prev"
              aria-label="Parceiro anterior"
              onClick={() => movePartners(-1)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>

            <div className="partner-track" ref={partnersTrack}>
              {[...partnerSlides, ...partnerSlides].map((partner, index) => (
                <article
                  key={`${partner.name}-${index}`}
                  className="info-card partner-card"
                  aria-hidden={index >= partnerSlides.length ? true : undefined}
                >
                  {partner.logo ? (
                    <div className="partner-logo">
                      {partner.tinted ? (
                        <span
                          className="logo-tinted"
                          role="img"
                          aria-label={`Logo ${partner.name}`}
                          style={{ ['--logo' as string]: `url(${partner.logo})` }}
                        />
                      ) : (
                        <img src={partner.logo} alt={`Logo ${partner.name}`} />
                      )}
                    </div>
                  ) : (
                  <div className="service-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      width="30"
                      height="30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {partner.icon.map((d) => (
                        <path key={d} d={d} />
                      ))}
                    </svg>
                  </div>
                  )}
                  <span className="info-tag">{partner.tag}</span>
                  <h3>{partner.name}</h3>
                  <p>{partner.text}</p>
                  {partner.href && (
                    <a
                      className="partner-link"
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visitar site <span aria-hidden="true">→</span>
                    </a>
                  )}
                </article>
              ))}
            </div>

            <button
              type="button"
              className="carousel-arrow carousel-next"
              aria-label="Próximo parceiro"
              onClick={() => movePartners(1)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="about-actions center-actions partners-cta">
            <a className="btn btn-primary" href="#/contato">
              Quero ser parceiro
            </a>
          </div>
        </div>
      </section>

    </>
  )
}

/**
 * Rola até o topo com animação própria. O `scroll-behavior: smooth` nativo é interrompido
 * em páginas longas com animações, e por isso o botão não chegava ao topo.
 */
function scrollToTop(duration: number) {
  const start = window.scrollY
  if (start <= 0) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    window.scrollTo({ top: 0, behavior: 'instant' })
    return
  }

  const begin = performance.now()
  let stopped = false
  const stop = () => {
    stopped = true
  }
  window.addEventListener('wheel', stop, { once: true, passive: true })
  window.addEventListener('touchstart', stop, { once: true, passive: true })

  const step = (now: number) => {
    if (stopped) return
    const t = Math.min((now - begin) / duration, 1)
    const eased = 1 - Math.pow(1 - t, 3)
    window.scrollTo({ top: start * (1 - eased), behavior: 'instant' })
    if (t < 1) window.requestAnimationFrame(step)
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }
  window.requestAnimationFrame(step)
}

/** Botão que leva de volta ao topo; aparece quando o visitante chega perto do fim da página. */
function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [launching, setLaunching] = useState(false)

  useEffect(() => {
    const update = () => {
      const { scrollY, innerHeight } = window
      const total = document.documentElement.scrollHeight
      setVisible(scrollY > 400 && scrollY + innerHeight >= total - 320)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' is-visible' : ''}${launching ? ' is-launching' : ''}`}
      aria-label="Voltar ao topo"
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        setLaunching(true)
        scrollToTop(900)
        window.setTimeout(() => setLaunching(false), 900)
      }}
    >
      <span className="back-to-top-pulse" aria-hidden="true" />
      <svg className="back-to-top-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 13h3.5l2-5 3 9 2.5-7 1.5 3H21" className="back-to-top-ecg" />
        <path d="M12 8V3M9.5 5.5L12 3l2.5 2.5" />
      </svg>
      <span className="back-to-top-label">Voltar ao topo</span>
    </button>
  )
}

function App() {
  const [route, setRoute] = useState<Route>(getRoute)
  const [active, setActive] = useState('inicio')
  const [menuOpen, setMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false })
  const navRef = useRef<HTMLElement>(null)
  const suppressHide = useRef(0)

  useEffect(() => {
    const onHashChange = () => {
      // Depois de clicar em um link, a barra continua visível durante a rolagem.
      suppressHide.current = Date.now() + 1500
      setRoute(getRoute())
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // O submenu fecha ao clicar fora da barra ou ao pressionar Esc.
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.nav-item')) setOpenSubmenu(null)
    }
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setOpenSubmenu(null)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const toggleSubmenu = (label: string) =>
    setOpenSubmenu((current) => (current === label ? null : label))

  // Ao trocar de tela, volta ao topo; ao voltar para a home por um link de seção, rola até ela.
  useEffect(() => {
    if (route !== 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    const target = window.location.hash.slice(1)
    const el = target ? document.getElementById(target) : null
    if (el) el.scrollIntoView({ behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [route])

  useEffect(() => {
    if (route !== 'home') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [route])

  const current = route === 'home' ? active : route

  // A barra fica mais sólida ao rolar, some ao descer e volta ao subir.
  // O movimento é acumulado por direção, para pequenos tremores do
  // mouse/touchpad não fazerem a barra piscar.
  useEffect(() => {
    let lastY = window.scrollY
    let travelled = 0
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const y = Math.max(window.scrollY, 0)
        const delta = y - lastY
        lastY = y

        setScrolled(y > 24)

        // Reinicia o acumulado quando a direção muda.
        if (delta !== 0 && Math.sign(delta) !== Math.sign(travelled)) travelled = 0
        travelled += delta

        if (Date.now() < suppressHide.current || y <= 160) {
          setHidden(false)
          travelled = 0
        } else if (travelled > 90) {
          setHidden(true)
        } else if (travelled < -36) {
          setHidden(false)
        }
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Destaque que desliza entre os itens do menu.
  const placeIndicator = useCallback((el: HTMLElement | null | undefined) => {
    if (!el) {
      setIndicator((previous) => ({ ...previous, visible: false }))
      return
    }
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, visible: true })
  }, [])

  const resetIndicator = useCallback(() => {
    placeIndicator(navRef.current?.querySelector<HTMLElement>('.nav-item.is-active'))
  }, [placeIndicator])

  useLayoutEffect(() => {
    resetIndicator()
  }, [current, resetIndicator])

  useEffect(() => {
    window.addEventListener('resize', resetIndicator)
    document.fonts?.ready.then(resetIndicator)
    return () => window.removeEventListener('resize', resetIndicator)
  }, [resetIndicator])

  const isActive = (item: NavItem) =>
    item.id === current ||
    item.match?.includes(current) ||
    item.children?.some((child) => child.id === current)

  return (
    <div className="page-shell" id="top">
      <header
        className={`topbar${scrolled ? ' is-scrolled' : ''}${
          hidden && !menuOpen && !openSubmenu ? ' is-hidden' : ''
        }`}
      >
        <div className="topbar-inner">
          <a className="brand" href="#inicio" aria-label="Núcleo de Telessaúde FUnATI, página inicial">
            <span
              className="brand-logo"
              aria-hidden="true"
              style={{ '--logo': `url(${logoBranca})` } as CSSProperties}
            />
          </a>

          <button
            type="button"
            className="nav-toggle"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            ref={navRef}
            className={`main-nav${menuOpen ? ' is-open' : ''}`}
            aria-label="Menu principal"
            onMouseLeave={resetIndicator}
          >
            <span
              className="nav-indicator"
              aria-hidden="true"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.visible ? 1 : 0,
              }}
            />

            {navigation.map((item) => (
              <div
                key={item.label}
                className={`nav-item${item.children ? ' has-submenu' : ''}${
                  isActive(item) ? ' is-active' : ''
                }${openSubmenu === item.label ? ' is-open' : ''}`}
                onMouseEnter={(event) => placeIndicator(event.currentTarget)}
                onFocus={(event) => placeIndicator(event.currentTarget)}
              >
                <a
                  {...(item.children
                    ? {
                        role: 'button',
                        tabIndex: 0,
                        'aria-haspopup': 'true' as const,
                        'aria-expanded': openSubmenu === item.label,
                        onClick: () => toggleSubmenu(item.label),
                        onKeyDown: (event: KeyboardEvent<HTMLAnchorElement>) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            toggleSubmenu(item.label)
                          }
                        },
                      }
                    : {
                        href: hrefOf(item),
                        'aria-current': isActive(item) ? 'page' : undefined,
                        onClick: () => setMenuOpen(false),
                      })}
                >
                  {item.label}
                  {item.children && (
                    <svg
                      className="nav-caret"
                      viewBox="0 0 12 12"
                      width="10"
                      height="10"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 4.5l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </a>

                {item.children && (
                  <ul className={`submenu${item.wide ? ' submenu-wide' : ''}`}>
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={hrefOf(child)}
                          onClick={() => {
                            setOpenSubmenu(null)
                            setMenuOpen(false)
                          }}
                        >
                          <span className="sub-icon" aria-hidden="true">
                            <svg
                              viewBox="0 0 24 24"
                              width="20"
                              height="20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              {child.icon.map((d) => (
                                <path key={d} d={d} />
                              ))}
                            </svg>
                          </span>
                          <span className="sub-text">
                            <strong>{child.label}</strong>
                            <small>{child.short}</small>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {route === 'quem-somos' && <AboutPage />}
        {route === 'equipe' && <TeamPage />}
        {route === 'projetos' && <ProjectsPage />}
        {route === 'publicacoes' && <PublicationsPage />}
        {route === 'noticias' && <NewsPage />}
        {route === 'contato' && <ContactPage />}
        {route.startsWith('servico:') && <ServicePage slug={route.slice('servico:'.length)} />}
        {route === 'home' && <HomePage />}
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="brand">
              <img
                className="brand-mark"
                src={logoBranca}
                alt="Núcleo de Telessaúde FUnATI"
              />
            </div>
            <p className="footer-text">
              Tecnologia para fortalecer a saúde pública, conectar pessoas e ampliar acesso à atenção.
            </p>
          </div>

          <div className="footer-links">
            <h3>Institucional</h3>
            <ul>
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Contato</h3>
            {contactInfo.email || contactInfo.phone || contactInfo.address ? (
              <ul>
                {contactInfo.email && (
                  <li>
                    E-mail: <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                  </li>
                )}
                {contactInfo.phone && <li>Telefone: {contactInfo.phone}</li>}
                {contactInfo.address && <li>Endereço: {contactInfo.address}</li>}
              </ul>
            ) : (
              <ul>
                <li>Em breve divulgaremos os nossos canais de atendimento.</li>
              </ul>
            )}

            <div className="footer-social" aria-label="Redes sociais">
              {socials.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 Núcleo de Telessaúde FUnATI</span>
          <span>Desenvolvido com tecnologia para a saúde</span>
        </div>
      </footer>

      <BackToTop />
    </div>
  )
}

export default App
