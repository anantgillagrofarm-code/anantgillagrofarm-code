// api/order.js
import sendgrid from "@sendgrid/mail";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, email, address, note, cart } = req.body;

  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL || !process.env.TO_EMAIL) {
    return res.status(500).json({ error: "Server misconfiguration: missing SendGrid key" });
  }

  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    const message = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `New Order from ${name}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Note:</strong> ${note || "None"}</p>
        <h3>Cart:</h3>
        <ul>
          ${cart.map(item => `<li>${item.name} - ${item.quantity} x ₹${item.price}</li>`).join("")}
        </ul>
      `,
    };

    await sendgrid.send(message);

    res.status(200).json({ success: true, message: "Order placed successfully!" });
  } catch (error) {
    console.error("SendGrid error:", error);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
}
