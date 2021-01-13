import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/redux";
import RoomClient from "src/pages/LiveVisitation/RoomClient";
import * as mediasoupClient from "mediasoup-client";
import io from "socket.io-client";
import { Menu, Spin, Dropdown, Button, Space } from "antd";
import {
  LockFilled,
  MessageFilled,
  MoreOutlined,
  SettingFilled,
} from "@ant-design/icons";
import "./Video.css";
import VideoOverlay from "./VideoOverlay";
import { CallAlert } from "src/typings/Call";
import { cloneObject } from "src/utils/utils";

interface Props {
  width: number | string;
  height: number | string;
  callId: number;
  socket: SocketIOClient.Socket;
  alerts: CallAlert[];
  terminateCall: (callId: number) => void;
  muteCall: (callId: number) => void;
  unmuteCall: (callId: number) => void;
  isAudioOn: boolean;
  lockCall: (callId: number) => void;
}

declare global {
  interface Window {
    Debug: any;
  }
}

function Loader(): ReactElement {
  return (
    <Space direction="vertical" className="video-loading-spinner">
      <Spin />
      <span className="video-loading-spinner-span ">Loading video call...</span>
    </Space>
  );
}
const VideoChat: React.FC<Props> = React.memo(
  ({
    width,
    height,
    callId,
    socket,
    alerts,
    terminateCall,
    lockCall,
    muteCall,
    unmuteCall,
    isAudioOn,
  }) => {
    const ref = React.createRef<HTMLDivElement>();

    const token = useSelector(
      (state: RootState) => state.session.authInfo.apiToken
    );
    const id = useSelector((state: RootState) => state.session.user.id);

    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState<HTMLVideoElement>();
    const [audio, setAudio] = useState();

    console.log(isAudioOn);
    const emitAlert = async (alert: CallAlert) => {
      const { participants } = await new Promise((resolve, reject) => {
        socket.emit("info", { callId }, resolve);
      });
      console.log(participants);
      socket.emit("textMessage", {
        callId,
        contents: alert.body,
        recipients: participants,
      });
    };

    // Asynchronously load the room
    useEffect(() => {
      setLoading(true);
      if (ref.current) {
        console.log("Reinitializing videochat." + callId);
        (async () => {
          console.log("Connection state", socket.connected);

          if (!socket.connected) {
            console.log("Not connected, so waiting until connected.");
            window.Debug = socket;
            await new Promise((resolve) => socket.on("connect", resolve));
            console.log("OK");
          }

          await new Promise((resolve) => {
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

          console.log(rc);

          // This will occur whenever we have JUST joined, or whenever
          // a NEW participant arrives.
          rc.on("consume", async (kind: string, stream: MediaStream) => {
            // console.log("GOT CONSUME");
            // console.log(stream);
            while (!ref.current) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }

            // if (ref.current) {
            switch (kind) {
              case "video":
                if (video) break;
                const newVideo = document.createElement("video");
                newVideo.srcObject = stream;
                newVideo.style.width = `100%`;
                newVideo.style.height = `100%`;
                newVideo.autoplay = true;
                ref.current.appendChild(newVideo);
                setVideo(newVideo);

                break;
              case "audio":
                if (!isAudioOn) break;
                if (audio) break;
                const newAudio = document.createElement("audio");
                newAudio.srcObject = stream;
                newAudio.autoplay = true;
                document.body.appendChild(newAudio);
                break;
            }
            setLoading(false);
          });
        })();
      }
    }, [
      callId,
      id,
      ref,
      token,
      socket,
      width,
      height,
      isAudioOn,
      audio,
      video,
    ]);

    return (
      <div
        className="video-wrapper"
        style={{
          width,
          height,
        }}
        ref={ref}
      >
        <VideoOverlay
          alerts={alerts}
          terminateCall={() => terminateCall(callId)}
          lockCall={() => lockCall(callId)}
          muteCall={() => muteCall(callId)}
          unmuteCall={() => unmuteCall(callId)}
          isAudioOn={isAudioOn}
          emitAlert={emitAlert}
        />
        {loading && <Loader />}
      </div>
    );
  }
);

export default VideoChat;
