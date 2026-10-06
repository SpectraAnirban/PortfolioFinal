import { useState } from 'react';
import { motion } from 'framer-motion';
import Page from '../components/Page.jsx';
import { Reveal, SectionLabel, SplitHeading } from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import { profile } from '../data/portfolio.js';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable — the mailto link still works */ }
  };

  const cards = [
    { icon: 'mail', label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: 'phone', label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { icon: 'github', label: 'GitHub', value: profile.githubLabel, href: profile.github, external: true },
    { icon: 'pin', label: 'Based in', value: profile.location },
  ];

  return (
    <Page title="Contact">
      <section className="page-hero container">
        <SectionLabel index="@">Contact</SectionLabel>
        <SplitHeading as="h1" className="page-title" text="Let’s talk about what you’re building." />
        <Reveal><p className="lead muted">Lead and senior engineering roles, architecture reviews or a platform that needs an owner — I usually reply within a day.</p></Reveal>
      </section>

      <section className="container">
        <Reveal className="contact-hero">
          <button className="contact-email" onClick={copy} aria-label="Copy email address">
            <span>{profile.email}</span>
            <motion.span className="contact-copy mono" key={copied ? 'y' : 'n'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              {copied ? 'copied ✓' : 'click to copy'}
            </motion.span>
          </button>
          <div className="hero-actions">
            <a href={`mailto:${profile.email}`} className="btn"><Icon name="mail" size={18} /> Write an email</a>
            <a href={profile.resume} className="btn btn--ghost" download><Icon name="download" size={18} /> Download CV</a>
          </div>
        </Reveal>

        <div className="contact-grid">
          {cards.map((c, i) => {
            const inner = (
              <>
                <span className="cap-icon"><Icon name={c.icon} size={22} /></span>
                <span className="mono muted">{c.label}</span>
                <strong>{c.value}</strong>
              </>
            );
            return (
              <Reveal key={c.label} delay={i * 0.07}>
                {c.href ? (
                  <a className="contact-card" href={c.href} {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}>{inner}</a>
                ) : (
                  <div className="contact-card">{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>
    </Page>
  );
}
