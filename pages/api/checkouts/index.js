const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const get = async (req, res) => {
  const sessions = await stripe.checkout.sessions.list();
  res.status(200).json({ sessions });
};

const post = async (req, res) => {
  const { orderId, amount } = req.body;
  const createdSession = await getCheckoutSession(orderId);

  try {
    if (createdSession) res.status(200).json({ session: createdSession });
    else {
      const session = await createCheckoutSession(req, orderId, amount);
      res.status(200).json(session);
    }
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json(err.message);
  }
};

const getCheckoutSession = async (orderId) => {
  const sessions = await stripe.checkout.sessions.list();
  return sessions.data.find((s) => s.metadata.orderId === orderId);
};

const createCheckoutSession = async (req, orderId, amount) => {
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
    success_url: `${req.headers.origin}/?status=success`,
    cancel_url: `${req.headers.origin}/?status=canceled`,
  });

  return session;
};

export default (req, res) => {
  req.method === "GET"
    ? get(req, res)
    : req.method === "POST"
    ? post(req, res)
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "PUT"
    ? console.log("PUT")
    : res.status(404).send("");
};
