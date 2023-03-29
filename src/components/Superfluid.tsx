import { ConnectKitButton } from "connectkit";
import { useState } from "react";
import { ethers } from "ethers";
import { getProvider } from "@wagmi/core";
import { Framework } from "@superfluid-finance/sdk-core";
import { Button } from "@chakra-ui/react";

const Superfluid = () => {
  //where the Superfluid logic takes place
  async function createNewFlow(recipient: string, flowRate: string) {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const chainId = await (window as any).ethereum.request({ method: "eth_chainId" });
    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider,
    });

    const superSigner = sf.createSigner({ signer: signer });

    console.log(signer);
    console.log(await superSigner.getAddress());
    const daix = await sf.loadSuperToken("fDAIx");

    console.log(daix);

    try {
      const createFlowOperation = daix.createFlow({
        sender: await superSigner.getAddress(),
        receiver: recipient,
        flowRate: flowRate,
        // userData?: string
      });

      console.log(createFlowOperation);
      console.log("Creating your stream...");

      const result = await createFlowOperation.exec(superSigner);
      console.log(result);

      console.log(
        `Congrats - you've just created a money stream!
      `
      );
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  }

  return (
    <>
      <Button >Create Flow</Button>
    </>
  )
};

export default Superfluid;
