import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ProjectArt from './ProjectArt.jsx';
import Icon from './Icon.jsx';

export default function ProjectCard({ project, index = 0, featured = false }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.article
      className={`project-card ${featured ? 'project-card--featured' : ''}`}
      style={{ '--accent': project.accent }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.12 }}
    >
      <Link to={`/work/${project.slug}`} className="project-card-link" aria-label={`${project.name} — case study`}>
        <motion.div className="project-card-media" style={{ rotateX: rx, rotateY: ry }} onMouseMove={onMove} onMouseLeave={onLeave}>
          {project.cover ? (
            <img src={project.thumb || project.cover} alt={`${project.name} screenshot`} loading="lazy" />
          ) : (
            <ProjectArt project={project} />
          )}
          <span className="project-card-cta">View case study <Icon name="arrow" size={16} /></span>
        </motion.div>
        <div className="project-card-body">
          <div className="project-card-meta">
            <span className="mono">{String(index + 1).padStart(2, '0')}</span>
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <h3>{project.name}{project.subtitle && <span className="muted"> — {project.subtitle}</span>}</h3>
          <p className="muted">{project.tagline}</p>
          <div className="chips chips--small">
            {project.stack.slice(0, 5).map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
