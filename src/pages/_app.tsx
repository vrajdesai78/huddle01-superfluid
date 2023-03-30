import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { WagmiConfig } from "wagmi";
import { client } from "../utils/wagmi";
import { ConnectKitProvider } from "connectkit";
import { NavBar } from "@/components/Navbar";

function MyApp({ Component, pageProps }: AppProps) {

  const colors = {
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  };

  const theme = extendTheme({ colors });

  return (
    <WagmiConfig client={client}>
        <ChakraProvider theme={theme}>
          <NavBar/>
          <Component {...pageProps} />
        </ChakraProvider>
    </WagmiConfig>
  );
}

export default MyApp;
