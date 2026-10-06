import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import Page from '../components/Page.jsx';
import { SectionLabel, SplitHeading, Reveal } from '../components/Reveal.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { projects } from '../data/portfolio.js';

const filters = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

export default function Work() {
  const [filter, setFilter] = useState('All');
  const list = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <Page title="Work">
      <section className="page-hero container">
        <SectionLabel index="W">Work</SectionLabel>
        <SplitHeading as="h1" className="page-title" text="Six platforms. Real users. Shipped." />
        <Reveal><p className="lead muted">ERP, manufacturing CRM, subscription marketplaces, microservices e-commerce and corporate web — each designed, built and taken to production.</p></Reveal>
      </section>

      <section className="container">
        <LayoutGroup>
          <div className="filters" role="tablist" aria-label="Filter projects">
            {filters.map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} className={`filter ${filter === f ? 'is-active' : ''}`} onClick={() => setFilter(f)}>
                {filter === f && <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span>{f}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <motion.div layout className="project-grid">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
                <ProjectCard project={p} index={projects.indexOf(p)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </Page>
  );
}
