import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  socket?: SocketIOClient.Socket;
}

const initialState: SocketState = {};

export const socketsSlice = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<SocketIOClient.Socket>) => ({
      ...state,
      socket: action.payload,
    }),
  },
});

export const socketsActions = socketsSlice.actions;
