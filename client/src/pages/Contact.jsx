import { useState } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../components/useScrollReveal.js';
import './Contact.css';

const INITIAL = {
  name: '', email: '', phone: '', company: '', subject: '',
  message: '', type: '', website: '' // honeypot
};

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // 'sending' | 'success' | 'error'
  const revealRef = useScrollReveal();

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  function validate() {
    const errs = {};
    if (!form.name.trim() || form.name.length < 2) errs.name = 'Nom requis (min 2 caractères)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email invalide';
    if (!form.subject.trim() || form.subject.length < 3) errs.subject = 'Objet requis';
    if (!form.message.trim() || form.message.length < 10) errs.message = 'Message trop court (min 10 caractères)';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setStatus('success');
      setForm(INITIAL);
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <div ref={revealRef}>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link><span>›</span><span>Contact</span>
          </nav>
          <h1>Parlons de votre<br />projet énergétique</h1>
          <p>Un expert vous répondra sous 24h ouvrées pour analyser votre situation et vous proposer les meilleures solutions.</p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container">
          <div className="contact-layout">
            {/* Infos */}
            <div className="contact-info reveal">
              <h2 className="contact-info__title">Prenez contact<br />avec nos experts</h2>
              <p className="contact-info__desc">
                Que vous soyez une entreprise, une collectivité ou un établissement public,
                notre équipe est disponible pour analyser votre situation et vous proposer les meilleures solutions.
              </p>
              <div className="contact-items">
                <div className="contact-item">
                  <div className="contact-item__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.93 3.5 2 2 0 0 1 3.87 1.34h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l1.69-1.69a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <strong>Téléphone</strong>
                    <p><a href="tel:+33000000000">+33 (0)0 00 00 00 00</a></p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-item__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <strong>Email</strong>
                    <p><a href="mailto:contact@voltea-energie.fr">contact@voltea-energie.fr</a></p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-item__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div>
                    <strong>Délai de réponse</strong>
                    <p>Sous 24h ouvrées</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-wrap reveal reveal-delay-2">
              {status === 'success' ? (
                <div className="contact-success">
                  <div className="contact-success__icon">✓</div>
                  <h3>Message envoyé !</h3>
                  <p>Merci pour votre message. Nous vous répondrons sous 24h ouvrées.</p>
                  <button className="btn btn-outline-dark" onClick={() => setStatus(null)}>
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  <h3 className="contact-form__title">Formulaire de contact</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Nom & Prénom *</label>
                      <input className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                        type="text" value={form.name} onChange={set('name')} placeholder="Jean Dupont" />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                        type="email" value={form.email} onChange={set('email')} placeholder="jean@entreprise.fr" />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Téléphone</label>
                      <input className="form-input" type="tel" value={form.phone} onChange={set('phone')} placeholder="06 00 00 00 00" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Société / Collectivité</label>
                      <input className="form-input" type="text" value={form.company} onChange={set('company')} placeholder="Nom de votre organisation" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vous êtes</label>
                    <select className="form-select" value={form.type} onChange={set('type')}>
                      <option value="">Sélectionner...</option>
                      <option value="professionnel">Un professionnel / entreprise</option>
                      <option value="collectivite">Une collectivité / établissement public</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Objet *</label>
                    <input className={`form-input ${errors.subject ? 'form-input--error' : ''}`}
                      type="text" value={form.subject} onChange={set('subject')} placeholder="Demande de devis - Électricité" />
                    {errors.subject && <span className="form-error">{errors.subject}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className={`form-textarea ${errors.message ? 'form-input--error' : ''}`}
                      value={form.message} onChange={set('message')}
                      placeholder="Décrivez votre situation : type d'énergie, consommation estimée, contrat actuel..." />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  {/* Honeypot */}
                  <input type="text" name="website" value={form.website} onChange={set('website')}
                    style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

                  {status === 'error' && (
                    <div className="contact-form__error">
                      Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary btn-lg contact-form__submit" disabled={status === 'sending'}>
                    {status === 'sending' ? (
                      <>Envoi en cours... <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /></>
                    ) : (
                      <>Envoyer le message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
