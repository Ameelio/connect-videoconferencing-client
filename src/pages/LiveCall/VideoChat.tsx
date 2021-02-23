import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/redux";
import RoomClient from "src/pages/LiveCall/RoomClient";
import * as mediasoupClient from "mediasoup-client";
import { Spin } from "antd";
import "./Video.css";
import VideoOverlay from "./VideoOverlay";
import {
  CallAlert,
  CallMessage,
  CallParticipant,
  LiveCall,
} from "src/typings/Call";
import { AudioMutedOutlined } from "@ant-design/icons";
import { UI } from "src/utils";

interface Props {
  width: number | string;
  height: number | string;
  call: Omit<LiveCall, "messages">;
  socket: SocketIOClient.Socket;
  alerts: CallAlert[];
  muteCall: (id: number) => void;
  unmuteCall: (id: number) => void;
  isAudioOn: boolean;
  openChat: (id: number) => void;
  closeChat: (id: number) => void;
  chatCollapsed: boolean;
  lockCall: (id: number) => void;
  addMessage: (id: number, message: CallMessage) => void;
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
    lockCall,
    muteCall,
    unmuteCall,
    isAudioOn,
    openChat,
    closeChat,
    chatCollapsed,
    addMessage,
  }) => {
    const token = useSelector((state: RootState) => state.session.user.token);
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
      socket.emit("textMessage", {
        callId,
        contents: alert.body,
        recipients: participants,
      });

      UI.openNotificationWithIcon(
        "Alert succesfully issue.",
        "Both parties have been notified.",
        "success"
      );
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

    useEffect(() => {
      if (rc && isAuthed) {
        console.log("listening to text messsage for " + callId);
        rc.socket.on(
          "textMessage",
          ({
            from,
            contents,
          }: {
            from: CallParticipant;
            contents: string;
            meta: string;
          }) => {
            const message = {
              content: contents,
              from: from.type,
              timestamp: new Date().toLocaleDateString(),
            };
            addMessage(callId, message);
          }
        );
      }
    }, [addMessage, callId, isAuthed, rc]);

    const measuredRef = useCallback(
      (node) => {
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
                    const video = document.getElementById(
                      `${user.type}-${user.id}-video`
                    );
                    if (video) {
                      (video as HTMLVideoElement).srcObject = stream;
                    } else {
                      const newVideo = document.createElement("video");
                      newVideo.style.width = "50%";
                      newVideo.style.height = "100%";
                      newVideo.srcObject = stream;
                      newVideo.id = `${user.type}-video`;
                      newVideo.autoplay = true;
                      node.appendChild(newVideo);
                    }
                  } else if (kind === "audio") {
                    const audio = document.getElementById(
                      `${user.type}-${user.id}-audio`
                    );
                    if (audio) {
                      (audio as HTMLAudioElement).srcObject = stream;
                    } else {
                      const newAudio = document.createElement("audio");
                      newAudio.srcObject = stream;
                      newAudio.autoplay = true;
                      newAudio.id = `${user.type}-audio`;
                      newAudio.muted = !isAudioOn;
                      node.appendChild(newAudio);
                    }
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

    useEffect(() => {
      const inmate = document.getElementById(
        `inmate-${call.connection.inmateId}-audio`
      );
      const user = document.getElementById(
        `user-${call.connection.userId}-audio`
      );
      if (inmate) (inmate as HTMLAudioElement).muted = isAudioOn;
      if (user) (user as HTMLAudioElement).muted = isAudioOn;
    }, [isAudioOn, call.connection]);

    useEffect(() => {
      if (rc && call) {
        const interval = setInterval(() => {
          rc.socket.emit("heartbeat", { callId: call.id });
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [rc, call]);

    return (
      <div
        style={{
          width,
          height,
        }}
      >
        <div
          className="video-wrapper"
          style={{
            width,
            height,
          }}
          ref={measuredRef}
        >
          {!isAudioOn && (
            <AudioMutedOutlined
              style={{
                position: "absolute",
                bottom: 24,
                right: 24,
                fontSize: 36,
                color: "red",
              }}
            />
          )}
          <VideoOverlay
            alerts={alerts}
            terminateCall={() => {
              if (rc) {
                rc.terminate();
                UI.openNotificationWithIcon(
                  `Call #${call.id} terminated`,
                  "We notified both participants of the incident.",
                  "info"
                );
              }
            }}
            lockCall={() => lockCall(callId)}
            muteCall={() => muteCall(callId)}
            unmuteCall={() => unmuteCall(callId)}
            isAudioOn={isAudioOn}
            emitAlert={emitAlert}
            openChat={() => openChat(callId)}
            closeChat={() => closeChat(callId)}
            chatCollapsed={chatCollapsed}
          />
          {loading && <Loader />}
        </div>
      </div>
    );
  }
);

export default VideoChat;
