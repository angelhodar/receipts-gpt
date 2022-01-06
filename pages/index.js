import React, { useCallback } from "react";
import { Center, useColorModeValue } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";

export default function Home(props) {
  const onDrop = useCallback((acceptedFiles) => {
    upload(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const upload = async (image) => {
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
  };

  const dropText = isDragActive
    ? "Drop the files here ..."
    : "Drag 'n' drop image file here, or click to select files";

  const activeBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue(
    isDragActive ? "teal.300" : "gray.300",
    isDragActive ? "teal.500" : "gray.500"
  );

  return (
    <Center
      p={10}
      cursor="pointer"
      bg={isDragActive ? activeBg : "transparent"}
      _hover={{ bg: activeBg }}
      transition="background-color 0.2s ease"
      borderRadius={4}
      border="3px dashed"
      borderColor={borderColor}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <p>{dropText}</p>
    </Center>
  );
}
