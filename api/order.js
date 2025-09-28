// api/order.js
import sendgrid from "@sendgrid/mail";

/**
 * Serverless endpoint to receive order POSTs and email an order summary via SendGrid.
 *
 * Expected JSON POST body:
 * {
 *   name: "Customer Name",
 *   phone: "1234567890",
 *   email: "customer@example.com",
 *   address: "123 Main St...",
 *   items: [ { id, title, qty, price }, ... ],
 *   note: "optional note",
 *   paymentMethod: "COD" | "ONLINE"
 * }
 *
 * Environment variables (set in Vercel dashboard):
 *   SENDGRID_API_KEY - your sendgrid API key (required)
 *   FROM_EMAIL       - sender email (must be verified in SendGrid). default falls back to anantgillagrofarm@gmail.com
 *   TO_EMAIL         - recipient (admin) email to receive order alerts. default falls back to anantgillagrofarm@gmail.com
 */

export default async function handler(req, res) {
  // only accept POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || "anantgillagrofarm@gmail.com";
  const TO_EMAIL = process.env.TO_EMAIL || "anantgillagrofarm@gmail.com";

  if (!SENDGRID_API_KEY) {
    console.error("Missing SENDGRID_API_KEY");
    return res
      .status(500)
      .json({ error: "Server misconfiguration: missing SendGrid key" });
  }
  if (!FROM_EMAIL || !TO_EMAIL) {
    return res
      .status(500)
      .json({ error: "Server misconfiguration: missing email address (FROM_EMAIL or TO_EMAIL)" });
  }

  // parse request body
  const { name, phone, email, address, items = [], note = "", paymentMethod = "" } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // configure SendGrid
  sendgrid.setApiKey(SENDGRID_API_KEY);

  // build a simple HTML summary of the order
  function itemsHtml(itemsArr) {
    if (!Array.isArray(itemsArr) || itemsArr.length === 0) return "<p>No items</p>";
    const lines = itemsArr.map(it => {
      const title = it.title || it.name || "Item";
      const qty = it.qty ?? it.quantity ?? 1;
      const price = ("price" in it) ? `₹${it.price}` : "";
      return `<tr>
                <td style="padding:6px 8px;border:1px solid #eee">${title}</td>
                <td style="padding:6px 8px;border:1px solid #eee;text-align:center">${qty}</td>
                <td style="padding:6px 8px;border:1px solid #eee;text-align:right">${price}</td>
              </tr>`;
    });
    return `<table style="border-collapse:collapse;width:100%;margin-top:8px">
              <thead>
                <tr>
                  <th style="text-align:left;padding:6px 8px;border:1px solid #eee">Product</th>
                  <th style="text-align:center;padding:6px 8px;border:1px solid #eee">Qty</th>
                  <th style="text-align:right;padding:6px 8px;border:1px solid #eee">Price</th>
                </tr>
              </thead>
              <tbody>
                ${lines.join("\n")}
              </tbody>
            </table>`;
  }

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #111;">
      <h2>New order from ${escapeHtml(name)}</h2>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}<br/>
         <strong>Email:</strong> ${escapeHtml(email || "—")}<br/>
         <strong>Payment method:</strong> ${escapeHtml(paymentMethod || "—")}
      </p>
      <p><strong>Address:</strong><br/>${escapeHtml(address || "—")}</p>
      <p><strong>Note:</strong> ${escapeHtml(note || "—")}</p>
      <h3>Items</h3>
      ${itemsHtml(items)}
      <hr/>
      <p style="font-size:13px;color:#666">Order received on ${new Date().toLocaleString()}</p>
    </div>
  `;

  const subject = `New Order — ${name} — ${phone}`;

  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject,
    html,
  };

  try {
    await sendgrid.send(msg);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("SendGrid send error:", err?.response?.body || err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}

// small utility to avoid basic HTML injection
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
