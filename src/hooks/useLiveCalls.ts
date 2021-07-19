import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LiveCallsContextData } from "src/context/LiveCallsContext";
import RoomClient from "src/pages/LiveCall/RoomClient";
import { RootState, useAppDispatch } from "src/redux";
import { Call, CallParticipant, InCallStatus } from "src/typings/Call";
import { getParticipantStreamId, getVideoHandlerHostname } from "src/utils";
import { useCallsWithStatus } from "./useCalls";
import io from "socket.io-client";
import { StreamId } from "src/typings/Common";
import { callsActions } from "src/redux/modules/call";

type CallId = string;

export function useLiveCalls(): LiveCallsContextData {
  // TODO: this was helpful when there were multiple calls in a roomm
  // might want to remove this now that it's not the case
  const [socketMap, setSocketMap] = useState<
    Record<string, SocketIOClient.Socket>
  >({});

  const [roomClients, setRoomClients] = useState<Record<string, RoomClient>>(
    {}
  );

  const [remoteVideos, setRemoteVideos] = useState<
    Record<CallId, Record<StreamId, MediaStream>>
  >({});

  const [remoteAudios, setRemoteAudios] = useState<
    Record<CallId, Record<StreamId, MediaStream>>
  >({});

  const dispatch = useAppDispatch();

  const visitations = useCallsWithStatus("live");

  const authInfo = useSelector((state: RootState) => state.session.authInfo);

  const [freshCalls, setFreshCalls] = useState<Call[]>([]);

  //  check for new calls
  useEffect(() => {
    const newCalls = visitations.filter(
      (call) =>
        call.videoHandler &&
        !(getVideoHandlerHostname(call.videoHandler) in socketMap)
    );
    setFreshCalls(newCalls);
  }, [socketMap, visitations]);

  const initRc = useCallback(
    async (rc: RoomClient, callId: string) => {
      console.log(`[initRc] Initializing room client for ${callId}`);
      await rc.init();

      // consume events
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
          if (kind === "video") {
            setRemoteVideos((remotes) => ({
              ...remotes,
              [callId]: {
                ...remotes[callId],
                [getParticipantStreamId(participant, callId)]: stream,
              },
            }));
          } else if (kind === "audio") {
            setRemoteAudios((remotes) => ({
              ...remotes,
              [callId]: {
                ...remotes[callId],
                [getParticipantStreamId(participant, callId)]: stream,
              },
            }));
          }
        }
      );

      // disconnect event
      rc.socket.on(
        "participantDisconnect",
        async (participant: CallParticipant) => {
          console.log("[Disconnect] Participant disconnect", participant);
          setRemoteVideos((remotes) => {
            const { [callId]: streams, ...otherRemotes } = remotes;

            const {
              [getParticipantStreamId(participant, callId)]: _,
              ...otherStreams
            } = streams;

            return { ...otherRemotes, [callId]: otherStreams };
          });
          setRemoteAudios((remotes) => {
            const { [callId]: streams, ...otherRemotes } = remotes;

            const {
              [getParticipantStreamId(participant, callId)]: _,
              ...otherStreams
            } = streams;

            return { ...otherRemotes, [callId]: otherStreams };
          });
        }
      );

      // listening for text messages
      rc.socket.on("callStatus", async (status: InCallStatus) => {
        console.log("[VideoChat] Received status update", status);
        // TODO: check this works
        if (status === "terminated" || status === "ended") {
          rc.destroy();
        }
      });

      // listening to text messages
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
          dispatch(callsActions.addMessage({ id: callId, message }));
        }
      );
    },
    [dispatch]
  );

  const joinRoom = useCallback(
    async (callId: string, socket: SocketIOClient.Socket) => {
      if (!socket.connected) {
        console.log("Not connected, so waiting until connected.");
        window.Debug = socket;
        await new Promise((resolve) => socket.on("connect", resolve));
        console.log(`[VideoChat] Connected to call ${callId}`);
      }

      console.log(`[VideoChat] Authenticating call ${callId}`);
      await new Promise((resolve) => {
        socket.emit("authenticate", authInfo, resolve);
      });
      console.log(`[VideoChat] Authenticated for call ${callId}`);

      const rc = new RoomClient(socket, callId);
      await initRc(rc, callId);
      console.log(`[initRc] Done initializing room client for ${callId}`);

      setRoomClients((rcs) => ({ ...rcs, [callId]: rc }));
    },
    [authInfo, initRc]
  );

  // only establish new socket connections with fresh calls
  useEffect(() => {
    if (!freshCalls.length) return;

    const temp: Record<string, SocketIOClient.Socket> = {};

    for (const call of freshCalls) {
      if (!call.videoHandler) continue;
      const target = getVideoHandlerHostname(call.videoHandler);
      // initialize new sockets once
      if (target in temp) continue;

      const newSocketClient = io.connect(target, { transports: ["websocket"] });
      temp[target] = newSocketClient;
      joinRoom(call.id, newSocketClient);
    }
    console.log("[Fresh calls] New socket clients", temp);
    setSocketMap((curr) => ({ ...curr, ...temp }));
  }, [freshCalls, joinRoom]);

  useEffect(() => {
    const interval = setInterval(() => {
      for (const [callId, rc] of Object.entries(roomClients)) {
        rc.socket.emit("heartbeat", { callId });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [roomClients]);

  // useEffect(() => {
  //   return () => {
  //     for (const rc of Object.values(roomClients)) {
  //       console.log("[Cleanup] Destroying room clients");
  //       rc.destroy();
  //     }
  //   };
  // }, [roomClients]);

  return {
    roomClients,
    remoteVideos,
    remoteAudios,
  };
}
