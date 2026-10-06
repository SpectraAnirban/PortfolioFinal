import { Link } from 'react-router-dom';
import { profile } from '../data/portfolio.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-big">Have a platform to build?</p>
          <Link to="/contact" className="link-arrow">Start a conversation <span aria-hidden="true">→</span></Link>
        </div>
        <div className="footer-meta">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.github} target="_blank" rel="noreferrer">{profile.githubLabel}</a>
          <span className="muted">© {new Date().getFullYear()} {profile.name} · {profile.location}</span>
        </div>
      </div>
    </footer>
  );
}
