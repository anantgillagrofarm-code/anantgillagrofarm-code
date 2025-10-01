const sgMail = require("@sendgrid/mail");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse body safely
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON input" }),
      };
    }

    const { name, phone, email, address, note, cart } = data;

    // Setup SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: process.env.TO_MAIL, // Your email
      from: process.env.FROM_MAIL, // Verified sender in SendGrid
      subject: `New Order from ${name}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Note:</strong> ${note || "None"}</p>
        <h3>Cart Items</h3>
        <ul>
          ${
            cart && cart.length
              ? cart.map(
                  (item) =>
                    `<li>${item.name} - ${item.qty} x ₹${item.price}</li>`
                ).join("")
              : "<li>No items</li>"
          }
        </ul>
      `,
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Order processed successfully" }),
    };
  } catch (error) {
    console.error("Order function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process order" }),
    };
  }
};
