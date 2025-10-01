// netlify/functions/order.js
const sendgrid = require('@sendgrid/client'); // or @sendgrid/mail depending on your usage

exports.handler = async function(event, context) {
  try {
    // if you're expecting POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // parse body (if already JSON, event.body should be a string)
    let payload;
    try {
      payload = event.body ? JSON.parse(event.body) : null;
    } catch (err) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    // quick basic validation
    if (!payload || !payload.name || !payload.phone) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // --- SendGrid or other logic here ---
    // Example using @sendgrid/client or mail
    // Make sure SENDGRID_API_KEY is read from process.env.SENDGRID_API_KEY
    // and FROM_MAIL from process.env.FROM_MAIL
    // Wrap send action in try/catch

    try {
      // Example: pretend to send email; replace with your real SendGrid call
      // const sgApiKey = process.env.SENDGRID_API_KEY;
      // sendgrid.setApiKey(sgApiKey);
      // await sendgrid.send({ ... });

      // For now, respond success
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Order received' })
      };
    } catch (sendErr) {
      // If SendGrid fails, return a JSON error with details (do not return HTML)
      console.error('Send error:', sendErr);
      const msg = (sendErr && sendErr.message) ? sendErr.message : 'Failed to send';
      return {
        statusCode: sendErr && sendErr.code ? sendErr.code : 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to process order', details: msg })
      };
    }

  } catch (err) {
    console.error('Unhandled error', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
