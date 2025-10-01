// api/order.js
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.TO_EMAIL;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn("SENDGRID_API_KEY not set — email sending disabled.");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const payload = req.body || {};
    // Basic validation
    if (!payload || !payload.name || !payload.phone) {
      return res.status(400).json({ error: "Missing required fields (name, phone)" });
    }

    if (!SENDGRID_API_KEY) {
      return res.status(500).json({ error: "SendGrid API key not configured on server" });
    }
    if (!TO_EMAIL) {
      return res.status(500).json({ error: "TO_EMAIL env var not set" });
    }

    const subject = `New order from ${payload.name || "customer"}`;
    const plainText = `New order details:\n\n${JSON.stringify(payload, null, 2)}`;

    const html = `<h2>New order received</h2>
    <pre style="font-family: monospace;">${JSON.stringify(payload, null, 2)}</pre>`;

    const msg = {
      to: TO_EMAIL,
      from: FROM_EMAIL || TO_EMAIL,
      subject,
      text: plainText,
      html,
    };

    await sgMail.send(msg);

    return res.status(200).json({ ok: true, success: true, message: "Order email sent" });
  } catch (err) {
    console.error("SendGrid error:", err);
    // expose only non-sensitive message
    return res.status(500).json({ error: "Failed to send order email", details: String(err?.message || err) });
  }
}
