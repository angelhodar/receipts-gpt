const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = async (orderId) => {
  const sessions = await stripe.checkout.sessions.list();
  return sessions.data.find((s) => s.metadata.orderId === orderId);
};

export const createCheckoutSession = async ({ origin, orderId, amount }) => {
  const price = await stripe.prices.create({
    unit_amount: amount * 100,
    currency: "eur",
    product_data: { name: `Order #${orderId}` },
    metadata: { orderId },
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    metadata: { orderId },
    mode: "payment",
    success_url: `${origin}/?status=success`,
    cancel_url: `${origin}/?status=canceled`,
  });

  return session;
};
