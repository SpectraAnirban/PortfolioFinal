import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Page from '../components/Page.jsx';
import { Reveal, SectionLabel, SplitHeading } from '../components/Reveal.jsx';
import { timeline } from '../data/portfolio.js';

export default function Journey() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  return (
    <Page title="Journey">
      <section className="page-hero container">
        <SectionLabel index="J">Journey</SectionLabel>
        <SplitHeading as="h1" className="page-title" text="Engineer by training, architect by practice." />
        <Reveal><p className="lead muted">An electrical engineering degree, a career break for family, and a return to software that went from building features to leading delivery and owning architecture.</p></Reveal>
      </section>

      <section className="container timeline" ref={ref}>
        <div className="timeline-track"><motion.div className="timeline-fill" style={{ scaleY: line }} /></div>
        {timeline.map((t, i) => (
          <Reveal key={t.period} className="timeline-item" delay={0.05}>
            <span className="timeline-dot" />
            <span className="mono timeline-period">{t.period}</span>
            <h3>{t.title}</h3>
            <p className="timeline-org">{t.org}{t.place && <span className="muted"> · {t.place}</span>}</p>
            <ul>
              {t.points.map((pt) => <li key={pt} className="muted">{pt}</li>)}
            </ul>
            {i === 0 && <span className="timeline-now mono">now</span>}
          </Reveal>
        ))}
      </section>
    </Page>
  );
}
