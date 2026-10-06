import { motion } from 'framer-motion';
import Icon from './Icon.jsx';

// Generated cover for projects without screenshots: a module mosaic in the project's accent colour.
const ERP_MODULES = ['HR', 'Payroll', 'Kanban', 'Gantt', 'Reviews', 'Clients', 'Invoices', 'Chat', 'Tickets', 'Leave', 'Org Tree', 'Cron'];
const LOOM_MODULES = ['Plans', 'Coins', 'Downloads', 'Search', 'Reviews', 'Cart', 'Orders', 'Razorpay', 'Refunds', 'Invoices', 'Live', 'Admin'];

export default function ProjectArt({ project, large = false }) {
  const modules = project.icon === 'erp' ? ERP_MODULES : LOOM_MODULES;
  return (
    <div className={`project-art ${large ? 'project-art--large' : ''}`} style={{ '--accent': project.accent }}>
      <div className="project-art-glow" />
      <div className="project-art-grid">
        {modules.map((m, i) => (
          <motion.span
            key={m}
            className="project-art-cell"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.03 * i, duration: 0.5 }}
          >
            {m}
          </motion.span>
        ))}
      </div>
      <div className="project-art-badge">
        <Icon name={project.icon} size={large ? 40 : 28} />
        <span>{project.name}</span>
      </div>
    </div>
  );
}
