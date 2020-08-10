import { combineReducers } from "redux";
import { visitationsReducer } from "src/redux/modules/visitation";
import { connectionsReducer } from "./modules/connection";

export const rootReducer = combineReducers({
  visitations: visitationsReducer,
  connections: connectionsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
