// api/order.js
// Vercel serverless endpoint (ES module). Expects JSON POSTs with order details.
// Make sure @sendgrid/mail is installed and you have set SENDGRID_API_KEY, TO_EMAIL, FROM_EMAIL in Vercel.

import sendgrid from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.TO_EMAIL; // fallback

if (!SENDGRID_API_KEY) {
  console.error("Missing SENDGRID_API_KEY env var");
} else {
  sendgrid.setApiKey(SENDGRID_API_KEY);
}

function formatCurrency(n) {
  try {
    return `₹${Number(n).toLocaleString("en-IN")}`;
  } catch {
    return `₹${n}`;
  }
}

function safeText(s) {
  return (s ?? "").toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildHtml(order) {
  const { name, phone, email, address, note, items = [], total } = order;

  const rows = (items || [])
    .map((it) => {
      const title = safeText(it.title || it.name || "");
      const qty = safeText(it.qty ?? it.quantity ?? it.qty ?? 1);
      const price = safeText(it.price ?? "");
      const line = it.price ? formatCurrency(it.price) : "";
      return `<tr>
        <td style="padding:8px;border:1px solid #e8e8e8;">${title}</td>
        <td style="padding:8px;border:1px solid #e8e8e8;text-align:center;">${qty}</td>
        <td style="padding:8px;border:1px solid #e8e8e8;text-align:right;">${line}</td>
      </tr>`;
    })
    .join("");

  return `<!doctype html>
  <html>
    <body style="font-family: Arial, Helvetica, sans-serif; color:#213; line-height:1.4;">
      <h2 style="color:#154b2b;">New order received</h2>
      <p><strong>Customer:</strong> ${safeText(name)}</p>
      <p><strong>Phone:</strong> ${safeText(phone)} &nbsp; | &nbsp; <strong>Email:</strong> ${safeText(email)}</p>
      <p><strong>Address:</strong><br/>${safeText(address)}</p>
      ${note ? `<p><strong>Note:</strong> ${safeText(note)}</p>` : ""}
      <h3 style="margin-top:18px;">Items</h3>
      <table style="border-collapse: collapse; width:100%; max-width:700px;">
        <thead>
          <tr>
            <th style="padding:8px;border:1px solid #e8e8e8;background:#f6fff7;text-align:left;">Item</th>
            <th style="padding:8px;border:1px solid #e8e8e8;background:#f6fff7;text-align:center;">Qty</th>
            <th style="padding:8px;border:1px solid #e8e8e8;background:#f6fff7;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${rows || `<tr><td colspan="3" style="padding:8px;border:1px solid #e8e8e8;">(no items)</td></tr>`}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:8px;border:1px solid #e8e8e8;text-align:right;font-weight:700;">Subtotal</td>
            <td style="padding:8px;border:1px solid #e8e8e8;text-align:right;font-weight:700;">${formatCurrency(total ?? 0)}</td>
          </tr>
        </tfoot>
      </table>

      <hr style="margin:18px 0; border:0; border-top:1px solid #eee;"/>
      <p style="font-size:13px;color:#666;">This email was sent from your website order form.</p>
    </body>
  </html>`;
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method === "OPTIONS") {
    // CORS preflight
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed, use POST" });
  }

  // Simple content-type check
  if (!req.headers["content-type"]?.includes("application/json")) {
    return res.status(400).json({ error: "Expected application/json body" });
  }

  let data;
  try {
    data = req.body;
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  // Minimal validation
  const name = data.name || data.customerName || data.fullName;
  const phone = data.phone;
  const address = data.address;
  const items = Array.isArray(data.items) ? data.items : data.cart ?? [];

  if (!name || !phone) {
    return res.status(400).json({ error: "Missing required fields: name and phone" });
  }

  const total = data.total ?? data.subtotal ?? 0;
  const note = data.note ?? data.message ?? "";

  // Compose email
  const subject = `New order from ${name} — ${phone} — ${formatCurrency(total)}`;
  const html = buildHtml({ name, phone, email: data.email || "", address, note, items, total });
  const text = `New order from ${name}\nPhone: ${phone}\nEmail: ${data.email || ""}\nAddress: ${address}\nTotal: ${formatCurrency(total)}\n\nItems:\n${(items || [])
    .map((it) => ` - ${it.title || it.name || ""} x${it.qty ?? 1} ${it.price ? formatCurrency(it.price) : ""}`)
    .join("\n")}`;

  if (!SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY not set");
    return res.status(500).json({ error: "Server misconfiguration: missing SendGrid key" });
  }
  if (!TO_EMAIL) {
    console.error("TO_EMAIL not set");
    return res.status(500).json({ error: "Server misconfiguration: missing TO_EMAIL" });
  }

  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject,
    text,
    html,
  };

  try {
    await sendgrid.send(msg);
    // also return order id or summary to client if you want
    return res.status(200).json({ ok: true, message: "Order email sent" });
  } catch (err) {
    console.error("SendGrid error:", err?.response?.body || err);
    return res.status(500).json({ error: "Failed to send email", details: err?.message || err });
  }
}
