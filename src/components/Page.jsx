import { useEffect } from 'react';
import { motion } from 'framer-motion';

const ease = [0.76, 0, 0.24, 1];

// Every route renders inside <Page>. On exit a curtain sweeps up over the page;
// on enter it continues off the top, revealing the new page beneath.
export default function Page({ title, children, className = '' }) {
  useEffect(() => {
    document.title = title ? `${title} — Anirban Mondal` : 'Anirban Mondal — Lead Developer & System Architect';
  }, [title]);

  return (
    <>
      <motion.main
        className={`page ${className}`}
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 } }}
        exit={{ opacity: 0, y: -30, filter: 'blur(6px)', transition: { duration: 0.35, ease } }}
      >
        {children}
      </motion.main>
      <motion.div
        className="curtain"
        aria-hidden="true"
        initial={{ scaleY: 1, transformOrigin: 'top' }}
        animate={{ scaleY: 0, transformOrigin: 'top', transition: { duration: 0.6, ease, delay: 0.05 } }}
        exit={{ scaleY: 1, transformOrigin: 'bottom', transition: { duration: 0.45, ease } }}
      >
        <span className="curtain-mark">AM</span>
      </motion.div>
    </>
  );
}
