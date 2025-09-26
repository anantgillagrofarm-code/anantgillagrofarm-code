// api/order.js
import sendgrid from "@sendgrid/mail";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL;
  const TO_EMAIL = process.env.TO_EMAIL;

  // Basic request body validation
  const { name, phone, email, address, items, total, payMode } = req.body ?? {};

  if (!name || !phone) {
    return res.status(400).json({ error: "Missing required fields: name or phone" });
  }

  // If SendGrid key is missing, return a clear error (and avoid crashing)
  if (!SENDGRID_API_KEY) {
    console.error("Missing SENDGRID_API_KEY in process.env");
    return res.status(500).json({ error: "Server misconfiguration: missing SendGrid key" });
  }

  // Configure SendGrid
  sendgrid.setApiKey(SENDGRID_API_KEY);

  // Compose a simple HTML email with order details
  const itemsHtml = Array.isArray(items)
    ? items.map(i => `<li>${i.title} x ${i.qty} — ₹${i.price}</li>`).join("")
    : "";

  const html = `
    <h2>New order from website</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email || "—")}</p>
    <p><strong>Address:</strong> ${escapeHtml(address || "—")}</p>
    <p><strong>Payment mode:</strong> ${escapeHtml(payMode || "—")}</p>
    <p><strong>Items:</strong></p>
    <ul>${itemsHtml}</ul>
    <p><strong>Total:</strong> ₹${escapeHtml(String(total || "0"))}</p>
  `;

  try {
    const msg = {
      to: TO_EMAIL || FROM_EMAIL, // fallback to FROM if TO not set
      from: FROM_EMAIL || TO_EMAIL, // fallback
      subject: `New order from ${name}`,
      html,
      text: `New order from ${name} (${phone}) - total ₹${total || "0"}`,
    };

    await sendgrid.send(msg);

    // Return success
    return res.status(200).json({ success: true, message: "Order received and email sent." });
  } catch (err) {
    console.error("SendGrid error:", err?.response?.body || err.message || err);
    return res.status(500).json({
      error: "Failed to send email",
      details: err?.response?.body || err.message || null,
    });
  }
}

// Basic helper to avoid injecting unescaped HTML
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
