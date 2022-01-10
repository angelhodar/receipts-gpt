import nc from "next-connect";
import { processBill } from "../../../lib/veryfi";
import { prisma } from "../../../lib/db";

const get = async (req, res) => {
  const orders = await prisma.order.findMany();
  return res.status(200).json(orders);
};

const post = async (req, res) => {
  const { url } = req.body;
  const data = await processBill(url);
  if (data == null) return res.status(400).json({});
  const order = await createOrder(data);
  return res.status(201).json(order);
};

const createOrder = async ({ items, ...rest }) => {
  return await prisma.order.create({
    data: {
      items: { create: items },
      ...rest,
    },
  });
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
