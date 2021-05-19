import { combineReducers } from "redux";
import { staffSlice } from "./modules/staff";
import { inmatesSlice } from "./modules/inmate";
import { sessionReducer } from "./modules/session";
import { connectionsSlice } from "./modules/connections";
import { configureStore } from "@reduxjs/toolkit";
import { contactsSlice } from "./modules/contact";
import { callsSlice } from "./modules/call";
import { facilitiesSlice } from "./modules/facility";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory, History } from "history";
import { socketsSlice } from "./modules/socket";
import { groupsSlice } from "./modules/group";
import { kiosksSlice } from "./modules/kiosk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { modalsSlice } from "./modules/modal";

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
    groups: groupsSlice.reducer,
    kiosks: kiosksSlice.reducer,
    modals: modalsSlice.reducer,
  });

export const rootReducer = createRootReducer(history);

export const Store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(routerMiddleware(history)),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
