// /api/order.js
// Vercel serverless endpoint to handle incoming order POSTs.
// Sends an email (SendGrid) and a WhatsApp message (Twilio) to the admin.
// Returns JSON always.

import sendgrid from "@sendgrid/mail";
import Twilio from "twilio";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL; // admin email to receive order copies
const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@anantgillfoods.in";

const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+1415XXXXXXX"
const ADMIN_WHATSAPP_TO = process.env.ADMIN_WHATSAPP_TO; // admin number e.g. "+91xxxxxxxxxx" (without whatsapp: prefix)

if (SENDGRID_API_KEY) sendgrid.setApiKey(SENDGRID_API_KEY);

const buildTextFromPayload = (payload) => {
  const lines = [];
  lines.push(`New order received`);
  if (payload.name) lines.push(`Name: ${payload.name}`);
  if (payload.phone) lines.push(`Phone: ${payload.phone}`);
  if (payload.email) lines.push(`Email: ${payload.email || "-"}`);
  if (payload.address) lines.push(`Address: ${payload.address}`);
  if (payload.note) lines.push(`Note: ${payload.note}`);
  lines.push("");
  lines.push("Items:");
  (payload.items || []).forEach((it, idx) => {
    lines.push(`${idx + 1}. ${it.title}${it.variant ? ` (${it.variant})` : ""} — qty: ${it.qty} — price: ${it.price}`);
  });
  lines.push("");
  lines.push(`Total: ₹${payload.total || 0}`);
  lines.push("");
  lines.push("Reply on WhatsApp to contact the customer or request payment via GPay / UPI.");
  return lines.join("\n");
};

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== "POST") {
    res.setHeader("Content-Type", "application/json");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // parse body
  let body = req.body;
  // If body is a string, try parse
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (err) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: "Invalid JSON in request body" });
    }
  }

  // Basic validation
  if (!body || !body.name || !body.phone || !Array.isArray(body.items) || body.items.length === 0) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: "Missing required fields: name, phone, items" });
  }

  // Build order summary
  const text = buildTextFromPayload(body);
  const html = `<pre style="font-family: monospace; white-space: pre-wrap;">${text.replace(/</g, "&lt;")}</pre>`;

  // Send email via SendGrid (if configured)
  const emailPromises = [];
  if (SENDGRID_API_KEY && TO_EMAIL) {
    try {
      const msg = {
        to: TO_EMAIL,
        from: FROM_EMAIL,
        subject: `New order — ${body.name} — ₹${body.total || 0}`,
        text,
        html,
      };
      emailPromises.push(sendgrid.send(msg));
    } catch (err) {
      // do not crash - capture below
      console.error("SendGrid send error:", err?.message || err);
    }
  }

  // Send WhatsApp via Twilio (if configured)
  const waPromises = [];
  if (TWILIO_SID && TWILIO_AUTH_TOKEN && TWILIO_WHATSAPP_FROM && ADMIN_WHATSAPP_TO) {
    try {
      const client = Twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
      const waBody = `📦 New Order\nName: ${body.name}\nPhone: ${body.phone}\nTotal: ₹${body.total || 0}\nItems: ${body.items.map(it => `${it.title} x${it.qty}`).join(", ")}\n\nOpen chat with the customer to confirm.`;
      // Note: Twilio expects 'whatsapp:+...' format for both from and to.
      const to = `whatsapp:${ADMIN_WHATSAPP_TO.replace(/^whatsapp:/, "")}`;
      const from = TWILIO_WHATSAPP_FROM.replace(/^whatsapp:/, "");
      waPromises.push(
        client.messages.create({
          from: `whatsapp:${from}`,
          to,
          body: waBody,
        })
      );
    } catch (err) {
      console.error("Twilio init/send error:", err?.message || err);
    }
  }

  try {
    // wait for sending attempts (if any)
    await Promise.allSettled([...emailPromises, ...waPromises]);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ ok: true, message: "Order received" });
  } catch (err) {
    console.error("Unexpected error in /api/order:", err);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: "Internal server error" });
  }
}
