import { Link } from 'react-router-dom';
import useScrollReveal from '../components/useScrollReveal.js';
import './Services.css';

const SERVICES = [
  {
    id: 'electricite',
    icon: '⚡',
    title: 'Courtage en électricité',
    subtitle: 'Tarification optimale sur les marchés de gros',
    desc: "Nous analysons votre consommation électrique et consultons l'ensemble des fournisseurs présents sur le marché pour vous soumettre les offres les plus compétitives, adaptées à votre profil de consommation.",
    features: [
      "Analyse de vos factures et historiques de consommation",
      "Consultation de l'ensemble du marché",
      "Négociation des tarifs et conditions contractuelles",
      "Mise en place du contrat et suivi",
      "Re-consultation à chaque échéance"
    ]
  },
  {
    id: 'gaz',
    icon: '🔥',
    title: 'Courtage en gaz naturel',
    subtitle: 'Optimisation continue de vos coûts gaz',
    desc: "Le marché du gaz naturel est soumis à de fortes variations. Notre expertise nous permet d'identifier les opportunités et de vous proposer des contrats fermes ou indexés selon votre stratégie.",
    features: [
      "Diagnostic de votre consommation gaz",
      "Sélection de la formule tarifaire adaptée",
      "Contrats fermes ou indexés marché",
      "Couverture du risque prix si besoin",
      "Suivi mensuel des charges"
    ]
  },
  {
    id: 'audit',
    icon: '📊',
    title: 'Audit énergétique',
    subtitle: 'Comprendre pour mieux agir',
    desc: "Un audit complet de vos installations et de vos usages énergétiques pour identifier tous les postes de réduction des coûts : tarifs, contrats, comportements, efficacité des équipements.",
    features: [
      "Étude complète de vos postes de dépenses énergétiques",
      "Analyse de vos contrats en cours",
      "Identification des gisements d'économies",
      "Recommandations chiffrées et priorisées",
      "Plan d'actions sur mesure"
    ]
  },
  {
    id: 'suivi',
    icon: '🛡️',
    title: 'Suivi & accompagnement',
    subtitle: 'Un partenaire dans la durée',
    desc: "Notre mission ne s'arrête pas à la signature du contrat. Nous assurons un suivi continu de vos factures, vous alertons en cas d'anomalie et vous informons des évolutions de marché.",
    features: [
      "Reporting mensuel de votre consommation",
      "Vérification et contrôle de vos factures",
      "Alertes en cas d'anomalie de facturation",
      "Veille réglementaire et marché",
      "Accompagnement lors des litiges fournisseurs"
    ]
  }
];

export default function Services() {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef}>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link><span>›</span><span>Services</span>
          </nav>
          <span className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.5)' }}>Ce que nous proposons</span>
          <h1>Nos services de courtage<br />en énergie</h1>
          <p>De la négociation de vos contrats au suivi continu de vos consommations, un accompagnement complet et sur mesure.</p>
        </div>
      </section>

      {/* Services detail */}
      <section className="section services-list">
        <div className="container">
          {SERVICES.map((s, i) => (
            <div className={`service-detail ${i % 2 !== 0 ? 'service-detail--reverse' : ''} reveal`} key={s.id}>
              <div className="service-detail__content">
                <div className="service-detail__icon-wrap">
                  <span>{s.icon}</span>
                </div>
                <span className="section-eyebrow">{s.subtitle}</span>
                <h2 className="service-detail__title">{s.title}</h2>
                <p className="service-detail__desc">{s.desc}</p>
                <ul className="service-detail__features">
                  {s.features.map((f, j) => (
                    <li key={j}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn btn-outline-dark" style={{ marginTop: 8 }}>
                  Demander un devis
                </Link>
              </div>
              <div className="service-detail__visual">
                <div className="service-detail__bg-card">
                  <span className="service-detail__big-icon">{s.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section section-dark">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 className="section-title light" style={{ marginBottom: 16 }}>Un seul interlocuteur pour tous vos besoins</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 32 }}>
              Contactez-nous pour un audit gratuit de votre situation énergétique.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg">Nous contacter</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
