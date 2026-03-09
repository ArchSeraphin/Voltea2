import { Link } from 'react-router-dom';

export default function MentionsLegales() {
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link><span>›</span><span>Mentions légales</span>
          </nav>
          <h1>Mentions légales</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose" style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2>1. Éditeur du site</h2>
            <p>
              Le site <strong>voltea-energie.fr</strong> est édité par la société <strong>Voltea Énergie</strong>,
              [forme juridique] au capital de [X] €, immatriculée au RCS de [Ville] sous le numéro [SIRET],
              dont le siège social est situé au [Adresse complète].
            </p>
            <p>
              Directeur de la publication : Jérémy Lozzi<br />
              Email : contact@voltea-energie.fr<br />
              Téléphone : +33 (0)0 00 00 00 00
            </p>

            <h2>2. Hébergeur</h2>
            <p>
              Le site est hébergé par <strong>Plesk / [Nom de l'hébergeur]</strong>,
              [Adresse de l'hébergeur], [Téléphone de l'hébergeur].
            </p>

            <h2>3. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur le site (textes, images, graphismes, logo, icônes, sons, logiciels…)
              est la propriété exclusive de Voltea Énergie, à l'exception des marques, logos ou contenus appartenant à
              d'autres sociétés partenaires. Toute reproduction, représentation, modification, publication, adaptation
              totale ou partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite,
              sauf autorisation écrite préalable de Voltea Énergie.
            </p>

            <h2>4. Données personnelles (RGPD)</h2>
            <p>
              Voltea Énergie collecte des données personnelles dans le cadre de ses activités commerciales.
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
              vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition à vos données personnelles.
            </p>
            <p>
              Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@voltea-energie.fr">contact@voltea-energie.fr</a>
            </p>

            <h2>5. Cookies</h2>
            <p>
              Le site peut utiliser des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie à des fins
              publicitaires ou de tracking n'est utilisé sans votre consentement préalable.
            </p>

            <h2>6. Limitation de responsabilité</h2>
            <p>
              Voltea Énergie s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site.
              Cependant, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à
              disposition sur ce site. En conséquence, Voltea Énergie décline toute responsabilité en cas d'imprécision,
              d'inexactitude ou d'omission portant sur des informations disponibles sur ce site.
            </p>

            <h2>7. Loi applicable</h2>
            <p>
              Le présent site et les présentes mentions légales sont régis par le droit français.
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
