import { motion } from 'framer-motion';

export function Reveal({ children, delay = 0, y = 32, className, as = 'div' }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </M>
  );
}

// Splits a heading into words that rise into place one after another.
export function SplitHeading({ text, as = 'h2', className = '', delay = 0 }) {
  const M = motion[as];
  const words = text.split(' ');
  return (
    <M className={`split ${className}`} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} aria-label={text}>
      {words.map((w, i) => (
        <span className="split-mask" key={i} aria-hidden="true">
          <motion.span
            className="split-word"
            variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.06 } } }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </M>
  );
}

export function SectionLabel({ index, children }) {
  return (
    <Reveal className="section-label">
      <span className="mono">{index}</span>
      <span className="section-label-line" />
      <span>{children}</span>
    </Reveal>
  );
}
