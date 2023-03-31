import React, { useState, useEffect } from "react";
import {
  Heading,
  Avatar,
  Box,
  Text,
  Button,
  Flex,
  VStack,
  HStack,
  Icon,
  Input,
} from "@chakra-ui/react";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { IconType } from "react-icons";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { contractAddress } from "src/utils/constants";
import abi from "src/utils/abi.json";
import userData from "src/utils/userData.json";
import {
  subscribeUser,
  sendPushNotification,
} from "src/utils/pushNotification";

export const socialLinkComponent = (
  service: string,
  rate: Number,
  icon: IconType,
  address: string,
  name: string
) => {
  const [showCalender, setShowCalender] = useState(false);
  const [dateTime, setDateTime] = useState("");

  const { address: senderAddress } = useAccount();

  const PK = process.env.NEXT_PUBLIC_PRIVATE_KEY as string;
  const _signer = new ethers.Wallet(PK);

  const createRoom = (dateTime: string, name: string, service: string) => {
    const dt = new Date(dateTime).toISOString().replace("Z", ".0051Z");
    fetch("/api/createRoom", {
      method: "POST",
      body: JSON.stringify({
        name: "Vraj Desai",
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

const User = () => {
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [icon, setIcon] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [mentorship, setMentorship] = useState(Number(0));
  const [resumeReview, setResumeReview] = useState(Number(0));
  const [projectGuidance, setProjectGuidance] = useState(Number(0));
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    try {
      setUserName(userData.userName);
      setIcon(userData.profileUrl);
      setName(userData.name);
      setBio(userData.bio);
      setMentorship(userData.mentorshipRate);
      setResumeReview(userData.resumeReviewRate);
      setProjectGuidance(userData.projectGuidanceRate);
      setWalletAddress(userData.walletAddress);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <Box
      style={{
        margin: 0,
        padding: 0,
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <style jsx global>{`
        html,
        body {
          height: 100%;
          width: 100%;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }
      `}</style>

      <Flex
        py={6}
        minW={"100vw"}
        maxH={"100vh"}
        p={30}
        w="full"
        alignItems="center"
        justifyContent="center"
        zIndex={1}
        position="absolute"
      >
        <Box
          maxW={"sm"}
          w={"full"}
          border="1px"
          boxShadow={"2xl"}
          rounded={"lg"}
          p={6}
          textAlign={"center"}
        >
          <Avatar
            border={"2px"}
            size={"2xl"}
            src={icon}
            mb={4}
            pos={"relative"}
          />
          <Heading fontSize={"2xl"} fontFamily={"body"}>
            {name}
          </Heading>
          <Text fontWeight={600} mb={4}>
            @{userName}
          </Text>
          <Text textAlign={"center"} fontWeight="bold" px={3}>
            {bio}
          </Text>

          <VStack mt={8} direction={"row"} spacing={4}>
            {socialLinkComponent(
              "Mentorship",
              mentorship,
              AiOutlineCalendar,
              walletAddress,
              name
            )}
            {socialLinkComponent(
              "Resume Review",
              resumeReview,
              AiOutlineCalendar,
              walletAddress,
              name
            )}
            {socialLinkComponent(
              "Project Guidance",
              projectGuidance,
              AiOutlineCalendar,
              walletAddress,
              name
            )}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default User;
