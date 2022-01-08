import { ChakraProvider } from "@chakra-ui/react";
import { SWRConfig } from "swr";

function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <SWRConfig
        value={{
          fetcher: (...args) => fetch(...args).then((res) => res.json()),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </ChakraProvider>
  );
}

export default App;
