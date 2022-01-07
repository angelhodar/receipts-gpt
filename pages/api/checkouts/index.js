const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const post = async (req, res) => {
  const { orderId } = req.body;
  const createdSession = await getCheckoutSession(orderId);

  if (createdSession) {
    res.status(200).json({ checkout: createdSession.url });
  } else {
    try {
      const session = await createCheckoutSession(orderId);
      res.status(200).json({ checkout: session.url });
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  }
};

const getCheckoutSession = async (orderId) => {
  const sessions = await stripe.checkout.sessions.list();
  return sessions.data.find((s) => s.metadata.orderId === orderId);
};

const createCheckoutSession = async (orderId) => {
  const price = await stripe.prices.create({
    unit_amount: null,
    currency: "eur",
    recurring: { interval: "day" },
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
    success_url: `${req.headers.origin}/?status=success`,
    cancel_url: `${req.headers.origin}/?status=canceled`,
  });

  return session;
};

export default (req, res) => {
  req.method === "GET"
    ? console.log("GET")
    : req.method === "POST"
    ? post(req, res)
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "PUT"
    ? console.log("PUT")
    : res.status(404).send("");
};
