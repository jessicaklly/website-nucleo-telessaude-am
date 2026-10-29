import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import logoBranca from './assets/logo-pessoa-idosa-branca.png'
import './App.css'

// TODO: confirmar os textos de cada serviço com o Núcleo antes de publicar.
const services = [
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
    ],
    icon: ['M4 5.5h16v10.5H10l-4.5 3.5V16H4z', 'M12 8.2v4.6M9.7 10.5h4.6'],
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
    ],
    icon: [
      'M5 14v-2a7 7 0 0114 0v2',
      'M5 14h2.5v4H5a1 1 0 01-1-1v-2a1 1 0 011-1zM19 14h-2.5v4H19a1 1 0 001-1v-2a1 1 0 00-1-1z',
      'M17 18.5c0 1.4-1.6 2-4 2',
    ],
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
    ],
    icon: ['M3.5 5h17v11h-17zM9 20h6M12 16v4', 'M6 10.5h3l1.5-2.5 2.5 5 1.5-2.5H18'],
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
    ],
    icon: [
      'M2.5 9.5L12 5l9.5 4.5L12 14z',
      'M6.5 11.5v4.2c0 1.2 2.5 2.8 5.5 2.8s5.5-1.6 5.5-2.8v-4.2M21.5 9.5v5',
    ],
  },
  {
    slug: 'segunda-opiniao-formativa',
    title: 'Segunda Opinião Formativa',
    text: 'Respostas baseadas em evidências a perguntas frequentes, com caráter educativo para a rede.',
    about:
      'A Segunda Opinião Formativa (SOF) é uma resposta sistematizada, baseada em evidências científicas, às perguntas mais frequentes das teleconsultorias, com caráter educativo e disponível para toda a rede.',
    audience: 'Profissionais de saúde da rede.',
    benefits: [
      'Respostas baseadas em evidências',
      'Consulta aberta a toda a rede',
      'Apoio à educação permanente',
    ],
    icon: [
      'M12 6.5C10.5 5.3 8 4.8 4 5v12.5c4-.2 6.5.3 8 1.5 1.5-1.2 4-1.7 8-1.5V5c-4-.2-6.5.3-8 1.5z',
      'M12 6.5V19',
    ],
  },
]

const serviceShort = {
  teleconsultoria: 'Apoio de especialistas às equipes',
  teleatendimento: 'Atendimento remoto no SUS',
  telediagnostico: 'Laudos e pareceres à distância',
  'tele-educacao': 'Cursos e webconferências',
  'segunda-opiniao-formativa': 'Respostas baseadas em evidências',
}

const navigation = [
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
    id: 'solucoes',
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
    id: 'publicacoes',
    children: [
      {
        label: 'Publicações',
        short: 'Materiais e produção científica',
        id: 'publicacoes',
        icon: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M10 13h6M10 17h6'],
      },
      {
        label: 'Painel de Dados',
        short: 'Nossos números',
        id: 'painel',
        icon: ['M4 20V10M10 20V4M16 20v-7', 'M2 20h20'],
      },
    ],
  },
  { label: 'Notícias', id: 'noticias' },
  { label: 'Contato', id: 'contato' },
]

const hrefOf = (item) => item.href ?? `#${item.id}`

const footerLinks = [
  { label: 'Quem somos', href: '#/quem-somos' },
  { label: 'Equipe', href: '#/equipe' },
  { label: 'Serviços', href: '#solucoes' },
  { label: 'Notícias', href: '#noticias' },
  { label: 'Contato', href: '#contato' },
]

// TODO: colocar os endereços reais das redes sociais do Núcleo.
const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'YouTube', href: '#' },
]

const pages = {
  'quem-somos': '#/quem-somos',
  equipe: '#/equipe',
}

