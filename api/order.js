// api/order.js
// Example serverless endpoint that sends an email via SendGrid.
// Make sure SENDGRID_API_KEY, TO_EMAIL and FROM_EMAIL are set in Vercel env vars.

import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.TO_EMAIL;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY not set — email sending disabled.');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { order } = req.body || {};

    if (!SENDGRID_API_KEY) {
      return res.status(500).json({ error: 'SendGrid API key not configured on server' });
    }

    const msg = {
      to: TO_EMAIL,
      from: FROM_EMAIL,
      subject: `New order received`,
      text: `New order: ${JSON.stringify(order || {})}`,
      html: `<pre>${JSON.stringify(order || {}, null, 2)}</pre>`
    };

    await sgMail.send(msg);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('SendGrid error:', err);
    return res.status(500).json({ error: 'Failed to send email', details: String(err) });
  }
}
