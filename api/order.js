// api/order.js
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || TO_EMAIL;

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
    if (!payload.name || !payload.phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (SENDGRID_API_KEY && TO_EMAIL) {
      const msg = {
        to: TO_EMAIL,
        from: FROM_EMAIL,
        subject: `New order from ${payload.name}`,
        text: `Order details:\n\n${JSON.stringify(payload, null, 2)}`,
        html: `<pre>${JSON.stringify(payload, null, 2)}</pre>`,
      };
      await sgMail.send(msg);
      return res.status(200).json({ ok: true, message: "Order sent" });
    } else {
      console.log("Order received (no SendGrid):", payload);
      return res.status(200).json({ ok: true, message: "Order received (no email sent)" });
    }
  } catch (err) {
    console.error("Order handler error:", err);
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}