const getRoute = () => {
  const { hash } = window.location
  const found = Object.entries(pages).find(([, pageHash]) => pageHash === hash)
  if (found) return found[0]

  const match = hash.match(/^#\/servicos\/(.+)$/)
  if (match && services.some((service) => service.slug === match[1])) {
    return `servico:${match[1]}`
  }

  return 'home'
}

const sectionIds = [
  'inicio',
  'solucoes',
  'painel',
  'publicacoes',
  'noticias',
  'depoimentos',
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

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const heroSlides = [
  {
    eyebrow: 'Quem somos',
    title: 'Núcleo de Saúde Digital da Pessoa Idosa - FUnATI',
    text: 'Iniciativa pioneira da FUnATI, em parceria com o Ministério da Saúde, para ampliar o acesso da população idosa da Amazônia à atenção especializada.',
    primary: { label: 'Conheça nossa história', href: '#/quem-somos' },
    secondary: { label: 'Conheça nossa equipe', href: '#/equipe' },
  },
  {
    eyebrow: 'Teleconsultoria',
    title: 'Apoio de especialistas à distância',
    text: 'Esclareça dúvidas clínicas e de processo de trabalho com especialistas, ampliando o acesso e reduzindo deslocamentos.',
    primary: { label: 'Conheça a teleconsultoria', href: '#solucoes' },
    secondary: { label: 'Fale conosco', href: '#contato' },
  },
  {
    eyebrow: 'Telediagnóstico',
    title: 'Exames analisados à distância por especialistas',
    text: 'Laudos e pareceres que agilizam o diagnóstico e aproximam o cuidado especializado das equipes de saúde.',
    primary: { label: 'Conheça o telediagnóstico', href: '#solucoes' },
    secondary: { label: 'Fale conosco', href: '#contato' },
  },
  {
    eyebrow: 'Tele-educação',
    title: 'Aprender em rede, onde você estiver',
    text: 'Webconferências, cursos e capacitações para a atualização contínua de equipes e gestores.',
    primary: { label: 'Conheça a tele-educação', href: '#solucoes' },
    secondary: { label: 'Veja as notícias', href: '#noticias' },
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

function PageHero({ title, text, section = 'Institucional' }) {
  return (
    <section className="page-hero">
      <div className="container">
        <nav className="breadcrumb" aria-label="Você está em">
          <a href="#inicio">Início</a>
          <span aria-hidden="true">/</span>
          <span>{section}</span>
          <span aria-hidden="true">/</span>
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
      <PageHero
        title="Quem somos"
        text="Conectando conhecimento, tecnologia e cuidado."
      />

      <section className="section">
        <div className="container intro-block">
          <div className="section-heading">
            <span className="eyebrow">Nossa história</span>
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
              O Núcleo Telessaúde Amazonas atua como ponte entre a ciência, a gestão e a atenção
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

      <section className="section about-section">
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

      <section className="section about-section">
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

function TeamPage() {
  return (
    <div className="page">
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

          {teamGroups.map((group) => (
            <div key={group.title} className="team-group">
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

function ServicePage({ slug }) {
  const service = services.find((item) => item.slug === slug)
  const others = services.filter((item) => item.slug !== slug)

  return (
    <div className="page">
      <PageHero title={service.title} text={service.text} section="Serviços" />

      <section className="section">
        <div className="container intro-block">
          <div className="section-heading">
            <span className="eyebrow">O que é</span>
            <h2>{service.title}</h2>
          </div>

          <div className="about-copy">
            <p>{service.about}</p>
            <div className="about-actions">
              <a className="btn btn-primary" href="#contato">
                Solicitar este serviço
              </a>
              <a className="btn btn-secondary" href="#solucoes">
                Ver todos os serviços
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container detail-grid">
          <article className="detail-card">
            <span className="info-tag">Para quem</span>
            <p>{service.audience}</p>
          </article>

          <article className="detail-card">
            <span className="info-tag">Benefícios</span>
            <ul>
              {service.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Veja também</span>
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

function HomePage() {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = setTimeout(() => {
      setSlide((current) => (current + 1) % heroSlides.length)
    }, 7000)

    return () => clearTimeout(timer)
  }, [slide])

  return (
    <>
      <section
        id="inicio"
        className="hero"
        aria-roledescription="carrossel"
        aria-label="Destaques"
      >
        <div className="hero-slide" key={slide}>
          <div className="container hero-content">
            <h1>{heroSlides[slide].title}</h1>
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
        </div>

        <div className="container hero-dots" role="tablist" aria-label="Escolher destaque">
          {heroSlides.map((item, index) => (
            <button
              key={item.eyebrow}
              type="button"
              role="tab"
              aria-selected={index === slide}
              aria-label={`Destaque ${index + 1}: ${item.eyebrow}`}
              className={`hero-dot${index === slide ? ' is-active' : ''}`}
              onClick={() => setSlide(index)}
            />
          ))}
        </div>
      </section>

      <section className="trust-bar">
        <div className="container trust-inner">
          <p>Parceiros e redes de atenção</p>
          <div className="trust-logos" aria-label="Redes e parceiros">
            <span>SES-AM</span>
            <span>MS</span>
            <span>Unidades</span>
            <span>Rede de Saúde</span>
            <span>Especialistas</span>
          </div>
        </div>
      </section>

      <section id="solucoes" className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow eyebrow-plain">Serviços</span>
            <h2 className="title-underline">
              Nossos <span>Serviços</span>
            </h2>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <a key={service.slug} className="service-card" href={`#/servicos/${service.slug}`}>
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
                    {service.icon.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                </div>
                <h3>{service.title}</h3>
                <span className="service-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="painel" className="section">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">Painel de Dados</span>
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
        </div>
      </section>

      <section id="publicacoes" className="section section-alt">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">Publicações</span>
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
        </div>
      </section>

      <section id="noticias" className="section">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">Notícias</span>
            <h2>Acompanhe as novidades e o cronograma de tele-educação.</h2>
          </div>

          <div className="info-grid">
            {news.map((item) => (
              <article key={item.title} className="info-card">
                <span className="info-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <time className="info-meta" dateTime={item.date}>
                  {formatDate(item.date)}
                </time>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="depoimentos" className="section section-alt">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">Depoimentos</span>
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

      <section id="contato" className="cta-section">
        <div className="container cta-box">
          <div>
            <span className="eyebrow">Vamos conversar</span>
            <h2>Precisando de uma solução de saúde digital mais integrada?</h2>
          </div>

          <a className="btn btn-primary" href="mailto:contato@nucleotelessaude.am.gov.br">
            Solicitar atendimento
          </a>
        </div>
      </section>
    </>
  )
}

function App() {
  const [route, setRoute] = useState(getRoute)
  const [active, setActive] = useState('inicio')
  const [menuOpen, setMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false })
  const navRef = useRef(null)
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
    const onPointerDown = (event) => {
      if (!event.target.closest('.nav-item')) setOpenSubmenu(null)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpenSubmenu(null)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const toggleSubmenu = (label) =>
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

  // A barra fica compacta ao rolar e some ao descer, voltando ao subir.
  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 24)
        if (Date.now() < suppressHide.current) setHidden(false)
        else if (y > lastY + 6 && y > 220) setHidden(true)
        else if (y < lastY - 6 || y <= 220) setHidden(false)
        lastY = y
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Destaque que desliza entre os itens do menu.
  const placeIndicator = useCallback((el) => {
    if (!el) {
      setIndicator((previous) => ({ ...previous, visible: false }))
      return
    }
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, visible: true })
  }, [])

  const resetIndicator = useCallback(() => {
    placeIndicator(navRef.current?.querySelector('.nav-item.is-active'))
  }, [placeIndicator])

  useLayoutEffect(() => {
    resetIndicator()
  }, [current, resetIndicator])

  useEffect(() => {
    window.addEventListener('resize', resetIndicator)
    document.fonts?.ready.then(resetIndicator)
    return () => window.removeEventListener('resize', resetIndicator)
  }, [resetIndicator])

  const isActive = (item) =>
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
          <a className="brand" href="#inicio">
            <img
              className="brand-mark"
              src={logoBranca}
              alt="Núcleo de Saúde Digital da Pessoa Idosa - FUnATI"
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
                        'aria-haspopup': 'true',
                        'aria-expanded': openSubmenu === item.label,
                        onClick: () => toggleSubmenu(item.label),
                        onKeyDown: (event) => {
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
                          onClick={() => setOpenSubmenu(item.label)}
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
                alt="Núcleo de Saúde Digital da Pessoa Idosa - FUnATI"
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
            <ul>
              <li>
                E-mail:{' '}
                <a href="mailto:contato@nucleotelessaude.am.gov.br">
                  contato@nucleotelessaude.am.gov.br
                </a>
              </li>
              <li>Telefone: (92) 0000-0000</li>
              <li>Endereço: Manaus, Amazonas</li>
            </ul>

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
          <span>© 2026 Núcleo Telessaúde Amazonas</span>
          <span>Desenvolvido com tecnologia para a saúde</span>
        </div>
      </footer>
    </div>
  )
}

export default App
