import { ChakraProvider } from "@chakra-ui/react";
import { SWRConfig } from "swr";
import Navbar from "../components/Navbar/Navbar";   

function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <SWRConfig
        value={{
          fetcher: (...args) => fetch(...args).then((res) => res.json()),
        }}
      >
        <Navbar />
        <Component {...pageProps} />
      </SWRConfig>
    </ChakraProvider>
  );
}

export default App;
