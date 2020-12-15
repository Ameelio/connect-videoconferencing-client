import { combineReducers } from "redux";
import { visitationsReducer } from "./modules/visitation";
import { connectionsReducer } from "./modules/connection_requests";
import { staffReducer } from "./modules/staff";
import { inmatesSlice, inmatesAdapter } from "./modules/inmate";
import { sessionReducer } from "./modules/user";
import { connectionsAdapter, connectionsSlice } from "./modules/connections";

import { createStore, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

export const rootReducer = combineReducers({
  visitations: visitationsReducer,
  requests: connectionsReducer,
  staff: staffReducer,
  inmates: inmatesSlice.reducer,
  session: sessionReducer,
  connections: connectionsSlice.reducer,
});

export const Store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;

export const {
  selectById: selectConnectionById,
  selectIds: selectConnectionsIds,
  selectEntities: selectConnectionEntities,
  selectAll: selectAllConnections,
  selectTotal: selectConnectionInmates,
} = connectionsAdapter.getSelectors<RootState>((state) => state.connections);

export const {
  selectById: selectInmateById,
  selectIds: selectInmatesIds,
  selectEntities: selectInmateEntities,
  selectAll: selectAllInmates,
  selectTotal: selectTotalInmates,
} = inmatesAdapter.getSelectors<RootState>((state) => state.inmates);
