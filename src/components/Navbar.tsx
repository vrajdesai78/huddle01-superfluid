import { Button, chakra, Flex, HStack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useConnect, useAccount } from "wagmi";
import Image from "next/image";
import { useRouter } from "next/router";

export const NavBar = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const [hydrated, setHydrated] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <React.Fragment>
      {" "}
      {hydrated && (
        <chakra.header
          bg={"transparent"}
          w="full"
          px={{ base: 4, sm: 6 }}
          py={4}
        >
          <Flex alignItems="center" justifyContent="space-between" mx="auto">
            {/* Align connect wallet button on right side */}
            <HStack alignItems="center">
              <HStack
                as="nav"
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                <a target="_blank" href="https://huddle01.com">
                <Image src="/logo.svg" alt="logo" width={100} height={100} />
                </a>
              </HStack>
            </HStack>
            {/* if isConnected is true show address or show Connect wallet button */}
            {isConnected ? (
              <Button
                bg={"brand.800"}
                color={"white"}
                _hover={{
                  bg: "brand.700",
                }}
              >
                {address}
              </Button>
            ) : (
              <Button
                bg={"brand.800"}
                color={"white"}
                _hover={{
                  bg: "brand.700",
                }}
                onClick={() => {
                  connect();
                }}
              >
                Connect Wallet
              </Button>
            )}
          </Flex>
        </chakra.header>
      )}
    </React.Fragment>
  );
};
