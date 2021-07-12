import { createContext } from "react";
import RoomClient from "src/pages/LiveCall/RoomClient";

export interface LiveCallsContextData {
  roomClients: Record<string, RoomClient>;
  // joinRoom: (callId: string, socket: SocketIOClient.Socket) => void;
}

export const liveCallsContextDefaultValue: LiveCallsContextData = {
  roomClients: {},
  // joinRoom: () => null,
};

export const LiveCallsContext = createContext<LiveCallsContextData>(
  liveCallsContextDefaultValue
);
