// api/order.js
const sgMail = require("@sendgrid/mail");

// Basic HTML-escaping helper to avoid injection in the email
function escapeHtml(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, email, address, items, total, note } = req.body || {};

  // minimal validation
  if (!name || !phone || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing required fields (name, phone, items)" });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const TO_EMAIL = process.env.TO_EMAIL;
  const FROM_EMAIL = process.env.FROM_EMAIL || TO_EMAIL; // best to configure a verified FROM

  if (!SENDGRID_API_KEY || !TO_EMAIL) {
    console.error("Missing SENDGRID_API_KEY or TO_EMAIL env var");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  sgMail.setApiKey(SENDGRID_API_KEY);

  const itemsHtml = items
    .map((it) => {
      const title = escapeHtml(it.title || "");
      const variant = it.variant ? ` (${escapeHtml(it.variant)})` : "";
      const qty = escapeHtml(String(it.qty || 0));
      const price = escapeHtml(String(it.price || 0));
      const lineTotal = escapeHtml(String((it.qty || 0) * (it.price || 0)));
      return `<li style="margin-bottom:6px">${title}${variant} — ${qty} × ${price} = <strong>${lineTotal}</strong></li>`;
    })
    .join("");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0b3b2a">
      <h2>New order from ${escapeHtml(name)}</h2>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email || "—")}</p>
      <p><strong>Address:</strong><br/>${escapeHtml(address || "—")}</p>
      <p><strong>Note:</strong> ${escapeHtml(note || "—")}</p>
      <h3>Items</h3>
      <ul>${itemsHtml}</ul>
      <p><strong>Total:</strong> ₹${escapeHtml(String(total || 0))}</p>
      <hr/>
      <p style="font-size:12px;color:#666">This email was sent from your website checkout.</p>
    </div>
  `;

  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: `New order — ${name} — ₹${total}`,
    html,
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("SendGrid error:", err && err.response ? err.response.body || err : err);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
