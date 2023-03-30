import { getDefaultClient } from "connectkit";
import { configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { goerli, polygonMumbai } from "@wagmi/core/chains";

const { chains, provider, webSocketProvider } = configureChains(
  [goerli, polygonMumbai],
  [publicProvider()]
);

export const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});
