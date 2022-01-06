import React, { useCallback } from "react";
import { Center, useColorModeValue } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function Orders({ orders }) {
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

export const getServerSideProps = async () => {
  const posts = await prisma.post.findMany();
  return { props: { posts } };
};
