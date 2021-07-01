import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/redux";
import RoomClient from "src/pages/LiveCall/RoomClient";
import { Spin, Typography } from "antd";
import "./Video.css";
import VideoOverlay from "./VideoOverlay";
import {
  CallAlert,
  CallMessage,
  CallParticipant,
  CallStatus,
  InCallStatus,
} from "src/typings/Call";
import { AudioMutedOutlined, VideoCameraOutlined } from "@ant-design/icons";
import {
  getParticipantStreamId,
  getStreamParticipantType,
  openNotificationWithIcon,
} from "src/utils";
import Video from "src/components/LiveCall/Video";
import Audio from "src/components/LiveCall/Audio";

interface Props {
  isVisible: boolean;
  width: number | string;
  height: number | string;
  callId: string;
  participantNames: { inmates: string; contacts: string };
  socket: SocketIOClient.Socket;
  alerts: CallAlert[];
  muteCall: (id: string) => void;
  unmuteCall: (id: string) => void;
  isAudioOn: boolean;
  openChat: (id: string) => void;
  closeChat: (id: string) => void;
  chatCollapsed: boolean;
  lockCall: (id: string) => void;
  addMessage: (id: string, message: CallMessage) => void;
  updateCallStatus: (id: string, status: CallStatus) => void;
}

declare global {
  interface Window {
    Debug: any;
  }
}

