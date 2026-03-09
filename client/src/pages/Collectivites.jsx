import { Link } from 'react-router-dom';
import useScrollReveal from '../components/useScrollReveal.js';
import './Collectivites.css';

const AVANTAGES = [
  { icon: '📋', title: 'Marchés publics maîtrisés', desc: "Nous maîtrisons les procédures MAPA et appels d'offres formalisés pour les achats d'énergie des collectivités." },
  { icon: '🤝', title: 'Groupements de commandes', desc: "Nous organisons et animons des groupements entre collectivités pour mutualiser les volumes et améliorer les conditions tarifaires." },
  { icon: '📊', title: 'Reporting institutionnel', desc: "Des rapports adaptés à vos obligations de reporting, accessibles à vos équipes et aux élus." },
  { icon: '⚖️', title: 'Conformité garantie', desc: "Toutes nos interventions respectent le cadre réglementaire applicable aux personnes publiques." },
  { icon: '🌿', title: 'Transition énergétique', desc: "Intégration des offres d'énergies renouvelables dans vos contrats pour répondre à vos engagements RSE." },
  { icon: '🏆', title: 'Référencement UGAP', desc: "Intervention possible dans le cadre d'accords-cadres et de marchés subséquents." }
];

const TYPES = [
  { icon: '🏛️', label: 'Communes' },
  { icon: '🔗', label: 'Intercommunalités' },
  { icon: '🗺️', label: 'Départements' },
  { icon: '🌍', label: 'Régions' },
  { icon: '🏥', label: 'Hôpitaux & EHPAD' },
  { icon: '🎓', label: 'Universités' },
  { icon: '🏫', label: 'Établissements scolaires' },
  { icon: '🏗️', label: 'Bailleurs sociaux' }
];

export default function Collectivites() {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link><span>›</span><span>Collectivités</span>
          </nav>
          <span className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.5)' }}>Offre spécifique</span>
          <h1>Solutions énergie pour<br />les collectivités territoriales</h1>
          <p>Un accompagnement expert qui respecte les contraintes et procédures propres aux personnes publiques.</p>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container">
          <div className="collectivites-intro reveal">
            <div>
              <span className="section-eyebrow">Notre expertise</span>
              <h2 className="section-title">Un courtier qui connaît<br />vos contraintes</h2>
              <p style={{ color: 'var(--c-text-mid)', lineHeight: 1.8, marginBottom: 16 }}>
                Les collectivités territoriales sont soumises à des règles strictes en matière d'achat public.
                Voltea Énergie intervient dans le respect total de ces règles, en tant que prestataire de conseil
                en achat d'énergie, pour optimiser vos contrats d'électricité et de gaz naturel.
              </p>
              <p style={{ color: 'var(--c-text-mid)', lineHeight: 1.8, marginBottom: 32 }}>
                Que vous soyez une petite commune ou un grand établissement public, nos experts vous accompagnent
                dans toutes les étapes de votre démarche d'achat d'énergie.
              </p>
              <Link to="/contact" className="btn btn-primary">Demander une étude</Link>
            </div>
            <div className="collectivites-types">
              <h3>Nous accompagnons</h3>
              <div className="types-grid">
                {TYPES.map((t, i) => (
                  <div className="type-item" key={i}>
                    <span>{t.icon}</span>
                    <p>{t.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header reveal" style={{ textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <span className="section-eyebrow" style={{ color: 'var(--c-gold)' }}>
              <span style={{ background: 'var(--c-gold)' }} />
              Pourquoi Voltea
            </span>
            <h2 className="section-title light">Des avantages concrets<br />pour votre collectivité</h2>
          </div>
          <div className="avantages-grid">
            {AVANTAGES.map((a, i) => (
              <div className={`avantage-card reveal reveal-delay-${(i % 3) + 1}`} key={i}>
                <div className="avantage-card__icon">{a.icon}</div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <div className="section-header reveal" style={{ textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <span className="section-eyebrow">Notre méthode</span>
            <h2 className="section-title">Un accompagnement de A à Z</h2>
          </div>
          <div className="coll-process">
            {[
              { n: '01', title: 'Diagnostic', desc: "Analyse de vos contrats et consommations actuels. Identification des potentiels d'économies." },
              { n: '02', title: "Appel d'offres", desc: "Rédaction du cahier des charges, consultation des fournisseurs dans le respect du code des marchés publics." },
              { n: '03', title: 'Analyse & recommandation', desc: "Analyse comparative des offres reçues. Recommandation motivée et présentation aux élus si besoin." },
              { n: '04', title: 'Suivi contractuel', desc: "Contrôle des factures, gestion des litiges, reporting et anticipation des renouvellements." }
            ].map((s, i) => (
              <div className={`coll-process__step reveal reveal-delay-${i + 1}`} key={i}>
                <div className="coll-process__num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-navy-mid">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 className="section-title light" style={{ marginBottom: 16 }}>Parlons de votre projet</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 32 }}>
              Demandez une étude gratuite et sans engagement pour votre collectivité.
            </p>
            <Link to="/contact" className="btn btn-gold btn-lg">Demander une étude</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
