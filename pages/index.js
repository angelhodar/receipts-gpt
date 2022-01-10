import { Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import ReceiptUploader from "../components/ReceiptUploader";
import Features from "../components/Features";

export default function Index(props) {
  return (
    <Box as="section">
      <Box
        maxW="3xl"
        mx="auto"
        px={{ base: "6", lg: "8" }}
        py={{ base: "16", sm: "20" }}
        textAlign="center"
      >
        <Heading
          my="4"
          as="h2"
          fontSize={{ base: "4xl", md: "6xl" }}
          fontWeight="extrabold"
          letterSpacing="tight"
          lineHeight="1.2"
        >
          Paying bills made easy with{" "}
          <Box
            as="mark"
            bg="unset"
            color={useColorModeValue("blue.600", "blue.200")}
            whiteSpace="nowrap"
          >
            BillShare
          </Box>
        </Heading>
        <Text fontSize="lg" maxW="xl" mx="auto">
          Because paying a bill shouldn't be a pain
        </Text>
        <ReceiptUploader />
      </Box>
      <Features />
    </Box>
  );
}
