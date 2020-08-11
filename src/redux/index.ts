import { combineReducers } from "redux";
import { visitationsReducer } from "src/redux/modules/visitation";
import { connectionsReducer } from "./modules/connection";
import { staffReducer } from "./modules/staff";
import { inmatesReducer } from "./modules/inmate";

export const rootReducer = combineReducers({
  visitations: visitationsReducer,
  connections: connectionsReducer,
  staff: staffReducer,
  inmates: inmatesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
