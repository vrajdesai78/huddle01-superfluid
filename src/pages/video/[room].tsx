import { SimpleGrid, Center, Box, Button, Image, Icon } from "@chakra-ui/react";
import { useEventListener } from "@huddle01/react";
import { useHuddle01Web } from "@huddle01/react/hooks";
import Video from "@/components/Video";
import Audio from "@/components/Audio";
import React, { useEffect, useRef, useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import {
  BiMicrophoneOff,
  BiMicrophone,
  BiCameraOff,
  BiCamera,
  BiPhoneOff,
} from "react-icons/bi";
import { useAccount, useContractRead } from "wagmi";
import { useRouter } from "next/router";
import { contractAddress } from "src/utils/constants";
import abi from "src/utils/abi.json";

const index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const roomId = useRouter().query.room as string;
  const [senderAddress, setSenderAddress] = useState<string>("");
  const [hostAddress, setHostAddress] = useState<string>("");
  const [rate, setRate] = useState<string>("");

  const { state, send } = useHuddle01Web();

  const { address } = useAccount();

  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "getRoomRate",
    args: [roomId],
  });

  useEffect(() => {
    if (data) {
      setSenderAddress((data as any)[0]);
      setHostAddress((data as any)[1]);
      setRate((data as any)[2]);
    }
  }, [data]);

  useEventListener(state, "JoinedLobby.Cam.On", () => {
    if (state.context.camStream && videoRef.current)
      videoRef.current.srcObject = state.context.camStream as MediaStream;
  });

  useEventListener(state, "JoinedLobby.Mic.Muted", () => {
    if (state.context.micStream && audioRef.current)
      audioRef.current.srcObject = state.context.micStream as MediaStream;
  });

  useEffect(() => {
    if (state.matches("Idle")) {
      send("INIT");
    }
  }, []);

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
      });

      console.log(createFlowOperation);
      console.log("Creating your stream...");

      const result = await createFlowOperation.exec(superSigner);

      if (result) {
        console.log("Stream created!");
        send("JOIN_ROOM");
      }

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

  async function deleteExistingFlow(recipient: string) {
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
      const deleteFlowOperation = daix.deleteFlow({
        sender: await signer.getAddress(),
        receiver: recipient,
        // userData?: string
      });

      console.log(deleteFlowOperation);
      console.log("Deleting your stream...");

      const result = await deleteFlowOperation.exec(superSigner);
      if (result) {
        send("LEAVE_ROOM");
        location.reload();
      }

      console.log(
        `Congrats - you've just updated a money stream!
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
      <SimpleGrid columns={2} spacing={10}>
        <Center>
          <video ref={videoRef} width={"100%"} autoPlay muted></video>
          <audio ref={audioRef} autoPlay></audio>
        </Center>
        {Object.keys(state.context.consumers)
          .filter(
            (consumerId) =>
              state.context.consumers[consumerId] &&
              state.context.consumers[consumerId].track?.kind === "video"
          )
          .map(
            (consumerId, index) =>
              index != 0 && (
                <Video
                  key={consumerId}
                  peerId={state.context.consumers[consumerId].peerId}
                  track={state.context.consumers[consumerId].track}
                />
              )
          )}
        {Object.keys(state.context.consumers)
          .filter(
            (consumerId) =>
              state.context.consumers[consumerId] &&
              state.context.consumers[consumerId].track?.kind === "audio"
          )
          .map((consumerId) => (
            <Audio
              key={consumerId}
              peerId={state.context.consumers[consumerId].peerId}
              track={state.context.consumers[consumerId].track}
            />
          ))}
      </SimpleGrid>
      <Center mt={5}>
        <Button
          margin={2}
          onClick={() => {
            if (state.matches("JoinedLobby")) {
              if (address == senderAddress) {
                createNewFlow(hostAddress, rate);
              } else if (address == hostAddress) {
                send("JOIN_ROOM");
              } else {
                alert("Sorry you are not allowed to join this room!");
              }
            } else {
              send({ type: "JOIN_LOBBY", roomId: roomId });
            }
          }}
          hidden={state.matches("JoinedRoom")}
        >
          {state.matches("JoinedLobby") ? "Join Room" : "Join Lobby"}
        </Button>

        <Button
          margin={2}
          onClick={() => {
            state.matches("JoinedLobby.Cam.On")
              ? send("DISABLE_CAM")
              : send("ENABLE_CAM");
          }}
          hidden={!state.matches("JoinedLobby")}
        >
          {state.matches("JoinedLobby.Cam.On") ? (
            <Icon as={BiCameraOff} />
          ) : (
            <Icon as={BiCamera} />
          )}
        </Button>

        <Button
          margin={2}
          onClick={() => {
            state.matches("JoinedLobby.Mic.Unmuted")
              ? send("DISABLE_MIC")
              : send("ENABLE_MIC");
          }}
          hidden={!state.matches("JoinedLobby")}
        >
          {state.matches("JoinedLobby.Mic.Unmuted") ? (
            <Icon as={BiMicrophoneOff} />
          ) : (
            <Icon as={BiMicrophone} />
          )}
        </Button>

        <Button
          margin={2}
          onClick={() => {
            if (state.matches("JoinedRoom")) {
              if (address == senderAddress) {
                deleteExistingFlow(hostAddress);
              } else if (address == hostAddress) {
                send("LEAVE_ROOM");
              } else {
                alert("Sorry you are not allowed to join this room!");
              }
            } else {
              send("LEAVE_LOBBY");
            }
          }}
          hidden={!state.matches("JoinedLobby") && !state.matches("JoinedRoom")}
        >
          <Icon as={BiPhoneOff} />
        </Button>

        <Button
          margin={2}
          onClick={() => {
            state.matches("JoinedRoom.Cam.ProducingCam")
              ? send("STOP_PRODUCING_CAM")
              : send("PRODUCE_CAM");
          }}
          hidden={!state.matches("JoinedRoom")}
        >
          {state.matches("JoinedRoom.Cam.ProducingCam") ? (
            <Icon as={BiCameraOff} />
          ) : (
            <Icon as={BiCamera} />
          )}
        </Button>

        <Button
          margin={2}
          onClick={() => {
            state.matches("JoinedRoom.Mic.ProducingMic")
              ? send("STOP_PRODUCING_MIC")
              : send("PRODUCE_MIC");
          }}
          hidden={!state.matches("JoinedRoom")}
        >
          {state.matches("JoinedRoom.Mic.ProducingMic") ? (
            <Icon as={BiMicrophoneOff} />
          ) : (
            <Icon as={BiMicrophone} />
          )}
        </Button>
      </Center>
    </>
  );
};

export default index;
