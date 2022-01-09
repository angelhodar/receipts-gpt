import * as React from "react";
import { Box, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import OrderCard from "../components/OrderCard";
import useSWR from "swr";

export default function Orders() {
  const { data: orders, error } = useSWR("/api/orders");

  if (error || !orders) return null;

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
