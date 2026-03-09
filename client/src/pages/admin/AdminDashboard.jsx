import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminDashboard() {
  const { authFetch, admin } = useAuth();
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    authFetch('/api/admin/articles?limit=5')
      .then(r => r.json())
      .then(data => {
        const articles = data.articles || [];
        setRecent(articles);
        setStats({
          total: data.total || 0,
          published: articles.filter(a => a.is_published).length,
          drafts: articles.filter(a => !a.is_published).length
        });
      })
      .catch(console.error);
  }, []);

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <div>
      <h1 className="admin-page-title">Tableau de bord</h1>
      <p className="admin-page-subtitle">Bienvenue, {admin?.name} 👋</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Articles total', value: stats.total, icon: '📄', color: '#156ef3' },
          { label: 'Publiés', value: stats.published, icon: '✅', color: '#16a34a' },
          { label: 'Brouillons', value: stats.drafts, icon: '📝', color: '#c9a227' }
        ].map((s, i) => (
          <div key={i} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: '2rem' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '2rem', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6b7a99', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <Link to="/admin/actualites/nouveau" className="admin-btn admin-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvel article
        </Link>
        <Link to="/admin/actualites" className="admin-btn admin-btn-secondary">
          Gérer les articles
        </Link>
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary">
          Voir le site →
        </a>
      </div>

      {/* Recent articles */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2236' }}>Articles récents</h2>
          <Link to="/admin/actualites" className="admin-btn admin-btn-secondary" style={{ fontSize: '0.78rem' }}>
            Tous les articles
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#6b7a99', padding: '32px' }}>
                Aucun article. <Link to="/admin/actualites/nouveau" style={{ color: '#156ef3' }}>Créer le premier →</Link>
              </td></tr>
            ) : recent.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600, color: '#1a2236', maxWidth: 280 }}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.title}
                  </span>
                </td>
                <td><span className="badge badge-primary">{a.category}</span></td>
                <td>
                  <span className={`badge ${a.is_published ? 'badge-success' : 'badge-draft'}`}>
                    {a.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td style={{ color: '#6b7a99' }}>{formatDate(a.published_at || a.created_at)}</td>
                <td>
                  <Link to={`/admin/actualites/${a.id}/modifier`} className="admin-btn admin-btn-secondary" style={{ fontSize: '0.78rem' }}>
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
