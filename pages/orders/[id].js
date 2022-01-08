import {
  Box,
  Button,
  HStack,
  Heading,
  Text,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import useSWR from "swr";
import { HiPencilAlt } from "react-icons/hi";
import { CardContent } from "../../components/CardContent";
import { CardWithAvatar } from "../../components/CardWithAvatar";
import { useRouter } from "next/router";
import OrderItems from "../../components/OrderItems";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Order() {
  const [amount, setAmount] = React.useState(0);
  const router = useRouter();
  const { id } = router.query;
  const { data: order, error } = useSWR(id ? `/api/orders/${id}` : null);

  const processCheckout = async () => {
    try {
      const stripe = await stripePromise;
      const response = await fetch("/api/checkouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: id,
          amount,
        }),
      });
      const { session } = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) console.log(result.error.message);
    } catch (e) {
      console.log("Error");
    }
  };

  if (error || !order) return null;

  return (
    <Box as="section" pt="20" pb="12" position="relative">
      <Box position="absolute" inset="0" height="32" bg="blue.600" />
      <CardWithAvatar
        maxW="xl"
        avatarProps={{
          src: order.verifyData.img_url,
          name: "Bill",
        }}
        action={
          <Button size="sm" leftIcon={<HiPencilAlt />}>
            Edit
          </Button>
        }
      >
        <CardContent>
          <Heading size="lg" fontWeight="extrabold" letterSpacing="tight">
            {order.total}€
          </Heading>
          <Text color={useColorModeValue("gray.600", "gray.400")}>
            Order #{order.id}
          </Text>
          <Box py={5}>
            <OrderItems items={order.items} />
          </Box>
          <HStack py={5}>
            <Input
              _placeholder={{ color: "gray.800" }}
              placeholder="Type the amount you pay..."
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button onClick={processCheckout} colorScheme="blue">
              Checkout
            </Button>
          </HStack>
        </CardContent>
      </CardWithAvatar>
    </Box>
  );
}
