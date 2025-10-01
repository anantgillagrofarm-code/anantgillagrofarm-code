// Place COD order (Netlify function)
async function placeOrderCOD() {
  const val = validateCustomer();
  if (val) { setSubmitError(val); return; }

  const payload = {
    // using same shape your netlify function accepts (body or order)
    order: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      note: customer.note,
      items: cart.map(it => ({ title: it.productTitle, variant: it.variantLabel, qty: it.qty, price: it.price })),
      total: subtotal,
    }
  };

  setSubmitting(true); setSubmitError(null);

  try {
    const resp = await fetch('/.netlify/functions/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // read as text first to avoid JSON parsing crash on non-json responses
    const text = await resp.text();
    let body;
    try {
      body = text ? JSON.parse(text) : null;
    } catch (err) {
      throw new Error(`Invalid JSON response from server: ${text}`);
    }

    if (!resp.ok) {
      throw new Error((body && (body.error || body.details)) || resp.statusText || 'Order failed');
    }

    // success
    setSubmitSuccess(true);
    setCart([]); // clear cart
    setTimeout(() => {
      setCheckoutOpen(false);
      setSubmitSuccess(false);
      setCustomer({ name: "", phone: "", email: "", address: "", note: "" });
    }, 2000);

  } catch (err) {
    console.error('Order error:', err);
    setSubmitError(err.message || 'Order failed');
  } finally {
    setSubmitting(false);
  }
                                      }
