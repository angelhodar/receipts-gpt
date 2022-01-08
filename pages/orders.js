import * as React from "react";
import { Box, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import OrderCard from "../components/OrderCard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function Orders({ orders }) {
  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.800")}
      px={{ base: "6", md: "8" }}
      py="12"
    >
      <Box as="section">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export const getServerSideProps = async () => {
  let orders = await prisma.order.findMany();
  orders.forEach(o => o.createdAt = o.createdAt.toISOString());
  return { props: { orders }};
};
