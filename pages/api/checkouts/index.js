import nc from "next-connect";
import { getCheckoutSession, createCheckoutSession } from "../../../lib/stripe";

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
      const params = { origin: req.headers.origin, orderId, amount };
      const session = await createCheckoutSession(params);
      res.status(200).json(session);
    }
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json(err.message);
  }
};

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end("Page is not found");
  },
}).get(get).post(post);

export default handler;
