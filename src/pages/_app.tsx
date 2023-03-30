import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { WagmiConfig } from "wagmi";
import { client } from "../utils/wagmi";
import { NavBar } from "@/components/Navbar";

function MyApp({ Component, pageProps }: AppProps) {

  const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false,
  };

  const theme = extendTheme({ config });

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
