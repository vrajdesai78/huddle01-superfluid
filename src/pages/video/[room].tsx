import { SimpleGrid, Center, Box, Button, Image, Icon } from "@chakra-ui/react";
import { useEventListener, useHuddle01 } from "@huddle01/react";
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
import {
  useAudio,
  useVideo,
  useLobby,
  useMeetingMachine,
  usePeers,
  useRoom,
} from "@huddle01/react/hooks";

const index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const roomId = useRouter().query.room as string;
  const [senderAddress, setSenderAddress] = useState<string>("");
  const [hostAddress, setHostAddress] = useState<string>("");
  const [rate, setRate] = useState<string>("");

  const { state, send } = useMeetingMachine();

  const { address } = useAccount();

  const { initialize, isInitialized } = useHuddle01();
  const { joinLobby, isLobbyJoined, leaveLobby } = useLobby();
  const {
    fetchAudioStream,
    produceAudio,
    isProducing: isAudioProducing,
    stopAudioStream,
    stopProducingAudio,
    stream: micStream,
  } = useAudio();
  const {
    fetchVideoStream,
    produceVideo,
    isProducing: isVideoProducing,
    stopVideoStream,
    stopProducingVideo,
    stream: camStream,
  } = useVideo();
  const { joinRoom, leaveRoom, isRoomJoined } = useRoom();

  const { peers } = usePeers();

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

  useEventListener("lobby:cam-on", () => {
    if (state.context.camStream && videoRef.current)
      videoRef.current.srcObject = state.context.camStream as MediaStream;
  });

  useEventListener("lobby:mic-on", () => {
    if (state.context.micStream && audioRef.current)
      audioRef.current.srcObject = state.context.micStream as MediaStream;
  });

  useEffect(() => {
    if (state.matches("Idle")) {
      initialize("KL1r3E1yHfcrRbXsT4mcE-3mK60Yc3YR");
    }
  }, []);

  return (
    <>
      <SimpleGrid columns={2} spacing={10}>
        <Center>
          <video ref={videoRef} width={"100%"} autoPlay muted></video>
          <audio ref={audioRef} autoPlay></audio>
        </Center>
        {Object.values(peers)
          .filter((peer) => peer.cam)
          .map((peer) => (
            <Video key={peer.peerId} peerId={peer.peerId} track={peer.cam} />
          ))}
        {Object.values(peers)
          .filter(
            (peer) => peer.mic
          )
          .map((peer) => (
            <Audio
              key={peer.peerId}
              peerId={peer.peerId}
              track={peer.mic}
            />
          ))}
      </SimpleGrid>
      <Center mt={5}>
        <Button
          margin={2}
          onClick={async () => {
            if (isLobbyJoined) {
              if (address == senderAddress) {
                const isCompleted = await createNewFlow(hostAddress, rate);
                if (isCompleted) {
                  joinRoom();
                }
              } else if (address == hostAddress) {
                joinRoom();
              } else {
                alert("Sorry you are not allowed to join this room!");
              }
            } else {
              joinLobby(roomId);
            }
          }}
          hidden={isRoomJoined}
        >
          {isLobbyJoined ? "Join Room" : "Join Lobby"}
        </Button>

        <Button
          margin={2}
          onClick={() => {
            state.matches("Initialized.JoinedLobby.Cam.On")
              ? stopVideoStream()
              : fetchVideoStream()
          }}
          hidden={!isLobbyJoined}
        >
          {state.matches("Initialized.JoinedLobby.Cam.On") ? (
            <Icon as={BiCameraOff} />
          ) : (
            <Icon as={BiCamera} />
          )}
        </Button>

        <Button
          margin={2}
          onClick={() => {
            state.matches("Initialized.JoinedLobby.Mic.Unmuted")
              ? stopAudioStream()
              : fetchAudioStream()
          }}
          hidden={!isLobbyJoined}
        >
          {state.matches("Initialized.JoinedLobby.Mic.Unmuted") ? (
            <Icon as={BiMicrophoneOff} />
          ) : (
            <Icon as={BiMicrophone} />
          )}
        </Button>

        <Button
          margin={2}
          onClick={async () => {
            if (isRoomJoined) {
              if (address == senderAddress) {
                const isDeleted = await deleteExistingFlow(hostAddress);
                if (isDeleted) {
                  leaveRoom();
                  location.reload();
                }
              } else if (address == hostAddress) {
                leaveRoom();
              } else {
                alert("Sorry you are not allowed to join this room!");
              }
            } else {
              leaveLobby();
            }
          }}
          hidden={!isLobbyJoined && !isRoomJoined}
        >
          <Icon as={BiPhoneOff} />
        </Button>

        <Button
          margin={2}
          onClick={() => {
            state.matches("Initialized.JoinedRoom.Cam.ProducingCam")
              ? stopProducingVideo()
              : produceVideo(camStream)
          }}
          hidden={!isRoomJoined}
        >
          {isVideoProducing ? (
            <Icon as={BiCameraOff} />
          ) : (
            <Icon as={BiCamera} />
          )}
        </Button>

        <Button
          margin={2}
          onClick={() => {
            isAudioProducing ? stopProducingAudio() : produceAudio(micStream);
          }}
          hidden={!isRoomJoined}
        >
          {isAudioProducing ? (
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
