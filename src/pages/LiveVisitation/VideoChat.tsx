import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { couldStartTrivia } from "typescript";

interface Props {
  width: number | string;
  height: number | string;
  call: LiveVisitation;
  socket: SocketIOClient.Socket;
  alerts: CallAlert[];
  terminateCall: (id: number) => void;
  muteCall: (id: number) => void;
  unmuteCall: (id: number) => void;
  isAudioOn: boolean;
  lockCall: (id: number) => void;
}

declare global {
  interface Window {
    Debug: any;
  }
}

function Loader(): ReactElement {
  return (
    <div className="video-loading-spinner">
      <Spin tip="Loading video call..." />
    </div>
  );
}

const VideoChat: React.FC<Props> = React.memo(
  ({
    call,
    width,
    height,
    socket,
    alerts,
    terminateCall,
    lockCall,
    muteCall,
    unmuteCall,
    isAudioOn,
  }) => {
    const token = useSelector(
      (state: RootState) => state.session.authInfo.apiToken
    );
    const id = useSelector((state: RootState) => state.session.user.id);

    const [loading, setLoading] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);
    const [rc, setRc] = useState<RoomClient>();

    const callId = call.id;

    const joinRoom = useCallback(async () => {
      const rc = new RoomClient(mediasoupClient, socket, callId);
      await rc.init();
      setRc(rc);
    }, [socket, callId]);

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
      if (!isAuthed) {
        (async () => {
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
          await joinRoom();
          console.log("authenticated");
          setIsAuthed(true);
        })();
      }
    }, [call.id, id, token, socket, joinRoom, isAuthed]);

    const measuredRef = useCallback(
      (node) => {
        console.log(isAudioOn);
        if (node !== null && rc && isAuthed) {
          (async () => {
            rc.on(
              "consume",
              async (
                kind: string,
                stream: MediaStream,
                user: { type: string; id: number }
              ) => {
                if (node) {
                  if (kind === "video") {
                    const video = document.createElement("video");
                    video.style.width = "50%";
                    video.style.height = "100%";
                    video.srcObject = stream;
                    video.autoplay = true;
                    node.appendChild(video);
                  } else if (kind === "audio") {
                    const audio = document.createElement("audio");
                    audio.srcObject = stream;
                    audio.autoplay = true;
                    node.appendChild(audio);
                  }

                  setLoading(false);
                }
              }
            );
          })();
        }
      },
      [rc, isAuthed, isAudioOn]
    );

    useEffect(() => {}, [isAudioOn]);

    return (
      <div
        className="video-wrapper"
        style={{
          width,
          height,
        }}
        ref={measuredRef}
      >
        {/* <video id="visitor-video"/>
        <video id="inmate-video"/>
        <audio id="visitor-audio"/>
        <audio id="inmate-audio"/> */}
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
