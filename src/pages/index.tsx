import React, { useState, useEffect } from "react";
import {
  Heading,
  Avatar,
  Box,
  Text,
  Flex,
  VStack
} from "@chakra-ui/react";
import { AiOutlineCalendar } from "react-icons/ai";
import userData from "src/utils/userData.json";
import { ServicesComponent } from "@/components/ServicesComponent";

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
            {ServicesComponent(
              "Mentorship",
              mentorship,
              AiOutlineCalendar,
              walletAddress,
              name
            )}
            {ServicesComponent(
              "Resume Review",
              resumeReview,
              AiOutlineCalendar,
              walletAddress,
              name
            )}
            {ServicesComponent(
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
