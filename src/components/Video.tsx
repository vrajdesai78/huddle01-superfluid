import React, { useEffect, useRef } from "react";

import { useMeetingMachine } from "@huddle01/react/hooks";
import { Center } from "@chakra-ui/react";

const Video = ({
  peerId,
  track,
}: {
  peerId: string;
  track: MediaStreamTrack;
}) => {
  const { send, state } = useMeetingMachine();

  const getStream = (_track: MediaStreamTrack) => {
    const stream = new MediaStream();
    stream.addTrack(_track);
    return stream;
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    console.log({ consumers: state.context.consumers });
    const videoObj = videoRef.current;

    if (videoObj) {
      videoObj.srcObject = getStream(track);
      videoObj.onloadedmetadata = async () => {
        console.warn("videoCard() | Metadata loaded...");
        try {
          await videoObj.play();
        } catch (error) {
          console.error(error);
        }
      };
      videoObj.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [state.context.consumers]);

  return (
    <Center>
      <video ref={videoRef} width='100%' autoPlay></video>
    </Center>
  );
};

export default Video;
