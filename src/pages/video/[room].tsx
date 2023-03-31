import { SimpleGrid, Center, Box, Button, Image, Icon } from "@chakra-ui/react";
import { useEventListener } from "@huddle01/react";
import Video from "@/components/Video";
import Audio from "@/components/Audio";
import React, { useEffect, useRef, useState } from "react";
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
import { createNewFlow, deleteExistingFlow } from "src/utils/superfluid";
import abi from "src/utils/abi.json";
import { useHuddle01Web } from "@huddle01/react/hooks";

const index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const roomId = useRouter().query.room as string;
  const [senderAddress, setSenderAddress] = useState<string>("");
  const [hostAddress, setHostAddress] = useState<string>("");
  const [rate, setRate] = useState<string>("");

  const { state, send } = useHuddle01Web();

  const { address } = useAccount();

  const { data } = useContractRead({
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
          onClick={async () => {
            if (state.matches("JoinedLobby")) {
              if (address == senderAddress) {
                const isCompleted = await createNewFlow(hostAddress, rate);
                if (isCompleted) {
                  send("JOIN_ROOM");
                }
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
          onClick={async () => {
            if (state.matches("JoinedRoom")) {
              if (address == senderAddress) {
                const isDeleted = await deleteExistingFlow(hostAddress);
                if (isDeleted) {
                  send("LEAVE_ROOM");
                  location.reload();
                }
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
