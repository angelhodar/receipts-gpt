import React, { useState, useRef } from "react";
import { Button, Stack } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { FiUpload, FiCamera } from "react-icons/fi";

export default function ReceiptUploader(props) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInput = useRef(null);
  const cameraInput = useRef(null);

  const handleFileUpload = (input) => input.current.click();
  const handleFileChange = (e) => upload(e.target.files[0]);

  const upload = async (image) => {
    setIsLoading(true);
    const body = new FormData();
    body.append("file", image);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        body,
      });
      console.log(await response.json());
    } catch (e) {
      console.log("Error");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <input
        ref={fileInput}
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
          colorScheme="blue"
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
            colorScheme="blue"
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
    </div>
  );
}
