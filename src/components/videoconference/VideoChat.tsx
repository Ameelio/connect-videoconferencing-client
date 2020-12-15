import React from "react";
import RoomClient from "src/components/videoconference/RoomClient";
import mediasoupClient from "mediasoup-client";
import io from "socket.io-client";

interface Props {
  callId: number;
}

const VideoChat: React.FC<Props> = ({ callId }) => {
  const ref = React.createRef<HTMLDivElement>();

  const socket = io();

  // Asynchronously load the room
  (async () => {
    await new Promise((resolve) =>
      // TODO fetch actual credentials from redux
      socket.emit("authenticate", null, resolve)
    );

    const rc = new RoomClient(mediasoupClient, socket, callId);
    await rc.init();

    // This will occur whenever we have JUST joined, or whenever
    // a NEW participant arrives.
    rc.on("consume", (kind: string, stream: MediaStream) => {
      if (ref.current) {
        if (kind === "video") {
          const video = document.createElement("video");
          video.srcObject = stream;
          video.autoplay = true;
          ref.current.appendChild(video);
        }

        // TODO audio as well.
      }
    });
  })();

  return <div ref={ref}></div>;
};

export default VideoChat;
