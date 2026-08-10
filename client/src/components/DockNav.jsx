export default function DockNav() {
  return (
    <nav className="dock" aria-label="Quick links">
      <a className="dock__item" href="#stack" title="Stack" aria-label="Stack">
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </a>
      <a className="dock__item dock__item--homelab" href="#scene-01" title="Work" aria-label="Work">
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </a>
      <a className="dock__ask" href="#assistant">
        <span className="dock__ask-prompt" aria-hidden="true">❯</span>
        <span className="dock__ask-label">ask me anything…</span>
        <span className="dock__ask-icon" aria-hidden="true">↑</span>
      </a>
      <a className="dock__item dock__item--stack" href="#homelab" title="Homelab" aria-label="Homelab">
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="7" rx="1.5" />
          <rect x="2" y="14" width="20" height="7" rx="1.5" />
          <line x1="6" y1="6.5" x2="6.01" y2="6.5" />
          <line x1="6" y1="17.5" x2="6.01" y2="17.5" />
        </svg>
      </a>
      <a className="dock__item" href="#contact" title="Contact" aria-label="Contact">
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <polyline points="2.5 6 12 13 21.5 6" />
        </svg>
      </a>
    </nav>
  );
}
