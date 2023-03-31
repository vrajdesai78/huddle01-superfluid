import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { useHuddle01Web } from "@huddle01/react/hooks";

export const createNewFlow = async (recipient: string, flowRate: string) => {
      
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();

  const chainId = await (window as any).ethereum.request({
    method: "eth_chainId",
  });
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
    });

    console.log(createFlowOperation);
    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(superSigner);

    if (result) {
      console.log("Stream created!");
      return true
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return false
  }
};

export const deleteExistingFlow = async (recipient: string) => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  await provider.send("eth_requestAccounts", []);


  const signer = provider.getSigner();

  const chainId = await (window as any).ethereum.request({
    method: "eth_chainId",
  });
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
    const deleteFlowOperation = daix.deleteFlow({
      sender: await signer.getAddress(),
      receiver: recipient,
    });

    console.log(deleteFlowOperation);
    console.log("Deleting your stream...");

    const result = await deleteFlowOperation.exec(superSigner);
    if (result) {
      return true;
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    console.error(error);
    return false;
  }
};
