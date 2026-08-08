import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/episodes', label: 'Episodes' },
  { to: '/literature', label: 'Literature' },
  { to: '/locations', label: 'Locations' },
  { to: '/guests', label: 'Guests' },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <header className="hero-banner" role="banner">
        <div className="hero-banner__veil" />
        <div className="hero-banner__content">
          <p className="brand-mark">Nordic Mythology Podcast</p>
          <h1 className="brand-title">NMP Resources</h1>
        </div>
      </header>

      <nav className={`navbar ${menuOpen ? 'is-open' : ''}`} aria-label="Primary">
        <div className="navbar__links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
          <a
            className="nav-link nav-link--external"
            href="https://www.nordicmythologypodcast.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            NMP
          </a>
          <a
            className="nav-link nav-link--external"
            href="https://www.hornsofodin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Horns of Odin
          </a>
        </div>
        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>
      </nav>

      <main className="page-main page-enter" key={location.pathname}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>Resources for listeners of the Nordic Mythology Podcast.</p>
      </footer>
    </div>
  );
}
