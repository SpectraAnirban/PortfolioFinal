import { motion } from 'framer-motion';
import Page from '../components/Page.jsx';
import { Reveal, SectionLabel, SplitHeading } from '../components/Reveal.jsx';
import ArchitectureDiagram from '../components/ArchitectureDiagram.jsx';
import Icon from '../components/Icon.jsx';
import { capabilities, languages, projects } from '../data/portfolio.js';

const process = [
  { step: 'Understand', text: 'Turn business requirements into entities, workflows, roles and edge cases before any code.' },
  { step: 'Model', text: 'Design the relational schema and service boundaries — the decisions that are expensive to change later.' },
  { step: 'Build', text: 'REST APIs, real-time channels and React interfaces in modular, reviewable increments.' },
  { step: 'Harden', text: 'RBAC, session security, validation, transactions, rate limits and audit history.' },
  { step: 'Ship', text: 'Containerise, deploy through Coolify and GitHub workflows, then monitor and iterate.' },
];

export default function Capabilities() {
  const ws = projects.find((p) => p.slug === 'graphe-weddings');
  return (
    <Page title="Capabilities">
      <section className="page-hero container">
        <SectionLabel index="C">Capabilities</SectionLabel>
        <SplitHeading as="h1" className="page-title" text="Full-stack depth, architect’s perspective." />
        <Reveal><p className="lead muted">I own systems end to end — the data model, the services, the interface and the deployment — and lead the team that ships them.</p></Reveal>
      </section>

      <section className="container">
        <div className="cap-grid">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.id}
              className="cap-card cap-card--full"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <span className="cap-icon"><Icon name={c.icon} size={24} /></span>
              <h3>{c.title}</h3>
              <p className="muted">{c.text}</p>
              <div className="chips chips--small">
                {c.items.map((it) => <span key={it} className="chip">{it}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container section">
        <SectionLabel index="01">Architecture in practice</SectionLabel>
        <div className="split-2">
          <div>
            <SplitHeading text="Ten services. One gateway. Zero trust in headers." />
            <Reveal>
              <p className="muted">
                For Graphe Weddings I split the platform into dedicated services behind an API Gateway that validates every
                session and derives each admin permission from the route itself. Orders, notifications and emails flow
                asynchronously over RabbitMQ, so a slow mail server never blocks a checkout.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}><ArchitectureDiagram nodes={ws.architecture.nodes} accent="#7c5cff" title="Graphe Weddings — gateway + services" /></Reveal>
        </div>
      </section>

      <section className="container section">
        <SectionLabel index="02">How I work</SectionLabel>
        <ol className="process">
          {process.map((s, i) => (
            <Reveal as="li" key={s.step} delay={i * 0.08} className="process-step">
              <span className="process-index mono">0{i + 1}</span>
              <h3>{s.step}</h3>
              <p className="muted">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="container section">
        <SectionLabel index="03">Languages</SectionLabel>
        <Reveal className="chips">
          {languages.map((l) => <span key={l} className="chip chip--accent">{l}</span>)}
        </Reveal>
      </section>
    </Page>
  );
}
