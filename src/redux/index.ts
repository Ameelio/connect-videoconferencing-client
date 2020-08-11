import { combineReducers } from "redux";
import { visitationsReducer } from "src/redux/modules/visitation";
import { connectionsReducer } from "./modules/connection";
import { staffReducer } from "./modules/staff";

export const rootReducer = combineReducers({
  visitations: visitationsReducer,
  connections: connectionsReducer,
  staff: staffReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
