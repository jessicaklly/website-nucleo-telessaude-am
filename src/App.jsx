import { useEffect, useState } from 'react'
import logo from './assets/logo-nucleo.png'
import './App.css'

const navigation = [
  {
    label: 'Sobre',
    id: 'sobre',
    children: [
      { label: 'Quem somos', id: 'sobre' },
      { label: 'Como trabalhamos', id: 'processo' },
    ],
  },
  {
    label: 'Soluções',
    id: 'solucoes',
    children: [
      { label: 'Teleconsultoria', id: 'solucoes' },
      { label: 'Teleatendimento', id: 'solucoes' },
      { label: 'Telediagnóstico', id: 'solucoes' },
      { label: 'Tele-educação', id: 'solucoes' },
      { label: 'Segunda Opinião Formativa', id: 'solucoes' },
    ],
  },
  { label: 'Painel de Dados', id: 'painel' },
  { label: 'Publicações', id: 'publicacoes' },
  { label: 'Notícias', id: 'noticias' },
  { label: 'Contato', id: 'contato' },
]

const sectionIds = [
  'sobre',
  'solucoes',
  'processo',
  'painel',
  'publicacoes',
  'noticias',
  'depoimentos',
  'contato',
]

// TODO: substituir pelos números reais do Núcleo antes de publicar.
const stats = [
  { value: '—', label: 'teleconsultorias realizadas' },
  { value: '—', label: 'municípios atendidos' },
  { value: '—', label: 'profissionais cadastrados' },
  { value: '—', label: 'exames laudados à distância' },
]

const services = [
  {
    title: 'Teleconsultoria',
    text: 'Apoio de especialistas para esclarecer dúvidas clínicas e de processo de trabalho, ampliando o acesso e reduzindo deslocamentos.',
  },
  {
    title: 'Teleatendimento',
    text: 'Atendimento remoto a usuários do SUS, conectando a população a profissionais e serviços de saúde.',
  },
  {
    title: 'Telediagnóstico',
    text: 'Laudos e pareceres à distância, como tele-ECG e teledermatologia, para agilizar o diagnóstico.',
  },
  {
    title: 'Tele-educação',
    text: 'Webconferências, cursos e capacitações gratuitas para a atualização de equipes e gestores.',
  },
  {
    title: 'Segunda Opinião Formativa',
    text: 'Respostas baseadas em evidências a perguntas frequentes, com caráter educativo para a rede.',
  },
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

const process = [
  'Diagnóstico da demanda e objetivos da instituição',
  'Planejamento estratégico com ações e indicadores claros',
  'Implementação dos serviços e suporte operacional',
  'Acompanhamento contínuo e melhoria de resultados',
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

function App() {
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
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
  }, [])

  const isActive = (item) =>
    item.id === active || item.children?.some((child) => child.id === active)

  return (
    <div className="page-shell" id="top">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#top">
            <img className="brand-mark" src={logo} alt="FUnATI - Núcleo Telessaúde Amazonas" />
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
            className={`main-nav${menuOpen ? ' is-open' : ''}`}
            aria-label="Menu principal"
          >
            {navigation.map((item) => (
              <div
                key={item.label}
                className={`nav-item${item.children ? ' has-submenu' : ''}${
                  isActive(item) ? ' is-active' : ''
                }`}
              >
                <a
                  href={`#${item.id}`}
                  aria-current={isActive(item) ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
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
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </a>

                {item.children && (
                  <ul className="submenu">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <a href={`#${child.id}`} onClick={() => setMenuOpen(false)}>
                          {child.label}
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
        <section className="hero">
          <div className="container hero-content">
            <h1>
              Núcleo <span className="hero-accent">Telessaúde Amazonas</span>
            </h1>
            <p className="hero-subtitle">
              Conectando profissionais de saúde e compartilhando conhecimento.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#solucoes">
                Conheça nossas soluções <span aria-hidden="true">→</span>
              </a>
              <a className="btn btn-light" href="#sobre">
                Sobre o Núcleo
              </a>
            </div>
          </div>

          <p className="hero-tagline">
            Fortalecendo a <strong>saúde</strong>
            <br />
            através da <strong>tecnologia</strong>
          </p>
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

        <section id="sobre" className="section">
          <div className="container intro-block">
            <div className="section-heading">
              <span className="eyebrow">Quem somos</span>
              <h2>Conectando conhecimento, tecnologia e cuidado.</h2>
            </div>

            <div className="about-copy">
              <p>
                O Núcleo Telessaúde Amazonas atua como ponte entre a ciência, a gestão e a
                atenção em saúde, fortalecendo processos clínicos, educacionais e estratégicos
                em toda a rede.
              </p>
              <p>
                Com uma abordagem humanizada e orientada por dados, criamos soluções que ampliam
                o acesso, apoiam equipes profissionais e tornam a saúde mais eficiente, integrada
                e próxima da população.
              </p>
            </div>
          </div>
        </section>

        <section id="solucoes" className="section section-alt">
          <div className="container">
            <div className="section-heading center">
              <span className="eyebrow">Soluções</span>
              <h2>Estruturas pensadas para fortalecer a atenção em saúde.</h2>
            </div>

            <div className="services-grid">
              {services.map((service) => (
                <article key={service.title} className="service-card">
                  <div className="service-icon" aria-hidden="true">
                    ▣
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="processo" className="section">
          <div className="container">
            <div className="section-heading center">
              <span className="eyebrow">Como trabalhamos</span>
              <h2>Um processo simples, estruturado e focado em resultados.</h2>
            </div>

            <div className="steps-grid">
              {process.map((step, index) => (
                <div key={step} className="step-item">
                  <span className="step-number">0{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="painel" className="section section-alt">
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

        <section id="publicacoes" className="section">
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

        <section id="noticias" className="section section-alt">
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

        <section id="depoimentos" className="section">
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
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="brand">
              <img className="brand-mark" src={logo} alt="FUnATI - Núcleo Telessaúde Amazonas" />
            </div>
            <p className="footer-text">
              Tecnologia para fortalecer a saúde pública, conectar pessoas e ampliar acesso à atenção.
            </p>
          </div>

          <div className="footer-links">
            <h3>Menu</h3>
            <ul>
              {navigation.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Contato</h3>
            <ul>
              <li>contato@nucleotelessaude.am.gov.br</li>
              <li>(92) 0000-0000</li>
              <li>Manaus, Amazonas</li>
            </ul>
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
