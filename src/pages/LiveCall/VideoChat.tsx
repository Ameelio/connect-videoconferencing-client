import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/redux";
import RoomClient from "src/pages/LiveCall/RoomClient";
import { Spin } from "antd";
import "./Video.css";
import VideoOverlay from "./VideoOverlay";
import { CallAlert, CallMessage, CallParticipant } from "src/typings/Call";
import { AudioMutedOutlined } from "@ant-design/icons";
import { openNotificationWithIcon } from "src/utils";
import { Inmate } from "src/typings/Inmate";
import { Contact } from "src/typings/Contact";

interface Props {
  isVisible: boolean;
  width: number | string;
  height: number | string;
  callId: number;
  inmates: Inmate[];
  contacts: Contact[];
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
    callId,
    isVisible,
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
    const authInfo = useSelector((state: RootState) => state.session.authInfo);

    const [loading, setLoading] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);
    const [rc, setRc] = useState<RoomClient>();

    const joinRoom = useCallback(async () => {
      const rc = new RoomClient(socket, callId);
      await rc.init();
      setRc(rc);
    }, [socket, callId]);

    const emitAlert = async (alert: CallAlert) => {
      if (!rc) return;
      rc.request("textMessage", {
        callId,
        contents: alert.body,
      }).then(
        () =>
          openNotificationWithIcon(
            "Alert succesfully issue.",
            "Both parties have been notified.",
            "success"
          ),
        (rejection: string) =>
          openNotificationWithIcon(
            "Alert could not be sent.",
            `Error message: ${rejection}`,
            "error"
          )
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
            socket.emit("authenticate", authInfo, resolve);
          });
          await joinRoom();
          console.log("authenticated");
          setIsAuthed(true);
        })();
      }
    }, [authInfo, socket, joinRoom, isAuthed]);

    useEffect(() => {
      // TODO: move all this socket stuff to a useRoomClient hook
      // that sets up all of this in one centralized place instead
      // of having it polluting the ffile
      // https://github.com/Ameelio/connect-doc-client/issues/62
      if (rc && isAuthed) {
        rc.socket.on(
          "textMessage",
          ({ from, contents }: { from: CallParticipant; contents: string }) => {
            const message = {
              contents,
              senderId: from.id,
              senderType: from.type,
              createdAt: new Date().toISOString(),
              callId,
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
                  // TODO for some reason room client is consuming streams from all calls (not just the one identified by callId)
                  // This is very likely to be an API bug that relays the stream to all active rooms regardless of whether or not it's the room client w/ that given person
                  // To replicate the bug you can just uncomment this scrappy check and join 2 calls at once
                  // if (
                  //   user.id !== participants.userId &&
                  //   user.id !== participants.inmateId
                  // )
                  //   return;

                  // TODO there's a weird in which we receive the streams and instantiate the calls, but only the first call stream has actual footaage
                  // From what I can tell everything is normal client side, which makes me think something is wrong with the API (I am seeing a lot of errors on my Node terminal)

                  //  TODO move this logic to refs
                  if (kind === "video") {
                    // TODO make sure jesse is passing the right user.type
                    const id = `${user.type}-${callId}-video`;
                    const video = document.getElementById(
                      id
                    ) as HTMLVideoElement;
                    if (video) {
                      video.srcObject = stream;
                    } else {
                      const newVideo = document.createElement("video");
                      newVideo.style.width = "50%";
                      newVideo.style.height = "100%";
                      newVideo.srcObject = stream;
                      newVideo.id = id;
                      newVideo.autoplay = true;
                      node.appendChild(newVideo);
                    }
                  } else if (kind === "audio") {
                    const id = `${user.type}-${callId}-audio`;
                    const audio = document.getElementById(
                      id
                    ) as HTMLAudioElement;
                    if (audio) {
                      audio.srcObject = stream;
                    } else {
                      const newAudio = document.createElement("audio");
                      newAudio.srcObject = stream;
                      newAudio.autoplay = true;
                      newAudio.id = id;
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
      [rc, isAuthed, isAudioOn, callId]
    );

    useEffect(() => {
      const inmate = document.getElementById(`inmate-${callId}-audio`);
      const user = document.getElementById(`user-${callId}-audio`);
      if (inmate) (inmate as HTMLAudioElement).muted = isAudioOn;
      if (user) (user as HTMLAudioElement).muted = isAudioOn;
    }, [isAudioOn, callId]);

    useEffect(() => {
      if (rc) {
        const interval = setInterval(() => {
          rc.socket.emit("heartbeat", { callId });
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [rc, callId]);

    return (
      <div
        className="video-wrapper"
        id={`call-${callId}`}
        style={{
          width,
          height,
          visibility: isVisible ? "visible" : "hidden",
          display: isVisible ? "flex" : "none",
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
              openNotificationWithIcon(
                `Call #${callId} terminated`,
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
    );
  }
);

export default VideoChat;
