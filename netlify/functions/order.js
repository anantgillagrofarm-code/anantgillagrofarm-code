// TEMPORARY debug function — returns the parsed body and logs everything
exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Log raw body (Netlify logs)
  console.log("RAW event.body:", event.body);

  // Try to parse JSON safely
  let parsed;
  try {
    parsed = event.body ? JSON.parse(event.body) : null;
  } catch (err) {
    console.error("JSON parse error:", err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON input", details: err.message }),
    };
  }

  // Return the parsed body back (so client will receive it)
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, received: parsed }),
  };
};
