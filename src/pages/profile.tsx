import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
  Heading,
  Avatar,
  Box,
  Text,
  Button,
  Link,
  Flex,
  VStack,
  HStack,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineCalendar } from "react-icons/ai";
import { IconType } from "react-icons";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

export const socialLinkComponent = (
  service: string,
  rate: Number,
  icon: IconType
) => {
  async function createNewFlow(recipient: string, flowRate: string) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
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
    <HStack spacing={2}>
      <Box minW="xl">
        <Button minW={"50%"} flex={1} fontSize={"md"} rounded={"full"}>
          <Icon as={icon} />
          <Text fontSize={"md"} textAlign={"center"} px={3}>
            {`${service} ${rate} DAI/Sec`}
          </Text>
        </Button>
      </Box>
    </HStack>
  );
};

const User = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [icon, setIcon] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [mentorship, setMentorship] = useState(Number(0));
  const [resumeReview, setResumeReview] = useState(Number(0));
  const [projectGuidance, setProjectGuidance] = useState(Number(0));

  const toast = useToast();

  useEffect(() => {
    try {
      setUserName("vrajdesai78");
      setIcon("https://i.imgur.com/8K8V5yP.png");
      setName("Vraj Desai");
      setBio("GitHub Campus Expert | Buildoor");
      setMentorship(0.002);
      setResumeReview(0.003);
      setProjectGuidance(0.0025);
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

          {/* {Show social media links of user} */}

          <VStack mt={8} direction={"row"} spacing={4}>
            {socialLinkComponent("Mentorship", mentorship, AiOutlineCalendar)}
            {socialLinkComponent(
              "Resume Review",
              resumeReview,
              AiOutlineCalendar
            )}
            {socialLinkComponent(
              "Project Guidance",
              projectGuidance,
              AiOutlineCalendar
            )}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default User;
