import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import Page from '../components/Page.jsx';
import { Reveal, SectionLabel, SplitHeading } from '../components/Reveal.jsx';
import Counter from '../components/Counter.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Marquee from '../components/Marquee.jsx';
import Icon from '../components/Icon.jsx';
import { capabilities, profile, projects, stats } from '../data/portfolio.js';

const DeveloperScene = lazy(() => import('../three/DeveloperScene.jsx'));

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % profile.rotating.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="rotator" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span key={i} initial={{ y: '100%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          {profile.rotating[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Hero() {
  const stageRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [keys, setKeys] = useState(0);
  const compact = useMedia('(max-width: 900px)');
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end start'] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);

  // Stop rendering the WebGL scene while it is scrolled out of view.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    if (stageRef.current) io.observe(stageRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="hero" ref={stageRef}>
      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.div className="hero-status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <span className="pulse" /> Lead Developer at Graphe · {profile.location}
          </motion.div>
          <SplitHeading as="h1" className="hero-title" text="I architect and build platforms that run businesses." delay={0.35} />
          <motion.p className="hero-role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <span className="muted">Currently:</span> <RotatingRole />
          </motion.p>
          <motion.p className="hero-intro muted" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }}>
            {profile.intro}
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 0.7 }}>
            <Link to="/work" className="btn">See the work <Icon name="arrow" size={18} /></Link>
            <a href={profile.resume} className="btn btn--ghost" download><Icon name="download" size={18} /> Download CV</a>
          </motion.div>
        </div>

        <motion.div className="hero-stage" style={{ y: sceneY, opacity: sceneOpacity }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          <div className="hero-stage-glow" />
          <Suspense fallback={<div className="scene-loading mono">booting workstation…</div>}>
            <DeveloperScene active={visible} compact={compact} onKeystroke={setKeys} />
          </Suspense>
          <div className="hero-hud mono" aria-hidden="true">
            <span><i className="dot dot--green" /> gateway: healthy</span>
            <span>keystrokes: {keys.toLocaleString()}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const featured = projects.slice(0, 4);
  return (
    <Page>
      <Hero />

      <section className="stats container">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="stat">
            <span className="stat-value"><Counter value={s.value} suffix={s.suffix} /></span>
            <span className="stat-label muted">{s.label}</span>
          </Reveal>
        ))}
      </section>

      <Marquee items={['Node.js', 'Express.js', 'React.js', 'MySQL', 'Sequelize', 'RabbitMQ', 'Docker', 'Socket.IO', 'AWS S3', 'Razorpay', 'Cashfree', 'Puppeteer', 'Coolify', 'RBAC']} />

      <section className="section container">
        <SectionLabel index="01">Selected work</SectionLabel>
        <div className="section-head">
          <SplitHeading text="Products in production, not prototypes." />
          <Reveal><Link to="/work" className="link-arrow">All projects <span aria-hidden="true">→</span></Link></Reveal>
        </div>
        <div className="project-grid">
          {featured.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} />)}
        </div>
      </section>

      <section className="section container">
        <SectionLabel index="02">What I bring</SectionLabel>
        <div className="section-head">
          <SplitHeading text="From schema to deployment, one owner." />
          <Reveal><Link to="/capabilities" className="link-arrow">Full capabilities <span aria-hidden="true">→</span></Link></Reveal>
        </div>
        <div className="cap-grid cap-grid--compact">
          {capabilities.slice(0, 4).map((c, i) => (
            <Reveal key={c.id} delay={i * 0.07} className="cap-card">
              <span className="cap-icon"><Icon name={c.icon} size={24} /></span>
              <h3>{c.title}</h3>
              <p className="muted">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container">
        <Reveal className="cta-band">
          <div>
            <p className="mono muted">available for senior / lead roles</p>
            <h2>Let’s build something that has to work on day one.</h2>
          </div>
          <Link to="/contact" className="btn">Get in touch <Icon name="arrow" size={18} /></Link>
        </Reveal>
      </section>
    </Page>
  );
}
