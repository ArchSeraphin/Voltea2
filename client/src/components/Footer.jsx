import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <img src="/images/logo/logo-white.png" alt="Voltea Énergie" height="44"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
              <span className="footer__brand-fallback" style={{ display: 'none' }}>
                <strong>Voltea</strong> Énergie
              </span>
              <p className="footer__tagline">
                Votre partenaire indépendant en courtage d'énergie pour les professionnels et les collectivités.
              </p>
              <div className="footer__social">
                <a href="https://www.linkedin.com/company/voltea-energie" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="footer__col">
              <h4 className="footer__heading">Services</h4>
              <ul className="footer__links">
                <li><Link to="/services">Courtage en électricité</Link></li>
                <li><Link to="/services">Courtage en gaz naturel</Link></li>
                <li><Link to="/services">Audit énergétique</Link></li>
                <li><Link to="/services">Suivi de consommation</Link></li>
                <li><Link to="/collectivites">Offre collectivités</Link></li>
              </ul>
            </div>

            {/* Navigation */}
            <div className="footer__col">
              <h4 className="footer__heading">Navigation</h4>
              <ul className="footer__links">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/a-propos">À propos</Link></li>
                <li><Link to="/actualites">Actualités</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/mentions-legales">Mentions légales</Link></li>
                <li><Link to="/cgv">CGV</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer__col">
              <h4 className="footer__heading">Contact</h4>
              <ul className="footer__contact-list">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.93 3.5 2 2 0 0 1 3.87 1.34h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l1.69-1.69a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <a href="tel:+33000000000">+33 (0)0 00 00 00 00</a>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <a href="mailto:contact@voltea-energie.fr">contact@voltea-energie.fr</a>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>France</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {year} Voltea Énergie. Tous droits réservés.</p>
          <div className="footer__bottom-links">
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/cgv">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
