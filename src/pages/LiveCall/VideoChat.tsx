import React, { ReactElement, useCallback, useEffect, useState } from "react";
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
  ISOString,
} from "src/typings/Call";
import { AudioMutedOutlined, VideoCameraOutlined } from "@ant-design/icons";
import {
  getParticipantStreamId,
  getStreamParticipantType,
  openNotificationWithIcon,
} from "src/utils";
import Video from "src/components/LiveCall/Video";
import Audio from "src/components/LiveCall/Audio";
import Timer from "src/components/LiveCall/Timer";

interface Props {
  isVisible: boolean;
  width: number | string;
  height: number | string;
  callId: string;
  participantNames: { inmates: string; contacts: string };
  alerts: CallAlert[];
  muteCall: (id: string) => void;
  unmuteCall: (id: string) => void;
  isAudioOn: boolean;
  openChat: (id: string) => void;
  closeChat: (id: string) => void;
  chatCollapsed: boolean;
  lockCall: (id: string) => void;
  rc: RoomClient;
  remoteVideos: Record<string, MediaStream>;
  remoteAudios: Record<string, MediaStream>;
  scheduledEnd: ISOString;
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
    alerts,
    lockCall,
    muteCall,
    unmuteCall,
    isAudioOn,
    openChat,
    closeChat,
    chatCollapsed,
    participantNames,
    rc,
    remoteVideos,
    remoteAudios,
    scheduledEnd,
  }) => {
    const [inmateAudioPaused, setInmateAudioPaused] = useState(false);
    const [inmateVideoPaused, setInmateVideoPaused] = useState(false);
    // If we allow multiple contacts to join from different clients, we'll have to change this
    const [contactAudioPaused, setContactAudioPaused] = useState(false);
    const [contactVideoPaused, setContactVideoPaused] = useState(false);

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

    //  TODO: move this to the useLiveCalls hook as well
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
      >
        <Timer
          endTime={scheduledEnd}
          className="absolute right-4 top-4 bg-opacity-80"
        />
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
      </div>
    );
  }
);

export default VideoChat;
