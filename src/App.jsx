import './App.css'

const navigation = [
  { label: 'Sobre', id: 'sobre' },
  { label: 'Serviços', id: 'servicos' },
  { label: 'Processo', id: 'processo' },
  { label: 'Depoimentos', id: 'depoimentos' },
  { label: 'Contato', id: 'contato' },
]

const stats = [
  { value: '25+', label: 'anos de experiência em saúde digital' },
  { value: '180+', label: 'municípios apoiados em rede' },
  { value: '24/7', label: 'atendimento e suporte clínico' },
  { value: '96%', label: 'satisfação em projetos implementados' },
]

const services = [
  {
    title: 'Teleconsultoria',
    text: 'Atendimento remoto com apoio de especialistas para ampliar acesso e reduzir filas e deslocamentos.',
  },
  {
    title: 'Educação em saúde',
    text: 'Capacitações, treinamentos e materiais de apoio para equipes e profissionais em campo.',
  },
  {
    title: 'Gestão de dados',
    text: 'Organização de indicadores, relatórios e dashboards para decisões mais ágeis e estratégicas.',
  },
  {
    title: 'Integração tecnológica',
    text: 'Implementação de plataformas, canais digitais e fluxos de comunicação entre as redes de atenção.',
  },
]

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
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand" aria-label="Núcleo Telessaúde Amazonas">
            <span className="brand-mark">NT</span>
            <div>
              <strong>Núcleo Telessaúde</strong>
              <small>Amazonas</small>
            </div>
          </div>

          <nav className="main-nav" aria-label="Menu principal">
            {navigation.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>

          <a className="btn btn-primary" href="#contato">
            Fale conosco
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Saúde conectada e acessível</span>
              <h1>Transformando cuidado em saúde com tecnologia e inteligência.</h1>
              <p>
                Apoiamos instituições, redes de atenção e profissionais com soluções digitais
                para ampliar acesso, integrar saberes e fortalecer a qualidade do cuidado.
              </p>

              <div className="hero-actions">
                <a className="btn btn-primary" href="#servicos">
                  Conhecer soluções
                </a>
                <a className="btn btn-secondary" href="#sobre">
                  Quem somos
                </a>
              </div>

              <ul className="feature-list" aria-label="Principais diferenciais">
                <li>Telemedicina e apoio especializado</li>
                <li>Capacitação em rede</li>
                <li>Dados e indicadores para gestão</li>
              </ul>
            </div>

            <div className="hero-panel" aria-label="Resumo institucional">
              <div className="panel-card">
                <p className="panel-label">Impacto em rede</p>
                <h2>+ 1,4 milhão</h2>
                <p className="panel-text">atendimentos e intercâmbios apoiados em saúde pública.</p>

                <div className="mini-grid">
                  <div>
                    <strong>28%</strong>
                    <span>redução de filas</span>
                  </div>
                  <div>
                    <strong>42%</strong>
                    <span>mais acesso regional</span>
                  </div>
                </div>
              </div>
            </div>
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

          <div className="container stats-grid">
            {stats.map((item) => (
              <div key={item.label} className="stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="servicos" className="section section-alt">
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
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="brand" aria-label="Núcleo Telessaúde Amazonas">
              <span className="brand-mark">NT</span>
              <div>
                <strong>Núcleo Telessaúde</strong>
                <small>Amazonas</small>
              </div>
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
