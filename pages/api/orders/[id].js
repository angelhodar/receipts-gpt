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

export default (req, res) => {
  req.method === "GET" ? get(req, res) : res.status(404).json({});
};
