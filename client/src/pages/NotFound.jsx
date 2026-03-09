import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontFamily: 'var(--f-heading)', fontSize: '6rem', fontWeight: 800, color: 'var(--c-primary)', opacity: 0.4, lineHeight: 1, marginBottom: 24 }}>404</div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 16 }}>Page introuvable</h1>
        <p style={{ color: 'var(--c-text-muted)', marginBottom: 32, lineHeight: 1.7 }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">Retour à l'accueil</Link>
      </div>
    </div>
  );
}
