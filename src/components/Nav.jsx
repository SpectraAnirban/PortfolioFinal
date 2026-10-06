import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { profile } from '../data/portfolio.js';

const links = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/capabilities', label: 'Capabilities' },
  { to: '/journey', label: 'Journey' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <motion.div className="nav-progress" style={{ scaleX: progress }} />
      <div className="nav-inner container">
        <Link to="/" className="brand" aria-label="Anirban Mondal — home">
          <span className="brand-mark">AM</span>
          <span className="brand-text">Anirban Mondal</span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className="nav-link">
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <a href={profile.resume} className="btn btn--small nav-cv" download>
          Download CV
        </a>

        <button className={`burger ${open ? 'is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
          <span /><span />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            aria-label="Mobile"
          >
            {links.map((l, i) => (
              <motion.div key={l.to} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.15 + i * 0.06 } }}>
                <NavLink to={l.to} end={l.to === '/'} className="mobile-link">
                  <span className="mono">0{i + 1}</span> {l.label}
                </NavLink>
              </motion.div>
            ))}
            <a href={profile.resume} className="btn" download>Download CV</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
