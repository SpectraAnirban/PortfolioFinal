import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Page from '../components/Page.jsx';
import { Reveal, SectionLabel, SplitHeading } from '../components/Reveal.jsx';
import ProjectArt from '../components/ProjectArt.jsx';
import ArchitectureDiagram from '../components/ArchitectureDiagram.jsx';
import Lightbox from '../components/Lightbox.jsx';
import Icon from '../components/Icon.jsx';
import NotFound from './NotFound.jsx';
import { projects } from '../data/portfolio.js';

export default function ProjectDetail() {
  const { slug } = useParams();
  const index = projects.findIndex((p) => p.slug === slug);
  const [shot, setShot] = useState(null);
  const { scrollY } = useScroll();
  const coverY = useTransform(scrollY, [0, 600], [0, 80]);
  const coverScale = useTransform(scrollY, [0, 600], [1, 1.06]);

  if (index === -1) return <NotFound />;
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <Page title={p.name}>
      <article style={{ '--accent': p.accent }}>
        <section className="container case-hero">
          <Reveal><Link to="/work" className="back-link"><Icon name="back" size={16} /> All work</Link></Reveal>
          <div className="case-hero-top">
            <div>
              <Reveal className="case-kicker mono">{p.category} · {p.year}</Reveal>
              <SplitHeading as="h1" className="page-title" text={p.name} />
              {p.subtitle && <Reveal><p className="case-subtitle">{p.subtitle}</p></Reveal>}
            </div>
            <Reveal className="case-role" delay={0.15}>
              <span className="mono muted">Role</span>
              <strong>{p.role}</strong>
            </Reveal>
          </div>
          <Reveal delay={0.1}><p className="lead">{p.tagline}</p></Reveal>
        </section>

        <section className="container">
          <motion.div className="case-cover" initial={{ opacity: 0, y: 40, clipPath: 'inset(12% 6% 12% 6% round 24px)' }} animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 24px)' }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}>
            {p.cover ? (
              <motion.img src={p.cover} alt={`${p.name} — main screen`} style={{ y: coverY, scale: coverScale }} onClick={() => setShot(0)} />
            ) : (
              <ProjectArt project={p} large />
            )}
          </motion.div>
        </section>

        <section className="container case-overview">
          <Reveal className="case-summary">
            <SectionLabel index="01">Overview</SectionLabel>
            <p>{p.summary}</p>
          </Reveal>
          <div className="case-metrics">
            {p.metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.07} className="metric">
                <span className="metric-value">{m.value}</span>
                <span className="muted">{m.label}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container section">
          <SectionLabel index="02">Key features</SectionLabel>
          <div className="feature-grid">
            {p.features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.06} className="feature">
                <span className="feature-index mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{f.title}</h3>
                <p className="muted">{f.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {p.architecture && (
          <section className="container section">
            <SectionLabel index="03">Architecture</SectionLabel>
            <SplitHeading text={p.architecture.title} />
            <Reveal><ArchitectureDiagram nodes={p.architecture.nodes} accent={p.accent} title={`${p.name} — system overview`} /></Reveal>
          </section>
        )}

        {p.gallery.length > 0 && (
          <section className="container section">
            <SectionLabel index={p.architecture ? '04' : '03'}>Screens</SectionLabel>
            <div className="gallery">
              {p.gallery.map((g, i) => (
                <Reveal key={g.src} delay={(i % 2) * 0.08} className={`gallery-item ${i === 0 ? 'gallery-item--wide' : ''}`}>
                  <button onClick={() => setShot(i)} aria-label={`Open screenshot: ${g.caption}`}>
                    <img src={g.src.replace('.webp', '-sm.webp')} alt={g.caption} loading="lazy" />
                  </button>
                  <p className="mono muted">{g.caption}</p>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section className="container section">
          <SectionLabel index="—">Stack</SectionLabel>
          <Reveal className="chips">
            {p.stack.map((s) => <span key={s} className="chip chip--accent">{s}</span>)}
          </Reveal>
        </section>

        <section className="container">
          <Link to={`/work/${next.slug}`} className="next-project">
            <span className="mono muted">Next project</span>
            <span className="next-project-name">{next.name} <Icon name="arrow" size={36} /></span>
          </Link>
        </section>
      </article>

      {p.gallery.length > 0 && <Lightbox items={p.gallery} index={shot} onClose={() => setShot(null)} onIndex={setShot} />}
    </Page>
  );
}
