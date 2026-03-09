import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../components/useScrollReveal.js';
import './Actualites.css';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Actualites() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const revealRef = useScrollReveal();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles?page=${page}&limit=6`)
      .then(r => r.json())
      .then(data => {
        setArticles(data.articles || []);
        setMeta({ total: data.total, pages: data.pages });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div ref={revealRef}>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link><span>›</span><span>Actualités</span>
          </nav>
          <h1>Actualités & insights<br />marché de l'énergie</h1>
          <p>Restez informé des évolutions du marché, des réformes réglementaires et de nos conseils experts.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div className="spinner" />
            </div>
          ) : articles.length === 0 ? (
            <div className="actu-empty reveal">
              <div className="actu-empty__icon">📰</div>
              <h3>Aucun article pour le moment</h3>
              <p>Revenez bientôt pour découvrir nos actualités et analyses du marché de l'énergie.</p>
            </div>
          ) : (
            <>
              <div className="actu-grid">
                {articles.map((a, i) => (
                  <Link
                    to={`/actualites/${a.slug}`}
                    className={`actu-card reveal reveal-delay-${(i % 3) + 1}`}
                    key={a.id}
                  >
                    <div className="actu-card__image">
                      {a.image_url ? (
                        <img src={a.image_url} alt={a.title} />
                      ) : (
                        <div className="actu-card__image-placeholder">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                      <div className="actu-card__category">
                        <span className="badge badge-primary">{a.category || 'Actualité'}</span>
                      </div>
                    </div>
                    <div className="actu-card__body">
                      <p className="actu-card__date">{formatDate(a.published_at)}</p>
                      <h2 className="actu-card__title">{a.title}</h2>
                      {a.excerpt && <p className="actu-card__excerpt">{a.excerpt}</p>}
                      <span className="actu-card__link">
                        Lire l'article
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {meta.pages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Précédent
                  </button>
                  <span className="pagination__info">Page {page} / {meta.pages}</span>
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
                    disabled={page === meta.pages}
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
