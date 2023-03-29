import { createClient } from "wagmi";
import { getDefaultClient } from "connectkit";
import { goerli, polygonMumbai } from "@wagmi/core/chains";

export const client = createClient(
  getDefaultClient({
    appName: "WAGMI",
    chains: [goerli, polygonMumbai],
  })
);
