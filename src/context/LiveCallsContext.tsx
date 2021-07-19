import { createContext } from "react";
import RoomClient from "src/pages/LiveCall/RoomClient";
import { StreamId } from "src/typings/Common";

export interface LiveCallsContextData {
  roomClients: Record<string, RoomClient>;
  remoteVideos: Record<string, Record<StreamId, MediaStream>>;
  remoteAudios: Record<string, Record<StreamId, MediaStream>>;
}

export const liveCallsContextDefaultValue: LiveCallsContextData = {
  roomClients: {},
  remoteVideos: {},
  remoteAudios: {},
};

export const LiveCallsContext = createContext<LiveCallsContextData>(
  liveCallsContextDefaultValue
);
