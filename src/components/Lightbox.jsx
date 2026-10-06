import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon.jsx';

export default function Lightbox({ items, index, onClose, onIndex }) {
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open, index, items.length, onClose, onIndex]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Screenshot viewer"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <button className="lightbox-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
          <AnimatePresence mode="wait">
            <motion.figure key={index} className="lightbox-figure" onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <img src={items[index].src} alt={items[index].caption} />
              <figcaption>
                <span className="mono">{index + 1} / {items.length}</span> {items[index].caption}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          {items.length > 1 && (
            <>
              <button className="lightbox-nav lightbox-nav--prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + items.length) % items.length); }}><Icon name="back" /></button>
              <button className="lightbox-nav lightbox-nav--next" aria-label="Next" onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % items.length); }}><Icon name="arrow" /></button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
