// api/order.js
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || TO_EMAIL;

if (!SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY not set — email sending disabled.");
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

function buildOrderHtml(payload) {
  const { name, phone, email, address, note, items, total } = payload || {};
  const itemsHtml = (items || [])
    .map(
      (it) =>
        `<li><strong>${it.title || ""}</strong> ${it.variant ? `(${it.variant})` : ""} — qty: ${it.qty || 0} — price: ${it.price || 0}</li>`
    )
    .join("");
  return `
    <h2>New Order Received</h2>
    <p><strong>Name:</strong> ${name || "-"}</p>
    <p><strong>Phone:</strong> ${phone || "-"}</p>
    <p><strong>Email:</strong> ${email || "-"}</p>
    <p><strong>Address:</strong> ${address || "-"}</p>
    <p><strong>Note:</strong> ${note || "-"}</p>
    <h3>Items</h3>
    <ul>${itemsHtml}</ul>
    <p><strong>Total:</strong> ${total || 0}</p>
    <hr/>
    <pre>${JSON.stringify(payload, null, 2)}</pre>
  `;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const payload = req.body || {};
    // Basic validation
    if (!payload.name || !payload.phone) {
      return res.status(400).json({ error: "Missing required fields: name or phone" });
    }

    if (!SENDGRID_API_KEY) {
      return res.status(500).json({ error: "SendGrid API key not configured on server" });
    }
    if (!TO_EMAIL) {
      return res.status(500).json({ error: "TO_EMAIL not configured on server" });
    }

    const html = buildOrderHtml(payload);
    const text = `New order from ${payload.name || "unknown"} - phone: ${payload.phone || "-"}. Total: ${payload.total || 0}`;

    const msg = {
      to: TO_EMAIL,
      from: FROM_EMAIL,
      subject: `New order from ${payload.name || "Customer"}`,
      text,
      html,
    };

    await sgMail.send(msg);

    return res.status(200).json({ ok: true, message: "Order received" });
  } catch (err) {
    console.error("SendGrid error:", err);
    return res.status(500).json({ error: "Failed to send email", details: String(err) });
  }
    }
