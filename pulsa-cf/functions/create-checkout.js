// functions/create-checkout.js
//
// Cloudflare Pages Function — soubor v /functions/ se automaticky stane
// endpointem na stejné cestě (tady tedy POST /create-checkout).
//
// Volá se přímo Stripe REST API přes fetch (bez npm knihovny), takže
// nepotřebuje žádnou instalaci závislostí ani build krok.
//
// Tajný klíč se nastavuje v Cloudflare Pages jako proměnná prostředí
// STRIPE_SECRET_KEY — nikdy není součástí kódu.

const PRODUCTS = {
  lite:   { name: 'PULSA Lite',    price: 89900 },
  pro:    { name: 'PULSA Pro',     price: 159900 },
  promax: { name: 'PULSA Pro Max', price: 229900 }
};

// Stripe API bere parametry ve tvaru pole[index][klíč]=hodnota (form-encoded).
// Tahle funkce vezme vnořený objekt a rozbalí ho do takových párů.
function flatten(obj, prefix, out) {
  if (obj === null || obj === undefined) return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out));
  } else if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      flatten(obj[key], prefix ? `${prefix}[${key}]` : key, out);
    }
  } else {
    out.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(obj)}`);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { items, customer } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Košík je prázdný.' }), { status: 400 });
    }

    const line_items = items.map((item) => {
      const product = PRODUCTS[item.id];
      if (!product) throw new Error('Neznámý produkt: ' + item.id);
      return {
        price_data: {
          currency: 'czk',
          product_data: { name: product.name },
          unit_amount: product.price * 100 // Stripe pracuje v haléřích
        },
        quantity: Math.max(1, parseInt(item.qty, 10) || 1)
      };
    });

    const origin = new URL(request.url).origin;

    const payload = {
      mode: 'payment',
      'payment_method_types[0]': 'card',
      line_items,
      customer_email: (customer && customer.email) || undefined,
      metadata: {
        jmeno: (customer && customer.name) || '',
        telefon: (customer && customer.phone) || ''
      },
      success_url: `${origin}/objednavka-uspech.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/objednavka-zrusena.html`
    };

    const pairs = [];
    flatten(payload, '', pairs);
    const body = pairs.join('&');

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error(session);
      return new Response(JSON.stringify({ error: session.error?.message || 'Platbu se nepodařilo vytvořit.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Platbu se nepodařilo vytvořit. Zkuste to prosím znovu.' }), { status: 500 });
  }
}
