'use strict';

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const { contactLimiter } = require('../middleware/rateLimiter');

// POST /api/contact
router.post('/', contactLimiter, [
  body('name').trim().notEmpty().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().trim().isMobilePhone('fr-FR').isLength({ max: 20 }),
  body('company').optional().trim().isLength({ max: 200 }).escape(),
  body('subject').trim().notEmpty().isLength({ min: 3, max: 200 }).escape(),
  body('message').trim().notEmpty().isLength({ min: 10, max: 5000 }).escape(),
  body('type').optional().isIn(['professionnel', 'collectivite', 'autre']),
  // Honeypot
  body('website').isEmpty()
], async (req, res) => {
  // Honeypot check
  if (req.body.website) return res.status(400).json({ error: 'Erreur de validation.' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Veuillez vérifier les champs du formulaire.', details: errors.array() });
  }

  const { name, email, phone, company, subject, message, type } = req.body;

  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    const typeLabel = { professionnel: 'Professionnel', collectivite: 'Collectivité', autre: 'Autre' };

    await transporter.sendMail({
      from: `"Site Voltea Énergie" <${process.env.MAIL_FROM}>`,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <h2>Nouveau message de contact — Voltea Énergie</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px">
          <tr><td style="padding:8px;font-weight:bold;width:140px">Nom</td><td style="padding:8px">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px;font-weight:bold">Téléphone</td><td style="padding:8px">${phone}</td></tr>` : ''}
          ${company ? `<tr><td style="padding:8px;font-weight:bold">Société</td><td style="padding:8px">${company}</td></tr>` : ''}
          ${type ? `<tr><td style="padding:8px;font-weight:bold">Type</td><td style="padding:8px">${typeLabel[type] || type}</td></tr>` : ''}
          <tr><td style="padding:8px;font-weight:bold">Objet</td><td style="padding:8px">${subject}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Message</td><td style="padding:8px;white-space:pre-wrap">${message}</td></tr>
        </table>
      `
    });

    // Confirmation to sender
    await transporter.sendMail({
      from: `"Voltea Énergie" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Votre message a bien été reçu — Voltea Énergie',
      html: `
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
        <p>Cordialement,<br><strong>L'équipe Voltea Énergie</strong></p>
      `
    });

    res.json({ message: 'Message envoyé avec succès.' });
  } catch (err) {
    console.error('Erreur mail:', err);
    res.status(500).json({ error: 'Impossible d\'envoyer le message. Veuillez réessayer.' });
  }
});

module.exports = router;