function Loader(): ReactElement {
  return (
    <div className="video-loading-spinner">
      <Spin tip="Waiting for participants to join..." />
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
    updateCallStatus,
    participantNames,
  }) => {
    const authInfo = useSelector((state: RootState) => state.session.authInfo);

    const [loading, setLoading] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);
    const [rc, setRc] = useState<RoomClient>();
    const [status, setStatus] = useState<InCallStatus>();
    const [inmateAudioPaused, setInmateAudioPaused] = useState(false);
    const [inmateVideoPaused, setInmateVideoPaused] = useState(false);
    // If we allow multiple contacts to join from different clients, we'll have to change this
    const [contactAudioPaused, setContactAudioPaused] = useState(false);
    const [contactVideoPaused, setContactVideoPaused] = useState(false);
    const [remoteVideos, setRemoteVideos] = useState<
      Record<string, MediaStream>
    >({});
    const [remoteAudios, setRemoteAudios] = useState<
      Record<string, MediaStream>
    >({});

    const joinRoom = useCallback(async () => {
      const rc = new RoomClient(socket, callId);
      await rc.init();
      setRc(rc);
    }, [socket, callId]);

    useEffect(() => {
      return () => {
        console.log("[VideoChat] Destroying room client");
        rc?.destroy();
      };
    }, [rc]);

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
            console.log("[VideoChat] Connected");
          }
          await new Promise((resolve) => {
            socket.emit("authenticate", authInfo, resolve);
          });
          await joinRoom();
          console.log("[VideoChat] Authenticated");
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
        console.log("[VideoChat] listening for text messages");
        rc.socket.on(
          "textMessage",
          ({ from, contents }: { from: CallParticipant; contents: string }) => {
            console.log(
              `[VideoChat] Received text message from ${from.type} for ${callId}`
            );
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

    useEffect(() => {
      // TODO: move all this socket stuff to a useRoomClient hook
      // that sets up all of this in one centralized place instead
      // of having it polluting the ffile
      // https://github.com/Ameelio/connect-doc-client/issues/62
      if (rc && isAuthed) {
        console.log("[VideoChat] listening for call status updates");
        rc.socket.on("callStatus", async (status: InCallStatus) => {
          console.log("[VideoChat] Received status update", status);
          setStatus(status);
        });

        rc.socket.on(
          "participantDisconnect",
          async (participant: CallParticipant) => {
            setRemoteVideos((remotes) => {
              const {
                [getParticipantStreamId(participant)]: _,
                ...otherRemotes
              } = remotes;
              return otherRemotes;
            });
            setRemoteAudios((remotes) => {
              const {
                [getParticipantStreamId(participant)]: _,
                ...otherRemotes
              } = remotes;
              return otherRemotes;
            });
          }
        );
      }
    }, [isAuthed, rc]);

    useEffect(() => {
      if (!rc) return;
      rc.socket.on(
        "producerUpdate",
        async ({
          from,
          paused,
          type,
        }: {
          from: CallParticipant;
          producerId: string;
          paused: boolean;
          type: "audio" | "video";
        }) => {
          console.log(`[Videochat] producer ${type} update from ${from.type} `);
          if (from.type === "user") {
            type === "audio"
              ? setContactAudioPaused(paused)
              : setContactVideoPaused(paused);
          } else if (from.type === "inmate") {
            type === "audio"
              ? setInmateAudioPaused(paused)
              : setInmateVideoPaused(paused);
          }
        }
      );
    }, [rc]);

    useEffect(() => {
      if (!status || status === "missing_monitor") return;
      updateCallStatus(callId, status);
    }, [status, callId]);

    const measuredRef = useCallback(
      (node) => {
        if (node !== null && rc && isAuthed) {
          (async () => {
            rc.on(
              "consume",
              async (
                kind: string,
                stream: MediaStream,
                participant: CallParticipant
              ) => {
                console.log(
                  `[VideoChat] Received ${kind} consume from ${participant.type} ${participant.id}`
                );
                if (node) {
                  if (kind === "video") {
                    setRemoteVideos((remotes) => ({
                      ...remotes,
                      [getParticipantStreamId(participant)]: stream,
                    }));
                  } else if (kind === "audio") {
                    setRemoteAudios((remotes) => ({
                      ...remotes,
                      [getParticipantStreamId(participant)]: stream,
                    }));
                  }

                  setLoading(false);
                }
              }
            );
          })();
        }
      },
      [rc, isAuthed]
    );

    // useEffect(() => {
    //   const inmate = document.getElementById(`inmate-${callId}-audio`);
    //   const user = document.getElementById(`user-${callId}-audio`);
    //   if (inmate) (inmate as HTMLAudioElement).muted = isAudioOn;
    //   if (user) (user as HTMLAudioElement).muted = isAudioOn;
    // }, [isAudioOn, callId]);

    useEffect(() => {
      if (rc) {
        const interval = setInterval(() => {
          rc.socket.emit("heartbeat", { callId });
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [rc, callId]);

    const videoKeys = Object.keys(remoteVideos);
    const audioKeys = Object.keys(remoteAudios);

    return (
      <div
        className="bg-gray-900 rounded flex items-center"
        id={`call-${callId}`}
        style={{
          width,
          height,
          visibility: isVisible ? "visible" : "hidden",
          display: isVisible ? "flex" : "none",
        }}
        ref={measuredRef}
      >
        {videoKeys.map((key: string, index: number) => {
          const isInmate = getStreamParticipantType(key) === "inmate";

          const isAudioPaused = isInmate
            ? inmateAudioPaused
            : contactAudioPaused;

          const isVideoPaused = isInmate
            ? inmateVideoPaused
            : contactVideoPaused;

          const name = isInmate
            ? participantNames.inmates
            : participantNames.contacts;

          return (
            <div
              className="w-1/2 h-1/3 bg-gray-800 flex align-center"
              key={key}
            >
              <Video
                srcObject={remoteVideos[key]}
                className="w-full h-full"
                autoPlay={true}
              />
              {/* Blurb with metadata */}
              <div
                className={`absolute bottom-20 ${
                  index === 0 ? "left-4" : "right-4"
                } bg-black bg-opacity-50 py-1 px-2 rounded flex align-center`}
              >
                {isAudioPaused && (
                  <AudioMutedOutlined className="text-red-600 text-base" />
                )}
                {isVideoPaused && (
                  <VideoCameraOutlined className="text-red-600 text-base ml-1" />
                )}
                <Typography.Text className="text-white text-base ml-1">
                  {name}
                </Typography.Text>
              </div>
            </div>
          );
        })}
        {audioKeys.map((key: string) => (
          <Audio
            key={key}
            srcObject={remoteAudios[key]}
            autoPlay={true}
            muted={!isAudioOn}
          />
        ))}
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
              updateCallStatus(callId, "terminated");
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
