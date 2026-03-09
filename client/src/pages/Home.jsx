import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useScrollReveal from '../components/useScrollReveal.js';
import './Home.css';

const STATS = [
  { value: 500, suffix: '+', label: 'Clients accompagnés' },
  { value: 15, suffix: '%', label: "d'économies en moyenne" },
  { value: 10, suffix: 'ans', label: "d'expertise énergie" },
  { value: 98, suffix: '%', label: 'de satisfaction client' }
];

const SERVICES = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Électricité',
    desc: "Négociation de vos contrats d'électricité sur les marchés de gros pour obtenir les tarifs les plus compétitifs."
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      </svg>
    ),
    title: 'Gaz naturel',
    desc: 'Optimisation de vos contrats gaz avec une veille permanente des marchés et des opportunités tarifaires.'
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 20h.01M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/>
      </svg>
    ),
    title: 'Audit énergétique',
    desc: 'Analyse approfondie de votre consommation pour identifier les leviers de réduction de vos coûts énergétiques.'
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Suivi & conseil',
    desc: 'Accompagnement continu avec reporting mensuel, alertes de marché et conseils personnalisés.'
  }
];

const WHY_US = [
  { icon: '⚡', title: 'Indépendant & impartial', desc: "Aucun accord d'exclusivité avec les fournisseurs. Nous défendons uniquement vos intérêts." },
  { icon: '🔍', title: 'Expertise marché', desc: "Analyse quotidienne des marchés de l'énergie. Nous saisissons les meilleures opportunités pour vous." },
  { icon: '🤝', title: 'Relation de confiance', desc: 'Interlocuteur unique, disponible et réactif. Votre satisfaction est notre priorité.' },
  { icon: '📊', title: 'Transparence totale', desc: 'Rapports clairs, données accessibles. Vous savez toujours où vous en êtes.' }
];

function AnimatedCounter({ target, suffix, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const animate = () => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current < target) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);

  return <>{count}{suffix}</>;
}

