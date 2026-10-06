import { motion } from 'framer-motion';

// Hub-and-spoke diagram: the first node is the hub (gateway / API), the rest orbit it.
// Packets travel along each spoke on staggered loops to show live traffic.
export default function ArchitectureDiagram({ nodes, accent = '#7c5cff', title }) {
  const [hub, ...spokes] = nodes;
  const W = 720, H = 440, cx = W / 2, cy = H / 2, rx = 290, ry = 165;
  const pts = spokes.map((label, i) => {
    const a = (i / spokes.length) * Math.PI * 2 - Math.PI / 2;
    return { label, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
  });

  return (
    <figure className="arch" style={{ '--accent': accent }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}: ${hub} connected to ${spokes.join(', ')}`}>
        <defs>
          <radialGradient id="hubGlow">
            <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r="120" fill="url(#hubGlow)" />
        {pts.map((p, i) => (
          <g key={p.label}>
            <motion.line
              x1={cx} y1={cy} x2={p.x} y2={p.y}
              className="arch-line"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.07 }}
            />
            <motion.circle
              r="4"
              fill={accent}
              initial={{ cx, cy, opacity: 0 }}
              animate={{ cx: [cx, p.x], cy: [cy, p.y], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 1 + i * 0.37, repeatDelay: spokes.length * 0.18, ease: 'easeInOut' }}
            />
          </g>
        ))}
        {pts.map((p, i) => (
          <motion.g
            key={`n-${p.label}`}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.07, type: 'spring', stiffness: 220, damping: 18 }}
            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          >
            <rect x={p.x - 64} y={p.y - 19} width="128" height="38" rx="10" className="arch-node" />
            <text x={p.x} y={p.y + 5} textAnchor="middle" className="arch-text">{p.label}</text>
          </motion.g>
        ))}
        <g>
          <rect x={cx - 82} y={cy - 28} width="164" height="56" rx="14" className="arch-hub" />
          <text x={cx} y={cy + 6} textAnchor="middle" className="arch-hub-text">{hub}</text>
        </g>
      </svg>
      {title && <figcaption className="mono muted">{title}</figcaption>}
    </figure>
  );
}
