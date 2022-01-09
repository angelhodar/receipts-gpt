import { processBill } from "../../../lib/veryfi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const get = async (req, res) => {
  const orders = await prisma.order.findMany();
  return res.status(200).json(orders);
};

const post = async (req, res) => {
  const { url } = req.body;
  const data = await processBill(url);
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