export default function Home() {
  const revealRef = useScrollReveal();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home" ref={revealRef}>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__media">
          <video
            className="hero__video"
            autoPlay muted loop playsInline
            poster="/images/hero-poster.jpg"
            onError={e => { e.target.style.display = 'none'; }}
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          <div className="hero__overlay" />
        </div>

        <div className="hero__content container">
          <div className="hero__badge reveal">
            <span className="badge badge-primary">Courtier énergie indépendant</span>
          </div>
          <h1 className="hero__title reveal reveal-delay-1">
            L'énergie au meilleur <br />
            <span className="hero__title-accent">prix garanti</span>
          </h1>
          <p className="hero__subtitle reveal reveal-delay-2">
            Voltea Énergie négocie pour vous les meilleurs contrats d'énergie.
            Expert en courtage électricité & gaz pour les professionnels et les collectivités.
          </p>
          <div className="hero__actions reveal reveal-delay-3">
            <Link to="/contact" className="btn btn-primary btn-lg">
              Obtenir un devis gratuit
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link to="/services" className="btn btn-outline btn-lg">
              Nos services
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll">
          <span />
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────── */}
      <section className="stats-bar" ref={statsRef}>
        <div className="container">
          <div className="stats-bar__grid">
            {STATS.map((s, i) => (
              <div className="stats-bar__item" key={i}>
                <div className="stats-bar__value">
                  <AnimatedCounter target={s.value} suffix={s.suffix} start={statsVisible} />
                </div>
                <div className="stats-bar__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Services ─────────────────────────────────────────── */}
      <section className="section home-services">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Ce que nous faisons</span>
            <h2 className="section-title">Un courtier à votre service,<br />du contrat au suivi</h2>
            <p className="section-subtitle">
              De la négociation de vos contrats d'énergie à l'optimisation continue de votre consommation,
              Voltea vous accompagne à chaque étape.
            </p>
          </div>

          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <div className={`service-card reveal reveal-delay-${i + 1}`} key={i}>
                <div className="service-card__icon">{s.icon}</div>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.desc}</p>
                <Link to="/services" className="service-card__link">
                  En savoir plus
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Collectivités Bloc ───────────────────────────────── */}
      <section className="section section-dark home-collectivites">
        <div className="container">
          <div className="home-collectivites__inner">
            <div className="home-collectivites__content reveal">
              <span className="section-eyebrow" style={{ color: 'var(--c-accent)' }}>
                <span style={{ background: 'var(--c-accent)' }} />
                Offre spécifique
              </span>
              <h2 className="section-title light">
                Solutions dédiées aux <br />
                <span style={{ color: 'var(--c-accent)' }}>collectivités territoriales</span>
              </h2>
              <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Communes, intercommunalités, régions, établissements publics : nous maîtrisons
                les procédures spécifiques aux marchés publics d'énergie pour vous garantir conformité et économies.
              </p>
              <ul className="home-collectivites__list">
                <li>✓ Accompagnement dans les appels d'offres</li>
                <li>✓ Conformité aux marchés publics</li>
                <li>✓ Groupements de commandes</li>
                <li>✓ Reporting adapté aux contraintes administratives</li>
              </ul>
              <Link to="/collectivites" className="btn btn-primary btn-lg" style={{ marginTop: 8 }}>
                En savoir plus
              </Link>
            </div>
            <div className="home-collectivites__visual reveal reveal-delay-2">
              <div className="home-collectivites__card">
                <div className="home-collectivites__card-icon">🏛️</div>
                <div className="home-collectivites__card-stat">
                  <span>200+</span>
                  <p>collectivités<br />accompagnées</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why Us ───────────────────────────────────────────── */}
      <section className="section home-why">
        <div className="container">
          <div className="section-header reveal" style={{ textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <span className="section-eyebrow">Pourquoi nous choisir</span>
            <h2 className="section-title">L'indépendance au service<br />de vos intérêts</h2>
          </div>
          <div className="why-grid">
            {WHY_US.map((w, i) => (
              <div className={`why-card reveal reveal-delay-${i + 1}`} key={i}>
                <div className="why-card__icon">{w.icon}</div>
                <h3 className="why-card__title">{w.title}</h3>
                <p className="why-card__desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Process ──────────────────────────────────────────── */}
      <section className="section section-navy-mid home-process">
        <div className="container">
          <div className="section-header reveal" style={{ textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <span className="section-eyebrow" style={{ color: 'var(--c-primary-light)' }}>
              <span style={{ background: 'var(--c-primary-light)' }} />
              Notre méthode
            </span>
            <h2 className="section-title light">En 4 étapes vers les<br />meilleures économies</h2>
          </div>
          <div className="process-steps">
            {[
              { n: '01', title: 'Analyse', desc: 'Étude de vos factures et contrats actuels pour établir un bilan précis.' },
              { n: '02', title: 'Consultation', desc: "Appel d'offres auprès de tous les fournisseurs du marché en votre nom." },
              { n: '03', title: 'Négociation', desc: 'Sélection et négociation du meilleur contrat selon vos critères.' },
              { n: '04', title: 'Suivi', desc: 'Accompagnement continu, reporting et re-consultation à chaque échéance.' }
            ].map((step, i) => (
              <div className={`process-step reveal reveal-delay-${i + 1}`} key={i}>
                <div className="process-step__number">{step.n}</div>
                <h3 className="process-step__title">{step.title}</h3>
                <p className="process-step__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="home-cta reveal">
        <div className="container">
          <div className="home-cta__inner">
            <div className="home-cta__content">
              <h2>Prêt à réduire vos factures d'énergie ?</h2>
              <p>Demandez votre audit gratuit — résultat sous 48h.</p>
            </div>
            <div className="home-cta__actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Démarrer maintenant
              </Link>
              <Link to="/a-propos" className="btn btn-outline btn-lg">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
