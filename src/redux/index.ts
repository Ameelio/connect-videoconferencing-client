import { combineReducers } from "redux";
import { staffSlice } from "./modules/staff";
import { inmatesSlice } from "./modules/inmate";
import { sessionReducer } from "./modules/user";
import { connectionsSlice } from "./modules/connections";
import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { contactsSlice } from "./modules/contact";
import { callsSlice } from "./modules/call";
import { facilitiesSlice } from "./modules/facility";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory, History } from "history";
import { socketsSlice } from "./modules/socket";

export const history = createBrowserHistory();

export const createRootReducer = (history: History) =>
  combineReducers({
    staff: staffSlice.reducer,
    session: sessionReducer,
    inmates: inmatesSlice.reducer,
    contacts: contactsSlice.reducer,
    connections: connectionsSlice.reducer,
    calls: callsSlice.reducer,
    facilities: facilitiesSlice.reducer,
    router: connectRouter(history),
    sockets: socketsSlice.reducer,
  });

export const rootReducer = createRootReducer(history);

export const Store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(routerMiddleware(history)),
});

export type RootState = ReturnType<typeof rootReducer>;
