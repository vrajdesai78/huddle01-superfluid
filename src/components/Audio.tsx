import React, { useEffect, useRef } from "react";

import { useHuddle01Web } from "@huddle01/react/hooks";

const Audio = ({
  peerId,
  track,
}: {
  peerId: string;
  track: MediaStreamTrack;
}) => {
  const { state } = useHuddle01Web();

  const getStream = (_track: MediaStreamTrack) => {
    const stream = new MediaStream();
    stream.addTrack(_track);
    return stream;
  };

  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    console.log({ consumers: state.context.consumers });
    const audioObj = audioRef.current;

    if (audioObj) {
      audioObj.srcObject = getStream(track);
      audioObj.onloadedmetadata = async () => {
        console.warn("audioCard() | Metadata loaded...");
        try {
          await audioObj.play();
        } catch (error) {
          console.error(error);
        }
      };
      audioObj.onerror = () => {
        console.error("audioCard() | Error is hapenning...");
      };
    }
  }, [state.context.consumers]);

  console.log({ consumers: state.context });

  return <audio ref={audioRef} autoPlay></audio>;
};

export default Audio;
