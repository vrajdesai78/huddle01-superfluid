import { IoSend } from "react-icons/io5";
import { IconType } from "react-icons";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { contractAddress } from "src/utils/constants";
import abi from "src/utils/abi.json";
import {
  subscribeUser,
  sendPushNotification,
} from "src/utils/pushNotification";
import {
  Box,
  Text,
  Button,
  HStack,
  Icon,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";

export const ServicesComponent = (
  service: string,
  rate: Number,
  icon: IconType,
  address: string,
  name: string
) => {
  const [showCalender, setShowCalender] = useState(false);
  const [dateTime, setDateTime] = useState("");

  const { address: senderAddress } = useAccount();

  const createRoom = (dateTime: string, name: string, service: string) => {
    const dt = new Date(dateTime).toISOString().replace("Z", ".0051Z");
    fetch("/api/createRoom", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        startTime: dt,
        hostWallets: [],
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        contract
          .setRoomRate(
            data.roomId,
            senderAddress,
            address,
            ethers.utils.parseEther(rate.toString())
          )
          .then(async (tx: string) => {
            if (tx) {
              await subscribeUser(senderAddress as string);
              await sendPushNotification(
                data.roomId,
                senderAddress as string,
                name,
                service,
                false
              );
              await sendPushNotification(
                data.roomId,
                address,
                name,
                service,
                true
              );
            }
          })
          .catch((error: string) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <HStack spacing={2}>
      <Box minW="xl">
        <Button
          minW={"50%"}
          flex={1}
          fontSize={"md"}
          rounded={"full"}
          onClick={() => {
            setShowCalender(!showCalender);
          }}
        >
          <Icon as={icon} />
          <Text fontSize={"md"} textAlign={"center"} px={3}>
            {`${service} ${rate} DAI/Sec`}
          </Text>
        </Button>
        {showCalender && (
          <>
            <Input
              placeholder="Select date and time"
              type="datetime-local"
              width={"51%"}
              flex={1}
              mt={5}
              onChange={(e) => {
                setDateTime(e.target.value);
              }}
            />
            <Button
              ml={3}
              onClick={async () => {
                createRoom(dateTime, name, service);
              }}
            >
              <Icon as={IoSend} />
            </Button>
          </>
        )}
      </Box>
    </HStack>
  );
};
