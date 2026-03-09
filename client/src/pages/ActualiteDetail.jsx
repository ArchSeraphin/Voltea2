import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ActualiteDetail.css';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ActualiteDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/articles/${slug}`)
      .then(r => {
        if (r.status === 404) { navigate('/actualites', { replace: true }); return null; }
        return r.json();
      })
      .then(data => { if (data) setArticle(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  if (!article) return null;

  return (
    <div className="article-page">
      {/* Hero */}
      <section className="article-hero">
        {article.image_url && (
          <div className="article-hero__bg">
            <img src={article.image_url} alt={article.title} />
            <div className="article-hero__overlay" />
          </div>
        )}
        <div className="container article-hero__content">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link><span>›</span>
            <Link to="/actualites">Actualités</Link><span>›</span>
            <span>{article.title}</span>
          </nav>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <span className="badge badge-primary">{article.category}</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>{formatDate(article.published_at)}</span>
          </div>
          <h1 className="article-hero__title">{article.title}</h1>
          {article.excerpt && <p className="article-hero__excerpt">{article.excerpt}</p>}
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div className="article-layout">
            <article className="prose article-content"
              dangerouslySetInnerHTML={{ __html: article.content }} />
            <aside className="article-sidebar">
              <div className="article-sidebar__card">
                <h4>À propos de Voltea Énergie</h4>
                <p>Courtier en énergie indépendant, nous accompagnons les professionnels et les collectivités dans l'optimisation de leurs contrats d'électricité et de gaz.</p>
                <Link to="/contact" className="btn btn-primary" style={{ marginTop: 16, justifyContent: 'center' }}>
                  Nous contacter
                </Link>
              </div>
              <div className="article-sidebar__card">
                <h4>Nos services</h4>
                <ul style={{ marginTop: 12 }}>
                  {['Courtage électricité', 'Courtage gaz', 'Audit énergétique', 'Suivi & conseil'].map(s => (
                    <li key={s} style={{ padding: '8px 0', borderBottom: '1px solid var(--c-border)', fontSize: '0.875rem', color: 'var(--c-text-mid)' }}>
                      <Link to="/services" style={{ color: 'inherit', transition: 'color 0.2s' }}
                        onMouseOver={e => e.target.style.color = 'var(--c-primary)'}
                        onMouseOut={e => e.target.style.color = 'var(--c-text-mid)'}
                      >
                        → {s}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--c-border)' }}>
            <Link to="/actualites" className="btn btn-outline-dark">
              ← Retour aux actualités
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
