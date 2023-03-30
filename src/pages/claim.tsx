import { Button, Center } from "@chakra-ui/react";
import { ethers } from "ethers";
import { faucetABI, faucetMumbaiAddress } from "src/utils/config";

const claim = () => {
  async function getTokens() {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);

    const signer = provider.getSigner();

    const chainId = await (window as any).ethereum.request({ method: "eth_chainId" });

    console.log("chain id: ", chainId);
    let faucetContract;

    faucetContract = new ethers.Contract(
      faucetMumbaiAddress,
      faucetABI,
      provider
    );

    console.log(faucetContract);

    if (Number(chainId) === 80001) {
      try {
        faucetContract.connect(signer).tapFaucet();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Invalid network... choose mumbai please");
    }
  }
  return (
    <Center>
        <Button onClick={getTokens}>Click to get 100k fDAIx</Button>
    </Center>
  );
};

export default claim;