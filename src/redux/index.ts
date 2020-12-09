import { combineReducers } from "redux";
import { visitationsReducer } from "src/redux/modules/visitation";
import { connectionsReducer } from "./modules/connection";
import { staffReducer } from "./modules/staff";
import { inmatesReducer } from "./modules/inmate";
import { sessionReducer } from "./modules/user";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

export const rootReducer = combineReducers({
  visitations: visitationsReducer,
  connections: connectionsReducer,
  staff: staffReducer,
  inmates: inmatesReducer,
  session: sessionReducer,
});

export const Store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof rootReducer>;