// Infinite tech marquee; the list is rendered twice and the track slides by exactly one copy.
export default function Marquee({ items, reverse = false }) {
  return (
    <div className={`marquee ${reverse ? 'marquee--reverse' : ''}`} aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="marquee-item">{t}<span className="marquee-dot">✦</span></span>
        ))}
      </div>
    </div>
  );
}
