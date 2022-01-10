import nc from "next-connect";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const get = async (req, res) => {
  const { id } = req.query;
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { items: true },
  });
  res.status(200).json(order);
};

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end("Page is not found");
  },
}).get(get);

export default handler;
