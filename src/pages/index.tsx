import { SimpleGrid, Box, Button } from "@chakra-ui/react";
import { useEventListener } from "@huddle01/react";
import { useHuddle01Web } from "@huddle01/react/hooks";
import SendButton from "../components/SendButton";
import Video from "../components/Video";
import Audio from "../components/Audio";
import React, { useEffect, useRef } from "react";

const index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { state, send } = useHuddle01Web();

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
        <Box>
          <video ref={videoRef} autoPlay muted></video>
          <audio ref={audioRef} autoPlay></audio>
        </Box>
        {Object.keys(state.context.consumers)
          .filter(
            (consumerId) =>
              state.context.consumers[consumerId] &&
              state.context.consumers[consumerId].track?.kind === "video"
          )
          .map((consumerId) => (
            <Box>
              <Video
                key={consumerId}
                peerId={state.context.consumers[consumerId].peerId}
                track={state.context.consumers[consumerId].track}
              />
            </Box>
          ))}
        {Object.keys(state.context.consumers)
          .filter(
            (consumerId) =>
              state.context.consumers[consumerId] &&
              state.context.consumers[consumerId].track?.kind === "audio"
          )
          .map((consumerId) => (
            <Box>
              <Audio
                key={consumerId}
                peerId={state.context.consumers[consumerId].peerId}
                track={state.context.consumers[consumerId].track}
              />
            </Box>
          ))}
      </SimpleGrid>
      <Box>
        <Button
          margin={2}
          onClick={() => {
            state.matches("JoinedLobby")
              ? send("JOIN_ROOM")
              : send({ type: "JOIN_LOBBY", roomId: "udn-payp-sry" });
          }}
          hidden={state.matches("JoinedRoom")}
        >
          {state.matches("JoinedLobby") ? "Join Room" : "Join Lobby"}
        </Button>

        <Button
          margin={2}
          onClick={() => {
            state.matches("JoinedLobby")
              ? send("LEAVE_LOBBY")
              : send("LEAVE_ROOM");
          }}
          hidden={!state.matches("JoinedLobby") && !state.matches("JoinedRoom")}
        >
          {state.matches("JoinedLobby") ? "Leave Lobby" : "Leave Room"}
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
          {state.matches("JoinedLobby.Cam.On") ? "Disable Cam" : "Enable Cam"}
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
          {state.matches("JoinedLobby.Mic.Unmuted")
            ? "Disable Mic"
            : "Enable Mic"}
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
          {state.matches("JoinedRoom.Cam.ProducingCam")
            ? "Disable Cam"
            : "Enable Cam"}
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
          {state.matches("JoinedRoom.Mic.ProducingMic")
            ? "Disable Mic"
            : "Enable Mic"}
        </Button>
      </Box>
    </>
  );
};

export default index;
