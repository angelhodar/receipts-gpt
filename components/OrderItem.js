import { Td, Tr } from "@chakra-ui/react";
import * as React from "react";

export default function OrderItem({ item }) {
  return (
    <Tr>
      <Td>{item.item}</Td>
      <Td>{item.quantity}</Td>
      <Td isNumeric>{item.price}€</Td>
    </Tr>
  );
}
