// api/order.js
// CommonJS style for Vercel serverless functions
const sgMail = require('@sendgrid/mail');

module.exports = async function (req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL; // e.g. "no-reply@yourdomain.com"
  const TO_EMAIL = process.env.TO_EMAIL;     // e.g. your admin/sales email

  if (!SENDGRID_API_KEY) {
    console.error('Missing SENDGRID_API_KEY');
    return res.status(500).json({ error: 'Server misconfiguration: missing SendGrid key' });
  }
  if (!FROM_EMAIL || !TO_EMAIL) {
    console.error('Missing FROM_EMAIL or TO_EMAIL');
    return res.status(500).json({ error: 'Server misconfiguration: missing email addresses' });
  }

  const { name, phone, email, address, items, note, paymentMethod } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  sgMail.setApiKey(SENDGRID_API_KEY);

  // Build email content (simple HTML)
  const subject = `New order from ${name}`;
  const html = `
    <h2>New Order</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email || '—'}</p>
    <p><strong>Address:</strong> ${address || '—'}</p>
    <p><strong>Payment Method:</strong> ${paymentMethod || '—'}</p>
    <p><strong>Note:</strong> ${note || '—'}</p>
    <h3>Items</h3>
    <pre>${JSON.stringify(items || [], null, 2)}</pre>
  `;

  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject,
    html
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ ok: true, message: 'Order email sent' });
  } catch (err) {
    console.error('SendGrid error:', err && err.response ? err.response.body : err);
    return res.status(500).json({ error: 'Failed to send email', details: err && err.message });
  }
};
