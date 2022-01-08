import { Table, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import * as React from "react";
import OrderItem from "./OrderItem";

export default function OrderItems({ items }) {
  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>Item</Th>
          <Th>Quantity</Th>
          <Th isNumeric>Price</Th>
        </Tr>
      </Thead>
      <Tbody>
        {items.map((item) => (
          <OrderItem key={item.item} item={item} />
        ))}
      </Tbody>
    </Table>
  );
}
