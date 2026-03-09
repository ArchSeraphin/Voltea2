import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './AdminArticleForm.css';

export default function AdminArticleForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category: 'Actualité', is_published: false
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    authFetch(`/api/admin/articles/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          title: data.title || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          category: data.category || 'Actualité',
          is_published: Boolean(data.is_published)
        });
        if (data.image_url) setCurrentImage(data.image_url);
      })
      .catch(() => navigate('/admin/actualites'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Titre requis';
    if (!form.content.trim()) errs.content = 'Contenu requis';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'is_published' ? String(v) : v));
      if (image) fd.append('image', image);

      const url = isEdit ? `/api/admin/articles/${id}` : '/api/admin/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await authFetch(url, { method, body: fd });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ server: data.error || 'Erreur lors de la sauvegarde.' });
        return;
      }

      navigate('/admin/actualites');
    } catch {
      setErrors({ server: 'Une erreur est survenue.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <Link to="/admin/actualites" style={{ color: '#6b7a99', fontSize: '0.875rem' }}>
          ← Retour
        </Link>
      </div>
      <h1 className="admin-page-title">{isEdit ? 'Modifier l\'article' : 'Nouvel article'}</h1>
      <p className="admin-page-subtitle">{isEdit ? `Modification de l'article #${id}` : 'Créer un nouvel article'}</p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="article-form-layout">
          {/* Main */}
          <div className="article-form-main">
            <div className="admin-card" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Titre *</label>
                <input
                  className={`form-input ${errors.title ? 'form-input--error' : ''}`}
                  type="text"
                  value={form.title}
                  onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(er => ({ ...er, title: '' })); }}
                  placeholder="Titre de l'article"
                />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Extrait</label>
                <textarea
                  className="form-textarea"
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Résumé court affiché dans la liste des articles..."
                  style={{ minHeight: 80 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contenu *</label>
                {errors.content && <span className="form-error">{errors.content}</span>}
                <div className="article-form-toolbar">
                  {[
                    ['<h2>Titre</h2>', 'H2'],
                    ['<h3>Sous-titre</h3>', 'H3'],
                    ['<strong>Texte</strong>', 'B'],
                    ['<em>Texte</em>', 'I'],
                    ['<ul>\n<li>Élément</li>\n</ul>', 'Liste'],
                    ['<p>\n</p>', 'Para']
                  ].map(([html, label]) => (
                    <button
                      key={label}
                      type="button"
                      className="article-form-tb-btn"
                      onClick={() => {
                        const textarea = document.getElementById('article-content');
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selected = form.content.substring(start, end);
                        const insertion = html.replace('Texte', selected || 'Texte');
                        setForm(f => ({
                          ...f,
                          content: f.content.substring(0, start) + insertion + f.content.substring(end)
                        }));
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <textarea
                  id="article-content"
                  className={`form-textarea article-form-content ${errors.content ? 'form-input--error' : ''}`}
                  value={form.content}
                  onChange={e => { setForm(f => ({ ...f, content: e.target.value })); setErrors(er => ({ ...er, content: '' })); }}
                  placeholder="Contenu HTML de l'article..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="article-form-sidebar">
            {/* Publish */}
            <div className="admin-card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a2236', marginBottom: 16 }}>Publication</h3>
              <label className="article-form-toggle">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                />
                <span className="article-form-toggle-slider" />
                <span>{form.is_published ? 'Publié' : 'Brouillon'}</span>
              </label>

              {errors.server && (
                <div style={{ marginTop: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '10px 12px', fontSize: '0.82rem', color: '#dc2626' }}>
                  {errors.server}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving} style={{ justifyContent: 'center' }}>
                  {saving ? 'Sauvegarde...' : isEdit ? 'Mettre à jour' : 'Créer l\'article'}
                </button>
                <Link to="/admin/actualites" className="admin-btn admin-btn-secondary" style={{ justifyContent: 'center' }}>
                  Annuler
                </Link>
              </div>
            </div>

            {/* Category */}
            <div className="admin-card" style={{ marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Catégorie</label>
                <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option>Actualité</option>
                  <option>Marché de l'énergie</option>
                  <option>Réglementation</option>
                  <option>Conseil & optimisation</option>
                  <option>Collectivités</option>
                </select>
              </div>
            </div>

            {/* Image */}
            <div className="admin-card">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a2236', marginBottom: 12 }}>Image de couverture</h3>
              {(imagePreview || currentImage) && (
                <div style={{ marginBottom: 12, borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9' }}>
                  <img src={imagePreview || currentImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <label className="article-form-file-label">
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                {imagePreview ? 'Changer l\'image' : 'Choisir une image'}
              </label>
              <p style={{ fontSize: '0.75rem', color: '#9aadbd', marginTop: 6 }}>JPG, PNG, WebP — max 5 Mo</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
