import Client from "@veryfi/veryfi-sdk";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const get = async (req, res) => {
  const { id } = req.query;
  const order = await getOrderData(id);
  res.status(200).json(order);
};

const getOrderData = async (id) => {
  let order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { items: true },
  });
  const veryfi = new Client(
    process.env.VERYFI_CLIENT_ID,
    process.env.VERYFI_CLIENT_SECRET,
    process.env.VERYFI_USERNAME,
    process.env.VERYFI_API_KEY
  );
  const data = await veryfi.get_document(order.verifyId);
  order.verifyData = data;
  return order;
};

export default (req, res) => {
  req.method === "GET" ? get(req, res) : res.status(404).json({});
};
