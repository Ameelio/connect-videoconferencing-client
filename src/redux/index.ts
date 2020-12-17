import { combineReducers } from "redux";
import { visitationsReducer } from "./modules/visitation";
import { connectionsReducer } from "./modules/connection_requests";
import { staffSlice } from "./modules/staff";
import { inmatesSlice } from "./modules/inmate";
import { sessionReducer } from "./modules/user";
import { connectionsSlice } from "./modules/connections";

import { createStore, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { contactsSlice } from "./modules/contact";
import { recordingsSlice } from "./modules/recording";

export const rootReducer = combineReducers({
  visitations: visitationsReducer,
  requests: connectionsReducer,
  staff: staffSlice.reducer,
  session: sessionReducer,
  inmates: inmatesSlice.reducer,
  contacts: contactsSlice.reducer,
  connections: connectionsSlice.reducer,
  recordings: recordingsSlice.reducer,
});

export const Store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;
