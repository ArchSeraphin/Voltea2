import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminArticles() {
  const { authFetch } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0 });
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await authFetch(`/api/admin/articles?page=${page}&limit=10`);
      const data = await res.json();
      setArticles(data.articles || []);
      setMeta({ total: data.total });
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, [page]);

  async function handleDelete(id, title) {
    if (!window.confirm(`Supprimer l'article "${title}" ? Cette action est irréversible.`)) return;
    setDeleting(id);
    try {
      await authFetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch { alert('Erreur lors de la suppression.'); }
    setDeleting(null);
  }

  async function handleTogglePublish(id) {
    setToggling(id);
    try {
      const res = await authFetch(`/api/admin/articles/${id}/publish`, { method: 'PATCH' });
      const data = await res.json();
      setArticles(prev => prev.map(a => a.id === id ? { ...a, is_published: data.is_published } : a));
    } catch { alert('Erreur.'); }
    setToggling(null);
  }

  const pages = Math.ceil(meta.total / 10);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="admin-page-title">Actualités</h1>
          <p className="admin-page-subtitle">{meta.total} article{meta.total > 1 ? 's' : ''} au total</p>
        </div>
        <Link to="/admin/actualites/nouveau" className="admin-btn admin-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvel article
        </Link>
      </div>

      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}><div className="spinner" /></div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#6b7a99', padding: '48px' }}>
                    Aucun article pour le moment.{' '}
                    <Link to="/admin/actualites/nouveau" style={{ color: '#156ef3' }}>Créer le premier →</Link>
                  </td>
                </tr>
              ) : articles.map(a => (
                <tr key={a.id}>
                  <td style={{ maxWidth: 320 }}>
                    <div style={{ fontWeight: 600, color: '#1a2236', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9aadbd', marginTop: 2 }}>{a.slug}</div>
                  </td>
                  <td><span className="badge badge-primary">{a.category}</span></td>
                  <td>
                    <span className={`badge ${a.is_published ? 'badge-success' : 'badge-draft'}`}>
                      {a.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td style={{ color: '#6b7a99', whiteSpace: 'nowrap' }}>
                    {formatDate(a.published_at || a.created_at)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        className={`admin-btn ${a.is_published ? 'admin-btn-secondary' : 'admin-btn-success'}`}
                        onClick={() => handleTogglePublish(a.id)}
                        disabled={toggling === a.id}
                        style={{ fontSize: '0.78rem' }}
                      >
                        {toggling === a.id ? '...' : a.is_published ? 'Dépublier' : 'Publier'}
                      </button>
                      <Link to={`/admin/actualites/${a.id}/modifier`} className="admin-btn admin-btn-secondary" style={{ fontSize: '0.78rem' }}>
                        Modifier
                      </Link>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleDelete(a.id, a.title)}
                        disabled={deleting === a.id}
                        style={{ fontSize: '0.78rem' }}
                      >
                        {deleting === a.id ? '...' : 'Supprimer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
          <button className="admin-btn admin-btn-secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            ← Précédent
          </button>
          <span style={{ padding: '8px 16px', fontSize: '0.875rem', color: '#6b7a99' }}>
            {page} / {pages}
          </span>
          <button className="admin-btn admin-btn-secondary" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
