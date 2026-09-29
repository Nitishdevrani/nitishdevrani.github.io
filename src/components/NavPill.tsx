const links = [
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#projects', label: 'Projects' },
  { href: '#writing', label: 'Writing' },
  { href: '#community', label: 'Community' },
];

export function NavPill() {
  return (
    <div className="glass-bar-holder">
      <nav className="glass-bar nav" aria-label="Main">
        <a href="#top" className="nav-brand">
          <span className="nav-dot" />
          Nitish Devrani
        </a>
        <span className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </span>
        <a href="#contact" className="btn btn-primary nav-cta">
          Say hello
        </a>
        <span className="nav-progress" aria-hidden />
      </nav>
    </div>
  );
}
