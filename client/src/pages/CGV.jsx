import { Link } from 'react-router-dom';

export default function CGV() {
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link><span>›</span><span>CGV</span>
          </nav>
          <h1>Conditions Générales<br />de Vente</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose" style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2>1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre la société
              Voltea Énergie (ci-après « le Prestataire ») et tout client professionnel (ci-après « le Client »)
              faisant appel à ses services de courtage en énergie.
            </p>

            <h2>2. Services proposés</h2>
            <p>Voltea Énergie propose les prestations suivantes :</p>
            <ul>
              <li>Conseil et accompagnement dans la négociation de contrats d'énergie (électricité, gaz naturel)</li>
              <li>Réalisation d'audits énergétiques</li>
              <li>Suivi et optimisation des contrats d'énergie en cours</li>
              <li>Accompagnement dans les procédures de marchés publics d'énergie</li>
            </ul>

            <h2>3. Formation du contrat</h2>
            <p>
              Toute commande de prestation fait l'objet d'un devis préalable établi par Voltea Énergie et accepté
              par le Client par signature. Le contrat est formé à réception du devis signé accompagné, le cas
              échéant, du règlement de l'acompte prévu.
            </p>

            <h2>4. Honoraires</h2>
            <p>
              Les honoraires de Voltea Énergie sont établis sur devis, selon la nature et le volume de la prestation.
              Ils peuvent prendre la forme :
            </p>
            <ul>
              <li>D'honoraires fixes forfaitaires</li>
              <li>D'une commission sur les économies générées</li>
              <li>D'une combinaison des deux formules précédentes</li>
            </ul>
            <p>
              Les tarifs sont indiqués hors taxes. La TVA applicable sera ajoutée au taux en vigueur au jour de
              la facturation.
            </p>

            <h2>5. Conditions de paiement</h2>
            <p>
              Sauf accord particulier mentionné dans le devis, les factures sont payables à 30 jours date de facture.
              Tout retard de paiement entraîne l'application de pénalités égales à 3 fois le taux d'intérêt légal
              ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 €.
            </p>

            <h2>6. Obligations du Prestataire</h2>
            <p>
              Voltea Énergie s'engage à mettre en œuvre tous les moyens nécessaires pour accomplir les missions
              confiées dans les meilleures conditions. Il s'agit d'une obligation de moyens. Le Prestataire
              ne peut garantir un résultat déterminé (niveau d'économies, obtention d'un tarif précis).
            </p>

            <h2>7. Confidentialité</h2>
            <p>
              Voltea Énergie s'engage à traiter de manière strictement confidentielle toutes les informations
              communiquées par le Client dans le cadre de la réalisation des prestations.
            </p>

            <h2>8. Résiliation</h2>
            <p>
              Chaque partie peut mettre fin au contrat en cas de manquement grave de l'autre partie à ses obligations,
              après mise en demeure restée sans effet pendant 30 jours.
            </p>

            <h2>9. Droit applicable – Litiges</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'engagent à
              rechercher une solution amiable avant tout recours judiciaire. À défaut, les tribunaux compétents
              du ressort du siège social de Voltea Énergie seront seuls compétents.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
