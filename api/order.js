import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, email, address, note, items, total } = req.body;

    // Build order details
    const orderText = `
New Order Received 🛒

Name: ${name}
Phone: ${phone}
Email: ${email || "-"}
Address: ${address}
Note: ${note || "-"}

Items:
${items.map((it) => `- ${it.title} (${it.qty} × ₹${it.price})`).join("\n")}

Total: ₹${total}
    `;

    // Send email
    await sendgrid.send({
      to: process.env.TO_EMAIL,       // your email (where alerts arrive)
      from: process.env.FROM_EMAIL,   // must be a verified sender in SendGrid
      subject: "New Order Received",
      text: orderText,
    });

    return res.status(200).json({ success: true, message: "Order sent!" });
  } catch (err) {
    console.error("Order API error:", err);
    return res.status(500).json({ error: "Failed to send order" });
  }
}
