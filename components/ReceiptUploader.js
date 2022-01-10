import React, { useState, useRef } from "react";
import { Center, Button, Stack } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import QRCode from "react-qr-code";
import Link from "next/link";
import { FiUpload, FiCamera } from "react-icons/fi";
import { removeFile, uploadFile } from "../lib/supabase";

export default function ReceiptUploader() {
  const [orderId, setOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInput = useRef(null);
  const cameraInput = useRef(null);

  const getRedirectURL = () => {
    return typeof window !== "undefined"
      ? `${window.location.hostname}/orders/${orderId}`
      : "";
  };

  const handleFileUpload = (input) => input.current.click();
  const handleFileChange = (e) => upload(e.target.files[0]);

  const upload = async (file) => {
    setIsLoading(true);
    const url = await uploadFile(file);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const { id } = await response.json();
      setOrderId(id);
    } catch (e) {
      await removeFile(file);
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        ref={fileInput}
        accept="image/*"
        onChange={handleFileChange}
        type="file"
        style={{ display: "none" }}
      />
      <input
        ref={cameraInput}
        accept="image/*"
        onChange={handleFileChange}
        type="file"
        capture="environment"
        style={{ display: "none" }}
      />
      {orderId == null ? (
        <Stack
          direction={{ base: "column", sm: "row" }}
          mt="10"
          justify="center"
          spacing={{ base: "3", md: "5" }}
          maxW="md"
          mx="auto"
        >
          <Button
            isLoading={isLoading}
            leftIcon={<FiUpload />}
            as="a"
            href="#"
            size="lg"
            h="16"
            px="10"
            onClick={() => handleFileUpload(fileInput)}
            colorScheme={error ? "red" : "blue"}
            fontWeight="bold"
            flex={{ md: "1" }}
          >
            Upload bill
          </Button>
          {isMobile && (
            <Button
              isLoading={isLoading}
              leftIcon={<FiCamera />}
              as="a"
              flex={{ md: "1" }}
              colorScheme={error ? "red" : "blue"}
              onClick={() => handleFileUpload(cameraInput)}
              href="#"
              size="lg"
              h="16"
              px="10"
              fontWeight="bold"
            >
              Take bill picture
            </Button>
          )}
        </Stack>
      ) : (
        <Stack
          mt="10"
          justify="center"
          spacing="10"
          maxW="md"
          mx="auto"
          direction="column"
        >
          <Center>
            <QRCode value={getRedirectURL()}></QRCode>
          </Center>
          <Link href={`/orders/${orderId}`} passHref>
            <Button as="a" colorScheme="blue">
              View Details
            </Button>
          </Link>
        </Stack>
      )}
    </div>
  );
}
