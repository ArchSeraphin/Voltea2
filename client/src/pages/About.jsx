import { Link } from 'react-router-dom';
import useScrollReveal from '../components/useScrollReveal.js';
import './About.css';

const VALUES = [
  { icon: '🎯', title: 'Indépendance', desc: "Aucun lien capitalistique avec les fournisseurs d'énergie. Notre seul engagement : votre intérêt." },
  { icon: '🔬', title: 'Expertise', desc: "Une veille quotidienne des marchés de l'énergie pour anticiper les meilleures opportunités tarifaires." },
  { icon: '🤝', title: 'Proximité', desc: 'Un interlocuteur unique, disponible et réactif. Nous construisons des relations durables avec nos clients.' },
  { icon: '📋', title: 'Transparence', desc: 'Honoraires clairs, reporting détaillé. Pas de frais cachés, pas de surprise.' },
  { icon: '⚡', title: 'Réactivité', desc: 'Marchés volatils, délais courts : nous agissons vite pour saisir les meilleures fenêtres tarifaires.' },
  { icon: '🌱', title: 'Responsabilité', desc: "Nous intégrons les offres d'énergies renouvelables dans nos recommandations pour un avenir plus durable." }
];

export default function About() {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span>›</span>
            <span>À propos</span>
          </nav>
          <span className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.5)' }}>Qui sommes-nous</span>
          <h1>Votre courtier énergie<br />indépendant depuis 2014</h1>
          <p>Dix ans d'expérience au service des professionnels et des collectivités pour les aider à maîtriser leur budget énergie.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="section about-mission">
        <div className="container">
          <div className="about-mission__inner">
            <div className="about-mission__content reveal">
              <span className="section-eyebrow">Notre mission</span>
              <h2 className="section-title">Simplifier l'accès aux<br />meilleurs tarifs d'énergie</h2>
              <p style={{ color: 'var(--c-text-mid)', lineHeight: 1.8, marginBottom: 16 }}>
                Naviguer sur les marchés dérégulés de l'énergie est complexe. Les tarifs fluctuent, les contrats sont techniques,
                les fournisseurs sont nombreux. Voltea Énergie est là pour démêler cette complexité à votre place.
              </p>
              <p style={{ color: 'var(--c-text-mid)', lineHeight: 1.8, marginBottom: 32 }}>
                En tant que courtier indépendant, nous analysons votre consommation, consultons l'ensemble du marché et
                négocions les meilleures conditions pour votre contrat d'énergie — électricité et gaz.
              </p>
              <Link to="/contact" className="btn btn-primary">Prendre contact</Link>
            </div>
            <div className="about-mission__visual reveal reveal-delay-2">
              <div className="about-mission__card">
                <div className="about-mission__stat">
                  <span>10</span>
                  <p>années d'expertise</p>
                </div>
                <div className="about-mission__stat">
                  <span>500+</span>
                  <p>clients accompagnés</p>
                </div>
                <div className="about-mission__stat">
                  <span>15%</span>
                  <p>d'économies moyennes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section-dark about-team">
        <div className="container">
          <div className="section-header reveal" style={{ textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <span className="section-eyebrow" style={{ color: 'var(--c-primary-light)' }}>
              <span style={{ background: 'var(--c-primary-light)' }} />
              L'équipe
            </span>
            <h2 className="section-title light">Des experts à votre écoute</h2>
          </div>

          <div className="team-grid">
            <div className="team-card reveal">
              <div className="team-card__photo">
                <img src="/images/team/jeremy-lozzi.png" alt="Jérémy Lozzi"
                  onError={e => { e.target.parentNode.innerHTML = '<div class="team-card__photo-placeholder">JL</div>'; }} />
              </div>
              <div className="team-card__info">
                <h3>Jérémy Lozzi</h3>
                <p className="team-card__role">Fondateur & Dirigeant</p>
                <p className="team-card__bio">
                  Fort de plus de 10 ans d'expérience dans le secteur de l'énergie, Jérémy a fondé Voltea Énergie
                  avec la conviction que chaque entreprise mérite un accès équitable aux meilleurs tarifs du marché.
                </p>
                <div className="team-card__expertise">
                  <span>Marchés de l'énergie</span>
                  <span>Courtage</span>
                  <span>Collectivités</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section about-values">
        <div className="container">
          <div className="section-header reveal" style={{ textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <span className="section-eyebrow">Notre ADN</span>
            <h2 className="section-title">Les valeurs qui nous guident</h2>
          </div>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <div className={`value-card reveal reveal-delay-${(i % 3) + 1}`} key={i}>
                <div className="value-card__icon">{v.icon}</div>
                <h3 className="value-card__title">{v.title}</h3>
                <p className="value-card__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-navy-mid">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 className="section-title light" style={{ marginBottom: 16 }}>Travaillons ensemble</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>
              Découvrez comment Voltea Énergie peut vous aider à réduire vos coûts énergétiques.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg">Demander un audit gratuit</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
