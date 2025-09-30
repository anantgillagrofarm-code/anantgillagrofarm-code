// netlify/functions/order.js
import sendgrid from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || TO_EMAIL;

if (SENDGRID_API_KEY) {
  sendgrid.setApiKey(SENDGRID_API_KEY);
}

export async function handler(event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    const data = JSON.parse(event.body || "{}");

    if (!SENDGRID_API_KEY) {
      console.error("Missing SENDGRID_API_KEY");
      return { statusCode: 500, body: JSON.stringify({ error: "Email service not configured" }) };
    }

    const msg = {
      to: TO_EMAIL,
      from: FROM_EMAIL,
      subject: `New Order from ${data.name || "Guest"}`,
      html: `
        <h3>New Order Received</h3>
        <p><b>Name:</b> ${data.name || ""}</p>
        <p><b>Phone:</b> ${data.phone || ""}</p>
        <p><b>Email:</b> ${data.email || ""}</p>
        <p><b>Address:</b> ${data.address || ""}</p>
        <p><b>Note:</b> ${data.note || ""}</p>
      `,
    };

    await sendgrid.send(msg);

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("Order function error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to process order" }) };
  }
}
