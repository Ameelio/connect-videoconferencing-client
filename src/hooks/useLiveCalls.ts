import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LiveCallsContextData } from "src/context/LiveCallsContext";
import RoomClient from "src/pages/LiveCall/RoomClient";
import { RootState } from "src/redux";
import { Call } from "src/typings/Call";
import { getVideoHandlerHostname } from "src/utils";
import { useCallsWithStatus } from "./useCalls";
import io from "socket.io-client";

export function useLiveCalls(): LiveCallsContextData {
  const [socketMap, setSocketMap] = useState<
    Record<string, SocketIOClient.Socket>
  >({});

  const [roomClients, setRoomClients] = useState<Record<string, RoomClient>>(
    {}
  );

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

  const joinRoom = useCallback(
    async (callId: string, socket: SocketIOClient.Socket) => {
      if (!socket.connected) {
        console.log("Not connected, so waiting until connected.");
        window.Debug = socket;
        await new Promise((resolve) => socket.on("connect", resolve));
        console.log(`[VideoChat] Connected to call ${callId}`);
      }

      await new Promise((resolve) => {
        socket.emit("authenticate", authInfo, resolve);
      });

      const rc = new RoomClient(socket, callId);
      await rc.init();
      console.log(`[VideoChat] Authenticated for call ${callId}`);
      setRoomClients((rcs) => ({ ...rcs, [callId]: rc }));
    },
    [authInfo]
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
    console.log("[Index] New socket clients", temp);
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

  return {
    roomClients,
  };
}
