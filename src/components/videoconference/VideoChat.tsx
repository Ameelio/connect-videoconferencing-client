import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/redux";
import RoomClient from "src/components/videoconference/RoomClient";
import * as mediasoupClient from "mediasoup-client";

interface Props {
  callId: number;
  socket: SocketIOClient.Socket;
}

declare global {
  interface Window {
    Debug: any;
  }
}

const VideoChat: React.FC<Props> = React.memo(({ callId, socket }) => {
  console.log("Reinitializing videochat.");
  const ref = React.createRef<HTMLDivElement>();

  const token = useSelector(
    (state: RootState) => state.session.authInfo.apiToken
  );
  const id = useSelector((state: RootState) => state.session.user.id);

  // Asynchronously load the room
  (async () => {
    console.log("Connection state", socket.connected);

    if (!socket.connected) {
      console.log("Not connected, so waiting until connected.");
      window.Debug = socket;
      await new Promise((resolve) => socket.on("connect", resolve));
      console.log("OK");
    }

    await new Promise((resolve) => {
      console.log("OK, logging in as", id, token);
      // TODO fetch actual credentials from redux
      socket.emit(
        "authenticate",
        {
          type: "monitor",
          id,
          token,
        },
        resolve
      );
    });

    const rc = new RoomClient(mediasoupClient, socket, callId);
    await rc.init();

    // This will occur whenever we have JUST joined, or whenever
    // a NEW participant arrives.
    rc.on("consume", async (kind: string, stream: MediaStream) => {
      console.log("GOT CONSUME");

      while (!ref.current) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (ref.current) {
        if (kind === "video") {
          console.log("Got video.");
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
});

export default VideoChat;
